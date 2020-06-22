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
* CheckedSelect.tsx
*/
import React from 'react'

import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';



type CheckedSelectProps = {
    id: string;
    label?: string;
    value: string[];
    choices: string[]|undefined;
    classes?: string;
    width?: number;
    multiple?: boolean;
}

const CheckedSelect:React.FC<CheckedSelectProps> = ({
    id,
    label,
    value,
    choices,
    classes,
    width=250,
    multiple=true
    }) =>
{

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: width,
        },
      },
    };
    const inputLabel = label !== undefined ?  <InputLabel id="demo-mutiple-name-label">{label}</InputLabel> : null
    const vChoices = choices !== undefined ? choices : []
    return (
        <FormControl id={id} className={classes}>
            {inputLabel}
            <Select
            label={label}
            labelId={`${id}-label`}
            id={`${id}-checkbox`}
            multiple={multiple}
            value={value}
            input={<Input />}
            renderValue={(selected) => (selected as string[]).join(', ')}
            MenuProps={MenuProps}
            >
            {vChoices.map((item) => (
                <MenuItem key={`${id}-${item}`} value={item}>
                <Checkbox checked={value.indexOf(item) > -1} />
                <ListItemText primary={item} />
                </MenuItem>
            ))}
            </Select>
        </FormControl>

    )
}
export default CheckedSelect;
