import { connect } from 'react-redux';
import Browser from 'bowser';
import Colors from 'material-ui/colors';
import PropTypes from 'prop-types';
import Radium from 'radium';
import Button from 'material-ui/Button';
import React from 'react';
import { APP_NAME, COMPANY, GITHUB_URL, DOWNLOAD_URLS } from '../../api/lib/config';
import * as Actions from '../actions/actions';
import DownloadButton from './download-button.component';
import Footer from './footer.component';
import Github from './github.component';
import GlobalStyles from '../styles/global.styles';
import Header from './header.component';
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
    minHeight: '500px',
  },

  title: {
    css: {
      color: 'white',
      fontSize: '80px',
      textShadow: '2px 2px rgba(0, 0, 0, 0.5)',
      marginTop: '64px',
    },
  },
};

export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };

    this.createRoom = this.createRoom.bind(this);
  }

  createRoom() {
    this.props.dispatch(Actions.createRoom());

    this.setState({
      loading: true,
    });
  }

  render() {
    const loading = this.state.loading ?
      <LoadingDialog open title="Starting video call" /> : undefined;

    return (
      <div style={[styles.css]}>
        <Github link={GITHUB_URL} />
        {loading}
        <div style={[GlobalStyles.stickyFooterPage]}>
          <Header showMenuIconButton={false} />
          <div>
            <div className="col-xs-12 text-center">
              <h1 style={[styles.title.css]}>{APP_NAME}</h1>
              <br />
              <Button
                raised
                onClick={this.createRoom}
                color="accent"
                style={{ marginBottom: '50px' }}
              >
                {'Start video call'}
              </Button>
              <br />
              {(Browser.mac && !Browser.electron) ?
                <DownloadButton platform="mac" link={DOWNLOAD_URLS.mac} /> : ''}
            </div>
          </div>
        </div>
        <Footer company={COMPANY} />
      </div>
    );
  }
}

Home.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

export default connect()(Radium(Home));
