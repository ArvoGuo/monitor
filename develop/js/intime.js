var intime = new Chart({
  tooltip: {
    trigger: 'axis'
  },
  legend: { // 图例配置
    padding: 5, // 图例内边距，单位px，默认上下左右内边距为5
    itemGap: 10, // Legend各个item之间的间隔，横向布局时为水平间隔，纵向布局时为纵向间隔
    data: ['Client', 'Keeper', 'Restaurant']
  },
  xAxis: [{
    type: 'category',
    boundaryGap: false,
    data: []
  }],
  yAxis: [{
    type: 'value',
    boundaryGap: [0.1, 0.1]
  }],
  series: [{
    name: 'Client',
    type: 'line',
    data: []
  }, {
    name: 'Keeper',
    type: 'line',
    data: []
  }, {
    name: 'Restaurant',
    type: 'line',
    data: []
  }],
  repair: false
});
(function(intime) {
  intime.reset = function() {
    var self = this;
    self.option.xAxis[0].data = [];
    self.option.series[0].data = [];
    self.option.series[1].data = [];
    self.option.series[2].data = [];
  };
  intime.paint = function(url, date) {
    var self = this;
    $.ajax({
      url: url + '?stats_minute=' + (date || today()),
      success: function(data) {
        if (typeof data === 'object' && data.activity_stats_per_mintue.length > 1) {
          var list = data.activity_stats_per_mintue;
          self.reset();
          list.map(function(item) {
            self.option.xAxis[0].data.push(self.formatDate(item[0]));
            self.option.series[0].data.push(item[1]);
            self.option.series[1].data.push(item[2]);
            self.option.series[2].data.push(item[3]);
          });
          if (self.option.repair) {
            repair(self.option);
          }
          Charts['chart-main'].ele.show();
          Charts['chart-main'].chart.setOption(self.option);
        } else {
          Charts['chart-main'].ele.show();
          Charts['chart-main'].chart.showLoading({
            text: '对不起，查询数据为空！', //loading话术
          });
        }

      }
    });
  };

  function today() {
    var date = new Date();
    var yy = date.getFullYear();
    var mm = date.getMonth() + 1;
    var dd = date.getDate();
    return yy + '-' + mm + '-' + dd + ' 23:59';
  }

  function repair(option) {
    //xAxis
    var lastx = option.xAxis[0].data[option.xAxis[0].data.length - 1];
    var lastH = parseInt(lastx.split(':')[0], 10);
    var lastM = parseInt(lastx.split(':')[1], 10);
    for (var i = lastH; i < 24; i++) {
      for (var j = lastM + 1; j < 60; j++) {
        option.xAxis[0].data.push(intime.formatTime(i) + ':' + intime.formatTime(j));
        lastM = -1;
      }
    }
    console.log(lastH, lastM, option.xAxis[0].data);
  }
})(intime);