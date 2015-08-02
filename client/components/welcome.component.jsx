// Dependencies
var UserStore   = null,
    UserActions = null;

Dependency.autorun(function(){
  UserStore   = Dependency.get('UserStore');
  UserActions = Dependency.get('UserActions');
});

LoginButtonComponent = React.createClass({
  loginWithFacebook: function() {
    UserActions.loginWithFacebook();
  },

  render(){
    return (
      <button onClick={this.loginWithFacebook}>Login with Facebook</button>
    );
  }
});

LogoutButtonComponent = React.createClass({
  logout: function() {
    UserActions.logout();
  },

  render(){
    return (
      <button onClick={this.logout}>Logout</button>
    );
  }
});

WelcomeComponent = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      currentUser: Meteor.user()
    };
  },

  render() {
    var loginButton;
    if (!Meteor.loggingIn()){
      if (Meteor.user()) {
        loginButton = <LogoutButtonComponent />;
      } else {
        loginButton = <LoginButtonComponent />;
      }
    }

    return (
      <div>
        <p>Welcome Page</p>
        {loginButton}
      </div>
    );
  }
});
