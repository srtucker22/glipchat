var UserActions = function() {
  return {
    login(user, password) {
      Dispatcher.dispatch({actionType: 'USER_LOGIN_PASSWORD'});
    },

    loginWithFacebook() {
      Dispatcher.dispatch({actionType: 'USER_LOGIN_FACEBOOK'});
    },

    loginWithGoogle() {
      Dispatcher.dispatch({actionType: 'USER_LOGIN_GOOGLE'});
    },

    logout() {
      Dispatcher.dispatch({actionType: 'USER_LOGOUT'});
    },

    updateProfileName(name) {
      Dispatcher.dispatch({actionType: 'USER_UPDATE_PROFILE_NAME', name});
    }
  };
};

Dependency.add('UserActions', new UserActions());
