import { chai } from 'meteor/practicalmeteor:chai';
import { CREATE_MESSAGE, SET_MESSAGES } from '../../constants/constants';

import reducer from '../messages.reducer';

const { expect } = chai;

describe('Reducer: messages', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).to.eql([]);
  });

  it(`should handle ${CREATE_MESSAGE}`, () => {
    expect(reducer([], {
      type: CREATE_MESSAGE,
    })).to.eql([]);
  });

  it(`should handle ${SET_MESSAGES}`, () => {
    expect(reducer([], {
      type: SET_MESSAGES,
      messages: [1, 2, 3],
    })).to.eql([1, 2, 3]);
  });
});
