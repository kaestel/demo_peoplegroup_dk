Util.Objects["content"] = new function() {
	this.init = function(e) {

		// page reference
		var page = u.qs("#page");


		// list items ready - enable drag
		e.ready = function() {
//			u.bug("inner content ready")
//			if(u.qsa(".ready", this).length != u.qsa("li", this).length || this.initiated) {
//				return;
//			}
//			else {
//				u.bug("content is ready")

				// show when ready
//				u.t.setTimer(u.qs("#content"), u.qs("#content").ready, "10");
//				u.as(this, "opacity", "1");
				u.ac(u.qs("#content"), "ready");
				u.qs("#content").ready();

//				this.initiated = true;
//			}
		}

		// do what ever is needed 

		// call content ready class
		e.ready();
	}
}
