import React from 'react';
import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import { Header } from './header.component';

describe('Component: Header', () => {
  describe('when mobile', () => {
    describe('when logging in or not subscribed', () => {
      const el = shallow(<Header
        iconElementRight={<div />}
        loggingIn={false}
        mobile
        subscribed={false}
        user={{ something: 'something' }}
      />);

      it('should render the header with iconElementRight prop', () => {
        chai.assert.equal(el.node.type, 'header');
        chai.assert(false);
      });
      it('should not render the drawer', () => {
        chai.assert(false);
      });
    });

    describe('when logged in and subscribed', () => {
      const el = shallow(<Header
        iconElementRight={<div />}
        loggingIn={false}
        mobile
        subscribed={false}
        user={{ something: 'something' }}
      />);

      describe('when user is authenticated', () => {
        it('should render the drawer with avatar and user deets', () => {
          chai.assert(false);
        });
      });

      describe('when user is guest', () => {
        it('should render the drawer with default avatar and offer signin', () => {
          chai.assert(false);
        });
      });
    });
  });

  describe('when not mobile', () => {
    describe('when logging in or not subscribed', () => {
      it('should render with some configuration', () => {
        chai.assert.equal(el.node.type, 'header');
        chai.assert(false);
      });
    });

    describe('when logged in and subscribed', () => {
      describe('when user is authenticated', () => {
        it('should render with some configuration', () => {
          chai.assert(false);
        });
      });

      describe('when user is guest', () => {
        it('should render with some configuration', () => {
          chai.assert(false);
        });
      });
    });
  });

  describe('when touching invite', () => {
    it('should show invite modal', () => {
      chai.assert(false);
    });
  });

  describe('when touching root', () => {
    it('should trigger onTouchTap', () => {
      chai.assert(false);
    });
  });
});
