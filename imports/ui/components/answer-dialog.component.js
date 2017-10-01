import Dialog from 'material-ui/Dialog';
import Button from 'material-ui/Button';
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
      <Button
        color="accent"
        onClick={this.reject}
      >
        {'Decline'}
      </Button>,
      <Button
        color="accent"
        keyboardFocused
        onClick={this.answer}
      >
        {'Answer'}
      </Button>,
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
