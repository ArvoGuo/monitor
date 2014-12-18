(function($) {
  var Page = function(options) {
    this.init(options);
  };
  var fn = Page.prototype;
  fn.init = function(options) {
    var self = this;
    self.range = options.range || 10;
    self.Ele = options.Ele;
    self.data = options.data;
    self.paintFn = options.paintFn;
    self.paintArea = options.paintArea;
    self.htmlEle = $('<nav><ul class="pagination"></ul></nav>');
    self.paintPage();
  };

  fn.paintPage = function() {
    var self = this;
    var totalPage = self.totalPage();
    if (totalPage < 2){
      self.paintFn(self.data);
      return;
    }
    var pageUl = self.htmlEle.find('.pagination');
    var i;
    pageUl.append(self.getPrevEle());
    for (i = 0; i < totalPage; i++) {
      var pageItem = self.getPageEle(i);
      self.bindAction(pageItem);
      pageUl.append(pageItem);
    }
    var nextEle = self.getNextEle();
    nextEle.trigger('click');
    pageUl.append(nextEle);
    self.Ele.html('').append(self.htmlEle);
  };

  fn.bindAction = function(item){
    var self = this;
    item.on('click',function(){
      var page = this.innerText;
      self.htmlEle.find('li').removeClass('active');
      $(this).addClass('active');
      var correctData = self.getCorrectData(page);
      self.paintFn(correctData);
    });
  };

  fn.getCorrectData = function(pageIndex){
    var self = this;
    var start = (pageIndex - 1) * self.range;
    var end  = pageIndex * self.range;
    var data = [], i;
    for (i = start; i < end; i ++){
      data.push(self.data[i]);
    }
    return data;
  };

  fn.totalPage = function() {
    var self = this;
    var total = Math.ceil(self.data.length / self.range);
    return total;
  };

  fn.getPrevEle = function() {
    var self = this;
    var item = $('<li class="prev"><a href="javascript:void(0);">&laquo;</a></li>');
    item.on('click',function(){
      var pageEle = self.htmlEle.find('.active');
      if(!pageEle.prev().hasClass('prev')){
        pageEle.prev().trigger('click');
      }
    });
    return item;
  };

  fn.getNextEle = function() {
    var self = this;
    var item = $('<li class="next"><a href="javascript:void(0);">&raquo;</a></li>');
    item.on('click',function(){
      var pageEle = self.htmlEle.find('.active');
      if(!pageEle.next().hasClass('next')){
        pageEle.next().trigger('click');
      }
      if(pageEle.length === 0){
        self.htmlEle.find('li').eq(1).trigger('click');
      }
    });
    return item;
  };

  fn.getPageEle = function(index) {
    return $('<li><a href="javascript:void(0);" data="' + index + '">' + (index + 1) + '</a></li>');
  };

  $.Page = function(options) {
    return new Page(options);
  };
})($);