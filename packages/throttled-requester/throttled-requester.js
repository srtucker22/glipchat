Future = Npm.require('fibers/future');

// Function wrapping code.
// fn - reference to function.
// context - what you want "this" to be.
// params - array of parameters to pass to function.
let wrapFunction = function(fn, context, params) {
  return function() {
    fn.apply(context, params);
  };
};

ThrottledRequester = function(rate, milliseconds) {
  // making a throttled requester:
  let busy = false;
  let requests = [];
  let fulfilled = [];

  return {
    makeRequest() {
      if (!!arguments && arguments.length) {
        let func = wrapFunction.apply(this, arguments);
        requests.push(func);
      }

      if (requests.length) {
        let nextTick = fulfilled.length &&
          _.first(fulfilled).clone().add(milliseconds, 'milliseconds');
        if (fulfilled.length < rate || (nextTick && moment().isAfter(nextTick))) {
          (requests.shift())();
          fulfilled.push(moment());
          fulfilled = _.last(fulfilled, rate);
          this.makeRequest();
        } else {
          if (!busy) {
            busy = true;
            Meteor.setTimeout(()=> {
              busy = false;
              this.makeRequest();
            }, milliseconds);
          }
        }
      }
    }
  };
};
