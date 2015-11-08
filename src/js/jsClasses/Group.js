var Place = require('./Place.js');
module.exports = function(id,displayname){
  this.id = id;
  this.cache = [];
  this.displayname = displayname ? displayname:'Group '+(id+1);
  this.places = [new Place(0),new Place(1)];
  this.placescount = 2;
}
