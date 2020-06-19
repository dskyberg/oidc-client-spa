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
* AppHeader.tsx
*/
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom';

import {observer} from 'mobx-react'
import authStore from '../stores/AuthStore'
import appState from '../stores/AppState'

import {  WithStyles, createStyles, Theme } from '@material-ui/core/styles'
import { withStyles } from "@material-ui/styles"
import Title from './Title'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import SettingsIcon from '@material-ui/icons/Settings'
import LoginIcon from '@material-ui/icons/ExitToApp'
import LogoutIcon from '@material-ui/icons/Person'
import InfoIcon from '@material-ui/icons/Info'

const drawerWidth = 240;

// Theme-dependent styles
const styles = ({zIndex, transitions }: Theme) => createStyles({
    grow: {
        flexGrow: 1,
      },

    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    appBar: {
        zIndex: zIndex.drawer + 1,
        transition: transitions.create(['width', 'margin'], {
            easing: transitions.easing.sharp,
            duration: transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: transitions.create(['width', 'margin'], {
            easing: transitions.easing.sharp,
            duration: transitions.duration.enteringScreen,
        }),
    },
    logo: {
        maxWidth: 36,
        marginRight: 20,
      },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: 'none',
    },
    title: {
        flexGrow: 1,
    },
});

type AppHeaderProps = WithStyles & RouteComponentProps;
interface AppHeaderState {
    anchorEl: null | HTMLElement;
}

class AppHeader extends React.Component<AppHeaderProps, AppHeaderState> {
    state: Readonly<AppHeaderState> = {
        anchorEl: null
    }

    handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        this.setState({anchorEl: event.currentTarget})
    }

    handleMenuClose = () => {
        this.setState({anchorEl:null})
    };

    handleMenuProfile = () => {
        this.setState({anchorEl: null})
        appState.setProfileOpen(true)
    }

    handleMenuLogout = () => {
        this.setState({anchorEl:null})
        authStore.logout()
    }
    onLoginClicked = () => {
        authStore.login()
    }

    onSettingsClicked = () => {
        appState.setSettingsOpen(true)
    }
    onTitleClicked = () => {
        this.props.history.push('/')
    }
    onAboutClicked = () => {
        appState.setAboutOpen(true);
    }

    render() {
        const {classes} = this.props;
        const {anchorEl} = this.state;

        const isLoggedIn = authStore.isLoggedIn;
        const modeTitle = isLoggedIn ?  "Log out from your Provider" : "Sign into your provider"
        const isMenuOpen = Boolean(anchorEl);
        const modeIcon = isLoggedIn ?  <LogoutIcon/> : <LoginIcon/>
        const modeHandler = isLoggedIn ? this.handleProfileMenuOpen: this.onLoginClicked

        const menuId = 'primary-search-account-menu';
        const renderMenu = (
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={this.handleMenuClose}
          >
            <MenuItem onClick={this.handleMenuProfile}>Profile</MenuItem>
            <MenuItem onClick={this.handleMenuLogout}>Logout</MenuItem>
          </Menu>
        );

        return (
        <div className={classes.grow}>
            <AppBar position="fixed" className={ classes.appBar }>
                <Toolbar className={ classes.toolbar }>
                    <Title className={classes.title} onClick={this.onTitleClicked}>
                        OIDC SPA Demo
                    </Title>
                    <Tooltip title={modeTitle} aria-label={modeTitle}>
                <IconButton color="inherit" onClick={modeHandler}>
                    {modeIcon}
                </IconButton>
                </Tooltip>
                <IconButton color="inherit" onClick={this.onSettingsClicked} >
                    <SettingsIcon />
                </IconButton>
                <IconButton color="inherit" onClick={this.onAboutClicked} >
                    <InfoIcon />
                </IconButton>
                </Toolbar>
            </AppBar>
            {renderMenu}
        </div>
        )
    }
}
export default withRouter(withStyles(styles)(observer(AppHeader)))