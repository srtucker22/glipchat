import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import PropTypes from 'prop-types';
import Radium from 'radium';
import React from 'react';
import GlobalStyles from '../styles/global.styles';

const styles = {
  css: {
    borderRadius: '24px',
    height: '24px',
  },

  border: {
    css: {
      display: 'inline-block',
      padding: '5px 5px 5px 0',
    },
    mobile: {
      css: {
        marginBottom: '-10px',
      },
    },
  },

  icon: {
    css: {
      cursor: 'pointer',
      verticalAlign: 'top',
      width: '24px',
    },
  },

  text: {
    css: {
      padding: '4px 5px 0 10px',
      fontSize: '12px',
      verticalAlign: 'top',
    },
  },
};

export const ContactListChipComponent = props => (
  <div
    key={props.tag}
    style={[
      styles.border.css,
      props.mobile ? styles.border.mobile.css : '',
    ]}
  >
    <Paper zDepth={1} style={styles.css}>
      <div style={[GlobalStyles.table]}>
        {props.src ? (
          <div
            style={[
              GlobalStyles.cell,
            ]}
          >
            <img
              src={props.src}
              style={[
                styles.css,
                styles.icon.css]}
            />
          </div>
        ) : ''}
        <div
          style={[
            GlobalStyles.cell,
            styles.text.css,
          ]}
        >
          {props.tag}
        </div>
        <FontIcon
          onClick={props.onRemove}
          className="material-icons"
          style={styles.icon.css}
        >
          remove_circle
        </FontIcon>
      </div>
    </Paper>
  </div>
);

ContactListChipComponent.propTypes = {
  mobile: PropTypes.bool,
  src: PropTypes.string,
};

export default Radium(ContactListChipComponent);
