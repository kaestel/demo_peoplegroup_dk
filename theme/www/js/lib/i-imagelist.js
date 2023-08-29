Util.Objects["imagelist"] = new function() {
	this.init = function(list) {
		var i, node;

//		u.bug("init imagelist")

		// page reference
		var page = u.qs("#page");



		// EXPLANATION
		// list = initial list with thumbs (the bullet-selector)
		// list.carousel = base image carousel
		// list.carousel.controls = next, prev and zoom wrapper element



		// create carousel node
		list.carousel = list.cloneNode(true);
		u.sc(list.carousel, "imagecarousel");

		// create caruosel container
		var carousel = u.ie(list.parentNode, "div", "carousel");

		// inject carousel
		list.carousel = carousel.appendChild(list.carousel);
		list.carousel.list = list;

		// get node width before setting new full width
		list.carousel.node_width = list.carousel.offsetWidth;


		/*
		// respond to swipe left
		list.carousel.swipedLeft = function(event) {
			this.list.selectImage(this.list.current_image+1);
		}
		// respond to swipe right
		list.carousel.swipedRight = function(event) {
			this.list.selectImage(this.list.current_image-1);
		}
		*/

		// controls visiblity helpers
		// hide controls
		list.carousel.hideControls = function() {
			// reset timer to avoid double actions
			this.t_hint = u.t.resetTimer(this.t_hint);

			u.a.transition(this.controls, "all 0.3s ease-out");
			u.a.setOpacity(this.controls, 0);
		}
		// show controls (auto hide)
		list.carousel.showControls = function() {
			// reset timer to keep visible
			if(this.t_hint) {
				this.t_hint = u.t.resetTimer(this.t_hint);
			}
			// fade up
			else {
				u.a.transition(this.controls, "all 0.5s ease-out");
				u.a.setOpacity(this.controls, 0.5);
			}

			// auto hide after 1 sec of inactivity
			this.t_hint = u.t.setTimer(this, this.hideControls, 1500);
		}
		// focus controls (fully shown, no auto hide)
		list.carousel._focusControls = function() {
			// reset timer to keep visible
			this.list.carousel.t_hint = u.t.resetTimer(this.list.carousel.t_hint);

			// fade all up
			u.a.transition(this.list.carousel.controls, "all 0.1s ease-out");
			u.a.setOpacity(this.list.carousel.controls, 1);
		}


		// image preloader
		list.loadImage = function(image_index) {

//			u.bug("loadImage:" + image_index);

			// valid index?
			if(image_index >= 0 && image_index < this.carousel.nodes.length) {
				var node = this.carousel.nodes[image_index];

				// anything to work on?
				if(node && !node.initialized) {

					node.initialized = true;

					// load image
					node.loaded = function(event) {
						// set image
						u.as(this, "backgroundImage", "url("+event.target.src+")");

						// call back to preload controller
						this.list.imageLoaded(this);
					}

					u.i.load(node, Peoplegroup.assets_image_path() + "/" + node.item_id + "/" + node.list.carousel.node_width + "_width." + u.getIJ(node, "format"));
				}
				// call back to preload controller
				else {
					this.imageLoaded(node);
				}
			}
		}

		// image is loaded
		list.imageLoaded = function(node) {

//			u.bug("imageLoaded:" + node.className);

			// if node is currently selected
			if(node.i == this.current_image) {

				// if first load
				if(typeof(this.ready) == "function" && !this.className.match("ready")) {

					// if more than one image
//					if(this.nodes.length > 1) {
						// enable swipe on carousel
//						u.e.swipe(this.carousel, new Array(this.carousel.node_width-this.carousel.offsetWidth, 0, this.carousel.offsetWidth, this.carousel.offsetHeight));
//					}

					u.ac(this, "ready");
					this.ready();
				}

				// preload next and prev
				this.loadImage(this.current_image+1);
				this.loadImage(this.current_image-1);
			}
			
		}

		// set selected image
		// optional param hidden can be set to avoid transition when updating list from fullscreen interaction
		list.selectImage = function(index, hidden) {

//			u.bug("select image:" + index)

			// is index valid
			if(index >= 0 && index < this.carousel.nodes.length) {

				// get page ref
				var page = u.qs("#page");

				// remove video player to avoid playback from "invisible" player
				if(page.player) {
					page.player.eject();
				}


				// remove selected class
				for(i = 0; node = this.nodes[i]; i++) {
					u.rc(node, "selected");
				}
				// set new current image
				var current_node = this.nodes[index];
				u.ac(current_node, "selected");
//				u.bug("current_node" + current_node);


				if(this.carousel.controls.prev && this.carousel.controls.prev.parentNode) {
					// update carousel controls
					this.carousel.controls.prev.style.display = "block";
					this.carousel.controls.next.style.display = "block";
					if(index == 0) {
						this.carousel.controls.prev.style.display = "none";
					}
					else if(index ==this.carousel.nodes.length-1) {
						this.carousel.controls.next.style.display = "none";
					}
				}

				this.current_image = current_node.i;
				// preload image
				this.loadImage(this.current_image);

				// set carousel transition
				// hidden - no transition, just a matter of updating position
				if(hidden) {
					u.a.transition(this.carousel, "none");
				}
				// if selection is based on drag, it can have speed - if so, adjust transition
				else if(this.carousel.current_xps) {
					var duration = this.carousel.current_xps ? ((960 / Math.abs(this.carousel.current_xps)) * 0.7) : 0.7;
					// adjust duration to avoid too slow transition
					duration = duration > 0.7 ? 0.7 : duration;
					u.a.transition(this.carousel, "all "+duration+"s ease-out");
				}
				// regular transition
				else {
					u.a.transition(this.carousel, "all 0.7s ease-in-out");
				}

				// move carousel
				u.a.translate(this.carousel, -(index*this.carousel.node_width), 0);
			}
		}


		// TODO - optional - wait fullscreen fadeup until image is loaded


		// fullscreen mode- extensive and fully selfcontained
		list.carousel.fullScreen = function(index) {

			// get page ref
			var page = u.qs("#page");

			// remove video player to avoid playback from invisible player
			if(page.player) {
				page.player.eject();
			}

			// remember scroll position
			page.scrolled_to = u.scrollY();

			// prepare for fullscreen
			u.ac(document.body, "fullscreen");

			// create fullscreen window
			page.fullscreen = u.ae(document.body, "div", ({"id":"fullscreen"}));
			page.fullscreen.page = page;
			page.fullscreen.list = this.list;

			// add carousel to fullscreen view
			page.fullscreen.carousel = page.fullscreen.appendChild(this.cloneNode(true));
			u.sc(page.fullscreen.carousel, "imagefullscreen");
			page.fullscreen.carousel.fullscreen = page.fullscreen;

 
			// recalculate fullscreen carousel on window resize
			page.fullscreen.resized = function() {

				var fullscreen = u.qs("#fullscreen");

				// no transitions while resetting
				u.a.transition(fullscreen.carousel, "none");
				// set new carousel width
				u.as(fullscreen.carousel, "width", fullscreen.carousel.nodes.length * fullscreen.offsetWidth+"px");
				// decide fullscreen image size (960/640/320)
				fullscreen.image_width = fullscreen.offsetWidth > 960 ? 960 : (fullscreen.offsetWidth > 640 ? 640 : 320);

//				u.bug("fullscreen" + fullscreen.image_width);

				// set new sizes for nodes
				for(i = 0; node = fullscreen.carousel.nodes[i]; i++) {

					// reset individual sizes - inherited from base
//					u.as(node, "width", fullscreen.offsetWidth+"px");
//					u.as(node, "height", fullscreen.offsetHeight+"px");
					u.a.setWidth(node, fullscreen.offsetWidth);
					u.a.setHeight(node, fullscreen.offsetHeight);
				}

				// set carousel position to match the new node width
				u.a.translate(fullscreen.carousel, -(fullscreen.list.current_image*fullscreen.offsetWidth), 0);

			}

			// fullscreen setup
			page.fullscreen.setup = function() {
				var i, node;

				// remove transition inherited from cloned node
				u.a.transition(this.carousel, "none");

				// set opacity 0 and display fullscreen (to be able to get width and height proporties)
//				u.as(this, "opacity", 0);
				u.a.setOpacity(this, 0);

				// cloned fullscreen has absolute left position in desktop light mode (inherited from base)
				// if not resat before first transition, it will fuck up carousel position
				// cannot be resat via translate and should not even be here - but I don't know how else to fix it now
				u.as(this.carousel, "left", "auto");


				u.as(this, "display", "block");

				// get fullscreen carousel nodes
				this.carousel.nodes = u.qsa("li", this.carousel);

				// set fullscreen list width
//				u.as(this.carousel, "width", this.carousel.nodes.length * this.offsetWidth+"px");
				u.a.setWidth(this.carousel, this.carousel.nodes.length * this.offsetWidth);

				// decide fullscreen image size (960/640/320)
				this.image_width = this.offsetWidth > 960 ? 960 : (this.offsetWidth > 640 ? 640 : 320);

				// update sizes on window resize
				u.e.addEvent(window, "resize", this.resized);


				// setup fullscreen carousel nodes
				for(i = 0; node = this.carousel.nodes[i]; i++) {

					// reset individual sizes - inherited from base
					u.a.setWidth(node, this.offsetWidth);
					u.a.setHeight(node, this.offsetHeight);

					// IE 8 sets all variables as attributes, so initialized needs to be resat
					node.initialized = false;

					node.fullscreen = this;
					node.i = i;

					node.item_id = u.getIJ(node, "id");


					// is node a movie node?
					if(node.className.match("movie")) {

						node.video_id = u.getIJ(node, "videoid");

						// only work with one player (iPad only allows for one player instance)
						if(!page.player) {
							page.player = u.videoPlayer();
						}

//						var play = u.ae(node, "a", "play");
						var play = u.qs(".play", node);
						play.page = page;
						play.node = node;
						u.e.click(play);
//						play.inputStarted = function(event) {
//							u.e.kill(event);
//						}
						play.clicked = function(event) {
							this.page.player.eject();
							// put player into place
							this.page.player = this.node.appendChild(this.page.player);
							// load and play
//							this.page.player.loadAndPlay("/movies/" + this.node.item_id + "/"+this.node.fullscreen.image_width+"x.mov");
							this.page.player.loadAndPlay(Peoplegroup.assets_image_path() + "/" + this.node.video_id + "/" + "video_960x540.mov");
						}
					}

				}


				// inject controls container
				this.carousel.controls = u.ae(this, "div", "controls");

				// inject zoom
				var zoom = u.ae(this.carousel.controls, "a", ({"class":"zoom"}));
				zoom.fullscreen = this;
				this.carousel.controls.zoom = zoom;
				u.e.click(zoom);
				zoom.clicked = function(event) {

					// finish fullscreen exit
					this.fullscreen.transitioned = function(event) {
						this.transitioned = null;
						u.a.transition(this, "none");

						this.parentNode.removeChild(this);

						// display page to enable scrolling before fade up
						u.as(this.page, "display", "block");
						// scroll to last position
						window.scrollTo(0, this.page.scrolled_to);

						// fade page up again
						u.a.transition(this.page, "all 0.3s ease-in");
						u.a.setOpacity(this.page, 1);
						u.rc(document.body, "fullscreen");
					}

					// remove shortcut handler
//					u.e.removeEvent(window, "keyup", this.fullscreen.keycuts);
					u.e.removeEvent(document.body, "keyup", this.fullscreen.keycuts);

					// remove resize updater
					u.e.removeEvent(window, "resize", this.fullscreen.resized);

					// fade out fullscreen
					u.a.transition(this.fullscreen, "all 0.3s ease-in");
					u.a.setOpacity(this.fullscreen, 0);

				}

				u.e.addEvent(zoom, "mouseover", this.carousel._focusControls);

				// clone bullet-index
				this.imagelist = this.appendChild(this.list.cloneNode(true));
				this.imagelist.nodes = u.qsa("li", this.imagelist);

				// more than one node?
				if(this.imagelist.nodes.length > 1) {

					// enable bullet selector
					for(i = 0; node = this.imagelist.nodes[i]; i++) {
						node.fullscreen = this;
						node.i = i;

						u.link(node);
						node.clicked = function(event) {
							u.e.kill(event);
							this.fullscreen.selectImage(this.i);
						}
					}



					// add prev, next and zoom buttons
					var prev = u.ie(this.carousel.controls, "a", ({"class":"prev"}));
					var next = u.ae(this.carousel.controls, "a", ({"class":"next"}));

					this.carousel.controls.prev = prev;
					this.carousel.controls.next = next;

					prev.fullscreen = this;
					next.fullscreen = this;

					u.e.click(prev);
					prev.clicked = function(event) {
						u.e.kill(event);
						this.fullscreen.selectImage(this.fullscreen.list.current_image-1)
					}
					u.e.click(next);
					next.clicked = function(event) {
						u.e.kill(event);
						this.fullscreen.selectImage(this.fullscreen.list.current_image+1)
					}



					// enable controls on mousemove
					u.e.addEvent(this.carousel, "mousemove", this.carousel.showControls);

					// focus controls on mouseover on control-buttons
					u.e.addEvent(prev, "mouseover", this.carousel._focusControls);
					u.e.addEvent(next, "mouseover", this.carousel._focusControls);


					// set keyboard shortcuts
					this.keycuts = function(event) {
//						u.bug("event.keyCode:" + event.keyCode);

						// ESC
						if(event.keyCode == 27) {
							u.e.kill(event);
							u.qs("#fullscreen .zoom").clicked(event);
						}
						// prev
						if(event.keyCode == 37) {
							u.e.kill(event);
							u.qs("#fullscreen .prev").clicked(event);
						}
						// next
						if(event.keyCode == 39) {
							u.e.kill(event);
							u.qs("#fullscreen .next").clicked(event);
						}
					}
					// window.onkeyup fails in IE
//					u.e.addEvent(window, "keyup", this.keycuts);
					u.e.addEvent(document.body, "keyup", this.keycuts);

				}
				// only one node
				else {
					if(this.imagelist.nodes.length == 1) {
						this.imagelist.nodes[0].i = 0;
						this.imagelist.nodes[0].list = list;

					}
					this.keycuts = function(event) {
//						u.bug("event.keyCode:" + event.keyCode);

						// ESC
						if(event.keyCode == 27) {
							u.e.kill(event);
							u.qs("#fullscreen .zoom").clicked(event);
						}
					}
					// window.onkeyup fails in IE
//					u.e.addEvent(window, "keyup", this.keycuts);
					u.e.addEvent(document.body, "keyup", this.keycuts);

					// hide list
					u.a.setOpacity(this.imagelist, 0);
				}



				// set selected image
				this.selectImage(this.list.current_image, true);

				// fade up
				u.a.transition(this, "all 0.3s ease-in");
				u.a.setOpacity(this, 1);
			}

			/*
			// respond to swipe left
			page.fullscreen.carousel.swipedLeft = function(event) {
				this.fullscreen.selectImage(this.fullscreen.list.current_image+1);
			}
			// respond to swipe right
			page.fullscreen.carousel.swipedRight = function(event) {
				this.fullscreen.selectImage(this.fullscreen.list.current_image-1);
			}
			*/

			// hide controls
			page.fullscreen.carousel.hideControls = function() {
				// reset timer to avoid double actions
				this.t_hint = u.t.resetTimer(this.t_hint);

				u.a.transition(this.controls, "all 0.3s ease-out");
				u.a.setOpacity(this.controls, 0);
			}
			// show controls
			page.fullscreen.carousel.showControls = function() {

				// reset timer to keep visible
				if(this.t_hint) {
					this.t_hint = u.t.resetTimer(this.t_hint);
				}
				// fade up
				else {
					u.a.transition(this.controls, "all 0.5s ease-out");
					u.a.setOpacity(this.controls, 0.5);
				}

				// auto hide after 1 sec of inactivity
				this.t_hint = u.t.setTimer(this, this.hideControls, 1500);
			}
			// focus controls (fully shown no auto hide)
			page.fullscreen.carousel._focusControls = function() {
				// reset timer to keep visible
				this.fullscreen.carousel.t_hint = u.t.resetTimer(this.fullscreen.carousel.t_hint);

				// fade all up
				u.a.transition(this.fullscreen.carousel.controls, "all 0.1s ease-out");
				u.a.setOpacity(this.fullscreen.carousel.controls, 1);
			}

			// image preloader
			page.fullscreen.loadImage = function(image_index) {

				if(image_index >= 0 && image_index < this.carousel.nodes.length) {
					var node = this.carousel.nodes[image_index];

					if(node && !node.initialized) {

						node.initialized = true;

						// load image
						node.loaded = function(event) {
							// set image
							u.as(this, "backgroundImage", "url("+event.target.src+")");

							// call back to preload controller
							this.fullscreen.imageLoaded(this);
						}

						u.i.load(node, Peoplegroup.assets_image_path() + "/" + node.item_id + "/" + this.image_width + "_width." + u.getIJ(node, "format"));
					}
					else {
						this.imageLoaded(node);
					}
				}

			}

			// image is loaded
			page.fullscreen.imageLoaded = function(node) {

				// if node is currently selected
				if(node.i == this.list.current_image) {


//					if(typeof(this.ready) == "function" && !this.className.match("ready")) {
					if(!this.className.match("ready")) {

						// if more than one image
//						if(this.carousel.nodes.length > 1) {
							// enable swipe on carousel
//							u.e.swipe(this.carousel, new Array(this.offsetWidth-this.carousel.offsetWidth, 0, this.carousel.offsetWidth, this.carousel.offsetHeight));
//						}

						u.ac(this, "ready");
//						this.ready();
					}

					// preload next and prev
					this.loadImage(this.list.current_image+1);
					this.loadImage(this.list.current_image-1);
				}

			}

			// set selected image
			page.fullscreen.selectImage = function(index, hidden) {
				// get page ref
				var page = u.qs("#page");

				// remove video player to avoid playback from invisible player
				if(page.player) {
					page.player.eject();
				}

				// is index valid
				if(index >= 0 && index < this.carousel.nodes.length) {

					// remove selected class
					for(i = 0; node = this.imagelist.nodes[i]; i++) {
						u.rc(node, "selected");
					}
					// set new current image
//					var current_node = this.imagelist.nodes[index];
					u.ac(this.imagelist.nodes[index], "selected");


					if(this.carousel.controls.prev && this.carousel.controls.prev.parentNode) {
						// update carousel controls
						this.carousel.controls.prev.style.display = "block";
						this.carousel.controls.next.style.display = "block";
						if(index == 0) {
							this.carousel.controls.prev.style.display = "none";
						}
						else if(index ==this.carousel.nodes.length-1) {
							this.carousel.controls.next.style.display = "none";
						}
					}


					// callback to base and update image without transition
					this.list.selectImage(index, true);


					// preload fullscreen list
					this.loadImage(this.list.current_image);

					// move fullscreen carousel
					// set carousel transition
					// hidden - no transition, just a matter of updating position
					if(hidden) {
						u.a.transition(this.carousel, "none");
					}
					// if selection is based on drag, it can have speed - if so, adjust transition
					else if(this.carousel.current_xps) {
						var duration = this.carousel.current_xps ? ((960 / Math.abs(this.carousel.current_xps)) * 0.7) : 0.7;
						// adjust duration to avoid too slow transition
						duration = duration > 0.7 ? 0.7 : duration;
						u.a.transition(this.carousel, "all "+duration+"s ease-out");
					}
					// regular transition
					else {
						u.a.transition(this.carousel, "all 0.7s ease-in-out");
					}

					u.a.translate(this.carousel, -(index*this.offsetWidth), 0);
				}
			}



			// page faded, continue with setup
			page.transitioned = function(event) {
				this.transitioned = null;
				// remove transition before manipulation
				u.a.transition(this, "none");

				// hide page to remove scrollbars
				u.as(this, "display", "none");

				// setup fullscreen
				this.fullscreen.setup();
			}

			// fade page out to start process
			u.a.transition(page, "all 0.3s ease-in");
			u.a.setOpacity(page, 0);
		}


		// setup basic content
		// get nodes
		list.nodes = u.qsa("li", list);
		list.carousel.nodes = u.qsa("li", list.carousel);

		// set carousel full width
		u.as(list.carousel, "width", (list.carousel.nodes.length*list.carousel.node_width) + "px");


		// set up carousel nodes
		for(i = 0; node = list.carousel.nodes[i]; i++) {

			// cross-reference list and carousel
			node.list = list;
			node.i = i;

			// get image id
			node.item_id = u.getIJ(node, "id");

			// empty node (can contain "noise" HTML)
			node.innerHTML = "";

			// set node width
//			u.as(node, "width", list.carousel.node_width+"px");
			u.a.setWidth(node, list.carousel.node_width);
			// set a small height to avoid list collapse
//			u.as(node, "height", list.carousel.offsetHeight+"px");
			u.a.setHeight(node, list.carousel.offsetHeight);


			// is node a movie node?
			if(node.className.match("movie")) {

				node.video_id = u.getIJ(node, "videoid");

				// only work with one player (iPad only allows for one player instance)
				if(!page.player) {
					page.player = u.videoPlayer();
				}

				// create play button
				var play = u.ae(node, "a", "play");
				play.page = page;
				play.node = node;
				u.e.click(play);

				play.clicked = function(event) {
					this.page.player.eject();
					// put player into place
					this.page.player = this.node.appendChild(this.page.player);
					// load and play
					this.page.player.loadAndPlay(Peoplegroup.assets_image_path() + "/" + this.node.video_id + "/" + "video_678x381.mov");
				}
			}

		}


		// inject controls container (zoom and prev/next if more than one node)
		list.carousel.controls = u.ae(list.carousel.parentNode, "div", "controls");

		// enable controls on mousemove
		u.e.addEvent(list.carousel, "mousemove", list.carousel.showControls);


		// add zoom button to controls
		var zoom = u.ae(list.carousel.controls, "a", ({"class":"zoom"}));
		list.carousel.controls.zoom = zoom;
		zoom.list = list;
		u.e.click(zoom);
		zoom.clicked = function(event) {
			this.list.carousel.fullScreen(this.list.current_image);
		}
		u.e.addEvent(zoom, "mouseover", list.carousel._focusControls);


		// setup imagelist navigation if more than one item in list
		if(list.nodes.length > 1) {

			// enable bullet selector
			for(i = 0; node = list.nodes[i]; i++) {
				node.list = list;
				node.i = i;
				u.link(node);
				node.clicked = function(event) {
					u.e.kill(event);
					this.list.selectImage(this.i);
				}
			}


			// add prev and next buttons
			var prev = u.ie(list.carousel.controls, "a", ({"class":"prev"}));
			var next = u.ae(list.carousel.controls, "a", ({"class":"next"}));

			list.carousel.controls.prev = prev;
			list.carousel.controls.next = next;

			prev.list = list;
			next.list = list;

			u.e.click(prev);
			prev.clicked = function(event) {
				u.e.kill(event);
				this.list.selectImage(this.list.current_image-1)
			}
			u.e.click(next);
			next.clicked = function(event) {
				u.e.kill(event);
				this.list.selectImage(this.list.current_image+1)
			}

			// focus controls on mouseover on control-buttons
			u.e.addEvent(prev, "mouseover", list.carousel._focusControls);
			u.e.addEvent(next, "mouseover", list.carousel._focusControls);

		}
		// if only one image
		else {
			// set additional info for one node
			if(list.nodes.length == 1) {
				list.nodes[0].i = 0;
				list.nodes[0].list = list;
			}

			// hide list
			u.a.setOpacity(list, 0);
		}

//		u.bug("init imagelist")


		// start loading sequence
		list.current_image = 0;
		// set start image and start preload sequence
		list.selectImage(list.current_image);

	}
}