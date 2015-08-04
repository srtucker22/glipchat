// RoomStore Creator
var RoomStore = () => {
  var self = {};

  // Callbacks
  self.on = {
    createRoom() {
      console.log('creating room');
    },
  };

  // Getters
  self.get = {

  };

  self.tokenId = Dispatcher.register((payload)=> {
    switch (payload.actionType){
      case 'CREATE_ROOM':
        self.on.createRoom();
        break;
    }
  });

  return self;
};

// Create the instance
Dependency.add('RoomStore', new RoomStore());
