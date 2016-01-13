/**
 * quasar
 *
 * Copyright (c) 2015 Glipcode http://glipcode.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions
 * of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

const {
  Dialog,
  FontIcon,
  FlatButton,
  FloatingActionButton,
  IconButton,
  Paper,
  RaisedButton
} = MUI;
const Colors = MUI.Styles.Colors;

const styles = {
  css: {
    backgroundColor: Colors.grey800,
    height: '100%',
  },

  videos: {
    css: {
      background: 'transparent',
      bottom: 0,
      left: 0,
      padding: '0 5px',
      position: 'absolute',
      transition: 'all 1s ease-in-out',
      width: '100%',
    },

    video: {
      css: {
        float: 'right',
        display: 'inline-block',
        maxHeight: '20%',
        maxWidth: '20%',
        margin: '5px',
        position: 'relative',
        bottom: '5px',
        zIndex: 2,
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
  {text: 'Cancel'},
  {text: 'Submit', onTouchTap: this._onDialogSubmit, ref: 'submit'},
];

RoomComponent = Radium(React.createClass({
  mixins: [ReactMeteorData],

  componentWillUnmount() {
    RTCActions.disconnect();
    RTCActions.stopLocalStream();
    RoomActions.leaveRoom();
  },

  getMeteorData() {
    return {
      localStreamError: RTCStore.localStreamError.get(),
      peers: RTCStore.peers.get(),
      primaryStream: RTCStore.primaryStream.get(),
      room: RoomStore.currentRoom.get(),
      stream: RTCStore.localStream.get(),
      streamError: RTCStore.streamError.get(),
    };
  },

  toggleControls() {
    if (RoomStore.controlsVisible.get()) {
      RoomActions.hideControls();
    }else {
      RoomActions.showControls();
    }
  },

  render() {

    // log the errors for now
    if (this.data.localStreamError) {
      console.error(this.data.localStreamError);
    }
    if (this.data.streamError) {
      console.error(this.data.streamError);
    }

    var {...other} = this.props;

    return (
      <div style={[styles.css]}>
        {!!this.data.localStreamError ?
          (<LocalStreamErrorComponent
            error={this.data.localStreamError} {...other}/>) : ''}

        <InviteComponent ref='invite' linkUrl={window.location.href} />

        {(!this.data.localStreamError && !!this.data.stream) ?
          (<ReadyPromptComponent
            onTouchTap={this.toggleControls}
            room={this.data.room}/>) : ''}

        {(!this.data.localStreamError && !!this.data.stream) ?
          <ControlsComponent onTouchTap={this.toggleControls}/> : ''}

        {(!this.data.localStreamError && !!this.data.stream) ?
          (<FirstOverlayComponent
            linkUrl={window.location.href}
            room={this.data.room} onTouchTap={this.toggleControls}/>) : ''}

        {!!this.data.primaryStream ?
          (<VideoComponent
            src={
              (this.data.primaryStream === 'local') ?
              this.data.stream : this.data.peers[this.data.primaryStream]
            }
            flip={(this.data.primaryStream === 'local')}
            fullScreen={true}
            muted={(this.data.primaryStream === 'local')}
            onTouchTap={this.toggleControls}/>
          ) : ''
        }

        {(!!this.data.peers && _.keys(this.data.peers).length) ?
          (<div style={[styles.videos.css]}>
            <div key='local' style={[styles.videos.video.css]}>
              <VideoOverlayComponent id='local'/>
              <VideoComponent src={this.data.stream} muted={true} flip={true}/>
            </div>
            {_.map(this.data.peers, (val, key)=> {
              return (
                <div key={key} style={[styles.videos.video.css]}>
                  <VideoOverlayComponent id={key}/>
                  <VideoComponent src={val}/>
                </div>
              );
            })}
          </div>) : ''}
      </div>
    );
  },
}));
