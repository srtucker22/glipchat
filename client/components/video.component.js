import PropTypes from 'prop-types';
import Radium from 'radium';
import React from 'react';

const styles = {
  css: {
    maxHeight: '100%',
    maxWidth: '100%',
    objectFit: 'cover',
    transition: 'opacity 1s ease-in-out',
  },

  flip: {
    css: {
      transform: 'scale(-1, 1)',
    },
  },

  fullScreen: {
    css: {
      height: '100%',
      width: '100%',
    },
  },
};

export class VideoComponent extends React.PureComponent {
  componentDidMount() {
    if (this.props.src) {
      this.video.srcObject = this.props.src;
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!!nextProps.src && nextProps.src !== this.props.src) {
      this.video.srcObject = nextProps.src;
    }
  }

  render() {
    const { flip, fullScreen, muted, onTouchTap } = this.props;

    return (
      <video
        ref={(ref) => { this.video = ref; }}
        style={[
          styles.css,
          flip && styles.flip.css,
          fullScreen && styles.fullScreen.css,
        ]}
        muted={muted}
        autoPlay
        onClick={onTouchTap}
      />
    );
  }
}

VideoComponent.propTypes = {
  flip: PropTypes.bool,
  fullScreen: PropTypes.bool,
  muted: PropTypes.bool,
  onTouchTap: PropTypes.func,
  src: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
};

export default Radium(VideoComponent);
