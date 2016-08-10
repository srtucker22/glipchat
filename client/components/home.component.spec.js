import React from 'react';
import { shallow, mount } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import HomeComponent from './home.component';

describe('HomeComponent', () => {
  it('should render', () => {
    const item = shallow(<HomeComponent/>);
    chai.assert(true);
  });
});
