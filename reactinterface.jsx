var stage = {
  players:[],
  rounds: [{id: 0, simulations: 1, cycles: [{id: 0, groups: [{id: 0, places: [{id:0,status:0},{id:1,status:0},{id:2,status:0}]},
                                                               {id: 1, places: [{id:0,status:0},{id:1,status:0},{id:2,status:0}]}]
                                              },
                                              {id: 1, groups: [{id: 0, places: [{id:0,status:0},{id:1,status:0},{id:2,status:0}]},
                                                               {id: 1, places: [{id:0,status:0},{id:1,status:0},{id:2,status:0}]}]
                                              }]
           }]
};

var Player = function(id, name, played, notplayed){
  this.id = id;
  this.status = 1;
  this.name = name;
  this.repeated = false;

  this.played = [];
  this.notplayed = [];
}

var registerednames = ['A','B','C','D','E','F'];
//create list of players with porperties
var listofplayers = _.map(registerednames,function(name,index){
  return new Player(index,name);
});
_.each(listofplayers,function(player,index){
  player.notplayed = listofplayers.slice();
});
stage.players = listofplayers;
stage.rounds[0].players = listofplayers;



var worker = new Worker('worker.js');

var Place = React.createClass({
  render: function() {
    if(this.props.data.status == 0){
      return (
        <div className='box inline-block'><small>empty</small></div>
      )
    }else{
    return (
      <div className='blue box inline-block'>
      <h4>{this.props.data.name}</h4>
      </div>
    )
    }
  }
});

var Group = React.createClass({
  render: function() {
    return (
      <div className='success box inline-block'>
      <h5>Group {this.props.num+1}</h5>
      {this.props.data.places.map(function(place,index){
            return(<Place data={place} num={index} key={place.id} />)
        })}
      </div>
    )
  }
});

var Cycle = React.createClass({
  render: function() {
    return (
      <div className='alert box inline-block'>
      <h5>Cycle {this.props.num+1}</h5>
      {this.props.data.groups.map(function(group,index){
            return(<Group data={group} num={index} key={group.id} />)
        })}
      </div>
    )
  }
});

var Round = React.createClass({
  render: function() {
    return (
      <div className='info box'>
      <h5>Round {this.props.num+1}</h5>
      {this.props.data.cycles.map(function(cycle,index){
            return (<Cycle data={cycle} num={index} key={cycle.id} />)
        })}
      </div>
    )
  }
});

var Stage = React.createClass({
  render: function() {
    return (
      <div id='stage' className='box'>
      {this.props.data.rounds.map(function(round,index){
            return (<Round data={round} num={index} key={round.id} />)
        })}
      </div>
    )
  }
});

var GenerateBut = React.createClass({
  getInitialState: function() {
    return {status:0, classes:['green', 'animated', 'bounceInLeft'], message:'Generate!'};
  },
  handleClick: function(event) {
    if(this.state.status == 0){

      this.setState({status:1});
      this.setState({message:(<span><i className="icon-spinner icon-spin"></i> Loading</span>)});
      var self = this;

      var round1 = stage.rounds[0];
      //clone round1 players
      round1.players = _.map(round1.players,function(player){
          return new Player(player.id,player.name);
      });
      _.each(round1.players,function(player,index){
        player.notplayed = round1.players.slice();
      });
      console.log('round1',round1);

      var args = [round1];
      var callback = function(e) {
        var result = e.data.result;
        if (e.data.status == 1) {
          self.setState({message:(<span><i className="icon-refresh"></i> Reload</span>)});
          self.setState({status:0});
          stage.rounds[0] = result;
          self.props.onUpdate();
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

var App = React.createClass({
  getInitialState: function() {
    return {stage:stage};
  },
  update: function() {
    this.setState({stage:stage});
  },
  render: function() {
    return (
      <div>
      <h2 className='pad-top pad-left'>RoundRobin Generator</h2>
      <div className="row pad-left">
        <GenerateBut onUpdate={this.update}/>
      </div>
      <div className="row double-pad-top">
        <Stage data={this.state.stage} />
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
