import _ from 'underscore';
import React from 'react';
import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import TypeaheadChipComponent from './typeahead-chip.component';

describe('TypeaheadChipComponent', () => {
  let chip;
  let props = {
    onRemove: ()=> {},
    tag: 'test',
    src: 'test.jpg',
    mobile: false
  };

  describe('when we have an image src', () => {
    chip = shallow(<TypeaheadChipComponent {...props}/>);
    it('should render with an image', () => {
      const props = {

      };
      chai.assert.isTrue(false);
    });
  });

  describe('when we don\'t have an image src', () => {
    let newProps = _.clone(props);
    delete newProps.src;
    chip = shallow(<TypeaheadChipComponent {...newProps}/>);
    it('should render with a default image', () => {
      const props = {

      };
      chai.assert.isTrue(false);
    });
  });

  describe('when on a mobile/tablet device', () => {
    let newProps = _.clone(props);
    newProps.mobile = true;
    chip = shallow(<TypeaheadChipComponent {...newProps}/>);
    it('should render with a default image', () => {
      const props = {

      };
      chai.assert.isTrue(false);
    });
  });

  describe('when on a desktop', () => {
    let newProps = _.clone(props);
    newProps.mobile = false;
    chip = shallow(<TypeaheadChipComponent {...newProps}/>);
    it('should render with a default image', () => {
      const props = {

      };
      chai.assert.isTrue(false);
    });
  });
});
