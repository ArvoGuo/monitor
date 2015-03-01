var chartsNames = ['chart-main',
  'chart-percent-napos',
  'chart-percent-os',
  'chart-os-napos',
  'chart-napos-os',
  'chart-versionhis-napos-in-os',
  'chart-versionhis-os-in-napos'
];
var moduleName = ['intime', 'daycount', 'versionhis'];
window.Charts = {};
window.Module = {};
window.Hash = $.Hash();
window.ChartsFn = {};
window.interval = 0;
window.navStatus = 'main';
window.words = {
  query: 'Query..',
  empty: 'Result is empty.'
};
window.onpopstate = function(e){
  if (Hash.status === true){
    Router();
    //$('.action[kind="'+ Hash.getPathName() +'"]').eq(0).trigger('click',Hash.getParamObj());
  }
};
moduleName.forEach(function(name) {
  Module[name] = {};
});
chartsNames.forEach(function(name) {
  var ele = $('<div class="chart"></div>');
  ele.appendTo($('#chart'));
  Charts[name] = {
    ele: ele,
    chart: echarts.init(ele[0])
  };
});
ChartsFn.loading = function(words) {
  for (var i in Charts) {
    if (i == 'chart-main' || i == 'chart-versionhis-napos-in-os' || i == 'chart-versionhis-os-in-napos') {
      continue;
    }
    Charts[i].ele.show();
    Charts[i].chart.showLoading({
      text: words,
      effect: 'whirling'
    });
  }
};
ChartsFn.loadingOne = function(name, words) {
  Charts[name].ele.show();
  Charts[name].chart.showLoading({
    text: words,
    effect: 'whirling'
  });
};
ChartsFn.hide = function() {
  for (var i in Charts) {
    Charts[i].ele.hide();
    Charts[i].chart.hideLoading();
    Charts[i].chart.clear();
  }
};
ChartsFn.showOne = function(name, option) {
  Charts[name].chart.hideLoading();
  Charts[name].ele.show();
  Charts[name].chart.setOption(option);
};
window.init = function(infoClear, intervalClear) {
  if (infoClear) {
    $('#part-info').html('');
  }
  ChartsFn.hide();
  if (intervalClear) {
    clearInterval(interval);
  }
};
window.defaultCallBack = function() {
  $('input').keydown(function(e) {
    if (e && e.keyCode == 13) {
      $('.submit').trigger('click');
    }
  });
};
window.initDateTimePicker = function() {
  $('.datetimepicker').datetimepicker({
    maxDate: new Date()
  });
  $.ajax({
    url: api + '/earlyesttime',
    success: function(data) {
      if (data) {
        $('.datetimepicker').datetimepicker({
          minDate: new Date(data.earlyest_active_time),
        });
      }
    }
  });
};
window.Config = {
  pageRange: 15
};

window.Tool = {
  getFillArray: function(value, index, len) {
    var array = [];
    for (var i = 0; i < len; i++) {
      if (i == index) {
        array.push(value);
      } else {
        array.push('-');
      }
    }
    return array;
  },
  getKeyArray: function(list) {
    var array = [];
    for (var i in list) {
      array.push(i);
    }
    return array;
  },
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
    var yesterday = new Date(date.getTime() - 1000 * 60 * 60 * 24);
    var yy = yesterday.getFullYear();
    var mm = this.formatTime(yesterday.getMonth() + 1);
    var dd = this.formatTime(yesterday.getDate());
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