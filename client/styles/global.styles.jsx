(()=>{
  var GlobalStyles = function(){
    return {
      table: {
        display: 'table',
        margin: 0,
        width: 'initial'
      },

      cell: {
        display: 'table-cell',
        verticalAlign: 'middle',
      },

      inset: {
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,.39), 0 -1px 1px #FFF, 0 1px 0 #FFF',
      },
    };
  };

  // Create the instance
  Dependency.add('GlobalStyles', new GlobalStyles());
})();
