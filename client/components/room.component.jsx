(()=> {
  const { Dialog, FontIcon, FlatButton, FloatingActionButton, IconButton, Paper, RaisedButton } = MUI;
  const Colors = MUI.Styles.Colors;

  const styles = {
    css: {
      backgroundColor: Colors.grey800,
    },

    videos: {
      css: {
        bottom: 0,
        left: 0,
        padding: '0 5px',
        position: 'absolute',
        transition: 'all 1s ease-in-out',
        width: '100%',
      },

      video: {
        css: {
          'float': 'right',
          display: 'inline-block',
          maxHeight: '20%',
          maxWidth: '20%',
          margin: '5px',
          position: 'relative',
        },
      },
    },
  };

  let RoomActions = null;
  let RoomStore   = null;
  let RTCActions  = null;
  let RTCStore    = null;
  let UserStore   = null;

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

  RoomComponent = Radium(React.createClass({
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

    componentWillUnmount() {
      RTCActions.stopLocalStream();
    },

    getMeteorData() {
      return {
        localStreamError: RTCStore.localStreamError.get(),
        peers: RTCStore.peers.get(),
        primaryStream: RTCStore.primaryStream.get(),
        room: RoomStore.currentRoom.get(),
        stream: RTCStore.localStream.get(),
        streamError: RTCStore.streamError.get(),
        user: UserStore.user()
      };
    },

    render() {
      // log the errors for now
      if(this.data.localStreamError)
        console.error(this.data.localStreamError);
      if(this.data.streamError)
        console.error(this.data.streamError);

      var { ...other } = this.props;

      console.log(this.data.primaryStream);

      return (
        <div style={[styles.css]}>
          {!!this.data.localStreamError && <LocalStreamErrorComponent error={this.data.localStreamError} {...other}/>}

          <InviteComponent
            ref='invite'
            linkUrl={window.location.href}
            username={UserStore.isGuest() ? '' : UserStore.user().profile.name}
          />

          {!this.data.localStreamError && !!this.data.stream && <ControlsComponent />}

          {!this.data.localStreamError && !!this.data.stream && (this.data.room.connected.length === 1 && this.data.room.connected[0] === this.data.user._id) && <FirstOverlayComponent linkUrl={window.location.href} />}

          {!!this.data.primaryStream && <VideoComponent src={(this.data.primaryStream === 'local') ? this.data.stream : this.data.peers[this.data.primaryStream]} muted={(this.data.primaryStream === 'local')} flip={(this.data.primaryStream === 'local')} fullScreen={true}/>}

          {!!this.data.peers && _.keys(this.data.peers).length && <div style={[styles.videos.css]}>
            <div key='local' style={[styles.videos.video.css]}>
              <VideoOverlayComponent id='local'/>
              <VideoComponent src={this.data.stream} muted={true} flip={true}/>
            </div>
            {_.map(this.data.peers, (val, key)=>{
              return (
                <div key={key} style={[styles.videos.video.css]}>
                  <VideoOverlayComponent id={key}/>
                  <VideoComponent src={val}/>
                </div>
              );
            })}
          </div>}
        </div>
      );
    },
  }));
})();
