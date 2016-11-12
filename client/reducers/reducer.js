import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import messages from './messages.reducer';
import rooms from './rooms.reducer';
import rtc from './rtc.reducer';
import users from './users.reducer';

const rootReducer = combineReducers({
  messages,
  rooms,
  routing: routerReducer,
  rtc,
  users,
});

export default rootReducer;
