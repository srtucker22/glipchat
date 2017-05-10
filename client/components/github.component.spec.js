import React from 'react';
import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import GithubComponent from './github.component';

describe('Component: GithubComponent', () => {
  it('should render with link', () => {
    const testUrl = 'test.com';
    const el = shallow(<GithubComponent link={testUrl} />);
    chai.assert.equal(el.find('img').length, 1, 'missing image');
    chai.assert.equal(el.find('a').props().href, testUrl, 'href not set');
  });
});
