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
import Browser from 'bowser';
import MUI from 'material-ui';
import Radium from 'radium';
import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const {
  AppBar,
  Dialog,
  FlatButton,
  IconButton,
  RaisedButton,
  Styles: {Colors},
  TextField,
} = MUI;

const styles = {
  css: {

  },

  mobile: {
    css: {
      background: Colors.fullWhite,
      height: '100%',
      left: 0,
      overflow: 'scroll',
      position: 'fixed',
      width: '100%',
      zIndex: 5
    }
  },

  content: {
    css: {
      minWidth: '360px',
    },

    inner: {
      css: {
        maxHeight: '360px',
        overflowX: 'hidden',
        overflowY: 'scroll',
      },
    },

    linkRow: {
      css: {
        margin: 0,
      },

      header: {
        css: {
          fontSize: '12px',
          fontWeight: 'bold',
          paddingBottom: '12px',
        },
      },

      url: {
        css: {
          overflow: 'hidden',
          padding: '10px',
          textOverflow: 'ellipsis',
        },
      }
    },

    inviteRow: {
      css: {
        margin: 0,
      },

      header: {
        css: {
          fontSize: '12px',
          fontWeight: 'bold',
          paddingTop: '20px',
        },

        label: {
          css: {
            paddingRight: '10px',
          }
        },

        inputName: {
          css: {
            display: 'inline-block',
            marginRight: '20px',
          },
        },

        button: {
          css: {
            bottom: '5px',
            margin: '10px 0 5px',
            position: 'relative',
          }
        }
      },

      textarea: {
        css: {
          border: 'none',
          marginBottom: '10px',
          padding: '10px',
          resize: 'none',
          width: '100%',

          ':focus': {
            outline: 'none',
          }
        }
      }
    }
  },
};

let GlobalStyles;
let RoomActions;
let RoomStore;
let UserActions;
let UserStore;

Dependency.autorun(()=> {
  GlobalStyles = Dependency.get('GlobalStyles');
  RoomActions = Dependency.get('RoomActions');
  RoomStore = Dependency.get('RoomStore');
  UserActions = Dependency.get('UserActions');
  UserStore = Dependency.get('UserStore');
});

export default InviteComponent = Radium(React.createClass({
  mixins: [ReactMeteorData],

  cancel() {
    RoomActions.hideInviteModal();
  },

  getInitialState() {
    return {
      open: false
    };
  },

  getMeteorData() {
    return {
      contacts: UserStore.contacts.get(),
      inviteModalVisible: RoomStore.inviteModalVisible.get(),
      invitees: RoomStore.invitees.get(),
      user: UserStore.user(),
    };
  },

  invite() {
    setTimeout(()=> {
      if (this.state.invitees && this.data.user.profile.name) {
        RoomActions.invite(this.state.invitees);
        RoomActions.hideInviteModal();
      } else if (!this.data.user || !this.data.user.profile.name) {
        this.setState({
          open: true
        });
      }
    }, 0);
  },

  updateProfileName(e) {
    UserActions.updateProfileName(e.target.value);
  },

  onTypeaheadChange(state) {
    this.setState({
      invitees: state.invitees
    });
  },

  render() {
    //Custom Actions
    let customActions = [
      <FlatButton
        key='cancel'
        label='Cancel'
        onTouchTap={this.cancel} />,
      <FlatButton
        key='invite'
        label='Invite'
        disabled={(!this.state.invitees || !this.state.invitees.length || !this.data.user || !this.data.user.profile.name)}
        primary={true}
        onTouchTap={this.invite} />
    ];

    let mobile = Browser.mobile || Browser.tablet;
    return (mobile ?
      <ReactCSSTransitionGroup transitionName='modal' transitionEnterTimeout={300} transitionLeaveTimeout={300}>
      {this.data.inviteModalVisible ?
      <div key='invite-modal' style={[styles.mobile.css]}>
        <Dialog
          title='Please enter your name'
          actions={customActions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <TextField
            value={this.data.user.profile.name}
            onChange={this.updateProfileName}
            errorText={!this.data.user.profile.name ? ' ' : null}
            floatingLabelText='Your name'/>
        </Dialog>
        <AppBar
          showMenuIconButton={false}
          title={'Invite Contacts'}
          iconElementRight={<IconButton
            iconClassName='material-icons'
            onTouchTap={this.cancel}>
            clear
          </IconButton>}
        />
        {!!this.data.contacts ? <TypeaheadContactComponent
          contacts={this.data.contacts}
          mobile={true}
          onChange={this.onTypeaheadChange}/> : ''}
        {this.state.invitees ? <div style={[GlobalStyles.table, {
            position: 'fixed',
            width: '100%',
            bottom: 0
          }]}>
          <div style={[GlobalStyles.cell, {width: '50%'}]}>
            <FlatButton
              backgroundColor={Colors.red500}
              key='cancel'
              label='Cancel'
              onTouchTap={this.cancel}
              style={{color: Colors.fullWhite, width: '100%'}}/>
          </div>
          <div style={[GlobalStyles.cell, {width: '50%'}]}>
            <FlatButton
              backgroundColor={Colors.cyan500}
              key='invite'
              label='Invite'
              onTouchTap={this.invite}
              style={{color: Colors.fullWhite, width: '100%'}}/>
          </div>
        </div> : ''}
      </div> : <div></div>}
    </ReactCSSTransitionGroup> :

      (<Dialog
        actions={customActions}
        contentStyle={styles.content.css}
        open={this.data.inviteModalVisible}
        onRequestClose={this.cancel}
        style={mobile ?
          styles.mobile.css : styles.css}>
        <div style={[styles.content.inner.css]}>
          <div className='row' style={[styles.content.linkRow.css]}>
            <div style={[styles.content.linkRow.header.css]}>
              Share the permanent link. Bookmark and come back anytime.
            </div>
            <div style={[GlobalStyles.inset, styles.content.linkRow.url.css]}>
              {this.props.linkUrl}
            </div>
          </div>
          <div className='row' style={[styles.content.inviteRow.css]}>
            <div style={[styles.content.inviteRow.header.css]}>
              <div style={[
                GlobalStyles.inline,
                styles.content.inviteRow.header.label.css
              ]}>
                Send invite as
              </div>
              <TextField
                style={styles.content.inviteRow.header.inputName.css}
                value={this.data.user.profile.name}
                onChange={this.updateProfileName}
                errorText={!this.data.user.profile.name ? ' ' : null}
                floatingLabelText='Your name'/>
            </div>
            <TypeaheadContactComponent contacts={this.data.contacts}
            onChange={this.onTypeaheadChange}/>
          </div>
        </div>
      </Dialog>)
    );
  },
}));
