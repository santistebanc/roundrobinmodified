var Player = require('./Player.js');
var Round = require('./Round.js');
module.exports = function(registeredplayers){
  this.roundscount = 0;
  this.rounds = [];
  this.playerscount = 0;
  var self = this;
  //create list of players with porperties
  this.players = _.map(registeredplayers,function(name,index){
    self.playerscount++;
    return new Player(self.playerscount-1,name);
  });
  var self = this;
  _.each(this.players,function(player,index){
    player.notplayed = self.players.slice();
  });
  this.addRound = function(id,simulations,players,displayname){
    var theid = id ? id:this.roundscount;
    var plays = players ?players:this.players;
    this.rounds.push(new Round(theid,simulations,plays,displayname));
    this.roundscount++;
  }
}
