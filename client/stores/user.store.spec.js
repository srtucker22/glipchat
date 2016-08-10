import { chai } from 'meteor/practicalmeteor:chai';
import sinon from 'sinon';

describe('UserStore', () => {
  let UserActions;
  Dependency.autorun(()=> {
    UserActions = Dependency.get('UserActions');
  });

  it('should do some cool shit', () => {
    chai.assert(true);
    // UserActions.logout();
    // check before and after the state of meteor peeps
    // you can also spy on stuff -- let renderSpy = sinon.spy(blah.prototype, 'methodName');
  });
});
