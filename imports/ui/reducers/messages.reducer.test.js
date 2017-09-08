import { chai } from 'meteor/practicalmeteor:chai';
import { CREATE_MESSAGE, SET_MESSAGES } from '../constants/constants';

import reducer from './messages.reducer';

const { expect } = chai;

describe('messages reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).to.equal([]);
  });

  it(`should handle ${CREATE_MESSAGE}`, () => {
    expect(reducer([], {
      type: CREATE_MESSAGE,
    })).to.equal([]);
  });

  it(`should handle ${SET_MESSAGES}`, () => {
    expect(reducer([], {
      type: SET_MESSAGES,
      messages: [1, 2, 3],
    })).to.equal([1, 2, 3]);
  });
});
