import React from 'react';
import { shallow, mount } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import { ErrorComponent } from './error.component';

describe('Component: ErrorComponent', () => {
  describe('when NotAllowedError or PermissionDeniedError', () => {
    it('should render <PermissionDenied/>', () => {
      let el = shallow(<ErrorComponent
        error={{ status: 'NotAllowedError' }}
      />);
      chai.assert(false);

      el = shallow(<ErrorComponent
        error={{ status: 'PermissionDeniedError' }}
      />);
      chai.assert(false);
    });
  });

  describe('when 405', () => {
    it('should render <NotSupportedError/>', () => {
      const el = shallow(<ErrorComponent
        error={{ status: 405 }}
      />);
      chai.assert(false);
    });
  });

  describe('when 409', () => {
    it('should render <DuplicateError/>', () => {
      const el = shallow(<ErrorComponent
        error={{ status: 409 }}
      />);
      chai.assert(false);
    });
  });

  describe('when general error', () => {
    it('should render <GeneralError/>', () => {
      const el = shallow(<ErrorComponent
        error={{ status: 'cheese' }}
      />);
      chai.assert(false);
    });
  });

  describe('when clicking back', () => {
    it('should route back', () => {
      chai.assert(false);
    });
  });
});
