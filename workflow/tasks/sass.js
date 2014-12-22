var sass = require('node-sass');
var config = require('../config.json');
var _sass = function(){
  sass.renderFile({
    file: config.develop.srcSass,
    success: function(){

    },
    outFile: config.develop.distSass
  });
};
module.exports = _sass;