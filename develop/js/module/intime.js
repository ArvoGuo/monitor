(function(intime) {
  intime.option = {
    title: {},
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      orient: 'vertical',
      x: 'right',
      y: 'top',
      data: ['Client', 'Keeper', 'Restaurant']
    },
    grid: {
      y: 20,
      y2: 100,
      x2: 100,
      height: '60%'
    },
    xAxis: [{
      type: 'category',
      data: [],
      axisLabel: {
        interval: 10,
        rotate: 45
      }
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
  };

  intime.paintByTime = function(url,pathname) {
    var self = this;
    window.init(false, false);
    Charts['chart-main'].ele.show();
    Charts['chart-main'].chart.showLoading({
      text: words.query,
      effect: 'whirling'
    });
    $.ajax({
      url: url,
      success: function(data) {
        if (Hash.getPathName()!= pathname ) {
          return;
        }
        var list = data.activity_stats;
        if (list.length < 1) {
          Charts['chart-main'].ele.show();
          Charts['chart-main'].chart.showLoading({
            text: words.empty,
            effect: 'whirling'
          });
          return;
        }
        self.option.xAxis[0].data = [];
        self.option.series[0].data = [];
        self.option.series[1].data = [];
        self.option.series[2].data = [];
        (function(list) {
          list.map(function(item, index) {
            self.option.xAxis[0].data.push(formatDate(item.time));
            self.option.series[0].data.push(item.client);
            self.option.series[1].data.push(item.keeper);
            self.option.series[2].data.push(item.rst);
          });
            Charts['chart-main'].chart.hideLoading();
            Charts['chart-main'].ele.show();
            Charts['chart-main'].chart.setOption(self.option);
        })(list);
      }
    });
  };

  function formatDate(value) {
    var date = new Date(value);
    var yy = date.getFullYear();
    var mm = date.getMonth() + 1;
    var dd = Tool.formatTime(date.getDate());
    var h = Tool.formatTime(date.getHours());
    var m = Tool.formatTime(date.getMinutes());
    var s = Tool.formatTime(date.getSeconds());
    return yy + '-' + mm + '-' + dd + ' ' + h + ':' + m + ':' + s;
  }

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

})(Module.intime);