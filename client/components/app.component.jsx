const {RouteHandler} = Router;

AppComponent = React.createClass({
  render() {
    return (
      <div>
        <RouteHandler appName='Meteor React WebRTC'/>
      </div>
    );
  },
});
