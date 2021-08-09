$(".all-guide .menu").hide();
$(".all-guide").mousemove(function () {
  console.log(1)
  $(".all-guide .menu").css({
    display: "flex",
  });
});
$(".all-guide").mouseleave(function () {
  $(".all-guide .menu").hide();
});
// $(".all-guide .menu").css({
//   display: "flex",
// });
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
