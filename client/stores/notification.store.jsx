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

// NotificationStore Creator
var NotificationStore = function() {
  var _this = this;

  _this.permission = ReactiveVar(null);

  _this.clearListener = (id)=> {
    console.log('unregistered ', id);
    notificationStream.removeAllListeners(id);
  };

  _this.getPermission = ()=> {
    if (_this.permission.get() !== 'granted') {
      // Let's check if the browser supports notifications
      if (!('Notification' in window)) {
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
    console.log('registered ', id);
    notificationStream.on(id, (data)=> {
      if (_this.permission.get() === 'granted') {
        if (data.type === 'invite') {
          let title = 'New Chat Invitation';
          let options = {
            body: data.from + ' has invited you to a chat.',
            icon: 'apple-icon-180x180.png'
          };
          let notification = new Notification(title, options);
          notification.onclick = ()=> {
            notification.close();
            window.location = data.room;
            return;
          };
        }
      }
    });
  };

  _this.tokenId = Dispatcher.register((payload)=> {
    switch (payload.actionType){
      case 'NOTIFICATION_CLEAR_LISTENER':
        _this.clearListener(payload.id);
        break;
      case 'NOTIFICATION_GET_PERMISSION':
        _this.getPermission();
        break;
      case 'NOTIFICATION_REGISTER_LISTENER':
        _this.registerListener(payload.id);
        break;
    }
  });

  return _this;
};

// Create the instance
Dependency.add('NotificationStore', new NotificationStore());
