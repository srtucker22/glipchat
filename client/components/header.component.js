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
import * as Actions from '../actions/actions';
import { _ } from 'meteor/underscore';
import { connect } from 'react-redux';
import { Meteor } from 'meteor/meteor';
import {Card, CardActions, CardText} from 'material-ui/Card';
import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import Colors from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import GlobalStyles from '../styles/global.styles';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import moment from 'moment';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Radium from 'radium';
import React from 'react';

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

export class NotificationDropdownComponent extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate =
      PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentDidMount() {
    var _this = this;
    this.interval = window.setInterval(function() {
      _this.setState({lastUpdated: new Date()});
    }, 1000);
  }

  componentWillUnmount() {
    if (this.interval) {
      window.clearInterval(this.interval);
    }
  }

  joinRoom(r) {
    //RoomActions.joinRoom(r);
  }

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
            _.map(this.props.history, (item, index)=> {
              return (
                <MenuItem
                  key={`history-${index}`}
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
  }
};

NotificationDropdownComponent.propTypes = {
  history: React.PropTypes.array
};

NotificationDropdownComponent = Radium(NotificationDropdownComponent);

export class ProfileDropdownComponent extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate =
      PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const {user, logout} = this.props;

    return (
      <div className='dropdown' style={[GlobalStyles.cell, styles.menu.css]}>
        {dropdownStyleComponent}
        <Avatar
          className='dropdown-toggle'
          data-toggle='dropdown'
          src={user.services.google.picture}/>
        <Card className='dropdown-menu'>
          <CardText>
            {user.profile.name}
          </CardText>
          {!!user.services.google &&
            !!user.services.google.email &&
            <CardText>
              {user.services.google.email}
            </CardText>
          }
          <CardActions className='text-center' expandable={false}>
            <FlatButton onTouchTap={logout} label='Sign out'/>
          </CardActions>
        </Card>
      </div>
    );
  }
};

ProfileDropdownComponent.propTypes = {
  user: React.PropTypes.object
};

ProfileDropdownComponent = Radium(ProfileDropdownComponent);

export class HeaderComponent extends React.Component {
  constructor(props) {
    super(props);

    this.constructor.childContextTypes = {
      muiTheme: React.PropTypes.object,
    };

    this.state = {open: false};
  }

  loginWithGoogle() {
    this.props.dispatch(Actions.loginWithGoogle());
  }

  logout() {
    this.props.dispatch(Actions.logout());
  }

  handleToggle() {
    this.setState({open: !this.state.open});
  }

  handleClose() {
    this.setState({open: false});
  }

  render() {
    const {mobile, user, ...other} = _.omit(this.props, [
      'loggingIn', 'subscribed', 'users', 'dispatch'
    ]);

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
            href: 'https://github.com/srtucker22/quasar/issues/new',
            target: '_blank'
          }
        ], [
          {
            title: 'Logout',
            icon: 'power_settings_new',
            action: this.logout.bind(this)
          }
        ]
      ];
    }

    if (!!user && !!user.services && !!user.services.google) {
      notificationDropdown = !!user.history ? (
        <NotificationDropdownComponent
          history={user.history.reverse()}/>
      ) : '';

      profileDropdown = (
        <ProfileDropdownComponent
          user={user}
          logout={this.logout.bind(this)}
        />
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
        onTouchTap={this.loginWithGoogle.bind(this)}
      />;
    }

    let drawer = '';

    if (!!user && mobile) {
      drawer = (<Drawer
        docked={false}
        open={this.state.open}
        onRequestChange={open => this.setState({open})}>
          <div style={[styles.sidenav.profile.css]}>
            <Avatar
              src={!!user.services && !!user.services.google && !!user.services.google.picture ?
                user.services.google.picture :
                'images/profile-default.jpg'}
              style={{display: 'block'}}
              size={50}/>
            <div style={styles.sidenav.profile.details.css}>
              <p style={styles.sidenav.profile.details.text.css}>
                {!!user.profile ? user.profile.name : ''}
              </p>
              {!!user.services && !!user.services.google ?
                <p style={styles.sidenav.profile.details.text.css}>
                  {user.services.google.email}
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
      </Drawer>);
    }

    return (
      <header>
        <AppBar
          title={''}
          iconElementRight={!!mobile ? (
            this.props.iconElementRight
          ) : (loginButton ? loginButton : profileButtons)}
          onLeftIconButtonTouchTap={this.handleToggle.bind(this)}
          style={
            _.extend({}, !!mobile ? styles.mobile.css : styles.css)
          }
          {...other}
        />
        {drawer}
      </header>
    );
  }
};

HeaderComponent.propTypes = {
  dispatch: React.PropTypes.func,
  users: React.PropTypes.object,
};

HeaderComponent = Radium(HeaderComponent);

const mapStateToProps = ({users: {user}}) => {
  return {
    user,
  };
};

export default connect(
  mapStateToProps,
)(HeaderComponent);
