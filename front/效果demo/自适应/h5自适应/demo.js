//自适应
(function (doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
    recalc = function () {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      if (clientWidth >= 750) {
        docEl.style.fontSize = 100 * (clientWidth / 750) + "px";
      } else {
        docEl.style.fontSize = 100 * (clientWidth / 750) + "px";
      }
    };

  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener("DOMContentLoaded", recalc, false);
})(document, window);

//博物馆详情下拉
var museum = document.getElementsByClassName("museum")[0];
var targetArea = document.getElementsByClassName("museum-1");
museum.onclick = function (ev) {
  var ev = ev || window.event;
  var target = ev.target || ev.srcElement;
  console.log(target);
  for (i = 0; i < targetArea.length; i++) {
    if (targetArea[i].contains(target)) {
      var showDetail = targetArea[i].getElementsByClassName("show")[0];
      console.log(targetArea[i].getAttribute("status"));
      var status = targetArea[i].getAttribute("status");
      if (status == "false") {
        console.log(1);
        targetArea[i].setAttribute("status", true);
        targetArea[i].style.height = "11.8rem";
        showDetail.style.display = "block";
      } else {
        targetArea[i].setAttribute("status", false);
        targetArea[i].style.height = "0.88rem";
      }
    }
  }
};

//select模拟
$(function () {
  /*
   * 模拟网页中所有的下拉列表select
   */
  
  function selectModel() {
    var $box = $("div.model-select-box");
    var $option = $("ul.model-select-option", $box);
    var $txt = $("div.model-select-text", $box);
    var speed = 10;
    var $bg = $("b.bg1", $box);

    // 点击小三角

    $bg.click(function () {
      $option
        .not($(this).siblings("ul.model-select-option"))
        .slideUp(speed, function () {});
      $(this)
        .siblings("ul.model-select-option")
        .slideToggle(speed, function () {
          // int($(this));
        });
      return false;
    });
    /*
     * 单击某个下拉列表时，显示当前下拉列表的下拉列表框
     * 并隐藏页面中其他下拉列表
     */

    $txt.click(function (e) {
      $option
        .not($(this).siblings("ul.model-select-option"))
        .slideUp(speed, function () {});
      $(this)
        .siblings("ul.model-select-option")
        .slideToggle(speed, function () {
          // int($(this));
        });
      return false;
    });
    //点击选择，关闭其他下拉

    /*
     * 为每个下拉列表框中的选项设置默认选中标识 data-selected
     * 点击下拉列表框中的选项时，将选项的 data-option 属性的属性值赋给下拉列表的 data-value 属性，并改变默认选中标识 data-selected
     * 为选项添加 mouseover 事件
     */

    $option.find("li").each(function (index, element) {
      // console.log($(this) + '1');
      if ($(this).hasClass("selected")) {
        $(this)
          .parent(".model-select-option")
          .siblings(".model-select-text")
          .text($(this).text());
      }

      $(this).mousedown(function () {
        $(this)
          .parent()
          .siblings("div.model-select-text")
          .text($(this).text())
          .attr("value", $(this).attr("data-option"));
        $option.slideUp(speed, function () {});
        $(this).addClass("selected").siblings("li").removeClass("selected");
        return false;
      });

      $(this).on("mouseover", function () {
        $(this).addClass("selected").siblings("li").removeClass("selected");
      });
    });
    //点击文档，隐藏所有下拉

    $(document).click(function (e) {
      $option.slideUp(speed, function () {});
    });
  }

  selectModel();
});
