import { _ } from 'meteor/underscore';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import Browser from 'bowser';
import Colors from 'material-ui/colors';
import PropTypes from 'prop-types';
import Radium from 'radium';
import React from 'react';
import { PERMISSION_INTERVAL, RING_DURATION } from '../../api/lib/config';
import * as Actions from '../actions/actions';
import CallingOverlay from './calling-overlay.component';
import Controls from './controls.component';
import ErrorComponent from './error.component';
import FirstOverlayComponent from './first-overlay.component';
import Invite from './invite.component';
import MediaStore from '../stores/media.store';
import ReadyPrompt from './ready-prompt.component';
import Video from './video.component';
import VideoOverlay from './video-overlay.component';

const styles = {
  css: {
    backgroundColor: Colors.grey[800],
    height: '100%',
  },

  videos: {
    css: {
      background: 'transparent',
      bottom: 0,
      left: 0,
      padding: '0 5px',
      margin: '10px 0',
      position: 'absolute',
      transition: 'all 1s ease-in-out',
      width: '100%',
      height: '15vw',
      overflowX: 'auto',
    },

    video: {
      css: {
        float: 'right',
        display: 'inline-block',
        height: '100%',
        width: '20vw',
        margin: '5px',
        position: 'relative',
        bottom: '5px',
        zIndex: 2,
        overflow: 'hidden',
        textAlign: 'center',
        backgroundColor: 'black',
      },
    },
  },
};

