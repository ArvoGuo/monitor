var Tool = {
  substituteArray: function(str, array) {
    return str.replace(/\{(.+?)\}/g, function($0, $1) {
      return array[$1];
    });
  },
  formatDate: function(value) {
    var date = new Date(value);
    var yy = date.getFullYear();
    var mm = date.getMonth();
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
  }
};

/*
 * 载入右侧后执行的
 */
var navCb = function() {
  $('.action').on('click', function() {
    var url = $(this).attr('act');
    var kind = $(this).attr('kind');
    init();
    switch (kind) {
      case "intime":
        intime.paint(url);
        interval = setInterval(function() {
          intime.paint(url);
        }, 60000);
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
var clientinfoCb = function() {
  $('.clientinfo-submit').on('click', function() {
    var client = $('.model').val();
    var start = $('.time-start').val();
    var end = $('.time-end').val();
    var s = start ? '&period_from=' + start : '';
    var e = end ? '$period_to=' + end : '';
    var url = '/clientinfo?uuid=' + client + s + e;
    $.ajax({
      url: url,
      success: function(data) {
        var activityPeriods = data.activity_periods;
        var clientInfos = data.client_infos;
        /*版本迁移*/
        var html = '';
        var templateClient = $('.result-client-info-template').html();
        clientInfos.map(function(item) {
          item[9] = Tool.formatDate(item[9]);
          html += Tool.substituteArray(templateClient, item);
        });
        $('.result-client-info tbody').html('').append(html);
        /*活跃时段*/
        var barEle = $('#period-bar');
        var startEle = barEle.find('.tag-start');
        var endEle = barEle.find('.tag-end');
        var periodEle = barEle.find('.period');
        var templatePeroid = $('.result-client-period-template').html();
        var htmlPeroid = '';
        startEle.text(Tool.formatDate(activityPeriods[0][2]));
        endEle.text(Tool.formatDate(activityPeriods[activityPeriods.length-1][3]));
        var periodArray = getPeriod(activityPeriods);
        periodArray.map(function(item) {
          htmlPeroid += Tool.substituteArray(templatePeroid, item);
        });
        periodEle.html('').append(htmlPeroid);
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
  $('.daycount-submit').on('click', function() {
    var url = '/apposratio';
    var value = $('.daycount-date').val();
    if (value) {
      url += '?stats_day=' + value;
    }
    daycount.paint(url);
  });
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
    $.ajax({
      url: url,
      success: function(data) {
        var list = data[Object.keys(data)[0]];
        var template = $('#result-template').html();
        var html = '';
        $('.result tbody').html('');
        list.map(function(item) {
          item[4] = Tool.formatDate(item[4]);
          item[5] = Tool.formatDate(item[5]);
          html += Tool.substituteArray(template, item);
        });
        $('.result tbody').append(html);
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