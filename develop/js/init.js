$(document).ready(function(){
  window.myChart = echarts.init(document.getElementById('chart'));
  window.interval = 0;
  window.init = function() {
    myChart.clear();
    $('#part-info').html('');
    clearInterval(interval);
    intime.setChart(myChart);
    daycount.setChart(myChart);
  };
});