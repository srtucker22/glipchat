import Immutable from 'seamless-immutable';
import { chai } from 'meteor/practicalmeteor:chai';
import * as constants from '../../constants/constants';

import reducer from '../rooms.reducer';

const { expect } = chai;

describe('Reducer: rooms', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).to.eql({});
  });

  it(`should handle ${constants.LEAVE_ROOM}`, () => {
    const fakeState = {
      stuff: 'cheese',
      otherStuff: false,
      current: 1234,
    };

    expect(reducer(fakeState, {
      type: constants.LEAVE_ROOM,
    })).to.eql({
      stuff: 'cheese',
      otherStuff: false,
      current: null,
    });
  });

  it(`should handle ${constants.SET_CURRENT_ROOM}`, () => {
    const fakeState = {
      stuff: 'cheese',
      otherStuff: false,
      current: 1234,
    };

    expect(reducer(fakeState, {
      type: constants.SET_CURRENT_ROOM,
      id: 4321,
    })).to.eql({
      stuff: 'cheese',
      otherStuff: false,
      current: 4321,
    });
  });

  it(`should handle ${constants.SET_ROOMS}`, () => {
    const fakeState = {
      stuff: 'cheese',
      otherStuff: false,
    };

    expect(reducer(fakeState, {
      type: constants.SET_ROOMS,
      available: 'YAY!',
    })).to.eql({
      stuff: 'cheese',
      otherStuff: false,
      available: 'YAY!',
    });
  });
});
