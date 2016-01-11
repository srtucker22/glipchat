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
const {
  Dialog,
  FlatButton,
  RaisedButton,
  TextField,
} = MUI;

const Colors = MUI.Styles.Colors;

const styles = {
  css: {
    minWidth: '360px',
  },

  content: {
    css: {
      maxHeight: '360px',
      overflowX: 'hidden',
      overflowY: 'scroll',
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

let GlobalStyles = null;
let RoomActions = null;
let RoomStore = null;
let UserActions = null;
let UserStore = null;

Dependency.autorun(()=> {
  GlobalStyles = Dependency.get('GlobalStyles');
  RoomActions = Dependency.get('RoomActions');
  RoomStore = Dependency.get('RoomStore');
  UserActions = Dependency.get('UserActions');
  UserStore = Dependency.get('UserStore');
});

InviteComponent = Radium(React.createClass({
  mixins: [ReactMeteorData],

  cancel() {
    RoomActions.hideInviteModal();
  },

  getMeteorData() {
    return {
      inviteModalVisible: RoomStore.inviteModalVisible.get(),
      invitees: RoomStore.invitees.get(),
      user: UserStore.user(),
    };
  },

  invite() {
    // let message = this.refs.message.getDOMNode().value;

    if (this.data.invitees && this.data.user.profile.name) {
      RoomActions.invite(this.data.invitees);
      RoomActions.hideInviteModal();
    }
  },

  loginWithFacebook() {
    UserActions.loginWithFacebook();
  },

  updateProfileName(e) {
    UserActions.updateProfileName(e.target.value);
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
        disabled={(!this.data.invitees || !this.data.invitees.length)}
        primary={true}
        onTouchTap={this.invite} />
    ];

    return (
      <Dialog
        actions={customActions}
        actionFocus='submit'
        contentStyle={styles.css}
        open={this.data.inviteModalVisible}
        onRequestClose={this.cancel}>
        <div style={[styles.content.css]}>
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
              {/*UserStore.isGuest() && <div style={[GlobalStyles.inline, styles.content.inviteRow.header.button.css]}>
                <RaisedButton label='Login with Facebook' onClick={this.loginWithFacebook} primary={true}/>
              </div>*/}
            </div>
            <TypeaheadComponent ref='typeahead'/>
            {/*<textarea ref='message' style={[GlobalStyles.inset, styles.content.inviteRow.textarea.css]} placeholder='Include a message?' rows={3}></textarea>*/}
          </div>
        </div>
      </Dialog>
    );
  },
}));
