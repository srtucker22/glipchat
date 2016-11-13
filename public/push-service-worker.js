'use strict';

function endpointWorkaround(pushSubscription) {
  // Make sure we only mess with GCM
  if (pushSubscription.endpoint.indexOf('https://android.googleapis.com/gcm/send') !== 0) {
    return pushSubscription.endpoint;
  }

  var mergedEndpoint = pushSubscription.endpoint;
  // Chrome 42 + 43 will not have the subscriptionId attached
  // to the endpoint.
  if (pushSubscription.subscriptionId &&
    pushSubscription.endpoint.indexOf(pushSubscription.subscriptionId) === -1) {
    // Handle version 42 where you have separate subId and Endpoint
    mergedEndpoint = pushSubscription.endpoint + '/' +
      pushSubscription.subscriptionId;
  }

  var endpointSections = mergedEndpoint.split('/');
  var subscriptionId = endpointSections[endpointSections.length - 1];
  return subscriptionId;
};

self.addEventListener('message', function(event) {
  console.log(event.data);
  switch(event.data.type) {
    case 'SET_USER':
      try {
        var user = event.data.user;
        self.token = user.services.resume.loginTokens.pop().hashedToken;
        event.ports[0].postMessage(self.token);
      } catch (e) {
        console.log(e);
        event.ports[0].postMessage({error: e});
      }
      break;
    default:
      event.ports[0].postMessage(event.data);
      break;
  }
});

self.addEventListener('push', function(event) {
  console.log('Received a push message', event);
  event.waitUntil(
    self.registration.pushManager.getSubscription()
      .then(function(subscription) {
        console.log('subscription', subscription);
        console.log('subscriptionId', endpointWorkaround(subscription));
        fetch('/methods/getNotification', {
          method: 'post',
          headers: {
            'Authorization': 'Bearer ' + self.token,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subscriptionId: endpointWorkaround(subscription),
          }),
        })
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          console.log(data);
          self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon,
            tag: data.tag,
            data: data.data,
          });
        })
        .catch(function(err) {
          console.log('err');
          console.log(err);
        });
      })
  );
});

self.addEventListener('notificationclick', function(event) {
  // Android doesn’t close the notification when you click on it
  // See: http://crbug.com/463146
  event.notification.close();

  // This looks to see if the current is already open and
  // focuses if it is
  event.waitUntil(clients.matchAll({
    type: 'window',
  }).then(function(clientList) {
    console.log('clientList', clientList);
    var client = null;
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      console.log('client', client);
      if ('focus' in client) {
        return client.navigate(event.notification.data)
          .then(function(client) {
            return client.focus();
          });
      }
    }

    return clients.openWindow(event.notification.data);
  }));
});
