/**
 * quasar
 *
 * Copyright (c) 2015 Glipcode http://glipcode.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions
 * of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

import React from 'react';
import { shallow } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import VideoComponent from './video.component';

describe('Component: VideoComponent', () => {
  const test = {test: true};
  const blob = new Blob([JSON.stringify(test, null, 2)], {type: 'application/json'});

  it('should render with video and blob and autoplay', () => {
    const el = shallow(<VideoComponent src={blob}/>);
    chai.assert.equal(el.find('video').length, 1, 'missing video');
    chai.assert.equal(el.find('video').props().src.indexOf('blob:'), 0, 'src not set');
    chai.assert(el.find('video').props().autoPlay);
  });
  it('should mute/unmute', () => {
    const el = shallow(<VideoComponent src={blob} muted={true}/>);
    chai.assert.isTrue(el.find('video').props().muted);

    el.setProps({muted: false});
    chai.assert.isFalse(el.find('video').props().muted);
  });

  it('should toggle fullscreen', () => {
    const el = shallow(<VideoComponent src={blob} fullScreen={true}/>);
    chai.assert(el.find('video').props().style);
    chai.assert(el.find('video').props().style.width, '100%');
    chai.assert(el.find('video').props().style.height, '100%');

    el.setProps({fullScreen: false});
    chai.assert.isUndefined(el.find('video').props().style.width);
    chai.assert.isUndefined(el.find('video').props().style.height);
  });

  it('should flip the video display', () => {
    const el = shallow(<VideoComponent src={blob} flip={true}/>);
    chai.assert(el.find('video').props().style.transform, 'scale(-1, 1)');

    el.setProps({flip: false});
    chai.assert.isUndefined(el.find('video').props().style.transform);
  });
});
