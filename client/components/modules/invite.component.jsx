// Dependencies
var {
  Dialog,
  FlatButton,
  TextField
} = MUI;

var RoomActions = null;
var RoomStore = null;

Dependency.autorun(()=> {
  RoomActions = Dependency.get('RoomActions');
  RoomStore = Dependency.get('RoomStore');
});

InviteComponent = Radium(React.createClass({
  mixins: [ReactMeteorData],

  cancel() {
    RoomActions.hideInviteModal();
  },

  componentWillUpdate(){
    this.data.inviteModalVisible ? this.refs.dialog.show() : this.refs.dialog.dismiss();
  },

  getMeteorData() {
    return {
      inviteModalVisible: RoomStore.inviteModalVisible.get(),
    };
  },

  invite() {
    console.log(this.refs.dialog);
    console.log('inviting');
  },

  render() {
    //Custom Actions
    let customActions = [
      <FlatButton
        label='Cancel'
        onTouchTap={this.cancel} />,
      <FlatButton
        label='Invite'
        primary={true}
        onTouchTap={this.invite} />
    ];

    return (
      <Dialog
        actions={customActions}
        actionFocus='submit'
        contentStyle={{
          'minWidth': '360px'
        }}
        modal={false}
        ref='dialog'
        onDismiss={this.cancel}>
        <div className='invite-content'>
          <div className='row link-row'>
            <div className='link-header'>Share the permanent link. Bookmark and come back anytime.</div>
            <div className='link-url'>{this.props.linkUrl}</div>
          </div>
          <div className='row invite-row'>
            <div className='name-header'>
              Send invite as
              <TextField
                className='input-name'
                defaultValue={this.props.username}
                floatingLabelText='Your name'/>
            </div>
            <textarea placeholder='Include a message?' rows={3}></textarea>
            <TypeaheadComponent />
          </div>
        </div>
      </Dialog>
    );
  },
}));
