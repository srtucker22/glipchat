import {connect} from 'react-redux';
import {APP_NAME, GITHUB_URL} from '../../lib/config';
import * as Actions from '../actions/actions';
import Colors from 'material-ui/styles/colors';
import GithubComponent from './github.component';
import GlobalStyles from '../styles/global.styles';
import LoadingDialogComponent from './loading-dialog.component';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Radium from 'radium';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';

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

export class IntroComponent extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate =
      PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  loginAsGuest() {
    // UserActions.loginAsGuest();
    this.props.dispatch(Actions.loginAsGuest());
  }

  loginWithGoogle() {
    this.props.dispatch(Actions.loginWithGoogle());
  }

  render() {
    const {user} = this.props;
    return (
      <div style={[GlobalStyles.table, styles.css]}>
        <GithubComponent link={GITHUB_URL}/>
        <LoadingDialogComponent
          open={!!user && !!user.loggingIn}
          title='Signing in'/>
        <div className='text-center' style={[GlobalStyles.cell]}>
          <h1 style={[styles.title.css]}>{APP_NAME}</h1>
          <br />
          <RaisedButton
            onTouchTap={this.loginWithGoogle.bind(this)}
            label='Sign in with Google'
            secondary={true}
            style={{marginBottom: '20px'}}
          />
          <br/>
          <RaisedButton
            onTouchTap={this.loginAsGuest.bind(this)}
            label='Continue as guest'
            secondary={true}
            style={{marginBottom: '50px'}}
          />
        </div>
      </div>
    );
  }
};

IntroComponent = Radium(IntroComponent);

const mapStateToProps = ({users: {user}}) => {
  return {
    user,
  };
};

export default connect(
  mapStateToProps,
)(IntroComponent);
