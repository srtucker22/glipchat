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

import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import {browserHistory} from 'react-router';
import CircularProgress from 'material-ui/CircularProgress';
import Colors from 'material-ui/styles/colors';
import Radium from 'radium';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import GlobalStyles from '../../styles/global.styles';

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

let RoomActions;
let RoomStore;

Dependency.autorun(()=> {
  RoomActions = Dependency.get('RoomActions');
  RoomStore = Dependency.get('RoomStore');
});

export class CallingOverlayComponent extends React.Component {
  leave() {
    browserHistory.push('/');
  }

  retry() {
    RoomActions.retry();
  }

  render() {
    return (
      <div onTouchTap={this.props.onTouchTap}>
        <div style={[GlobalStyles.table, styles.css]}>
          <div className='text-center' style={[GlobalStyles.cell]}>
            {!!this.props.ringing ? (
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
                  {this.props.invitees ? <RaisedButton label='Retry'
                    primary={true}
                    onTouchTap={this.retry}
                    style={{margin: '0 10px'}}>
                  </RaisedButton> : ''}
                  <RaisedButton label={this.props.invitees ? 'Cancel' : 'Leave'}
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
};

export default createContainer(({params}) => {
  return {
    invitees: RoomStore.invitees.get(),
    ringing: RoomStore.ringing.get(),
  };
}, Radium(CallingOverlayComponent));
