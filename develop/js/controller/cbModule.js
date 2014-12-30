
/*
 * 载入右侧后执行的
 */
var navCb = function() {
  $('.action').on('click', function() {
    var url = $(this).attr('act');
    var kind = $(this).attr('kind');
    init(true, true);
    if (kind != 'intime') {
      navStatus = 'other';
    } else {
      navStatus = 'main';
    }
    $('.xdsoft_datetimepicker').remove();
    switch (kind) {
      case "intime":
        $('#part-info').load('./include/intime.html', intimeCb);
        break;
      case "daycount":
        $('#part-info').load('./include/daycount.html', daycountCb);
        break;
      case "search":
        $('#part-info').load('./include/search.html', searchCb);
        break;
      case "clientinfo":
        $('#part-info').load('./include/clientinfo.html', clientinfoCb);
        break;
      case "rststats":
        $('#part-info').load('./include/rststats.html', rststatCb);
        break;
      case "versionhistory":
        $('#part-info').load('./include/versionhistory.html', versionhisCb);
        break;
      default:
        break;
    }
  });
  $('.action').eq(0).trigger('click');
};
/*
* 版本历史变迁
*/
var versionhisCb = function(){
  initDateTimePicker();
  $('.versionhis-submit').on('click',function(){
    var act = $(this).attr('act');
    var url = api + '/apposratiotrends?system=' + act;
    Module['versionhis'].paint(url);
  });
  $('.versionhis-submit').eq(0).trigger('click');
  defaultCallBack();
};
/*
 * 餐厅统计模块
 */
var rststatCb = function() {
  initDateTimePicker();
  if ($.cookie('restaurant-statistics')){
    var v = $.cookie('restaurant-statistics').split('|||');
    $('#rststats-date').val(v[0]);
    $('#rststats-result').text(v[1]);
  }
  $('.rststats-submit').on('click', function() {
    var self = this;
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
        $.cookie('restaurant-statistics',date + '|||' + $('#rststats-result').text(),{expires: 0.1});
      }
    });
  });
  defaultCallBack();
};

/*
 * 实时监控模块
 */
var intimeCb = function() {
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
    clearInterval(window.interval);
    Charts['chart-main'].ele.show();
    Charts['chart-main'].chart.showLoading({
      text: '正在查询..', //loading话术
    });
    var start = $('.start-time').val();
    var end = $('.end-time').val();
    var url = getUrl(start, end);
    Module['intime'].paintByTime(url);
  });

  $('.intime-model').on('click', function(e) {
    e.preventDefault();
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
  });
  /*default*/
  (function(minDate) {
    var start = Tool.todayZero();
    if (minDate) {
      if ((new Date(start)).getTime() < (new Date(minDate)).getTime()) {
        start = Tool.formatDate(minDate);
      }
    }
    $('.start-time').val(start);
    $('.end-time').val(Tool.now());
    $('.intime-submit').eq(0).trigger('click');
  })(minDate);
  defaultCallBack();
};
/*
 * 活跃时段 版本变迁
 */
