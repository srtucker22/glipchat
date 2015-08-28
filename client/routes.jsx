var {
  Route,
  NotFoundRoute,
  DefaultRoute,
} = Router;

// declare our routes and their hierarchy
var routes = (
  <Route handler={AppComponent}>
    <Route name='home' path='/' handler={HomeComponent} />
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
//   var _this = {};
//
//   // Routes
//   let routes = {
//     home:     '/',
//     inbox:    '/inbox',
//     room:     '/room/:roomId',
//   };
//
//   // Getters
//   _this.getRoute = (route) => {
//     return routes[route];
//   };
//
//   // If user is not logged in, redirect to 'home'
//   _this.requireUser = () => {
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
//   FlowRouter.route(_this.getRoute('home'), {
//     name: 'home',
//     action() {
//       Dispatcher.dispatch({ actionType: 'GOTO_HOME' });
//     },
//   });
//
//   FlowRouter.route(_this.getRoute('inbox'), {
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
//   FlowRouter.route(_this.getRoute('room'), {
//     name: 'room',
//
//     action(params) {
//       _this.requireUser().then((user)=> {
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
//   return _this;
// };
//
// var Router = new MainRouter();
