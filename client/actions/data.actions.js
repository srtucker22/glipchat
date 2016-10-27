import { _ } from 'meteor/underscore';
import * as constants from '../constants/constants';
import DataChannelStore from '../stores/data-channel.store';
import deepExtend from 'deep-extend';
import store from '../stores/store';

// set the data channel callbacks
export const setDataChannel = (channel, id)=> {
  channel.onerror = (error)=> {
    console.log('Data Channel Error:', error);
  };

  channel.onmessage = (event)=> {
    console.log('event', event)
    if (typeof event.data === 'string') {
      const data = JSON.parse(event.data);
      store.dispatch(Object.assign({id}, data));
    }
  };

  channel.onclose = ()=> {
    console.log('The Data Channel is Closed');
    DataChannelStore[id] = null;
    delete DataChannelStore[id];
  };
};

export const sendAction = (id, action)=> {
  if(!!DataChannelStore[id]){
    DataChannelStore[id].send(JSON.stringify(action));
  }
}
