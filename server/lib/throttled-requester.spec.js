import { Meteor } from 'meteor/meteor';
import { chai } from 'meteor/practicalmeteor:chai';
import moment from 'moment';
import ThrottledRequester from './throttled-requester';

describe('ThrottledRequester', () => {
  it('should make throttled requests', (done) => {
    // create request queue for Google Contacts API limited to 10 req/sec
    const testRequester = new ThrottledRequester(10, 100);
    chai.assert.equal(testRequester.fulfilled.length, 0);
    chai.assert.equal(testRequester.requests.length, 0);
    chai.assert.equal(testRequester.busy, false);

    const state = {
      calls: [],
    };

    function faker() {
      state.calls.push(moment());
    }

    testRequester.makeRequest(faker, this);
    chai.assert.equal(testRequester.fulfilled.length, 1);
    chai.assert.equal(state.calls.length, 1);

    for (let i = 0; i < 20; i++) {
      testRequester.makeRequest(faker, this);
    }

    chai.assert.equal(testRequester.fulfilled.length, 10);
    chai.assert.equal(state.calls.length, 10);

    Meteor.setTimeout(() => {
      chai.assert.equal(state.calls.length, 20);
      Meteor.setTimeout(() => {
        chai.assert.equal(state.calls.length, 21);
        done();
      }, 100);
    }, 100);
  });
});
