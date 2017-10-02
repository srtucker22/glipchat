import Avatar from 'material-ui/Avatar';
import Chip from 'material-ui/Chip';
import Icon from 'material-ui/Icon';
import PropTypes from 'prop-types';
import Radium from 'radium';
import React from 'react';

export const ContactListChipComponent = props => (
  <Chip
    avatar={
      props.src ?
        <Avatar src={props.src} /> :
        <Avatar><Icon>{'person'}</Icon></Avatar>
    }
    label={props.tag}
    onRequestDelete={props.onRemove}
  />
);

ContactListChipComponent.propTypes = {
  onRemove: PropTypes.func.isRequired,
  src: PropTypes.string,
  tag: PropTypes.string.isRequired,
};

export default Radium(ContactListChipComponent);
