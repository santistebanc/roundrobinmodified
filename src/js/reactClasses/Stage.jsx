var React = require('react');
var tree = require('./tree.js');
var But = require('./But.jsx');
var Round = require('./Round.jsx');
module.exports = React.createClass({
  mixins: [tree.mixin],
  cursor: ['stage'],
  addRound: function(){
    this.cursor.get().addRound(null,1);
    this.forceUpdate();
  },
  render: function() {
    var rounds = this.cursor.select('rounds');
    return (
      <div id='stage' className='box'>
      {rounds.get().map(function(round,index){
            return (<Round curs={rounds.select(index)} num={index} key={round.id} />)
        })}
        <But click={this.addRound} category='add'/>
      </div>
    )
  }
});
