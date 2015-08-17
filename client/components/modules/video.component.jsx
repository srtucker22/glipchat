VideoComponent = React.createClass({
  render() {
    return (
      <video className={this.props.className} src={URL.createObjectURL(this.props.src)} muted={this.props.muted} autoPlay></video>
    );
  },
});
