// create article state-toggler from article
Util.articleSnippet = function(article) {


	// is article too long?
	if(article.textContent != undefined && article.textContent.length > 200) {

		// create preview - create preview before adding minimize link
		article.preview = u.previewNode(article, 200);

		// add read more link to last preview article node
//		u.bug(article.preview.lastChild)
		var readmore = u.ae(article.preview.lastChild, "a", "readmore")
		readmore.innerHTML = u.txt["readmore"]; //"Læs mere";


		// add minimize link to original article
		var minimize = u.ae(u.ae(article, "div", "minimize"), "a", "minimize")
		minimize.innerHTML = u.txt["minimize"]; //"Minimér";


		// get max height - including max-link
		article.max_height = article.offsetHeight;

		// save original node
		article.original = article.cloneNode(true);


		// replace article content - only doing this to get properties for later
		article.innerHTML = article.preview.innerHTML;

		// iPad bug - force dom update before getting height (normal force does not work)
		u.ac(article, "force-dom-update");
		u.rc(article, "force-dom-update");

		// get min height - including readmore-link
		article.min_height = article.offsetHeight;

		u.a.setHeight(article, article.min_height);


		// show orignal
		article.showOriginal = function() {

			// on fade down event
			this.transitioned = function() {
				this.transitioned = null;
				u.a.transition(this, "none");

				// exchange content
				this.innerHTML = this.original.innerHTML;

				// setup new content
				var minimize = u.qs(".minimize", this);
				minimize.article = this;
				u.e.click(minimize);
				minimize.clicked = function(event) {
					u.e.kill(event);
					this.article.showPreview();
				}

				// on fade up event
				this.transitioned = function() {
					this.transitioned = null;
					u.a.transition(this, "none");

					// expand
					u.a.transition(this, "all 0.5s ease-in");
					u.a.setHeight(this, this.max_height);
				}

				// fade up
				u.a.transition(this, "all 0.3s ease-in");
				u.a.setOpacity(this, 1);
			}

			// fade down
//			if(this._opacity == 0) {
			if(u.gcs(this, "opacity") == 0) {
				this.transitioned();
			}
			else {
				u.a.transition(this, "all 0.3s ease-in");
				u.a.setOpacity(this, 0);
			}
		}


		// show preview
		article.showPreview = function() {

			// on fade down event
			this.transitioned = function() {
				this.transitioned = null;
				u.a.transition(this, "none");

				// exchange content
				this.innerHTML = this.preview.innerHTML;

				// setup new content
				var readmore = u.qs(".readmore", this);
				readmore.article = this;
				u.e.click(readmore);
				readmore.clicked = function(event) {
					u.e.kill(event);
					this.article.showOriginal();
				}

				// on fade up event
				this.transitioned = function() {

					this.transitioned = null;
					u.a.transition(this, "none");

					// expand
					u.a.transition(this, "all 0.3s ease-in");
					u.a.setOpacity(this, 1);
				}

				// fade up
				u.a.transition(this, "all 0.3s ease-in");
				if(this.offsetHeight == this.min_height) {
					this.transitioned();
				}
				u.a.setHeight(this, this.min_height);
			}


			// fade down
//			if(this._opacity == 0) {
			if(u.gcs(this, "opacity") == 0) {
				this.transitioned();
			}
			else {
				u.a.transition(this, "all 0.3s ease-in");
				u.a.setOpacity(this, 0);
			}
		}


		// set start state
		article.showPreview();

	}

}

// cut off excessive parts for previewing
u.previewNode = function(node, max_length) {

	// clone node to work on
	var preview_node = node.cloneNode(true);

	// length counter
	this.text_length = 0;
	this.max_length = max_length;

	// iterate over children
	this.childIterator = function(parent) {
//		u.bug("cI:"+parent.nodeName);

		var i, child;

		// loop through child nodes
		for(i = 0; child = parent.childNodes[i]; i++) {
//			u.bug(i+":"+child.nodeName + ":" + this.text_length);

			// still room for more text
			if(this.text_length < this.max_length) {

				// regular text node
				if(child.nodeName == "#text") {

					// empty text node?
					if(child.data.trim()) {

						// if content of child surpasses max length, cut it off
						if(this.text_length + child.data.length > this.max_length) {

							child.data = child.data.substring(0, this.max_length - this.text_length) + " ...";
//							child.data = u.cutString(child.data, (max_length - this.text_length));

							this.text_length = this.max_length;
						}
						// all is good, keep node intact
						else {
							this.text_length += child.data.length;
						}

					}
					// remove empty text nodes
					else {
//						u.bug("remove empty text node")
						child.parentNode.removeChild(child);
						// correct index for removed node
						i--;
					}

				}
				// not a text node - dig in
				else {
//					u.bug("real node - dig in:" + child.nodeName)
					this.childIterator(child);
				}

			}
			// limit is surpassed, remove all following nodes
			else {
//				u.bug(i+":remove exss node:" + preview_node)
				child.parentNode.removeChild(child);
				// correct index for removed node
				i--;
			}

		}
		return;
	}

	this.childIterator(preview_node);

	return preview_node;

}