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
  localStorage.setItem("history-input", "");
  var historyVal = "买房最新政策,买房最新政策";
  var historyValArr = historyVal.split(",");
  historyValArr.forEach((value) => {
    $(".history-content").append("<p>" + value + "</p>");
  });
  $(".search-header>a").click(function (e) {
    if ($(".search-header>input").val() == "") {
      return;
    } else {
      var old = localStorage.getItem("history-input");
      historyVal = old + "," + $(".search-header>input").val();
      $(".history-content").append(
        "<p>" + $(".search-header>input").val() + "</p>"
      );
    }
    if (historyVal[0] == ",") {
      historyVal = historyVal.substr(1, historyVal.length - 1);
    }
    localStorage.setItem("history-input", historyVal);
  });
  $(".delete-history").on("click", function () {
    $(".history-content").empty();
    localStorage.setItem("history-input", "");
  });
  $(".history-content p").click(function () {
    $(".search-header input").val($(this).text());
  });
  //图标固定
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
  //指南选择
  $(".guide-select").click(function () {
    let index = $(this).index();
    $(".guide-select-index").hide();
    $(".guide-select-" + (index + 1)).show();
  });
});
