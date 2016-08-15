import React from 'react';
import Dialog from 'material-ui/Dialog';
import { shallow, mount } from 'enzyme';
import { chai } from 'meteor/practicalmeteor:chai';
import AnswerDialogComponent from './answer-dialog.component';
import LoadingDialogComponent from './loading-dialog.component';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import sinon from 'sinon';

describe('AnswerDialogComponent', () => {
  const test = 'test';

  it('should render a dialog component', () => {
    const empty = shallow(<AnswerDialogComponent/>);
    let emptyDialog = empty.find(Dialog);
    chai.assert.equal(emptyDialog.length, 1);
    chai.assert.isUndefined(emptyDialog.node.props.title);
    chai.assert.isFalse(emptyDialog.node.props.open);

    const el = shallow(<AnswerDialogComponent invitation={{
      from: test
    }}/>);
    let dialog = el.find(Dialog);
    chai.assert.equal(dialog.length, 1);
    chai.assert.equal(dialog.node.props.title, `${test} is calling`);
    chai.assert(dialog.node.props.open);
  });

  it('should render a loading component within the dialog', () => {
    const el = shallow(<AnswerDialogComponent invitation={{
      from: test
    }}/>);
    let dialog = el.find(Dialog);

    chai.assert.isFalse(el.state('loading'));
    chai.assert.equal(dialog.children().length, 0);

    el.setState({loading: true});
    dialog = el.childAt(0);
    chai.assert.equal(dialog.find(LoadingDialogComponent).length, 1);
  });
});
