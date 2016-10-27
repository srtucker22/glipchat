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
import { shallow, mount } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import {ControlsComponent} from './controls.component';

describe('Component: ControlsComponent', () => {
  describe('when controls are visible', ()=> {
    it('should render controls', () => {
      const el = shallow(<ControlsComponent
        controlsVisible={false}
        isLocalAudioEnabled={false}
        isLocalVideoEnabled={false}
        onClick={()=> {}}
      />);
      chai.assert(false);
    });

    describe('when root element is touched', ()=> {
      it('should trigger the onTouchTap prop func', ()=> {
        chai.assert(false);
      });
    });

    describe('when audio/video buttons are clicked', ()=> {
      it('should toggle audio/video', ()=> {
        chai.assert(false);
      });
    });

    describe('when exit button is clicked', ()=> {
      it('should leave the room', ()=> {
        chai.assert(false);
      });
    });

    describe('when invite button is clicked', ()=> {
      it('should show invite modal', ()=> {
        chai.assert(false);
      });
    });

    describe('when local audio/video is enabled', ()=> {
      it('should render audio/video control normally', () => {
        const el = shallow(<ControlsComponent
          controlsVisible={false}
          isLocalAudioEnabled={false}
          isLocalVideoEnabled={false}
          onClick={()=> {}}
        />);
        chai.assert(false);
      });
    });

    describe('when local audio/video is disabled', ()=> {
      it('should render audio/video control as muted', () => {
        const el = shallow(<ControlsComponent
          controlsVisible={false}
          isLocalAudioEnabled={false}
          isLocalVideoEnabled={false}
          onClick={()=> {}}
        />);
        chai.assert(false);
      });
    });
  });

  describe('when controls are not visible', ()=> {
    it('should not render controls', ()=> {
      const el = shallow(<ControlsComponent
        controlsVisible={false}
        isLocalAudioEnabled={false}
        isLocalVideoEnabled={false}
        onClick={()=> {}}
      />);
      chai.assert(false);
    });
  });
});
