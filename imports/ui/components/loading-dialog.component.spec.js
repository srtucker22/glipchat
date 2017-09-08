import PropTypes from 'prop-types';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import sinon from 'sinon';
import LoadingDialogComponent from './loading-dialog.component';

describe('Component: LoadingDialogComponent', () => {
  const test = 'test title';
  class ContainerComponent extends React.Component {
    constructor(props) {
      super(props);

      this.constructor.childContextTypes = {
        muiTheme: PropTypes.object,
      };
    }
    getChildContext() {
      return {
        muiTheme: getMuiTheme(lightBaseTheme),
      };
    }

    render() {
      return (
        <LoadingDialogComponent {...this.props} />
      );
    }
  }

  it('should render', () => {
    const el = shallow(<LoadingDialogComponent title={test} />);
    chai.assert.equal(el.find('h4').text(), test, 'title not set properly');
  });

  it('should not rerender unless props/state change', () => {
    const renderSpy = sinon.spy(LoadingDialogComponent.prototype, 'render');
    const el = mount(
      <ContainerComponent title={test} />,
    );
    chai.assert(renderSpy.callCount, 1);
    el.setProps({ title: 'test title' });
    chai.assert(renderSpy.callCount, 1);
    el.setProps({ title: 'test title2' });
    chai.assert(renderSpy.callCount, 2);
  });
});
