Util.Objects["about"] = new function() {
	this.init = function(e) {

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




		// call content ready class
		e.ready();
	}
}