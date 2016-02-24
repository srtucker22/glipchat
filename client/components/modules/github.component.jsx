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

import MUI from 'material-ui';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Radium from 'radium';
import React from 'react';

const styles = {
  css: {
    position: 'absolute',
    top: 0,
    left: 0,
    border: 0,
    zIndex: 6
  }
};

export default GithubComponent = Radium(React.createClass({
  mixins: [PureRenderMixin],
  render() {
    return (
      <a href='https://github.com/srtucker22/quasar' target='_blank'>
        <img
          style={[styles.css]}
          src='images/github.png'
          alt='Fork me on GitHub'/>
      </a>
    );
  }
}));
