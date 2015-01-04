/*
 * 日统计模块
 */
var daycountCb = function(params,pathname) {
  initDateTimePicker();
  var getUrl = function(act, date) {
    var url = api + '/topapposratio';
    var obj = {
      'default': '',
      'android': 'android',
      'ios': 'ios',
      'windows': 'windows'
    };
    if (date) {
      return url + '?system=' + obj[act] + '&stats_day=' + date + '&top=10';
    }
    return url + '?system=' + obj[act] + '&stats_day=' + Tool.yesterday() + '&top=10';
  };
  $('.daycount-submit').on('click', function(e) {
    e.preventDefault();
    var act = $(this).attr('act');
    var value = $('.daycount-date').val();
    var url = getUrl(act, value);
    Module['daycount'].paintTop(url,pathname);
    /*hash*/
    Hash.setParams({
      start: value,
      end: '',
      action: act
    });
  });
  if (params && params.hasOwnProperty('action')) {
    $('.daycount-date').val(params.start);
    $('.daycount-submit[act='+ params.action +']').eq(0).trigger('click');
  } else {
    $('.daycount-date').val(Tool.yesterday('day'));
    $('.daycount-submit').eq(0).trigger('click');
  }
  defaultCallBack();
};