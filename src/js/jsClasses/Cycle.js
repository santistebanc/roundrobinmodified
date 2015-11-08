var Group = require('./Group.js');
module.exports = function(id,displayname){
  this.id = id;
  this.displayname = displayname ? displayname:'Cycle '+(id+1);
  this.groups = [new Group(0),new Group(1)];
  this.groupscount = 2;
}
