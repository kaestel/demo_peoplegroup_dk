Util.Objects["cases"] = new function() {
	this.init = function(e) {
		var i, node;

		// page reference
		var page = u.qs("#page");


		// list items ready - enable drag
		e.ready = function() {
//			u.bug("ready")
			u.ac(u.qs("#content"), "ready");
			u.qs("#content").ready();
		}

		// prepare scene for dynamic page
		e.scene = u.ae(e, "div", "scene");
		e.scene.e = e;
		page.cN.scene = e.scene;

		e.scene.view = u.ae(e.scene, "div", "view");
		e.scene.view.scene = e.scene;
		e.scene.pagination = u.ae(e.scene, "div", "pagination");
		e.scene.pagination.scene = e.scene;
		e.scene.list = e.scene.appendChild(u.qs("ul.cases", e));


		var search_form = u.ie(e, "div", "search");
		var label = u.ae(search_form, "label", ({"for":"search_input"}));
		label.innerHTML = u.txt["search"] + ":";
		e.search = u.ae(search_form, "input", ({"type":"text", "id":"search_input"}));

		// add value to search input and remove on focus and on blur
		e.search.scene = e.scene;
		e.search.default_value = u.txt["type_client"]; //"Indtast kunde eller projektnavn";
		e.search.value = e.search.default_value;
		if(e.search) {
			e.search.onfocus = function() {
				if(this.value == this.default_value) {
					this.value = "";
				}
			}
			e.search.onblur = function() {
				if(this.value == "") {
					this.value = this.default_value;
				}
			}
		}

		e.search.updateList = function() {
			var i, node;

//			var nodes = u.qsa(".case", this.scene.list);
			for(i = 0; node = this.scene.nodes[i]; i++) {
				if(node.textContent.match(this.value)) {
					this.showNode(node);
				}
				else {
					this.hideNode(node);
				}
			}
		}

		// show node
		e.search.showNode = function(node) {
			if(!node.show) {
				node.show = true;
				u.rc(node, "disabled");

				u.a.transition(node, "none");
				node.transitioned = null;

				u.as(node, "display", "block");
				u.a.transition(node, "all 0.3s ease-out");
				u.a.setOpacity(node, 1);
			}
		}

		// hide node
		e.search.hideNode = function(node) {
//			u.bug("hide")

			if(node.show) {
				node.show = false;
				u.ac(node, "disabled");

				u.a.transition(node, "none");
				node.transitioned = function(event) {
					u.as(node, "display", "none");
				}

				if(u.gcs(node, "opacity") == 0) {
//				if(node._opacity == 0) {
					node.transitioned();
				}
				else {
					u.a.transition(node, "all 0.5s ease-out");
					u.a.setOpacity(node, 0);
				}
			}
		}

		e.search.onkeyup = function(event) {
			u.t.resetTimer(this.t_search);
			this.t_search = u.t.setTimer(e.search, e.search.updateList, 200);
		}


		// navigate cases
		e.scene.navigate = function() {
//			u.bug("e.scene.navigate:" + u.h.getCleanHash(location.hash));

			// reset selected case
			if(this.selected_case) {
				u.rc(this.selected_case, "selected");
				this.selected_case = false;
			}

			// specific case
			if(u.h.getCleanHash(location.hash, 1) != u.h.getCleanHash(location.hash, 2)) {

				// find selected node based on url
				var i, node;
				for(i = 0; node = this.nodes[i]; i++) {
					if(u.h.getCleanUrl(node.url) == u.h.getCleanHash(location.hash, 2)) {
						this.selected_case = node;
						break;
					}
				}

				// is a case already shown
				if(this.className.match(/detail/g)) {
//					u.bug("detail to detail - specific case:" + this.current_case_url)

					this.view.transitioned = function(event) {
						u.a.transition(this, "none");
						this.transitioned = null;

						u.ac(this.scene, "detail");
						u.rc(this.scene, "overview");

						// set specific case
						this.innerHTML = this.scene.selected_case.innerHTML;
						u.init(this);

						u.a.transition(this, "all 0.5s ease-in");
						u.a.setOpacity(this, 1);
					}

					if(u.gcs(this.view, "opacity") != 0) {
						u.a.transition(this.view, "all 0.5s ease-out");
						u.a.setOpacity(this.view, 0);
					}
					else {
						this.view.transitioned();
					}

				}
				// going from overview to case
				else {
//					u.bug("overview to detail - specific case:" + this.current_case_url)

					this.transitioned = function(event) {
						u.a.transition(this, "none");
						this.transitioned = null;

						u.ac(this, "detail");
						u.rc(this, "overview");

						// set specific case
						this.view.innerHTML = this.selected_case.innerHTML;
						u.init(this.view);


						u.a.transition(this, "all 0.5s ease-out");
						u.a.setOpacity(this, 1);

					}
					if(u.gcs(this, "opacity") != 0) {
						u.a.transition(this, "all 0.5s ease-out");
						u.a.setOpacity(this, 0);
					}
					else {
						this.transitioned();
					}

				}
			}
			// case overview
			else {

				this.transitioned = function(event) {
					u.a.transition(this, "none");
					this.transitioned = null;

					u.rc(this, "detail");
					u.ac(this, "overview");

					u.a.transition(this, "all 0.5s ease-out");
					u.a.setOpacity(this, 1);
				}

				if(u.gcs(this, "opacity") != 0) {
					u.a.transition(this, "all 0.5s ease-out");
					u.a.setOpacity(this, 0);
				}
				else {
					this.transitioned();
				}

			}

			this.pagination.updateButtons();

			this.e.ready();
		}

		e.scene.pagination.bn_prev = u.ae(e.scene.pagination, "div", "prev");
		e.scene.pagination.bn_prev.scene = e.scene;
		e.scene.pagination.bn_prev.innerHTML = u.txt["previous"]; //"Forrige";

		u.e.click(e.scene.pagination.bn_prev);
		e.scene.pagination.bn_prev.clicked = function(event) {
			if(this.scene.selected_case) {
				var prev = u.ps(this.scene.selected_case, "disabled");
				if(prev) {
					location.hash = u.h.getCleanUrl(prev.url);
				}
			}
		}

		e.scene.pagination.bn_next = u.ae(e.scene.pagination, "div", "next");
		e.scene.pagination.bn_next.scene = e.scene;
		e.scene.pagination.bn_next.innerHTML = u.txt["next"]; //"Næste";

		u.e.click(e.scene.pagination.bn_next);
		e.scene.pagination.bn_next.clicked = function(event) {
			if(this.scene.selected_case) {
				var next = u.ns(this.scene.selected_case, "disabled");
				if(next) {
					location.hash = u.h.getCleanUrl(next.url);
				}
			}
		}

		e.scene.pagination.bn_back = u.ae(e.scene.pagination, "div", "back");
		e.scene.pagination.bn_back.scene = e.scene;
		e.scene.pagination.bn_back.innerHTML = u.txt["overview"]; //"Overblik";

		u.e.click(e.scene.pagination.bn_back);
		e.scene.pagination.bn_back.clicked = function(event) {
			location.hash = u.h.getCleanHash(location.hash, 1);
		}

		e.scene.pagination.updateButtons = function() {
			
//			u.bug("selected:" + u.nodeId(this.scene.selected_case));

			if(this.scene.selected_case) {
				var prev = u.ps(this.scene.selected_case, "disabled");
				if(prev) {
					u.rc(this.bn_prev, "disabled");
				}
				else {
					u.ac(this.bn_prev, "disabled");
				}

				var next = u.ns(this.scene.selected_case, "disabled");
				if(next) {
					u.rc(this.bn_next, "disabled");
				}
				else {
					u.ac(this.bn_next, "disabled");
				}
			}
		}

		// setup overview nodes
		e.scene.nodes = u.qsa("li", e.scene.list);
		for(i = 0; node = e.scene.nodes[i]; i++) {

			node.scene = e.scene;
			u.link(node);

			// show node effect 
			node.show = function() {
//				u.bug("show")

				// reset hide timer
				this.t_hide = u.t.resetTimer(this.t_hide);

				// avoid hide timer effects on transition
				this.watch.transitioned = null;

				// setup fade sequence
				u.a.transition(this.image, "all 0.3s ease-out");
				u.a.setOpacity(this.image, 0.18);

				u.a.setOpacity(this.watch, 1);
				u.a.transition(this.watch, "all 0.7s cubic-bezier(.24,1,.15,.91)");
				u.a.translate(this.watch, 0, 0);
			}

			// start timeout for hiding
			node.considerHiding = function() {
//				u.bug("consider")

				// reset any existing timers to avoid blinking
				u.t.resetTimer(this.t_hide);
				this.t_hide = u.t.setTimer(this, this.hide, 200);
			}

			// hide node
			node.hide = function() {
//				u.bug("hide")

				// reposition after fadeout
				this.watch.transitioned = function(event) {
					u.a.transition(this, "none");
					u.a.translate(this, 0, 100);
				}

				if(u.gcs(this.watch, "opacity") == 0) {
//				if(this.watch._opacity == 0) {
					this.watch.transitioned();
				}
				// fade out
				else {
					u.a.transition(this.watch, "all 0.2s ease-in");
					u.a.setOpacity(this.watch, 0);
				}

				// fade up image
				u.a.transition(this.image, "all 0.3s ease-in");
				u.a.setOpacity(this.image, 1);
			}

			// handling extended content
			node.Response = function(response) {
				// search_string for indexing list
				this.search_string = "";

				this.innerHTML = u.qs("#maincontent", response).innerHTML;

				this.image = u.qs(".thumbnail", this);
				u.a.setOpacity(this.image, 0);

				this.image.loaded = function() {
//					u.bug("image loaded");
					u.a.transition(this, "all 0.5s ease-in");
					u.a.setOpacity(this, 1);
				}
				u.i.load(this.image, this.image.src);


				// setup content to fit design
				var h2 = u.qs("h2", this);
				var h2_text = h2.innerHTML;
				h2.innerHTML = "";
				var header = u.ae(h2, "div", "header");
				header.innerHTML = h2_text;

				// move client into header
				var client = u.qs(".info .client", this);
				if(client) {
					h2.insertBefore(client, header);
					// add client to search string
					this.search_string += client.innerHTML + " ";
				}
				// add header text to search string
				this.search_string += header.innerHTML;

				// set mouseover effect if mouse is input type
				if(u.e.event_pref == "mouse") {
					this.onmouseover = this.show;
					this.onmouseout = this.considerHiding;

					this.watch = u.ae(u.qs(".thumb", this), "div", "watch");

					u.a.setOpacity(this.watch, 0);
					u.as(this.watch, "display", "block");
					u.a.translate(this.watch, 0, 30);
				}

			}
			u.Request(node, node.url);

			// select node
			node.clicked = function(event) {
				location.hash = u.h.getCleanUrl(this.url);
			}

		}

		e.scene.navigate();

	}
}
