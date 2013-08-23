Util.Objects["jobs"] = new function() {
	this.init = function(e) {
		var node, i;

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

		// do what ever is needed


		var nodes = u.qsa("ul.jobs li", e);
		for(i = 0; node = nodes[i]; i++) {

			u.link(node);
			// handling extended content
			node.Response = function(response) {
//				u.bug("response")

				this.innerHTML = u.qs("#maincontent", response).innerHTML;

				// move originsite on top of header
				var originsite = u.qs(".info .originsite", this);
				if(originsite) {
					this.insertBefore(originsite, u.qs("h2", this));
				}

				u.articleSnippet(u.qs(".article", this));

				u.init(this);

			}
			u.Request(node, node.url);

		}



		// call content ready class
		e.ready();
	}
}