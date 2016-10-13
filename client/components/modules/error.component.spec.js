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
import { shallow, mount } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import {ErrorComponent} from './error.component';

describe('Component: ErrorComponent', () => {
  describe('when NotAllowedError or PermissionDeniedError', ()=> {
    it('should render <PermissionDenied/>', () => {
      let el = shallow(<ErrorComponent error={{status: 'NotAllowedError'}}
      />);
      chai.assert(false);

      el = shallow(<ErrorComponent error={{status: 'PermissionDeniedError'}}
      />);
      chai.assert(false);
    });
  });

  describe('when 405', ()=> {
    it('should render <NotSupportedError/>', () => {
      let el = shallow(<ErrorComponent error={{status: 405}}
      />);
      chai.assert(false);
    });
  });

  describe('when 409', ()=> {
    it('should render <DuplicateError/>', () => {
      let el = shallow(<ErrorComponent error={{status: 409}}
      />);
      chai.assert(false);
    });
  });

  describe('when general error', ()=> {
    it('should render <GeneralError/>', () => {
      let el = shallow(<ErrorComponent error={{status: 'cheese'}}
      />);
      chai.assert(false);
    });
  });

  describe('when clicking back', ()=> {
    it('should route back', ()=> {
      chai.assert(false);
    });
  });
});
