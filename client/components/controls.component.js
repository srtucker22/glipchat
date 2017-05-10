import { _ } from 'meteor/underscore';
import { browserHistory } from 'react-router';
import Colors from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import Radium from 'radium';
import React from 'react';
import * as Actions from '../actions/actions';
import GlobalStyles from '../styles/global.styles';

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
      },
    },

    red: {
      css: {
        backgroundColor: Colors.red800,
        ':hover': {
          backgroundColor: Colors.red900,
        },
      },
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
      visible: false,
    };

    this.leave = this.leave.bind(this);
    this.toggleLocalAudio = this.toggleLocalAudio.bind(this);
    this.toggleLocalVideo = this.toggleLocalVideo.bind(this);
  }

  leave() {
    browserHistory.push('/');
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
        key="overlay"
        style={[styles.css]}
        onTouchTap={this.props.onTouchTap}
      >
        <Paper
          zDepth={1} style={_.extend({},
          GlobalStyles.table,
          styles.controls.css,
          (Radium.getState(this.state, 'overlay', ':hover') ||
            this.props.controlsVisible) ? styles.controls.visible : {},
        )}
        >
          <div
            key="invite"
            onTouchTap={this.props.toggleInviteModal}
            style={[GlobalStyles.cell, styles.controls.button.css]}
          >
            <IconButton>
              <FontIcon
                className="material-icons"
                color={Colors.fullWhite}
              >person_add</FontIcon>
            </IconButton>
          </div>
          <div
            key="video"
            onTouchTap={this.toggleLocalVideo} style={[
              GlobalStyles.cell,
              styles.controls.button.css,
              !this.props.isLocalVideoEnabled && styles.controls.red.css,
            ]}
          >
            <IconButton>
              <FontIcon
                className="material-icons"
                color={Colors.fullWhite}
              >videocam_off</FontIcon>
            </IconButton>
          </div>
          <div
            key="audio"
            onTouchTap={this.toggleLocalAudio}
            style={[
              GlobalStyles.cell,
              styles.controls.button.css,
              !this.props.isLocalAudioEnabled && styles.controls.red.css,
            ]}
          >
            <IconButton>
              <FontIcon
                className="material-icons"
                color={Colors.fullWhite}
              >mic_off</FontIcon>
            </IconButton>
          </div>
          {/* <div key='settings' style={[GlobalStyles.cell, styles.controls.button.css]}>
            <IconButton>
              <FontIcon className='material-icons' color={Colors.fullWhite}>settings</FontIcon>
            </IconButton>
          </div>*/}
          <div
            key="end"
            style={[
              GlobalStyles.cell,
              styles.controls.button.css,
              styles.controls.buttonEnd.css,
            ]}
            onTouchTap={this.leave}
          >
            <IconButton>
              <FontIcon
                className="material-icons"
                color={Radium.getState(this.state, 'end', ':hover') ?
                  Colors.fullWhite : Colors.red800}
              >call_end</FontIcon>
            </IconButton>
          </div>
        </Paper>
      </div>
    );
  }
}
ControlsComponent.propTypes = {
  dispatch: PropTypes.func,
  controlsVisible: PropTypes.bool,
  isLocalAudioEnabled: PropTypes.bool,
  isLocalVideoEnabled: PropTypes.bool,
  onTouchTap: PropTypes.func,
  toggleInviteModal: PropTypes.func,
};

export default Radium(ControlsComponent);
