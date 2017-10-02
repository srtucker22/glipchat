import { _ } from 'meteor/underscore';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import List, { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from 'material-ui/List';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Colors from 'material-ui/colors';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Menu, { MenuItem } from 'material-ui/Menu';
import moment from 'moment';
import Popover from 'material-ui/Popover/Popover';
import PropTypes from 'prop-types';
import Radium from 'radium';
import React, { Component, PureComponent } from 'react';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

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

  menu: {
    css: {
      color: 'black',
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

    let notificationListItems = (
      <ListItem className="text-center">
        <ListItemText
          primary={'No notifications'}
        />
      </ListItem>
    );

    if (!!notifications && notifications.length) {
      notificationListItems = _.map(notifications, item => (
        <ListItem
          button
          className={item.unread && 'unread'}
          key={item._id}
        >
          <ListItemText
            primary={item.data.body}
            secondary={moment(item.createdAt).fromNow()}
          />
          {item.data.active ? (
            <ListItemSecondaryAction>
              <IconButton
                aria-label="Join Room"
                onTouchTap={this.joinRoom.bind(this, item)}
              >
                {'videocam'}
              </IconButton>
            </ListItemSecondaryAction>
          ) : undefined}
        </ListItem>
      ));
    }

    return (
      <div style={[GlobalStyles.cell, styles.menu.css]}>
        <IconButton
          color="contrast"
          onTouchTap={this.togglePopover}
        >
          <Icon>
            {(!!notifications && notifications.length) ?
              'notifications' : 'notifications_none'}
          </Icon>
        </IconButton>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          onRequestClose={this.closePopover}
        >
          <Card style={styles.menu.paper.css}>
            <List>
              {notificationListItems}
            </List>
          </Card>
        </Popover>
      </div>
    );
  }
}

NotificationDropdownComponent.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.shape({
    unread: PropTypes.bool,
    data: PropTypes.object,
    createdAt: PropTypes.date,
  })),
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
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          onRequestClose={this.closePopover}
        >
          <Card>
            <CardContent>
              <Typography>
                {user.profile ? user.profile.name : ''}
              </Typography>
              {user.services && user.services.google &&
                user.services.google.email ? (
                  <Typography>
                    {user.services.google.email}
                  </Typography>
                ) : undefined
              }
            </CardContent>
            <CardActions style={{ textAlign: 'center' }}>
              <Button onTouchTap={logout}>
                {'Sign out'}
              </Button>
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

export class Header extends Component {
  constructor(props) {
    super(props);

    this.constructor.childContextTypes = {
      muiTheme: PropTypes.object,
    };

    this.state = { open: false };
    this.handleClose = this.handleClose.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.loginWithGoogle = this.loginWithGoogle.bind(this);
    this.logout = this.logout.bind(this);
    this.markAllNotificationsRead = this.markAllNotificationsRead.bind(this);
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
    const { mobile, user, notifications } = this.props;

    let loginButton;
    let drawerItems;
    let notificationDropdown;
    let profileButtons;
    let profileDropdown;

    if (mobile) {
      drawerItems = [[
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
      loginButton = (
        <Button
          color="contrast"
          onTouchTap={this.loginWithGoogle}
        >
          {'Login with Google'}
        </Button>
      );
    }

    let drawer;

    if (!!user && mobile) {
      drawer = (<Drawer
        open={this.state.open}
        onRequestClose={this.handleClose}
        type="temporary"
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
              </p> : <Button
                onTouchTap={this.loginWithGoogle}
                style={{
                  color: 'white',
                  marginLeft: '-10px',
                }}
              >
                {'Sign in with Google'}
              </Button>
            }
          </div>
        </div>
        <List>
          {_.map(drawerItems, (list, index) => {
            const items = (_.map(list, item => (
              <ListItem
                button
                onTouchTap={item.action}
                key={`left-nav-${item.title.toLowerCase()}`}
                href={item.href}
                target={item.target}
              >
                {item.icon ? (
                  <ListItemIcon>
                    <Icon>{item.icon}</Icon>
                  </ListItemIcon>
                ) : undefined}
                <ListItemText inset primary={item.title} />
              </ListItem>
            )));
            if (index !== list.length - 1) {
              items.push(<Divider />);
            }
            return items;
          })}
        </List>
      </Drawer>);
    }

    return (
      <header>
        {drawer}
        <AppBar style={mobile ? styles.mobile.css : styles.css}>
          <Toolbar>
            {mobile ? (
              <IconButton
                color="contrast"
                aria-label="Menu"
                style={{
                  marginLeft: -12,
                  marginRight: 20,
                }}
                onClick={this.handleToggle}
              >
                {'menu'}
              </IconButton>) : undefined
            }
            <Typography type="title" color="inherit" style={{ flex: 1 }} />
            {mobile ? (
              this.props.iconElementRight
            ) : (loginButton || profileButtons)}
          </Toolbar>
        </AppBar>
      </header>
    );
  }
}

Header.propTypes = {
  dispatch: PropTypes.func,
  iconElementRight: PropTypes.element,
  mobile: PropTypes.bool,
  notifications: PropTypes.arrayOf(PropTypes.shape({
    unread: PropTypes.bool,
    data: PropTypes.object,
    createdAt: PropTypes.date,
  })),
  user: PropTypes.object,
};

const mapStateToProps = ({ users: { user }, notifications: { notifications } }) => ({
  user,
  notifications,
});

export default connect(mapStateToProps)(Radium(Header));
