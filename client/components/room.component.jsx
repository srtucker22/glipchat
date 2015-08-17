// Dependencies
var { Colors } = MUI;

var RoomActions = null;
var RoomStore   = null;
var RTCActions  = null;
var RTCStore    = null;
var UserStore   = null;

Dependency.autorun(()=> {
  RoomActions = Dependency.get('RoomActions');
  RoomStore   = Dependency.get('RoomStore');
  RTCStore    = Dependency.get('RTCStore');
  RTCActions  = Dependency.get('RTCActions');
  UserStore   = Dependency.get('UserStore');
});

RoomComponent = React.createClass({
  mixins: [ReactMeteorData],

  statics: {
    // async transition requirements
    willTransitionTo: function(transition, params, query, callback) {
      UserStore.requireUser().then((user)=> {
        RoomActions.joinRoom(params.roomId);

        RoomStore.requireRoom(params.roomId).then((room)=> {
          this.room = room;
          if (!RTCStore.isDuplicateConnection()) {
            RTCActions.getLocalStream();
            RoomActions.joinRoomStream(params.roomId);
          }
          callback();
        })

        .catch((err)=> {
          console.error(err);
          transition.abort();
          callback();
        });
      })

      .catch((err)=> {
        console.error(err);
        transition.abort();
        callback();
      });
    },

    willTransitionFrom: function(transition, component) {
      RTCActions.disconnect();
      RoomActions.leaveRoom();
    },
  },

  componentWillUnmount() {
    RTCActions.stopLocalStream();
  },

  getMeteorData() {
    return {
      peers: RTCStore.peers.get(),
      localStreamError: RTCStore.localStreamError.get(),
      stream: RTCStore.localStream.get(),
      streamError: RTCStore.streamError.get(),
    };
  },

  render() {
    return (
      <div className='bg-grey-900'>
        {!!this.data.localStreamError && <div>{this.data.localStreamError.description}</div>}
        {!!this.data.streamError && <div>{this.data.streamError.description}</div>}
        {!!this.data.stream && <VideoComponent className='full-screen' src={this.data.stream} muted={true}/>}
        {_.map(this.data.peers, (val, key)=>{
          return (
            <VideoComponent key={key} src={val}/>
          );
        })}
      </div>
    );
  },
});
