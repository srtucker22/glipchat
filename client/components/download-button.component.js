import {APP_NAME} from '../../lib/config';
import Radium from 'radium';
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import GlobalStyles from '../styles/global.styles';

const styles = {
  button: {
    css: {
      height: '50px',
      marginBottom: '30px',
    },

    container: {
      css: {
        height: '50px',
        width: '100%',
      },

      copy: {
        css: {
          color: 'white',
          fontFamily: 'Helvetica Neue',
          padding: '0 10px 0 7px',
          textAlign: 'left',
        },

        bottom: {
          fontWeight: 400,
          fontSize: '16px',
          letterSpacing: '-0.7px',
        },

        top: {
          fontWeight: 300,
          fontSize: '12px',
        },
      },

      icon: {
        css: {
          verticalAlign: 'middle',
          width: '40px',
          paddingLeft: '10px',
        },
      },
    },
  },
};

const DownloadButtonComponent = (props)=> {
  let platforms = {
    mac: {
      icon: '/images/apple.svg',
      link: `/downloads/darwin-x64/${APP_NAME}.zip`,
      title: 'Mac OS X',
    },
    win: {
      icon: '/images/windows.svg',
      link: `/downloads/win-x64/${APP_NAME}.zip`,
      title: 'Windows',
    },
  };

  let platform = platforms[props.platform];

  return (
    <a href={platform.link} download>
      <RaisedButton
        secondary={true}
        labelPosition='after'
        style={styles.button.css}>
        <div style={[GlobalStyles.table, styles.button.container.css]}>
          <div style={[GlobalStyles.cell, styles.button.container.icon.css]}>
            <img src={platform.icon} style={[{width: '100%'}]}/>
          </div>
          <div style={[GlobalStyles.cell, styles.button.container.copy.css]}>
            <div style={[styles.button.container.copy.top]}>
              Download for
            </div>
            <div style={[styles.button.container.copy.bottom]}>
              {platform.title}
            </div>
          </div>
        </div>
      </RaisedButton>
    </a>
  );
};

DownloadButtonComponent.propTypes = {
  platform: React.PropTypes.string.isRequired,
};

export default Radium(DownloadButtonComponent);
