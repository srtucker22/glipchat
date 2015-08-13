// Dependencies
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
          RTCActions.getLocalStream();
          RoomActions.joinRoomStream(params.roomId);
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
      console.log('leaving');

      // if (component.formHasUnsavedData()) {
      //   if (!confirm('You have unsaved information,'+
      //                'are you sure you want to leave this page?')) {
      //     transition.abort();
      //   }
      // }
    },
  },

  componentWillUnmount() {
    RTCActions.stopLocalStream();
  },

  getMeteorData() {
    return {
      peers: RTCStore.peers.get(),
      stream: RTCStore.localStream.get(),
      streamError: RTCStore.localStreamError.get(),
    };
  },

  render() {
    return (
      <div>
        <div>
          I am room {RoomStore.currentRoomId.get()}
        </div>
        {!!this.data.streamError && <div>{this.data.streamError.description}</div>}
        {!!this.data.stream && <VideoComponent src={this.data.stream}/>}
        {_.map(this.data.peers, (val, key)=>{
          return (
            <VideoComponent key={key} src={val}/>
          );
        })}
      </div>
    );
  },
});
