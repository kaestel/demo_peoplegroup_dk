Util.videoPlayer = function() {

	var player = document.createElement("div");
	u.ac(player, "player");

	// test for HTML5 video
	player.video = u.ae(player, "video");
	player.video.player = player;




	// HTML5 support
	if(typeof(player.video.play) == "function") {

		// load src into player
		player.load = function(src) {

			this.setup();

//			u.e.removeEvent(this.video, "canplaythrough", this._canplaythrough);
			// if player is playing - stop it before loading new src
			if(this.className.match("/playing/")) {
//			if(this.playing) {
				this.stop();
			}

			if(src) {
//				u.bug(this.correctSource(src));
				this.video.src = this.correctSource(src);
				this.video.load();
				this.video.controls = "hide";

				this.video.autoplay = true;

//				this.video.controls = false;
			}
		}
		// play loaded src
		player.play = function(position) {
//			u.bug("video player:" + this.className + "::" + this.video.src + "::" + typeof(this.audio));

//			u.ac(this, "playing");
//			this.playing = true;

			position = position == undefined ? false : position;
//			u.bug(this.video.currentTime + "::" + typeof(this.video.currentTime))

			if(this.video.currentTime && position !== false) {
				this.video.currentTime = position;
			}

//			u.e.addEvent(this.video, "canplaythrough", this._canplaythrough);

			// only play if src is set
			if(this.video.src) {
				this.video.play();
			}
		}
		player.loadAndPlay = function(src, position) {
//			u.bug("loadandplay:" + src);
			// TODO: put position into a global var?
			this.load(src);
			// firefox does not throw canplaythrough event unless I call play when loading
			this.play(position);
		}
		
		player.pause = function() {
//			this.playing = false;
			this.video.pause();
		}
		player.stop = function() {
			this.video.pause();
			if(this.video.currentTime) {
				this.video.currentTime = 0;
			}
		}

		// toggle between play and pause
		player.togglePlay = function() {
			if(this.className.match(/playing/g)) {
				this.pause();
			}
			else {
				this.play();
			}
		}


		player.setup = function() {

			// reset video safety net (or old video may show before new one loads)
			if(u.qs("video", this)) {
				this.removeChild(this.video);
			}
			// add video player again
			this.video = u.ie(this, "video");
			this.video.player = this;


			// set all playback events
			// loading begins
			this._loadstart = function(event) {
	//			u.bug("load");

				u.ac(this.player, "loading");
			}
			u.e.addEvent(this.video, "loadstart", this._loadstart);

			// enough is loaded to play entire movie
			this._canplaythrough = function(event) {
	//			u.bug("ready");

				u.rc(this.player, "loading");
			}
			u.e.addEvent(this.video, "canplaythrough", this._canplaythrough);

			// movie is playing
			this._playing = function(event) {
//				u.bug("playing" + this.player);

				u.rc(this.player, "loading");
				u.ac(this.player, "playing");
			}
			u.e.addEvent(this.video, "playing", this._playing);

			// movie is paused
			this._paused = function(event) {
	//			u.bug("paused");

				u.rc(this.player, "playing");
			}
			u.e.addEvent(this.video, "pause", this._paused);

			// movie is stalled
			this._stalled = function(event) {
	//			u.bug("stalled");

				u.rc(this.player, "playing");
				u.ac(this.player, "loading");
			}
			u.e.addEvent(this.video, "stalled", this._paused);

			// movie has play til its end
			this._ended = function(event) {
	//			u.bug("ended");

				u.rc(this.player, "playing");
			}
			u.e.addEvent(this.video, "ended", this._ended);

		}

		player.eject = function() {
//			u.bug("eject")
//			this.video.removeAttribute("src");
//			this.video.src = "#";
			if(this.parentNode) {
				if(u.qs("video", this)) {
					this.removeChild(this.video);
				}
				this.parentNode.removeChild(this);
			}
		}

/*
		// set all playback events
		// loading begins
		player._loadstart = function(event) {
//			u.bug("load");

			u.ac(this.player, "loading");
		}
		u.e.addEvent(player.video, "loadstart", player._loadstart);


		// enough is loaded to play entire movie
		player._canplaythrough = function(event) {
//			u.bug("ready");

			u.rc(this.player, "loading");
		}
		u.e.addEvent(player.video, "canplaythrough", player._canplaythrough);


		// movie is playing
		player._playing = function(event) {
//			u.bug("playing");

			u.rc(this.player, "loading");
			u.ac(this.player, "playing");
		}
		u.e.addEvent(player.video, "playing", player._playing);


		// movie is paused
		player._paused = function(event) {
//			u.bug("paused");

			u.rc(this.player, "playing")
		}
		u.e.addEvent(player.video, "pause", player._paused);


		// movie is stalled
		player._stalled = function(event) {
//			u.bug("stalled");

			u.rc(this.player, "playing")
			u.ac(this.player, "loading")
		}
		u.e.addEvent(player.video, "stalled", player._paused);


		// movie has play til its end
		player._ended = function(event) {
//			u.bug("ended");

			u.rc(this.player, "playing")
		}
		u.e.addEvent(player.video, "ended", player._ended);



		// debugging events
		player._event = function(event) {
			 u.bug("3", "event:" + event.type);
		}
		*/
		/*
		player.video.addEventListener('progress', player._event, false);
		player.video.addEventListener('canplay', player._event, false);
		player.video.addEventListener('canplaythrough', player._event, false);
		player.video.addEventListener('suspend', player._event, false);
		player.video.addEventListener('abort', player._event, false);
		player.video.addEventListener('error', player._event, false);
		player.video.addEventListener('emptied', player._event, false);
		player.video.addEventListener('stalled', player._event, false);
		player.video.addEventListener('loadstart', player._event, false);
		player.video.addEventListener('loadeddata', player._event, false);
		player.video.addEventListener('loadedmetadata', player._event, false);
		player.video.addEventListener('waiting', player._event, false);
		player.video.addEventListener('play', player._event, false);
		player.video.addEventListener('playing', player._event, false);
		player.video.addEventListener('seeking', player._event, false);
		player.video.addEventListener('seeked', player._event, false);
		player.video.addEventListener('ended', player._event, false);
		player.video.addEventListener('durationchange', player._event, false);
		player.video.addEventListener('timeupdate', player._event, false);
		player.video.addEventListener('ratechange', player._event, false);
		player.video.addEventListener('volumechange', player._event, false);
		*/

/*

		player._loadedmetadata = function(event) {
			u.bug("1", "loadedmetadata:duration:" + this.duration);
			u.bug("1", "loadedmetadata:currentTime:" + this.currentTime);
		}
		//player.video.addEventListener('loadedmetadata', player._loadedmetadata, false);

		player._canplay = function(event) {
			u.bug("1", "canplay:" + this.buffered.end(0));
		}
		//player.video.addEventListener('canplay', player._canplay, false);

		player._timeupdate = function(event) {
			u.bug("2", this.currentTime);
		}
		//player.video.addEventListener('timeupdate', player._timeupdate, false);

		//vid.webkitEnterFullscreen();
		*/
	}


	// find the correct source for the browser
	player.correctSource = function(src) {
		src = src.replace(/\.m4v|\.mp4|\.webm|\.ogv|\.3gp|\.mov/, "");

		/*
		u.bug("cpt:m4v"+this.video.canPlayType("video/x-m4v"));
		u.bug("cpt:mp4"+this.video.canPlayType("video/mp4"));
		u.bug("cpt:webm"+this.video.canPlayType("video/webm"));
//		u.bug("cpt:ogg+"+this.video.canPlayType('video/ogg; codecs="theora"'));
		u.bug("cpt:ogg+"+this.video.canPlayType('video/ogg'));
		u.bug("cpt:3gpp"+this.video.canPlayType("video/3gpp"));
		u.bug("cpt:mov"+this.video.canPlayType("video/quicktime"));
		*/

		/*
		if(this.video.canPlayType("video/x-m4v")) {
			return src+".m4v";
		}
		else 
		*/
		if(this.video.canPlayType("video/mp4")) {
			return src+".mp4";
		}
		else 
		if(this.video.canPlayType("video/ogg")) {
			return src+".ogv";
		}
		//else 
		//if(this.video.canPlayType("video/webm")) {
		//	return src+".webm";
		//}
		else 
		if(this.video.canPlayType("video/3gpp")) {
			return src+".3gp";
		}
		else {
		//else if(this.video.canPlayType("video/quicktime")) {
			return src+".mov";
		}

		// default fallback ??

	}



/*


	e.play = u.ae(e, "div", "play");
	e.play.e = e;
	u.e.click(e.play);
	e.play.clicked = function() {
		this.e.player.play();
	}

	e.stop = u.ae(e, "div", "stop");
	e.stop.e = e;
	u.e.click(e.stop);
	e.stop.clicked = function() {
		this.e.player.pause();
	}

	e.pause = u.ae(e, "div", "pause");
*/

	return player;

}