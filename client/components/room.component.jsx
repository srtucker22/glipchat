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
  constructor() {
    super(...arguments);
    this.state = {
      showInviteModal: false
    };
  }

  componentDidMount() {
    const {localStream, dispatch} = this.props;
    if (!localStream.error && !localStream.loading && !MediaStore.local) {
      dispatch(Actions.getLocalStream());
    }
  }

  componentWillUnmount() {
    this.props.dispatch(Actions.stopLocalStream());
    // RTCActions.disconnect();
    // RTCActions.stopLocalStream();
    // RoomActions.leaveRoom();
  }

  componentWillUpdate(nextProps, nextState) {
    // // if the user logs out on a different tab, leave the room
    // if (nextProps.userId !== this.props.userId) {
    //   RTCActions.disconnect(this.props.userId);
    //   browserHistory.push('/');
    // }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.localStream.loading && this.props.localStream.loading && !nextProps.localStream.error && !!MediaStore.local) {
      this.setState({
        primaryStream: 'local'
      });

      if (!nextProps.room.connected.length) {
        console.log(nextProps);
        nextProps.dispatch(Actions.joinRoomStream(nextProps.room._id));
      }
    }
  }

  joinRoomStream(id) {
    this.props.dispatch(Actions.joinRoomStream(id));
  }

  setPrimaryStream(id) {
    this.setState({
      primaryStream: id
    });
  }

  toggleInviteModal() {
    this.setState({
      showInviteModal: !this.state.showInviteModal
    });
  }

  toggleControls() {
    // if (RoomStore.controlsVisible.get()) {
    //   RoomActions.hideControls();
    // }else {
    //   RoomActions.showControls();
    // }
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
    if (!!MediaStore.local && !!room &&
      room.connected.length === 1 && room.connected[0] === user._id) {
      overlayComponent = (Browser.mobile || Browser.tablet) ? (
        <CallingOverlayComponent
          onClick={this.toggleControls.bind(this)}
        />
      ) : (
        <FirstOverlayComponent
          linkUrl={window.location.href}
          onClick={this.toggleControls.bind(this)}
          action={this.toggleInviteModal.bind(this)}
        />
      );
    }

    const readyPromptComponent = (!!MediaStore.local) ? (
      <ReadyPromptComponent
        joinRoomStream={this.joinRoomStream.bind(this, room._id)}
        onClick={this.toggleControls.bind(this)}
        room={room}
        user={user}
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
        dispatch={dispatch}
        isLocalAudioEnabled={localStream.audio}
        isLocalVideoEnabled={localStream.video}
        onClick={this.toggleControls.bind(this)}
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
            onClick={this.toggleControls.bind(this)}/>
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

const mapStateToProps = ({
  rooms,
  rtc: {localStream, remoteStreams},
  users: {user}
}) => {
  return {
    room: _.first(rooms.available),
    localStream,
    remoteStreams,
    user,
  };
};

export default connect(
  mapStateToProps,
)(RoomComponent);
