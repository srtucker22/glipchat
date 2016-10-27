import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import DevTools from './dev-tools.component';
import React, { Component } from 'react';
import routes from '../routes';
import store from '../stores/store';

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <div style={{width: 'inherit', height: 'inherit'}}>
          <DevTools />
          <Router history={history} routes={routes}/>
        </div>
      </Provider>
    );
  }
}
