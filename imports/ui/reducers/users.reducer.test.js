import Immutable from 'seamless-immutable';
import { chai } from 'meteor/practicalmeteor:chai';
import * as constants from '../constants/constants';

import reducer from './users.reducer';

const { expect } = chai;

describe('notifications reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).to.equal({});
  });

  it(`should handle ${constants.SET_USERS}`, () => {
    const fakeState = {
      something: 'cheese',
    };

    expect(reducer(fakeState, {
      type: constants.SET_USERS,
      users: 'something',
    })).to.equal({
      users: 'something',
    });
  });

  it(`should handle ${constants.AUTH_ERROR}, ${constants.LOGIN_ERROR}, ${constants.LOGOUT_ERROR}`, () => {
    const fakeState = {
      something: 'cheese',
    };

    const expectedState = {
      something: 'cheese',
      authError: 'some error',
    };

    expect(reducer(fakeState, {
      type: constants.AUTH_ERROR,
      error: 'some error',
    })).to.equal(expectedState);

    expect(reducer(fakeState, {
      type: constants.LOGIN_ERROR,
      error: 'some error',
    })).to.equal(expectedState);

    expect(reducer(fakeState, {
      type: constants.LOGOUT_ERROR,
      error: 'some error',
    })).to.equal(expectedState);
  });

  it(`should handle ${constants.LOGGING_IN}`, () => {
    const fakeState = {
      something: 'cheese',
      user: 'something else',
    };

    expect(reducer(fakeState, {
      type: constants.LOGGING_IN,
    })).to.equal({
      something: 'cheese',
      user: {
        loggingIn: true,
      },
    });
  });

  it(`should handle ${constants.CLEAR_AUTH_ERROR}, ${constants.LOGIN}, ${constants.LOGIN_WITH_GOOGLE}, ${constants.LOGIN_WITH_PASSWORD}, ${constants.LOGOUT},`, () => {
    const fakeState = {
      something: 'cheese',
      user: 'something else',
      authError: 'some error',
    };

    expect(reducer(fakeState, {
      type: constants.CLEAR_AUTH_ERROR,
    })).to.equal({
      something: 'cheese',
      user: 'something else',
    });

    expect(reducer(fakeState, {
      type: constants.LOGIN,
    })).to.equal({
      something: 'cheese',
      user: 'something else',
    });

    expect(reducer(fakeState, {
      type: constants.LOGIN_WITH_GOOGLE,
    })).to.equal({
      something: 'cheese',
      user: 'something else',
    });

    expect(reducer(fakeState, {
      type: constants.LOGIN_WITH_PASSWORD,
    })).to.equal({
      something: 'cheese',
      user: 'something else',
    });

    expect(reducer(fakeState, {
      type: constants.LOGOUT,
    })).to.equal({
      something: 'cheese',
      user: 'something else',
    });
  });
});
