import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Colors from 'material-ui/styles/colors';
import Radium from 'radium';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import { APP_NAME, GITHUB_URL } from '../../lib/config';
import * as Actions from '../actions/actions';
import GithubComponent from './github.component';
import GlobalStyles from '../styles/global.styles';
import LoadingDialogComponent from './loading-dialog.component';

const styles = {
  css: {
    backgroundAttachment: 'fixed',
    backgroundImage: 'url(images/quasar.jpg)',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    color: Colors.fullWhite,
    height: '100%',
    width: '100%',
  },

  title: {
    css: {
      color: Colors.fullWhite,
      fontSize: '80px',
      textShadow: '2px 2px rgba(0, 0, 0, 0.5)',
    },
  },
};

export class IntroComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.loginAsGuest = this.loginAsGuest.bind(this);
    this.loginWithGoogle = this.loginWithGoogle.bind(this);
  }

  loginAsGuest() {
    // UserActions.loginAsGuest();
    this.props.dispatch(Actions.loginAsGuest());
  }

  loginWithGoogle() {
    this.props.dispatch(Actions.loginWithGoogle());
  }

  render() {
    const { user } = this.props;
    return (
      <div style={[GlobalStyles.table, styles.css]}>
        <GithubComponent link={GITHUB_URL} />
        <LoadingDialogComponent
          open={user && user.loggingIn}
          title="Signing in"
        />
        <div className="text-center" style={[GlobalStyles.cell]}>
          <h1 style={[styles.title.css]}>{APP_NAME}</h1>
          <br />
          <RaisedButton
            onTouchTap={this.loginWithGoogle}
            label="Sign in with Google"
            secondary
            style={{ marginBottom: '20px' }}
          />
          <br />
          <RaisedButton
            onTouchTap={this.loginAsGuest}
            label="Continue as guest"
            secondary
            style={{ marginBottom: '50px' }}
          />
        </div>
      </div>
    );
  }
}

IntroComponent.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.shape({ loggingIn: PropTypes.bool }).isRequired,
};

const mapStateToProps = ({ users: { user } }) => ({
  user,
});

export default connect(
  mapStateToProps,
)(Radium(IntroComponent));
