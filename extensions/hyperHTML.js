
(function(){

var script = document.createElement('script');
script.src = 'https://rawgit.com/WebReflection/hyperHTML/master/min.js';
document.head.appendChild(script);

xtag.extensions.hyper = {
  mixin: (base) => class extends base {
    set 'hyper::attr' (name){
      this.render(name);
    }
    get hyper (){
      return this.constructor.getOptions('hyper');
    }
    render (name){
      var _name = name || 'default';
      var template = this.hyper[_name];
      if (template) {
        template.call(this, hyperHTML.bind(this));
      }
      else throw new ReferenceError('hyperHTML template "' + _name + '" is undefined');
    }
  },
  onParse (klass, property, args, descriptor){
    klass.getOptions('hyper')[property || 'default'] = descriptor.value;
    return false;
  },
  onConstruct (node, property, args){
    if (JSON.parse(args[0] || false)) node.render(property);
  }
}

})();