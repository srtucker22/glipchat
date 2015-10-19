var {IndexRoute, Router, Route, Link} = ReactRouter;

let RoomActions = null;
let RoomStore   = null;
let RTCActions  = null;
let RTCStore    = null;
let UserStore   = null;

Dependency.autorun(()=> {
  RoomActions = Dependency.get('RoomActions');
  RoomStore   = Dependency.get('RoomStore');
  RTCStore    = Dependency.get('RTCStore');
  RTCActions  = Dependency.get('RTCActions');
  UserStore   = Dependency.get('UserStore');
});

const About = React.createClass({
  render() {
    return <h3>About</h3>
  }
})

const Inbox = React.createClass({
  render() {
    return (
      <div>
        <h2>Inbox</h2>
        {this.props.children || 'Welcome to your Inbox'}
      </div>
    )
  }
})

const Message = React.createClass({
  render() {
    return <h3>Message {this.props.params.id}</h3>
  }
})

Meteor.startup(function() {
  window.location.hostname === 'localhost' && analytics.debug();  // show the analytics debug log if testing locally

  const routeConfig = [{
    path: '/',
    component: AppComponent,
    indexRoute: {component: HomeComponent},
    onEnter: (nextState, replaceState) => {
      analytics.page('home');
    },
    childRoutes: [{
      path: '/room/:roomId',
      component: RoomComponent,
      onEnter: (nextState, replaceState, callback) => {
        UserStore.requireUser().then((user)=> {

          RoomActions.joinRoom(nextState.params.roomId);

          RoomStore.requireRoom(nextState.params.roomId).then((room)=> {
            if (!RTCStore.isDuplicateConnection()) {
              RTCActions.getLocalStream();
              analytics.page(room);
              callback();
            }
          }).catch((err)=> {
            replaceState(null, '/');
            console.error(err);
            callback();
          });
        })

        .catch((err)=> {
          replaceState(null, '/');
          console.error(err);
          callback();
        });
      },
      onLeave: () => {
        RTCActions.disconnect();
        RTCActions.stopLocalStream();
        RoomActions.leaveRoom();
      }
    }],
  }, {
    path: '*',
    component: NotFoundComponent,
    onEnter: (nextState, replaceState) => {
      analytics.page('404');
    },
  }];

  React.render(<Router routes={routeConfig} />, document.body);
});
// var {
//   Route,
//   NotFoundRoute,
//   IndexRoute,
//   Router,
// } = ReactRouter;
//
// Meteor.startup(function() {
//   window.location.hostname === 'localhost' && analytics.debug();  // show the analytics debug log if testing locally
//
//   React.render((
//     <Router>
//       <Route component={AppComponent}>
//         <IndexRoute name='home' component={HomeComponent} />
//
//       </Route>
//     </Router>
//   ), document.body);
//   // Router.run(routes, ReactRouter.HashLocation, function(Root, state) {
//   //   React.render(<Root/>, document.body);
//   //   switch (state.path) {
//   //     case '/':
//   //       analytics.page('home');
//   //       break;
//   //     default:
//   //       if (state.path && state.path.indexOf('/room/') === 0) {
//   //         analytics.page('room');
//   //       } else {
//   //         analytics.page('404');
//   //       }
//   //   }
//   // });
// });
