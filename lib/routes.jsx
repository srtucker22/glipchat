MainRouter = () => {
  var self = {};

  // Routes
  let routes = {
    home:     '/',
    inbox:    '/inbox',
    room:     '/room',
  };

  // Getters
  self.getRoute = (route) => {
    return routes[route];
  };

  FlowRouter.route(self.getRoute('home'), {
    action() {
      Dispatcher.dispatch({ actionType: 'GOTO_HOME' });
    },
  });

  FlowRouter.route(self.getRoute('inbox'), {
    triggersEnter: [(context) => {
      console.log('triggersEnter');
    }],

    action() {
      Dispatcher.dispatch({ actionType: 'GOTO_INBOX' });
    },
  });

  FlowRouter.route(self.getRoute('room'), {
    action() {
      Dispatcher.dispatch({ actionType: 'GOTO_ROOM' });
    },
  });

  FlowRouter.notFound = {
    action() {
      Dispatcher.dispatch({ actionType: 'GOTO_NOT_FOUND' });
    },
  };

  return self;
};

var Router = new MainRouter();
