var {FontIcon} = MUI;
var Colors = MUI.Styles.Colors;

var permissionDeniedComponent = (appName)=> {
  return (
    <div className='permission-denied-error'>
      <div className='row'>
        <div className='col-xs-12 text-center table'>
          <img className='arrow cell' src='images/arrow-left.png' />
          <div className='cell'>
            Click the <FontIcon className='material-icons' color={Colors.red500}>videocam_off</FontIcon> icon in the URL bar above to give {appName} access to your computer's camera and microphone.
          </div>
          <img className='arrow cell' src='images/arrow-right.png' />
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
