(()=>{
  var GlobalStyles = null;
  var RoomActions = null;

  Dependency.autorun(()=> {
    GlobalStyles = Dependency.get('GlobalStyles');
    RoomActions = Dependency.get('RoomActions');
  });

  const {
    RaisedButton
  } = MUI;

  const Colors = MUI.Styles.Colors;

  const styles = {
    overlay: {
      color: Colors.fullWhite,
      height: '100%',
      left: 0,
      position: 'absolute',
      top: 0,
      width: '100%',
      zIndex: 2,
    },

    linkUrl: {
      backgroundColor: Colors.fullWhite,
      color: Colors.fullBlack,
      margin: '10px auto',
      overflow: 'hidden',
      padding: '10px',
      textOverflow: 'ellipsis',
    },

    invite: {
      margin: '0 0 20px 0',
      width: '100%',
    },

    inviteCell: {
      padding: '10px',
      width: '50%',
    },
  };

  FirstOverlayComponent = Radium(React.createClass({
    render(){
      return (
        <div style={[GlobalStyles.table, styles.overlay]}>
          <div style={[GlobalStyles.cell]}>
            <div style={[GlobalStyles.table, styles.invite]}>
              <div style={[GlobalStyles.cell, styles.inviteCell]} className='text-right'>You are the only one here.</div>
              <div style={[GlobalStyles.cell, styles.inviteCell]} className='text-left'>
                <RaisedButton label='Invite people' primary={true} onTouchTap={RoomActions.showInviteModal}></RaisedButton>
              </div>
            </div>
            <div>
              <div className='text-center'>Share the permanent link. Bookmark and come back anytime.</div>
              <div style={[GlobalStyles.table, GlobalStyles.inset, styles.linkUrl]}>{this.props.linkUrl}</div>
            </div>
          </div>
        </div>
      );
    }
  }));
})();
