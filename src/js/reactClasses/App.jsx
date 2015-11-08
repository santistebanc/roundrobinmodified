var Stage = require('./Stage.jsx');
module.exports = React.createClass({
  render: function() {
    return (
      <div>
      <h2 className='pad-top pad-left'>RoundRobin Generator</h2>
      <div className="row double-pad-top">
        <Stage />
      </div>
      </div>
    )
  }
});
