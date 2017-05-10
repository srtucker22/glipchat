import PropTypes from 'prop-types';
import CircularProgress from 'material-ui/CircularProgress';
import Colors from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog';
import Radium from 'radium';
import React from 'react';

const styles = {
  body: {
    css: {
      background: Colors.grey900,
    },
  },

  content: {
    css: {
      color: Colors.fullWhite,
      background: 'none',
      borderRadius: '10px',
      maxWidth: '300px',
      textAlign: 'center',
      textTransform: 'uppercase',
    },
  },
};

const LoadingDialogComponent = props => (
  <div className="LoadingDialog">
    <Dialog
      onRequestClose={props.onTouchTap}
      bodyStyle={styles.body.css}
      contentStyle={styles.content.css}
      open={props.open}
      style={props.style}
    >
      <h4 style={styles.content.css}>{props.title}</h4>
      <CircularProgress mode="indeterminate" />
    </Dialog>
  </div>
);

LoadingDialogComponent.propTypes = {
  onTouchTap: PropTypes.func,
  open: PropTypes.bool,
  style: PropTypes.object,
  title: PropTypes.string,
};

export default Radium(LoadingDialogComponent);
