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
      <div>
        <HeaderComponent appName={this.props.appName}/>
        <div>
          <p>welcome to meteor react webrtc</p>
          <button onClick={this.createRoom}>start room</button>
        </div>
        <FooterComponent />
      </div>
    );
  },
});
