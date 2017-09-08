import Immutable from 'seamless-immutable';
import { chai } from 'meteor/practicalmeteor:chai';
import * as constants from '../constants/constants';

import reducer from './notifications.reducer';

const { expect } = chai;

describe('notifications reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).to.equal({
      active: null,
      notifications: [],
    });
  });

  it(`should handle ${constants.SET_ACTIVE_NOTIFICATION}`, () => {
    const fakeState = {
      active: 'cheese',
      notifications: [1, 2, 3],
    };

    expect(reducer(fakeState, {
      type: constants.SET_ACTIVE_NOTIFICATION,
      active: 'chicken',
    })).to.equal({
      active: 'chicken',
      notifications: [1, 2, 3],
    });
  });

  it(`should handle ${constants.SET_NOTIFICATIONS}`, () => {
    const fakeState = {
      active: 'cheese',
      notifications: [1, 2, 3],
    };

    expect(reducer(fakeState, {
      type: constants.SET_NOTIFICATIONS,
      notifications: [4, 5, 6],
    })).to.equal({
      active: 'cheese',
      notifications: [4, 5, 6],
    });
  });
});
