$(document).ready(function() {

	// initialize Foundation
	$(document).foundation();

	
	/***
	 * viewModel: a Knockout view model for our page.
	 */
	var viewModel = function() {
		var self = this;

	}; /* end viewModel */


	// Apply our Knockout bindings
	var view = new viewModel();
	ko.applyBindings(view);
});
