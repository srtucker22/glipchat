// LayoutStore Creator
var LayoutStore = () => {
  var self = {};

  Dispatcher.register((payload) => {
    switch (payload.actionType){
      case 'GOTO_HOME':
        ReactLayout.render(MainComponent, {content: <HomeComponent />});
        break;
      case 'GOTO_INBOX':
        ReactLayout.render(MainComponent, {content: <InboxComponent />});
        break;
      case 'GOTO_ROOM':
        ReactLayout.render(MainComponent, {content: <RoomComponent />});
        break;
      case 'GOTO_NOT_FOUND':
        ReactLayout.render(MainComponent, {content: <NotFoundComponent />});
        break;
    }
  });
};

// Create the instance
Dependency.add('LayoutStore', new LayoutStore());
