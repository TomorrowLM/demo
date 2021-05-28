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
  document.getElementsByClassName(".select_label").onclick = function(){
    console.log(1)
}
$(function() {
    console.log($(".select_label")[0])

    $(".select_label").on('click',function(e) {
      e.stopPropagation();
    console.log($(this))
    $(this).siblings(".select-list").slideToggle(300);
    })
    $(".bg1").click(function(e) {
      e.stopPropagation();
    //   $(".mod-select ul").slideToggle(300);
    $(this).siblings(".select-list").slideToggle(300);
    })
    $(".select-list").click(function(e) {
      var target=$(e.target);
      var selectText=target.text()
      $(this).siblings(".select_label").text(selectText)
    $(this).slideUp();(300);
    })
})

