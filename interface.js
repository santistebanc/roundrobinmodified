var stage = {
  rounds: [{
    layout: []
  }]
};


function drawRound(roundarea, bracket){
  $('#round'+roundarea).empty();
  $('#round'+roundarea).append('<h3>Round '+roundarea+'</h3>');
  _.each(bracket.layout, function(cycle,index){
    //append cycles
    var boxstart = '<div class="alert box animated fadeInLeft">';
    var title = '<h5>Cycle '+(index+1)+'<h5>';
    var boxend = '</div>';
    $('#round'+roundarea).append(boxstart.concat(title,boxend));
    var currentcycle = $('#round'+roundarea).children('div :last');
    _.each(cycle, function(group,index){
      //append groups
      var boxstart = '<div class="success box inline-block animated fadeInDown">';
      var title = '<h5>Group '+(index+1)+'<h5>';
      var boxend = '</div>';
      currentcycle.append(boxstart.concat(title,boxend));
      var currentcycle2 = currentcycle.children('div :last');
      _.each(group, function(player,index){
        //append players
        var boxstart = '<div class="blue box inline-block animated fadeInLeft">';
        var title = '<h5>'+player.name+'<h5>';
        var boxend = '</div>';
        currentcycle2.append(boxstart.concat(title,boxend));
      });
    });
  });
}


$('#generate').click(function(){
  createRound(players, settings.rounds[0]).then(function(result){
    console.log('final result: ', result);
    drawRound(1,result);
  }, function(err) {
    console.log('error', err);
  });
});
