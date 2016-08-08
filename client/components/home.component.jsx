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
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import Browser from 'bowser';
import DownloadButtonComponent from './modules/download-button.component.jsx';
import FooterComponent from './modules/footer.component.jsx';
import GithubComponent from './modules/github.component.jsx';
import HeaderComponent from './modules/header.component.jsx';
import {browserHistory} from 'react-router';
import LoadingDialogComponent from './modules/loading-dialog.component.jsx';
import Radium from 'radium';
import React from 'react';
import Colors from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';

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

export class HomeComponent extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      loading: false
    };
  }
  componentWillMount() {
    NotificationActions.getPermission();
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.currentRoom) {
      browserHistory.push('/room/' + this.props.currentRoom._id);
    }
  }

  createRoom() {
    RoomActions.createRoom();
    this.setState({
      loading: true
    });
  }

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
  }
};

export default createContainer(({params}) => {
  return {
    currentRoom: RoomStore.currentRoom.get(),
  };
}, Radium(HomeComponent));
