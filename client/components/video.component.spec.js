import React from 'react';
import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import VideoComponent from './video.component';

describe('Component: VideoComponent', () => {
  const test = { test: true };
  const blob = new Blob([JSON.stringify(test, null, 2)], { type: 'application/json' });

  it('should render with video and blob and autoplay', () => {
    const el = shallow(<VideoComponent src={blob} />);
    chai.assert.equal(el.find('video').length, 1, 'missing video');
    chai.assert.equal(el.find('video').props().src.indexOf('blob:'), 0, 'src not set');
    chai.assert(el.find('video').props().autoPlay);
  });
  it('should mute/unmute', () => {
    const el = shallow(<VideoComponent src={blob} muted />);
    chai.assert.isTrue(el.find('video').props().muted);

    el.setProps({ muted: false });
    chai.assert.isFalse(el.find('video').props().muted);
  });

  it('should toggle fullscreen', () => {
    const el = shallow(<VideoComponent src={blob} fullScreen />);
    chai.assert(el.find('video').props().style);
    chai.assert(el.find('video').props().style.width, '100%');
    chai.assert(el.find('video').props().style.height, '100%');

    el.setProps({ fullScreen: false });
    chai.assert.isUndefined(el.find('video').props().style.width);
    chai.assert.isUndefined(el.find('video').props().style.height);
  });

  it('should flip the video display', () => {
    const el = shallow(<VideoComponent src={blob} flip />);
    chai.assert(el.find('video').props().style.transform, 'scale(-1, 1)');

    el.setProps({ flip: false });
    chai.assert.isUndefined(el.find('video').props().style.transform);
  });
});
