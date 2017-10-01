import Immutable from 'seamless-immutable';
import { chai } from 'meteor/practicalmeteor:chai';
import * as constants from '../../constants/constants';

import reducer from '../users.reducer';

const { expect } = chai;

describe('Reducer: users', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).to.eql({});
  });

  it(`should handle ${constants.SET_USERS}`, () => {
    const fakeState = {
      something: 'cheese',
    };

    expect(reducer(fakeState, {
      type: constants.SET_USERS,
      users: 'something',
    })).to.eql('something');
  });

  it(`should handle ${constants.AUTH_ERROR}, ${constants.LOGIN_ERROR}, ${constants.LOGOUT_ERROR}`, () => {
    const fakeState = Immutable({
      something: 'cheese',
    });

    const expectedState = {
      something: 'cheese',
      authError: 'some error',
    };

    expect(reducer(fakeState, {
      type: constants.AUTH_ERROR,
      error: 'some error',
    })).to.eql(expectedState);

    expect(reducer(fakeState, {
      type: constants.LOGIN_ERROR,
      error: 'some error',
    })).to.eql(expectedState);

    expect(reducer(fakeState, {
      type: constants.LOGOUT_ERROR,
      error: 'some error',
    })).to.eql(expectedState);
  });

  it(`should handle ${constants.LOGGING_IN}`, () => {
    const fakeState = {
      something: 'cheese',
      user: 'something else',
    };

    expect(reducer(fakeState, {
      type: constants.LOGGING_IN,
    })).to.eql({
      something: 'cheese',
      user: {
        loggingIn: true,
      },
    });
  });

  it(`should handle ${constants.CLEAR_AUTH_ERROR}, ${constants.LOGIN_WITH_GOOGLE}, ${constants.LOGIN_WITH_PASSWORD}, ${constants.LOGOUT},`, () => {
    const fakeState = Immutable({
      something: 'cheese',
      user: 'something else',
      authError: 'some error',
    });

    const expectedState = Immutable({
      something: 'cheese',
      user: 'something else',
    });

    expect(reducer(fakeState, {
      type: constants.CLEAR_AUTH_ERROR,
    })).to.eql(expectedState);

    expect(reducer(fakeState, {
      type: constants.LOGIN_WITH_GOOGLE,
    })).to.eql(expectedState);

    expect(reducer(fakeState, {
      type: constants.LOGIN_WITH_PASSWORD,
    })).to.eql(expectedState);

    expect(reducer(fakeState, {
      type: constants.LOGOUT,
    })).to.eql(expectedState);
  });
});
