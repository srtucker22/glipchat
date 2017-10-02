import { connect } from 'react-redux';
import Button from 'material-ui/Button';
import Dialog, { DialogContent, DialogActions } from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import Radium from 'radium';
import React from 'react';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';

import { APP_NAME } from '../../api/lib/config';
import * as Actions from '../actions/actions';
import AnswerDialogComponent from './answer-dialog.component';
import ContactListComponent from './contact-list.component';
import HeaderComponent from './header.component';
import IntroComponent from './intro.component';
import LoadingDialogComponent from './loading-dialog.component';

const styles = {
  content: {
    css: {
      marginTop: '64px',
      width: '100%',
    },
  },
};

export class HomeMobileComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      open: false,
    };

    this.closeInviteModal = this.closeInviteModal.bind(this);
    this.invite = this.invite.bind(this);
    this.onContactListChange = this.onContactListChange.bind(this);
    this.openInviteModal = this.openInviteModal.bind(this);
    this.updateProfileNameState = this.updateProfileNameState.bind(this);
  }

  closeInviteModal() {
    console.log('closeInviteModal');
    // update the profile name
    if (this.state.name && this.state.name !== this.props.user.profile.name) {
      this.props.dispatch(Actions.updateProfileName(this.state.name));
    }

    this.setState({ open: false });
  }

  invite() {
    if (this.state.invitees && this.state.invitees.length) {
      if (this.state.name &&
        (!this.props.user.profile || this.state.name !== this.props.user.profile.name)) {
        this.props.dispatch(Actions.updateProfileName(this.state.name));
      }
      this.props.dispatch(Actions.createRoom(this.state.invitees));

      this.setState({ loading: true });
    }
  }

  componentWillMount() {
    // NotificationActions.getPermission();
  }

  onContactListChange(invitees) {
    this.setState({ invitees });
  }

  openInviteModal() {
    console.log('openInviteModal');
    this.setState({ open: true });
  }

  updateProfileNameState(e) {
    this.setState({
      name: e.target.value,
    });
  }

  render() {
    const { dispatch, invitations, user } = this.props;

    let contacts = [];
    if (user && user.services && user.services.google) {
      contacts = user.services.google.contacts;
    }

    if (!user) {
      return <IntroComponent />;
    }

    const loadingComponent = this.state.loading ?
      <LoadingDialogComponent open title="Starting video call" /> : undefined;

    return (<div style={[styles.css]}>
      {loadingComponent}
      <HeaderComponent
        mobile
        iconElementRight={
          (!!this.state.invitees && this.state.invitees.length) ?
            (
              <IconButton
                style={{ marginRight: -12 }}
                color="contrast"
                onClick={this.openInviteModal}
              >
                {'done'}
              </IconButton>
            ) :
            undefined
        }
      />
      <div ref={'content'} style={[styles.content.css]}>
        <ContactListComponent
          onChange={this.onContactListChange}
          isOpen
          contacts={contacts}
          dispatch={dispatch}
        />
      </div>
      <Dialog
        title={'Invite to Video Call?'}
        open={this.state.open}
        onRequestClose={this.closeInviteModal}
      >
        <DialogContent>
          {!user.services || !user.services.google ?
            <TextField
              defaultValue={this.state.name || (!!user.profile && user.profile.name) || ''}
              onChange={this.updateProfileNameState}
              error={(!user.profile || !user.profile.name) && !this.state.name}
              label="Your name"
            /> : undefined}
          <Typography>
            {`Contacts who are already using ${APP_NAME} will receive a notification. New users will be sent an email request.`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            color="accent"
            onClick={this.closeInviteModal}
          >
            {'Cancel'}
          </Button>,
          <Button
            disabled={!this.state.name && (!user || !user.profile || !user.profile.name)}
            color="primary"
            onClick={this.invite}
          >
            {'Invite'}
          </Button>,
        </DialogActions>
      </Dialog>
      <AnswerDialogComponent
        invitation={!!invitations && invitations.length ?
          invitations[0] : undefined}
      />
    </div>);
  }
}

HomeMobileComponent.propTypes = {
  dispatch: PropTypes.func,
  contacts: PropTypes.array,
  invitations: PropTypes.array,
  user: PropTypes.object,
};

const mapStateToProps = ({ users: { user } }) => ({ user });

export default connect(mapStateToProps)(Radium(HomeMobileComponent));
