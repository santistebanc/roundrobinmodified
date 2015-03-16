//TODO Allow defaults (lock player)
//TODO Settings panel
//TODO Drag and Drop

var Simulation = function() {
  this.generate = function(round) {
    //initialize
    var bracket = round;
    bracket.repetitions = 0;

    _.each(bracket.cycles, function(cycle) {
      var remainingplayers = bracket.players;
      _.each(cycle.groups, function(group) {
        var inthegroup = [];
        _.each(group.places, function(place, index, places) {

          //order remainingplayers
            var groupedbyplayed = _.groupBy(remainingplayers, function(player) {
              return player.played.length;
            });
            var arr = _.values(groupedbyplayed);
            var shuffled = _.map(arr, function(category) {
              return _.shuffle(category);
            });
            var flatthem = _.flatten(shuffled);
            remainingplayers = flatthem;
          //
          var chosen = _.first(remainingplayers);


          if (index == 0) {
            //insert player if is first in group
            inthegroup.push(chosen);
            places[index] = chosen;
            remainingplayers = _.without(remainingplayers, chosen);
          } else {

            inthegroup = _.sortBy(inthegroup, function(player) {
              return player.played.length;
            });
            //calculate possible players
            var candidates = _.reduce(inthegroup, function(memo, player) {
              return _.intersection(memo, player.notplayed);
            }, remainingplayers);
            var winner;
            if (candidates.length > 0) {
              //choose player to be put
              winner = _.first(candidates);
              places[index] = winner;
            } else {
              //because no available candidates put any player
              winner = _.first(remainingplayers);
              //console.log('repetition found with ' + winner);
              places[index] = winner;
              bracket.repetitions++;
            }
            inthegroup.push(winner);
            remainingplayers = _.without(remainingplayers, winner);
            //change played and notplayed in stats
            _.each(inthegroup, function(player) {
              player.played = _.without(_.union(player.played, inthegroup), player);
              player.notplayed = _.difference(player.notplayed, inthegroup);
            });
          }
        });
      });
    });
    //get lowestplayed and highestplayed
    var lowest = bracket.leastagainst;
    var sorted = _.sortBy(bracket.players, function(player) {  return player.played.length;});
    bracket.leastagainst = _.first(sorted).played.length;
    bracket.mostagainst = _.last(sorted).played.length;

    return bracket;
  };
}

function createRound(round) {
  return new Promise(function(resolve) {
    var finalresult;
    var leastreps;
    var lowest = 0;
    var done = _.after(round.simulations, function() {
      resolve(finalresult);
    });
    _.times(round.simulations, function() {
      var promise = new Promise(function(resolve) {
        var sim = new Simulation();
        var bracket = sim.generate(round);
        resolve(bracket);
      }).then(function(bracket) {
        if (!leastreps || bracket.repetitions < leastreps) {
          leastreps = bracket.repetitions;
          lowest = bracket.leastagainst;
          finalresult = bracket;
        }else if (bracket.repetitions === leastreps) {
          if (bracket.leastagainst > lowest) {
            leastreps = bracket.repetitions;
            lowest = bracket.leastagainst;
            finalresult = bracket;
          }
        }
        done();
      }, function(err) {
        resolve(err);
      });
    });

  });
}
