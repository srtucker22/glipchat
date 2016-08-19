/**
 * quasar
 *
 * Copyright (c) 2015 Glipcode http://glipcode.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions
 * of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

// Dependencies
import CircularProgress from 'material-ui/CircularProgress';
import Colors from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog';
import Radium from 'radium';
import React from 'react';

const styles = {
  body: {
    css: {
      background: Colors.grey900,
    }
  },

  content: {
    css: {
      color: Colors.fullWhite,
      background: 'none',
      borderRadius: '10px',
      maxWidth: '300px',
      textAlign: 'center',
      textTransform: 'uppercase'
    },
  }
};

const LoadingDialogComponent = (props)=> {
  return (
    <div className='LoadingDialog'>
      <Dialog
        onRequestClose={props.onTouchTap}
        bodyStyle={styles.body.css}
        contentStyle={styles.content.css}
        open={props.open}
        style={props.style}>
        <h4 style={styles.content.css}>{props.title}</h4>
        <CircularProgress mode='indeterminate'/>
      </Dialog>
    </div>
  );
};

LoadingDialogComponent.propTypes = {
  onTouchTap: React.PropTypes.func,
  open: React.PropTypes.bool,
  style: React.PropTypes.object,
  title: React.PropTypes.string,
};

export default Radium(LoadingDialogComponent);
