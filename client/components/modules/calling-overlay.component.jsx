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

import {browserHistory} from 'react-router';
import MUI from 'material-ui';
import Radium from 'radium';
import React from 'react';

const {
  CircularProgress,
  RaisedButton,
  Styles: {Colors}
} = MUI;

const styles = {
  css: {
    color: Colors.fullWhite,
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 3,
  },
};

let GlobalStyles;
let RoomActions;
let RoomStore;

Dependency.autorun(()=> {
  GlobalStyles = Dependency.get('GlobalStyles');
  RoomActions = Dependency.get('RoomActions');
  RoomStore = Dependency.get('RoomStore');
});

export default CallingOverlayComponent = Radium(React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      invitees: RoomStore.invitees.get(),
      ringing: RoomStore.ringing.get(),
    };
  },

  leave() {
    browserHistory.push('/');
  },

  retry() {
    RoomActions.retry();
  },

  render() {
    return (
      <div onTouchTap={this.props.onTouchTap}>
        <div style={[GlobalStyles.table, styles.css]}>
          <div className='text-center' style={[GlobalStyles.cell]}>
            {!!this.data.ringing ? (
              <div>
                <h3>Contacting...</h3>
                <CircularProgress mode='indeterminate'/>
                <div style={{display: 'block', paddingTop: '16px'}}>
                  <RaisedButton label='Cancel'
                    primary={true}
                    onTouchTap={this.leave}>
                  </RaisedButton>
                </div>
              </div>
            ) : (
              <div>
                <h3>Contacts Unavailable</h3>
                <h5>No contacts connected</h5>
                <div style={{margin: 'auto', width: '100%'}}>
                  {this.data.invitees ? <RaisedButton label='Retry'
                    primary={true}
                    onTouchTap={this.retry}
                    style={{margin: '0 10px'}}>
                  </RaisedButton> : ''}
                  <RaisedButton label={this.data.invitees ? 'Cancel' : 'Leave'}
                    primary={true}
                    onTouchTap={this.leave}>
                  </RaisedButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}));
