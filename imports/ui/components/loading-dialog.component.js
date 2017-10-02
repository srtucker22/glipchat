import PropTypes from 'prop-types';
import { CircularProgress } from 'material-ui/Progress';
import Colors from 'material-ui/colors';
import Dialog, { DialogContent } from 'material-ui/Dialog';
import Radium from 'radium';
import React from 'react';

const styles = {
  css: {
    color: 'white',
    background: Colors.grey[900],
    maxWidth: '300px',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
};

const LoadingDialogComponent = props => (
  <div className="LoadingDialog">
    <Dialog
      onRequestClose={props.onTouchTap}
      open={props.open}
    >
      <DialogContent
        style={styles.css}
      >
        <h4>{props.title}</h4>
        <CircularProgress mode="indeterminate" />
      </DialogContent>
    </Dialog>
  </div>
);

LoadingDialogComponent.propTypes = {
  onTouchTap: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
};

export default Radium(LoadingDialogComponent);
