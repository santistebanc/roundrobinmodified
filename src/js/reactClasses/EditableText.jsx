var React = require('react');
module.exports = React.createClass({
  componentWillReceiveProps: function(nextProps){
    this.setState({cont:nextProps.content})
  },
  getInitialState: function(){
    return {cont:this.props.content,editing:false,justchanged:false};
  },
  edit: function(){
    this.setState({justchanged:true})
    this.setState({editing:true});
  },
  submit: function(e){
    e.preventDefault();
    this.setState({editing:false});
    if(!this.state.cont){
      this.state.cont = 'player';
      this.setState({cont:'player'});
    }
    this.props.onchange(this.state.cont);
  },
  changeCont: function(e) {
    this.setState({
      cont: e.target.value
    });
  },
  componentDidUpdate: function(prevProps, prevState){
    if(this.state.justchanged){
      this.setState({justchanged:false});
      React.findDOMNode(this.refs.textinput).select();
    }
  },
  render: function() {
    var autosize = '{ "space": 40 }';
    if(this.state.editing){
      return (
        <form onSubmit={this.submit} >
        <input type='text' ref='textinput'className={this.props.classnames} onDoubleClick={this.edit} value={this.state.cont} onChange={this.changeCont} onBlur={this.submit}/>
        </form>
      )
    }else{
      return (<p className={this.props.classnames} onDoubleClick={this.edit}>{this.state.cont}</p>)
      }
  }
});
