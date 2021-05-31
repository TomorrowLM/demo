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

$(function () {
  console.log($(".select_label")[0]);

  $(".select_label").on("click", function (e) {
    e.stopPropagation();
    console.log($(this));
    $(this).siblings(".select-list").slideToggle(300);
  });
  $(".bg1").click(function (e) {
    e.stopPropagation();
    //   $(".mod-select ul").slideToggle(300);
    $(this).siblings(".select-list").slideToggle(300);
  });
  $(".select-list").click(function (e) {
    var target = $(e.target);
    var selectText = target.text();
    $(this).siblings(".select_label").text(selectText);
    $(this).slideUp();
    300;
  });
});

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

//Tab
$(".show").hide();
$(".footer").hide();
$(".show-1-footer").hide();
$(".tab>div").on("click", "div", function () {
  $(".more").show();
  $(".show").hide();
  $(".show-1-footer").hide();
  $(".footer").hide();
  $(".tab").children().children().children("b").removeClass("bg3");
  $(this).children("b").addClass("bg3");
  var status = $(this).index() + 1;
  console.log(".show-" + status);
  if ($(this).index() == 0) {
    console.log(1);
    $(".more").hide();
    $(".show-1-footer").show();
    $(".footer").show();
  }
  $(".show-" + status).show();
});

//
$(".ui.dropdown").dropdown();

//

$(".show-1").click(function () {
  $(this).children(".question").toggle();
});
