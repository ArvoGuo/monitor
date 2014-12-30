(function(vhis) {
  vhis.grid = {
    x2: 120,
  };
  vhis.paint = function(url) {
    var self = this;
    ChartsFn.loadingOne('chart-versionhis-napos-in-os', words.query);
    ChartsFn.loadingOne('chart-versionhis-os-in-napos', words.query);
    window.init(false, true);
    $.ajax({
      url: url,
      success: function(data) {
        var os = Object.keys(data)[0];
        data = data[os];
        self.os = os;
        if (data.napos_version_list < 0 ){
          ChartsFn.loadingOne('chart-versionhis-napos-in-os', words.empty);
          ChartsFn.loadingOne('chart-versionhis-os-in-napos', words.empty);
          return;
        }
        /* verhis: napos in os*/
        (function(data, self) {
          var naposVerList = data.napos_version_list;
          var pointList = data.napos_in_day;
          var xAxisData = Tool.getKeyArray(pointList);
          var option = {
            title: {
              text: 'Analysis of napos version in ' + self.os,
              x: 'center',
              y: 'top'
            },
            tooltip: {
              trigger: 'axis'
            },
            dataZoom : {
              show : true,
              realtime : true,
              start : 0,
              end : 100
            },
            legend: {
              orient: 'vertical',
              x: 'right',
              y: 'top',
              data: naposVerList
            },
            grid: self.grid,
            xAxis: [{
              type: 'category',
              boundaryGap: false,
              data: xAxisData
            }],
            yAxis: [{
              type: 'value',
            }],
            series: []
          };
          var seriesArray = getSeriesArray(pointList, naposVerList, xAxisData);
          naposVerList.map(function(item, index) {
            option.series.push({
              name: item,
              type: 'line',
              data: seriesArray[index]
            });
          });
          ChartsFn.showOne('chart-versionhis-napos-in-os', option);
        })(data, self);

        /* verhis: os in napos*/
        (function(data, self) {
          var legendData = data.system_version_list;
          var pointList = data.system_in_day;
          var xAxisData = Tool.getKeyArray(pointList);
          var option = {
            title: {
              text: 'Analysis of ' + self.os + ' version in napos',
              x: 'center',
              y: 'top'
            },
            tooltip: {
              trigger: 'axis'
            },
            dataZoom : {
              show : true,
              realtime : true,
              start : 0,
              end : 100
            },
            legend: {
              orient: 'vertical',
              x: 'right',
              y: 'top',
              data: legendData
            },
            grid: self.grid,
            xAxis: [{
              type: 'category',
              boundaryGap: false,
              data: xAxisData
            }],
            yAxis: [{
              type: 'value',
            }],
            series: []
          };
          var seriesArray = getSeriesArray(pointList, legendData, xAxisData);
          legendData.map(function(item, index) {
            option.series.push({
              name: item,
              type: 'line',
              data: seriesArray[index]
            });
          });
          ChartsFn.showOne('chart-versionhis-os-in-napos', option);

        })(data, self);
      }
    });



    function getSeriesArray(list, legendList, xAxisData) {
      var array = [];

      legendList.map(function(item) {
        var arrayItem = [];
        xAxisData.map(function(itemX) {
          if (list[itemX].hasOwnProperty(item)) {
            arrayItem.push(list[itemX][item]);
          } else {
            arrayItem.push('-');
          }
        });
        array.push(arrayItem);
      });
      return array;
    }



  };
})(Module['versionhis']);