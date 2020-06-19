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
* ProfileDialog.tsx
*/
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { observer } from 'mobx-react'
import appState from '../stores/AppState'
import authStore from '../stores/AuthStore'


import { WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import { withStyles } from "@material-ui/styles";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'


// Theme-dependent styles
const styles = ({ spacing, palette }: Theme) => createStyles({
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
  },
  row: {
      display: 'flex',
  },
  left: {
      marginRight: 10,
      minWidth: 150,
  },
  right: {
      marginLeft: 10,
      minWidth: 150
  }
});

type ProfileDialogProps = WithStyles & RouteComponentProps;

class ProfileDialog extends React.Component<ProfileDialogProps> {

  onClose = () => {
    appState.setProfileOpen(false)
  }

  render() {
    const {classes} = this.props
    const open = appState.profileOpen
    if(!open) {
      return null
    }

    const renderRow = (left:string, right: string) => {
        return (
            <div id="row" className={classes.row}>
                <Typography variant="body1" className={classes.left}  align="right"><Box fontWeight={500}>{left}</Box></Typography>
                <Typography variant="body1" className={classes.right}>{right}</Typography>
            </div>

        )
    }

    const renderProfile = () => {
        const profile = authStore.user !== null ? authStore.user.profile : null
        if( profile === null) {
            return null
        }
        return (
            <div>
            {
                Object.keys(profile).map(p => renderRow( p, profile[p]))
            }
            </div>
        )
    }
    return (
      <Dialog open={ open } onClose={ this.onClose } scroll="paper" style={{maxHeight:'100%'}}>
        <DialogTitle id="settings-dialog-title"  className={classes.dialogTitle}>Settings</DialogTitle>
        <DialogContent>
            {renderProfile()}
        </DialogContent>
        <DialogActions>
          <Button onClick={ this.onClose } color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}
export default withRouter(withStyles(styles)((observer(ProfileDialog))))
