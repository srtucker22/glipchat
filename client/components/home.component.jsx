(()=> {
  // Dependencies
  let { Navigation } = Router;
  let { FontIcon, RaisedButton } = MUI;
  let ThemeManager = new MUI.Styles.ThemeManager();

  let GlobalStyles = null;
  let RoomStore = null;
  let RoomActions = null;

  Dependency.autorun(()=> {
    GlobalStyles = Dependency.get('GlobalStyles');
    RoomStore = Dependency.get('RoomStore');
    RoomActions = Dependency.get('RoomActions');
  });

  HomeComponent = Radium(React.createClass({
    mixins: [ReactMeteorData, Navigation],

    childContextTypes: {
      muiTheme: React.PropTypes.object
    },

    getChildContext() {
      return {
        muiTheme: ThemeManager.getCurrentTheme()
      };
    },

    getMeteorData() {
      return {
        currentRoom: RoomStore.currentRoom.get(),
      };
    },

    componentWillUpdate(nextProps, nextState) {
      if (this.data.currentRoom) {
        this.transitionTo('room', {roomId: this.data.currentRoom._id});
      }
    },

    createRoom() {
      RoomActions.createRoom();
    },

    render() {
      return (
        <div>
          <div style={[GlobalStyles.stickyFooterPage]}>
            <HeaderComponent appName={this.props.appName}/>
            <div className='row'>
              <div className='col-xs-12 text-center'>
                <h1>Welcome to {this.props.appName}</h1>
                <br />
                <RaisedButton onTouchTap={this.createRoom} label='Start video call' primary={true}/>
              </div>
            </div>
          </div>
          <FooterComponent />
        </div>
      );
    },
  }));
})();
