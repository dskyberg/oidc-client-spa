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
* SettingsDialog.tsx
*/
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { observer } from 'mobx-react'
import appState from '../stores/AppState'
import authStore from '../stores/AuthStore'

import { WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import { withStyles } from "@material-ui/styles";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField'
import Switch from '@material-ui/core/Switch';
import CheckedSelect from './CheckedSelect'
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';

import JSONPretty from 'react-json-pretty'
import 'react-json-pretty/themes/monikai.css'


// Theme-dependent styles
const styles = ({ palette, spacing }: Theme) => createStyles({
  dialogTitle: {
    backgroundColor: palette.secondary.main,
  },
  dialogContent: {
    display: 'flex'
  },
  formControl: {
    margin: spacing(1)
  },
  selectFormControl: {
    margin: spacing(1),
    minWidth: 120
  }
});

type SettingsDialogProps = WithStyles & RouteComponentProps;

class SettingsDialog extends React.Component<SettingsDialogProps> {

  onClose = () => {
    appState.setSettingsOpen(false)
  }
  handleReset = () => {
    appState.reset()
    this.props.history.push('/')
  }

  render() {

    const {classes} = this.props
    const open = appState.settingsOpen
    if(!open) {
      return null
    }
    const metadata = authStore.metadata
    const userinfo_claims = authStore.claimsParameter.userinfo !== undefined ? Object.keys(authStore.claimsParameter.userinfo) : []
    const id_token_claims = authStore.claimsParameter.id_token !== undefined ? Object.keys(authStore.claimsParameter.id_token) : []

    return (
      <Dialog open={ open } onClose={ this.onClose } scroll="paper" style={{maxHeight:'100%'}}>
        <DialogTitle id="settings-dialog-title" className={classes.dialogTitle}>Settings</DialogTitle>

        <DialogContent dividers={ true } id="settings-dialog-recognition">
          <FormControl component="fieldset" className={ classes.formControl }>
            <FormLabel component="legend">OIDC Client Settings</FormLabel>
            <FormGroup>
              <FormControl className={ classes.formControl }>
                <TextField label="Authority" value={ authStore.authority }  id="authority"  />
              </FormControl>
              <FormControl className={ classes.formControl }>
                <TextField label="client_id" value={ authStore.client_id }  id="client_id"  />
              </FormControl>
              <FormControl className={ classes.formControl }>
                <TextField label="redirect_uri" value={ authStore.redirect_uri }  id="redirect_uri"  />
              </FormControl>
              <FormControl className={ classes.formControl }>
                <TextField label="post_logout_redirect_uri" value={ authStore.post_logout_redirect_uri }  id="post_logout_redirect_uri"  />
              </FormControl>
              <FormControlLabel label="Load userinfo" labelPlacement="start" control={ < Switch id="loadUserInfo" checked={ authStore.loadUserInfo }  value="loadUserInfo" inputProps={ { 'aria-label': 'loadUserInfo' } } /> } />
              <FormControlLabel label="Revoke access_token On Signout" labelPlacement="start" control={ < Switch id="revokeAccessTokenOnSignout" checked={ authStore.revokeAccessTokenOnSignout }  value="revokeAccessTokenOnSignout" inputProps={ { 'aria-label': 'revokeAccessTokenOnSignout' } } /> } />
              <FormControl className={classes.formControl}>
                <FormLabel component="legend">Response Type</FormLabel>
                <CheckedSelect
                  id="response_types"
                  value={[authStore.response_type]}
                  choices={metadata?.response_types_supported}
                  multiple={false}
                  classes={classes.selectFormControl}/>
              </FormControl>
              <FormControl>
                <FormLabel component="legend">Scopes</FormLabel>
                <CheckedSelect
                  id="scopes"
                  value={authStore.scopes}
                  choices={metadata?.scopes_supported}
                  classes={classes.selectFormControl}/>
              </FormControl>
            </FormGroup>
          </FormControl>
          <FormControlLabel label="Use Claims Parameter on Authorization Request" labelPlacement="start" control={ < Switch id="useClaimsParam" checked={ authStore.useClaimsParam }  value="useClaimsParam" inputProps={ { 'aria-label': 'useClaimsParam' } } /> } />
          <div className={ classes.dialogContent }>
            <FormControl className={ classes.formControl }>
              <FormLabel component="legend">ID Token claims</FormLabel>
              <CheckedSelect
                id="id-token-claims"
                value={id_token_claims}
                choices={metadata?.claims_supported}
                classes={classes.selectFormControl}/>
            </FormControl>
            <FormControl component="fieldset" className={ classes.formControl }>
              <FormLabel component="legend">Userinfo claims</FormLabel>
              <CheckedSelect
                id="userinfo-claims"
                value={userinfo_claims}
                choices={metadata?.claims_supported}
                classes={classes.selectFormControl}/>
            </FormControl>
          </div>
        </DialogContent>
        <DialogTitle id="settings-dialog-title">Server Metadata</DialogTitle>
        <DialogContent>
          <JSONPretty data={JSON.stringify(metadata, null, 3)} style={{height:200}}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={ this.onClose } color="primary">
            Done
          </Button>
          <Button onClick={ this.handleReset } color="primary">
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
export default withRouter(withStyles(styles)((observer(SettingsDialog))))
