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
import { _ } from 'meteor/underscore';
import { browserHistory } from 'react-router';
import * as Actions from '../actions/actions';
import Colors from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import GlobalStyles from '../styles/global.styles';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import Radium from 'radium';
import React from 'react';

const styles = {
  css: {
    ':hover': {},
    height: '100px',
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 4,
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

  toggleLocalAudio() {
    this.props.dispatch(Actions.toggleLocalAudio());
  }

  toggleLocalVideo() {
    this.props.dispatch(Actions.toggleLocalVideo());
  }

  render() {
    return (
      <div
        key='overlay'
        style={[styles.css]}
        onClick={this.props.onTouchTap}>
        <Paper zDepth={1} style={_.extend({},
          GlobalStyles.table,
          styles.controls.css,
          (Radium.getState(this.state, 'overlay', ':hover') ||
            this.props.controlsVisible) ? styles.controls.visible : {}
        )}>
          <div key='invite'
            on={this.props.toggleInviteModal}
            style={[GlobalStyles.cell, styles.controls.button.css]}>
            <IconButton>
              <FontIcon className='material-icons'
                color={Colors.fullWhite}>person_add</FontIcon>
            </IconButton>
          </div>
          <div key='video' onClick={this.toggleLocalVideo.bind(this)} style={[
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
          <div key='audio' onClick={this.toggleLocalAudio.bind(this)} style={[
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
            onClick={this.leave.bind(this)}>
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
ControlsComponent.propTypes = {
  dispatch: React.PropTypes.func,
  controlsVisible: React.PropTypes.bool,
  isLocalAudioEnabled: React.PropTypes.bool,
  isLocalVideoEnabled: React.PropTypes.bool,
  onTouchTap: React.PropTypes.func,
  toggleInviteModal: React.PropTypes.func,
};

export default Radium(ControlsComponent);
