import React from 'react';
import { shallow, mount } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import { ControlsComponent } from './controls.component';

describe('Component: ControlsComponent', () => {
  describe('when controls are visible', () => {
    it('should render controls', () => {
      const el = shallow(<ControlsComponent
        controlsVisible={false}
        isLocalAudioEnabled={false}
        isLocalVideoEnabled={false}
        onClick={() => {}}
      />);
      chai.assert(false);
    });

    describe('when root element is touched', () => {
      it('should trigger the onTouchTap prop func', () => {
        chai.assert(false);
      });
    });

    describe('when audio/video buttons are clicked', () => {
      it('should toggle audio/video', () => {
        chai.assert(false);
      });
    });

    describe('when exit button is clicked', () => {
      it('should leave the room', () => {
        chai.assert(false);
      });
    });

    describe('when invite button is clicked', () => {
      it('should show invite modal', () => {
        chai.assert(false);
      });
    });

    describe('when local audio/video is enabled', () => {
      it('should render audio/video control normally', () => {
        const el = shallow(<ControlsComponent
          controlsVisible={false}
          isLocalAudioEnabled={false}
          isLocalVideoEnabled={false}
          onClick={() => {}}
        />);
        chai.assert(false);
      });
    });

    describe('when local audio/video is disabled', () => {
      it('should render audio/video control as muted', () => {
        const el = shallow(<ControlsComponent
          controlsVisible={false}
          isLocalAudioEnabled={false}
          isLocalVideoEnabled={false}
          onClick={() => {}}
        />);
        chai.assert(false);
      });
    });
  });

  describe('when controls are not visible', () => {
    it('should not render controls', () => {
      const el = shallow(<ControlsComponent
        controlsVisible={false}
        isLocalAudioEnabled={false}
        isLocalVideoEnabled={false}
        onClick={() => {}}
      />);
      chai.assert(false);
    });
  });
});
