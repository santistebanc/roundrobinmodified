var worker = new Worker('worker.js');


function drawRound(roundarea, bracket) {
  $('#round' + roundarea).empty();
  $('#round' + roundarea).append('<h3>Round ' + roundarea + '</h3>');
  _.each(bracket.layout, function(cycle, index) {
    //append cycles
    var boxstart = '<div class="alert box animated fadeInLeft">';
    var title = '<h5>Cycle ' + (index + 1) + '<h5>';
    var boxend = '</div>';
    $('#round' + roundarea).append(boxstart.concat(title, boxend));
    var currentcycle = $('#round' + roundarea).children('div :last');
    _.each(cycle, function(group, index) {
      //append groups
      var boxstart = '<div class="success box inline-block animated fadeInDown">';
      var title = '<h5>Group ' + (index + 1) + '<h5>';
      var boxend = '</div>';
      currentcycle.append(boxstart.concat(title, boxend));
      var currentcycle2 = currentcycle.children('div :last');
      _.each(group, function(player, index) {
        //append players
        var boxstart;
        if (player.repeated == true) {
          boxstart = '<div class="player red box inline-block animated fadeInLeft">';
        } else {
          boxstart = '<div class="player blue box inline-block animated fadeInLeft">';
        }
        var title = '<h5>' + player.name + '<h5>';
        var boxend = '</div>';
        currentcycle2.append(boxstart.concat(title, boxend));
      });
    });
  });
}

$(document).on('click', '.player', function() {
  var colors = ['blue', 'asphalt', 'orange'];
  var self = $(this);
  for (i = 0; i < colors.length; i++) {
    var color = colors[i];
    if (self.hasClass(color)) {
      var num = (i + 1) % (colors.length);
      if (num == colors.length) {
        num = 0;
      }
      self.addClass(colors[num]);
      self.removeClass(colors[i]);
      break;
    }
  }
});

$('#generate').on('click', function() {
  if ($(this).hasClass('loading') == false) {
    var thisbutton = $(this);
    thisbutton.addClass('loading');
    thisbutton.empty();
    thisbutton.append('<i class="icon-spinner icon-spin"></i> Loading');
    var func = createRound;
    var args = [players,settings.rounds[0]];
    var who = thisbutton;
    var callback = function(e) {
      var result = e.data.result;
      if (e.data.status == 1) {
        thisbutton.removeClass('loading');
        thisbutton.empty();
        thisbutton.append('<i class="icon-refresh"></i> Reload');
          console.log(result);
          drawRound(1, result);
          worker.removeEventListener('message', callback , false);
      }
    };
    worker.addEventListener('message', callback , false);
    worker.postMessage({
      'cmd': 'createRound',
      'args': args
    });
  }
});

function stop() {
  // worker.terminate() from this script would also stop the worker.
  worker.postMessage({
    'cmd': 'stop'
  });
}

worker.addEventListener('message', function(e){
  console.log(e.data);
}, false);
