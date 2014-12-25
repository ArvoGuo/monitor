//var api = "http://monitor.napos.solo/api";
var Config = {
  pageRange: 15
};

var Tool = {
  substituteArray: function(str, array) {
    return str.replace(/\{(.+?)\}/g, function($0, $1) {
      return array[$1];
    });
  },
  substitute: function(str, sub) {
    return str.replace(/\{(.+?)\}/g, function($0, $1) {
      return $1 in sub ? sub[$1] : $0;
    });
  },

  formatDate: function(value) {
    var date = new Date(value);
    var yy = date.getFullYear();
    var mm = date.getMonth() + 1;
    var dd = Tool.formatTime(date.getDate());
    var h = Tool.formatTime(date.getHours());
    var m = Tool.formatTime(date.getMinutes());
    var s = Tool.formatTime(date.getSeconds());
    return yy + '-' + mm + '-' + dd + ' ' + h + ':' + m + ':' + s;
  },
  formatTime: function(time) {
    return time < 10 ? '0' + time : time;
  },
  toTime: function(date) {
    return (new Date(date)).getTime();
  },
  now: function(day) {
    var date = new Date();
    var yy = date.getFullYear();
    var mm = date.getMonth() + 1;
    var dd = this.formatTime(date.getDate());
    var h = this.formatTime(date.getHours());
    var m = this.formatTime(date.getMinutes());
    if (day) {
      return yy + '-' + mm + '-' + dd;
    }
    return yy + '-' + mm + '-' + dd + ' ' + h + ':' + m;
  },
  todayZero: function() {
    var date = new Date();
    var yy = date.getFullYear();
    var mm = date.getMonth() + 1;
    var dd = this.formatTime(date.getDate());
    return yy + '-' + mm + '-' + dd + ' 00:00';
  },
  today: function() {
    var date = new Date();
    var yy = date.getFullYear();
    var mm = date.getMonth() + 1;
    var dd = this.formatTime(date.getDate());
    return yy + '-' + mm + '-' + dd;
  },
  datetimeBefore: function(m, d, h) {
    var time = new Date();
    time = time.getTime();
    var unitH = 1000 * 60 * 60;
    var hTime = h * unitH;
    var dTime = d * unitH * 24;
    var mTime = m * unitH * 24 * 30;
    var date = time - hTime - dTime - mTime;
    date = new Date(date);
    var yy = date.getFullYear();
    var mm = date.getMonth() + 1;
    var dd = this.formatTime(date.getDate());
    var hh = this.formatTime(date.getHours());
    var i = this.formatTime(date.getMinutes());
    return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + i;
  },
  yesterday: function(day) {
    var date = new Date();
    var yy = date.getFullYear();
    var mm = date.getMonth() + 1;
    var dd = this.formatTime(date.getDate()) - 1;
    if (day) {
      return yy + '-' + mm + '-' + dd;
    }
    return yy + '-' + mm + '-' + dd + ' 00:00';
  },
  getStep: function(start, end) {
    var startTime = (new Date(start)).getTime();
    var endTime = (new Date(end)).getTime();
    var m = 60000;
    var points = 200;
    var range = 1;
    var dis = endTime - startTime;
    if (dis <= m * 60) {
      range = 1;
    } else {
      range = Math.round(Math.abs(dis) / (m * points));
    }

    return range < 1 ? 1 : range;
  }
};

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
      default:
        break;
    }
  });
  $('.action').eq(0).trigger('click');
};

/*
 * 餐厅统计模块
 */
var rststatCb = function() {
  initDateTimePicker();
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
      }
    });
  });
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
    intime.paintByTime(url);
  });

  $('.intime-model').on('click', function() {
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
      intime.paintByTime(url);
      window.interval = setInterval(function() {
        start = Tool.datetimeBefore(0, 0, 1);
        end = Tool.now();
        var url = getUrl(start, Tool.now());
        intime.paintByTime(url);
      }, 60000);
    } else {
      url = getUrl(start, end);
      intime.paintByTime(url);
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
            item[9] = Tool.formatDate(item[9]);
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
};
/*
 * 日统计模块
 */
var daycountCb = function() {
  initDateTimePicker();
  var getUrl = function(act, date) {
    var url = api + '/apposratio';
    var obj = {
      'default': '',
      'android': 'android',
      'ios': 'ios',
      'windows': 'windows'
    };
    if (date) {
      return url + '?system=' + obj[act] + '&stats_day=' + date;
    }
    return url + '?system=' + obj[act] + '&stats_day=' + Tool.yesterday();
  };
  $('.daycount-submit').on('click', function() {
    var act = $(this).attr('act');
    var value = $('.daycount-date').val();
    var url = getUrl(act, value);
    daycount.paintBySystem(url);
  });
  $('.daycount-date').val(Tool.yesterday('day'));
  $('.daycount-submit').eq(1).trigger('click');
};
/*
 * 查询模块
 */
var searchCb = function() {
  initDateTimePicker();
  $('#part-info input[name=search-kind]').on('click', function() {
    var value = $('#part-info input[name=search-kind]:checked').val();
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
        var resultPaint = function(data, Ele) {
          var html = '';
          Ele = Ele || $('.result tbody');
          data.map(function(item) {
            html += Tool.substitute(template, item);
          });
          Ele.html('').append(html);
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
};