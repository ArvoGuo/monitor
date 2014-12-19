$(document).ready(function(){
  var chartsNames = ['chart-main','chart-amass','chart-percent-napos','chart-percent-os'];
  window.Charts = {};
  chartsNames.forEach(function(name){
    var ele = $('<div class="chart"></div>');
    ele.appendTo($('#chart'));
    Charts[name] = {
      ele: ele,
      chart: echarts.init(ele[0])
    };
  });
  window.interval = 0;
  window.init = function() {
    $('#part-info').html('');
    for(var i in Charts){
      Charts[i].ele.hide();
      Charts[i].chart.clear();
    }
    clearInterval(interval);
  };
});