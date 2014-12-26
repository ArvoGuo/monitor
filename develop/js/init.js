$(document).ready(function() {
  var chartsNames = ['chart-main', 'chart-os-napos', 'chart-napos-os', 'chart-percent-napos', 'chart-percent-os'];
  window.Charts = {};
  chartsNames.forEach(function(name) {
    var ele = $('<div class="chart"></div>');
    ele.appendTo($('#chart'));
    Charts[name] = {
      ele: ele,
      chart: echarts.init(ele[0])
    };
  });
  window.ChartsFn = {};
  window.interval = 0;
  window.navStatus = 'main';
  window.words = {
    query: 'Query..',
    empty: 'Result is empty.'
  };

  ChartsFn.loading = function(words) {
    for (var i in Charts) {
      if (i == 'chart-main') {
        continue;
      }
      Charts[i].ele.show();
      Charts[i].chart.showLoading({
        text: words
      });
    }
  };
  ChartsFn.hide = function() {
    for (var i in Charts) {
      Charts[i].ele.hide();
      Charts[i].chart.hideLoading();
      Charts[i].chart.clear();
    }
  };
  ChartsFn.showOne = function(name,option){
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
  window.initDateTimePicker = function() {
    $.ajax({
      url: api + '/earlyesttime',
      success: function(data) {
        if (data) {
          $('.datetimepicker').datetimepicker({
            minDate: new Date(data.earlyest_active_time)
          });
        }
      }
    });
  };
});