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
import {shallow, mount} from 'enzyme';
import {chai} from 'meteor/practicalmeteor:chai';
import {Header} from './header.component';

describe('Component: Header', () => {
  describe('when mobile', ()=> {
    describe('when logging in or not subscribed', ()=> {
      const el = shallow(<Header
        iconElementRight={<div></div>}
        loggingIn={false}
        mobile={true}
        subscribed={false}
        user={{something: 'something'}}
      />);

      it('should render the header with iconElementRight prop', () => {
        chai.assert.equal(el.node.type, 'header');
        chai.assert(false);
      });
      it('should not render the drawer', () => {
        chai.assert(false);
      });
    });

    describe('when logged in and subscribed', ()=> {
      const el = shallow(<Header
        iconElementRight={<div></div>}
        loggingIn={false}
        mobile={true}
        subscribed={false}
        user={{something: 'something'}}
      />);

      describe('when user is authenticated', ()=> {
        it('should render the drawer with avatar and user deets', () => {
          chai.assert(false);
        });
      });

      describe('when user is guest', ()=> {
        it('should render the drawer with default avatar and offer signin', () => {
          chai.assert(false);
        });
      });
    });
  });

  describe('when not mobile', ()=> {
    describe('when logging in or not subscribed', ()=> {
      it('should render with some configuration', () => {
        chai.assert.equal(el.node.type, 'header');
        chai.assert(false);
      });
    });

    describe('when logged in and subscribed', ()=> {
      describe('when user is authenticated', ()=> {
        it('should render with some configuration', () => {
          chai.assert(false);
        });
      });

      describe('when user is guest', ()=> {
        it('should render with some configuration', () => {
          chai.assert(false);
        });
      });
    });
  });

  describe('when touching invite', ()=> {
    it('should show invite modal', () => {
      chai.assert(false);
    });
  });

  describe('when touching root', ()=> {
    it('should trigger onTouchTap', () => {
      chai.assert(false);
    });
  });
});
