var RoomActions = function() {
  var _this = this;

  _.extend(_this, {
    createRoom() {
      Dispatcher.dispatch({ actionType: 'CREATE_ROOM'});
    },
  });

  return _this;
};

Dependency.add('RoomActions', new RoomActions());
