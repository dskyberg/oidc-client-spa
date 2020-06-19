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
* App.tsx
*/
import React from 'react';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import { RouteComponentProps } from 'react-router-dom';

import { WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import { withStyles } from "@material-ui/styles";

import Home from "./Home"
import SignIn from './SignIn'
import SignOut from './SignOut'
import SettingsDialog from './SettingsDialog'
import AboutDialog from './AboutDialog'
import ProfileDialog from './ProfileDialog'
import AppHeader from './AppHeader';

import Background from '../assets/city.png';
import getViewportSize from '../util/getViewportSize'



// Theme-dependent styles
const styles = ({ palette, spacing }: Theme) => createStyles({
  App: {
    height: '100%',
  }});

interface AppState {
  height:number;
}

class App extends React.Component<WithStyles & RouteComponentProps, AppState> {

  state:AppState = {
    height:getViewportSize(window).height
  }

  // Add a resize listener.  This might only be a problem with the
  // Chrome developer tools window, but at least it fixes that.
  componentDidMount() {
    window.addEventListener('resize', this.handleResize)
  }
  handleResize =() => {
    const height = getViewportSize(window).height
    this.setState({height: height})
  }

  render(){
    const height = getViewportSize(window).height
  return (
    <div className="App" style={{backgroundImage: `url(${Background})`, opacity:'0.8', height:height}}>
      <AppHeader />

      <Route exact path="/" component={Home} />
      <Route exact path='/login/response' component={SignIn} />
      <Route exact path='/logout/response' component={SignOut} />
      <SettingsDialog />
      <AboutDialog />
      <ProfileDialog />
    </div>
  );
    }
};

export default withStyles(styles)(withRouter(App));