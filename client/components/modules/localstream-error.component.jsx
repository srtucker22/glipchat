(()=> {

  var GlobalStyles = null;

  Dependency.autorun(()=> {
    GlobalStyles = Dependency.get('GlobalStyles');
  });

  const {FontIcon} = MUI;
  const Colors = MUI.Styles.Colors;

  const styles = {
    css: {

    },

    permissionDenied: {
      css: {
        color: Colors.fullWhite,
        fontSize: '20px',
        margin: 'auto',
        maxWidth: '800px',
        minWidth: '520px',
      },

      arrow: {
        css: {
          padding: 0,
          width: '100px',
        },
      },

      icon: {
        css: {
          top: '4px',
        },
      },

      cell: {
        css: {
          paddingTop: '50px',
        },
      }
    },
  };

  var permissionDeniedComponent = (appName)=> {
    return (
      <div style={[styles.permissionDenied.css]}>
        <div className='row'>
          <div className='col-xs-12 text-center' style={[GlobalStyles.table]}>
            <img style={[GlobalStyles.cell, styles.permissionDenied.cell.css, styles.permissionDenied.arrow.css]} src='images/arrow-left.png' />
            <div style={[GlobalStyles.cell, styles.permissionDenied.cell.css]}>
              Click the <FontIcon className='material-icons' style={styles.permissionDenied.icon.css} color={Colors.red500}>videocam_off</FontIcon> icon in the URL bar above to give {appName} access to your computer's camera and microphone.
            </div>
            <img style={[GlobalStyles.cell, styles.permissionDenied.cell.css, styles.permissionDenied.arrow.css]} src='images/arrow-right.png' />
          </div>
        </div>
      </div>
    );
  };

  LocalStreamErrorComponent = React.createClass({
    render(){
      var { ...other } = this.props;

      var errorComponent = <div>{this.props.error.status}</div>;

      switch(this.props.error.status){
        case 'PermissionDeniedError':
          errorComponent = permissionDeniedComponent(this.props.appName);
          break;
      }

      return errorComponent;
    }
  });
})();
