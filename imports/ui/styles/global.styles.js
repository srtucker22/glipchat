const footerHeight = '60px';
const GlobalStyles = {
  footerHeight,
  stickyFooterPage: {
    height: 'auto',
    margin: `${'0 auto '}-${footerHeight}`,
    minHeight: '100%',
    padding: `0 0 ${footerHeight}`,
  },

  table: {
    display: 'table',
    margin: 0,
    width: 'initial',
  },

  cell: {
    display: 'table-cell',
    verticalAlign: 'middle',
  },

  inline: {
    display: 'inline-block',
  },

  inset: {
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,.39), 0 -1px 1px #FFF, 0 1px 0 #FFF',
  },
};

export default GlobalStyles;
