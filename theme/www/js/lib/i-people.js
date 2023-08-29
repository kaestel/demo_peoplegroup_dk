Util.Objects["people"] = new function() {
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



		var nodes = u.qsa("ul.people li", e);
		for(i = 0; node = nodes[i]; i++) {
			node.e = e;

			u.link(node);

			// show node effect 
			node.show = function() {

				// reset hide timer
				this.t_hide = u.t.resetTimer(this.t_hide);

				// avoid hide timer effects on transition
				this.tools_ul.transitioned = null;

				// setup fade sequence
				u.a.transition(this.image, "all 0.3s ease-out");
				u.a.setOpacity(this.image, 0.18);


				u.a.setOpacity(this.tools_ul, 1);
				u.a.transition(this.tools_ul, "all 0.7s cubic-bezier(.24,1,.15,.91)");
				u.a.translate(this.tools_ul, 0, 0);

				u.a.setOpacity(this.email, 1);
				u.a.transition(this.email, "all 0.7s cubic-bezier(.24,1,.15,.91)");
				u.a.translate(this.email, 0, 0);

				u.a.setOpacity(this.tel, 1);
				u.a.transition(this.tel, "all 0.7s cubic-bezier(.24,1,.15,.91)");
				u.a.translate(this.tel, 0, 0);
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
				this.tools_ul.transitioned = function(event) {
//					u.bug("tools out")

					u.a.transition(this.node.tools_ul, "none");
					u.a.translate(this.node.tools_ul, this.node.tools_ul.offsetWidth, 0);

					u.a.transition(this.node.email, "none");
					u.a.translate(this.node.email, -this.node.offsetWidth, 0);

					u.a.transition(this.node.tel, "none");
					u.a.translate(this.node.tel, -this.node.offsetWidth, 0);
				}
				
				// set transition for fadeout
				u.a.transition(this.tools_ul, "all 0.2s ease-in");
				u.a.transition(this.email, "all 0.2s ease-in");
				u.a.transition(this.tel, "all 0.2s ease-in");

				// if already faded out, go streight to reposition
				if(u.gcs(this.tools_ul, "opacity") == 0) {
//				if(this.tools_ul._opacity == 0) {
					this.tools_ul.transitioned();
				}
				// fade out
				else {
					u.a.setOpacity(this.tools_ul, 0);
					u.a.setOpacity(this.email, 0);
					u.a.setOpacity(this.tel, 0);
				}
				// fade up image
				u.a.transition(this.image, "all 0.3s ease-in");
				u.a.setOpacity(this.image, 1);

			}




			// handling extended content
			node.Response = function(response) {
				var i, tool;
//				u.bug("response")

				// replace content of node with content of responce
				this.innerHTML = u.qs("#maincontent", response).innerHTML;
				// make sure content gets initialized
				u.init(this);

				// get image reference
				this.image = u.qs(".image", this);


				// get tools ul
				this.tools_ul = u.qs(".tools", this);
				this.tools_ul.node = this;
				// set initial visuals
				u.a.setOpacity(this.tools_ul, 0);
				u.as(this.tools_ul, "display", "block");
				u.a.setWidth(this.tools_ul, this.tools_ul.offsetWidth);
				u.a.translate(this.tools_ul, this.tools_ul.offsetWidth, 0);
				// setup links, kill event to avoid node-clicking
				this.tools = u.qsa("li", this.tools_ul);
				for(i = 0; tool = this.tools[i]; i++) {
					u.link(tool);
					tool.clicked = function(event) {
						u.e.kill(event);
						window.open(this.url, "_blank");
					}
				}

				// get email element
				this.email = u.qs(".email", this);
				// setup initial email visuals
				u.a.setOpacity(this.email, 0);
				u.as(this.email, "display", "block");
				u.a.translate(this.email, -this.offsetWidth, 0);
				// setup link, kill event to avoid node-clicking
				u.link(this.email);
				this.email.clicked = function(event) {
					u.e.kill(event);
					location.href = this.url;
				}

				// get telephone element
				this.tel = u.qs(".tel", this);
				// set initial visualt
				u.a.setOpacity(this.tel, 0);
				u.as(this.tel, "display", "block");
				u.a.translate(this.tel, -this.offsetWidth, 0);
				// setup link, kill event to avoid node-clicking
				u.link(this.tel);
				this.tel.clicked = function(event) {
					u.e.kill(event);
					location.href = this.url;
				}


				// set mouseover effect if mouse is input type
				if(u.e.event_pref == "mouse") {
					this.onmouseover = this.show;
					this.onmouseout = this.considerHiding;
				}

				// setup toggle event on click
				this.clicked = function() {
					// use classname to keep track
					u.tc(this, "show");
					if(this.className.match(/show/)) {
						this.hide();
					}
					else {
						this.show();
					}
				}
				u.e.click(this);

			}

			// get node content
			u.Request(node, node.url);

		}



		// call content ready class
		e.ready();
	}
}