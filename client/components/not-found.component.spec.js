import React from 'react';
import { shallow, mount } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import NotFoundComponent from './not-found.component';

describe('Component: NotFoundComponent', () => {
  it('should render with company deets and dog image', () => {
    const el = shallow(<NotFoundComponent />);

    const img = el.find('img');
    chai.assert.equal(img.node.props.src, '/images/dog.png');
  });
});
