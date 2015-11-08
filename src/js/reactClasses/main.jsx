var App = require('./App.jsx')
var React = require('React')
modules.export = function (){
  console.log('done2');
  React.render(
  <App />,
  document.getElementById('app')
);
}
