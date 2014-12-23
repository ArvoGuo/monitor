//var api = "http://monitor.napos.solo/api";
var api = "http://monitor.napos.io/api";
var Config = {
  pageRange: 15
};

var Tool = {
  substituteArray: function(str, array) {
    return str.replace(/\{(.+?)\}/g, function($0, $1) {
      return array[$1];
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
    return yy + '/' + mm + '/' + dd + ' ' + h + ':' + m + ':' + s;
  },
  formatTime: function(time) {
    return time < 10 ? '0' + time : time;
  },
  toTime: function(date) {
    return (new Date(date)).getTime();
  },
  now: function(){
    var date = new Date();
    var yy = date.getFullYear();
    var mm = date.getMonth() + 1;
    var dd = date.getDate();
    var h = this.formatTime(date.getHours());
    var m = this.formatTime(date.getMinutes());
    return yy + '-' + mm + '-' + dd + ' ' + h + ':' + m;
  },
  yesterday: function() {
    var date = new Date();
    var yy = date.getFullYear();
    var mm = date.getMonth() + 1;
    var dd = date.getDate() - 1;
    return yy + '-' + mm + '-' + dd + ' 00:00';
  },
  getStep: function(start, end) {
    var startTime = (new Date(start)).getTime();
    var endTime = (new Date(end)).getTime();
    var m = 60000;
    var points = 60;
    var range = 1;
    var dis = endTime - startTime;
    if (dis < m * 60) {
      range = 1;
    } else {
      range = Math.round(Math.abs(dis) / (m * points));
    }
    return range;
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
    switch (kind) {
      case "intime":
        // intime.paint();
        // interval = setInterval(function() {
        //   intime.paint();
        // }, 60000);
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
      default:
        break;
    }
  });
  $('.action').eq(0).trigger('click');
};
/*
 * 实时监控模块
 */
var intimeCb = function() {
  var getUrl = function(start, end) {
    var url = '/activitystats';
    start = start || Tool.yesterday();
    end = end || Tool.now();
    var step = Tool.getStep(start, end);
    url = url + '?period_from=' + start + '&period_to=' + end + '&step=' + step;
    return url;
  };
  $('.intime-submit').on('click', function(e) {
    e.preventDefault();
    Charts['chart-main'].ele.show();
    Charts['chart-main'].chart.showLoading({
      text: '正在查询..', //loading话术
    });
    var start = $('.startTime').val();
    var end = $('.endTime').val();
    var url = api + getUrl(start, end);
    intime.paintByTime(url);
    window.interval = setInterval(function() {
      intime.paintByTime(url);
    }, 60000);
  });
  $('.startTime').val(Tool.yesterday());
  $('.endTime').val(Tool.now());
  $('.intime-submit').eq(0).trigger('click');
};
/*
 * 活跃时段 版本变迁
 */
var clientinfoCb = function() {
  $('.clientinfo-submit').on('click', function() {
    var client = $('.model').val();
    var start = $('.time-start').val();
    var end = $('.time-end').val();
    var s = start ? '&period_from=' + start : '';
    var e = end ? '$period_to=' + end : '';
    var url = '/clientinfo?uuid=' + client + s + e;
    $.ajax({
      url: api + url,
      success: function(data) {
        var activityPeriods = data.activity_periods;
        var clientInfos = data.client_infos;
        /*版本迁移*/
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
            html += Tool.substituteArray(templateClient, item);
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



        /*活跃时段*/
        var barEle = $('#period-bar');
        var startEle = barEle.find('.tag-start');
        var endEle = barEle.find('.tag-end');
        var periodEle = barEle.find('.period');
        var templatePeroid = $('.result-client-period-template').html();
        startEle.text(Tool.formatDate(activityPeriods[0][2]));
        endEle.text(Tool.formatDate(activityPeriods[activityPeriods.length - 1][3]));
        var periodArray = getPeriod(activityPeriods);
        var periodPaint = function(list, ele) {
          var html = '';
          list.map(function(item) {
            html += Tool.substituteArray(templatePeroid, item);
          });
          ele.html('').append(html);
        };
        periodPaint(periodArray, periodEle);
      }
    });
  });


  function getPeriod(list) {
    var array = [];
    var len = list.length;
    var startTime = Tool.toTime(list[0][2]);
    var endTime = Tool.toTime(list[len - 1][3]);
    var C = endTime - startTime;
    var percent = function(value) {
      return ((value - startTime) / C * 100).toFixed(2) + '%';
    };
    list.map(function(item, index) {
      var a = percent(Tool.toTime(item[2]));
      var b = percent(Tool.toTime(item[3]));
      b = (b.split('%')[0] - a.split('%')[0]) + '%';
      array.push([a, b, Tool.formatDate(item[2]), Tool.formatDate(item[3])]);
    });
    return array;
  }
};
/*
 * 日统计模块
 */
var daycountCb = function() {
  var getUrl = function(act, date) {
    var url = '/apposratio';
    var obj = {
      'default': '',
      'android': 'android',
      'ios': 'ios',
      'windows': 'windows'
    };
    if (date) {
      return url + '?platform=' + obj[act] + '&stats_day=' + date;
    }
    return url + '?platform=' + obj[act] + '&stats_day=' + Tool.yesterday();
  };
  $('.daycount-submit').on('click', function() {
    var act = $(this).attr('act');
    var value = $('.daycount-date').val();
    var url = getUrl(act, value);
    if (act == 'default') {
      daycount.paint(url);
    } else {
      daycount.paintBySystem(url);
    }
  });
  //$('.daycount-submit').eq(0).trigger('click');
};
/*
 * 查询模块
 */
var searchCb = function() {
  $('#part-info input[name=search-kind]').on('click', function() {
    var value = $('#part-info input[name=search-kind]:checked').val();
    $('.radio-value').text(value);
  });
  $('.search-submit').on('click', function() {
    var kind = $('.radio-value').text();
    var model = $('input[name=model]').val();
    var startTime = $('input[name=time-begin]').val();
    var endTime = $('input[name=time-end]').val();
    var url = getUrl(kind, model, startTime, endTime);
    var changeTb = function(value) {
      var name;
      if (value == 'client') {
        name = ['ClientId', 'UserId', 'RestaurantId'];
      }
      if (value == 'user') {
        name = ['UserId', 'ClientId', 'RestaurantId'];
      }
      if (value == 'restaurant') {
        name = ['RestaurantId', 'UserId', 'ClientId'];
      }
      return name;
    }($('.radio-value').text());
    $('#part-info .result .tb_id').map(function(index, item) {
      $(item).text(changeTb[index]);
    });
    $.ajax({
      url: api + url,
      success: function(data) {
        var list = data[Object.keys(data)[0]];
        var template = $('#result-template').html();
        /*formateData*/
        list.map(function(item) {
          item[4] = Tool.formatDate(item[4]);
          item[5] = Tool.formatDate(item[5]);
        });
        var resultPaint = function(data, Ele) {
          var html = '';
          Ele = Ele || $('.result tbody');
          data.map(function(item) {
            html += Tool.substituteArray(template, item);
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

  function substitute(str, sub) {
    return str.replace(/\{(.+?)\}/g, function($0, $1) {
      return $1 in sub ? sub[$1] : $0;
    });
  }

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