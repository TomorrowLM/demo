(function (doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
    recalc = function () {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      if (1500 < clientWidth && clientWidth <= 1920) {
        docEl.style.fontSize = 100 * (clientWidth / 1920) + "px";
      } else if (clientWidth <= 1500) {
        console.log(clientWidth)
        // docEl.style.fontSize = 100 * (clientWidth / 1920) + "px";
        docEl.style.fontSize = "100px";
      }
    };

  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener("DOMContentLoaded", recalc, false);
})(document, window);
