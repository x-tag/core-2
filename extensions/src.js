
xtag.extensions.src = {
  mixin: (base) => class extends base {
    constructor(){
      super();
    }
    'src::attr' (val){
      var self = this;
      var xhr = new XMLHttpRequest();
      console.log(this);
      xhr.open('GET', val, true);

      xhr.onload = function (event) {
        xtag.fireEvent(self, 'load', { detail: xhr.response });
      };

      xhr.onerror = function (event) {
        xtag.fireEvent(self, 'error', { detail: xhr.response });
      };

      xhr.send(null);
    }
  }
};