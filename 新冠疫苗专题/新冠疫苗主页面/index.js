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
  document.getElementsByClassName(".select_label").onclick = function () {
    console.log(1);
  };
    //下拉框
    $(function() {
        console.log($(".select_label")[0])
    
        $(".select_label").on('click',function(e) {
          e.stopPropagation();
        console.log($(this))
        $(this).siblings(".select-list").slideToggle(300);
        })
        $(".bg1").click(function(e) {
          e.stopPropagation();
        $(this).siblings(".select-list").slideToggle(300);
        })
        $(".select-list").click(function(e) {
          var target=$(e.target);
          var selectText=target.text()
          $(this).siblings(".select_label").text(selectText)
        $(this).slideUp();(300);
        })
    })

    //渐变
    $(function() {
      //绑定鼠标滑动事件
      $(' .slider-panel input').on('mousemove touchmove touchend click', moveSlider)

      function moveSlider() {
        // 获取当前滑条的动态值
        let sliderValue = parseInt($(this).val());
        // 将滑条的值赋值给滑条划过后p标签的宽度
        $('.slider-value').css('width', sliderValue + '%');
        // 显示当前滑条的动态值
        $('.slider-percentage').text(sliderValue);
      }

    })

    
    // 文字滚动
var speed = 40;
// 向上滚动
var demo = document.getElementById("demo");
var demo2 = document.getElementById("demo2");
var demo1 = document.getElementById("demo1");
demo2.innerHTML = demo1.innerHTML;
function Marquee() {
  if (demo.scrollTop >= demo1.offsetHeight) {
    demo.scrollTop = 0;
  } else {
    demo.scrollTop = demo.scrollTop + 1;
  }
}
var MyMar = setInterval(Marquee, speed);
demo.onmouseover = function () {
  clearInterval(MyMar);
};
demo.onmouseout = function () {
  MyMar = setInterval(Marquee, speed);
};