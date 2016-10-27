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
import React from 'react';
import Radium from 'radium';
import GlobalStyles from '../styles/global.styles';

const styles = {
  css: {
    width: '100%',
  }
};

const FooterComponent = ({company})=> {
  return (
    <footer
      className='col-xs-12'
      style={[
        GlobalStyles.table,
        styles.css,
        {height: GlobalStyles.footerHeight}
      ]}>
      <div className='text-left' style={[GlobalStyles.cell]}>
        Copyright <a href={company.href} target='_blank'>
          {company.name}
        </a> 2016
      </div>
    </footer>
  );
};

FooterComponent.propTypes = {
  company: React.PropTypes.object.isRequired
};

export default Radium(FooterComponent);
