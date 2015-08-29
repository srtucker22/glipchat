(()=> {

  const {
    RaisedButton
  } = MUI;

  const Colors = MUI.Styles.Colors;

  const styles = {
    css: {
      color: Colors.fullWhite,
      height: '100%',
      left: 0,
      position: 'absolute',
      top: 0,
      width: '100%',
      zIndex: 2,
    },

    invite: {
      css: {
        margin: '0 0 20px 0',
        width: '100%',
      },
      cell: {
        css: {
          padding: '10px',
          width: '50%',
        }
      },
    },

    linkUrl: {
      css: {
        backgroundColor: Colors.fullWhite,
        color: Colors.fullBlack,
        margin: '10px auto',
        overflow: 'hidden',
        padding: '10px',
        textOverflow: 'ellipsis',
      }
    }
  };

  let GlobalStyles = null;
  let RoomActions = null;
  let UserStore = null;

  Dependency.autorun(()=> {
    GlobalStyles = Dependency.get('GlobalStyles');
    RoomActions = Dependency.get('RoomActions');
    UserStore = Dependency.get('UserStore');
  });

  FirstOverlayComponent = Radium(React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
      return {
        user: UserStore.user(),
      };
    },

    render(){
      return (
        <div>
          {(this.props.room.connected.length === 1 && this.props.room.connected[0] === this.data.user._id) ? (
          <div style={[GlobalStyles.table, styles.css]}>
            <div style={[GlobalStyles.cell]}>
              <div style={[GlobalStyles.table, styles.invite.css]}>
                <div style={[GlobalStyles.cell, styles.invite.cell.css]} className='text-right'>You are the only one here.</div>
                <div style={[GlobalStyles.cell, styles.invite.cell.css]} className='text-left'>
                  <RaisedButton label='Invite people' primary={true} onTouchTap={RoomActions.showInviteModal}></RaisedButton>
                </div>
              </div>
              <div>
                <div className='text-center'>Share the permanent link. Bookmark and come back anytime.</div>
                <div style={[GlobalStyles.table, GlobalStyles.inset, styles.linkUrl.css]}>{this.props.linkUrl}</div>
              </div>
            </div>
          </div>) : ''}
        </div>
      );
    }
  }));
})();
