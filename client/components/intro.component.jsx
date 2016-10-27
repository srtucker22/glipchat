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

import { connect } from 'react-redux';
import {APP_NAME, GITHUB_URL} from '../../lib/config';
import * as Actions from '../actions/actions';
import Colors from 'material-ui/styles/colors';
import GithubComponent from './github.component';
import GlobalStyles from '../styles/global.styles';
import LoadingDialogComponent from './loading-dialog.component';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Radium from 'radium';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';

const styles = {
  css: {
    backgroundAttachment: 'fixed',
    backgroundImage: 'url(images/quasar.jpg)',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    color: Colors.fullWhite,
    height: '100%',
    width: '100%'
  },

  title: {
    css: {
      color: Colors.fullWhite,
      fontSize: '80px',
      textShadow: '2px 2px rgba(0, 0, 0, 0.5)',
    },
  },
};

export class IntroComponent extends React.Component {
  constructor() {
    super(...arguments);
    this.shouldComponentUpdate =
      PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  loginAsGuest() {
    // UserActions.loginAsGuest();
    this.props.dispatch(Actions.loginAsGuest());
  }

  loginWithGoogle() {
    this.props.dispatch(Actions.loginWithGoogle());
  }

  render() {
    const {user} = this.props;
    return (
      <div style={[GlobalStyles.table, styles.css]}>
        <GithubComponent link={GITHUB_URL}/>
        <LoadingDialogComponent
          open={!!user && !!user.loggingIn}
          title='Signing in'/>
        <div className='text-center' style={[GlobalStyles.cell]}>
          <h1 style={[styles.title.css]}>{APP_NAME}</h1>
          <br />
          <RaisedButton
            onTouchTap={this.loginWithGoogle.bind(this)}
            label='Sign in with Google'
            secondary={true}
            style={{marginBottom: '20px'}}
          />
          <br/>
          <RaisedButton
            onTouchTap={this.loginAsGuest.bind(this)}
            label='Continue as guest'
            secondary={true}
            style={{marginBottom: '50px'}}
          />
        </div>
      </div>
    );
  }
};

IntroComponent = Radium(IntroComponent);

const mapStateToProps = ({users: {user}}) => {
  return {
    user,
  };
};

export default connect(
  mapStateToProps,
)(IntroComponent);
