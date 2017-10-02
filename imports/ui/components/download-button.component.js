import PropTypes from 'prop-types';
import Radium from 'radium';
import React from 'react';
import Button from 'material-ui/Button';
import GlobalStyles from '../styles/global.styles';

const styles = {
  button: {
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

const DownloadButton = (props) => {
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
      <Button
        raised
        color="accent"
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
      </Button>
    </a>
  );
};

DownloadButton.propTypes = {
  link: PropTypes.string,
  platform: PropTypes.string.isRequired,
};

export default Radium(DownloadButton);
