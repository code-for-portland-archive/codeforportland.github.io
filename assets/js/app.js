$(document).ready(function() {

  // initialize Foundation
  $(document).foundation();

  // ensure Retina.js doesn't lock our image sizes at original load size
  Retina.configure({force_original_dimensions: false});
});
