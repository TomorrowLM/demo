/**
 * 禁止浏览器后退
 * @return null
 */
export function banBack() {
  pushHistory();
  window.addEventListener("popstate", function () {
    pushHistory();
  }, false);
  function pushHistory() {
    var state = {
      title: "title",
      url: "#"
    };
    window.history.pushState(state, "title", "#");
  }
}