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

import { analytics } from 'meteor/okgrow:analytics';
import { render } from 'react-dom';
import {browserHistory} from 'react-router';
import * as Actions from './actions/actions';
import AppComponent from './components/app.component';
import Browser from 'bowser';
import HomeComponent from './components/home.component';
import HomeMobileComponent from './components/home-mobile.component';
import NotFoundComponent from './components/not-found.component';
import React from 'react';
import RoomComponent from './components/room.component';
import store from './stores/store';

export const routeConfig = [{
  path: '/',
  component: AppComponent,
  indexRoute: {
    component: (Browser.mobile || Browser.tablet) ?
      HomeMobileComponent : HomeComponent
  },
  onEnter: (nextState, replaceState) => { // there should probably be a better way to do this for all routes
    analytics.page('home');
  },
  childRoutes: [{
    path: '/room/:roomId',
    component: RoomComponent,
    onEnter: (nextState, replaceState, callback) => { // use a callback to make onEnter async
      let handle = store.subscribe(() => {
        const {users: user, rooms} = store.getState();
        if (!user) {
          browserHistory.replace('/');
        } else if (!user.loggingIn) {
          if (!rooms.current || rooms.current !== nextState.params.roomId) {
            store.dispatch(Actions.setCurrentRoom(nextState.params.roomId));
          } else if (!!rooms.available && rooms.available.length) {
            analytics.page(nextState.params.roomId);
            handle();
            callback();
          }
        }
      });
    }
  }],
}, {
  path: '*',
  component: NotFoundComponent,
  onEnter: (nextState, replaceState) => {
    analytics.page('404');
  },
}];

export default routeConfig;
