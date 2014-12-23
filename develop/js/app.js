$(document).ready(function() {
    $('#top').load('./include/top.html');
    $('#nav').load('./include/navigate.html', navCb);
});