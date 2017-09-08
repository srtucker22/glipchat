import React from 'react';
import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import { ReadyPromptComponent } from './ready-prompt.component';

describe('Component: ReadyPromptComponent', () => {
  describe('when not connected to room', () => {
    describe('when first user in the room', () => {
      it('should attempt to join room stream directly', () => {
        const company = { name: 'cheese', href: 'test' };
        const el = shallow(<ReadyPromptComponent />);
        chai.assert(false);
      });
    });

    describe('when not first user in the room', () => {
      it('should not attempt to join room stream right away', () => {
        const company = { name: 'cheese', href: 'test' };
        const el = shallow(<ReadyPromptComponent />);
        chai.assert(false);
      });

      describe('when tapping join button', () => {
        it('should attempt to join room stream', () => {
          chai.assert(false);
        });
      });

      describe('when tapping root element', () => {
        it('should initiate onTouchTap from props', () => {
          chai.assert(false);
        });
      });
    });
  });

  describe('when connected to room', () => {
    it('should not show a loading screen or join option', () => {
      chai.assert(false);
    });
  });
});
