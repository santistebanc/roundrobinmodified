//TODO Use unique ids instead of names
//TODO Allow defaults (lock player)
//TODO Settings panel
//TODO Drag and Drop


var players = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'];
var settings = {
  rounds: [{
    simulations: 500,
    cycles: [{
      groups: [{
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 2
      }]
    }, {
      groups: [{
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 2
      }]
    }, {
      groups: [{
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 2
      }]
    }, {
      groups: [{
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 2
      }]
    }, {
      groups: [{
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 2
      }]
    }, {
      groups: [{
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 2
      }]
    }, {
      groups: [{
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 2
      }]
    }]
  }]
};

var Bracket = function(roundsettings, players) {
  this.players = players.slice();
  this.repetitions = 0;
  this.lowestplayed;
  this.highestplayed = 0;
  //initialize stats for every player (nobody has played against anybody)
  this.stats = _.map(players, function(player) {
    return {
      name: player,
      played: [],
      notplayed: _.without(this.players, player)
    };
  });
  //initialize bracket layout with empty placeholders
  this.layout = _.map(roundsettings.cycles, function(cycle) {
    return _.map(cycle.groups, function(group) {
      var groupplayers = [];
      _.times(group.groupsize, function() {
        groupplayers.push({
          name: undefined,
          repeated: false
        });
      });
      return groupplayers;
    });
  });
}

var Simulation = function(players, roundsettings) {
  this.players = players.slice();
  this.roundsettings = roundsettings;
  this.generate = function() {
    var bracket = new Bracket(this.roundsettings, this.players);
    _.each(bracket.layout, function(cycle) {
      var remainingplayers = this.players;
      _.each(cycle, function(group) {
        var inthegroup = [];
        _.each(group, function(place, index, thisgroup) {
          remainingplayers = getremainingplayers(remainingplayers, bracket.stats);
          var chosen = _.first(remainingplayers);
          if (index == 0) {
            //insert player if is first in group
            inthegroup.push(chosen);
            thisgroup[index] = {
              name: chosen,
              repeated: false
            };
            remainingplayers = _.without(remainingplayers, chosen);
          } else {
            //get stats from all players inthegroup
            var playersstats = [];
            _.each(inthegroup, function(selected) {
              playersstats.push(_.find(bracket.stats, function(player) {
                return player.name == selected;
              }));
            });
            playersstats = _.sortBy(playersstats, function(stat) {
              return stat.played.length;
            });
            //calculate possible players
            var candidates = _.reduce(playersstats, function(memo, statplayer) {
              return _.intersection(memo, statplayer.notplayed);
            }, remainingplayers);
            var winner;
            if (candidates.length > 0) {
              //choose player to be put
              winner = _.first(candidates);
              thisgroup[index] = {
                name: winner,
                repeated: false
              };
            } else {
              //because no available candidates put any player
              winner = _.first(remainingplayers);
              //console.log('repetition found with ' + winner);
              thisgroup[index] = {
                name: winner,
                repeated: true
              };
              bracket.repetitions++;
            }
            inthegroup.push(winner);
            remainingplayers = _.without(remainingplayers, winner);
            //change played and notplayed in stats
            _.each(inthegroup, function(selected) {
              var ind = _.findIndex(bracket.stats, function(player) {
                return player.name == selected;
              });
              var man = bracket.stats[ind];
              man.played = _.without(_.union(man.played, inthegroup), selected);
              man.notplayed = _.difference(man.notplayed, inthegroup);
            });
          }
        });
      });
    });
    //get lowestplayed and highestplayed
    var lowest = bracket.lowestplayed;
    _.each(bracket.stats, function(selected) {
      if (!lowest || selected.played.length < lowest) {
        lowest = selected.played.length;
      }
    });
    bracket.lowestplayed = lowest;
    var highest = bracket.highestplayed;
    _.each(bracket.stats, function(selected) {
      if (selected.played.length > highest) {
        highest = selected.played.length;
      }
    });
    bracket.highestplayed = highest;
    return bracket;
  };
}

function getremainingplayers(theplayers, thestats) {
  //get players with their stats
  var playersstats = [];
  _.each(theplayers, function(selected) {
    playersstats.push(_.find(thestats, function(player) {
      return player.name == selected;
    }));
  });
  var groupedbyplayed = _.groupBy(playersstats, function(player) {
    return player.played.length;
  });
  var arr = _.values(groupedbyplayed);
  var shuffled = _.map(arr, function(category) {
    return _.shuffle(category);
  });
  var flatthem = _.flatten(shuffled);
  var remainingplayers = _.pluck(flatthem, 'name');
  return remainingplayers;
}

function createRound(roundplayers, roundsettings) {

  return new Promise(function(resolve) {
    var finalresult;
    var leastreps;
    var lowest = 0;
    var done = _.after(roundsettings.simulations, function() {
      resolve(finalresult);
    });
    _.times(roundsettings.simulations, function() {
      var promise = new Promise(function(resolve) {
        var sim1 = new Simulation(roundplayers, roundsettings);
        var bracket = sim1.generate();
        resolve(bracket);
      }).then(function(bracket) {
        if (!leastreps || bracket.repetitions < leastreps) {
          leastreps = bracket.repetitions;
          lowest = bracket.lowestplayed;
          finalresult = bracket;
        } else if (bracket.repetitions === leastreps) {
          if (bracket.lowestplayed > lowest) {
            leastreps = bracket.repetitions;
            lowest = bracket.lowestplayed;
            finalresult = bracket;
          }
        }
        done();
        _.each(bracket.layout, function(cycle) {});
      }, function(err) {
        resolve('error');
      });
    });

  });
}
