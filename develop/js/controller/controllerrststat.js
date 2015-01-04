/*
 * 餐厅统计模块
 */
var rststatCb = function(params) {
  initDateTimePicker();
  $('.rststats-submit').on('click', function() {
    var self = this;
    var act = $(self).attr('act');
    var date = $('#rststats-date').val();
    date = date || Tool.yesterday('day');
    var url = '/multilogrst?stats_day=' + date;
    $('#rststats-result').text('Query..');
    $(self).addClass('disabled');
    $.ajax({
      url: api + url,
      success: function(data) {
        $(self).removeClass('disabled');
        var total = data.multiple_login_rst_count.count;
        $('#rststats-result').text(total + ' restaurants login multiple clients.');
        $.cookie('restaurant-statistics', date + '|||' + $('#rststats-result').text(), {
          expires: 0.1
        });
      }
    });
    Hash.setParams({
      start: date,
      end: '',
      action: act
    });
  });
  if (params && params.hasOwnProperty('action')) {
    $('#rststats-date').val(params.start);
    $('.rststats-submit[act='+ params.action +']').eq(0).trigger('click');
  } else {
    if ($.cookie('restaurant-statistics')) {
      var v = $.cookie('restaurant-statistics').split('|||');
      $('#rststats-date').val(v[0]);
      $('#rststats-result').text(v[1]);
      //
      Hash.setParams({
        start: v[0],
        end: '',
        action: 'default'
      });
    }
  }
  defaultCallBack();
};