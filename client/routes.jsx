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

Meteor.startup(function() {
  window.location.hostname === 'localhost' && analytics.debug();  // show the analytics debug log if testing locally

  console.log(ReactRouter.history);
  let history = ReactRouter.history.createHistory();

  const routeConfig = [{
    path: '/',
    component: AppComponent,
    indexRoute: {component: HomeComponent},
    onEnter: (nextState, replaceState) => { // there should probably be a better way to do this for all routes
      analytics.page('home');
    },
    childRoutes: [{
      path: '/room/:roomId',
      component: RoomComponent,
      onEnter: (nextState, replaceState, callback) => { // use a callback to make onEnter async
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

  React.render(<Router history={history} routes={routeConfig} />, document.body);
});
