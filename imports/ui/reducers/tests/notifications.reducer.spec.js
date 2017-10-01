import Immutable from 'seamless-immutable';
import { chai } from 'meteor/practicalmeteor:chai';
import * as constants from '../../constants/constants';

import reducer from '../notifications.reducer';

const { expect } = chai;

describe('Reducer: notifications', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).to.eql({
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
    })).to.eql({
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
    })).to.eql({
      active: 'cheese',
      notifications: [4, 5, 6],
    });
  });
});
