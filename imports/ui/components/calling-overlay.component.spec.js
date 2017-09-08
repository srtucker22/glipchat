import React from 'react';
import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import CallingOverlayComponent from './calling-overlay.component';

describe('Component: CallingOverlayComponent', () => {
  describe('when ringing', () => {
    const el = shallow(<CallingOverlayComponent
      ringing
      invitees={[]}
      onClick={() => {}}
    />);

    it('should render ringing display', () => {
      chai.assert(false);
    });

    describe('when cancel button is touched', () => {
      it('should leave the room', () => {
        chai.assert(false);
      });
    });
  });

  describe('when not ringing', () => {
    it('should render contacts unavailable display', () => {
      const el = shallow(<CallingOverlayComponent
        ringing={false}
        invitees={[]}
        onClick={() => {}}
      />);
      chai.assert(false);
    });

    describe('when we have invitees', () => {
      const el = shallow(<CallingOverlayComponent
        ringing={false}
        invitees={[]}
        onClick={() => {}}
      />);

      it('should offer to retry', () => {
        chai.assert(false);
      });

      describe('when we click the retry button', () => {
        it('should call retry', () => {
          chai.assert(false);
        });
      });
    });

    describe('when we dont have invitees', () => {
      const el = shallow(<CallingOverlayComponent
        ringing={false}
        invitees={[]}
        onClick={() => {}}
      />);

      it('should offer to leave', () => {
        chai.assert(false);
      });

      describe('when we click the leave button', () => {
        it('should leave the room', () => {
          chai.assert(false);
        });
      });
    });
  });
});
