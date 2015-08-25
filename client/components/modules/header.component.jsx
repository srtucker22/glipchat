(()=> {
  // Dependencies
  const { Link } = Router;
  const {
    AppBar,
    Avatar,
    Card,
    CardActions,
    CardText,
    FlatButton,
    FontIcon,
    IconButton,
    IconMenu,
    LeftNav,
    Menu,
    MenuItem
  } = MUI;

  const Colors = MUI.Styles.Colors;

  const styles = {
    icon: {
      color: Colors.fullWhite,
    },
  };

  let GlobalStyles = null;
  let HeaderActions = null;
  let HeaderStore = null;
  let UserStore   = null;
  let UserActions = null;

  Dependency.autorun(()=> {
    GlobalStyles = Dependency.get('GlobalStyles');
    HeaderActions = Dependency.get('HeaderActions');
    HeaderStore = Dependency.get('HeaderStore');
    UserStore   = Dependency.get('UserStore');
    UserActions = Dependency.get('UserActions');
  });

  NotificationDropdownComponent = Radium(React.createClass({
    render() {
      return (
        <div className='dropdown' style={[GlobalStyles.cell]}>
          <IconButton iconStyle={styles.icon} iconClassName='material-icons dropdown-toggle' data-toggle='dropdown'>{(this.props.messages && this.props.messages.length) ? 'notifications':'notifications_none'}</IconButton>
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
  }));

  ProfileDropdownComponent = Radium(React.createClass({
    logout() {
      UserActions.logout();
    },

    render() {
      return (
        <div className='dropdown' style={[GlobalStyles.cell]}>
          <Avatar className='dropdown-toggle' data-toggle='dropdown' src={'https://graph.facebook.com/' + this.props.user.services.facebook.id + '/picture'} />
          <Card className='dropdown-menu'>
            <CardText>
              {this.props.user.profile.name}
            </CardText>
            <CardText>
              {!!this.props.user.services.facebook && !!this.props.user.services.facebook.email}
            </CardText>
            <CardActions className='text-center' expandable={false}>
              <FlatButton onTouchTap={this.logout} label='Sign out'/>
            </CardActions>
          </Card>
        </div>
      );
    },
  }));

  HeaderComponent = Radium(React.createClass({
    mixins: [ReactMeteorData],

    getMeteorData() {
      return {
        user: UserStore.user(),
        loggingIn: UserStore.loggingIn(),
      };
    },

    loginWithFacebook() {
      UserActions.loginWithFacebook();
    },

    toggleNav() {
      this.refs.leftNav.toggle();
    },

    render() {
      let { ...other } = this.props;

      let loginButton;
      let notificationDropdown;
      let avatarButton;
      let profileButtons;

      let testMessages = [{
        id: 1, text: 'this is some text',
      },
      {
        id: 2, text: 'this is some more text',
      }];
      this.data.messages = testMessages;

      let menuItems = [
        { route: 'get-started', text: 'Get Started' },
        { route: 'customization', text: 'Customization' },
        { route: 'components', text: 'Components' },
      ];

      if (!UserStore.loggingIn()) {
        if (this.data.user && !UserStore.isGuest()) {
          notificationDropdown = (
            <NotificationDropdownComponent messages={this.data.messages}/>
          );
          console.log(UserStore.isGuest());
          console.log(this.data.user);
          profileDropdown = (
            <ProfileDropdownComponent user={this.data.user} />
          );

          profileButtons = (
            <div style={[GlobalStyles.table]}>
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
          <AppBar title={this.props.appName} iconElementRight={loginButton? loginButton: profileButtons} onLeftIconButtonTouchTap={this.toggleNav}/>
          <LeftNav ref='leftNav' docked={false} menuItems={menuItems} />
        </header>
      );
    },
  }));
})();
