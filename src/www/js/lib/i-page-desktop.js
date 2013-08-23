Util.Objects["page"] = new function() {
	this.init = function(e) {
		// e = page node in dom

//		u.bug("page init");

		var i, node;

		// manual base initialization, remove i:page
		u.removeClass(e, "i:page");


		// error handler
		var errorSwitch = function() {
//			return false;
//			location.href = "/error";
		}
//		window.onerror = errorSwitch;
//		document.t_error = u.t.setTimer(document, errorSwitch, 20000);
		var safetySwitch = function() {
			document.body.className += " loading";
		}
		document.t_safety = u.t.setTimer(document, safetySwitch, 5000);


		// remember home url (node may be moved around, altered or removed)
//		e.home_url = u.qs(".servicenavigation .front a", e).href;

		// MAIN ELEMENTS
		// header element
		e.hN = u.qs("#header", e);
		e.hN.page = e;
		// content element
		e.cN = u.qs("#content", e);
		e.cN.page = e;

		// by default content is hidden
		u.as(e.cN, "opacity", "0");
		// set general transition for content (set after default hiding)
		u.a.transition(e.cN, "opacity 0.5s ease-in");

		// navigation element
		e.nN = u.qs("#navigation", e);
		if(e.nN) {
			// move navigation in front of content node in the DOM
			e.nN = e.insertBefore(e.nN, e.cN);
			e.nN.page = e;

			// move frontpage node from servicenavigation to navigation
			e.nN.ul = u.qs("ul", e.nN);
			var h3 = u.ae(u.ie(e.nN.ul, "li", ({"class":"front"})), "h3");
			h3.appendChild(u.qs(".servicenavigation .front a"), e.hN);
		}
		// footer element
		e.fN = u.qs("#footer", e);
		e.fN.page = e;


		// HOME LINK
		e.home = u.qs("h1", e.hN);
		e.home.url = u.qs(".front a", e.nN).href;
		e.home.clicked = function(event) {
			location.href = this.url;
		}
		u.e.click(e.home);


		// CORP NAVIGATION
		var corp = u.qs(".corpnavigation", e.fN);
		if(corp) {
			e.hN.insertBefore(corp, e.home);
		}

		// NAVIGATION
		// set navigation links (before adding languages to #navigation)
		var navNodes = u.qsa("li", e.nN);
		for(i = 0; navNode = navNodes[i]; i++) {
			u.link(navNode);
			navNode.clicked = function(event) {
				location.hash = u.h.cleanHash(this.url);
			}
		}


		// LANGUAGES
		var languages = u.qs(".languages", e.hN);
		if(languages) {
			e.nN.appendChild(languages);
		}


// 		// SEARCH
// 		// move search node to #navigation
// 		e.search = u.ae(e.nN, "div", "search");
// 		e.search.e = e;
// 		e.search.url = u.qs(".servicenavigation .search a").href;
// 
// 
// 		// setup header search
// 		e.search.Response = function(response) {
// 
// 
// 			// inject search form
// 			this.form = this.appendChild(u.qs("#content form.search", response));
// 			this.form.onsubmit = function() {return false;}
// 
// 			// show search element
// 			this.input = u.qs("input.search", this);
// 			this.input.e = this;
// 
// 			// set focus/mouseover handler
// 			this.input.onfocus = function() {
// 				this.focused = true;
// 				u.ac(this.e, "focus");
// 			}
// 			this.input.onblur = function() {
// 				this.focused = false;
// 				u.rc(this.e, "focus");
// 			}
// 			this.onmouseover = function() {
// 				u.ac(this, "focus");
// 			}
// 			this.onmouseout = function() {
// 				if(!this.input.focused) {
// 					u.rc(this, "focus");
// 				}
// 			}
// 
// 			// "submit" on enter
// 			this.onkeydown = function(event) {
// 				if(event.keyCode == 13) {
// 					u.e.kill(event);
// 					if(this.input.value) {
// 						location.hash = u.h.cleanHash(this.form.action + "/" + this.input.value);
// 					}
// 					else {
// 						this.input.focus();
// 					}
// 				}
// 			}
// 
// 
// 
// 			// set search function handler
// 			var button = u.qs(".submit", this);
// 			button.e = this;
// //			button.setAttribute("type", "button");
// //			button.type = "button";
// 
// 			u.e.click(button);
// 			button.clicked = function(event) {
// 				u.e.kill(event);
// 				// TODO - dummy search request - submit form when backend ready
// 
// 				if(this.e.input.value) {
// 					location.hash = u.h.cleanHash(this.e.form.action + "/" + this.e.input.value);
// 				}
// 				else {
// 					this.e.input.focus();
// 				}
// 
// 				return false;
// 			}
// 		}
// 		u.Request(e.search, e.search.url);


		// CLEAN-UP DOM
		// remove .servicenavigation when all relevant nodes have been moved
		e.hN.removeChild(u.qs(".servicenavigation", e.hN));
		e.fN.removeChild(u.qs(".servicenavigation", e.fN));


		// NAVIGATION
		// set navigation links
		// var navNodes = u.qsa("li", e.nN);
		// for(i = 0; navNode = navNodes[i]; i++) {
		// 	u.link(navNode);
		// 	navNode.clicked = function(event) {
		// 		location.hash = u.h.cleanHash(this.url);
		// 	}
		// }


		// page is ready, fade in
		e.ready = function() {
//			u.bug("page ready")

			// loading progresses as planned - cancel error switch
			u.t.resetTimer(document.t_error);

			// enable hash change navigation detection
			u.h.catchEvent(this.cN.navigate, this.cN);

			this.transitioned = function() {
				this.transitioned = null;
				// page is ready
				u.addClass(this, "ready");

				// in case content loads faster than page, call content ready controller
				this.cN.ready();
			}
			// fade page up
			u.a.transition(this, "all 1.5s ease-in");
			u.a.setOpacity(this, 1);
		}



		// content state controller
		e.cN.ready = function() {
//			u.bug("content ready");
			// if all is good and ready to go
			if(this.page.className.match(/ready/) && this.className.match(/ready/)) {
//				u.bug("fade content up");


				u.rc(document.body, "loading");
				u.t.resetTimer(document.t_safety);

				u.a.transition(this, "opacity 0.5s ease-in");
				u.a.setOpacity(this, 1);
			}
		}


		// navigation - uses HASH to identify selected node
		e.cN.navigate = function() {
//			u.bug("navigate")


			// cancel scroll handler
			window.onscroll = null;

			if(this.current_base_url != u.h.getCleanHash(location.hash, 1) || u.h.getCleanHash(location.hash, 1) == u.h.getCleanHash(location.hash)) {

//				u.bug("base url:" + u.h.getCleanHash(location.hash, 2))

				// handle oad-response when returned after load and fade back in
				this.Response = function(response) {
	//				u.bug("navigate response:" + this.url)

					// stats
					u.stats.pageView(this.url);

					// set body class
					u.setClass(document.body, response.body_class);

					// replace content
					this.innerHTML = u.qs("#content", response).innerHTML;

					// set title
					document.title = response.head_title;

					// init content - will callback to ready, when done
					u.init(this);
				}

				// capture transition event and load new content, when fadeout is done
				this.transitioned = function(event) {
	//				u.bug("navigate request")
					this.transitioned = null;

					// Firefox prefers if I reset transition - otherwise fadeup flickers
					u.a.transition(this, "none");

					this.current_base_url = u.h.getCleanHash(location.hash, 1);
					// request new content
					u.Request(this, u.h.getCleanHash(location.hash, 1));
				}

				// content is no longer ready
				u.rc(this, "ready");

				// if element is already faded out
				if(u.gcs(this, "opacity") == 0) {
	//			if(this._opacity == 0) {
	//				u.bug("quick transition");
					this.transitioned();
				}
				// start fade out transition
				else {
	//				u.bug("fade out")
					u.a.setOpacity(this, 0);
				}

			}
			else {
//				u.bug("2. level url:" + u.h.getCleanHash(location.hash));
				
				// forward navigation event to scene
				if(this.scene && this.scene.parentNode && typeof(this.scene.navigate) == "function") {
					this.scene.navigate();
				}
				
			}

		}


		// set default hash if no hash value is present
		// no furter navigation - initialize content
		if(location.hash.length < 2) {
			location.hash = u.h.getCleanUrl(location.href);
			u.init(e.cN);
		}
		// if different hash and url, load content based on hash
		else if(u.h.getCleanHash(location.hash) != u.h.getCleanUrl(location.href)) {
			e.cN.navigate();
		}
		// hash and url is aligned - init existing content
		else {
			u.init(e.cN);
		}



// 		// start initialization process - all required setup must be complete before this step
// 		// set default hash
// 		if(location.hash.length < 2) {
// //			u.bug("no hash")
// 			location.hash = u.h.cleanHash(location.href);
// 			u.init(e.cN);
// 		}
// 		// if different hash and url, load content
// 		else if(location.hash != "#"+u.h.cleanHash(location.href.split("#")[0])) {
// //			u.bug("update hash")
// 			e.cN.navigate();
// 		}
// 		// init existing content
// 		else {
// //			u.bug("correct hash")
// 			u.init(e.cN);
// 		}

		u.t.setTimer(e, e.ready, 50);

		// call page ready
		//e.ready();

	}
}

window.onload = function() {u.o.page.init(u.qs("#page"));}

