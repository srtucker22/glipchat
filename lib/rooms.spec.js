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

import {Factory} from 'meteor/dburles:factory';
import {Meteor} from 'meteor/meteor';
import {resetDatabase} from 'meteor/xolvio:cleaner';
import {Rooms} from './rooms';
import sinon from 'sinon';

describe('Collection: Rooms', () => {
  beforeEach(function() {
    resetDatabase();
  });

  describe('when a user is authorized', () => {
    const USER_ID = Random.id();

    sinon.stub(Meteor, 'userId', ()=> USER_ID);
    console.log(Meteor.userId());

    it('inserts a room', ()=> {
      let id = Rooms.insert({
        owner: USER_ID,
        connected: [],
      });
      let newRoom = Rooms.findOne(id);
    });

    it('updates a room', ()=> {

    });

    it('deletes a room', ()=> {

    });
  });

  describe('when a user is unauthorized', () => {
    it('prevents room insertion', ()=> {

    });

    it('prevents room updating', ()=> {

    });

    it('prevents room removal', ()=> {

    });
  });

  describe('when a room doesnt fit the schema', ()=> {
    it('returns a __ error', ()=> {

    });
  });
});
