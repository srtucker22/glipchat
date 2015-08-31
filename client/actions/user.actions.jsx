var UserActions = function() {
  var _this = this;

  _.extend(_this, {
    login(user, password) {
      Dispatcher.dispatch({ actionType: 'USER_LOGIN_PASSWORD'});
    },

    loginWithFacebook() {
      Dispatcher.dispatch({ actionType: 'USER_LOGIN_FACEBOOK'});
    },

    loginWithGoogle() {
      Dispatcher.dispatch({ actionType: 'USER_LOGIN_GOOGLE'});
    },

    logout() {
      Dispatcher.dispatch({ actionType: 'USER_LOGOUT'});
    },

    updateProfileName(name){
      Dispatcher.dispatch({ actionType: 'USER_UPDATE_PROFILE_NAME', name });
    }
  });

  return _this;
};

Dependency.add('UserActions', new UserActions());
