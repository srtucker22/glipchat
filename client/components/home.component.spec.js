import React from 'react';
import { shallow, mount } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import HomeComponent from './home.component';

describe('HomeComponent', () => {
  describe('when desktop browser', () => {
    describe('when mac browser', () => {
      it('should show mac download button', () => {
        chai.assert(false);
      });
    });
  });

  describe('when electron app', () => {
    it('should not show download button', () => {
      chai.assert(false);
    });
  });

  describe('when tapping create room', () => {
    it('should attempt to create a room and show loading dialog', () => {
      chai.assert(false);
    });
  });
});
