var React = require('react');
module.exports = React.createClass({
  render: function() {
    var butclass;
    var iconclass;
    if(this.props.category == 'add'){
      butclass = '';
      iconclass = 'icon-plus';
    }else if(this.props.category == 'remove'){
      butclass = '';
      iconclass = 'icon-remove';
    }
    return (
      <button className={'inline-block smallbut'+butclass} onClick={this.props.click}><i className={iconclass}></i></button>
    )
  }
});
