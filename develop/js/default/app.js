$(document).ready(function() {
    $('.action').on('click', function(e) {
    var url = $(this).attr('act');
    var kind = $(this).attr('kind');
    init(true, true);
    if (kind != '/intime') {
      navStatus = 'other';
    } else {
      navStatus = 'main';
    }
    $('.xdsoft_datetimepicker').remove();
    Hash.setPathName(kind);
    Router();
  });
});