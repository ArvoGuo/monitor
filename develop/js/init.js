$(document).ready(function(){
  var chartsNames = ['chart-main','chart-os-napos','chart-napos-os','chart-percent-napos','chart-percent-os'];
  window.Charts = {};
  chartsNames.forEach(function(name){
    var ele = $('<div class="chart"></div>');
    ele.appendTo($('#chart'));
    Charts[name] = {
      ele: ele,
      chart: echarts.init(ele[0])
    };
  });
  window.ChartsFn = {};
  window.navStatus = 'main';

  ChartsFn.loading = function(words){
    for (var i in Charts) {
      if (i == 'chart-main'){
        continue;
      }
      Charts[i].ele.show();
      Charts[i].chart.showLoading({
        text: words
      });
    }
  };
  window.interval = 0;
  window.init = function(infoClear,intervalClear) {
    if(infoClear){
      $('#part-info').html('');
    }
    for(var i in Charts){
      Charts[i].ele.hide();
      Charts[i].chart.hideLoading();
      Charts[i].chart.clear();
    }
    if(intervalClear){
      clearInterval(interval);
    }
  };
});