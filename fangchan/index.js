$(document).ready(function () {
  new Vue({
    el: "#app",
    data: function () {
      return { visible: false };
    },
  });
  //下拉框
  $(".select-list").on("click", function (e) {
    var target = $(e.target);
    var selectText = $(".select-list li").eq(target.index()).text();
    $(".select_label").text(selectText);
  });
  $(".mod-select").on("click", function (e) {
    e.stopPropagation();
    var selectText = $(".select_label").text();
    $(this).children(".select_label").text(selectText);
    $(this).children(".select-list").slideToggle(300);
  });
  $(window).on("click", function () {
    $(".select-list").slideUp(300);
  });
  //hover
  $(".search-header>input").hover(function () {
    $(".search-content").slideDown(500);
  });
  $(".search-content").on("mouseover", function () {
    $(".search-content").show();
  });
  $(".search-header").on("mouseleave", function () {
    $(".search-content").slideUp(500);
  });
  //share
  $(".guide-ico img:eq(2)").click(function () {
    $(".page").addClass("mark");
    $(".mark-box")
      .show()
      .css({
        left: $(window).width() / 2 - $(".mark-box").width() / 2,
        top: $(window).height() / 2 - $(".mark-box").height() / 2,
      });
  });
  $(".mark-header img").click(function () {
    $(".page").removeClass("mark");
    $(".mark-box").hide();
  });
  //history
  var historyVal = localStorage.getItem("history-input") || "";
  var historyValArr = historyVal.split(",");
  historyValArr.forEach((value) => {
    if (value) {
      $(".history-content").append("<p>" + value + "</p>");
    }
  });
  $(".search-header>a").click(function (e) {
    if ($(".search-header>input").val() == "") {
      return;
    } else {
      $(".history-content").append(
        "<p>" + $(".search-header>input").val() + "</p>"
      );
    }
    localStorage.setItem(
      "history-input",
      historyVal + "," + $(".search-header>input").val()
    );
  });
  $(".delete-history").on("click", function () {
    $(".history-content").empty();
    localStorage.setItem("history-input", "");
  });
  $(".history-content").click(function (event) {
    var $target = $(event.target);
    $(".search-header input").val($target.text());
  });
  //图标固定
  var docClient = 100 * (document.documentElement.clientWidth / 1920);
  $(".guide-ico").css({
    "margin-top":
      (document.getElementsByClassName("guide-nav")[0].offsetTop +
        $(".guide-nav").height() +
        80) /
        docClient +
      "rem",
  });
  var c = 0;
  $(window).scroll(function (e) {
    let a = $(document).scrollTop() - $(".guide-box").offset().top;
    let b = $(".guide-ico").css("margin-top");
    b = b.substr(0, b.length - 2);
    if (a > 0 && a - c > 0 && a < $(".guide-box").height() * 0.8) {
      if (a > b) {
        $(".guide-ico").css({
          top: a - b,
        });
      }
    }
    if (a > 0 && a - c < 0 && a < $(".guide-box").height() * 0.8) {
      if (a > b) {
        $(".guide-ico").css({
          top: a - b,
        });
      }
    }
    c = a;
  });
  $(".to-top").on("click", function () {
    $(".guide-ico").css({
      top: 0,
    });
  });
  $(".header>div:first").mousemove(function(){
    $(".header .menu").css({
      display:"flex"
    })
  })
  $(".header>div:first").mouseleave(function(){
    $(".header .menu").hide()
  })
  $(".main-menu>dl").hover(function () {
    $(".main-menu>dl").removeClass("active-menu");
    $(this).removeClass("dark");
    $(this).addClass("active-menu");
    var index = $(this).index();
    $(".sub-menu .item").hide();
    $(".sub-menu .item").eq(index).show();
  });
  var curl = window.location.href;
  var isfind = false;
  $(".main-nav>ul>li>a").each(function (index, element) {
    if ($(this).attr("href") == curl && isfind == false) {
      $(this).addClass("active-menu");
      isfind = true;
    } else {
      $(this).removeClass("active-menu");
    }
  });
});
