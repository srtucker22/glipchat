import React from 'react';
import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import DownloadButtonComponent from './download-button.component';

describe('DownloadButtonComponent', () => {
  it('should render', () => {
    const button = shallow(<DownloadButtonComponent platform="mac" />);
    chai.assert.equal(button.node.type, 'a');
    chai.assert.isTrue(button.node.props.download);
  });
});
