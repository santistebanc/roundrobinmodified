var React = require('react');
var EditableText = require('./EditableText.jsx');
var But = require('./But.jsx');
var GenerateBut = require('./GenerateBut.jsx');
var CycleReact = require('./Cycle.jsx');
var PlayerReact = require('./Player.jsx');
var Cycle = require('../jsClasses/Cycle.js');
var Player = require('../jsClasses/Player.js');
module.exports = React.createClass({
  changeName: function(newname){
    this.props.curs.set('displayname',newname);
  },
  removeRound: function(){
    this.props.curs.remove();
  },
  addCycle: function(){
    this.props.curs.select('cycles').push(new Cycle(this.props.curs.get().cyclescount));
    this.props.curs.set('cyclescount',this.props.curs.get().cyclescount+1);
  },
  addPlayer: function(){
    this.props.curs.select('players').push(new Player(this.props.curs.up().up().select('playerscount').get(),'new player'));
    this.props.curs.up().up().set('playerscount', this.props.curs.up().up().select('playerscount').get()+1);
  },
  render: function() {
    var cycles = this.props.curs.select('cycles');
    var self = this;
    return (
      <div className='info box'>
        <div className="row pad-left pad-right">
          <div className='inline-block'><EditableText content={this.props.curs.get().displayname} onchange={this.changeName}/></div>
          <div className='inline-block double-pad-left'>
            <But click={this.removeRound} category='remove'/>
          </div>
          <div className='inline-block double-pad-left'>
            <GenerateBut curs={this.props.curs}/>
          </div>
        </div>
        <div className="row pad-left">
          <div className=' double-pad-left double-pad-down pad-top'>
          {this.props.curs.select('players').get().map(function(player,index){
            return(<PlayerReact curs={self.props.curs.select('players').select(index)} rep={false} num={index} key={player.id} />)
            })}
            <But click={this.addPlayer} category='add'/>
            </div>
        </div>
        <div className="row pad-left double-pad-top">
      {cycles.get().map(function(cycle,index){
            return (<CycleReact curs={cycles.select(index)} num={index} key={cycle.id} />)
        })}
        <But click={this.addCycle} category='add'/>
        </div>
      </div>
    )
  }
});
