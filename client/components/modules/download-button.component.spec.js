import React from 'react';
import { shallow, mount } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import DownloadButtonComponent from './download-button.component';

describe('DownloadButtonComponent', () => {
  it('should render', () => {
    const button = shallow(<DownloadButtonComponent platform='mac'/>);
    chai.assert(button.contains(<a href='/downloads/darwin-x64/quasar.zip' download />));
  });
});
