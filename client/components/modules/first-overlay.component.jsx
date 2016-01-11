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

const {
  RaisedButton
} = MUI;

const Colors = MUI.Styles.Colors;

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

let GlobalStyles = null;
let RoomActions = null;
let UserStore = null;

Dependency.autorun(()=> {
  GlobalStyles = Dependency.get('GlobalStyles');
  RoomActions = Dependency.get('RoomActions');
  RoomStore = Dependency.get('RoomStore');
  UserStore = Dependency.get('UserStore');
});

FirstOverlayComponent = Radium(React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      user: UserStore.user(),
    };
  },

  render() {
    return (
      <div onTouchTap={this.props.onTouchTap}>
        {(this.props.room.connected.length === 1 &&
          this.props.room.connected[0] === this.data.user._id) ?
          (<div style={[GlobalStyles.table, styles.css]}>
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
                    primary={true}
                    onTouchTap={RoomActions.showInviteModal}>
                  </RaisedButton>
                </div>
              </div>
              <div>
                <div className='text-center'>
                  Share the permanent link. Bookmark and come back anytime.
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
          </div>) : ''}
      </div>
    );
  }
}));
