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
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import {List, ListItem} from 'material-ui/List';
import * as config from '../../lib/config';
import Avatar from 'material-ui/Avatar';
import Colors from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import IntroComponent from './intro.component';
import Radium from 'radium';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import TextField from 'material-ui/TextField';

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

export class HomeMobileComponent extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      loading: false,
      open: false
    };
  }

  handleOpen() {
    setTimeout(()=> {
      this.setState({open: true});
    }, 0);
  }

  handleClose() {
    setTimeout(()=> {
      this.setState({open: false});
    }, 0);
  }

  invite() {
    setTimeout(()=> {
      if (this.state.invitees) {
        RoomActions.invite(this.state.invitees);
        this.setState({
          loading: true
        });
      }
    }, 0);
  }

  componentWillMount() {
    NotificationActions.getPermission();
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.currentRoom) {
      browserHistory.push('/room/' + this.props.currentRoom._id);
    }
  }

  loginWithGoogle() {
    UserActions.loginWithGoogle();
  }

  onTypeaheadChange(state) {
    this.setState({
      invitees: state.invitees
    });
  }

  openInviteModal() {
    this.setState({
      open: true
    });
  }

  updateProfileName(e) {
    UserActions.updateProfileName(e.target.value);
  }

  render() {
    const actions = [
      <FlatButton
        label='Cancel'
        secondary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label='Invite'
        disabled={!this.props.user || !this.props.user.profile.name}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.invite}
      />,
    ];
    return (
      (!!this.props.user) ?
      (<div style={[styles.css]}>
        {this.state.loading ?
          <LoadingDialogComponent open={true} title='Starting video call'/> : ''
        }
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
          {!!this.props.contacts ? <TypeaheadContactComponent
            contacts={this.props.contacts}
            mobile={true}
            onChange={this.onTypeaheadChange}/> : ''
          }
        </div>
        <Dialog
          title='Invite to Video Call?'
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          {UserStore.isGuest() ? <TextField
            value={this.props.user.profile.name}
            onChange={this.updateProfileName}
            errorText={!this.props.user.profile.name ? ' ' : null}
            floatingLabelText='Your name'/> : ''}
          {'Contacts who are already using ' + config.APP_NAME + ' will receive a notification. New users will be sent an email request.'}
        </Dialog>
        <AnswerDialogComponent
          invitation={this.props.invitations && this.props.invitations.length ?
            this.props.invitations[0] : undefined}/>
      </div>) : <IntroComponent/>
    );
  }
};

export default createContainer(({params}) => {
  return {
    contacts: UserStore.contacts.get(),
    currentRoom: RoomStore.currentRoom.get(),
    invitations: NotificationStore.invitations.get(),
    user: UserStore.user()
  };
}, Radium(HomeMobileComponent));
