import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Colors from 'material-ui/colors';
import Radium from 'radium';
import Button from 'material-ui/Button';
import React from 'react';
import { APP_NAME, GITHUB_URL } from '../../api/lib/config';
import * as Actions from '../actions/actions';
import Github from './github.component';
import GlobalStyles from '../styles/global.styles';
import LoadingDialog from './loading-dialog.component';

const styles = {
  css: {
    backgroundAttachment: 'fixed',
    backgroundImage: 'url(images/quasar.jpg)',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    color: 'white',
    height: '100%',
    width: '100%',
  },

  title: {
    css: {
      color: 'white',
      fontSize: '80px',
      textShadow: '2px 2px rgba(0, 0, 0, 0.5)',
    },
  },
};

export class Intro extends React.PureComponent {
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
        <Github link={GITHUB_URL} />
        <LoadingDialog
          open={user && user.loggingIn}
          title="Signing in"
        />
        <div className="text-center" style={[GlobalStyles.cell]}>
          <h1 style={[styles.title.css]}>{APP_NAME}</h1>
          <br />
          <Button
            raised
            onTouchTap={this.loginWithGoogle}
            color="accent"
            style={{ marginBottom: '20px' }}
          >
            {'Sign in with Google'}
          </Button>
          <br />
          <Button
            raised
            onTouchTap={this.loginAsGuest}
            color="accent"
            style={{ marginBottom: '50px' }}
          >
            {'Continue as guest'}
          </Button>
        </div>
      </div>
    );
  }
}

Intro.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.shape({ loggingIn: PropTypes.bool }),
};

const mapStateToProps = ({ users: { user } }) => ({
  user,
});

export default connect(
  mapStateToProps,
)(Radium(Intro));
