import PropTypes from 'prop-types';
import ReactTestUtils from 'react-addons-test-utils';
import { chai } from 'meteor/practicalmeteor:chai';
import { shallow, mount } from 'enzyme';
import Dialog from 'material-ui/Dialog';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import React from 'react';
import sinon from 'sinon';
import LoadingDialogComponent from './loading-dialog.component';
import { NotificationActions } from '../../actions/notification.actions';
import AnswerDialogComponent from './answer-dialog.component';

describe('AnswerDialogComponent', () => {
  const test = 'test';

  it('should render a dialog component', () => {
    const empty = shallow(<AnswerDialogComponent />);
    const emptyDialog = empty.find(Dialog);
    chai.assert.equal(emptyDialog.length, 1);
    chai.assert.isUndefined(emptyDialog.node.props.title);
    chai.assert.isFalse(emptyDialog.node.props.open);

    const el = shallow(<AnswerDialogComponent
      invitation={{
        from: test,
      }}
    />);
    const dialog = el.find(Dialog);
    chai.assert.equal(dialog.length, 1);
    chai.assert.equal(dialog.node.props.title, `${test} is calling`);
    chai.assert(dialog.node.props.open);
  });

  it('should render a loading component within the dialog', () => {
    const el = shallow(<AnswerDialogComponent
      invitation={{
        from: test,
      }}
    />);
    let dialog = el.find(Dialog);

    chai.assert.isFalse(el.state('loading'));
    chai.assert.equal(dialog.children().length, 0);

    el.setState({ loading: true });
    dialog = el.childAt(0);
    chai.assert.equal(dialog.find(LoadingDialogComponent).length, 1);
  });

  it('should change the loading state and call notification actions on accept', () => {
    const acceptSpy = sinon.spy(NotificationActions.prototype, 'accept');

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
          <AnswerDialogComponent {...this.props} />
        );
      }
    }

    const el = mount(
      <ContainerComponent title={test} />,
    );

    chai.assert.equal(acceptSpy.callCount, 0);

    const dialog = el.find(Dialog).node;
    const renderLayer = dialog.renderLayer();
    // buttons[0].simulate('click');
    // chai.assert(acceptSpy.callCount, 0);
  });
});
