
/*
 * 查询模块
 */
var searchCb = function(params) {
  initDateTimePicker();
  $('#part-info input[name=search-kind]').on('click', function() {
    var value = $(this).val();
    $('.radio-value').text(value);
  });
  $('.search-submit').on('click', function(params) {
    var self = this;
    var act = $(self).attr('act');
    var kind = $('.radio-value').text();
    var model = $('input[name=model]').val();
    var startTime = $('input[name=time-begin]').val();
    var endTime = $('input[name=time-end]').val();
    var url = getUrl(kind, model, startTime, endTime);
    $('#napos-query-note').text(words.query);
    $(self).addClass('disabled');
    $.ajax({
      url: api + url,
      success: function(data) {
        $(self).removeClass('disabled');
        var list = data[Object.keys(data)[0]];
        if (list.length < 1) {
          $('#napos-query-note').text(words.empty);
        } else {
          $('#napos-query-note').text('');
        }
        var template = $('#result-template').html();
        /*formateData*/
        list.map(function(item) {
          item.active_from = Tool.formatDate(item.active_from);
          item.active_to = Tool.formatDate(item.active_to);
        });
        var bindTdAct = function() {
          /*on click*/
          $('.td-result').on('click', function() {
            var self = this;
            var act = $(this).attr('act');
            var content = $(this).text();
            $('.query-radio[act=' + act + ']').trigger('click');
            if (content == $('#query-model').val()) {
              return;
            }
            $('#query-model').val(content);
            $('.search-submit').trigger('click');
          });
          // $('.td-result-uuid').on('click', function() {
          //   var content = $(this).text();
          //   $.cookie('td-result-uuid', content, {
          //     expires: 0.1
          //   });
          //   $('.action[kind=clientinfo]').trigger('click');
          // });
        };
        var resultPaint = function(data, Ele) {
          var html = '';
          Ele = Ele || $('.result tbody');
          data.map(function(item) {
            html += Tool.substitute(template, item);
          });
          Ele.html('').append(html);
          bindTdAct();
        };
        /*page*/
        var page = $.Page({
          range: Config.pageRange,
          Ele: $('#page-search'),
          data: list,
          paintFn: resultPaint
        });
      }
    });
    Hash.setParams({
      start: startTime,
      end : endTime,
      model: model,
      kind: kind,
      action: act
    });
  });
  if (params && params.hasOwnProperty('action')){
    $('#part-info input[name=search-kind][act='+ params.kind +']').eq(0).trigger('click');
    $('input[name=time-begin]').val(params.start);
    $('input[name=time-end]').val(params.end);
    $('input[name=model]').val(params.model);
    $('.search-submit[act='+ params.action +']').eq(0).trigger('click');
  }

  function getUrl(value, model, start, end) {
    var url = {
      'Client': '/userrstforclient?client=',
      'User': '/clientrstforuser?user=',
      'Restaurant': '/clientuserforrst?rst='
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
  defaultCallBack();
};