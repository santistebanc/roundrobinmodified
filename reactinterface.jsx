var stage = {
  rounds: [{
    id: 0,
    simulations: 500,
    cycles: [{
      id: 0,
      groups: [{
        id: 0,
        groupsize: 4,
        places:[{name:'Juan'},{},{},{}]
      },{
        id: 1,
        groupsize: 4,
        places:[{},{},{},{}]
      },{
        id: 2,
        groupsize: 4,
        places:[{},{},{},{}]
      }]},
      {
        id: 1,
        groups: [{
          id: 0,
          groupsize: 4,
          places:[{},{},{},{}]
        },{
          id: 1,
          groupsize: 4,
          places:[{},{},{},{}]
        },{
          id: 2,
          groupsize: 4,
          places:[{},{},{},{}]
        }]},
        {
          id: 2,
          groups: [{
            id: 0,
            groupsize: 4,
            places:[{},{},{},{}]
          },{
            id: 1,
            groupsize: 4,
            places:[{},{},{},{}]
          },{
            id: 2,
            groupsize: 4,
            places:[{},{},{},{}]
          }]}]
  }]
};

var worker = new Worker('worker.js');


function drawRound(roundindex, bracket) {
  var round = stage.rounds[roundindex];
  _.each(bracket.layout, function(cycle, cycleindex) {
    _.each(cycle, function(group, groupindex) {
      _.each(group, function(player, playerindex) {
        round.cycles[cycleindex].groups[groupindex].places[playerindex] = player;
      });
    });
  });
}

var Place = React.createClass({
  render: function() {
    return (
      <div className='blue box inline-block'>
      <h4>{this.props.data.name}</h4>
      </div>
    )
  }
});

var Group = React.createClass({
  render: function() {
    return (
      <div className='success box inline-block'>
      <h5>Group {this.props.num+1}</h5>
      {this.props.data.places.map(function(place,index){
            return(<Place data={place} num={index} />)
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
      var args = [players,stage.rounds[0]];
      var callback = function(e) {
        var result = e.data.result;
        if (e.data.status == 1) {
          self.setState({message:(<span><i className="icon-refresh"></i> Reload</span>)});
          self.setState({status:0});
          drawRound(0, result);
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

function stop() {
  // worker.terminate() from this script would also stop the worker.
  worker.postMessage({
    'cmd': 'stop'
  });
}

worker.addEventListener('message', function(e){
  console.log(e.data);
}, false);
