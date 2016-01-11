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

let ding = new Audio('/audio/ding.mp3');

const {FontIcon, FloatingActionButton, IconButton} = MUI;
const Colors = MUI.Styles.Colors;

const styles = {
  css: {
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 1,
    ':hover': {},
  },

  mute: {
    // styles for local mute icon (user mutes a peer)
    css: {
      backgroundColor: 'transparent',
      'float': 'right',
      opacity: 0,
      position: 'absolute',
      right: '5px',
      top: '5px',
      transition: 'opacity 1s ease-in-out',
      zIndex: 3,
    },

    // styles for remote mute icon (peer mutes themself)
    remote: {
      css: {
        bottom: '5px',
        height: '40px',
        padding: 0,
        textShadow: '2px 2px rgba(0, 0, 0, 0.5)',
        top: 'initial',
        width: '40px',
      },
    },

    visible: {
      css: {
        opacity: 1,
      },
    },
  },

  shade: {
    css: {
      backgroundColor: Colors.fullBlack,
      height: '100%',
      opacity: 0,
      transition: 'opacity 1s ease-in-out',
      width: '100%',
      zIndex: 2,
    },

    hover: {
      css: {
        opacity: 0.7,
      },
    },
  },
};

let RTCActions = null;
let RTCStore = null;

Dependency.autorun(()=> {
  RTCStore    = Dependency.get('RTCStore');
  RTCActions  = Dependency.get('RTCActions');
});

VideoOverlayComponent = Radium(React.createClass({
  mixins: [ReactMeteorData],

  componentDidMount() {
    // play ding on entry -- this might get weird if you're the 4th person to enter
    // do you get 4 dings?
    if (this.props.id !== 'local') {
      ding.play();
    }
  },

  getInitialState: function() {
    return {
      shade: false,
      shadeTimer: null
    };
  },

  getMeteorData() {
    let options = {
      isAudioEnabled: (this.props.id === 'local') ?
        RTCStore.isLocalAudioEnabled.get() :
        RTCStore.isAudioEnabled[this.props.id].get(),
    };

    if (this.props.id !== 'local') {
      options.isRemoteEnabled = RTCStore.isRemoteEnabled[this.props.id].get();
    }
    return options;
  },

  setPrimaryStream() {
    this.toggleShade();
    RTCActions.setPrimaryStream(this.props.id);
  },

  toggleAudio() {
    (this.props.id === 'local') ?
      RTCActions.toggleLocalAudio() : RTCActions.toggleAudio(this.props.id);
  },

  toggleShade() {
    if (this.state.shade) {
      Meteor.clearTimeout(this.state.shadeTimer);
      this.setState({
        shade: false,
        shadeTimer: null
      });
    } else {
      let timeout = Meteor.setTimeout(()=> {
        this.setState({
          shade: false,
          shadeTimer: null
        });
      }, 5000);
      this.setState({
        shade: true,
        shadeTimer: timeout
      });
    }
  },

  render() {
    return (
      <div key='overlay'
        style={[styles.css]}>
        <div onTouchTap={this.setPrimaryStream} style={[
            styles.shade.css,
            (Radium.getState(this.state, 'overlay', ':hover') ||
              this.state.shade) &&
                styles.shade.hover.css]}>
        </div>
        <FloatingActionButton
          onTouchTap={this.toggleAudio}
          style={_.extend({},
            styles.mute.css,
            (Radium.getState(this.state, 'overlay', ':hover') ||
            !this.data.isAudioEnabled || this.state.shade) ?
              styles.mute.visible.css : {})
          }
          mini={true}
          primary={false}>
          <FontIcon
            className='material-icons'
            color={Colors.fullWhite}>mic_off
          </FontIcon>
        </FloatingActionButton>
        <IconButton style={_.extend({},
            styles.mute.css,
            styles.mute.remote.css,
            (this.data.isRemoteEnabled && !this.data.isRemoteEnabled.audio) ?
              styles.mute.visible.css : {})
          }
          mini={true}
          primary={false}>
          <FontIcon
            className='material-icons'
            color={Colors.fullWhite}>mic_off
          </FontIcon>
        </IconButton>
      </div>
    );
  },
}));
