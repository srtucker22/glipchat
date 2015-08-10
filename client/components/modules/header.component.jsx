// Dependencies
var UserStore   = null;
var UserActions = null;

Dependency.autorun(()=> {
  UserStore   = Dependency.get('UserStore');
  UserActions = Dependency.get('UserActions');
});

LoginButtonComponent = React.createClass({
  loginWithFacebook() {
    UserActions.loginWithFacebook();
  },

  render() {
    return (
      <a href='javascript:void(0)' onClick={this.loginWithFacebook}>Login with Facebook</a>
    );
  },
});

LogoutButtonComponent = React.createClass({
  logout() {
    UserActions.logout();
  },

  render() {
    return (
      <a href='javascript:void(0)' onClick={this.logout}>Logout</a>
    );
  },
});

HeaderComponent = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      user: UserStore.user(),
      loggingIn: UserStore.loggingIn(),
    };
  },

  render() {
    var { ...other } = this.props;

    var loginButton;
    if (!UserStore.loggingIn()) {
      if (UserStore.user()) {
        loginButton = <LogoutButtonComponent />;
      } else {
        loginButton = <LoginButtonComponent />;
      }
    }

    return (
      <div className='navbar navbar-default'>
        <div className='navbar-header'>
            <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='.navbar-responsive-collapse'>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
              <span className='icon-bar'></span>
            </button>
            <a className='navbar-brand' href='javascript:void(0)'>{this.props.appName}</a>
        </div>
        <div className='navbar-collapse collapse navbar-responsive-collapse'>
          <ul className='nav navbar-nav navbar-right'>
            <li>{loginButton}</li>
            <li className='dropdown'>
              <a href='bootstrap-elements.html' data-target='#' className='dropdown-toggle' data-toggle='dropdown'>Dropdown <b className='caret'></b></a>
              <ul className='dropdown-menu'>
                <li><a href='javascript:void(0)'>Action</a></li>
                <li><a href='javascript:void(0)'>Another action</a></li>
                <li><a href='javascript:void(0)'>Something else here</a></li>
                <li className='divider'></li>
                <li><a href='javascript:void(0)'>Separated link</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    );
  },
});
