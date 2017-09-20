xtag.extensions.src = {
	mixin: (base) => class extends base {
		set 'src::attr' (val){
			var xhr = new XMLHttpRequest();
			xhr.open('GET', val, true);
      // sends back appropriate object type dependent on the file extension
			if(/\.json/.test(val)){
				xhr.responseType = "json";
			}
			else if(/\.html/.test(val)){
				xhr.responseType = "document";
			}
			else if(/\.xml/.test(val)){
				xhr.responseType = "document";
			}
			else{
				xhr.responseType = "text";
			}

			xhr.onload = () => xtag.fireEvent(this, 'load', { detail: xhr.response });
			xhr.onerror = () => xtag.fireEvent(this, 'error', { detail: xhr.response });
			xhr.send(null);
		}
	}
};
