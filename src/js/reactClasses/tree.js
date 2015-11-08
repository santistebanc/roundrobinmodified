var Baobab = require('baobab');
var Stage = require('../jsClasses/Stage');

//initial config
var registerednames = ['A','B','C','D','E','F'];
var newstage = new Stage(registerednames);
newstage.addRound(null,5000);
obj = {
  stage:newstage
};

module.exports = new Baobab({stage:{players:[],rounds:[]}});
tree.set('stage',newstage);
