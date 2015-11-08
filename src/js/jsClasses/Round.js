var Cycle = require('./Cycle.js');
module.exports = function(id,simulations,players,displayname){
  this.id = id;
  this.simulations = simulations;
  this.players = players;
  this.displayname = displayname ? displayname:'Round '+(id+1);
  this.cycles = [new Cycle(0)];
  this.cyclescount = 1;
}
