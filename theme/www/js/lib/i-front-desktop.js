Util.Objects["front"] = new function() {
	this.init = function(e) {
//		var i, node;

//		u.bug("init front")

		// page reference
		var page = u.qs("#page");


		// list items ready
		e.ready = function() {
//			u.bug("inner content ready-callback:" + this)

			if(this.initialized) {
				return;
			}
			else {
//				u.bug("content is ready")

				// show when ready
				u.ac(u.qs("#content"), "ready");
				u.qs("#content").ready();

				this.initialized = true;
			}
		}

		// extend node content - get content with ajax and continues with next node as long as nodes are in viewable area
		e.extendNode = function(node) {
//			u.bug("extend node:" + node.i)

			// avoid double initialization
			if(!node.initialized) {

				node.initialized = true;

				// handling extended content
				node.Response = function(response) {
//					u.bug("response")

					var article_node, i;

					// inject loaded content
					this.innerHTML = u.qs("#maincontent", response).innerHTML;

					// rearrange to fit design
					// move originsite on top of header
					var originsite = u.qs(".info .originsite", this);
					if(originsite) {
						this.insertBefore(originsite, u.qs("h2", this));
					}

					// prepare article
					u.articleSnippet(u.qs(".article", this));


					this.ready = function() {
//						u.bug("node ready:" + this.nodeName)

//						u.a.transition(this, "none");

						this.transitioned = function() {

							this.transitioned = null;
							u.a.transition(this, "none");

							// node loaded - look for next element to be preloaded
							var next = u.ns(this);
							if(next && this.offsetTop < u.scrollY() + u.browserH()) {
	//							u.bug("extend:" + node.i)
								this.e.extendNode(next);
							}
							// if no next - stop preloading routine
							else if(!next) {
								this.e.lowest = this.offsetTop + this.offsetHeight;
								this.e.done = true;
								this.e.ready();
							}
							else {
								this.e.lowest = this.offsetTop + this.offsetHeight;
								this.e.ready();
							}

						}

						// fade up node
						u.a.transition(this, "all 0.2s ease-in");
						u.a.setOpacity(this, 1);
					}

					// handle sub-routines - make sure they are ready before node is declared ready
					// sub is ready
					this.subReady = function() {
//						u.bug("sub ready" + this.className)
						// check if all subs are ready
						if(u.qsa(".ready", this.node).length == this.node.subs.length) {
							this.node.ready();
						}
					}

					// set callback from subroutines
					this.subs = u.ges("i\:([_a-zA-Z0-9])+", this);
					if(this.subs.length) {
						for(i = 0; sub = this.subs[i]; i++) {
//							u.bug("sub to wait for:" + sub.className);
							sub.node = node;
							sub.ready = this.subReady;
						}
						// init content
						u.init(this);
					}
					// no subs
					else {
						this.ready();
					}
				}

				// request extended content
				node.transitioned = function() {
//					u.bug("ready to load");
					u.Request(this, this.url);
				}

				u.a.transition(node, "all 0.5s ease-in");
				u.a.setOpacity(node, 0);
			}

			// node is already iniialized, look for next element to be preloaded
			else {

				var next = u.ns(node);
				if(next && node.offsetTop < u.scrollY() + u.browserH()) {
//					u.bug("extend next")
					this.extendNode(next);
				}
				// if no next - stop preloading routine
				else if(!next) {
					this.lowest = node.offsetTop + node.offsetHeight;
					this.done = true;
					this.ready();
				}
				else {
					this.lowest = node.offsetTop + node.offsetHeight;
					this.ready();
				}
			}
		}


		// set node references
		e.nodes = u.qsa(".list li", e);
		if(e.nodes.length) {
			for(i = 0; node = e.nodes[i]; i++) {
				node.e = e;
				node.i = i;

				// enable full li click
				u.link(node);
			}

			// extend nodes - re-iterates as long as required to load all visible content
			e.extendNode(e.nodes[0]);

			// preload when scrolling into focus
			window.onscroll = function() {
				var mc = u.qs("#maincontent");
				if(!mc.done && mc.lowest < u.scrollY() + u.browserH()) {
					mc.extendNode(mc.nodes[0]);
				}
			}

		}
		else {
			e.ready();
		}

	}
}
