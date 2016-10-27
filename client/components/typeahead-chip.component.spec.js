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

import { _ } from 'meteor/underscore';
import React from 'react';
import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import TypeaheadChipComponent from './typeahead-chip.component';

describe('Component: TypeaheadChipComponent', () => {
  let chip;
  let props = {
    onRemove: ()=> {},
    tag: 'test',
    src: 'test.jpg',
    mobile: false
  };

  describe('when we have an image src', () => {
    chip = shallow(<TypeaheadChipComponent {...props}/>);
    it('should render with an image', () => {
      const props = {

      };
      chai.assert.isTrue(false);
    });
  });

  describe('when we don\'t have an image src', () => {
    let newProps = _.clone(props);
    delete newProps.src;
    chip = shallow(<TypeaheadChipComponent {...newProps}/>);
    it('should render with a default image', () => {
      const props = {

      };
      chai.assert.isTrue(false);
    });
  });

  describe('when on a mobile/tablet device', () => {
    let newProps = _.clone(props);
    newProps.mobile = true;
    chip = shallow(<TypeaheadChipComponent {...newProps}/>);
    it('should render with a default image', () => {
      const props = {

      };
      chai.assert.isTrue(false);
    });
  });

  describe('when on a desktop', () => {
    let newProps = _.clone(props);
    newProps.mobile = false;
    chip = shallow(<TypeaheadChipComponent {...newProps}/>);
    it('should render with a default image', () => {
      const props = {

      };
      chai.assert.isTrue(false);
    });
  });
});
