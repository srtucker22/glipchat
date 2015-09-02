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
