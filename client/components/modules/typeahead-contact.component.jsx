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
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
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

class TypeaheadMobileChipComponent extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate =
      PureRenderMixin.shouldComponentUpdate.bind(this);
  }

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
};
TypeaheadMobileChipComponent = Radium(TypeaheadMobileChipComponent);

class ContactListComponent extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate =
      PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      visibleContacts: this.getVisibleContacts(props.query, props.contacts)
    };
  }

  getVisibleContacts(query, contacts) {
    return _.filter(contacts, (contact)=> {
      return !query ||
      _this.fuzzyFilter(query, [contact.name, contact.email]);
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
      console.log('uh oh', nextProps.contacts, this.props.contacts);
      console.log('uh oh2', nextProps.query, this.props.query);
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
        primaryText={
          <div style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }}>
            {contact.name || contact.email}
          </div>
        }
      />
    );
  }

  render() {
    return (
      <div style={[!this.props.mobile && {
          maxHeight: '120px', overflowY: 'scroll'
        }]}>
        <List
          subheader={this.props.subheader}
          style={{overflow: 'auto', height: '100vh'}}>
          {this.props.contacts && this.props.contacts.length ? <Divider/> : ''}
          <ReactList
            itemRenderer={this.renderItem.bind(this)}
            length={this.state.visibleContacts.length}
            type='uniform'
            useStaticSize={true}
          />
        </List>
      </div>
    );
  }
};
ContactListComponent = Radium(ContactListComponent);

export class TypeaheadContactComponent extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate =
      PureRenderMixin.shouldComponentUpdate.bind(this);
    this.state = {
      invitees: []
    };
  }

  componentWillUpdate(nextProps, nextState) {
    this.props.onChange && this.state.invitees !== nextState.invitees &&
    this.props.onChange(nextState);
  }

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
      (!_this.state.invitees || _this.state.invitees.indexOf(tag) === -1);
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
              renderTag={this.renderTag.bind(this)}
              renderInput={this.renderInput.bind(this)}
              validate={this.validate.bind(this)}
              value={this.state.invitees || []}
              onChange={this.updateInvitees.bind(this)}
              onInputChange={this.updateQuery.bind(this)}
              style={this.props.mobile ? {padding: '10px'} : {}}/>
            <ContactListComponent
              contacts={sorted}
              query={this.state.query}
              mobile={this.props.mobile}
              onSelect={this.addInvitee.bind(this)}/>
          </div>
        </div>
      </div>
    );
  }
};

export default Radium(TypeaheadContactComponent);
