var Chart = function(opt) {
  this.setOption(opt || {});
  this.otherChart = [];
};
var fn = Chart.prototype;
fn.setOption = function(opt) {
  this.option = opt || {};
};
fn.addOtherChart = function(chart){
  this.otherChart.push(chart);
};

fn.setChart = function(chart) {
  this.chart = chart;
};
fn.setProperty = function(name,value){
  this[name] = value;
};

fn.formatDate = function(date) {
  date = new Date(date);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  return this.formatTime(hours) + ':' + this.formatTime(minutes);
};
fn.formatTime = function(time) {
  return time < 10 ? '0' + time : time;
};