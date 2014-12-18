var daycount = new Chart({
  title: {
    text: '日统计',
    subtext: '模拟数据'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: []
  },
  xAxis: [],
  yAxis: [{
    name: 'Number',
    type: 'value',
    axisLabel: {
      formatter: '{value}'
    }
  }],
  series: []
});

(function(daycount) {
  daycount.paint = function(url) {
    var self = this;
    self.lodingShow();
    $.ajax({
      url: url,
      success: function(data) {
        if (typeof data === "object" && data.app_os_ratio.length > 0) {
          var list = data.app_os_ratio;
          /*第一个chart 开始*/
          (function(self, list,daycount) {
            var allApps = getAllKind(0, list);
            var allAppVersion = getAllKind(1, list);
            var allSystems = getAllKind(2, list);
            var allSystemVersion = getAllKind(3, list);
            /* 绘制各个版本中 系统的数量*/
            var sortBySystems = []; //sortBySystems[x][y] x:System y:appVersion
            sortBySystems = getSortBySystem(list, allApps, allAppVersion, allSystems);
            daycount.option.xAxis = [];
            daycount.option.series = [];
            daycount.option.legend.data = allSystems;
            daycount.option.xAxis.push({
              name: 'NaposVersion',
              type: 'category',
              data: allAppVersion
            });
            sortBySystems.map(function(item, index) {
              daycount.option.series.push({
                name: allSystems[index],
                type: 'bar',
                itemStyle: {
                  normal: {
                    barBorderRadius: 5,
                    label: {
                      show: true,
                    }
                  },
                  emphasis: {
                    barBorderRadius: 5,
                    label: {
                      show: true,
                    }
                  }
                },
                data: item
              });
            });
            self.lodingHide();
            $('.chart').show();
            self.chart.setOption(self.option);
          })(self, list, daycount);
          /*第一个chart结束*/
          /*第二个chart开始*/
          (function(self,list){
            var mergeList = getMergeList(list);
            var naposVersions = getVersionArray(mergeList,1);
            var systemVersions = getVersionArray(mergeList,2);
            var dataArray = getDataArray(mergeList,naposVersions,systemVersions);
            console.log(systemVersions)
            console.log(dataArray)
          })(self,list);
          /*第二个chart结束*/
        }
      }
    });
  };
  function getDataArray(mergeList,naposVersions,systemVersions){
    var data = [];
    naposVersions.forEach(function(){
      data.push([]);
    });
    data.map(function(item,index){
      systemVersions.map(function(system){
        var Num = function(system,index,mergeList){
          var d = '-';
          for(var i = 0; i < mergeList.length; i++){
            if(mergeList[i][1] == naposVersions[index] && mergeList[i][2] == system){
              d = mergeList[i][3];
            }
          }
          return d;
        }(system,index,mergeList);
        item.push(Num);

      })
    });
    return data;
  }

  function getVersionArray(list,index){
    var array = [];
    list.map(function(item){
      if(array.indexOf(item[index]) < 0){
        array.push(item[index]);
      }
    });
    return array;
  }

  function getMergeList(list){
    var array = [];
    list.map(function(item){
      var temp = [];
      temp.push(item[0]);
      temp.push(item[1]);
      temp.push(item[2] + item[3]);
      temp.push(item[4]);
      array.push(temp);
    });
    return array;
  }

  function sort(list) {
    var napos = {};
    list.map(function(item) {
      if (napos[item[1]] === undefined) {
        napos[item[1]] = {};
        napos[item[1]][item[2]] = {};
      }
      if (napos[item[1]][item[2]] === undefined) {
        napos[item[1]][item[2]] = {};
      }
      napos[item[1]][item[2]][item[3]] = item[4];
    });
    return napos;
  }

  /*获取napos所有版本下各个系统的总和*/
  /*参数为sort后的list*/
  function getNaposVersion(list) {
    for (var i in list) {
      var version = list[i];
      for (var sys in version) {
        version[sys] = function(object) {
          var obj = object;
          var v = 0;
          for (var sversion in obj) {
            v += obj[sversion];
          }
          return v;
        }(version[sys]);
      }
      version.all = function(version) {
        var v = 0;
        for (var sys in version) {
          v += version[sys];
        }
        return v;
      }(version);
    }
    return list;
  }

  function getAllKindSys(list) {
    var systems = [];
    for (var i in list) {
      var version = list[i];
      for (var j in version) {
        if (j != 'all' && systems.indexOf(j) < 0) {
          systems.push(j);
        }
      }
    }
    return systems;
  }

  function getAllKind(index, list) {
    var array = [];
    list.map(function(item) {
      var value = item[index];
      if (array.indexOf(value) < 0) {
        array.push(value);
      }
    });
    return array;
  }

  function getAllKindVersion(list, systems, type) {
    var array = [];
    for (var i = 0; i < systems.length; i++) {
      array.push([]);
    }
    list.map(function(item) {
      var system = type == 1 ? item[0] : item[2];
      var version = type == 1 ? item[1] : item[3];
      for (var i = 0; i < systems.length; i++) {
        if (system == systems[i] && array[i].indexOf(version) < 0) {
          array[i].push(version);
        }
      }
    });
    return array;
  }

  function queryByAppVersion(list, app, appVersion, systems, systemVersions) {
    var systemsValue = [];
    var i, j;
    var sumSystemBySystemVersion = function(list, app, appVersion, systemVersion) {
      var sum = 0;
      list.map(function(item) {
        if (item[0] == app && item[1] == appVersion && item[3] == systemVersion) {
          sum += item[4];
        }
      });
      return sum;
    }
    for (i = 0; i < systems.length; i++) {
      systemsValue[i] = 0;
    }
    for (i = 0; i < systemVersions.length; i++) {
      for (j = 0; j < systemVersions[i].length; j++) {
        systemsValue[i] += sumSystemBySystemVersion(list, app, appVersion, systemVersions[i][j]);
      }
    }
    return systemsValue;
  }

  function queryAppAppversionSystem(data, app, appversion, system) {
    var sum = 0;
    data.map(function(item) {
      if (app == item[0] && appversion == item[1] && system == item[2]) {
        sum += item[4];
      }
    });
    return sum;
  }

  function query(data, app, appversion, system, systemversion) {
    var sum = 0;
    data.map(function(item) {
      var j1 = app == 'all' ? true : (app == item[0]);
      var j2 = appversion == 'all' ? true : (appversion == item[1]);
      var j3 = system == 'all' ? true : (system == item[2]);
      var j4 = systemversion == 'all' ? true : (systemversion == item[3]);
      if (j1 && j2 && j3 && j4) {
        sum += item[4];
      }
    });
    return sum;
  }

  function getSortBySystem(list, allApps, allAppVersion, allSystems) {
    var sortBySystems = [];
    allSystems.map(function(item) {
      sortBySystems.push([]);
    });
    allSystems.map(function(itemSystem, index) {
      allAppVersion.map(function(itemAppVersion) {
        var n = query(list, allApps[0], itemAppVersion, itemSystem, 'all');
        sortBySystems[index].push(n);
      });
    });
    return sortBySystems;
  };

})(daycount);