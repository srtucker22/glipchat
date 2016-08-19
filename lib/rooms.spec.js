import {Factory} from 'meteor/dburles:factory';
import {Meteor} from 'meteor/meteor';
import {resetDatabase} from 'meteor/xolvio:cleaner';
import {Rooms} from './rooms';
import sinon from 'sinon';

describe('Rooms collection', () => {
  beforeEach(function() {
    resetDatabase();
  });

  describe('when a user is authorized', () => {
    const USER_ID = Random.id();
    sinon.stub(Meteor, 'userId', USER_ID);

    it('inserts a room', ()=> {

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
