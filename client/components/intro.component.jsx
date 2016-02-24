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

// Dependencies
import GithubComponent from './modules/github.component.jsx';
import LoadingDialogComponent from './modules/loading-dialog.component.jsx';
import MUI from 'material-ui';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Radium from 'radium';
import React from 'react';

const {
  RaisedButton,
  Styles: {Colors}
} = MUI;

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

let GlobalStyles;
let UserActions;

Dependency.autorun(()=> {
  GlobalStyles = Dependency.get('GlobalStyles');
  UserActions = Dependency.get('UserActions');
  UserStore = Dependency.get('UserStore');
});

export default IntroComponent = Radium(React.createClass({
  mixins: [PureRenderMixin, ReactMeteorData],

  getMeteorData() {
    return {
      loggingIn: UserStore.loggingIn(),
      loggingOut: UserStore.loggingOut.get()
    };
  },

  loginAsGuest() {
    UserActions.loginAsGuest();
  },

  loginWithGoogle() {
    UserActions.loginWithGoogle();
  },

  render() {
    return (
      <div style={[GlobalStyles.table, styles.css]}>
        <GithubComponent />
        <LoadingDialogComponent
          open={(!!this.data.loggingIn && !this.data.loggingOut)}
          title='Signing in'/>
        <div className='text-center' style={[GlobalStyles.cell]}>
          <h1 style={[styles.title.css]}>{AppDetails.name}</h1>
          <br />
          <RaisedButton
            onTouchTap={this.loginWithGoogle}
            label='Sign in with Google'
            primary={true}
            style={{marginBottom: '20px'}}
          />
          <br/>
          <RaisedButton
            onTouchTap={this.loginAsGuest}
            label='Continue as guest'
            primary={true}
            style={{marginBottom: '50px'}}
          />
        </div>
      </div>
    );
  },
}));
