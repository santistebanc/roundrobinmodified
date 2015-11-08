var React = require('react');
var EditableText = require('./EditableText.jsx');
var But = require('./But.jsx');
module.exports = React.createClass({
  changeName: function(newname){
    this.props.curs.select('player').set('name',newname);
  },
  removePlace: function(){
    this.props.curs.remove();
  },
  toggleLock: function(){
    this.props.curs.set('locked',!this.props.curs.get().locked);
  },
  render: function() {
    var divclasses = ['box','inline-block','playerbox'];
    var nom;
    if(this.props.curs.get().player){
      nom = this.props.curs.get().player.name;
      if(this.props.rep){
        divclasses = divclasses.concat(['red']);
      }else{
        divclasses = divclasses.concat(['blue']);
      }
    }else{
      nom = 'empty';
    }
    return (
      <div className={divclasses.join(' ')}>
      <div className="row pad-left pad-right">
      <EditableText content={nom} onchange={this.changeName}/>
      </div>
      <div className='inline-block double-pad-left'>
      <But click={this.removePlace} category='remove'/>
      </div>
      <button className='inline-block smallbut' onClick={this.toggleLock}><i className={this.props.curs.get().locked ? 'icon-lock':'icon-unlock-alt'}></i></button>
      </div>
    )
  }
});
