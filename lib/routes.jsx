MainRouter = function () {
  var self = this;

  // Routes
  var routes = {
    home:    "/",
    inbox: "/inbox",
    welcome: "/welcome"
  };

  // Getters
  self.getRoute = function (route) {
      return routes[route];
  };

  FlowRouter.route(self.getRoute('home'), {
    action() {
      Dispatcher.dispatch({ actionType: 'GOTO_HOME' });
    }
  });

  FlowRouter.route(self.getRoute('inbox'), {
    triggersEnter: [(context) => {

    }],
    action() {
      Dispatcher.dispatch({ actionType: 'GOTO_INBOX' });
    }
  });

  FlowRouter.route(self.getRoute('welcome'), {
    action() {
      Dispatcher.dispatch({ actionType: 'GOTO_WELCOME' });
    }
  });

  FlowRouter.notFound = {
    action() {
      Dispatcher.dispatch({ actionType: 'GOTO_NOT_FOUND' });
    }
  };

  return self;
};

var Router = new MainRouter();
