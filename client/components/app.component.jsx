let {ThemeManager, LightRawTheme} = MUI.Styles;

// // for client-side Facebook SDK
// let FacebookActions = null;
// let FacebookStore = null;
//
// Dependency.autorun(()=> {
//   FacebookActions = Dependency.get('FacebookActions');
//   FacebookStore = Dependency.get('FacebookStore');
// });

const styles = {
  css: {
    height: 'inherit',
  }
};

AppComponent = Radium(React.createClass({
  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  componentDidMount() {
    // // initialize the Facebook SDK
    // FacebookActions.init();
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(LightRawTheme),
    };
  },

  render() {
    return (
      <div style={[styles.css]} appName='quasar'>{this.props.children}</div>
    );
  },
}));
