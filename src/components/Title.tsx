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
* Title.jsx
*/
import React from 'react';
import Typography from '@material-ui/core/Typography';

type TitleProps = {
  component?: any;
  variant?: any;
  color?: any;
  noWrap?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: any;
}

 const Title:React.FC<TitleProps> = ({component="h1", variant="h6", color="inherit", noWrap=true, children, className, onClick}) => {
  return (
    <Typography component={component} variant={variant} color={color} noWrap={noWrap} className={className} onClick={onClick}>
   {children}
  </Typography>
  );
}
export default Title
