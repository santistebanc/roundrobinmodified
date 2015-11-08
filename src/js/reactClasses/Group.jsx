var React = require('react');
var EditableText = require('./EditableText.jsx');
var But = require('./But.jsx');
var PlaceReact = require('./Place.jsx');
var Place = require('../jsClasses/Place.js');
module.exports = React.createClass({
  changeName: function(newname){
    this.props.curs.set('displayname',newname);
  },
  removeGroup: function(){
    this.props.curs.remove();
  },
  addPlace: function(){
    this.props.curs.select('places').push(new Place(this.props.curs.get().placescount));
    this.props.curs.set('placescount',this.props.curs.get().placescount+1);
  },
  isRep: function (who){
    var rep = false;
    var cache = this.props.curs.get().cache;
    var players = _.pluck(this.props.curs.get().places, 'player');
    var inthegroup = _.filter(cache, function(player){
      return _.find(players,function(pla){
        return pla ? (pla.id == player.id):false;
      });
    });
    _.each(inthegroup, function(player) {
      if (_.find(player.played, function(pla) {
          return pla == who;
        })) {
          //it is repeated
        who.repeatedwith = _.union(who.repeatedwith, [player]);
        player.repeatedwith = _.union(player.repeatedwith, [who]);
        rep = true;
      }
    });
    return rep;
  },
  render: function() {
    var places = this.props.curs.select('places');
    var self = this;
    return (
      <div className='success box inline-block'>
      <div className="row pad-left pad-right">
        <div className='inline-block'><EditableText content={this.props.curs.get().displayname} onchange={this.changeName}/></div>
        <div className='inline-block double-pad-left'>
        <But click={this.removeGroup} category='remove'/>
        </div>
      </div>
      {places.get().map(function(place,index){
            return(<Place curs={places.select(index)} rep={self.isRep(place.player)} num={index} key={place.id} />)
        })}
        <But click={this.addPlace} category='add'/>
      </div>
    )
  }
});
