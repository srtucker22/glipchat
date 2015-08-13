// Dependencies
var {
  Link
} = Router;
var UserStore   = null;
var UserActions = null;

Dependency.autorun(()=> {
  UserStore   = Dependency.get('UserStore');
  UserActions = Dependency.get('UserActions');
});

NotificationDropdownComponent = React.createClass({
  messages: [
    {id: '0', text: 'test1'},
    {id: '1', text: 'test2'},
  ],

  render() {
    return (
      <div className='cell dropdown notification-dropdown text-center'>
        <a href='javascript:void(0)' data-target='#' className='dropdown-toggle' data-toggle='dropdown'><i className={this.messages.length ? 'mdi-social-notifications' : 'mdi-social-notifications-none'}></i></a>
        <ul className='dropdown-menu'>
          {this.messages.length ? _.map(this.messages, (message)=> {
            return (
              <li key={message.id}>
                <a href='javascript:void(0)'>{message.text}</a>
              </li>
            );
          }) :

            <li>
                <a className='text-center'><i className='mdi-content-inbox'></i>
                <p>No notifications</p></a>
            </li>
          }
        </ul>
      </div>

    );
  },
});

LoginButtonComponent = React.createClass({
  loginWithFacebook() {
    UserActions.loginWithFacebook();
  },

  render() {
    return (
      <div className='cell'><a href='javascript:void(0)' onClick={this.loginWithFacebook}>Login with Facebook</a></div>
    );
  },
});

GoogleLoginButtonComponent = React.createClass({
  loginWithGoogle() {
    UserActions.loginWithGoogle();
  },

  render() {
    return (
      <div className='cell'><a href='javascript:void(0)' onClick={this.loginWithGoogle}>Login with Google</a></div>
    );
  },
});

ProfileDropdownComponent = React.createClass({
  logout() {
    UserActions.logout();
  },

  render() {
    var user = UserStore.user();
    return (
      <div className='cell dropdown profile-dropdown'>
        {user.services.facebook ? <img className='dropdown-toggle img-circle' data-toggle='dropdown' data-target='#' src={'https://graph.facebook.com/' + user.services.facebook.id + '/picture'} /> : <div className='dropdown-toggle'>{user.profile.name}</div>}
        <ul className='dropdown-menu'>
          <li className='dropdown-header'>{user.profile.name}</li>
          {user.services.facebook ? <li className='dropdown-header'>{user.services.facebook.email}</li> : '' }
          <li className='divider'></li>
          <li className='signout'><div href='javascript:void(0)' className='btn btn-default' onClick={this.logout}>Sign out</div></li>
        </ul>
      </div>
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
        loginButton = <ProfileDropdownComponent />;
      } else {
        loginButton = <LoginButtonComponent />;
      }
    }

    return (
      <header className='table shadow-z-1'>
        <div className='cell'>
          <Link className='brand' to='home'>{this.props.appName}</Link>
        </div>
        {UserStore.user() ? <NotificationDropdownComponent /> : ''}
        {loginButton}
        {UserStore.user() ? '' : <GoogleLoginButtonComponent />}
      </header>
    );
  },
});
