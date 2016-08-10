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

import { browserHistory } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Colors from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import Radium from 'radium';
import React from 'react';
import GlobalStyles from '../../styles/global.styles';

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

let RoomActions;
let RoomStore;
let RTCActions;
let RTCStore;

Dependency.autorun(()=> {
  RoomActions = Dependency.get('RoomActions');
  RoomStore = Dependency.get('RoomStore');
  RTCActions = Dependency.get('RTCActions');
  RTCStore = Dependency.get('RTCStore');
});

export class ControlsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  leave() {
    setTimeout(()=> {
      browserHistory.push('/');
    }, 0);
  }

  showInviteModal() {
    setTimeout(()=> {
      RoomActions.showInviteModal();
    }, 0);
  }

  toggleLocalAudio() {
    RTCActions.toggleLocalAudio();
  }

  toggleLocalVideo() {
    RTCActions.toggleLocalVideo();
  }

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
            this.props.controlsVisible) ? styles.controls.visible : {}
        )}>
          <div key='invite'
            onTouchTap={this.showInviteModal.bind(this)}
            style={[GlobalStyles.cell, styles.controls.button.css]}>
            <IconButton>
              <FontIcon className='material-icons'
                color={Colors.fullWhite}>person_add</FontIcon>
            </IconButton>
          </div>
          <div key='video' onTouchTap={this.toggleLocalVideo.bind(this)} style={[
            GlobalStyles.cell,
            styles.controls.button.css,
            !this.props.isLocalVideoEnabled && styles.controls.red.css
          ]}>
            <IconButton>
              <FontIcon
                className='material-icons'
                color={Colors.fullWhite}>videocam_off</FontIcon>
            </IconButton>
          </div>
          <div key='audio' onTouchTap={this.toggleLocalAudio.bind(this)} style={[
            GlobalStyles.cell,
            styles.controls.button.css,
            !this.props.isLocalAudioEnabled && styles.controls.red.css
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
            onTouchTap={this.leave.bind(this)}>
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
};

export default createContainer(({params}) => {
  return {
    controlsVisible: RoomStore.controlsVisible.get(),
    isLocalAudioEnabled: RTCStore.isLocalAudioEnabled.get(),
    isLocalVideoEnabled: RTCStore.isLocalVideoEnabled.get(),
  };
}, Radium(ControlsComponent));
