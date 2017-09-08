import PropTypes from 'prop-types';
import React from 'react';

const styles = {
  css: {
    position: 'absolute',
    top: 0,
    left: 0,
    border: 0,
    zIndex: 9999,
  },
};

const GithubComponent = ({ link }) => (
  <a href={link} target="_blank" rel="noopener noreferrer">
    <img
      style={styles.css}
      src="images/github.png"
      alt="Fork me on GitHub"
    />
  </a>
);

GithubComponent.propTypes = {
  link: PropTypes.string,
};

export default GithubComponent;
