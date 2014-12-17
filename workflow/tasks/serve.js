var browserSync = require('browser-sync');
var config = require('../config.json');
var serve = function(){
  browserSync(config.develop.serveConfig);
};
module.exports = serve;