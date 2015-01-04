(function($) {
  var Hash = function(option) {
    this.hash = '';
    this.status = true;
  };
  var fn = Hash.prototype;

  fn.getHash = function() {
    var self = this;
    self.hash = location.hash;
    var a = document.createElement('a');
    a.href = self.hash.replace('#!','');
    self.hasha = a;
    return self.hash;
  };

  fn.setPathName = function(path) {
    var self = this;
    if (path.substring(0,1) == '/'){
      path = path.substring(1,path.length);
    }
    //self.hash = '!/' + path + (self.getSearch()? self.getSearch() : '');
    self.hash = '!/' + path;
    return self.setLocationHash();

  };

  fn.setLocationHash = function(string) {
    var self = this;
    self.status = false;
    location.hash = self.hash;
    self.status = true;
    return self.hash;
  };

  fn.addLocationHashString = function(string) {
    var self = this;
    self.hash += string;
    return self.setLocationHash();
  };

  fn.setHash = function(path, obj) {
    var self = this;
    var string = '';
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      if (i === 0) {
        string += '?';
      }
      string += keys[i] + '=' + encodeURIComponent(obj[keys[i]]);
      if (i != keys.length - 1) {
        string += '&';
      }
    }
    if (path.substring(0,1) == '/'){
      path = path.substring(1,path.length);
    }
    self.hash = '!/' + path + string;
    return self.setLocationHash();
  };

  fn.setParams = function(obj) {
    var self = this;
    var path = self.getPathName();
    return self.setHash(path,obj);
  };

  fn.checkHash = function() {
    var self = this;
    self.getHash();
    var reg1 = self.hash.match(/\?/g) ? self.hash.match(/\?/g).length : 0;
    var reg2 = self.hash.match(/\#/g) ? self.hash.match(/\#/g).length : 0;
    var reg3 = self.hash.match(/\!/g) ? self.hash.match(/\!/g).length : 0;
    if (reg1 > 1 || reg2 > 1 || reg3 > 1) {
      console.log(reg1,reg2,reg3);
      console.log('hash is illegal');
      return false;
    }
    if (location.pathname != '/'){
      return false;
    }
    return true;
  };

  fn.getPathName = function() {
    var self = this;
    if (!self.checkHash()) {
      return '';
    }
    return self.hasha.pathname;
  };

  fn.getSearch = function(){
    var self = this;
    if (!self.checkHash()) {
      return '';
    }
    return self.hasha.search;
  };


  fn.getParamByName = function(name) {
    var self = this;
    if (!self.checkHash()) {
      return '';
    }
    var result = self.getSearch().match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result === null || result.length < 1) {
      return "";
    }
    return decodeURIComponent(result[1]);
  };

  fn.getParamObj = function(){
    var self = this;
    if (!self.checkHash()) {
      return '';
    }
    if (!self.getSearch()) {
      return {};
    }
    var obj = {};
    var params = self.getSearch().split('?')[1].split('&');
    params.map(function(item){
      var string = item.split('=');
      obj[string[0]] = decodeURIComponent(string[1]);
    });
    return obj;
  };

  fn.addParam = function(obj){
    var self = this;
    if (!self.checkHash()) {
      return '';
    }
    var params = self.getParamObj();
    for (var i in obj){
      params[i] = obj[i];
    }
    self.setParams(params);
  };

  $.Hash = function(option) {
    return new Hash(option);
  };
})($);



