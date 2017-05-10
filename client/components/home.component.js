import { connect } from 'react-redux';
import Browser from 'bowser';
import Colors from 'material-ui/styles/colors';
import PropTypes from 'prop-types';
import Radium from 'radium';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import { APP_NAME, COMPANY, GITHUB_URL } from '../../lib/config';
import * as Actions from '../actions/actions';
import DownloadButtonComponent from './download-button.component';
import FooterComponent from './footer.component';
import GithubComponent from './github.component';
import GlobalStyles from '../styles/global.styles';
import HeaderComponent from './header.component';
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
    minHeight: '500px',
  },

  title: {
    css: {
      color: Colors.fullWhite,
      fontSize: '80px',
      textShadow: '2px 2px rgba(0, 0, 0, 0.5)',
    },
  },
};

export class HomeComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  createRoom() {
    this.props.dispatch(Actions.createRoom());

    this.setState({
      loading: true,
    });

    this.createRoom = this.createRoom.bind(this);
  }

  render() {
    return (
      <div style={[styles.css]}>
        <GithubComponent link={GITHUB_URL} />
        {this.state.loading ?
          <LoadingDialogComponent open title="Starting video call" /> : ''
        }
        <div style={[GlobalStyles.stickyFooterPage]}>
          <HeaderComponent showMenuIconButton={false} />
          <div>
            <div className="col-xs-12 text-center">
              <h1 style={[styles.title.css]}>{APP_NAME}</h1>
              <br />
              <RaisedButton
                onClick={this.createRoom}
                label="Start video call"
                secondary
                style={{ marginBottom: '50px' }}
              />
              <br />
              {(Browser.mac && !Browser.electron) ?
                <DownloadButtonComponent platform="mac" /> : ''}
            </div>
          </div>
        </div>
        <FooterComponent company={COMPANY} />
      </div>
    );
  }
}

HomeComponent.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(Radium(HomeComponent));
