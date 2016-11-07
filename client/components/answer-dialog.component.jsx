import Colors from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import GlobalStyles from '../styles/global.styles';
import LoadingDialogComponent from './loading-dialog.component';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Radium from 'radium';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import TextField from 'material-ui/TextField';

const styles = {
  css: {

  },
};

export class AnswerDialogComponent extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate =
      PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      loading: false
    };
  }

  answer() {
    // NotificationActions.accept();
    // this.setState({
    //   loading: true
    // });
  }

  reject() {
    // NotificationActions.reject();
  }

  render() {
    const actions = [
      <FlatButton
        label='Decline'
        secondary={true}
        onClick={this.reject}
      />,
      <FlatButton
        label='Answer'
        secondary={true}
        keyboardFocused={true}
        onClick={this.answer}
      />,
    ];
    return (
      <Dialog
        title={this.props.invitation &&
          `${this.props.invitation.from} is calling`}
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
  }
};

export default Radium(AnswerDialogComponent);
