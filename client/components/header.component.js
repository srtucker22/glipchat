import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { browserHistory } from 'react-router';
import { Card, CardActions, CardText } from 'material-ui/Card';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import Colors from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import { List, ListItem } from 'material-ui/List';
import moment from 'moment';
import Popover from 'material-ui/Popover/Popover';
import Radium from 'radium';
import React, { Component, PureComponent } from 'react';
import * as Actions from '../actions/actions';
import GlobalStyles from '../styles/global.styles';

const styles = {
  css: {
    background: 'none',
    border: 'none',
    boxShadow: 'none',
  },

  sidenav: {
    css: {

    },
    profile: {
      css: {
        width: '100%',
        backgroundImage: 'url("images/left-nav-background.png")',
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
        padding: 10,
        color: 'white',
      },
      details: {
        css: {
          marginTop: 10,
        },
        text: {
          css: {
            margin: 0,
            fontSize: '20px',
          },
        },
      },
    },
  },

  mobile: {
    css: {
      position: 'fixed',
      top: 0,
    },
  },

  icon: {
    css: {
      color: Colors.fullWhite,
    },
  },

  menu: {
    css: {
      color: Colors.fullBlack,
    },

    paper: {
      css: {
        maxHeight: '300px',
        overflowX: 'hidden',
        overflowY: 'auto',
        textOverflow: 'ellipsis',
      },
    },
  },
};

export class NotificationDropdownComponent extends Component {
  constructor(props) {
    super(props);
    this.closePopover = this.closePopover.bind(this);
    this.togglePopover = this.togglePopover.bind(this);
  }
  togglePopover(event) {
    event.preventDefault();

    this.setState({
      open: !this.state.open,
      anchorEl: event.currentTarget,
    });
  }

  closePopover() {
    this.props.markAllNotificationsRead();
    this.setState({
      open: false,
    });
  }

  joinRoom(notification) {
    browserHistory.push(`/room/${notification.data.room}`);
  }

  render() {
    const { notifications } = this.props;

    return (
      <div style={[GlobalStyles.cell, styles.menu.css]}>
        <IconButton
          iconStyle={styles.icon.css}
          iconClassName="material-icons"
          onTouchTap={this.togglePopover}
        >
          {(!!notifications && notifications.length) ?
            'notifications' : 'notifications_none'}
        </IconButton>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          onRequestClose={this.closePopover}
        >
          <Card style={styles.menu.paper.css}>
            <List>
              {(!!notifications && notifications.length) ?
              _.map(notifications, (item, index) => (
                <ListItem
                  className={item.unread && 'unread'}
                  key={item._id}
                  primaryText={item.data.body}
                  rightIconButton={item.data.active ? <IconButton
                    iconClassName="material-icons"
                    iconStyle={{ color: Colors.teal500 }}
                    onTouchTap={this.joinRoom.bind(this, item)}
                  >
                    {'videocam'}
                  </IconButton> : undefined}
                  secondaryText={moment(item.createdAt).fromNow()}
                />
                )) :

              <ListItem className="text-center">
                {'No notifications'}
              </ListItem>}
            </List>
          </Card>
        </Popover>
      </div>
    );
  }
}

NotificationDropdownComponent.propTypes = {
  notifications: PropTypes.array,
  markAllNotificationsRead: PropTypes.func,
};

NotificationDropdownComponent = Radium(NotificationDropdownComponent);

export class ProfileDropdownComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    this.closePopover = this.closePopover.bind(this);
    this.togglePopover = this.togglePopover.bind(this);
  }

  togglePopover(event) {
    event.preventDefault();

    this.setState({
      open: !this.state.open,
      anchorEl: event.currentTarget,
    });
  }

  closePopover() {
    this.setState({
      open: false,
    });
  }

  render() {
    const { user, logout } = this.props;

    return (
      <div style={[GlobalStyles.cell, styles.menu.css]}>
        <Avatar
          src={user.services.google.picture}
          onTouchTap={this.togglePopover}
        />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          targetOrigin={{ horizontal: 'right', vertical: 'top' }}
          onRequestClose={this.closePopover}
        >
          <Card>
            <CardText>
              {user.profile ? user.profile.name : ''}
            </CardText>
            {user.services && user.services.google &&
              user.services.google.email ? (
                <CardText>
                  {user.services.google.email}
                </CardText>
               ) : undefined
            }
            <CardActions expandable={false} style={{ textAlign: 'center' }}>
              <FlatButton onTouchTap={logout} label="Sign out" />
            </CardActions>
          </Card>
        </Popover>
      </div>
    );
  }
}

ProfileDropdownComponent.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func,
};

ProfileDropdownComponent = Radium(ProfileDropdownComponent);

