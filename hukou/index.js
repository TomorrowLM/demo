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
  // $(".search-header>input").hover(function () {
  //   $(".search-content").slideDown(500);
  // });
  // $(".search-content").on("mouseover", function () {
  //   $(".search-content").show();
  // });
  // $(".search-header").on("mouseleave", function () {
  //   $(".search-content").slideUp(500);
  // });
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
    console.log(1);
    $(".history-content").empty();
    localStorage.setItem("history-input", "");
  });
});
