MainRouter = () => {
  var self = {};

  // Routes
  let routes = {
    home:     '/',
    inbox:    '/inbox',
    room:     '/room',
  };

  let privateRoutes = ['room']; // rooms that require authentication

  // Getters
  self.getRoute = (route) => {
    return routes[route];
  };

  // If user is not logged in, redirect to 'home'
  self.checkLoggedInUser = () => {
    let path = FlowRouter.current().path;
    if (Meteor.loggingIn() || Meteor.user()) {
      FlowRouter.go(path);
    } else {
      FlowRouter.go(self.getRoute('home'));
    }
  };

  // Require authentication for all private routes
  console.log(_.map(privateRoutes, route => self.getRoute(route).slice(1)));
  FlowRouter.triggers.enter([self.checkLoggedInUser], {
    only: ['room'],
  });

  FlowRouter.route(self.getRoute('home'), {
    name: 'home',
    action() {
      Dispatcher.dispatch({ actionType: 'GOTO_HOME' });
    },
  });

  FlowRouter.route(self.getRoute('inbox'), {
    name: 'inbox',
    triggersEnter: [(context) => {
      console.log('triggersEnter');
    },],

    action() {
      Dispatcher.dispatch({ actionType: 'GOTO_INBOX' });
    },
  });

  FlowRouter.route(self.getRoute('room'), {
    name: 'room',
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
