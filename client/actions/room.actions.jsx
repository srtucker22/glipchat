var RoomActions = () => {
  var self = {};

  _.extend(self, {
    createRoom() {
      Dispatcher.dispatch({ actionType: 'CREATE_ROOM'});

      // create the room and put 'CREATE_ROOM_SUCCESS/FAILED' in callback
    },
  });

  return self;
};

Dependency.add('RoomActions', new RoomActions());
