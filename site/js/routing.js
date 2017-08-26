

(function(){

  var titles = {
    '/docs': 'Docs',
    '/builds': 'Builds',
  };

  var removeTrailingSlash = /\/$/;
  function getPathname(anchor){
    return (anchor || location).pathname.replace(removeTrailingSlash, '') || '/';
  }

  document.body.setAttribute('path', getPathname());

  window.updateRoute = function updateRoute(anchor, push) {
    var pathname = getPathname(anchor);
    var title = 'X-Tag - ' + titles[pathname];
    document.body.setAttribute('path', pathname);   
    if (push !== false) history.pushState(null, title, anchor.href);
  }
  
  var redirect = sessionStorage.redirect;
  delete sessionStorage.redirect;
  if (redirect && redirect != location.href) {
    history.replaceState(null, null, redirect);
    updateRoute(redirect, false);
  }
  else document.body.setAttribute('path', getPathname());

  window.addEventListener('popstate', function(e){
    document.body.setAttribute('path', getPathname());
  }, true);

})();