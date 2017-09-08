import React from 'react';
import { shallow, mount } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import IntroComponent from './intro.component';

describe('Component: IntroComponent', () => {
  describe('when logging in', () => {
    it('should show a loading dialog', () => {
      chai.assert(false);
    });

    it('should disable logging options', () => {
      chai.assert(false);
    });
  });

  describe('when not logging in', () => {
    it('should not show a loading dialog', () => {
      chai.assert(false);
    });

    describe('when tapping login with google', () => {
      it('should attempt to login with google', () => {
        chai.assert(false);
      });
    });

    describe('when tapping login as guest', () => {
      it('should attempt to login as guest', () => {
        chai.assert(false);
      });
    });
  });
});
