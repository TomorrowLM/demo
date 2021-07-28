(function (doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
    recalc = function () {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      if (1400 < clientWidth) {
        docEl.style.fontSize = 100 * (clientWidth / 1920) + "px";
        // docEl.style.fontSize = "100px";
      } else if (clientWidth <= 1400) {
        // docEl.style.fontSize = 100 * (clientWidth / 1920) + "px";
        docEl.style.fontSize = "100px";
      }
    };

  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener("DOMContentLoaded", recalc, false);
})(document, window);
