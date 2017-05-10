import { analytics } from 'meteor/okgrow:analytics';
import { browserHistory } from 'react-router';
import Browser from 'bowser';
import * as Actions from './actions/actions';
import AppComponent from './components/app.component';
import HomeComponent from './components/home.component';
import HomeMobileComponent from './components/home-mobile.component';
import NotFoundComponent from './components/not-found.component';
import RoomComponent from './components/room.component';
import store from './stores/store';

// track current room with a subscription for auto-rerouting
// don't trust components to handle this routing
let currentRoom;
const currentRoomSubscription = store.subscribe(() => {
  const { rooms } = store.getState();

  if (rooms.current !== currentRoom) {
    currentRoom = rooms.current;

    // if current room changes to id, route to that room
    // don't route if already there
    // can only already be at this route if the app was loaded directly at this path
    // (e.g. a user clicks a link to the room from their email)
    const nextPath = `/room/${currentRoom}`;
    if (!!currentRoom && window.location.pathname !== nextPath) {
      browserHistory.push(nextPath);
    }
  }
});

// route configuration
export const routeConfig = [{
  path: '/',
  component: AppComponent,
  indexRoute: {
    component: (Browser.mobile || Browser.tablet) ?
      HomeMobileComponent : HomeComponent,
  },
  onEnter: (nextState, replaceState) => {
    analytics.page('home');
  },
  childRoutes: [{
    path: '/room/:roomId',
    component: RoomComponent,
    onEnter: (nextState, replaceState, callback) => { // use a callback to make onEnter async
      // subscribe to redux changes

      const { users: { user }, rooms } = store.getState();

      // if user logged in and new room, set current room
      if (!!user && !user.loggingIn && (!rooms.current || rooms.current !== nextState.params.roomId)) {
        store.dispatch(Actions.setCurrentRoom(nextState.params.roomId));
      }

      const handle = store.subscribe(() => {
        const { users: { user }, rooms } = store.getState();
        if (!user) {
          handle(); // unsubscribe
          browserHistory.replace('/');  // redirect home
        } else if (!user.loggingIn) {
          if (!rooms.current || rooms.current !== nextState.params.roomId) {
            store.dispatch(Actions.setCurrentRoom(nextState.params.roomId));
          } else if (!!rooms.available && rooms.available.length) {
            analytics.page('room');
            handle(); // unsubscribe
            callback(); // resolve route
          }
        }
      });
    },
  }],
}, {
  path: '*',
  component: NotFoundComponent,
  onEnter: () => {
    analytics.page('404');
  },
}];

export default routeConfig;
