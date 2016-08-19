/**
 * quasar
 *
 * Copyright (c) 2015 Glipcode http://glipcode.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions
 * of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */
import {notificationStream} from '../../lib/streams';

let RoomActions;
let RoomStore;

Dependency.autorun(()=> {
  RoomActions = Dependency.get('RoomActions');
  RoomStore = Dependency.get('RoomStore');
});

// NotificationStore Creator
var NotificationStore = function() {
  var _this = this;
  _this.permission = ReactiveVar(null);
  _this.invitations = ReactiveVar([]);

  _this.accept = ()=> {
    let data = _this.invitations.get().shift();
    _this.invitations.set(_this.invitations.get().slice());
    RoomStore.joinRoom(data.room);
  };

  _this.clearListener = (id)=> {
    notificationStream.removeAllListeners(id);
  };

  _this.getPermission = ()=> {
    // eventually use ServiceWorker https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
    function isNewNotificationSupported() {
      if (!window.Notification || !Notification.requestPermission) {
        return false;
      }

      if (Notification.permission !== 'granted') {
        try {
          new Notification('');
        } catch (e) {
          if (e.name == 'TypeError') {
            return false;
          }
        }
      }

      return true;
    }

    if (_this.permission.get() !== 'granted') {
      // Let's check if the browser supports notifications
      if (!isNewNotificationSupported()) {
        _this.permission.set('unsupported');
      }

      // Otherwise, we need to ask the user for permission
      else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function(permission) {
          // If the user accepts, let's create notifications
          _this.permission.set(permission);
        });
      }
    }
  };

  _this.registerListener = (id)=> {
    notificationStream.on(id, (data)=> {
      switch (data.type){
        case 'invite':
          let title = 'New Chat Invitation';
          let options = {
            body: data.from + ' has invited you to a chat.',
            icon: 'apple-icon-180x180.png'
          };

          if (_this.permission.get() === 'granted') {
            notification = new Notification(title, options);
            notification.onclick = ()=> {
              notification.close();
              window.location = data.url;
              return;
            };
            data.notification = notification;
          }

          // push the current invitation
          _this.invitations.set(
            _this.invitations.get().concat([data])
          );
          break;
        case 'uninvite':
          let invitation = _.findWhere(_this.invitations.get(), {room: data.room});
          if (!!invitation && !!invitation.notification) {
            invitation.notification.close();
          }
          _this.invitations.set(
            _.reject(_this.invitations.get(), (invitation)=> {
              return invitation.room === data.room &&
                invitation.from === data.from;
            })
          );
          break;
      }
    });
  };

  _this.reject = ()=> {
    // remove the first element from the invitations queue
    _this.invitations.get().shift();
    _this.invitations.set(_this.invitations.get().slice());
  };

  _this.tokenId = Dispatcher.register((payload)=> {
    switch (payload.actionType){
      case 'NOTIFICATION_ACCEPT_INVITATION':
        _this.accept();
        break;
      case 'NOTIFICATION_CLEAR_LISTENER':
        _this.clearListener(payload.id);
        break;
      case 'NOTIFICATION_GET_PERMISSION':
        _this.getPermission();
        break;
      case 'NOTIFICATION_REGISTER_LISTENER':
        _this.registerListener(payload.id);
        break;
      case 'NOTIFICATION_REJECT_INVITATION':
        _this.reject();
        break;
    }
  });

  return _this;
};

// Create the instance
Dependency.add('NotificationStore', new NotificationStore());
