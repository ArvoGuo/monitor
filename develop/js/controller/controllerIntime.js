
/*
 * 实时监控模块
 */
var intimeCb = function(params) {
  /*date init*/
  var minDate;
  $.ajax({
    url: api + '/earlyesttime',
    success: function(data) {
      if (data) {
        minDate = new Date(data.earlyest_active_time);
        $('#intime-date-start,.datetimepicker').datetimepicker({
          minDate: minDate
        });
      }
    }
  });

  var getUrl = function(start, end) {
    var url = api + '/activitystats';
    start = start || Tool.yesterday();
    end = end || Tool.now();
    var step = Tool.getStep(start, end);
    url = url + '?period_from=' + start + '&period_to=' + end + '&step=' + step;
    return url;
  };
  $('.intime-submit').on('click', function(e) {
    e.preventDefault();
    var self = this;
    clearInterval(window.interval);
    Charts['chart-main'].ele.show();
    Charts['chart-main'].chart.showLoading({
      text: '正在查询..', //loading话术
    });
    var start = $('.start-time').val();
    var end = $('.end-time').val();
    var url = getUrl(start, end);
    Module['intime'].paintByTime(url);
    /*hash*/
    Hash.setParams({
      start: start,
      end: end,
      action: $(self).attr('act')
    });
  });

  $('.intime-model').on('click', function(e) {
    e.preventDefault();
    var self = this;
    clearInterval(window.interval);
    var model = $(this).attr('act');
    var start = '';
    var end = '';
    var url = '';
    if (model == 'hour') {
      start = Tool.datetimeBefore(0, 0, 1);
      end = Tool.now();
    }
    if (model == 'day') {
      start = Tool.datetimeBefore(0, 1, 0);
      end = Tool.now();
    }
    if (model == 'week') {
      start = Tool.datetimeBefore(0, 7, 0);
      end = Tool.now();
    }
    if (model == 'month') {
      start = Tool.datetimeBefore(1, 0, 0);
      end = Tool.now();
    }

    if (minDate) {
      if ((new Date(start)).getTime() < (new Date(minDate)).getTime()) {
        start = Tool.formatDate(minDate);
      }
    }
    $('.start-time').val(start);
    $('.end-time').val(end);
    if (model == 'hour') {
      url = getUrl(start, end);
      Module['intime'].paintByTime(url);
      window.interval = setInterval(function() {
        start = Tool.datetimeBefore(0, 0, 1);
        end = Tool.now();
        var url = getUrl(start, Tool.now());
        Module['intime'].paintByTime(url);
      }, 60000);
    } else {
      url = getUrl(start, end);
      Module['intime'].paintByTime(url);
    }
    /*hash*/
    Hash.setParams({
      start: start,
      end: end,
      action: $(self).attr('act')
    });

  });

  if (params && params.hasOwnProperty('action')) {
    /*by hash*/
    var start = params.start;
    var end = params.end;
    $('.start-time').val(start);
    $('.end-time').val(end);
    $('button[act=' + params.action + ']').trigger('click');
  } else {
    /*by default*/
    (function(minDate) {
      var start = Tool.todayZero();
      var end = Tool.now();
      if (minDate) {
        if ((new Date(start)).getTime() < (new Date(minDate)).getTime()) {
          start = Tool.formatDate(minDate);
        }
      }
      $('.start-time').val(start);
      $('.end-time').val(end);
      $('.intime-submit').eq(0).trigger('click');
    })(minDate);
  }

  defaultCallBack();
};