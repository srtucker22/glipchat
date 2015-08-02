// LayoutStore Creator
var LayoutStore = () => {
  var self = this;
  
  Dispatcher.register((payload) => {
    switch(payload.actionType){
      case "GOTO_WELCOME":
        ReactLayout.render(MainComponent, {content: <WelcomeComponent />});
        break;
      case "GOTO_HOME":
        ReactLayout.render(MainComponent, {content: <HomeComponent />});
        break;
      case "GOTO_INBOX":
        ReactLayout.render(MainComponent, {content: <InboxComponent />});
        break;
      case "GOTO_NOT_FOUND":
        ReactLayout.render(MainComponent, {content: <NotFoundComponent />});
        break;
    }
  });
};

// Create the instance
Dependency.add('LayoutStore', new LayoutStore());
