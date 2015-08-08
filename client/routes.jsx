var {
  Route,
  NotFoundRoute,
  DefaultRoute,
} = Router;

// declare our routes and their hierarchy
var routes = (
  <Route handler={AppComponent}>
    <Route name='home' path='/' handler={HomeComponent} />
    <Route name='inbox' path='inbox' handler={InboxComponent} />
    <Route name='room' path='room/:roomId' handler={RoomComponent} />
    <NotFoundRoute handler={NotFoundComponent} />
  </Route>
);

Meteor.startup(function() {
  Router.run(routes, Router.HashLocation, (Root) => {
    React.render(<Root/>, document.body);
  });
});

// MainRouter = () => {
//   var self = {};
//
//   // Routes
//   let routes = {
//     home:     '/',
//     inbox:    '/inbox',
//     room:     '/room/:roomId',
//   };
//
//   // Getters
//   self.getRoute = (route) => {
//     return routes[route];
//   };
//
//   // If user is not logged in, redirect to 'home'
//   self.requireUser = () => {
//     return new Promise((resolve, reject)=> {
//       if (Meteor.user()) {
//         resolve(Meteor.user());
//       } else if (Meteor.loggingIn()) {
//
//         // wait for loggingIn
//         Tracker.autorun((c)=> {
//           if (Meteor.loggingIn())
//             return;
//
//           // stop the tracker
//           c.stop();
//
//           if (Meteor.user()) {
//             resolve(Meteor.user());
//           } else {
//             reject(null);
//           };
//         });
//
//       } else {
//         reject(null);
//       }
//     });
//   };
//
//   FlowRouter.route(self.getRoute('home'), {
//     name: 'home',
//     action() {
//       Dispatcher.dispatch({ actionType: 'GOTO_HOME' });
//     },
//   });
//
//   FlowRouter.route(self.getRoute('inbox'), {
//     name: 'inbox',
//     triggersEnter: [(context) => {
//       console.log('triggersEnter');
//     },],
//
//     action() {
//       Dispatcher.dispatch({ actionType: 'GOTO_INBOX' });
//     },
//   });
//
//   FlowRouter.route(self.getRoute('room'), {
//     name: 'room',
//
//     action(params) {
//       self.requireUser().then((user)=> {
//         Dispatcher.dispatch({
//           actionType: 'ENTER_ROOM',
//           roomId: params.roomId,
//         });
//       },
//
//       (err)=> {
//         FlowRouter.go('home');
//       });
//     },
//   });
//
//   FlowRouter.notFound = {
//     action() {
//       Dispatcher.dispatch({ actionType: 'GOTO_NOT_FOUND' });
//     },
//   };
//
//   return self;
// };
//
// var Router = new MainRouter();
