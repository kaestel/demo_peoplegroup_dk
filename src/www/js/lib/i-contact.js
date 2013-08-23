Util.Objects["contact"] = new function() {
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
		
		var latlng = new google.maps.LatLng(55.679368, 12.563136);
		var myOptions = {
			zoom: 15,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR  
			}
		};
		var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		var marker = new google.maps.Marker({
			position: latlng, 
			map: map, 
			title:"Vester Farimagsgade 41"
		});


		// call content ready class
		e.ready();
	}
}