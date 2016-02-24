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

const {RaisedButton} = MUI;

const styles = {
  button: {
    css: {
      height: '50px',
      marginBottom: '30px'
    },

    container: {
      css: {
        height: '50px',
        width: '100%'
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
          letterSpacing: '-0.7px'
        },

        top: {
          fontWeight: 300,
          fontSize: '12px'
        }
      },

      icon: {
        css: {
          verticalAlign: 'middle',
          width: '40px',
          paddingLeft: '10px'
        }
      }
    }
  },
};

let GlobalStyles;

Dependency.autorun(()=> {
  GlobalStyles = Dependency.get('GlobalStyles');
});

export default DownloadButtonComponent = Radium(React.createClass({
  mixins: [PureRenderMixin],
  render() {
    let platforms = {
      mac: {
        icon: '/images/apple.svg',
        link: '/downloads/darwin-x64/quasar.zip',
        title: 'Mac OS X'
      },
      win: {
        icon: '/images/windows.svg',
        link: '/downloads/win-x64/quasar.zip',
        title: 'Windows'
      }
    };

    let platform = platforms[this.props.platform];

    return (
      <a href={platform.link} download>
        <RaisedButton
          primary={true}
          label='Label after'
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
  }
}));
