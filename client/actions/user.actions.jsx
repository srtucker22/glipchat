var UserActions = function() {
  var _this = this;

  _.extend(_this, {
    login(user, password) {
      Dispatcher.dispatch({ actionType: 'USER_LOGIN_PASSWORD'});
    },

    loginWithFacebook() {
      Dispatcher.dispatch({ actionType: 'USER_LOGIN_FACEBOOK'});
    },

    logout() {
      Dispatcher.dispatch({ actionType: 'USER_LOGOUT'});
    },
  });

  return _this;
};

Dependency.add('UserActions', new UserActions());
