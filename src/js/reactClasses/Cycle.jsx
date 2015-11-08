var React = require('react');
var EditableText = require('./EditableText.jsx');
var But = require('./But.jsx');
var GroupReact = require('./Group.jsx');
var Group = require('../jsClasses/Group.js');
module.exports = React.createClass({
  changeName: function(newname){
    this.props.curs.set('displayname',newname);
  },
  removeCycle: function(){
    this.props.curs.remove();
  },
  addGroup: function(){
    this.props.curs.select('groups').push(new Group(this.props.curs.get().groupscount));
    this.props.curs.set('groupscount',this.props.curs.get().groupscount+1);
  },
  render: function() {
    var groups = this.props.curs.select('groups');
    return (
      <div className='alert box inline-block'>
      <div className="row pad-left pad-right">
        <div className='inline-block'><EditableText content={this.props.curs.get().displayname} onchange={this.changeName}/></div>
        <div className='inline-block double-pad-left'>
        <But click={this.removeCycle} category='remove'/>
        </div>
      </div>
      {groups.get().map(function(group,index){
            return(<GroupReact curs={groups.select(index)} num={index} key={group.id} />)
        })}
        <But click={this.addGroup} category='add'/>
      </div>
    )
  }
});
