var {
  Route,
  NotFoundRoute,
  DefaultRoute
} = Router;

// declare our routes and their hierarchy
var routes = (
  <Route handler={App}>
    <Route path="about" handler={About} />
    <Route path="inbox" handler={Inbox} />
    <DefaultRoute handler={AppLoading} />
    <NotFoundRoute handler={AppNotFound} />
  </Route>
);

Meteor.startup(() => {
  injectTapEventPlugin();
  Router.run(routes, Router.HashLocation, (Root) => {
    React.render(<Root/>, document.getElementById('app-container'));
  });
});
