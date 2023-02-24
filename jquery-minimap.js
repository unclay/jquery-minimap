(function($) {
	$.fn.minimap = function(opts) {
    var instance = {
      $ele: this[0],
      options: {
        background: 'rgba(0, 0, 0, 0.15)',
        height: 128, // >=1高度，<1浏览器窗口高度的百分比
        offsetWidth: 32,
        offsetHeight: 32,
        miniregionBorder: 2,
        miniregionColor: '#269a99',
        // position: 'right bottom', // 当前只支持右下角
        autoHide: 0, // 0不自动隐藏，>0毫秒之后隐藏
        isDrag: true, // 拖动minimap联动浏览器
        isResize: true, // 浏览器缩放重制minimap
      },
      timer: 0,
    };
    var options = instance.options = $.extend(instance.options, opts);
    // 是否出现滚动条
    var isHorizontalScroll = $(window).width() !== $(document).width();
    var isVerticalScroll = $(window).height() !== $(document).height();
    var isScroll = isHorizontalScroll || isVerticalScroll;
    if (!isScroll) return false;
    var $minimap = $('<div class="minimap"></div>');
    var $minimapPosition = $('<div class="minimap-position"></div>');
    var $minimapMiniregion = $('body').clone().addClass('minimap-miniregion');
    // 缩放比例
    var scale = countSize(options.height, $(window).height()) / $(document).height(); // 缩放比例
    // 兼容 axure 布局，本身边界超出问题
    var fixWidthRadio = 1;
    if (isHorizontalScroll) {
      fixWidthRadio = $(window).width() / $('body').width();
    }
    if ($(document).width() * scale <= 20) {
      // 兼容超长页面
      scale = $(window).height() / 2 / $(document).height();
    } else if ($(document).width() * scale > $(window).width()) {
      // 兼容超宽页面
      // scale = $(window).width() / 2 / $(document).width();
    }
    function init() {
      addMiniMapCss();
      addMiniMapScrollEvent();
      $minimap.append($minimapPosition);
      $minimap.append($minimapMiniregion);
      $minimap.appendTo('body');
      updatePosition();
      updateDisplay();
    }
    init();


    /**
     * count size
     */
    function countSize(valueOrRadio, reference) {
      if (valueOrRadio > 1) return valueOrRadio;
      return reference * valueOrRadio;
    }

    /**
     * minimap event: scroll
     */
    function addMiniMapScrollEvent() {
      var isDragLock = false; // 防minimap抖动
      // 监听页面滚动：更新minimap位置
      $(window).scroll(function() {
        updateDisplay();
        // 更新定位
        if (!isDragLock) updatePosition();
      });
      if (options.isDrag) {
        // 监听minimap拖动：更新浏览器滚动位置
        $minimapPosition.draggable({
          drag: function(e, ui) {
            isDragLock = true;
            // Math.max Math.min 处理边界，不能超出窗口
            var left = Math.min(Math.max(0, ui.position.left / scale), $(document).width() - $(this).width());
            var top = Math.min(Math.max(0, ui.position.top / scale), $(document).height() - $(this).height());
            ui.position.left = left;
            ui.position.top = top;
            $(window).scrollLeft(left);
            $(window).scrollTop(top);
          },
          start: function() {
            isDragLock = true;
          },
          stop: function() {
            isDragLock = false;
          },
        });
      }
      if (options.isResize) {
        $(window).on('resize', function() {
          addMiniMapCss();
          updatePosition();
        });
      }
    }

    /**
     * update position
     */
    function updatePosition() {
      var scrollTop = $(document).scrollTop();
      var scrollLeft = $(document).scrollLeft();
      $minimapPosition.css({
        top: scrollTop,
        left: scrollLeft * fixWidthRadio,
      });
    }
    /**
     * update minimap display
     */
    function updateDisplay() {
      if (options.autoHide) {
        // 2秒隐藏
        clearTimeout(instance.timer);
        $minimap.fadeIn();
        instance.timer = setTimeout(function() {
          $minimap.fadeOut();
        }, options.autoHide);
      }
    }

    /**
     * minimap css
     */
    function addMiniMapCss() {
      $minimap.css({
        position: 'fixed',
        top: $(window).height() - $(document).height() * scale - countSize(options.offsetHeight, $(window).height()),
        left: $(window).width() - $(document).width() * scale - countSize(options.offsetWidth, $(window).width()),
        transform: 'scale(' + scale + ')',
        'transform-origin': '0% 0%',
        background: options.background,
        width: $(document).width(),
        height: $(document).height(),
        zIndex: 10000,
      });
      $minimapPosition.css({
        position: 'absolute',
        top: 0,
        left: 0,
        width: $(window).width(),
        height: $(window).height(),
        boxShadow: 'inset 0 0 0 ' + options.miniregionBorder / scale + 'px ' + options.miniregionColor,
        zIndex: 2,
      });
      $minimapMiniregion.css({
        left: 0,
        margin: 0,
        width: $(document).width(),
        zIndex: 1,
      });
    }
		return instance;
	}
})(jQuery);
