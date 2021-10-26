export const loadMonitorJs = () => {
  // 头条对接
  (function(r,d,s,l){var meteor=r.meteor=r.meteor||[];meteor.methods=["track","off","on"];meteor.factory=function(method){return function(){
  var args=Array.prototype.slice.call(arguments);args.unshift(method);meteor.push(args);return meteor}};for(var i=0;i<meteor.methods.length;i++){
  var key=meteor.methods[i];meteor[key]=meteor.factory(key)}meteor.load=function(){var js,fjs=d.getElementsByTagName(s)[0];js=d.createElement(s);
  js.src="https://analytics.snssdk.com/meteor.js/v1/"+l+"/sdk";fjs.parentNode.insertBefore(js,fjs)};meteor.load();if(meteor.invoked){return}
  meteor.invoked=true;meteor.track("pageview")})(window,document,"script","1671173971065864");
  (function(r,d,s,l){var meteor=r.meteor=r.meteor||[];meteor.methods=["track","off","on"];meteor.factory=function(method){return function(){
  var args=Array.prototype.slice.call(arguments);args.unshift(method);meteor.push(args);return meteor}};for(var i=0;i<meteor.methods.length;i++){
  var key=meteor.methods[i];meteor[key]=meteor.factory(key)}meteor.load=function(){var js,fjs=d.getElementsByTagName(s)[0];js=d.createElement(s);
  js.src="https://analytics.snssdk.com/meteor.js/v1/"+l+"/sdk";fjs.parentNode.insertBefore(js,fjs)};meteor.load();if(meteor.invoked){return}
  meteor.invoked=true;meteor.track("pageview")})(window,document,"script","1670738800885768");
}