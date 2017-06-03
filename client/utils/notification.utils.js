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

// NOTE: This code is only suitable for GCM endpoints,
// When another browser has a working version, alter
// this to send a PUSH request directly to the endpoint
function showCurlCommand(mergedEndpoint) {
  // The curl command to trigger a push message straight from GCM
  if (mergedEndpoint.indexOf(GCM_ENDPOINT) !== 0) {
    console.log('This browser isn\'t currently ' +
      'supported for this demo');
    return;
  }

  const endpointSections = mergedEndpoint.split('/');
  const subscriptionId = endpointSections[endpointSections.length - 1];

  const curlCommand = `curl --header "Authorization: key=${API_KEY}" --header Content-Type:"application/json" ${GCM_ENDPOINT} -d "{\\"registration_ids\\":[\\"${subscriptionId}\\"]}"`;

  console.log('curlCommand', curlCommand);
}

export const isSubscribed = () => {
  if (!Meteor.isCordova && 'serviceWorker' in navigator) {
    return navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
      // returns Promise that resolves to a PushSubscription object.
      serviceWorkerRegistration.pushManager.getSubscription();
    });
  }
};

export const subscribe = (user) => {
  // browser gets a push manifest and service worker
  if (!Meteor.isCordova && 'serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      console.log('serviceWorker event', event);
    });

    return navigator.serviceWorker
      .register('/push-service-worker.js')
      .then((reg) => {
        if (Notification.permission === 'denied') {
          console.error('The user has blocked notifications.');
          return;
        }

        // Check if push messaging is supported
        if (!('PushManager' in window)) {
          console.error('Push messaging isn\'t supported.');
          return;
        }

        return navigator.serviceWorker.ready.then((reg) => {
          sendMessage({
            type: 'SET_USER',
            user,
          }).then((res) => {
            // If the promise resolves, just display a success message.
            console.log('message sent', res);
          }).catch((e) => {
            console.error(e);
          }); // If the promise rejects, show the error.;

          return reg.pushManager.subscribe({
            userVisibleOnly: true,
          }).then((sub) => {
            const mergedEndpoint = endpointWorkaround(sub);

            if (mergedEndpoint.indexOf(GCM_ENDPOINT) !== 0) {
              console.log('This browser isn\'t currently ' +
                'supported for this demo');
              return;
            }

            const endpointSections = mergedEndpoint.split('/');

            const subscriptionId = endpointSections[endpointSections.length - 1];

            return subscriptionId;

            // This is just for demo purposes / an easy to test by
            // generating the appropriate cURL command
            // showCurlCommand(mergedEndpoint);
          }).catch((e) => {
            if (Notification.permission === 'denied') {
              // The user denied the notification permission which
              // means we failed to subscribe and the user will need
              // to manually change the notification permission to
              // subscribe to push messages
              console.error('Permission for Notifications was denied');
            } else {
              // A problem occurred with the subscription, this can
              // often be down to an issue or lack of the gcm_sender_id
              // and / or gcm_user_visible_only
              console.error('Unable to subscribe to push.', e);
            }
          });
        });
      }).catch((error) => {
        console.error('push sw error :', error);
      });
  }
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
        return sub.unsubscribe().then(() => {
          const mergedEndpoint = endpointWorkaround(sub);
          const endpointSections = mergedEndpoint.split('/');
          const subscriptionId = endpointSections[endpointSections.length - 1];
          return subscriptionId;
        }).catch((e) => {
          // We failed to unsubscribe, this can lead to
          // an unusual state, so may be best to remove
          // the subscription id from your data store and
          // inform the user that you disabled push

          console.error('Unsubscription error: ', e);
        });
      }).catch((e) => {
        console.error('Error thrown while unsubscribing from ' +
          'push messaging.', e);
      }));
