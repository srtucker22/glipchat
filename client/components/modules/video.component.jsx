VideoComponent = React.createClass({
  render() {
    return (
      <video src={URL.createObjectURL(this.props.src)} autoPlay></video>
    );
  },
});
