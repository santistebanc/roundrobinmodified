var players = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];
var stage = {rounds:[{layout:[]}]};
var settings = {
  rounds: [{
    simulations: 100,
    cycles: [{
      groups: [{
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 3
      }, {
        groupsize: 3
      }]
    }, {
      groups: [{
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 3
      }, {
        groupsize: 3
      }]
    }, {
      groups: [{
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 3
      }, {
        groupsize: 3
      }]
    }, {
      groups: [{
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 4
      }, {
        groupsize: 3
      }, {
        groupsize: 3
      }]
    }]
  }]
};

var Bracket = function(roundsettings, players) {
  this.players = players.slice();
  this.repetitions = 0;
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
      var remainingplayers = _.shuffle(this.players);
      _.each(cycle, function(group) {
        var inthegroup = [];
        _.each(group, function(place, index, thisgroup) {
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
            //calculate possible players
            var candidates = _.reduce(playersstats, function(memo, statplayer) {
              return _.intersection(memo, statplayer.notplayed);
            }, remainingplayers);
            var shuffledcandidates = _.shuffle(candidates);
            var winner;
            if (candidates.length > 0) {
              //choose player to be put
              winner = _.first(shuffledcandidates);
              thisgroup[index] = {
                name: winner,
                repeated: false
              };
            } else {
              //because no available candidates put any player
              winner = _.first(_.shuffle(remainingplayers));
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
    return bracket;
  };
}

function createRound(roundplayers, roundsettings) {
  var finalresult;
  var count = 0;
  var leastreps = players.length;
  var done = _.after(roundsettings.simulations, function() {
    console.log('final result: ', finalresult);
  });
  _.times(roundsettings.simulations, function() {
    var promise = new Promise(function(resolve) {
      var sim1 = new Simulation(roundplayers, roundsettings);
      var bracket = sim1.generate();
      resolve(bracket);
    });

    promise.then(function(bracket) {
      if (bracket.repetitions < leastreps) {
        leastreps = bracket.repetitions;
        finalresult = bracket;
      }
      done();
      _.each(bracket.layout, function(cycle) {});
    }, function(err) {
      console.log('error', err);
    });
  });
}
