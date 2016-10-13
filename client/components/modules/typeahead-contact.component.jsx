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
import _ from 'underscore';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Radium from 'radium';
import React from 'react';
import TagsInput from 'react-tagsinput';
import Colors from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';
import TextField from 'material-ui/TextField';
import TypeaheadChipComponent from './typeahead-chip.component';
import GlobalStyles from '../../styles/global.styles';
import ReactList from 'react-list';

const {
  Style
} = Radium;

let RoomActions;
let RoomStore;

Dependency.autorun(()=> {
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

export class ContactListComponent extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate =
      PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      visibleContacts: this.getVisibleContacts(props.query, props.contacts),
      isScrolling: false,
      scrollingTimer: null
    };
  }

  componentDidMount() {
    let _this = this;
    if (!this.onScroll) {
      this.onScroll = ()=> {
        !!this.state.scrollingTimer && clearTimeout(this.state.scrollingTimer);
        _this.setState({
          isScrolling: true,
          scrollingTimer: setTimeout(()=> {
            _this.setState({
              isScrolling: false,
              scrollingTimer: null
            });
          }, 100)
        });
      };
    }
  }

  onScrollThrottled() {
    _.throttle(this.onScroll, 100);
  }

  getVisibleContacts(query, contacts) {
    return _.filter(contacts, (contact)=> {
      return !query ||
      this.fuzzyFilter(query, [contact.name, contact.email]);
    });
  }

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
  }

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
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.query != this.props.query ||
      nextProps.contacts.length != this.props.contacts.length) {
      this.setState({
        visibleContacts: this.getVisibleContacts(
          nextProps.query, nextProps.contacts
        )
      });
    }
  }

  renderItem(index, key) {
    const contact = this.state.visibleContacts[index];
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

    let title = contact.name || contact.email;
    title = title.length > 24 && this.props.mobile ?
      title.slice(0, 24) + '...' : title;

    return (
      <div
        style={_.extend({}, GlobalStyles.table, {width: '100%', padding: 10})}
        onTouchTap={this.props.onSelect.bind(null, contact)}
        key={key}>
        <div style={_.extend({}, GlobalStyles.cell, {width: '40px'})}>
          <Avatar
            src={!this.state.isScrolling && !!contact.src ? contact.src :
              'images/profile-default.jpg'}
          />
        </div>
        <div style={_.extend({
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          paddingLeft: '10px',
        }, GlobalStyles.cell)}>
          {title}
        </div>
        <div style={_.extend({
          paddingLeft: '10px',
          width: '40px'
        }, GlobalStyles.cell)}>
          <FontIcon
            className='material-icons'
            style={{color}}>
              {contact.status ? 'lens' : 'send'}
          </FontIcon>
        </div>
      </div>
    );
  }

  // <ListItem
  //   disabled={this.state.isScrolling}
  //
  //   leftAvatar={}
  //   rightIcon={
  //     <FontIcon
  //       className='material-icons'
  //       style={{color}}>
  //         {contact.status ? 'lens' : 'send'}
  //     </FontIcon>
  //   }
  // />

  render() {
    return (
      <div style={[!this.props.mobile && {
          maxHeight: '120px', overflowY: 'scroll'
        }]}>
        <div style={{overflow: 'auto', height: '100vh'}} onScroll={this.onScrollThrottled.bind(this)}>
          {this.props.contacts && this.props.contacts.length ? <Divider/> : ''}
          <ReactList
            itemRenderer={this.renderItem.bind(this)}
            length={this.state.visibleContacts.length}
            type='uniform'
            useStaticSize={true}
          />
        </div>
      </div>
    );
  }
};
ContactListComponent.propTypes = {
  contacts: React.PropTypes.array,
  mobile: React.PropTypes.bool,
  onSelect: React.PropTypes.func,
  query: React.PropTypes.string,
};
ContactListComponent = Radium(ContactListComponent);

export class TypeaheadContactComponent extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate =
      PureRenderMixin.shouldComponentUpdate.bind(this);

    // sort the contacts by last login date
    this.state = {
      invitees: [],
      sorted: _.sortBy(props.contacts, (contact)=> {
        return contact.status ? -contact.status.lastLogin.date : 0;
      })
    };
  }

  componentWillUpdate(nextProps, nextState) {
    this.props.onChange && this.state.invitees !== nextState.invitees &&
    this.props.onChange(nextState);
  }

  componentWillReceiveProps(nextProps) {
    const emails = _.pluck(this.state.invitees, 'email');
    this.setState({
      sorted: _.sortBy(_.filter(this.props.contacts, (contact)=> {
        return !~emails.indexOf(contact.email);
      }), (contact)=> {
        return contact.status ? -contact.status.lastLogin.date : 0;
      })
    });
  }

  renderTag(props) {
    let _this = this;
    return (
      <TypeaheadChipComponent
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
  }

  addInvitee(i) {
    setTimeout(()=> {
      this.refs.tags._clearInput();
      this.setState({
        invitees: this.state.invitees.concat([i]),
        query: ''
      });
    }, 0);
  }

  updateInvitees(tags, changed, changedIndecies) {
    _.each(changedIndecies, (i)=> {
      if (typeof tags[i] === 'string' && tags[i] !== '' &&
        (this.props.validate ? this.props.validate(tags[i]) : true)) {
        tags[i] = {email: tags[i]};
      }
    });

    this.setState({
      invitees: tags,
      query: '',
    });
  }

  updateQuery(event) {
    this.setState({
      query: event.target.value,
    });
  }

  validate(tag) {
    let _this = this;

    let re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/i;

    return re.test(tag) ||
      (!_this.state.invitees || !~_this.state.invitees.indexOf(tag));
  }

  renderInput(props) {
    let _this = this;
    let {onChange, value, addTag, ...other} = props;

    // bug -- react-tagsinput doesn't call onChange in addition to custom function
    function callBoth(e) {
      onChange(e);
      _this.updateQuery(e);
    }

    return (
      <input
        type='text'
        onChange={callBoth.bind(this)}
        placeholder={this.state.invitees && this.state.invitees.length ? '' : 'Search for people'}
        value={value} {...other}
        style={_.extend({}, styles.input.css, _this.props.mobile ?
          styles.input.mobile.css : '')}/>
    );
  }

  render() {
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
              renderTag={this.renderTag.bind(this)}
              renderInput={this.renderInput.bind(this)}
              validate={this.validate.bind(this)}
              value={this.state.invitees || []}
              onChange={this.updateInvitees.bind(this)}
              onInputChange={this.updateQuery.bind(this)}
              style={this.props.mobile ? {padding: '10px'} : {}}/>
            <ContactListComponent
              contacts={this.state.query ? this.state.sorted : _.filter(this.state.sorted, (contact)=> {
                return !!contact._id;
              })}
              query={this.state.query}
              mobile={this.props.mobile}
              onSelect={this.addInvitee.bind(this)}/>
          </div>
        </div>
      </div>
    );
  }
};
TypeaheadContactComponent.propTypes = {
  mobile: React.PropTypes.bool,
};

export default Radium(TypeaheadContactComponent);
