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
});

IntroComponent = Radium(React.createClass({
  loginWithGoogle() {
    UserActions.loginWithGoogle();
  },

  render() {
    return (
      <div style={[GlobalStyles.table, styles.css]}>
        <div className='text-center' style={[GlobalStyles.cell]}>
          <h1 style={[styles.title.css]}>{'quasar'}</h1>
          <br />
          <RaisedButton
            onTouchTap={this.loginWithGoogle}
            label='Sign in with Google'
            primary={true}
            style={{marginBottom: '50px'}}
          />
        </div>
      </div>
    );
  },
}));
