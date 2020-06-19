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
* SignOut.tsx
*/
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {observer} from 'mobx-react'
import queryString from 'query-string';

import { WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import { withStyles } from "@material-ui/styles";

import authStore from '../stores/AuthStore'
import appState from "../stores/AppState";

// Theme-dependent styles
const styles = ({ palette, spacing }: Theme) => createStyles({
    root: {
        marginTop: 70,
        display: 'flex',
        justifyContent: 'center',
    }
});


type SignOutProps = WithStyles & RouteComponentProps;
/**
 * This page is registered with the OP as the redirect_uri endpoint
 * Once the user complete the IDP signin process, the OP will redirect the user
 * back to this endpoing with either an authorization code, or an error message
 */
@observer
class SignOut extends React.Component<SignOutProps> {

    /**
     * All we have to do on this page is capture the url parameters, so they
     * can be handed to the OIDC client manager
     */
    componentDidMount() {
        this.props.history.push('/')
    }

    render() {
        const {classes, location} = this.props
        return (
            <div className={classes.root} >
               {location.hash}
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(SignOut));