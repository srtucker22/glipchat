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

// Dependencies
import Browser from 'bowser';
import DownloadButtonComponent from './modules/download-button.component.jsx';
import FooterComponent from './modules/footer.component.jsx';
import GithubComponent from './modules/github.component.jsx';
import HeaderComponent from './modules/header.component.jsx';
import {browserHistory} from 'react-router';
import LoadingDialogComponent from './modules/loading-dialog.component.jsx';
import MUI from 'material-ui';
import Radium from 'radium';
import React from 'react';

const {FontIcon, RaisedButton, Styles: {Colors}} = MUI;

const styles = {
  css: {
    backgroundAttachment: 'fixed',
    backgroundImage: 'url(images/quasar.jpg)',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    color: Colors.fullWhite,
    height: '100%',
    minHeight: '500px',
  },

  title: {
    css: {
      color: Colors.fullWhite,
      fontSize: '80px',
      textShadow: '2px 2px rgba(0, 0, 0, 0.5)',
    },
  },
};

let GlobalStyles;
let NotificationActions;
let RoomStore;
let RoomActions;
let UserActions;

Dependency.autorun(()=> {
  GlobalStyles = Dependency.get('GlobalStyles');
  NotificationActions = Dependency.get('NotificationActions');
  RoomStore = Dependency.get('RoomStore');
  RoomActions = Dependency.get('RoomActions');
  UserActions = Dependency.get('UserActions');
});

export default HomeComponent = Radium(React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      currentRoom: RoomStore.currentRoom.get(),
    };
  },

  componentWillMount() {
    NotificationActions.getPermission();
  },

  componentWillUpdate(nextProps, nextState) {
    if (this.data.currentRoom) {
      browserHistory.push('/room/' + this.data.currentRoom._id);
    }
  },

  createRoom() {
    RoomActions.createRoom();
    this.setState({
      loading: true
    });
  },

  getInitialState() {
    return {
      loading: false
    };
  },

  render() {
    return (
      <div style={[styles.css]}>
        <GithubComponent />
        {this.state.loading ?
          <LoadingDialogComponent open={true} title='Starting video call'/> : ''
        }
        <div style={[GlobalStyles.stickyFooterPage]}>
          <HeaderComponent showMenuIconButton={false}/>
          <div className='row'>
            <div className='col-xs-12 text-center'>
              <h1 style={[styles.title.css]}>{'quasar'}</h1>
              <br />
              <RaisedButton
                onTouchTap={this.createRoom}
                label='Start video call'
                primary={true}
                style={{marginBottom: '50px'}}
              />
              <br />
              {(Browser.mac && !Browser.electron) ?
                <DownloadButtonComponent platform='mac' /> : ''}
            </div>
          </div>
        </div>
        <FooterComponent />
      </div>
    );
  },
}));
