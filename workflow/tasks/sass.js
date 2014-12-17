var sass = require('node-sass');
var config = require('../config.json');
var _sass = function(){
  sass.renderFile({
    file: config.develop.srcSass,
    success: function(){

    },
    outFile: config.develop.distSass,
    sourceComments: true,
    sourceMap: 'app.css.map'
  });
};
module.exports = _sass;