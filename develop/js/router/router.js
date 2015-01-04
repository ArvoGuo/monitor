/*
 * 载入右侧后执行的
 */
function Router (){
  var pathname = Hash.getPathName();
  var param = Hash.getParamObj();
  init(true, true);
  $('.xdsoft_datetimepicker').remove();
  switch (pathname) {
      case "/intime":
        $('#part-info').load('./include/intime.html', function(){
          intimeCb(param,pathname);
        });
        break;
      case "/daycount":
        $('#part-info').load('./include/daycount.html', function(){
          daycountCb(param,pathname);
        });
        break;
      case "/search":
        $('#part-info').load('./include/search.html', function(){
          searchCb(param,pathname);
        });
        break;
      case "/clientinfo":
        $('#part-info').load('./include/clientinfo.html', function(){
          clientinfoCb(param,pathname);
        });
        break;
      case "/rststats":
        $('#part-info').load('./include/rststats.html', function(){
          rststatCb(param,pathname);
        });
        break;
      case "/versionhistory":
        $('#part-info').load('./include/versionhistory.html', function(){
          versionhisCb(param,pathname);
        });
        break;
      default:
        Hash.setPathName('intime');
        pathname = Hash.getPathName();
        $('#part-info').load('./include/intime.html', function(){
          intimeCb(param,pathname);
        });
        break;
    }
}

  /*default by hash*/
  // console.log(Hash.getHash())
  // if (Hash.getPathName() != '/') {
  //   $('.action[kind="' + Hash.getPathName() + '"]').trigger('click',params);
  // }
  // else {
  //   $('.action').eq(0).trigger('click',params);
  // }
