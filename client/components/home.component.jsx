// Dependencies
var RoomStore   = null;
var RoomActions = null;
var {
  Navigation
} = Router;

Dependency.autorun(()=> {
  RoomStore   = Dependency.get('RoomStore');
  RoomActions = Dependency.get('RoomActions');
});

HomeComponent = React.createClass({
  mixins: [ReactMeteorData, Navigation],

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
              <div className='center table btn btn-primary btn-raised' onClick={this.createRoom}>
                <div className='cell'><i className='mdi-av-videocam'></i></div>
                <div className='cell'> Start video call</div>
              </div>
            </div>
          </div>
        </div>
        <FooterComponent />
      </div>
    );
  },
});
