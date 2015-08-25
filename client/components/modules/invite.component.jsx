(()=> {
  // Dependencies
  const {
    Dialog,
    FlatButton,
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
          },

          inputName: {
            css: {
              paddingLeft: '10px',
            },
          },
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
  let RoomActions = null;
  let RoomStore = null;

  Dependency.autorun(()=> {
    GlobalStyles = Dependency.get('GlobalStyles');
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
                Send invite as
                <TextField
                  style={styles.content.inviteRow.header.inputName.css}
                  defaultValue={this.props.username}
                  floatingLabelText='Your name'/>
              </div>
              <textarea style={[GlobalStyles.inset, styles.content.inviteRow.textarea.css]} placeholder='Include a message?' rows={3}></textarea>
              <TypeaheadComponent />
            </div>
          </div>
        </Dialog>
      );
    },
  }));
})();
