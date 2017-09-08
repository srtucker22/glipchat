import { browserHistory } from 'react-router';
import Browser from 'bowser';
import Colors from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';
import PropTypes from 'prop-types';
import Radium from 'radium';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import GlobalStyles from '../styles/global.styles';
import DownloadButtonComponent from './download-button.component';

const styles = {
  css: {

  },

  general: {
    css: {
      color: Colors.fullWhite,
      fontSize: '20px',
      fontWeight: 'bold',
    },

    icon: {
      css: {
        display: 'block',
        margin: '20px auto',
      },
    },
  },

  permissionDenied: {
    css: {
      color: Colors.fullWhite,
      fontSize: '20px',
      margin: 'auto',
      maxWidth: '800px',
    },

    arrow: {
      css: {
        padding: 0,
        width: '100px',
      },
    },

    icon: {
      css: {
        top: '4px',
      },
    },

    cell: {
      css: {
        padding: '50px 0 0 0',
      },
    },
  },
};

// Ask for permission to use the camera and microphone on the user's computer
export const PermissionDeniedComponent = ({ action }) => (
  <div style={[styles.permissionDenied.css]}>
    <div className="row">
      <div className="col-xs-12 text-center" style={[GlobalStyles.table]}>
        <img
          style={[
            GlobalStyles.cell,
            styles.permissionDenied.cell.css,
            styles.permissionDenied.arrow.css,
          ]}
          src="/images/arrow-left.png"
        />
        <div style={[GlobalStyles.cell, styles.permissionDenied.cell.css]}>
            Click the <FontIcon
              className="material-icons"
              style={styles.permissionDenied.icon.css}
              color={Colors.red500}
            >
              videocam_off
            </FontIcon> {'icon in the URL bar above to give access to your computers camera and microphone.'}
        </div>
        <img
          style={[
            GlobalStyles.cell,
            styles.permissionDenied.cell.css,
            styles.permissionDenied.arrow.css,
          ]} src="/images/arrow-right.png"
        />
      </div>
      <div className="col-xs-12 text-center">
        <br />
        <RaisedButton
          label="Go Back"
          onClick={action}
          secondary
        />
      </div>
    </div>
  </div>
);
PermissionDeniedComponent.propTypes = {
  action: PropTypes.func,
};
const PermissionDenied = Radium(PermissionDeniedComponent);

// Warn that the user is already connected to the room in a different window, tab or browser
export const DuplicateErrorComponent = ({ action }) => (
  <div className="row" style={[styles.general.css]}>
    <div className="col-xs-12 text-center">
      <img src="/images/camel.png" style={[styles.general.icon.css]} />
      <p>{'You are already connected to this room in a different window, tab, or browser.'}</p>
      <p>{'To fix this problem you can try returning to that view of this room.'}</p>
      <br />
      <RaisedButton
        label="Go Back"
        onClick={action}
        secondary
      />
    </div>
  </div>
);
DuplicateErrorComponent.propTypes = {
  action: PropTypes.func,
};
const DuplicateError = Radium(DuplicateErrorComponent);

// Warn that there has been a general error and ask the user to refresh the session
export const GeneralErrorComponent = ({ action }) => (
  <div className="row" style={[styles.general.css]}>
    <div className="col-xs-12 text-center">
      <img
        src="/images/atomic.png" style={[styles.general.icon.css]}
      />
      <p>{'Something went wrong. Please try refreshing the page.'}</p>
      <p>{'If this does not fix the problem please close the tab or window and try again.'}</p>
      <br />
      <RaisedButton
        label="Go Back"
        onClick={action}
        secondary
      />
    </div>
  </div>
  );
GeneralErrorComponent.propTypes = {
  action: PropTypes.func,
};
const GeneralError = Radium(GeneralErrorComponent);

// Alert the user that their browser is not supported and suggest they try Chrome or Firefox
export const NotSupportedErrorComponent = ({ action }) => (
  <div className="row" style={[styles.general.css]}>
    <div className="col-xs-12 text-center">
      <img src="/images/astronaut.png" style={[styles.general.icon.css]} />
      <p>{'Sorry, we do not currently support your browser.'}</p>
      <p>You can download <a href="https://www.google.com/chrome/">Google Chrome</a> or <a href="https://www.mozilla.org/firefox">Mozilla Firefox</a> for free to use this video chatroom.</p>
      <br />
      {(Browser.mac && !Browser.electron) ?
        <DownloadButtonComponent platform="mac" /> : ''}
      <br />
      <RaisedButton
        label="Go Back"
        onClick={action}
        secondary
      />
    </div>
  </div>
);

NotSupportedErrorComponent.propTypes = {
  action: PropTypes.func,
};
const NotSupportedError = Radium(NotSupportedErrorComponent);

// Logic for determining which error message to show when something goes wrong
export const ErrorComponent = ({ error }) => {
  function back() {
    browserHistory.push('/');
  }

  let errorComponent = <div>{error.status}</div>;

  switch (error.status) {
    case 'NotAllowedError':
    case 'PermissionDeniedError':
      errorComponent = <PermissionDenied action={back} />;
      break;
    case 405:
      errorComponent = <NotSupportedError action={back} />;
      break;
    case 409:
      errorComponent = <DuplicateError action={back} />;
      break;
    default:
      errorComponent = <GeneralError action={back} />;
      break;
  }

  return errorComponent;
};

ErrorComponent.propTypes = {
  error: PropTypes.object,
};

export default ErrorComponent;
