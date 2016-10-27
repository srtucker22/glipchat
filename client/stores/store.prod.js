import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/reducer';

const enhancer = applyMiddleware(thunk);

// Note: this API requires redux@>=3.1.0
const store = createStore(
  rootReducer,
  enhancer
);

export default store;
