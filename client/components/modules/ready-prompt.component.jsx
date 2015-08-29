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
      zIndex: 3,
    },
  };

  let GlobalStyles = null;
  let RoomActions = null;
  let UserStore = null;

  Dependency.autorun(()=> {
    GlobalStyles = Dependency.get('GlobalStyles');
    RoomActions = Dependency.get('RoomActions');
    UserStore = Dependency.get('UserStore');
  });

  ReadyPromptComponent = Radium(React.createClass({
    mixins: [ReactMeteorData],

    componentDidMount() {
      // join room stream directly if alone in room
      if(!this.props.room.connected.length){
        RoomActions.joinRoomStream(this.props.room._id);
      };
    },

    getMeteorData() {
      return {
        user: UserStore.user(),
      };
    },

    joinRoomStream() {
      RoomActions.joinRoomStream(this.props.room._id);
    },

    render(){
      return (
        <div>
          {(this.props.room.connected.length && !_.contains(this.props.room.connected, this.data.user._id)) ? (
            <div style={[GlobalStyles.table, styles.css]}>
              <div className='text-center' style={[GlobalStyles.cell]}>
                <p>Are you ready to join?</p>
                <RaisedButton label='Join' primary={true} onTouchTap={this.joinRoomStream}></RaisedButton>
              </div>
            </div>
          ) : ''}
        </div>
      );
    }
  }));
})();
