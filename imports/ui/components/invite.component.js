import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import Colors from 'material-ui/colors';
import Dialog from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Radium from 'radium';
import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import TextField from 'material-ui/TextField';
import * as Actions from '../actions/actions';
import ContactListComponent from './contact-list.component';
import GlobalStyles from '../styles/global.styles';

const styles = {
  css: {
    background: 'white',
    height: '100%',
    left: 0,
    overflow: 'scroll',
    position: 'fixed',
    width: '100%',
    zIndex: 5,
  },
};

export class InviteComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      getName: !props.user.profile || !props.user.profile.name,
    };

    this.handleClose = this.handleClose.bind(this);
    this.invite = this.invite.bind(this);
    this.onContactListChange = this.onContactListChange.bind(this);
    this.updateProfileName = this.updateProfileName.bind(this);
    this.updateProfileNameState = this.updateProfileNameState.bind(this);
  }

  onTypeaheadChange(state) {
    this.setState({
      invitees: state.invitees,
    });
  }

  onContactListChange(invitees) {
    this.setState({ invitees });
  }

  invite() {
    this.props.dispatch(Actions.inviteUsersToRoom(this.state.invitees));
    this.props.hideInviteModal();
  }

  handleClose() {
    this.setState({
      getName: false,
    });
  }

  updateProfileNameState(e) {
    this.setState({
      name: e.target.value,
    });
  }

  updateProfileName() {
    if (this.state.name &&
      (!this.props.user.profile || this.state.name !== this.props.user.profile.name)) {
      this.props.dispatch(Actions.updateProfileName(this.state.name));
    }
    this.setState({ getName: false });
  }

  render() {
    const { user, dispatch } = this.props;

    // get the contacts
    let contacts = [];
    if (user && user.services && user.services.google) {
      contacts = user.services.google.contacts;
    }

    // Custom Actions
    const dialogActions = [
      <Button
        key="cancel"
        onTouchTap={this.props.hideInviteModal}
      >
        {'Cancel'}
      </Button>,
      <Button
        key="update"
        disabled={(!this.state.name && (!user.profile || !user.profile.name))}
        color="accent"
        onTouchTap={this.updateProfileName}
      >
        {'Update'}
      </Button>,
    ];

    return (<CSSTransitionGroup
      transitionName="invite-modal"
      transitionEnterTimeout={300}
      transitionLeaveTimeout={300}
    >
      {this.props.showInviteModal ?
        <div
          className="invite-modal"
          key="invite-modal"
          style={[styles.css]}
        >
          <Dialog
            title={'Please enter your name'}
            actions={dialogActions}
            modal={false}
            open={this.state.getName || false}
            onRequestClose={this.handleClose}
          >
            <TextField
              defaultValue={user.profile ? user.profile.name : ''}
              onChange={this.updateProfileNameState}
              errorText={user.profile && user.profile.name ? ' ' : null}
              floatingLabelText="Your name"
            />
          </Dialog>
          <AppBar
            showMenuIconButton={false}
            title={'Invite Contacts'}
            iconElementRight={<IconButton
              iconClassName="material-icons"
              onTouchTap={this.props.hideInviteModal}
            >
            clear
          </IconButton>}
          />
          <ContactListComponent
            contacts={contacts}
            dispatch={dispatch}
            onChange={this.onContactListChange}
          />
          {this.state.invitees ? (
            <div
              style={[GlobalStyles.table, {
                position: 'fixed',
                width: '100%',
                bottom: 0,
              }]}
            >
              <div style={[GlobalStyles.cell, { width: '50%' }]}>
                <Button
                  backgroundColor={Colors.red500}
                  key="cancel"
                  onTouchTap={this.props.hideInviteModal}
                  style={{ color: 'white', width: '100%' }}
                >
                  {'Cancel'}
                </Button>
              </div>
              <div style={[GlobalStyles.cell, { width: '50%' }]}>
                <Button
                  backgroundColor={Colors.cyan500}
                  key="invite"
                  onTouchTap={this.invite}
                  style={{ color: 'white', width: '100%' }}
                >
                  {'Invite'}
                </Button>
              </div>
            </div>
        ) : undefined}
        </div> : undefined}
    </CSSTransitionGroup>);
  }
}
InviteComponent.propTypes = {
  dispatch: PropTypes.func,
  invitees: PropTypes.array,
  hideInviteModal: PropTypes.func,
  showInviteModal: PropTypes.bool,
  user: PropTypes.object,
};

export default Radium(InviteComponent);
