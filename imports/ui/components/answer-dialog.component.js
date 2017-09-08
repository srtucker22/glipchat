import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import React from 'react';
import LoadingDialogComponent from './loading-dialog.component';

export class AnswerDialogComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
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
        label="Decline"
        secondary
        onClick={this.reject}
      />,
      <FlatButton
        label="Answer"
        secondary
        keyboardFocused
        onClick={this.answer}
      />,
    ];
    return (
      <Dialog
        title={this.props.invitation && `${this.props.invitation.from} is calling`}
        actions={actions}
        modal={false}
        open={!!this.props.invitation}
        onRequestClose={this.handleClose}
      >
        {this.state.loading ?
          <LoadingDialogComponent open title="Starting video call" /> : ''
      }
      </Dialog>
    );
  }
}

export default AnswerDialogComponent;
