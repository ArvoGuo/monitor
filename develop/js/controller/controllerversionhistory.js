/*
 * 版本历史变迁
 */
var versionhisCb = function(params,pathname) {
  initDateTimePicker();
  $('.versionhis-submit').on('click', function() {
    var act = $(this).attr('act');
    var url = api + '/apposratiotrends?system=' + act;
    Module['versionhis'].paint(url,pathname);
    Hash.setParams({
      start: '',
      end: '',
      action: act
    });
  });
  if (params && params.hasOwnProperty('action')){
    $('.versionhis-submit[act='+ params.action +']').eq(0).trigger('click');
  } else {
    $('.versionhis-submit').eq(0).trigger('click');
  }
  defaultCallBack();
};