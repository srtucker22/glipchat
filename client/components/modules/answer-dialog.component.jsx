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

import MUI from 'material-ui';
import LoadingDialogComponent from './loading-dialog.component.jsx';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Radium from 'radium';
import React from 'react';

const {
  Dialog,
  FlatButton,
  RaisedButton,
  Styles: {Colors},
  TextField,
} = MUI;

const styles = {
  css: {

  },
};

let GlobalStyles;
let NotificationActions;

Dependency.autorun(()=> {
  NotificationActions = Dependency.get('NotificationActions');
  GlobalStyles = Dependency.get('NotificationActions');
});

export default AnswerDialogComponent = Radium(React.createClass({
  mixins: [PureRenderMixin],

  answer() {
    NotificationActions.accept();
    this.setState({
      loading: true
    });
  },
  reject() {
    NotificationActions.reject();
  },
  render() {
    const actions = [
      <FlatButton
        label='Decline'
        secondary={true}
        onTouchTap={this.reject}
      />,
      <FlatButton
        label='Answer'
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.answer}
      />,
    ];
    return (
      <Dialog
        title={this.props.invitation && this.props.invitation.from + ' is calling'}
        actions={actions}
        modal={false}
        open={!!this.props.invitation}
        onRequestClose={this.handleClose}
      >
      {this.state.loading ?
        <LoadingDialogComponent open={true} title='Starting video call'/> : ''
      }
      </Dialog>
    );
  },
}));
