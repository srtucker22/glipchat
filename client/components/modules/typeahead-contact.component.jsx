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
import MUI from 'material-ui';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Radium from 'radium';
import React from 'react';
import ReactScrollComponents from 'react-scroll-components';
import TagsInput from 'react-tagsinput';

const {
  Avatar,
  Divider,
  FontIcon,
  Menu,
  MenuItem,
  List,
  ListItem,
  Paper,
  Styles: {Colors},
  TextField
} = MUI;

const {
  Style
} = Radium;

const {
  ScrollListenerMixin
} = ReactScrollComponents;

let GlobalStyles;
let RoomActions;
let RoomStore;

Dependency.autorun(()=> {
  GlobalStyles = Dependency.get('GlobalStyles');
  RoomActions = Dependency.get('RoomActions');
  RoomStore = Dependency.get('RoomStore');
});

const styles = {
  mobile: {
    css: {
      padding: 0,
      fontSize: '16px',
      width: '100%'
    },
  },

  css: {
    border: '1px solid rgb(228,228,228)',
    padding: '10px',
  },

  chip: {
    css: {
      borderRadius: '24px',
      height: '24px',
    },

    border: {
      css: {
        display: 'inline-block',
        padding: '5px 5px 5px 0',
      },
      mobile: {
        css: {
          marginBottom: '-10px'
        }
      }
    },

    icon: {
      css: {
        cursor: 'pointer',
        verticalAlign: 'top',
        width: '24px',
      },
    },

    text: {
      css: {
        padding: '4px 5px 0 10px',
        fontSize: '12px',
        verticalAlign: 'top',
      }
    },
  },

  input: {
    css: {
      display: 'block',
      border: 'none',
      outline: 'none',
      width: '100%'
    },
    mobile: {
      css: {
        display: 'inline-block',
        outline: 'none',
        border: 'none',
        marginTop: '10px',
        paddingLeft: '16px',
        width: 'initial'
      }
    }
  }
};

// Modify TagsInput so it validates nicely and stores complex Objects
TagsInput.prototype._addTag = function(tag) {
  if (typeof tag === 'string' && tag !== '' &&
    (this.props.validate ? this.props.validate(tag) : true)) {
    let value = this.props.value.concat([{email: tag}]);
    this.props.onChange(value);
    this._clearInput();
  } else if (typeof tag !== 'string') {
    let value = this.props.value.concat([tag]);
    this.props.onChange(value);
    this._clearInput();
  }
};

const TypeaheadMobileChipComponent = Radium(React.createClass({
  mixins: [PureRenderMixin],
  render() {
    return (
      <div key={this.props.tag} style={[
          styles.chip.border.css, this.props.mobile ?
            styles.chip.border.mobile.css : '']}>
        <Paper zDepth={1} style={styles.chip.css}>
          <div style={[GlobalStyles.table]}>
            {this.props.src ? <div style={[
                GlobalStyles.cell,
              ]}>
              <img src={this.props.src} style={[
                styles.chip.css,
                styles.chip.icon.css]}/>
            </div> : ''}
            <div style={[
                GlobalStyles.cell,
                styles.chip.text.css
              ]}>{this.props.tag}</div>
            <FontIcon
              onTouchTap={this.props.onRemove}
              className='material-icons'
              style={styles.chip.icon.css}>remove_circle</FontIcon>
          </div>
        </Paper>
      </div>
    );
  }
}));

