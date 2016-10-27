import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/reducer';
import DevTools from '../components/dev-tools.component';

const enhancer = compose(

  // Middleware you want to use in development:
  applyMiddleware(thunk),

  // Required! Enable Redux DevTools with the monitors you chose
  DevTools.instrument()
);

// Note: this API requires redux@>=3.1.0
const store = createStore(
  rootReducer,
  enhancer
);

export default store;
