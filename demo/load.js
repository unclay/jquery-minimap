$(function() {
  // 异步加载脚本，全部加载后完成回调
  function loadScript (files, queueIndex, callback) {
    queueIndex = queueIndex || 0;
    if (files[queueIndex]) {
      var script = document.createElement('script');
      script.src = files[queueIndex];
      document.body.appendChild(script);
      script.onload = function () {
        loadScript(files, queueIndex + 1, callback);
      };
    } else if (callback) {
      callback();
    }
  }

  // custom minimap
  var basename = '/xxx/xxx';
  basename = location.pathname.match(basename) ? '' : basename + '/';
  loadScript([
    basename + 'init.js?' + new Date().getTime()
  ]);
});