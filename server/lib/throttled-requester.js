import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

// Function wrapping code.
// fn - reference to function.
// context - what you want "this" to be.
// params - array of parameters to pass to function.
const wrapFunction = function(fn, context, params) {
  return function() {
    fn.apply(context, params);
  };
};

export default class ThrottledRequester {
  constructor(rate, milliseconds) {
    this.rate = rate;
    this.milliseconds = milliseconds;
    this.busy = false;
    this.requests = [];
    this.fulfilled = [];
  }

  makeRequest(...args) {
    if (!!args && args.length) {
      this.requests.push(wrapFunction.apply(this, args));
    }

    if (this.requests.length) {
      const nextTick = this.fulfilled.length &&
        _.first(this.fulfilled).clone().add(this.milliseconds, 'milliseconds');
      if (this.fulfilled.length < this.rate ||
        (nextTick && moment().isAfter(nextTick))) {
        (this.requests.shift())();
        this.fulfilled.push(moment());
        this.fulfilled = _.last(this.fulfilled, this.rate);
        this.makeRequest();
      } else if (!this.busy) {
        this.busy = true;
        Meteor.setTimeout(() => {
          this.busy = false;
          this.makeRequest();
        }, this.milliseconds);
      }
    }
  }
}
