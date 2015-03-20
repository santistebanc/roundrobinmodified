var Player = function(id, name, played, notplayed){
  this.id = id;
  this.name = name;
  this.repeatedwith = [];
  this.played = [];
  this.notplayed = [];
}

var Place = function(id,player){
  this.id = id;
  this.locked = false;
  this.player = player;
}

var Group = function(id,displayname){
  this.id = id;
  this.cache = [];
  this.displayname = displayname ? displayname:'Group '+id;
  this.places = [new Place(0)];
  this.placescount = 1;
}

var Cycle = function(id,displayname){
  this.id = id;
  this.displayname = displayname ? displayname:'Cycle '+id;
  this.groups = [new Group(0)];
  this.groupscount = 1;
}

var Round = function(id,simulations,players,displayname){
  this.id = id;
  this.simulations = simulations;
  this.players = players;
  this.displayname = displayname ? displayname:'Round '+id;
  this.cycles = [new Cycle(0)];
  this.cyclescount = 1;
}

var Stage = function(registeredplayers){
  this.roundscount = 0;
  this.rounds = [];
  //create list of players with porperties
  this.players = _.map(registeredplayers,function(name,index){
    return new Player(index,name);
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

//initial config
var registerednames = ['A','B','C','D','E','F'];
var newstage = new Stage(registerednames);
newstage.addRound(null,1);
obj = {
  stage:newstage
};
var tree = new Baobab({stage:{players:[],rounds:[]}});
tree.set('stage',newstage);


var worker = new Worker('worker.js');

var  AddBut = React.createClass({
  render: function() {
    return (
      <button className='inline-block' onClick={this.props.click}><i className='icon-plus'></i></button>
    )
  }
});

var GenerateBut = React.createClass({
  getInitialState: function() {
    return {status:0, classes:['green'], message:'Generate!'};
  },
  handleClick: function(event) {
    if(this.state.status == 0){

      this.setState({status:1});
      this.setState({message:(<span><i className="icon-spinner icon-spin"></i> Loading</span>)});
      var self = this;
      var extended = _.extend(this.props.curs.get(),{addCycle:null});
      console.log(extended);
      var args = [extended];
      var callback = function(e) {
        var result = e.data.result;
        if (e.data.status == 1) {
          self.setState({message:(<span><i className="icon-refresh"></i> Reload</span>)});
          self.setState({status:0});
          self.props.curs.up().set(self.props.curs.get().id,result);
            worker.removeEventListener('message', callback , false);
        }
      };
      worker.addEventListener('message', callback , false);
      worker.postMessage({
        'cmd': 'createRound',
        'args': args
      });

    }
  },
  render: function() {
    var theclass = this.state.classes.join(' ');
    return (
        <button className={theclass} onClick={this.handleClick}>{this.state.message}</button>
    )
  }
});

var PlaceClass = React.createClass({
  toggleLock: function(){
    this.props.curs.set('locked',!this.props.curs.get().locked);
  },
  render: function() {
    var divclasses = ['box','inline-block'];
    if(!this.props.curs.get().player){
      return (
        <div className={divclasses.join(' ')}><small>empty</small></div>
      )
    }else{
      if(this.props.rep){
        divclasses = divclasses.concat(['red']);
      }else{
        divclasses = divclasses.concat(['blue']);
      }
    return (
      <div className={divclasses.join(' ')}>
      <h4>{this.props.curs.get().player.name}</h4>
      <button className='inline-block' onClick={this.toggleLock}><i className={this.props.curs.get().locked ? 'icon-lock':'icon-unlock-alt'}></i></button>
      </div>
    )
    }
  }
});

var GroupClass = React.createClass({
  isRep: function (who){
    var rep = false;
    var cache = this.props.curs.get().cache;
    var players = _.pluck(this.props.curs.get().places, 'player');
    var inthegroup = _.filter(cache, function(player){
      return _.find(players,function(pla){
        return pla.id == player.id;
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
      <h5>Group {this.props.num+1}</h5>
      {places.get().map(function(place,index){
            return(<PlaceClass curs={places.select(index)} rep={self.isRep(place.player)} num={index} key={place.id} />)
        })}
      </div>
    )
  }
});

var CycleClass = React.createClass({
  render: function() {
    var groups = this.props.curs.select('groups');
    return (
      <div className='alert box inline-block'>
      <h5>Cycle {this.props.num+1}</h5>
      {groups.get().map(function(group,index){
            return(<GroupClass curs={groups.select(index)} num={index} key={group.id} />)
        })}
      </div>
    )
  }
});

var RoundClass = React.createClass({
  render: function() {
    var cycles = this.props.curs.select('cycles');
    return (
      <div className='info box'>
      <h5>Round {this.props.num+1}</h5>
      <div className="row pad-left">
        <GenerateBut curs={this.props.curs}/>
      </div>
      {cycles.get().map(function(cycle,index){
            return (<CycleClass curs={cycles.select(index)} num={index} key={cycle.id} />)
        })}
      </div>
    )
  }
});

var StageClass = React.createClass({
  mixins: [tree.mixin],
  cursor: ['stage'],
  addRound: function(){
    this.cursor.get().addRound(null,1);
    this.forceUpdate();
  },
  render: function() {
    var rounds = this.cursor.select('rounds');
    return (
      <div id='stage' className='box'>
      <AddBut click={this.addRound}/>
      {rounds.get().map(function(round,index){
            return (<RoundClass curs={rounds.select(index)} num={index} key={round.id} />)
        })}
      </div>
    )
  }
});

var App = React.createClass({
  render: function() {
    return (
      <div>
      <h2 className='pad-top pad-left'>RoundRobin Generator</h2>
      <div className="row double-pad-top">
        <StageClass />
      </div>
      </div>
    )
  }
});

React.render(
  <App />,
  document.getElementById('app')
);

worker.addEventListener('message', function(e){
  console.log(e.data);
}, false);
