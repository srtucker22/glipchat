const {RouteHandler} = Router;
var ThemeManager = new MUI.Styles.ThemeManager();

AppComponent = React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },
  
  render() {
    return (
      <RouteHandler appName='Meteor React WebRTC'/>
    );
  },
});
