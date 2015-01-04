$(document).ready(function() {
  $('.action').on('click', function(e) {
    var kind = $(this).attr('kind');
    Hash.setPathName(kind);
    Router();
  });
  Router();
});