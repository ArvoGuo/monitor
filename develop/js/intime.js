var intime = new Chart({
  title: {},
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['Client', 'Keeper', 'Restaurant']
  },
  xAxis: [{
    type: 'category',
    data: []
  }],
  yAxis: [{
    type: 'value'
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
  }]
});

(function(intime) {
  intime.paintByTime = function(url) {
    var self = this;
    window.init(false, false);
    Charts['chart-main'].ele.show();
    Charts['chart-main'].chart.showLoading({
      text: '正在查询..', //loading话术
    });
    $.ajax({
      url: url,
      success: function(data) {
        var list = data.activity_stats;
        if (list.length < 1) {
          Charts['chart-main'].ele.show();
          Charts['chart-main'].chart.showLoading({
            text: '对不起，查询数据为空！', //loading话术
          });
          return;
        }
        self.option.xAxis[0].data = [];
        self.option.series[0].data = [];
        self.option.series[1].data = [];
        self.option.series[2].data = [];
        (function(list) {
          list.map(function(item, index) {
            self.option.xAxis[0].data.push(item.time);
            self.option.series[0].data.push(item.client);
            self.option.series[1].data.push(item.keeper);
            self.option.series[2].data.push(item.rst);
          });

          if( navStatus == 'main'){
            Charts['chart-main'].chart.hideLoading();
            Charts['chart-main'].ele.show();
            Charts['chart-main'].chart.setOption(self.option);
          }
        })(list);
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