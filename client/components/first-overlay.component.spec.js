import React from 'react';
import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import { FirstOverlayComponent } from './first-overlay.component';

describe('Component: FirstOverlayComponent', () => {
  const el = shallow(<FirstOverlayComponent
    linkUrl={'cheese'}
    onClick={() => {}}
  />);

  it('should render with proper linkUrl', () => {
    chai.assert(false);
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
