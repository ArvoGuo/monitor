(function(daycount) {
  /* set property*/
  daycount.itemStyle = {
    normal: {
      barBorderRadius: 5,
    },
    emphasis: {
      barBorderRadius: 5,
    }
  };
  daycount.barLegendFormat = function(name) {
    var len = name.length;
    var max = 12;
    if (len > max) {
      return name.substring(0, max) + '..';
    }
    return name;
  };
  daycount.barTipStyle = function(params, ticket, cb) {
    var s = '';
    for (var i = 0; i < params.length; i++) {
      if (params[i].data == '-') {
        continue;
      }
      s += params[i].seriesName + ' : ' + params[i].data + '</br>';
    }
    return s;
  };

  daycount.pieItemStyle = {
    normal: {
      label: {
        formatter: function(a, b, c, d) {
          return b + ' - ' + (d - 0).toFixed(2) + '%';
        }
      }
    },
    emphasis: {
      label: {
        show: true,
        position: 'inner',
        formatter: "{b}\n{d}%"
      }
    }
  };
  daycount.grid = {
    x2: 115,
    y2: 115
  };

  /* v0.3*/
  daycount.paintTop = function(url,pathname) {
    var self = this;
    window.init(false, true);
    ChartsFn.loadingOne('chart-percent-napos',words.query);
    ChartsFn.loadingOne('chart-percent-os',words.query);
    ChartsFn.loadingOne('chart-os-napos',words.query);
    ChartsFn.loadingOne('chart-napos-os',words.query);
    $.ajax({
      url: url,
      success: function(data) {
        if (Hash.getPathName() != pathname){
          return;
        }
        var os = Object.keys(data)[0];
        data = data[os];
        self.os = os;
        var naposVersionList = data.napos_version_list;
        var systemVersionList = data.system_version_list;
        var naposInSystem = data.napos_version_in_system_version;
        var systemInNapos = data.system_version_in_napos_version;
        var naposVerNum = data.napos_version_num;
        var systemVerNum = data.system_version_num;
        if (naposVersionList.length < 1) {
          ChartsFn.loadingOne('chart-percent-napos',words.empty);
          ChartsFn.loadingOne('chart-percent-os',words.empty);
          ChartsFn.loadingOne('chart-os-napos',words.empty);
          ChartsFn.loadingOne('chart-napos-os',words.empty);
          return;
        }
        /* os in napos*/
        (function(systemVersionList, systemInNapos, self,naposVersionList) {
          var xAxisData = naposVersionList;
          var option = {
            title: {
              text: 'Analysis of '+ self.os +' version in napos',
              x: 'center',
              y: 'top'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              },
              formatter: self.barTipStyle
            },
            legend: {
              orient: 'vertical',
              x: 'right',
              y: 'top',
              fromatter: self.barLegendFormat,
              data: systemVersionList
            },
            grid: self.grid,
            xAxis: [{
              type: 'category',
              data: xAxisData
            }],
            yAxis: [{
              type: 'value'
            }],
            series: []
          };
          var len = xAxisData.length;
          xAxisData.map(function(item, index) {
            var systemver = getKeyArray(systemInNapos[item]);
            systemver.map(function(itemsystemver) {
              option.series.push({
                name: itemsystemver,
                type: 'bar',
                stack: 'os',
                data: getFillArray(systemInNapos[item][itemsystemver], index, len)
              });
            });
          });
          ChartsFn.showOne('chart-os-napos', option);
        })(systemVersionList, systemInNapos, self,naposVersionList);

        /* napos in os*/
        (function(naposVersionList, naposInSystem, self,systemVersionList) {
          var xAxisData = getKeyArray(naposInSystem);
          var option = {
            title: {
              text: 'Analysis of napos version in ' + self.os,
              x: 'center',
              y: 'top'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              },
              formatter: self.barTipStyle
            },
            legend: {
              orient: 'vertical',
              x: 'right',
              y: 'top',
              formatter: self.barLegendFormat,
              data: naposVersionList
            },
            grid: self.grid,
            xAxis: [{
              type: 'category',
              axisLabel: {
                rotate: 45
              },
              data: systemVersionList
            }],
            yAxis: [{
              type: 'value'
            }],
            series: []
          };
          var len = systemVersionList.length;
          systemVersionList.map(function(item, index) {
            var naposver = getKeyArray(naposInSystem[item]);
            naposver.map(function(itemnaposver) {
              option.series.push({
                name: itemnaposver,
                type: 'bar',
                stack: 'os',
                data: getFillArray(naposInSystem[item][itemnaposver], index, len)
              });
            });
          });
          ChartsFn.showOne('chart-napos-os', option);
        })(naposVersionList, naposInSystem, self,systemVersionList);

        /* percent napos*/
        (function(naposVerNum, self,naposVersionList) {
          var naposPercent = function(naposVerNum) {
            var array = [];
            for (var i in naposVerNum) {
              array.push({
                name: i,
                value: naposVerNum[i]
              });
            }
            return array;
          }(naposVerNum);
          var legendData = function(naposVerNum) {
            var array = [];
            for (var i in naposVerNum) {
              array.push(i);
            }
            return array;
          }(naposVerNum);
          var option = {
            title: {
              text: 'Analysis of napos',
              x: 'center',
              y: 'top'
            },
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c}({d}%)"
            },
            legend: {
              orient: 'vertical',
              x: 'right',
              y: 'top',
              data: naposVersionList
            },
            calculable: true,
            series: [{
              name: 'NAPOS版本',
              type: 'pie',
              radius: '55%',
              center: ['50%', '45%'],
              itemStyle: self.pieItemStyle,
              data: naposPercent
            }]
          };
          ChartsFn.showOne('chart-percent-napos', option);
        })(naposVerNum, self,naposVersionList);

        /* percent os*/
        (function(systemVerNum, self,systemVersionList) {
          var systemPercent = function(systemVerNum) {
            var array = [];
            for (var i in systemVerNum) {
              array.push({
                name: i,
                value: systemVerNum[i]
              });
            }
            return array;
          }(systemVerNum);
          var legendData = function(systemVerNum) {
            var array = [];
            for (var i in systemVerNum) {
              array.push(i);
            }
            return array;
          }(systemVerNum);
          var option = {
            title: {
              text: 'Analysis of ' + self.os,
              x: 'center',
              y: 'top'
            },
            tooltip: {
              trigger: 'item',
              formatter: "{a} <br/>{b} : {c}({d}%)"
            },
            legend: {
              orient: 'vertical',
              x: 'right',
              y: 'top',
              data: systemVersionList
            },
            calculable: true,
            series: [{
              name: 'OS版本',
              type: 'pie',
              radius: '55%',
              center: ['50%', '45%'],
              itemStyle: self.pieItemStyle,
              data: systemPercent
            }]
          };
          ChartsFn.showOne('chart-percent-os', option);
        })(systemVerNum, self,systemVersionList);


      }
    });
  };

  function getFillArray(value, index, len) {
    var array = [];
    for (var i = 0; i < len; i++) {
      if (i == index) {
        array.push(value);
      } else {
        array.push('-');
      }
    }
    return array;
  }

  function getKeyArray(list) {
    var array = [];
    for (var i in list) {
      array.push(i);
    }
    return array;
  }

  function getPercentArray(list, percentName, propertyIndex) {
    var array = [];
    percentName.forEach(function() {
      array.push({});
    });
    percentName.forEach(function(item, index) {
      list.forEach(function(listItem) {
        if (listItem[propertyIndex] == item) {
          if (propertyIndex == 1) {
            array[index].name = listItem[0].toUpperCase() + '/' + item;
          }
          if (propertyIndex == 2) {
            array[index].name = item;
          }
          array[index].value = listItem[3];
        }
      });
    });
    return array;
  }

  function getPreAddString(string, preArray) {
    var array = [];
    preArray.forEach(function(item) {
      array.push(string + '' + item);
    });
    return array;
  };

  function getDataArray(mergeList, naposVersions, systemVersions) {
    var data = [];
    naposVersions.forEach(function() {
      data.push([]);
    });
    data.map(function(item, index) {
      systemVersions.map(function(system) {
        var Num = function(system, index, mergeList) {
          // var d = '-';
          var d = 0;
          for (var i = 0; i < mergeList.length; i++) {
            if (mergeList[i][1] == naposVersions[index] && mergeList[i][2] == system) {
              d = mergeList[i][3];
            }
          }
          return d;
        }(system, index, mergeList);
        item.push(Num);

      })
    });
    return data;
  }

  function getVersionArray(list, index) {
    var array = [];
    list.map(function(item) {
      if (array.indexOf(item[index]) < 0) {
        array.push(item[index]);
      }
    });
    return array;
  }

  function getMergeList(list) {
    var array = [];
    list.map(function(item) {
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
  }

})(Module.daycount);