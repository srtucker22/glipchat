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
    zIndex: 3,
  },
};

let GlobalStyles = null;
let RoomActions = null;
let UserStore = null;

Dependency.autorun(()=> {
  GlobalStyles = Dependency.get('GlobalStyles');
  RoomActions = Dependency.get('RoomActions');
  UserStore = Dependency.get('UserStore');
});

ReadyPromptComponent = Radium(React.createClass({
  mixins: [ReactMeteorData],

  componentDidMount() {
    // join room stream directly if alone in room
    if (!this.props.room.connected.length) {
      RoomActions.joinRoomStream(this.props.room._id);
    };
  },

  getMeteorData() {
    return {
      user: UserStore.user(),
    };
  },

  joinRoomStream() {
    RoomActions.joinRoomStream(this.props.room._id);
  },

  render() {
    return (
      <div onTouchTap={this.props.onTouchTap}>
        {(this.props.room.connected.length &&
          !_.contains(this.props.room.connected, this.data.user._id)) ? (
          <div style={[GlobalStyles.table, styles.css]}>
            <div className='text-center' style={[GlobalStyles.cell]}>
              <p>Are you ready to join?</p>
              <RaisedButton label='Join'
                primary={true}
                onTouchTap={this.joinRoomStream}>
              </RaisedButton>
            </div>
          </div>
        ) : ''}
      </div>
    );
  }
}));