export class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showInviteModal: false,
    };

    this.toggleControls = this.toggleControls.bind(this);
    this.toggleInviteModal = this.toggleInviteModal.bind(this);
  }

  componentDidMount() {
    const { localStream, dispatch } = this.props;
    if (!localStream.error && !localStream.loading && !MediaStore.local) {
      dispatch(Actions.getLocalStream());
    }
  }

  componentWillReceiveProps(nextProps) {
    // if the user logs out on a different tab, leave the room
    if (!nextProps.user || nextProps.user._id !== this.props.user._id) {
      browserHistory.push('/');
      return;
    }

    const newState = {};

    if (!nextProps.localStream.error && !!this.permissionInterval) {
      clearInterval(this.permissionInterval);
      this.permissionInterval = null;
    }

    if (!nextProps.localStream.loading && this.props.localStream.loading &&
      !nextProps.localStream.error && !!MediaStore.local) {
      newState.primaryStream = 'local';

      if (!nextProps.room.connected.length) {
        this.ring();
        nextProps.dispatch(Actions.joinRoomStream(nextProps.room._id));
      }
    } else if (this.state.status !== 'connecting' && nextProps.room.connected.length &&
      !~nextProps.room.connected.indexOf(nextProps.user._id)) {
      newState.status = 'joining';
    } else if (nextProps.room.connected.length > 1) {
      newState.status = !nextProps.remoteStreams || !_.keys(nextProps.remoteStreams) ?
        'connecting' : 'connected';
      if (this.ringerTimeout) {
        clearTimeout(this.ringerTimeout);
      }
    } else if (this.state.status === 'connected') {
      newState.status = 'waiting';
    }

    if (!!nextProps.localStream.error &&
      ~['NotAllowedError', 'PermissionDeniedError']
        .indexOf(nextProps.localStream.error.status)) {
      this.waitForPermission();
    }

    if (!nextProps.remoteStreams[this.state.primaryStream]) {
      newState.primaryStream = 'local';
    }

    this.setState(newState);
  }

  componentWillUnmount() {
    // clear the ringer timeout
    if (this.ringerTimeout) {
      clearTimeout(this.ringerTimeout);
    }

    if (this.permissionInterval) {
      clearInterval(this.permissionInterval);
    }

    this.props.dispatch(Actions.leaveRoomStream());
    this.props.dispatch(Actions.stopLocalStream());
    this.props.dispatch(Actions.leaveRoom());
  }

  setPrimaryStream(id) {
    this.setState({
      primaryStream: id,
    });
  }

  ring() {
    this.setState({
      status: 'ringing',
    });

    const self = this;
    self.ringerTimeout = setTimeout(() => {
      self.ringerTimeout = undefined;
      self.setState({
        status: 'failed',
      });
    }, RING_DURATION);
  }

  joinRoomStream(id) {
    this.props.dispatch(Actions.joinRoomStream(id));
    this.setState({
      status: 'connecting',
    });
  }

  pingInvitees() {
    console.log('pingInvitees');
  }

  // keep calling getUserMedia periodically to check for permission change
  waitForPermission() {
    if (!this.permissionInterval) {
      const self = this;
      self.permissionInterval = setInterval(() => {
        self.props.dispatch(Actions.getLocalStream());
      }, PERMISSION_INTERVAL);
    }
  }

  toggleInviteModal() {
    this.setState({
      showInviteModal: !this.state.showInviteModal,
    });
  }

  toggleControls() {
    this.setState({
      controlsVisible: !this.state.controlsVisible,
    });
  }

  render() {
    const {
      dispatch,
      localStream,
      remoteStreams,
      room,
      user,
      ...other
    } = this.props;

    // log the errors for now
    if (localStream.error) {
      console.error(localStream.error);
    }

    // if we have an error, just render the error component
    if (localStream.error) {
      return (
        <div style={[styles.css]}>
          <ErrorComponent
            error={localStream.error}
            {...other}
          />
        </div>
      );
    }

    let overlayComponent;
    if (!~['connected', 'joining'].indexOf(this.state.status)) {
      if (Browser.mobile || Browser.tablet || this.state.status === 'connecting') {
        overlayComponent = (
          <CallingOverlay
            onTouchTap={this.toggleControls}
            status={this.state.status}
          />
        );
      } else if (this.state.status !== 'connecting' && !localStream.loading) {
        overlayComponent = (
          <FirstOverlayComponent
            action={this.toggleInviteModal}
            linkUrl={window.location.href}
            onTouchTap={this.toggleControls}
          />
        );
      }
    }

    const readyPrompt = (this.state.status === 'joining' && !localStream.loading) ? (
      <ReadyPrompt
        joinRoomStream={this.joinRoomStream.bind(this, room._id)}
        onTouchTap={this.toggleControls}
      />
    ) : undefined;

    const invite = (
      <Invite
        dispatch={dispatch}
        linkUrl={window.location.href}
        showInviteModal={this.state.showInviteModal}
        hideInviteModal={this.toggleInviteModal}
        user={user}
      />
    );

    const controls = (MediaStore.local) ? (
      <Controls
        controlsVisible={this.state.controlsVisible}
        dispatch={dispatch}
        isLocalAudioEnabled={localStream.audio}
        isLocalVideoEnabled={localStream.video}
        onTouchTap={this.toggleControls}
        toggleInviteModal={this.toggleInviteModal}
      />
    ) : undefined;

    const remoteStreamComponents = (!!remoteStreams && _.keys(remoteStreams).length) ?
      (<div style={[styles.videos.css]}>
        <div key="local" style={[styles.videos.video.css]}>
          <VideoOverlay
            id={'local'}
            dispatch={dispatch}
            isAudioEnabled={localStream.audio}
            setPrimaryStream={this.setPrimaryStream.bind(this, 'local')}
          />
          <Video
            src={MediaStore.local}
            muted
            flip
          />
        </div>
        {_.map(remoteStreams, (val, key) => (
          <div
            key={key}
            style={[styles.videos.video.css]}
          >
            <VideoOverlay
              id={key}
              isAudioEnabled={!val.muted}
              isRemoteEnabled={val}
              dispatch={dispatch}
              setPrimaryStream={this.setPrimaryStream.bind(this, key)}
            />
            <Video src={MediaStore[key]} />
          </div>
          ))}
      </div>) : undefined;

    return (
      <div style={[styles.css]}>
        {this.state.primaryStream ?
          (<Video
            src={MediaStore[this.state.primaryStream]}
            flip={(this.state.primaryStream === 'local')}
            fullScreen
            muted={(this.state.primaryStream === 'local')}
            onTouchTap={this.toggleControls}
          />
          ) : ''
        }
        {invite}
        {readyPrompt}
        {controls}
        {overlayComponent}
        {remoteStreamComponents}
      </div>
    );
  }
}

Room.propTypes = {
  dispatch: PropTypes.func,
  room: PropTypes.object,
  localStream: PropTypes.object,
  remoteStreams: PropTypes.object,
  user: PropTypes.object,
};

const mapStateToProps = ({
  rooms,
  rtc: { localStream, remoteStreams },
  users: { user },
}) => ({
  room: _.first(rooms.available), // TODO: this is a hack
  localStream,
  remoteStreams,
  user,
});

export default connect(mapStateToProps)(Radium(Room));
