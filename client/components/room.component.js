import {PERMISSION_INTERVAL, RING_DURATION} from '../../lib/config';
import {_} from 'meteor/underscore';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import * as Actions from '../actions/actions';
import Browser from 'bowser';
import CallingOverlayComponent from './calling-overlay.component';
import Colors from 'material-ui/styles/colors';
import ControlsComponent from './controls.component';
import ErrorComponent from './error.component';
import FirstOverlayComponent from './first-overlay.component';
import InviteComponent from './invite.component';
import MediaStore from '../stores/media.store';
import Radium from 'radium';
import React from 'react';
import ReadyPromptComponent from './ready-prompt.component';
import VideoComponent from './video.component';
import VideoOverlayComponent from './video-overlay.component';

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

export class RoomComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showInviteModal: false,
    };
  }

  componentDidMount() {
    const {localStream, dispatch} = this.props;
    if (!localStream.error && !localStream.loading && !MediaStore.local) {
      dispatch(Actions.getLocalStream());
    }
  }

  componentWillUnmount() {
    // clear the ringer timeout
    !!this.ringerTimeout && clearTimeout(this.ringerTimeout);
    !!this.permissionInterval && clearInterval(this.permissionInterval);
    this.props.dispatch(Actions.leaveRoomStream());
    this.props.dispatch(Actions.stopLocalStream());
    this.props.dispatch(Actions.leaveRoom());
  }

  componentWillUpdate(nextProps, nextState) {
    // if the user logs out on a different tab, leave the room
    if (nextProps.userId !== this.props.userId) {
      browserHistory.push('/');
    }
  }

  componentWillReceiveProps(nextProps) {
    const newState = {};

    if(!nextProps.localStream.error && !!this.permissionInterval) {
      clearInterval(this.permissionInterval);
      this.permissionInterval = null;
    }

    if (!nextProps.localStream.loading && this.props.localStream.loading && !nextProps.localStream.error && !!MediaStore.local) {
      newState.primaryStream = 'local';

      if (!nextProps.room.connected.length) {
        console.log('setting ringing');
        this.ring();
        console.log(this.state.status);
        nextProps.dispatch(Actions.joinRoomStream(nextProps.room._id));
      }
    } else if(this.state.status !== 'connecting' && nextProps.room.connected.length &&
      !~nextProps.room.connected.indexOf(nextProps.user._id)) {
      console.log('setting joining');
      newState.status = 'joining';
    } else if(nextProps.room.connected.length > 1) {
      console.log('setting connecting/ed');
      newState.status = !nextProps.remoteStreams || !_.keys(nextProps.remoteStreams) ?
        'connecting' : 'connected';
        !!this.ringerTimeout && clearTimeout(this.ringerTimeout);
    } else if (this.state.status === 'connected'){
      console.log(nextProps, this.state);
      newState.status = 'waiting';
    }

    console.log(nextProps);
    if(!!nextProps.localStream.error &&
      ~['NotAllowedError','PermissionDeniedError']
        .indexOf(nextProps.localStream.error.status)) {
      this.waitForPermission();
    }

    this.setState(newState);
  }

  // keep calling getUserMedia periodically to check for permission change
  waitForPermission() {
    if(!this.permissionInterval){
      const _this = this;
      _this.permissionInterval = setInterval(()=> {
        _this.props.dispatch(Actions.getLocalStream());
      }, PERMISSION_INTERVAL);
    }
  }

  pingInvitees() {
    console.log('pingInvitees');
  }

  ring() {
    this.setState({
      status: 'ringing'
    });

    const _this = this;
    _this.ringerTimeout = setTimeout(()=> {
      _this.ringerTimeout = undefined;
      console.log('setting waiting');
      _this.setState({
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

  setPrimaryStream(id) {
    this.setState({
      primaryStream: id,
    });
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
    if (!!localStream.error) {
      console.error(localStream.error);
    }

    // if we have an error, just render the error component
    if (!!localStream.error) {
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
          <CallingOverlayComponent
            onTouchTap={this.toggleControls.bind(this)}
            status={this.state.status}
          />
        );
      } else if(this.state.status !== 'connecting' && !localStream.loading) {
        overlayComponent = (
          <FirstOverlayComponent
            action={this.toggleInviteModal.bind(this)}
            linkUrl={window.location.href}
            onTouchTap={this.toggleControls.bind(this)}
          />
        );
      }
    }

    const readyPromptComponent = (this.state.status === 'joining') ? (
      <ReadyPromptComponent
        joinRoomStream={this.joinRoomStream.bind(this, room._id)}
        onTouchTap={this.toggleControls.bind(this)}
      />
    ) : undefined;

    const inviteComponent = (
      <InviteComponent
        dispatch={dispatch}
        linkUrl={window.location.href}
        showInviteModal={this.state.showInviteModal}
        hideInviteModal={this.toggleInviteModal.bind(this)}
        ref='invite'
        user={user}
      />
    );

    const controlsComponent = (!!MediaStore.local) ? (
      <ControlsComponent
        controlsVisible={this.state.controlsVisible}
        dispatch={dispatch}
        isLocalAudioEnabled={localStream.audio}
        isLocalVideoEnabled={localStream.video}
        onTouchTap={this.toggleControls.bind(this)}
        toggleInviteModal={this.toggleInviteModal.bind(this)}
      />
    ) : undefined;

    const remoteStreamComponents = (!!remoteStreams && _.keys(remoteStreams).length) ?
      (<div style={[styles.videos.css]}>
        <div key='local' style={[styles.videos.video.css]}>
          <VideoOverlayComponent
            id={'local'}
            dispatch={dispatch}
            isAudioEnabled={localStream.audio}
            setPrimaryStream={this.setPrimaryStream.bind(this, 'local')}/>
          <VideoComponent
            src={MediaStore.local}
            muted={true}
            flip={true}
          />
        </div>
        {_.map(remoteStreams, (val, key)=> {
          return (
            <div
              key={key}
              style={[styles.videos.video.css]}>
              <VideoOverlayComponent
                id={key}
                isAudioEnabled={!val.muted}
                isRemoteEnabled={val}
                dispatch={dispatch}
                setPrimaryStream={this.setPrimaryStream.bind(this, key)}
              />
              <VideoComponent src={MediaStore[key]}/>
            </div>
          );
        })}
      </div>) : undefined;

    return (
      <div style={[styles.css]}>
        {!!this.state.primaryStream ?
          (<VideoComponent
            src={MediaStore[this.state.primaryStream]}
            flip={(this.state.primaryStream === 'local')}
            fullScreen={true}
            muted={(this.state.primaryStream === 'local')}
            onTouchTap={this.toggleControls.bind(this)}/>
          ) : ''
        }
        {inviteComponent}
        {readyPromptComponent}
        {controlsComponent}
        {overlayComponent}
        {remoteStreamComponents}
      </div>
    );
  }
};

RoomComponent = Radium(RoomComponent);

RoomComponent.propTypes = {
  dispatch: React.PropTypes.func,
  room: React.PropTypes.object,
  localStream: React.PropTypes.object,
  remoteStreams: React.PropTypes.object,
  user: React.PropTypes.object,
};

const mapStateToProps = ({
  rooms,
  rtc: {localStream, remoteStreams},
  users: {user},
}) => {
  return {
    room: _.first(rooms.available), // TODO: this is a hack
    localStream,
    remoteStreams,
    user,
  };
};

export default connect(mapStateToProps)(RoomComponent);
