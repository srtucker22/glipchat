var FacebookActions = function() {
  var _this = this;

  _.extend(_this, {
    getFriends() {
      Dispatcher.dispatch({ actionType: 'GET_FACEBOOK_FRIENDS'});
    },

    init() {
      Dispatcher.dispatch({ actionType: 'INITIALIZE_FACEBOOK'});
    },

  });

  return _this;
};

Dependency.add('FacebookActions', new FacebookActions());
