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

import Browser from 'bowser';
import * as Actions from '../actions/actions';
import {connect} from 'react-redux';
import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';

const styles = {
  css: {
    height: 'inherit',
  }
};

export class AppComponent extends React.Component {
  constructor() {
    super(...arguments);

    this.constructor.childContextTypes = {
      muiTheme: React.PropTypes.object,
    };
  }

  componentDidMount() {
    const {mobile, tablet} = Browser;
    if (!this.props.user && !mobile && !tablet) {
      this.props.dispatch(Actions.loginAsGuest());
    }
  }

  componentWillReceiveProps(nextProps) {
    const {mobile, tablet} = Browser;
    if (!nextProps.user && !mobile && !tablet) {
      this.props.dispatch(Actions.loginAsGuest());
    }
  }

  getChildContext() {
    return {
      muiTheme: getMuiTheme(lightBaseTheme),
    };
  }

  render() {
    return (
      <div style={styles.css}>
        {this.props.children}
      </div>
    );
  }
}

const mapStateToProps = ({
  users: {user}
}) => {
  return {
    user,
  };
};

export default connect(
  mapStateToProps,
)(AppComponent);
