import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import React, { Component } from 'react';
import routes from '../routes';
import store from '../stores/store';

// Create an enhanced history that syncs navigation events with the store
export const history = syncHistoryWithStore(browserHistory, store);

export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router history={history} routes={routes} />
      </Provider>
    );
  }
}
