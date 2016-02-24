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

import {Router, browserHistory} from 'react-router';
import AppComponent from './components/app.component.jsx';
import Browser from 'bowser';
import HomeComponent from './components/home.component.jsx';
import HomeMobileComponent from './components/home-mobile.component.jsx';
import NotFoundComponent from './components/not-found.component.jsx';
import React from 'react';
import ReactDOM from 'react-dom';
import RoomComponent from './components/room.component.jsx';

let RoomActions;
let RoomStore;
let RTCActions;
let RTCStore;
let UserStore;

Dependency.autorun(()=> {
  RoomActions = Dependency.get('RoomActions');
  RoomStore   = Dependency.get('RoomStore');
  RTCStore    = Dependency.get('RTCStore');
  RTCActions  = Dependency.get('RTCActions');
  UserStore   = Dependency.get('UserStore');
});

Meteor.startup(function() {
  window.location.hostname === 'localhost' && analytics.debug();  // show the analytics debug log if testing locally

  const routeConfig = [{
    path: '/',
    component: AppComponent,
    indexRoute: {component: (Browser.mobile || Browser.tablet) ?
      HomeMobileComponent : HomeComponent},
    onEnter: (nextState, replaceState) => { // there should probably be a better way to do this for all routes
      analytics.page('home');
    },
    childRoutes: [{
      path: '/room/:roomId',
      component: RoomComponent,
      onEnter: (nextState, replaceState, callback) => { // use a callback to make onEnter async
        UserStore.requireUser().then((user)=> {

          RoomActions.joinRoom(nextState.params.roomId);

          RoomStore.requireRoom(nextState.params.roomId).then((room)=> {
            if (!RTCStore.isDuplicateConnection()) {
              RTCActions.getLocalStream();
              analytics.page(room);
            }
            callback();
          }).catch((err)=> {
            console.error(err);
            browserHistory.replace('/');
            callback();
          });
        })

        .catch((err)=> {
          console.error(err);
          browserHistory.replace('/');
          callback();
        });
      },
      onLeave: () => {
        RTCActions.disconnect();
        RTCActions.stopLocalStream();
        RoomActions.leaveRoom();
      }
    }],
  }, {
    path: '*',
    component: NotFoundComponent,
    onEnter: (nextState, replaceState) => {
      analytics.page('404');
    },
  }];

  ReactDOM.render(
    <Router
      history={browserHistory}
      routes={routeConfig} />,
    document.getElementById('react')
  );
});
