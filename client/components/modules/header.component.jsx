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
    css: {
      background: 'none',
      border: 'none',
      boxShadow: 'none',
    },

    icon: {
      css:{
        color: Colors.fullWhite,
      },
    },

    menu: {
      css:{
        color: Colors.fullBlack,
      }
    }
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
        <div className='dropdown' style={[GlobalStyles.cell, styles.menu.css]}>
          <IconButton iconStyle={styles.icon.css} iconClassName='material-icons dropdown-toggle' data-toggle='dropdown'>{(this.props.messages && this.props.messages.length) ? 'notifications':'notifications_none'}</IconButton>
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
        <div className='dropdown' style={[GlobalStyles.cell, styles.menu.css]}>
          <Avatar className='dropdown-toggle' data-toggle='dropdown' src={this.props.user.services.google.picture}/>
          <Card className='dropdown-menu'>
            <CardText>
              {this.props.user.profile.name}
            </CardText>
            {!!this.props.user.services.google && !!this.props.user.services.google.email && <CardText>
              {this.props.user.services.google.email}
            </CardText>}
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
        subscribed: UserStore.subscribed.get(),
      };
    },

    loginWithGoogle() {
      UserActions.loginWithGoogle();
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

      if (!UserStore.loggingIn() && this.data.subscribed) {
        if (this.data.user && !UserStore.isGuest()) {

          notificationDropdown = (
            <NotificationDropdownComponent messages={this.data.messages}/>
          );

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
          loginButton = <FlatButton label='Login with Google' onClick={this.loginWithGoogle}/>;
        }
      }

      return (
        <header>
          <AppBar title={''/*this.props.appName*/} iconElementRight={loginButton? loginButton: profileButtons} onLeftIconButtonTouchTap={this.toggleNav} showMenuIconButton={false}
          style={styles.css} />
          <LeftNav ref='leftNav' docked={false} menuItems={menuItems} />
        </header>
      );
    },
  }));
})();
