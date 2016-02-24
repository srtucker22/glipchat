/**
 * quasar
 *
 * Copyright (c) 2015 Glipcode http://glipcode.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions
 * of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

// Dependencies
import moment from 'moment';
import MUI from 'material-ui';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Radium from 'radium';
import React from 'react';

const {
  AppBar,
  Avatar,
  Card,
  CardActions,
  CardText,
  Divider,
  FlatButton,
  FontIcon,
  IconButton,
  IconMenu,
  LeftNav,
  Menu,
  MenuItem,
  Styles: {Colors}
} = MUI;

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
        color: 'white'
      },
      details: {
        css: {
          marginTop: 10
        },
        text: {
          css: {
            margin: 0,
            fontSize: '20px'
          }
        }
      }
    }
  },

  mobile: {
    css: {
      position: 'fixed',
      top: 0
    }
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
  }
};

let Style = Radium.Style;
let dropdownStyleComponent = (
  <Style
    scopeSelector='.dropdown'
    rules={{
      '.dropdown-menu': {
        left: 'inherit',
        right: 0,
      },

      '.dropdown-toggle': {
        cursor: 'pointer',
      },
    }}
  />
);

let GlobalStyles;
let RoomActions;
let UserStore;
let UserActions;

Dependency.autorun(()=> {
  GlobalStyles = Dependency.get('GlobalStyles');
  RoomActions = Dependency.get('RoomActions');
  UserStore   = Dependency.get('UserStore');
  UserActions = Dependency.get('UserActions');
});

let NotificationDropdownComponent = Radium(React.createClass({
  mixins: [PureRenderMixin],
  componentDidMount() {
    var _this = this;
    this.interval = window.setInterval(function() {
      _this.setState({lastUpdated: new Date()});
    }, 1000);
  },

  componentWillUnmount() {
    if (this.interval) {
      window.clearInterval(this.interval);
    }
  },

  joinRoom(r) {
    RoomActions.joinRoom(r);
  },

  render() {
    return (
      <div className='dropdown' style={[GlobalStyles.cell, styles.menu.css]}>
        {dropdownStyleComponent}
        <IconButton
          iconStyle={styles.icon.css}
          iconClassName='material-icons dropdown-toggle' data-toggle='dropdown'>
          {(this.props.history && this.props.history.length) ?
            'notifications' : 'notifications_none'}
        </IconButton>
        <Card className='dropdown-menu' style={styles.menu.paper.css}>
          {(!!this.props.history && this.props.history.length) ?
            _.map(this.props.history, (item)=> {
              return (
                <MenuItem
                  key={item.createdAt}
                  primaryText={item.room +
                    ' - ' + moment(item.createdAt).fromNow()}
                  onTouchTap={this.joinRoom.bind(this, item.room)} />
              );
            }) :

            <MenuItem className='text-center'>
              No recent rooms
            </MenuItem>}
        </Card>
      </div>
    );
  },
}));

let ProfileDropdownComponent = Radium(React.createClass({
  mixins: [PureRenderMixin],

  logout() {
    UserActions.logout();
  },

  render() {
    return (
      <div className='dropdown' style={[GlobalStyles.cell, styles.menu.css]}>
        {dropdownStyleComponent}
        <Avatar
          className='dropdown-toggle'
          data-toggle='dropdown'
          src={this.props.user.services.google.picture}/>
        <Card className='dropdown-menu'>
          <CardText>
            {this.props.user.profile.name}
          </CardText>
          {!!this.props.user.services.google &&
            !!this.props.user.services.google.email &&
            <CardText>
              {this.props.user.services.google.email}
            </CardText>
          }
          <CardActions className='text-center' expandable={false}>
            <FlatButton onTouchTap={this.logout} label='Sign out'/>
          </CardActions>
        </Card>
      </div>
    );
  },
}));

export default HeaderComponent = Radium(React.createClass({
  mixins: [ReactMeteorData],

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getInitialState() {
    return {open: false};
  },

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

  handleToggle() {
    this.setState({open: !this.state.open});
  },

  handleClose() {
    this.setState({open: false});
  },

  render() {

    let {mobile, ...other} = this.props;

    let avatarButton;
    let loginButton;
    let menuItems;
    let notificationDropdown;
    let profileButtons;

    if (mobile) {
      menuItems = [[
          {
            title: 'Invitations',
            icon: 'drafts'
          }, {
            title: 'Snooze notifications',
            icon: 'notifications_paused'
          }, {
            title: 'Status',
            icon: 'mood'
          }
        ], [
          {
            title: 'Settings',
            icon: 'settings'
          }, {
            title: 'GitHub',
            icon: 'code',
            href: 'https://github.com/srtucker22/quasar',
            target: '_blank'
          }, {
            title: 'Feedback',
            icon: 'announcement',
            href: 'https://www.facebook.com/groups/165149990531759/',
            target: '_blank'
          }
        ], [
          {
            title: 'Logout',
            icon: 'power_settings_new',
            action: UserActions.logout
          }
        ]
      ];
    }

    if (!UserStore.loggingIn() && this.data.subscribed) {
      if (!!this.data.user && !UserStore.isGuest()) {

        notificationDropdown = !!this.data.user.history ? (
          <NotificationDropdownComponent
            history={this.data.user.history.reverse()}/>
        ) : '';

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
        loginButton = <FlatButton
          label='Login with Google'
          onTouchTap={this.loginWithGoogle}
        />;
      }
    }
    return (
      <header>
        <AppBar
          title={''}
          iconElementRight={mobile ? (
            this.props.iconElementRight
          ) :
            (loginButton ? loginButton : profileButtons)}
          onLeftIconButtonTouchTap={this.handleToggle}
          style={_.extend({}, mobile ? styles.mobile.css : styles.css)}
          {...other}/>
        {!!this.data.user && mobile ? (
          <LeftNav
          docked={false}
          open={this.state.open}
          onRequestChange={open => this.setState({open})}>
            <div style={[styles.sidenav.profile.css]}>
              <Avatar
                src={!UserStore.isGuest() &&
                  !!this.data.user.services.google.picture ?
                  this.data.user.services.google.picture :
                  'images/profile-default.jpg'}
                style={{display: 'block'}}
                size={50}/>
              <div style={styles.sidenav.profile.details.css}>
                <p style={styles.sidenav.profile.details.text.css}>
                  {this.data.user.profile.name}
                </p>
                {!UserStore.isGuest() ?
                  <p style={styles.sidenav.profile.details.text.css}>
                    {this.data.user.services.google.email}
                  </p> : <FlatButton onTouchTap={this.loginWithGoogle} label='Sign in with Google' style={{
                    color: Colors.fullWhite,
                    marginLeft: '-10px'}}/>}
              </div>
            </div>
            {_.map(menuItems, (list, index)=> {
              let items = (_.map(list, (item)=> {
                return (
                  <MenuItem
                    key={'left-nav-' + item.title.toLowerCase()}
                    primaryText={item.title}
                    onTouchTap={item.action}
                    linkButton={!!item.href}
                    href={item.href}
                    target={item.target}
                    leftIcon={
                      <FontIcon
                        className='material-icons'
                        color={Colors.grey600}>{item.icon}
                      </FontIcon>
                    }
                  />
                );
              }));
              index !== list.length - 1 && items.push(<Divider />);
              return items;
            })}
        </LeftNav>) : ''}
      </header>
    );
  },
}));