const ContactListComponent = Radium(React.createClass({
  mixins: [PureRenderMixin, ScrollListenerMixin],

  fuzzyFilter(searchText, key) {
    let _this = this;
    function sub(k) {
      let subMatchKey = k.substring(0, searchText.length);
      let distance = _this.levenshteinDistance(searchText.toLowerCase(),
        subMatchKey.toLowerCase());
      return searchText.length > 3 ? distance < 2 : distance === 0;
    }

    if (searchText.length === 0) {
      return false;
    }
    if (Array.isArray(key)) {
      return _.reduce(_.map(key, (k)=> {
        return !!k && sub(k) || 0;
      }), (x, y)=> {
        return Math.max(x, y);
      });
    } else {
      return sub(key);
    }
  },

  levenshteinDistance(searchText, key) {
    let current = [];
    let prev;
    let value;

    for (let i = 0; i <= key.length; i++) {
      for (let j = 0; j <= searchText.length; j++) {
        if (i && j) {
          if (searchText.charAt(j - 1) === key.charAt(i - 1)) {
            value = prev;
          } else {
            value = Math.min(current[j], current[j - 1], prev) + 1;
          }
        } else {
          value = i + j;
        }
        prev = current[j];
        current[j] = value;
      }
    }
    return current.pop();
  },

  render() {
    return (
      <div style={[!this.props.mobile && {
          maxHeight: '120px', overflowY: 'scroll'
        }]}>
        <List subheader={this.props.subheader}>
          {this.props.contacts && this.props.contacts.length ? <Divider/> : ''}
          {_.map(
            _.filter(this.props.contacts, (contact)=> {
              return !this.props.query ||
              this.fuzzyFilter(this.props.query, [contact.name, contact.email]);
            }), (contact, index)=> {
              let color;
              if (contact.status) {
                if (contact.status.online) {
                  color = contact.status.idle ?
                  Colors.amber500 : Colors.green500;
                } else {
                  color = Colors.red500;
                }
              } else {
                color = Colors.grey500;
              }
              return (
                <ListItem
                  disabled={this.state.isScrolling}
                  key={'contact-' + index}
                  leftAvatar={<Avatar
                    src={contact.src || 'images/profile-default.jpg'}

                  />}
                  rightIcon={
                    <FontIcon
                      className='material-icons'
                      style={{color}}>
                        {contact.status ? 'lens' : 'send'}
                    </FontIcon>
                  }
                  onTouchTap={this.props.onSelect.bind(null, contact)}
                  primaryText={<div style={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}>
                    {contact.name || contact.email}
                  </div>}/>
              );
            }
          )}
        </List>
      </div>
    );
  }
}));

export default TypeaheadContactComponent = Radium(React.createClass({
  mixins: [PureRenderMixin],
  getInitialState() {
    return {
      invitees: []
    };
  },

  componentWillUpdate(nextProps, nextState) {
    this.props.onChange && this.state.invitees !== nextState.invitees &&
    this.props.onChange(nextState);
  },

  renderTag(props) {
    let _this = this;
    return (
      <TypeaheadMobileChipComponent
        onRemove={(e) => setTimeout(()=> {
          props.onRemove(props.key), 0;
        })}
        key={props.key}
        tag={props.tag.name ? props.tag.name : props.tag.email}
        src={props.tag.src ? props.tag.src : ''}
        onError={(e)=> {
          e.target.src = 'images/profile-default.jpg';
        }}
        mobile={_this.props.mobile}/>
    );
  },

  addInvitee(i) {
    setTimeout(()=> {
      this.refs.tags._clearInput();
      this.setState({
        invitees: this.state.invitees.concat([i]),
        query: ''
      });
    }, 0);
  },

  updateInvitees(i) {
    this.setState({
      invitees: i,
      query: ''
    });
  },

  updateQuery(event) {
    this.setState({query: event.target.value});
  },

  validate(tag) {
    let _this = this;

    let re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/i;

    return re.test(tag) ||
      (!_this.state.invitees || _this.state.invitees.indexOf(tag) === -1);
  },

  renderInput(props) {
    let _this = this;
    let {onChange, value, ...other} = props;

    // bug -- react-tagsinput doesn't call onChange in addition to custom function
    function callBoth(e) {
      onChange(e);
      _this.updateQuery(e);
    }

    return (
      <input
        type='text'
        onChange={callBoth}
        placeholder={this.state.invitees && this.state.invitees.length ? '' : 'Search for people'}
        value={value} {...other}
        style={_.extend({}, styles.input.css, _this.props.mobile ?
          styles.input.mobile.css : '')}/>
    );
  },

  render() {
    // sort the contacts by last login date
    let sorted = _.sortBy(this.props.contacts, (contact)=> {
      return contact.status ? -contact.status.lastLogin.date : 0;
    });
    return (
      <div className='typeahead'>
        <Style
          scopeSelector='.typeahead'
          rules={{
            '.react-tagsinput': {
              display: this.props.mobile ? 'inline-block' : 'initial'
            },
            'input:focus': {
              outline: 'none',
            }
          }}
        />
        <div className='row'>
          <div className='col-xs-12' style={this.props.mobile ?
              [styles.mobile.css] :
              [GlobalStyles.inset, styles.css]}>
            <TagsInput
              ref='tags'
              renderTag={this.renderTag}
              renderInput={this.renderInput}
              validate={this.validate}
              value={this.state.invitees || []}
              onChange={this.updateInvitees}
              onInputChange={this.updateQuery}
              style={this.props.mobile ? {padding: '10px'} : {}}/>
            <ContactListComponent
              contacts={sorted}
              query={this.state.query}
              mobile={this.props.mobile}
              onSelect={this.addInvitee}/>
          </div>
        </div>
      </div>
    );
  },
}));
