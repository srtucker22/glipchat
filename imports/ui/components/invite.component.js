import { CSSTransitionGroup } from 'react-transition-group';
import { red, cyan } from 'material-ui/colors';
import AppBar from 'material-ui/AppBar';
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import Radium from 'radium';
import React from 'react';
import TextField from 'material-ui/TextField';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import * as Actions from '../actions/actions';
import ContactList from './contact-list.component';
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

export class Invite extends React.Component {
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
            open={this.state.getName || false}
            onRequestClose={this.handleClose}
            ignoreBackdropClick
          >
            <DialogTitle>{'Please enter your name'}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                defaultValue={user.profile ? user.profile.name : undefined}
                error={!!user.profile && !!user.profile.name}
                label="Your name"
                margin="dense"
                onChange={this.updateProfileNameState}
              />
            </DialogContent>
            <DialogActions>
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
              </Button>
            </DialogActions>
          </Dialog>
          <AppBar position="static">
            <Toolbar>
              <Typography
                type="title"
                color="inherit"
                style={{ flex: 1 }}
              >
                {'Invite Contacts'}
              </Typography>
              <IconButton
                color="contrast"
                onClick={this.props.hideInviteModal}
              >
                {'clear'}
              </IconButton>
            </Toolbar>
          </AppBar>
          <ContactList
            contacts={contacts}
            dispatch={dispatch}
            onChange={this.onContactListChange}
          />
          <div
            style={[GlobalStyles.table, {
              position: 'fixed',
              width: '100%',
              bottom: 0,
            }]}
          >
            <div style={[GlobalStyles.cell, { width: '50%' }]}>
              <Button
                key="cancel"
                onTouchTap={this.props.hideInviteModal}
                style={{ color: 'white', width: '100%', background: red[500] }}
              >
                {'Cancel'}
              </Button>
            </div>
            <div style={[GlobalStyles.cell, { width: '50%' }]}>
              <Button
                disabled={!this.state.invitees}
                key="invite"
                onTouchTap={this.invite}
                style={{
                  color: 'white',
                  width: '100%',
                  backgroundColor: this.state.invitees ? cyan[500] : cyan[100],
                }}
              >
                {'Invite'}
              </Button>
            </div>
          </div>
        </div> : undefined}
    </CSSTransitionGroup>);
  }
}
Invite.propTypes = {
  dispatch: PropTypes.func,
  invitees: PropTypes.array,
  hideInviteModal: PropTypes.func,
  showInviteModal: PropTypes.bool,
  user: PropTypes.object,
};

export default Radium(Invite);
