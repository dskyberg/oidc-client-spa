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
* Home.tsx
*/
/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {  WithStyles, createStyles, Theme } from '@material-ui/core/styles';
import getViewportSize from '../util/getViewportSize'
import { withStyles } from "@material-ui/styles";
import CodeStepper from './CodeStepper'

// Theme-dependent styles
const styles = ({ palette, spacing }: Theme) => createStyles({
    root: {
        marginTop: 60,
        height: getViewportSize(window).height,
        display: 'flex',
        justifyContent: 'center',
    },
    card: {
        marginTop: 60,
        maxWidth: 450,
        maxHeight: 200,
    },
    content: {
        flex: '1 0 auto',
    },
    button: {
        margin: spacing(1),

    },
  });



class Home extends React.Component<WithStyles & RouteComponentProps> {

    render() {
        const {classes} = this.props
        return (
            <div className={classes.root}>
                <CodeStepper />
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(Home));