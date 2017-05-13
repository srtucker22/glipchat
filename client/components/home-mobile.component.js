import { connect } from 'react-redux';
import Colors from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import PropTypes from 'prop-types';
import Radium from 'radium';
import React from 'react';
import TextField from 'material-ui/TextField';
import { APP_NAME } from '../../lib/config';
import * as Actions from '../actions/actions';
import AnswerDialogComponent from './answer-dialog.component';
import ContactListComponent from './contact-list.component';
import HeaderComponent from './header.component';
import IntroComponent from './intro.component';
import LoadingDialogComponent from './loading-dialog.component';

const styles = {
  css: {

  },

  content: {
    css: {
      marginTop: '64px',
      width: '100%',
    },
  },

  icon: {
    css: {
      color: Colors.fullWhite,
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

    const actions = [
      <FlatButton
        label="Cancel"
        secondary
        onTouchTap={this.closeInviteModal}
      />,
      <FlatButton
        label="Invite"
        disabled={!this.state.name && (!user || !user.profile || !user.profile.name)}
        secondary
        keyboardFocused
        onTouchTap={this.invite}
      />,
    ];

    if (!user) {
      return <IntroComponent />;
    }

    return (<div style={[styles.css]}>
      {this.state.loading ?
        <LoadingDialogComponent open title="Starting video call" /> : ''
      }
      <HeaderComponent
        mobile
        showMenuIconButton
        iconElementRight={
          (!!this.state.invitees && this.state.invitees.length) ? (
            <IconButton
              iconStyle={styles.icon.css}
              iconClassName="material-icons"
              onTouchTap={this.openInviteModal}
            >
              done
            </IconButton>
          ) : null}
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
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.closeInviteModal}
      >
        {!user.services || !user.services.google ?
          <TextField
            defaultValue={this.state.name || (!!user.profile && user.profile.name) || ''}
            onChange={this.updateProfileNameState}
            errorText={(!user.profile || !user.profile.name) && !this.state.name ? ' ' : null}
            floatingLabelText="Your name"
          /> : ''}
        {`Contacts who are already using ${APP_NAME} will receive a notification. New users will be sent an email request.`}
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
