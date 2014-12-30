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
  /* v0.1*/
  daycount.paint = function(url) {
    var self = this;
    window.init(false, true);
    $.ajax({
      url: url,
      success: function(data) {
        if (typeof data === "object" && data.app_os_ratio.length > 0) {
          var list = data.app_os_ratio;

          /*第一个chart 开始*/
          (function(self, list, daycount) {
            var allApps = getAllKind(0, list);
            var allAppVersion = getAllKind(1, list);
            var allSystems = getAllKind(2, list);
            var allSystemVersion = getAllKind(3, list);
            /* 绘制各个版本中 系统的数量*/
            var sortBySystems = []; //sortBySystems[x][y] x:System y:appVersion
            sortBySystems = getSortBySystem(list, allApps, allAppVersion, allSystems);
            var option = {
              title: {
                text: 'Analysis of napos',
                x: 'center',
                y: 'top'
              },
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                orient: 'vertical',
                x: 'right',
                y: 'top',
                data: allSystems
              },
              grid: self.grid,
              xAxis: [],
              yAxis: [{
                type: 'value',
                axisLabel: {
                  formatter: '{value}'
                }
              }],
              series: []
            };
            option.xAxis.push({
              name: 'NaposVersion',
              type: 'category',
              data: allAppVersion
            });
            sortBySystems.map(function(item, index) {
              option.series.push({
                name: allSystems[index],
                type: 'bar',
                stack: 'OS',
                itemStyle: self.itemStyle,
                data: item
              });
            });
            Charts['chart-main'].ele.show();
            Charts['chart-main'].chart.setOption(option);
          })(self, list, daycount);
          /*第一个chart结束*/

          /*chartAmass开始*/
          (function(self, list) {
            var mergeList = getMergeList(list);
            var naposVersions = getVersionArray(mergeList, 1);
            var naposVersionsName = getPreAddString('NAPOS/', naposVersions);
            var systemVersions = getVersionArray(mergeList, 2);
            var dataArray = getDataArray(mergeList, naposVersions, systemVersions);
            /*add to self*/
            self.mergeList = mergeList;
            self.naposVersions = naposVersions;
            self.systemVersions = systemVersions;
            self.dataArray = dataArray;
            self.naposVersionsName = naposVersionsName;
            /*--*/
            var optionAmass = {
              title: {
                text: 'Analysis of os',
                x: 'center',
                y: 'top'
              },
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                orient: 'vertical',
                x: 'right',
                y: 'top',
                data: naposVersionsName
              },
              grid: self.grid,
              series: [],
              xAxis: {
                name: 'SystemVersion',
                type: 'category',
                axisLabel: {
                  interval: 0
                },
                show: true,
                data: systemVersions
              },
              yAxis: [{
                type: 'value',
              }]
            };
            for (var i = 0; i < naposVersions.length; i++) {
              optionAmass.series.push({
                name: naposVersionsName[i],
                type: 'bar',
                stack: 'Napos',
                data: dataArray[i],
                itemStyle: self.itemStyle
              });
            }
            Charts['chart-amass'].ele.show();
            Charts['chart-amass'].chart.setOption(optionAmass);
          })(self, list);
          /*chartAmass结束*/


          /*chart-percent-napos开始*/
          (function(self, list) {
            var mergeList = self.mergeList;
            var naposVersions = self.naposVersions;
            var naposVersionsName = self.naposVersionsName;
            var naposPercent = getPercentArray(mergeList, naposVersions, 1);
            var itemStyle = {
              normal: {
                label: {
                  formatter: function(a, b, c, d) {
                    return b + ' - ' + (d - 0).toFixed(0) + '%';
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
            var option = {
              title: {
                text: 'Analysis of napos',
                x: 'center',
                y: 'top'
              },
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                orient: 'vertical',
                x: 'right',
                y: 'top',
                data: naposVersionsName
              },
              calculable: true,
              series: [{
                name: 'NAPOS版本',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                itemStyle: itemStyle,
                roseType: 'area',
                data: naposPercent
              }]
            };
            Charts['chart-percent-napos'].ele.show();
            Charts['chart-percent-napos'].chart.setOption(option);
          })(self, list);
          /*chart-percent-napos结束*/

          /*chart-percent-os开始*/
          (function(self, list) {
            var mergeList = self.mergeList;
            var systemVersions = self.systemVersions;
            var osPercent = getPercentArray(mergeList, systemVersions, 2);
            var itemStyle = {
              normal: {
                label: {
                  formatter: function(a, b, c, d) {
                    return b + ' - ' + (d - 0).toFixed(0) + '%';
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
            var option = {
              title: {
                text: 'Analysis of os',
                x: 'center',
                y: 'top'
              },
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                orient: 'vertical',
                x: 'right',
                y: 'top',
                data: systemVersions
              },
              calculable: true,
              series: [{
                name: 'OS版本',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                itemStyle: itemStyle,
                roseType: 'area',
                data: osPercent
              }]
            };
            Charts['chart-percent-os'].ele.show();
            Charts['chart-percent-os'].chart.setOption(option);
          })(self, list);
          /*chart-percent-os结束*/
        }
      }
    });
  };
  /* v0.2*/
  daycount.paintBySystem = function(url) {
    var self = this;
    window.init(false, true);
    window.ChartsFn.loading(words.query);
    $.ajax({
      url: url,
      success: function(data) {
        var os = Object.keys(data)[0];
        if (data[os].napos_version.length < 1) {
          window.ChartsFn.loading(words.empty);
          return;
        }
        var appName = 'NAPOS';
        var naposVers = data[os].napos_version;
        var naposVersNum = data[os].napos_version_num;
        var systemVers = data[os].system_version;
        var systemVersNum = data[os].system_version_num;
        var sysVerInNapVer = data[os].system_version_in_napos_version;
        var napVerInSysVer = data[os].napos_version_in_system_version;

        var systemNameVers = systemVers.map(function(item) {
          return os.toUpperCase() + item;
        });
        var naposNameVers = naposVers.map(function(item) {
          return appName + item;
        });
        /*start:napos in os*/
        (function(os, systemVers, naposVers, sysVerInNapVer, napVerInSysVer, systemNameVers, naposNameVers) {
          var option = {
            title: {
              text: '',
              x: 'center',
              y: 'top'
            },
            tooltip: {
              trigger: 'axis'
            },
            grid: {
              x2: '40%'
            },
            legend: {
              orient: 'vertival',
              x: '62%',
              itemWidth: 20,
              formatter: function(name) {
                var len = name.length;
                var max = 12;
                if (len > max) {
                  return name.substring(0, max) + '..';
                }
                return name;
              },
              data: systemNameVers
            },
            xAxis: [{
              type: 'category',
              data: naposNameVers
            }],
            yAxis: [{
              type: 'value',
              axisLabel: {
                formatter: '{value}'
              }
            }],
            series: []
          };
          napVerInSysVer.map(function(item, index) {
            option.series.push({
              name: systemNameVers[index],
              type: 'bar',
              stack: 'OS',
              data: item
            });
          });
          Charts['chart-os-napos'].chart.hideLoading();
          Charts['chart-os-napos'].ele.show();
          Charts['chart-os-napos'].chart.setOption(option);
        })(os, systemVers, naposVers, sysVerInNapVer, napVerInSysVer, systemNameVers, naposNameVers);
        /*end:napos in os*/
        /*start:os in napos*/
        (function(os, systemVers, naposVers, sysVerInNapVer, napVerInSysVer, naposNameVers, systemNameVers) {
          var option = {
            title: {
              text: '',
              x: 'center',
              y: 'top'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              orient: 'vertival',
              x: 'right',
              y: 'top',
              data: naposNameVers
            },
            xAxis: [{
              type: 'category',
              data: systemNameVers
            }],
            yAxis: [{
              type: 'value',
              axisLabel: {
                formatter: '{value}'
              }
            }],
            series: []
          };
          sysVerInNapVer.map(function(item, index) {
            option.series.push({
              name: naposNameVers[index],
              type: 'bar',
              stack: 'OS',
              data: item
            });
          });
          Charts['chart-napos-os'].chart.hideLoading();
          Charts['chart-napos-os'].ele.show();
          Charts['chart-napos-os'].chart.setOption(option);
        })(os, systemVers, naposVers, sysVerInNapVer, napVerInSysVer, naposNameVers, systemNameVers);
        /*end:os in napos*/
        /*start: percent in napos */
        (function(os, systemVers, naposVers, sysVerInNapVer, napVerInSysVer, naposVersNum, systemVersNum, naposNameVers) {
          var naposPercent = function(naposVersNum, naposVers) {
            var array = [];
            naposVers.map(function(item, index) {
              array.push({
                name: appName + item,
                value: naposVersNum[index]
              });
            });
            return array;
          }(naposVersNum, naposVers);
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
              data: naposNameVers
            },
            calculable: true,
            series: [{
              name: 'NAPOS版本',
              type: 'pie',
              radius: '55%',
              center: ['40%', '60%'],
              itemStyle: self.pieItemStyle,
              roseType: 'area',
              data: naposPercent
            }]
          };

          Charts['chart-percent-napos'].chart.hideLoading();
          Charts['chart-percent-napos'].ele.show();
          Charts['chart-percent-napos'].chart.setOption(option);
        })(os, systemVers, naposVers, sysVerInNapVer, napVerInSysVer, naposVersNum, systemVersNum, naposNameVers);
        /*end: percent in napos */
        /*start: percent in os */
        (function(os, systemVers, naposVers, sysVerInNapVer, napVerInSysVer, naposVersNum, systemVersNum, systemNameVers) {
          var systemPercent = function(systemVersNum, systemVers) {
            var array = [];
            systemVers.map(function(item, index) {
              array.push({
                name: os.toUpperCase() + item,
                value: systemVersNum[index]
              });
            });
            return array;
          }(systemVersNum, systemVers);
          var option = {
            title: {
              text: 'Analysis of os',
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
              data: systemNameVers,
              formatter: function(name) {
                var len = name.length;
                var max = 12;
                if (len > max) {
                  return name.substring(0, max) + '..';
                }
                return name;
              }
            },
            calculable: true,
            series: [{
              name: 'NAPOS版本',
              type: 'pie',
              radius: '50%',
              center: ['40%', '60%'],
              itemStyle: self.pieItemStyle,
              data: systemPercent
            }]
          };
          Charts['chart-percent-os'].chart.hideLoading();
          Charts['chart-percent-os'].ele.show();
          Charts['chart-percent-os'].chart.setOption(option);
        })(os, systemVers, naposVers, sysVerInNapVer, napVerInSysVer, naposVersNum, systemVersNum, systemNameVers);
        /*end: percent in os */


      }
    });
  };
  /* v0.3*/
  daycount.paintTop = function(url) {
    var self = this;
    window.init(false, true);
    window.ChartsFn.loading(words.query);
    $.ajax({
      url: url,
      success: function(data) {
        var os = Object.keys(data)[0];
        data = data[os];
        var naposVersionList = data.napos_version_list;
        var systemVersionList = data.system_version_list;
        var naposInSystem = data.napos_version_in_system_version;
        var systemInNapos = data.system_version_in_napos_version;
        var naposVerNum = data.napos_version_num;
        var systemVerNum = data.system_version_num;
        if (naposVersionList.length < 1) {
          ChartsFn.loading(words.empty);
          return;
        }
        /* os in napos*/
        (function(systemVersionList, systemInNapos, self) {
          var xAxisData = getKeyArray(systemInNapos);
          var option = {
            title: {
              text: 'Analysis of os version in napos',
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
        })(systemVersionList, systemInNapos, self);

        /* napos in os*/
        (function(naposVersionList, naposInSystem, self) {
          var xAxisData = getKeyArray(naposInSystem);
          var option = {
            title: {
              text: 'Analysis of napos version in os',
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
              data: xAxisData
            }],
            yAxis: [{
              type: 'value'
            }],
            series: []
          };
          var len = xAxisData.length;
          xAxisData.map(function(item, index) {
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
        })(naposVersionList, naposInSystem, self);

        /* percent napos*/
        (function(naposVerNum, self) {
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
              data: legendData
            },
            calculable: true,
            series: [{
              name: 'NAPOS版本',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              itemStyle: self.pieItemStyle,
              roseType: 'radius',
              data: naposPercent
            }]
          };
          ChartsFn.showOne('chart-percent-napos', option);
        })(naposVerNum, self);

        /* percent os*/
        (function(systemVerNum, self) {
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
              text: 'Analysis of os',
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
              data: legendData
            },
            calculable: true,
            series: [{
              name: 'OS版本',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              itemStyle: self.pieItemStyle,
              roseType: 'radius',
              data: systemPercent
            }]
          };
          ChartsFn.showOne('chart-percent-os', option);
        })(systemVerNum, self);


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