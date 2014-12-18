$(document).ready(function(){
  var myChart = echarts.init(document.getElementById('chart'));
  var chart2 = echarts.init(document.getElementById('chart2'));
  var charts = [];
  charts.push(myChart);
  charts.push(chart2);
  window.interval = 0;
  window.init = function() {
    $('.chart').hide();
    $('#part-info').html('');
    charts.map(function(item){
      item.clear();
    });
    clearInterval(interval);
    intime.setChart(myChart);
    daycount.setChart(myChart);
    daycount.addOtherChart(chart2);
  };
});