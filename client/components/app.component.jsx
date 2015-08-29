(()=> {
  const {RouteHandler} = Router;

  let ThemeManager = new MUI.Styles.ThemeManager();

  // // for client-side Facebook SDK
  // let FacebookActions = null;
  // let FacebookStore = null;
  //
  // Dependency.autorun(()=> {
  //   FacebookActions = Dependency.get('FacebookActions');
  //   FacebookStore = Dependency.get('FacebookStore');
  // });

  AppComponent = React.createClass({
    childContextTypes: {
      muiTheme: React.PropTypes.object
    },

    componentDidMount() {
      // // initialize the Facebook SDK
      // FacebookActions.init();
    },

    getChildContext() {
      return {
        muiTheme: ThemeManager.getCurrentTheme()
      };
    },

    render() {
      return (
        <RouteHandler appName='quasar'/>
      );
    },
  });
})();
