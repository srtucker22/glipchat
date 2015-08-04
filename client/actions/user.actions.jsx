var UserActions = ()=> {
  var self = {};

  _.extend(self, {
    login(user, password) {
      Dispatcher.dispatch({ actionType: 'USER_WANTS_TO_LOGIN'});
      Meteor.loginWithPassword(payload.user, payload.password, (err)=> {
        if (!err) {
          Dispatcher.dispatch({ actionType: 'LOGIN_SUCCESS'});
        } else {
          Dispatcher.dispatch({ actionType: 'LOGIN_FAILED', error: err});
        }
      });
    },

    loginWithFacebook() {
      Dispatcher.dispatch({ actionType: 'USER_WANTS_TO_LOGIN'});
      Meteor.loginWithFacebook({
        requestPermissions: ['public_profile', 'email'],
        loginStyle: 'redirect',
      }, (err)=> {
        if (!err) {
          Dispatcher.dispatch({ actionType: 'LOGIN_SUCCESS'});
        } else {
          Dispatcher.dispatch({ actionType: 'LOGIN_FAILED', error: err});
        }
      });
    },

    logout() {
      Dispatcher.dispatch({ actionType: 'USER_WANTS_TO_LOGOUT'});
      Meteor.logout((err)=> {
        if (!err) {
          Dispatcher.dispatch({ actionType: 'LOGOUT_SUCCESS'});
        } else {
          Dispatcher.dispatch({ actionType: 'LOGOUT_FAILED', error: err});
        }
      });
    },
  });

  return self;
};

Dependency.add('UserActions', new UserActions());
