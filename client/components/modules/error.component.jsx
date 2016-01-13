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

// SHANE: Adding some comments to give better context for developers.
// SHANE: Changed the user error text to remove contractions (difficult for non-native readers) and to improve context.
const {FontIcon} = MUI;
const Colors = MUI.Styles.Colors;

const styles = {
  css: {

  },

  general: {
    css: {
      color: Colors.fullWhite,
      fontSize: '20px',
      fontWeight: 'bold',
    },

    icon: {
      css: {
        display: 'block',
        margin: '20px auto',
      },
    },
  },

  permissionDenied: {
    css: {
      color: Colors.fullWhite,
      fontSize: '20px',
      margin: 'auto',
      maxWidth: '800px',
      minWidth: '520px',
    },

    arrow: {
      css: {
        padding: 0,
        width: '100px',
      },
    },

    icon: {
      css: {
        top: '4px',
      },
    },

    cell: {
      css: {
        padding: '50px 0 0 0',
      },
    }
  },
};

let GlobalStyles;

Dependency.autorun(()=> {
  GlobalStyles = Dependency.get('GlobalStyles');
});

// Ask for permission to use the camera and microphone on the user's computer
let permissionDeniedComponent = (appName)=> {
  return (
      <div style={[styles.permissionDenied.css]}>
        <div className='row'>
          <div className='col-xs-12 text-center' style={[GlobalStyles.table]}>
            <img style={[
              GlobalStyles.cell,
              styles.permissionDenied.cell.css,
              styles.permissionDenied.arrow.css
            ]} src='/images/arrow-left.png' />
            <div style={[GlobalStyles.cell, styles.permissionDenied.cell.css]}>
              Click the <FontIcon className='material-icons' style={styles.permissionDenied.icon.css} color={Colors.red500}>videocam_off</FontIcon> icon in the URL bar above to give {appName} access to your computer's camera and microphone.
            </div>
            <img style={[
              GlobalStyles.cell,
              styles.permissionDenied.cell.css,
              styles.permissionDenied.arrow.css
            ]} src='/images/arrow-right.png' />
          </div>
        </div>
      </div>
  );
};

// Warn that the user is already connected to the room in a different window, tab or browser
let duplicateErrorComponent = (
    <div className='row' style={[styles.general.css]}>
      <div className='col-xs-12 text-center'>
        <img src='/images/camel.png' style={[styles.general.icon.css]}/>
        <p>You are already connected to this room in a different window, tab, or browser.</p>
        <p> To fix this problem you can try returning to that view of this room.</p>
      </div>
    </div>
);

// Warn that there has been a general error and ask the user to refresh the session
let generalErrorComponent = (
    <div className='row' style={[styles.general.css]}>
      <div className='col-xs-12 text-center'>
        <img src='/images/atomic.png' style={[styles.general.icon.css]}/>
        <p>Something went wrong. Please try refreshing the page.</p>
        <p>If this does not fix the problem please close the tab or window and try again.</p>
      </div>
    </div>
);

// Alert the user that their browser is not supported and suggest they try Chrome or Firefox
let notSupportedErrorComponent = (
    <div className='row' style={[styles.general.css]}>
      <div className='col-xs-12 text-center'>
        <img src='/images/astronaut.png' style={[styles.general.icon.css]}/>
        <p>Sorry, we do not currently support your browser.</p>
        <p>You can download <a href="https://www.google.com/chrome/">Google Chrome</a> or <a href="https://www.mozilla.org/firefox">Mozilla Firefox</a> for free to use this video chatroom.</p>
      </div>
    </div>
);

// Logic for determining which error message to show when something goes wrong
LocalStreamErrorComponent = Radium(React.createClass({
  render() {
    var {...other} = this.props;

    var errorComponent = <div>{this.props.error.status}</div>;

    switch (this.props.error.status){
      case 'PermissionDeniedError':
        errorComponent = permissionDeniedComponent(this.props.appName);
        break;
      case 405:
        errorComponent = notSupportedErrorComponent;
        break;
      case 409:
        errorComponent = duplicateErrorComponent;
        break;
      default:
        errorComponent = generalErrorComponent;
        break;
    }

    return errorComponent;
  }
}));
