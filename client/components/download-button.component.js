import PropTypes from 'prop-types';
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

const DownloadButtonComponent = (props) => {
  const platforms = {
    mac: {
      icon: '/images/apple.svg',
      title: 'Mac OS X',
    },
    win: {
      icon: '/images/windows.svg',
      title: 'Windows',
    },
  };

  const platform = platforms[props.platform];

  return (
    <a href={props.link} download>
      <RaisedButton
        secondary
        labelPosition="after"
        style={styles.button.css}
      >
        <div style={[GlobalStyles.table, styles.button.container.css]}>
          <div style={[GlobalStyles.cell, styles.button.container.icon.css]}>
            <img src={platform.icon} style={[{ width: '100%' }]} />
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
  link: PropTypes.string,
  platform: PropTypes.string.isRequired,
};

export default Radium(DownloadButtonComponent);
