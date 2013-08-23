Util.Objects["imagelist"] = new function() {
	this.init = function(list) {

//		u.bug("init imagelist")

		var i, node;

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


		list.carousel.picked = function(event) {
//			u.bug("fisk")

//			u.e.kill(event);
		}

		// respond to swipe left
		list.carousel.swipedLeft = function(event) {
			this.list.selectImage(this.list.current_image+1);
		}
		// respond to swipe right
		list.carousel.swipedRight = function(event) {
			this.list.selectImage(this.list.current_image-1);
		}

		/*
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
			u.bug("show")
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
		*/

		// image preloader
		list.loadImage = function(image_index) {

//			u.bug("loadImage")

			// valid index?
			if(image_index >= 0 && image_index < this.carousel.nodes.length) {
				var node = this.carousel.nodes[image_index];

				// anything to work on?
				if(node && !node.initialized) {

					node.initialized = true;

					// load image
					// TODO: Martin, '.jpg' at the end should be read from the 'format' css-class-attribute: format:png
					u.i.load(node, Peoplegroup.assets_image_path() + "/" + node.item_id + "/" + node.list.carousel.node_width + "_width.jpg");
					node.loaded = function(event) {
						// set image
						u.as(this, "backgroundImage", "url("+event.target.src+")");

						// call back to preload controller
						this.list.imageLoaded(this);
					}
				}
				// call back to preload controller
				else {
					this.imageLoaded(node);
				}
			}
		}

		// image is loaded
		list.imageLoaded = function(node) {

//			u.bug("imageLoaded")

			// if node is currently selected
			if(node.i == this.current_image) {

//				u.bug("Go spiffy1" + typeof(this.ready) + ":" + this.nodeName)

				// if first load
				if(typeof(this.ready) == "function" && !this.className.match("ready")) {

//					u.bug("Go spiffy")

					// if more than one image
					if(this.nodes.length > 1) {
						// enable swipe on carousel
//						u.bug("swipe")
						u.e.swipe(this.carousel, new Array(this.carousel.node_width-this.carousel.offsetWidth, 0, this.carousel.offsetWidth, this.carousel.offsetHeight));
					}

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

				/*
				// update carousel controls
				this.carousel.controls.prev.style.display = "block";
				this.carousel.controls.next.style.display = "block";
				if(index == 0) {
					this.carousel.controls.prev.style.display = "none";
				}
				else if(index ==this.carousel.nodes.length-1) {
					this.carousel.controls.next.style.display = "none";
				}
				*/

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
		// TODO - optional - don't slide in selected fullscreen image - skip transition


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
					// put player into place
					this.page.player.eject();
					this.page.player = this.node.appendChild(this.page.player);
					// load and play
//					this.page.player.loadAndPlay("/movies/" + this.node.item_id + "/678x.mov");
					this.page.player.loadAndPlay(Peoplegroup.assets_image_path() + "/" + this.node.video_id + "/" + "video_678x381.mov");
				}
			}

		}


		// inject controls container (zoom and prev/next if more than one node)
//		list.carousel.controls = u.ae(list.carousel.parentNode, "div", "controls");

		// enable controls on mousemove
//		u.e.addEvent(list.carousel, "touchstart", list.carousel.showControls);



		// setup imagelist navigation if more than one item in list
		if(list.nodes.length > 1) {

			// enable bullet selector
			for(i = 0; node = list.nodes[i]; i++) {
				node.list = list;
				node.i = i;
				u.link(node);
				node.clicked = function(event) {
					// avoid accidental zoom
					u.e.kill(event);
					this.list.selectImage(this.i);
				}
			}

			/*
			// add prev and next buttons
			var prev = u.ie(list.carousel.controls, "a", ({"class":"prev"}));
			var next = u.ae(list.carousel.controls, "a", ({"class":"next"}));

			list.carousel.controls.prev = prev;
			list.carousel.controls.next = next;

			prev.list = list;
			next.list = list;

			u.e.click(prev);
			prev.clicked = function(event) {
				this.list.selectImage(this.list.current_image-1)
			}
			u.e.click(next);
			next.clicked = function(event) {
				this.list.selectImage(this.list.current_image+1)
			}

			// focus controls on mouseover on control-buttons
			u.e.addEvent(prev, "mouseover", list.carousel._focusControls);
			u.e.addEvent(next, "mouseover", list.carousel._focusControls);
			*/

		}
		// hide list, if only one image
		else {

			// set additional info for one node
			if(list.nodes.length == 1) {
				list.nodes[0].i = 0;
				list.nodes[0].list = list;
			}

			u.as(list, "display", "none");
		}



		// start loading sequence
		list.current_image = 0;
		// set start image and start preload sequence
		list.selectImage(list.current_image);

	}
}