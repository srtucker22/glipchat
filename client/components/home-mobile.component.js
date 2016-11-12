import {connect} from 'react-redux';
import {APP_NAME} from '../../lib/config';
import AnswerDialogComponent from './answer-dialog.component';
import Colors from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import HeaderComponent from './header.component';
import IconButton from 'material-ui/IconButton';
import IntroComponent from './intro.component';
import LoadingDialogComponent from './loading-dialog.component';
import Radium from 'radium';
import React from 'react';
import TextField from 'material-ui/TextField';
import ContactListComponent from './contact-list.component';
import * as Actions from '../actions/actions';

const styles = {
  css: {

  },

  content: {
    css: {
      marginTop: '64px',
    },
  },

  icon: {
    css: {
      color: Colors.fullWhite,
    },
  },
};

export class HomeMobileComponent extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      loading: false,
      open: false,
    };
  }

  closeInviteModal() {
    // update the profile name
    !!this.state.name && this.state.name !== this.props.user.profile.name && this.props.dispatch(Actions.updateProfileName(this.state.name));

    this.setState({open: false});
  }

  invite() {
    if(!!this.state.invitees && this.state.invitees.length) {
      !!this.state.name && this.state.name !== this.props.user.profile.name && this.props.dispatch(Actions.updateProfileName(this.state.name));
      this.props.dispatch(Actions.createRoom(this.state.invitees));

      this.setState({loading: true});
    }
  }

  componentWillMount() {
    // NotificationActions.getPermission();
  }

  onContactListChange(invitees) {
    this.setState({invitees});
  }

  openInviteModal() {
    this.setState({open: true});
  }

  updateProfileNameState(e) {
    this.setState({
      name: e.target.value,
    });
  }

  render() {
    const {dispatch, invitations, user} = this.props;

    const contacts = !!user && !!user.services && !!user.services.google && user.services.google.contacts || [];

    const actions = [
      <FlatButton
        label='Cancel'
        secondary={true}
        onTouchTap={this.closeInviteModal.bind(this)}
      />,
      <FlatButton
        label='Invite'
        disabled={!this.state.name && (!user || !user.profile || !user.profile.name)}
        secondary={true}
        keyboardFocused={true}
        onTouchTap={this.invite.bind(this)}
      />,
    ];

    if (!user) {
      return <IntroComponent/>;
    }

    return (<div style={[styles.css]}>
      {this.state.loading ?
        <LoadingDialogComponent open={true} title='Starting video call'/> : ''
      }
      <HeaderComponent mobile={true}
        showMenuIconButton={true}
        iconElementRight={
          (!!this.state.invitees && this.state.invitees.length) ?
          (<IconButton
            iconStyle={styles.icon.css}
            iconClassName='material-icons'
            onTouchTap={this.openInviteModal.bind(this)}>
            done
          </IconButton>) : null}
      />
    <div ref={'content'} style={[styles.content.css]}>
        <ContactListComponent
          onChange={this.onContactListChange.bind(this)}
          isOpen={true}
          contacts={contacts}
          dispatch={dispatch}
        />
      </div>
      <Dialog
        title={'Invite to Video Call?'}
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.closeInviteModal.bind(this)}
      >
        {!user.services || !user.services.google ? <TextField
          defaultValue={this.state.name || (!!user.profile && user.profile.name) || ''}
          onChange={this.updateProfileNameState.bind(this)}
          errorText={(!user.profile || !user.profile.name) && !this.state.name ? ' ' : null}
          floatingLabelText='Your name'/> : ''}
        {`Contacts who are already using ${APP_NAME} will receive a notification. New users will be sent an email request.`}
      </Dialog>
      <AnswerDialogComponent
        invitation={!!invitations && invitations.length ?
          invitations[0] : undefined}/>
    </div>);
  }
};
HomeMobileComponent.propTypes = {
  dispatch: React.PropTypes.func,
  contacts: React.PropTypes.array,
  currentRoom: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.bool,
  ]),
  invitations: React.PropTypes.array,
  user: React.PropTypes.object,
};

HomeMobileComponent = Radium(HomeMobileComponent);

const mapStateToProps = ({rooms: {available}, users: {user}}) => {
  return {
    currentRoom: !available || _.first(available),  // TODO: a little hacky way of getting the room and knowing we are subscribed
    user,
  };
};

export default connect(
  mapStateToProps,
)(HomeMobileComponent);
