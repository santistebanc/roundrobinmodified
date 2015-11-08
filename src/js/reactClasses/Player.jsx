var React = require('react');
var EditableText = require('./EditableText.jsx');
var But = require('./But.jsx');
module.exports = React.createClass({
  changeName: function(newname) {
    this.props.curs.set('name',newname);
  },
  removePlayer: function(){
    this.props.curs.remove();
  },
  render: function() {
    var divclasses = ['box','inline-block','playerbox'];
      if(this.props.rep){
        divclasses = divclasses.concat(['red']);
      }else{
        divclasses = divclasses.concat(['blue']);
      }
    return (
      <div className={divclasses.join(' ')}>
      <div className="row pad-left pad-right">
      <EditableText content={this.props.curs.get().name} onchange={this.changeName}/>
      </div>
      <div className='inline-block double-pad-left pull-right'>
      <But click={this.removePlayer} category='remove'/>
      </div>
      </div>
    )
  }
});
