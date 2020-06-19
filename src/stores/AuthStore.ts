/**
* Copyright (c) 2020 David Skyberg and Swankymutt.com
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*
* AuthStore.ts
*/

import { observable, action, computed } from "mobx"
import Oidc, { UserManager, User, OidcMetadata } from 'oidc-client';

Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.DEBUG;


type ClaimsParameter = {
   id_token?: {}|undefined;
   userinfo?: {}|undefined;
}

class AuthStore {
   metadata: OidcMetadata | null = null;
   @observable manager: UserManager;
   @observable user: User | null = null;
   @observable authority = "http://localhost:3082";
   @observable client_id = "test_app";
   @observable redirect_uri = "http://localhost:3000/login/response";
   @observable post_logout_redirect_uri = "http://localhost:3000/logout/response";
   @observable response_type = "code";
   @observable scopes = ["openid"];
   @observable loadUserInfo = true;
   @observable revokeAccessTokenOnSignout = true;
   @observable useClaimsParam = true;
   @observable claimsParameter:ClaimsParameter = {
      userinfo: {
         given_name: null,
         family_name: null,
         email: null
      },
      id_token: {
         given_name: null,
         family_name: null,
         email: null
      }
   }

   constructor() {
      this.manager = new UserManager(this.makeConfig());

   }

   // Create the client config.
   makeConfig(): any {
      const config = {
         authority: this.authority,
         client_id: this.client_id,
         redirect_uri: this.redirect_uri,
         post_logout_redirect_uri: this.post_logout_redirect_uri,
         response_type: this.response_type,
         scope: this.scopes.join(' '),
         loadUserInfo: true,
         revokeAccessTokenOnSignout: true
      };
      if(this.useClaimsParam === true) {
         Object.assign(config,{extraQueryParams: {claims: JSON.stringify(this.claimsParameter)}})
      }
      return config

   }

   /**
    * Get the OIDC Provider metadata from the '.well-known/openid-configuration' endpoint.
    */
   getMetadata = ():Promise<void|OidcMetadata> => {
      if(this.metadata !== null) {
         return Promise.resolve(this.metadata)
      }
      return this.manager.metadataService.getMetadata()
      .then(metadata => {
         this.metadata = metadata
         return metadata
      })
      .catch(err => {
         console.log('Error getting metadata:', err)
      })
   }

   @computed
   get isLoggedIn() {
      return this.user != null && this.user.access_token && !this.user.expired;
   }

   @action.bound
   login() {
      return this.manager.signinRedirect()
      .catch((error) => this.handleError(error));
   }

   @action.bound
   completeLogin(url?:string) {
      return this.manager.signinRedirectCallback(url)
      .then(user => {
            this.user = user;
            return user
      })
      .catch((error) => this.handleError(error));
   }

   @action.bound
   logout() {
      return this.manager.signoutRedirect()
         .catch((error) => this.handleError(error));
   }


   @action.bound
   completeLogout() {
      return this.manager.signoutRedirectCallback()
         .then(() => { this.manager.removeUser(); })
         .then(() => { this.user = null; })
         .catch((error) => this.handleError(error));
   }

   @action.bound
   handleError(error: any) {
      console.error("Problem with authentication endpoint: ", error);
   }
}
const authStore = new AuthStore();
export default authStore;