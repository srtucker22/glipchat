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

AnswerDialogComponent = Radium(React.createClass({
  answer() {
    NotificationActions.accept();
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
      </Dialog>
    );
  },
}));
