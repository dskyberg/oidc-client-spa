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
* AboutDialog.tsx
*/
import React from 'react';
import { observer } from 'mobx-react'
import appState from '../stores/AppState'


import { WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import { withStyles } from "@material-ui/styles";
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import Typography from '@material-ui/core/Typography'

import DialogTitle from '@material-ui/core/DialogTitle';

const VERSION = process.env.REACT_APP_VERSION

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

type AboutDialogProps = WithStyles;

class AboutDialog extends React.Component<AboutDialogProps> {

  onClose = () => {
    appState.setAboutOpen(false)
  }

  render() {
    const {classes} = this.props
    const open = appState.aboutOpen
    if(!open) {
      return null
    }

    return (
      <Dialog open={ open } onClose={ this.onClose } onClick={this.onClose}>
        <DialogTitle id="about-dialog-title" className={classes.dialogTitle}>About</DialogTitle>
        <DialogContent  id="about-dialog-recognition">
          <Typography variant="body1">
            { `Version ${VERSION}` }
          </Typography>
          <Typography variant="body1">This app was assembled by David Skyberg</Typography>
          <Typography variant="body1">It leverages openid-client-js</Typography>
        </DialogContent>
      </Dialog>
    )
  }
}
export default withStyles(styles)(observer(AboutDialog))
