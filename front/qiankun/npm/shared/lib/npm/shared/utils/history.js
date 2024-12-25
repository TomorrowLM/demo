"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.banBack = void 0;
/**
 * 禁止浏览器后退
 * @return null
 */
function banBack() {
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
exports.banBack = banBack;
