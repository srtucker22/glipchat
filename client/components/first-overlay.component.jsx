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

import PureRenderMixin from 'react-addons-pure-render-mixin';
import Radium from 'radium';
import RaisedButton from 'material-ui/RaisedButton';
import Colors from 'material-ui/styles/colors';
import React from 'react';
import GlobalStyles from '../styles/global.styles';

const styles = {
  css: {
    color: Colors.fullWhite,
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 2,
  },

  invite: {
    css: {
      margin: '0 0 20px 0',
      width: '100%',
    },
    cell: {
      css: {
        padding: '10px',
        width: '50%',
      }
    },
  },

  linkUrl: {
    css: {
      backgroundColor: Colors.fullWhite,
      color: Colors.fullBlack,
      margin: '10px auto',
      overflow: 'hidden',
      padding: '10px',
      textOverflow: 'ellipsis',
    }
  }
};

export class FirstOverlayComponent extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate =
      PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return (
      <div onClick={this.props.onTouchTap}>
        <div style={[GlobalStyles.table, styles.css]}>
          <div style={[GlobalStyles.cell]}>
            <div style={[GlobalStyles.table, styles.invite.css]}>
              <div
                style={[
                  GlobalStyles.cell,
                  styles.invite.cell.css]}
                className='text-right'>You are the only one here.</div>
              <div style={[
                  GlobalStyles.cell,
                  styles.invite.cell.css]} className='text-left'>
                <RaisedButton
                  label='Invite people'
                  secondary={true}
                  onClick={this.props.action}>
                </RaisedButton>
              </div>
            </div>
            <div>
              <div className='text-center'>
                {`Share the permanent link. Bookmark and come back anytime.`}
              </div>
              <div
                style={[
                  GlobalStyles.table,
                  GlobalStyles.inset,
                  styles.linkUrl.css]}>
                {this.props.linkUrl}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
FirstOverlayComponent.propTypes = {
  action: React.PropTypes.func,
  linkUrl: React.PropTypes.string,
  onTouchTap: React.PropTypes.func,
};

export default Radium(FirstOverlayComponent);
