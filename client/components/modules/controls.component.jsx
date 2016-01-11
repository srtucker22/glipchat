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

const {History} = ReactRouter;
const {
  FontIcon,
  FlatButton,
  IconButton,
  Paper
} = MUI;
const Colors = MUI.Styles.Colors;

const styles = {
  css: {
    position: 'absolute',
    height: '100px',
    width: '100%',
    zIndex: 4,
    ':hover': {},
  },

  controls: {
    css: {
      backgroundColor: Colors.fullBlack,
      margin: '50px auto',
      opacity: 0,
      overflow: 'hidden',
    },

    button: {
      css: {
        ':hover': {
          backgroundColor: Colors.grey900,
        },
      }
    },

    red: {
      css: {
        backgroundColor: Colors.red800,
        ':hover': {
          backgroundColor: Colors.red900,
        },
      }
    },

    visible: {
      opacity: 1,
    },

    buttonEnd: {
      css: {
        ':hover': {
          backgroundColor: Colors.red800,
        },
      },
    },
  },
};

let GlobalStyles;
let RoomActions;
let RoomStore;
let RTCActions;
let RTCStore;

Dependency.autorun(()=> {
  GlobalStyles = Dependency.get('GlobalStyles');
  RoomActions = Dependency.get('RoomActions');
  RoomStore = Dependency.get('RoomStore');
  RTCActions = Dependency.get('RTCActions');
  RTCStore = Dependency.get('RTCStore');
});

ControlsComponent = Radium(React.createClass({
  mixins: [ReactMeteorData, History],

  getInitialState: function() {
    return {visible: false};
  },

  getMeteorData() {
    return {
      controlsVisible: RoomStore.controlsVisible.get(),
      isLocalAudioEnabled: RTCStore.isLocalAudioEnabled.get(),
      isLocalVideoEnabled: RTCStore.isLocalVideoEnabled.get(),
    };
  },

  leave() {
    this.history.pushState(null, '/');
  },

  toggleLocalAudio() {
    RTCActions.toggleLocalAudio();
  },

  toggleLocalVideo() {
    RTCActions.toggleLocalVideo();
  },

  render() {
    return (
      <div
        key='overlay'
        style={[styles.css]}
        onTouchTap={this.props.onTouchTap}>
        <Paper zDepth={1} style={_.extend({},
          GlobalStyles.table,
          styles.controls.css,
          (Radium.getState(this.state, 'overlay', ':hover') ||
            this.data.controlsVisible) ? styles.controls.visible : {}
        )}>
          <div key='invite'
            onTouchTap={RoomActions.showInviteModal}
            style={[GlobalStyles.cell, styles.controls.button.css]}>
            <IconButton>
              <FontIcon className='material-icons'
                color={Colors.fullWhite}>person_add</FontIcon>
            </IconButton>
          </div>
          <div key='video' onTouchTap={this.toggleLocalVideo} style={[
            GlobalStyles.cell,
            styles.controls.button.css,
            !this.data.isLocalVideoEnabled && styles.controls.red.css
          ]}>
            <IconButton>
              <FontIcon
                className='material-icons'
                color={Colors.fullWhite}>videocam_off</FontIcon>
            </IconButton>
          </div>
          <div key='audio' onTouchTap={this.toggleLocalAudio} style={[
            GlobalStyles.cell,
            styles.controls.button.css,
            !this.data.isLocalAudioEnabled && styles.controls.red.css
          ]}>
            <IconButton>
              <FontIcon
                className='material-icons'
                color={Colors.fullWhite}>mic_off</FontIcon>
            </IconButton>
          </div>
          {/*<div key='settings' style={[GlobalStyles.cell, styles.controls.button.css]}>
            <IconButton>
              <FontIcon className='material-icons' color={Colors.fullWhite}>settings</FontIcon>
            </IconButton>
          </div>*/}
          <div
            key='end'
            style={[
              GlobalStyles.cell,
              styles.controls.button.css,
              styles.controls.buttonEnd.css
            ]}
            onTouchTap={this.leave}>
            <IconButton>
              <FontIcon
                className='material-icons'
                color={Radium.getState(this.state, 'end', ':hover') ?
                  Colors.fullWhite : Colors.red800}>call_end</FontIcon>
            </IconButton>
          </div>
        </Paper>
      </div>
    );
  }
}));