var clientinfoCb = function() {
  var self = this;
  initDateTimePicker();
  $('.clientinfo-submit').on('click', function() {
    var client = $('.model').val();
    var start = $('.time-start').val();
    var end = $('.time-end').val();
    var s = start ? '&period_from=' + start : '';
    var e = end ? '$period_to=' + end : '';
    var url = '/clientinfo?uuid=' + client + s + e;
    $('.note-client').text(words.query);
    $(self).addClass('disabled');
    $.ajax({
      url: api + url,
      success: function(data) {
        $(self).removeClass('disabled');
        var activityPeriods = data.activity_periods;
        var clientInfos = data.client_infos;
        /*版本迁移*/
        if (!clientInfos || clientInfos.length < 1) {
          $('#note-client-info').text(words.empty);
        } else {
          $('#note-client-info').text('');
          var html = '';
          var templateClient = $('.result-client-info-template').html();
          var clientInfoEle = $('.result-client-info tbody');
          /**formatData*/
          clientInfos.map(function(item) {
            item.active_time = Tool.formatDate(item.active_time);
          });
          var clientInfosPaint = function(data, Ele) {
            data = data || clientInfos;
            Ele = Ele || clientInfoEle;
            var html = '';
            data.map(function(item) {
              html += Tool.substitute(templateClient, item);
            });
            Ele.html('').append(html);
          };
          /*page*/
          var page = $.Page({
            range: Config.pageRange,
            Ele: $('#page-clientinfo'),
            data: clientInfos,
            paintArea: clientInfoEle,
            paintFn: clientInfosPaint
          });
        }
        if (!activityPeriods || activityPeriods.length < 1) {
          $('#note-client-period').text(words.empty);
        } else {
          $('#note-client-period').text('');
          /*活跃时段*/
          var barEle = $('#period-bar');
          var startEle = barEle.find('.tag-start');
          var endEle = barEle.find('.tag-end');
          var periodEle = barEle.find('.period');
          var templatePeroid = $('.result-client-period-template').html();
          startEle.text(Tool.formatDate(activityPeriods[0].active_from));
          endEle.text(Tool.formatDate(activityPeriods[activityPeriods.length - 1].active_to));
          var periodArray = getPeriod(activityPeriods);
          var periodPaint = function(list, ele) {
            var html = '';
            list.map(function(item) {
              html += Tool.substitute(templatePeroid, item);
            });
            ele.html('').append(html);
          };
          periodPaint(periodArray, periodEle);
        }
      }
    });
  });

  /*default init*/
  if ($.cookie('td-result-uuid')){
    $('#client-info-client').val($.cookie('td-result-uuid'));
    $('.clientinfo-submit').trigger('click');
  }


  function getPeriod(list) {
    var array = [];
    var len = list.length;
    var startTime = Tool.toTime(list[0].active_from);
    var endTime = Tool.toTime(list[len - 1].active_to);
    var C = endTime - startTime;
    var percent = function(value) {
      return ((value - startTime) / C * 100).toFixed(2) + '%';
    };
    list.map(function(item, index) {
      var a = percent(Tool.toTime(item.active_from));
      var b = percent(Tool.toTime(item.active_to));
      b = (b.split('%')[0] - a.split('%')[0]) + '%';
      array.push([a, b, Tool.formatDate(item.active_from), Tool.formatDate(item.active_to)]);
    });
    return array;
  }
  defaultCallBack();
};
/*
 * 日统计模块
 */
var daycountCb = function() {
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
  $('.daycount-submit').on('click', function() {
    var act = $(this).attr('act');
    var value = $('.daycount-date').val();
    var url = getUrl(act, value);
    Module['daycount'].paintTop(url);
  });
  $('.daycount-date').val(Tool.yesterday('day'));
  $('.daycount-submit').eq(1).trigger('click');
  defaultCallBack();
};
/*
 * 查询模块
 */
var searchCb = function() {
  initDateTimePicker();
  $('#part-info input[name=search-kind]').on('click', function() {
    var value = $(this).val();
    $('.radio-value').text(value);
  });
  $('.search-submit').on('click', function() {
    var self = this;
    var kind = $('.radio-value').text();
    var model = $('input[name=model]').val();
    var startTime = $('input[name=time-begin]').val();
    var endTime = $('input[name=time-end]').val();
    var url = getUrl(kind, model, startTime, endTime);
    $('#napos-query-note').text(words.query);
    $(self).addClass('disabled');
    $.ajax({
      url: api + url,
      success: function(data) {
        $(self).removeClass('disabled');
        var list = data[Object.keys(data)[0]];
        if (list.length < 1) {
          $('#napos-query-note').text(words.empty);
        } else {
          $('#napos-query-note').text('');
        }
        var template = $('#result-template').html();
        /*formateData*/
        list.map(function(item) {
          item.active_from = Tool.formatDate(item.active_from);
          item.active_to = Tool.formatDate(item.active_to);
        });
        var bindTdAct = function(){
          /*on click*/
          $('.td-result').on('click',function(){
            var self = this;
            var act = $(this).attr('act');
            var content = $(this).text();
            $('.query-radio[act='+ act +']').trigger('click');
            if (content == $('#query-model').val()) {
              return;
            }
            $('#query-model').val(content);
            $('.search-submit').trigger('click');
          });
          $('.td-result-uuid').on('click',function(){
            var content = $(this).text();
            $.cookie('td-result-uuid',content,{expires: 0.1});
            $('.action[kind=clientinfo]').trigger('click');
          });
        };
        var resultPaint = function(data, Ele) {
          var html = '';
          Ele = Ele || $('.result tbody');
          data.map(function(item) {
            html += Tool.substitute(template, item);
          });
          Ele.html('').append(html);
          bindTdAct();
        };
        /*page*/
        var page = $.Page({
          range: Config.pageRange,
          Ele: $('#page-search'),
          data: list,
          paintFn: resultPaint
        });
      }
    });

  });

  function getUrl(value, model, start, end) {
    var url = {
      'client': '/userrstforclient?client=',
      'user': '/clientrstforuser?user=',
      'restaurant': '/clientuserforrst?rst='
    };
    var s = '',
      e = '';
    if (start) {
      s = '&period_from=' + start;
    }
    if (end) {
      e = '&period_to=' + end;
    }
    return url[value] + model + s + e;
  }
  defaultCallBack();
};