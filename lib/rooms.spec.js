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
