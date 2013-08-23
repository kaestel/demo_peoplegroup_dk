Util.Objects["sharing"] = new function() {
	this.init = function(tools) {

		// page reference
		var page = u.qs("#page");


		// set share links
		var icon = u.qs(".shareicon", tools);
		icon.tools = tools;

		var sharetext = u.qs(".sharetext", tools);
		sharetext.tools = tools;
		var facebook = u.qs(".facebook", tools);
		facebook.tools = tools;
		var email = u.qs(".email", tools);
		email.tools = tools;
		var twitter = u.qs(".twitter", tools);
		twitter.tools = tools;


		tools.icon = icon;
		tools.sharetext = sharetext;
		tools.facebook = facebook;
		tools.email = email;
		tools.twitter = twitter;

		u.as(sharetext, "display", "none");
		u.as(sharetext, "opacity", "0");
		u.as(facebook, "display", "none");
		u.as(facebook, "opacity", "0");
		u.as(email, "display", "none");
		u.as(email, "opacity", "0");
		u.as(twitter, "display", "none");
		u.as(twitter, "opacity", "0");

		// show tools
		tools.show = function() {
			u.ac(this, "show");
			u.t.resetTimer(this.t_hide);

			u.as(this.sharetext, "display", "inline-block");
			u.as(this.facebook, "display", "inline-block");
			u.as(this.email, "display", "inline-block");
			u.as(this.twitter, "display", "inline-block");

			u.a.transition(this.twitter, "all 0.15s ease-in");
			u.a.setOpacity(this.twitter, 1);

			u.a.transition(this.email, "all 0.15s ease-in 0.07s");
			u.a.setOpacity(this.email, 1);

			u.a.transition(this.facebook, "all 0.15s ease-in 0.15s");
			u.a.setOpacity(this.facebook, 1);

			u.a.transition(this.sharetext, "all 0.15s ease-in 0.22s");
			u.a.setOpacity(this.sharetext, 1);
		}

		// hide tools
		tools.hide = function() {
			u.rc(this, "show");
			u.t.resetTimer(this.t_hide);

			this.sharetext.transitioned = function() {
				this.transitioned = null;

				u.as(this.tools.sharetext, "display", "none");
				u.as(this.tools.facebook, "display", "none");
				u.as(this.tools.email, "display", "none");
				u.as(this.tools.twitter, "display", "none");
			}

			u.a.transition(this.sharetext, "all 0.2s ease-out");
			u.a.setOpacity(this.sharetext, 0);

			u.a.transition(this.facebook, "all 0.2s ease-out");
			u.a.setOpacity(this.facebook, 0);

			u.a.transition(this.email, "all 0.2s ease-out");
			u.a.setOpacity(this.email, 0);

			u.a.transition(this.twitter, "all 0.2s ease-out");
			u.a.setOpacity(this.twitter, 0);
		}

		u.e.click(icon);
		icon.clicked = function(event) {
			u.e.kill(event);

			if(this.tools.className.match("show")) {
				this.tools.hide();
			}
			else {
				this.tools.show();
			}
		}

		// set mouseover effect if mouse is input type
		if(u.e.event_pref == "mouse") {
			// activate on mouseover
			icon.onmouseover = facebook.onmouseover = email.onmouseover = twitter.onmouseover = function(event) {
				this.tools.show();
			}
			icon.onmouseout = facebook.onmouseout = email.onmouseout = twitter.onmouseout = function(event) {
				if(this.tools.className.match(/show/g)) {
					this.tools.t_hide = u.t.setTimer(this.tools, this.tools.hide, 1000);
				}
			}
		}


		// callback if required
		if(typeof(tools.ready) == "function") {
			u.ac(tools, "ready");
			tools.ready();
		}

	}
}
