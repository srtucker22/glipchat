/**
 * quasar
 *
 * Copyright (c) 2015 Glipcode http://glipcode.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions
 * of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

import ReactTestUtils from 'react-addons-test-utils';
import { chai } from 'meteor/practicalmeteor:chai';
import { shallow, mount } from 'enzyme';
import AnswerDialogComponent from './answer-dialog.component';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import LoadingDialogComponent from './loading-dialog.component';
import {NotificationActions} from '../../actions/notification.actions';
import React from 'react';
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

  it('should change the loading state and call notification actions on accept', ()=> {
    let acceptSpy = sinon.spy(NotificationActions.prototype, 'accept');

    const test = 'test title';
    class ContainerComponent extends React.Component {
      constructor() {
        super(...arguments);

        this.constructor.childContextTypes = {
          muiTheme: React.PropTypes.object,
        };
      }
      getChildContext() {
        return {
          muiTheme: getMuiTheme(lightBaseTheme),
        };
      }

      render() {
        return (
          <AnswerDialogComponent {...this.props}/>
        );
      }
    }

    const el = mount(
      <ContainerComponent title={test}/>
    );

    chai.assert.equal(acceptSpy.callCount, 0);

    let dialog = el.find(Dialog).node;
    let renderLayer = dialog.renderLayer();
    // buttons[0].simulate('click');
    // chai.assert(acceptSpy.callCount, 0);
  });
});
