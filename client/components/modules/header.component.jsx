// Dependencies
var { Link } = Router;
var {
  AppBar,
  Avatar,
  Card,
  CardActions,
  CardText,
  FlatButton,
  FontIcon,
  IconButton,
  IconMenu,
  Menu,
  MenuItem
} = MUI;
var ThemeManager = new MUI.Styles.ThemeManager();

var HeaderActions = null;
var HeaderStore = null;
var UserStore   = null;
var UserActions = null;

Dependency.autorun(()=> {
  HeaderActions = Dependency.get('HeaderActions');
  HeaderStore = Dependency.get('HeaderStore');
  UserStore   = Dependency.get('UserStore');
  UserActions = Dependency.get('UserActions');
});

NotificationDropdownComponent = React.createClass({
  render() {
    return (
      <div className='cell dropdown'>
        <IconButton iconClassName='material-icons icon dropdown-toggle' data-toggle='dropdown'>{(this.props.messages && this.props.messages.length) ? 'notifications':'notifications_none'}</IconButton>
        <Card className='dropdown-menu'>
          {(!!this.props.messages && this.props.messages.length) ? _.map(this.props.messages, (message)=> {
              return (
                <MenuItem key={message.id} primaryText={message.text} />
              );
            }) :

          <MenuItem className='text-center'>
            No notifications
          </MenuItem>}
        </Card>
      </div>
    );
  },
});

ProfileDropdownComponent = React.createClass({
  logout() {
    UserActions.logout();
  },

  render() {
    return (
      <div className='cell dropdown'>
        <Avatar className='dropdown-toggle' data-toggle='dropdown' src={'https://graph.facebook.com/' + this.props.user.services.facebook.id + '/picture'} />
        <Card className='dropdown-menu'>
          <CardText>
            {this.props.user.profile.name}
          </CardText>
          <CardText>
            {this.props.user.services.facebook && this.props.user.services.facebook.email}
          </CardText>
          <CardActions className='text-center' expandable={false}>
            <FlatButton onClick={this.logout} label='Sign out'/>
          </CardActions>
        </Card>
      </div>
    );
  },
});

HeaderComponent = React.createClass({
  mixins: [ReactMeteorData],

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },

  getMeteorData() {
    return {
      user: UserStore.user(),
      loggingIn: UserStore.loggingIn(),
    };
  },

  loginWithFacebook() {
    UserActions.loginWithFacebook();
  },

  render() {
    var { ...other } = this.props;

    var loginButton;
    var notificationDropdown;
    var avatarButton;
    var profileButtons;

    var testMessages = [{
      id: 1, text: 'this is some text',
    },
    {
      id: 2, text: 'this is some more text',
    }];
    this.data.messages = testMessages;

    if (!UserStore.loggingIn()) {
      if (this.data.user && !UserStore.isGuest()) {
        notificationDropdown = (
          <NotificationDropdownComponent messages={this.data.messages}/>
        );

        profileDropdown = (
          <ProfileDropdownComponent user={this.data.user} />
        );

        profileButtons = (
          <div className='table'>
            {notificationDropdown}
            {profileDropdown}
          </div>
        );
      } else {
        loginButton = <FlatButton label='Login with Facebook' onClick={this.loginWithFacebook}/>;
      }
    }

    return (
      <header>
        <AppBar title={this.props.appName} iconElementRight={loginButton? loginButton: profileButtons} />
      </header>
    );
  },
});
