var { Dialog, FontIcon, FlatButton, IconButton, Paper, RaisedButton } = MUI;
var Colors = MUI.Styles.Colors;

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

//Standard Actions
let standardActions = [
  { text: 'Cancel' },
  { text: 'Submit', onTouchTap: this._onDialogSubmit, ref: 'submit' }
];

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
        }).catch((err)=> {
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

  componentDidMount() {

  },

  componentWillUnmount() {
    RTCActions.stopLocalStream();
  },

  getMeteorData() {
    return {
      peers: RTCStore.peers.get(),
      localStreamError: RTCStore.localStreamError.get(),
      room: RoomStore.currentRoom.get(),
      stream: RTCStore.localStream.get(),
      streamError: RTCStore.streamError.get(),
    };
  },

  render() {
    // log the errors for now
    if(this.data.localStreamError)
      console.error(this.data.localStreamError);
    if(this.data.streamError)
      console.error(this.data.streamError);

    var { ...other } = this.props;

    return (
      <div className='bg-grey-800'>
        {!!this.data.localStreamError && <LocalStreamErrorComponent error={this.data.localStreamError} {...other}/>}

        <InviteComponent
          ref='invite'
          linkUrl={window.location.href}
          username={UserStore.isGuest() ? '' : UserStore.user().profile.name}
        />

        {!this.data.localStreamError && !!this.data.stream && <ControlsComponent />}

        {!this.data.localStreamError && !!this.data.stream && (!this.data.peers || !_.keys(this.data.peers).length) && <FirstOverlayComponent linkUrl={window.location.href} />}

        {!this.data.localStreamError && !!this.data.stream && <VideoComponent className='full-screen' src={this.data.stream} muted={true}/>}
        {_.map(this.data.peers, (val, key)=>{
          return (
            <VideoComponent className='small-screen' key={key} src={val}/>
          );
        })}
      </div>
    );
  },
});
