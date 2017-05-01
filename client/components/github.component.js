import PropTypes from 'prop-types';
import React from 'react';

const styles = {
  css: {
    position: 'absolute',
    top: 0,
    left: 0,
    border: 0,
    zIndex: 6,
  },
};

const GithubComponent = ({link})=> {
  return (
    <a href={link} target='_blank'>
      <img
        style={styles.css}
        src='images/github.png'
        alt='Fork me on GitHub'/>
    </a>
  );
};

GithubComponent.propTypes = {
  link: PropTypes.string,
};

export default GithubComponent;
