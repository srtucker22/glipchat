import PropTypes from 'prop-types';

// Make sure to import default styles.
// This only needs to be done once; probably during bootstrapping process.

// Then import the virtualized Select HOC
import 'react-select/dist/react-select.css';

import { _ } from 'meteor/underscore';
import createFilterOptions from 'react-select-fast-filter-options';
import React from 'react';
import Select from 'react-select';
import ReactList from 'react-list';
import ContactListItemComponent from './contact-list-item.component';
import ContactListChipComponent from './contact-list-chip.component';
import '../styles/react-select-override.css';

// add a key with all the searchable strings for a given user
// simpler than modifying createFilterOptions
function addLabelKey(contacts) {
  return _.map(contacts, user => Object.assign({}, user, { labelKey: [
    user.name, // name
    user.email, // email addresses
  ].join(' ') }));
}

export class ContactListComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValues: [],
    };

    this.menuRenderer = this.menuRenderer.bind(this);
    this.valueRenderer = this.valueRenderer.bind(this);
    this.onInputKeyDown = this.onInputKeyDown.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onChange = this.onChange.bind(this);

    if (this.props.contacts && this.props.contacts.length) {
      const contacts = addLabelKey(this.props.contacts);
      this.state.contacts = contacts;
      this.state.filterOptions = createFilterOptions({
        labelKey: 'labelKey',
        valueKey: '_id',
        options: contacts,
      });
    }
  }

  optionRenderer(option, i) {
    return (<ContactListItemComponent
      key={option.id}
      user={option}
      onClick={this.onAdd.bind(this, option)}
    />);
  }

  onAdd(option) {
    const selectValues = _.unique([...this.state.selectValues, option]);
    this.props.onChange(selectValues);
    this.setState({ selectValues });
  }

  onRemove(index) {
    const selectValues = this.state.selectValues.slice(0);
    selectValues.splice(index, 1);
    this.props.onChange(selectValues);
    this.setState({ selectValues });
  }

  /**
   * [valueRenderer description]
   * @param  {Object} option contact object
   * @param  {Number} index index of the contact in list
   * @return {Component} list row component
   */
  valueRenderer(option, index) {
    return (
      <ContactListChipComponent
        onRemove={this.onRemove.bind(this, index)}
        mobile
        src={option.src}
        tag={option.name || option.email || option.label}
      />
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.contacts !== this.props.contacts) {
      const contacts = addLabelKey(nextProps.contacts);
      this.setState({
        contacts,
        filterOptions: createFilterOptions({
          labelKey: 'labelKey',
          valueKey: '_id',
          options: contacts,
        }),
      });
    }
  }

  onChange(vals) {
    const selectValues = _.unique(vals);
    this.props.onChange(selectValues);
    this.setState({ selectValues });
  }

  onInputKeyDown(event) {
    switch (event.keyCode) {
      case 9:   // TAB
      case 13: // ENTER
        if (this.state.inputValue) {
          this.onAdd({
            email: this.state.inputValue,
          });
        }
        break;
      default:
        break;
    }
  }

  renderItem(options, index, key) {
    const option = options[index];
    return (<ContactListItemComponent
      key={key}
      user={option}
      onClick={this.onAdd.bind(this, option)}
    />);
  }

  menuRenderer({ options }) {
    return (<div
      style={{ overflow: 'auto', maxHeight: window.innerHeight - 100 }}
    >
      <ReactList
        itemRenderer={this.renderItem.bind(this, options)}
        length={options.length}
        type="uniform"
      />
    </div>);
  }

  onInputChange(inputValue) {
    this.setState({ inputValue });
  }

  render() {
    const { contacts, onChange, ...other } = this.props;
    return (
      <Select
        {...other}
        autofocus
        filterOptions={this.state.filterOptions}
        maxHeight={window.innerHeight}
        menuRenderer={this.menuRenderer}
        multi
        onChange={this.onChange}
        onInputChange={this.onInputChange}
        onInputKeyDown={this.onInputKeyDown}
        optionHeight={30}
        options={this.state.contacts}
        placeholder={'Type email or username to search...'}
        value={this.state.selectValues}
        valueRenderer={this.valueRenderer}
      />
    );
  }
}

ContactListComponent.propTypes = {
  onChange: PropTypes.func,
  contacts: PropTypes.array,
};

export default ContactListComponent;
