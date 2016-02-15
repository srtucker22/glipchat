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
const {History} = ReactRouter;
const {
  Avatar,
  Dialog,
  FlatButton,
  FontIcon,
  IconButton,
  List,
  ListDivider,
  ListItem,
  RaisedButton,
  Styles: {Colors}
} = MUI;

const styles = {
  css: {

  },

  content: {
    css: {
      marginTop: '64px'
    }
  },

  icon: {
    css: {
      color: Colors.fullWhite,
    },
  },
};

let GlobalStyles;
let NotificationActions;
let NotificationStore;
let RoomStore;
let RoomActions;
let UserActions;
let UserStore;

Dependency.autorun(()=> {
  GlobalStyles = Dependency.get('GlobalStyles');
  NotificationActions = Dependency.get('NotificationActions');
  NotificationStore = Dependency.get('NotificationStore');
  RoomActions = Dependency.get('RoomActions');
  RoomStore = Dependency.get('RoomStore');
  UserActions = Dependency.get('UserActions');
  UserStore = Dependency.get('UserStore');
});

HomeMobileComponent = Radium(React.createClass({
  mixins: [ReactMeteorData, History],

  getMeteorData() {
    return {
      contacts: UserStore.contacts.get(),
      currentRoom: RoomStore.currentRoom.get(),
      invitations: NotificationStore.invitations.get(),
      user: UserStore.user()
    };
  },

  handleOpen() {
    this.setState({open: true});
  },

  handleClose() {
    this.setState({open: false});
  },

  invite() {
    if (this.state.invitees) {
      RoomActions.invite(this.state.invitees);
    }
  },

  componentWillMount() {
    NotificationActions.getPermission();
  },

  componentWillUpdate(nextProps, nextState) {
    if (this.data.currentRoom) {
      this.history.pushState(null, '/room/' + this.data.currentRoom._id);
    }
  },

  createRoom() {
    RoomActions.createRoom();
    this.setState({
      loading: true
    });
  },

  getInitialState() {
    return {
      loading: false,
      open: false
    };
  },

  onTypeaheadChange(state) {
    this.setState({
      invitees: state.invitees
    });
  },

  openInviteModal() {
    this.setState({
      open: true
    });
  },

  render() {
    const actions = [
      <FlatButton
        label='Cancel'
        secondary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label='Invite'
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.invite}
      />,
    ];
    return (
      !!this.data.user && this.data.user.profile.name ?
      (<div style={[styles.css]}>
        <HeaderComponent mobile={true}
        showMenuIconButton={true}
        iconElementRight={
          (!!this.state.invitees && this.state.invitees.length) ?
          (<IconButton
            iconStyle={styles.icon.css}
            iconClassName='material-icons'
            onTouchTap={this.openInviteModal}>
            done
          </IconButton>) : null}/>
        <div style={[styles.content.css]}>
          {!!this.data.contacts ? <TypeaheadContactComponent
            contacts={this.data.contacts}
            mobile={true}
            onChange={this.onTypeaheadChange}/> : ''}
        </div>
        <Dialog
          title='Invite to Video Call?'
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          Contacts who are already using quasar will receive a notification. New users will be sent an email request.
        </Dialog>
        <AnswerDialogComponent invitation={this.data.invitations && this.data.invitations.length ? this.data.invitations[0] : undefined}/>
      </div>) : <IntroComponent/>
    );
  },
}));
