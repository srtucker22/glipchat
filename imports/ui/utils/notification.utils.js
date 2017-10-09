import { Meteor } from 'meteor/meteor';

// TODO: make this a single prop in settings.json
console.log(Meteor.settings);
const API_KEY = Meteor.settings.public.google ? Meteor.settings.public.google.apiKey : undefined;
const GCM_ENDPOINT = 'https://android.googleapis.com/gcm/send';

// This method handles the removal of subscriptionId
// in Chrome 44 by concatenating the subscription Id
// to the subscription endpoint
const endpointWorkaround = (pushSubscription) => {
  // Make sure we only mess with GCM
  if (pushSubscription.endpoint.indexOf('https://android.googleapis.com/gcm/send') !== 0) {
    return pushSubscription.endpoint;
  }

  let mergedEndpoint = pushSubscription.endpoint;
  // Chrome 42 + 43 will not have the subscriptionId attached
  // to the endpoint.
  if (pushSubscription.subscriptionId &&
    pushSubscription.endpoint.indexOf(pushSubscription.subscriptionId) === -1) {
    // Handle version 42 where you have separate subId and Endpoint
    mergedEndpoint = `${pushSubscription.endpoint}/${pushSubscription.subscriptionId}`;
  }
  return mergedEndpoint;
};

export const sendMessage = message => (
  // This wraps the message posting/response in a promise, which will
  // resolve if the response doesn't contain an error, and reject with
  // the error if it does. If you'd prefer, it's possible to call
  // controller.postMessage() and set up the onmessage handler
  // independently of a promise, but this is a convenient wrapper.
  new Promise(function(resolve, reject) {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = function(event) {
      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data);
      }
    };

    // This sends the message data as well as transferring
    // messageChannel.port2 to the service worker.
    // The service worker can then use the transferred port to reply
    // via postMessage(), which will in turn trigger the onmessage
    // handler on messageChannel.port1.
    // See
    // https://html.spec.whatwg.org/multipage/workers.html#dom-worker-postmessage
    navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
  })
);

// parse subscriptionId from the subscription object
export const getSubscriptionId = (subscription) => {
  const mergedEndpoint = endpointWorkaround(subscription);

  if (mergedEndpoint.indexOf(GCM_ENDPOINT) !== 0) {
    console.log('This browser isn\'t currently ' +
      'supported for this demo');
    return;
  }

  const endpointSections = mergedEndpoint.split('/');
  const subscriptionId = endpointSections[endpointSections.length - 1];
  return subscriptionId;
};

export const subscribe = (user) => {
  // browser gets a push manifest and service worker
  if (!Meteor.isCordova && 'serviceWorker' in navigator) {
    // reigster service worker
    return navigator.serviceWorker
      .register('/push-service-worker.js')
      .then(() => {
        // Check the current Notification permission.
        // If its denied, it's a permanent block until the
        // user changes the permission
        if (Notification.permission === 'denied') {
          console.error('The user has blocked notifications.');
          return Promise.reject('The user has blocked notifications.');
        }

        // Check if push messaging is supported
        if (!('PushManager' in window)) {
          console.error('Push messaging isn\'t supported.');
          return Promise.reject('Push messaging isn\'t supported.');
        }

        // We need the service worker registration to check for a subscription
        return navigator.serviceWorker.ready
          .then(reg => reg.pushManager.getSubscription()
            .then((existingSub) => {
              console.log({ existingSub });

              // called after creating subscription or getting existing sub
              const returnFunc = sub => (
                // send user info to sw so it can make auth requests
                sendMessage({
                  type: 'SET_USER',
                  user,
                }).then(() => getSubscriptionId(sub))
              );

              // return subscriptionId for existing subscription
              if (existingSub) {
                return returnFunc(existingSub);
              }

              // create a subscription and return subscriptionId
              return reg.pushManager.subscribe({
                userVisibleOnly: true,
              }).then(sub => returnFunc(sub));
            }),
          );
      }).catch((error) => {
        console.error('push sw error :', error);
      });
  }

  if (!Meteor.isCordova) {
    return Promise.reject('Meteor is in Cordova mode');
  }

  return Promise.reject('serviceWorker is not in navigator');
};

export const unsubscribe = () => navigator.serviceWorker.ready
  .then(serviceWorkerRegistration =>
    // To unsubscribe from push messaging, you need get the
    // subcription object, which you can call unsubscribe() on.
    serviceWorkerRegistration.pushManager.getSubscription()
      .then((sub) => {
        // Check we have a subscription to unsubscribe
        if (!sub) {
          // No subscription object, so set the state
          // to allow the user to subscribe to push
          return;
        }

        // We have a subcription, so call unsubscribe on it
        // Return the former subscriptionId
        return sub.unsubscribe().then(() => getSubscriptionId(sub))
          .catch((e) => {
            // We failed to unsubscribe, this can lead to
            // an unusual state, so may be best to remove
            // the subscription id from your data store and
            // inform the user that you disabled push
            console.error('Unsubscription error: ', e);
            return getSubscriptionId(sub);
          });
      }).catch((e) => {
        console.error('Error thrown while unsubscribing from ' +
          'push messaging.', e);
      }));
