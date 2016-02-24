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
    width: '100%',
  }
};

let GlobalStyles = null;

Dependency.autorun(()=> {
  GlobalStyles = Dependency.get('GlobalStyles');
});

let glipcode = {name: 'Glipcode', href: 'http://glipcode.com/'};
let meteorFlux = {name: 'MeteorFlux', href: 'https://github.com/meteorflux'};

export default FooterComponent = Radium(React.createClass({
  mixins: [PureRenderMixin],
  render() {
    return (
      <footer
        className='col-xs-12'
        style={[
          GlobalStyles.table,
          styles.css,
          {height: GlobalStyles.footerHeight}
        ]}>
        <div className='text-left' style={[GlobalStyles.cell]}>
          Copyright <a href={glipcode.href} target='_blank'>
            {glipcode.name}
          </a> 2016
        </div>
        <div className='text-right' style={[GlobalStyles.cell]}>
          Made with ♥ using <a href={meteorFlux.href}
            target='_blank'>
            {meteorFlux.name}
          </a>
        </div>
      </footer>
    );
  },
}));
