(()=> {
  // Dependencies
  const {
    Dialog,
    FlatButton,
    RaisedButton,
    TextField,
  } = MUI;

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
  }

  let GlobalStyles = null;
  let FacebookActions = null;
  let FacebookStore = null;
  let RoomActions = null;
  let RoomStore = null;
  let UserStore = null;

  Dependency.autorun(()=> {
    GlobalStyles = Dependency.get('GlobalStyles');
    FacebookActions = Dependency.get('FacebookActions');
    FacebookStore = Dependency.get('FacebookStore');
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

    componentWillUpdate(){
      this.data.inviteModalVisible ? this.refs.dialog.show() : this.refs.dialog.dismiss();
    },

    getMeteorData() {
      return {
        inviteModalVisible: RoomStore.inviteModalVisible.get(),
      };
    },

    getFriends() {
      FacebookActions.getFriends();
    },

    loginWithFacebook() {
      UserActions.loginWithFacebook();
    },

    invite() {
      console.log(this.refs.dialog);
      console.log('inviting');
      this.getFriends();
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
          contentStyle={styles.css}
          modal={false}
          ref='dialog'
          onDismiss={this.cancel}>
          <div style={[styles.content.css]}>
            <div className='row' style={[styles.content.linkRow.css]}>
              <div style={[styles.content.linkRow.header.css]}>Share the permanent link. Bookmark and come back anytime.</div>
              <div style={[GlobalStyles.inset, styles.content.linkRow.url.css]}>
                {this.props.linkUrl}
              </div>
            </div>
            <div className='row' style={[styles.content.inviteRow.css]}>
              <div style={[styles.content.inviteRow.header.css]}>
                <div style={[GlobalStyles.inline, styles.content.inviteRow.header.label.css]}>Send invite as</div>
                <TextField
                  style={styles.content.inviteRow.header.inputName.css}
                  defaultValue={this.props.username}
                  floatingLabelText='Your name'/>
                {/*UserStore.isGuest() && <div style={[GlobalStyles.inline, styles.content.inviteRow.header.button.css]}>
                  <RaisedButton label='Login with Facebook' onClick={this.loginWithFacebook} primary={true}/>
                </div>*/}
              </div>
              <TypeaheadComponent />
              <textarea style={[GlobalStyles.inset, styles.content.inviteRow.textarea.css]} placeholder='Include a message?' rows={3}></textarea>
            </div>
          </div>
        </Dialog>
      );
    },
  }));
})();
