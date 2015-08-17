// Dependencies
var RoomStore   = null;
var RoomActions = null;
var { Navigation } = Router;
var { FontIcon, RaisedButton } = MUI;
var ThemeManager = new MUI.Styles.ThemeManager();

Dependency.autorun(()=> {
  RoomStore   = Dependency.get('RoomStore');
  RoomActions = Dependency.get('RoomActions');
});

HomeComponent = React.createClass({
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
    var { ...other } = this.props;

    return (
      <div id='wrapper'>
        <div id='page-home'>
          <HeaderComponent appName={this.props.appName}/>
          <div className='row'>
            <div className='col-xs-12 text-center'>
              <h1>Welcome to {this.props.appName}</h1>
              <br />
              <RaisedButton onClick={this.createRoom} label='Start video call' primary={true}/>
            </div>
          </div>
        </div>
        <FooterComponent />
      </div>
    );
  },
});
