/**
 * quasar
 *
 * Copyright (c) 2015 Glipcode http://glipcode.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions
 * of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

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
          props.fullScreen && styles.fullScreen.css
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
    React.PropTypes.string
  ])
};

export default Radium(VideoComponent);
