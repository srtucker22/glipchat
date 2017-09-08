import DataChannelStore from '../stores/data-channel.store';
import store from '../stores/store';

// set the data channel callbacks
export const setDataChannel = (channel, id) => {
  // eslint-disable-next-line no-param-reassign
  channel.onerror = (error) => {
    // eslint-disable-next-line no-console
    console.log('Data Channel Error:', error);
  };

  // eslint-disable-next-line no-param-reassign
  channel.onmessage = (event) => {
    // eslint-disable-next-line no-console
    console.log('event', event);
    if (typeof event.data === 'string') {
      const data = JSON.parse(event.data);
      store.dispatch(Object.assign({ id }, data));
    }
  };

  // eslint-disable-next-line no-param-reassign
  channel.onclose = () => {
    // eslint-disable-next-line no-console
    console.log('The Data Channel is Closed');
    DataChannelStore[id] = null;
    delete DataChannelStore[id];
  };
};

export const sendAction = (id, action) => {
  if (DataChannelStore[id]) {
    DataChannelStore[id].send(JSON.stringify(action));
  }
};
