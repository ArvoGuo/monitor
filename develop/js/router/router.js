/*
 * 载入右侧后执行的
 */
function Router (){
  var pathname = Hash.getPathName();
  var param = Hash.getParamObj();
  switch (pathname) {
      case "/intime":
        $('#part-info').load('./include/intime.html', function(){
          intimeCb(param);
        });
        break;
      case "/daycount":
        $('#part-info').load('./include/daycount.html', daycountCb);
        break;
      case "/search":
        $('#part-info').load('./include/search.html', searchCb);
        break;
      case "/clientinfo":
        $('#part-info').load('./include/clientinfo.html', clientinfoCb);
        break;
      case "/rststats":
        $('#part-info').load('./include/rststats.html', rststatCb);
        break;
      case "/versionhistory":
        $('#part-info').load('./include/versionhistory.html', versionhisCb);
        break;
      default:
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
