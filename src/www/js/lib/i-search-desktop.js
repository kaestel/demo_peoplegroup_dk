Util.Objects["search"] = new function() {
	this.init = function(e) {

		// page reference
		var page = u.qs("#page");


		// list items ready - enable drag
		e.ready = function() {
//			u.bug("inner content ready")

			if(!this.initialized) {
				u.ac(u.qs("#content"), "ready");
				u.qs("#content").ready();
				this.initialized = true;
			}
		}



		// initialize search results
		var nodes = u.qsa("li .readmore", e);
		
		for(i = 0; node = nodes[i]; i++) {
			node.url = node.href;
			node.removeAttribute("href");
			u.e.click(node);
			node.clicked = function(event) {
				location.hash = u.h.cleanHash(this.url);
//				alert("click")
			}
		}


		// call content ready class
		e.ready();
	}
}