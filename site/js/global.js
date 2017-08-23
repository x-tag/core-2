
(function(){
 
var nav = document.getElementById('global_nav');
var navCheckbox = document.getElementById('global_nav_checkbox');

navCheckbox.addEventListener('blur', function(e){
  if (!nav.contains(e.relatedTarget)) this.checked = false;
})

document.addEventListener('click', function(e){
  var anchor = e.target;
  if (anchor.host == location.host) {
    e.preventDefault();
    navCheckbox.checked = false;
    if (anchor.href != location.href) {
      updateRoute(anchor);
    }
  }
}, true);

})();