export class HeaderComponent extends Component {
  constructor(props) {
    super(props);

    this.constructor.childContextTypes = {
      muiTheme: PropTypes.object,
    };

    this.state = { open: false };
    this.loginWithGoogle = this.loginWithGoogle.bind(this);
    this.logout = this.logout.bind(this);
    this.markAllNotificationsRead = this.markAllNotificationsRead.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  loginWithGoogle() {
    this.props.dispatch(Actions.loginWithGoogle());
  }

  logout() {
    this.props.dispatch(Actions.logout());
  }

  markAllNotificationsRead() {
    this.props.dispatch(Actions.markAllNotificationsRead());
  }

  handleToggle() {
    this.setState({ open: !this.state.open });
  }

  handleClose() {
    this.setState({ open: false });
  }

  render() {
    const { mobile, user, notifications, ...other } = _.omit(this.props, [
      'loggingIn', 'subscribed', 'users', 'dispatch',
    ]);

    let loginButton;
    let menuItems;
    let notificationDropdown;
    let profileButtons;

    if (mobile) {
      menuItems = [[
        {
          title: 'Invitations',
          icon: 'drafts',
        }, {
          title: 'Snooze notifications',
          icon: 'notifications_paused',
        }, {
          title: 'Status',
          icon: 'mood',
        },
      ], [
        {
          title: 'Settings',
          icon: 'settings',
        }, {
          title: 'GitHub',
          icon: 'code',
          href: 'https://github.com/srtucker22/glipchat',
          target: '_blank',
        }, {
          title: 'Feedback',
          icon: 'announcement',
          href: 'https://github.com/srtucker22/glipchat/issues/new',
          target: '_blank',
        },
      ], [
        {
          title: 'Logout',
          icon: 'power_settings_new',
          action: this.logout,
        },
      ],
      ];
    }

    if (!!user && !!user.services && !!user.services.google) {
      notificationDropdown = notifications ? (
        <NotificationDropdownComponent
          notifications={notifications}
          markAllNotificationsRead={this.markAllNotificationsRead}
        />
      ) : '';

      profileDropdown = (
        <ProfileDropdownComponent
          user={user}
          logout={this.logout}
        />
      );

      profileButtons = (
        <div style={[GlobalStyles.table]}>
          {notificationDropdown}
          {profileDropdown}
        </div>
      );
    } else {
      loginButton = (<FlatButton
        label="Login with Google"
        onTouchTap={this.loginWithGoogle}
      />);
    }

    let drawer = '';

    if (!!user && mobile) {
      drawer = (<Drawer
        docked={false}
        open={this.state.open}
        onRequestChange={open => this.setState({ open })}
      >
        <div style={[styles.sidenav.profile.css]}>
          <Avatar
            src={!!user.services && !!user.services.google && !!user.services.google.picture ?
                user.services.google.picture :
                'images/profile-default.jpg'}
            style={{ display: 'block' }}
            size={50}
          />
          <div style={styles.sidenav.profile.details.css}>
            <p style={styles.sidenav.profile.details.text.css}>
              {user.profile ? user.profile.name : ''}
            </p>
            {!!user.services && !!user.services.google ?
              <p style={styles.sidenav.profile.details.text.css}>
                {user.services.google.email}
              </p> : <FlatButton
                onTouchTap={this.loginWithGoogle} label="Sign in with Google" style={{
                  color: Colors.fullWhite,
                  marginLeft: '-10px' }}
              />}
          </div>
        </div>
        {_.map(menuItems, (list, index) => {
          const items = (_.map(list, item => (
            <MenuItem
              key={`left-nav-${item.title.toLowerCase()}`}
              primaryText={item.title}
              onTouchTap={item.action}
              href={item.href}
              target={item.target}
              leftIcon={
                <FontIcon
                  className="material-icons"
                  color={Colors.grey600}
                >{item.icon}
                </FontIcon>
                  }
            />
              )));
          if (index !== list.length - 1) {
            items.push(<Divider />);
          }
          return items;
        })}
      </Drawer>);
    }

    return (
      <header>
        <AppBar
          title={''}
          iconElementRight={mobile ? (
            this.props.iconElementRight
          ) : (loginButton || profileButtons)}
          onLeftIconButtonTouchTap={this.handleToggle}
          style={
            _.extend({}, mobile ? styles.mobile.css : styles.css)
          }
          {...other}
        />
        {drawer}
      </header>
    );
  }
}

HeaderComponent.propTypes = {
  dispatch: PropTypes.func,
  iconElementRight: PropTypes.element,
  mobile: PropTypes.bool,
  notifications: PropTypes.array,
  users: PropTypes.object,
};

const mapStateToProps = ({ users: { user }, notifications: { notifications } }) => ({
  user,
  notifications,
});

export default connect(mapStateToProps)(Radium(HeaderComponent));
