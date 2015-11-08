var React = require('react');

var worker = new Worker('worker.js');
worker.addEventListener('message', function(e){
  console.log(e.data);
}, false);

module.exports = React.createClass({
  getInitialState: function() {
    return {status:0, classes:['green'], message:'Generate!'};
  },
  handleClick: function(event) {
    if(this.state.status == 0){

      this.setState({status:1});
      this.setState({message:(<span><i className="icon-spinner icon-spin"></i> Loading</span>)});
      var self = this;

      var args = [this.props.curs.get()];
      var callback = function(e) {
        var result = e.data.result;
        if (e.data.status == 1) {
          self.setState({message:(<span><i className="icon-refresh"></i> Shuffle</span>)});
          self.setState({status:0});
          self.props.curs.up().set(self.props.curs.get().id,result);
            worker.removeEventListener('message', callback , false);
        }
      };
      worker.addEventListener('message', callback , false);
      worker.postMessage({
        'cmd': 'createRound',
        'args': args
      });

    }
  },
  render: function() {
    var theclass = this.state.classes.join(' ');
    return (
        <button className={theclass} onClick={this.handleClick}>{this.state.message}</button>
    )
  }
});
