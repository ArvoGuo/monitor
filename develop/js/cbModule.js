/*
  * 载入右侧后执行的
  */
  var navCb = function() {
    $('.action').on('click', function() {
      var url = $(this).attr('act');
      var kind = $(this).attr('kind');
      init();
      switch (kind) {
        case "intime":
          intime.paint(url);
          interval = setInterval(function() {
            intime.paint(url);
          }, 60000);
          break;
        case "daycount":
          $('#part-info').load('./include/daycount.html',daycountCb);
          break;
        case "search":
          $('#part-info').load('./include/search.html', searchCb);
          break;
        case "clientinfo":
          $('#part-info').load('./include/clientinfo.html', clientinfoCb);
          break;
        default:
          break;
      }
    });
    $('.action').eq(0).trigger('click');
  };
  var clientinfoCb = function(){
    $('.clientinfo-submit').on('click',function(){
      var url = '/clientinfo';
    });
  };
  /*
  * 日统计模块
  */
  var daycountCb = function(){
    $('.daycount-submit').on('click',function(){
      var url = '/apposratio';
      var value = $('.daycount-date').val();
      if(value){
        url += '?stats_day=' + value;
      }
      daycount.paint(url);
    });
  };
  /*
  * 查询模块
  */
  var searchCb = function() {
    $('#part-info input[name=search-kind]').on('click', function() {
      var value = $('#part-info input[name=search-kind]:checked').val();
      $('.radio-value').text(value);
    });
    $('.search-submit').on('click', function() {
      var kind = $('.radio-value').text();
      var model = $('input[name=model]').val();
      var startTime = $('input[name=time-begin]').val();
      var endTime = $('input[name=time-end]').val();
      var url = getUrl(kind, model, startTime, endTime);
      $.ajax({
        url: url,
        success: function(data) {
          var list = data[Object.keys(data)[0]];
          var template = $('#result-template').html();
          var html = '';
          $('.result tbody').html('');
          list.map(function(item) {
            item[4] = formatDate(item[4]);
            item[5] = formatDate(item[5]);
            html += substituteArray(template, item);
          });
          $('.result tbody').append(html);
        }
      });

    });

    function formatDate(value) {
      var date = new Date(value);
      var yy = date.getFullYear();
      var mm = date.getMonth();
      var dd = date.getDay();
      var h = formatTime(date.getHours());
      var m = formatTime(date.getMinutes());
      var s = formatTime(date.getSeconds());
      return yy + '/' + mm + '/' + dd + ' ' + h + ':' + m + ':' + s;
    }

    function formatTime(time) {
      return time < 10 ? '0' + time : time;
    }

    function substituteArray(str, array) {
      return str.replace(/\{(.+?)\}/g, function($0, $1) {
        return array[$1];
      });
    }

    function substitute(str, sub) {
      return str.replace(/\{(.+?)\}/g, function($0, $1) {
        return $1 in sub ? sub[$1] : $0;
      });
    }

    function getUrl(value, model, start, end) {
      var url = {
        'client': '/userrstforclient?client=',
        'user': '/clientrstforuser?user=',
        'restaurant': '/clientuserforrst?rst='
      };
      var s = '',
        e = '';
      if (start) {
        s = '&period_from=' + start;
      }
      if (end) {
        e = '&period_to=' + end;
      }
      return url[value] + model + s + e;
    }
  };
