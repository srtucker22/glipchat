import Radium from 'radium';
import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin';

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

export class VideoComponent extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentDidMount() {
    const video = ReactDOM.findDOMNode(this.refs.video);

    if (!!this.props.src) {
      video.srcObject = this.props.src;
    }
  }

  componentWillReceiveProps(nextProps) {
    const video = ReactDOM.findDOMNode(this.refs.video);

    if (!!nextProps.src && nextProps.src !== this.props.src) {
      video.srcObject = nextProps.src;
    }
  }

  render() {
    const {props} = this;

    return (
      <video
        ref={'video'}
        style={[
          styles.css,
          props.flip && styles.flip.css,
          props.fullScreen && styles.fullScreen.css,
        ]}
        muted={props.muted}
        autoPlay
        onClick={props.onTouchTap}>
      </video>
    );
  }
};

VideoComponent.propTypes = {
  flip: React.PropTypes.bool,
  fullScreen: React.PropTypes.bool,
  muted: React.PropTypes.bool,
  onTouchTap: React.PropTypes.func,
  src: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.string,
  ]),
};

export default Radium(VideoComponent);
