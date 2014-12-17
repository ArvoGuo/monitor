/*
 ** Class: Chart
 *** extend: intime,daycount
 */
$(document).ready(function() {
  'use strict';
  $('#top').load('./include/top.html');
  $('#nav').load('./include/navigate.html', navCb);
});