
/*
 * 活跃时段 版本变迁
 */
var clientinfoCb = function(params) {
  var self = this;
  initDateTimePicker();
  $('.clientinfo-submit').on('click', function() {
    var act = $(this).attr('act');
    var client = $('.model').val();
    var start = $('.time-start').val();
    var end = $('.time-end').val();
    var s = start ? '&period_from=' + start : '';
    var e = end ? '$period_to=' + end : '';
    var url = '/clientinfo?uuid=' + client + s + e;
    $('.note-client').text(words.query);
    $(self).addClass('disabled');
    $.ajax({
      url: api + url,
      success: function(data) {
        $(self).removeClass('disabled');
        var activityPeriods = data.activity_periods;
        var clientInfos = data.client_infos;
        /*版本迁移*/
        if (!clientInfos || clientInfos.length < 1) {
          $('#note-client-info').text(words.empty);
        } else {
          $('#note-client-info').text('');
          var html = '';
          var templateClient = $('.result-client-info-template').html();
          var clientInfoEle = $('.result-client-info tbody');
          /**formatData*/
          clientInfos.map(function(item) {
            item.active_time = Tool.formatDate(item.active_time);
          });
          var clientInfosPaint = function(data, Ele) {
            data = data || clientInfos;
            Ele = Ele || clientInfoEle;
            var html = '';
            data.map(function(item) {
              html += Tool.substitute(templateClient, item);
            });
            Ele.html('').append(html);
          };
          /*page*/
          var page = $.Page({
            range: Config.pageRange,
            Ele: $('#page-clientinfo'),
            data: clientInfos,
            paintArea: clientInfoEle,
            paintFn: clientInfosPaint
          });
        }
        if (!activityPeriods || activityPeriods.length < 1) {
          $('#note-client-period').text(words.empty);
        } else {
          $('#note-client-period').text('');
          /*活跃时段*/
          var barEle = $('#period-bar');
          var startEle = barEle.find('.tag-start');
          var endEle = barEle.find('.tag-end');
          var periodEle = barEle.find('.period');
          var templatePeroid = $('.result-client-period-template').html();
          startEle.text(Tool.formatDate(activityPeriods[0].active_from));
          endEle.text(Tool.formatDate(activityPeriods[activityPeriods.length - 1].active_to));
          var periodArray = getPeriod(activityPeriods);
          var periodPaint = function(list, ele) {
            var html = '';
            list.map(function(item) {
              html += Tool.substitute(templatePeroid, item);
            });
            ele.html('').append(html);
          };
          periodPaint(periodArray, periodEle);
        }
      }
    });
    Hash.setParams({
      start: start,
      end: end,
      client: client,
      action: act
    });
  });
  if (params && params.hasOwnProperty('action')){
    $('#client-info-client').val(params.client);
    $('.time-start').val(params.start);
    $('.time-end').val(params.end);
    $('.clientinfo-submit[act='+ params.action +']').eq(0).trigger('click');
  } else{
    /*default init*/
    if ($.cookie('td-result-uuid')) {
      $('#client-info-client').val($.cookie('td-result-uuid'));
      $('.clientinfo-submit').trigger('click');
    }
  }


  function getPeriod(list) {
    var array = [];
    var len = list.length;
    var startTime = Tool.toTime(list[0].active_from);
    var endTime = Tool.toTime(list[len - 1].active_to);
    var C = endTime - startTime;
    var percent = function(value) {
      return ((value - startTime) / C * 100).toFixed(2) + '%';
    };
    list.map(function(item, index) {
      var a = percent(Tool.toTime(item.active_from));
      var b = percent(Tool.toTime(item.active_to));
      b = (b.split('%')[0] - a.split('%')[0]) + '%';
      array.push([a, b, Tool.formatDate(item.active_from), Tool.formatDate(item.active_to)]);
    });
    return array;
  }
  defaultCallBack();
};
