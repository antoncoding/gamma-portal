/*! For license information please see 64.c05632a7.chunk.js.LICENSE.txt */
(this["webpackJsonpgamma-portal"]=this["webpackJsonpgamma-portal"]||[]).push([[64],{1256:function(t,e,r){"use strict";r.r(e);var n=r(1280);function o(){o=function(){return t};var t={},e=Object.prototype,r=e.hasOwnProperty,n="function"==typeof Symbol?Symbol:{},a=n.iterator||"@@iterator",i=n.asyncIterator||"@@asyncIterator",c=n.toStringTag||"@@toStringTag";function u(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{u({},"")}catch(j){u=function(t,e,r){return t[e]=r}}function A(t,e,r,n){var o=e&&e.prototype instanceof s?e:s,a=Object.create(o.prototype),i=new P(n||[]);return a._invoke=function(t,e,r){var n="suspendedStart";return function(o,a){if("executing"===n)throw new Error("Generator is already running");if("completed"===n){if("throw"===o)throw a;return L()}for(r.method=o,r.arg=a;;){var i=r.delegate;if(i){var c=w(i,r);if(c){if(c===f)continue;return c}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===n)throw n="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);n="executing";var u=l(t,e,r);if("normal"===u.type){if(n=r.done?"completed":"suspendedYield",u.arg===f)continue;return{value:u.arg,done:r.done}}"throw"===u.type&&(n="completed",r.method="throw",r.arg=u.arg)}}}(t,r,i),a}function l(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(j){return{type:"throw",arg:j}}}t.wrap=A;var f={};function s(){}function h(){}function v(){}var p={};u(p,a,(function(){return this}));var d=Object.getPrototypeOf,y=d&&d(d(k([])));y&&y!==e&&r.call(y,a)&&(p=y);var g=v.prototype=s.prototype=Object.create(p);function I(t){["next","throw","return"].forEach((function(e){u(t,e,(function(t){return this._invoke(e,t)}))}))}function m(t,e){var n;this._invoke=function(o,a){function i(){return new e((function(n,i){!function n(o,a,i,c){var u=l(t[o],t,a);if("throw"!==u.type){var A=u.arg,f=A.value;return f&&"object"==typeof f&&r.call(f,"__await")?e.resolve(f.__await).then((function(t){n("next",t,i,c)}),(function(t){n("throw",t,i,c)})):e.resolve(f).then((function(t){A.value=t,i(A)}),(function(t){return n("throw",t,i,c)}))}c(u.arg)}(o,a,n,i)}))}return n=n?n.then(i,i):i()}}function w(t,e){var r=t.iterator[e.method];if(void 0===r){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=void 0,w(t,e),"throw"===e.method))return f;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return f}var n=l(r,t.iterator,e.arg);if("throw"===n.type)return e.method="throw",e.arg=n.arg,e.delegate=null,f;var o=n.arg;return o?o.done?(e[t.resultName]=o.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,f):o:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,f)}function b(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function C(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function P(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(b,this),this.reset(!0)}function k(t){if(t){var e=t[a];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var n=-1,o=function e(){for(;++n<t.length;)if(r.call(t,n))return e.value=t[n],e.done=!1,e;return e.value=void 0,e.done=!0,e};return o.next=o}}return{next:L}}function L(){return{value:void 0,done:!0}}return h.prototype=v,u(g,"constructor",v),u(v,"constructor",h),h.displayName=u(v,c,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===h||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,v):(t.__proto__=v,u(t,c,"GeneratorFunction")),t.prototype=Object.create(g),t},t.awrap=function(t){return{__await:t}},I(m.prototype),u(m.prototype,i,(function(){return this})),t.AsyncIterator=m,t.async=function(e,r,n,o,a){void 0===a&&(a=Promise);var i=new m(A(e,r,n,o),a);return t.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},I(g),u(g,c,"Generator"),u(g,a,(function(){return this})),u(g,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){for(;e.length;){var n=e.pop();if(n in t)return r.value=n,r.done=!1,r}return r.done=!0,r}},t.values=k,P.prototype={constructor:P,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(C),!t)for(var e in this)"t"===e.charAt(0)&&r.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function n(r,n){return i.type="throw",i.arg=t,e.next=r,n&&(e.method="next",e.arg=void 0),!!n}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],i=a.completion;if("root"===a.tryLoc)return n("end");if(a.tryLoc<=this.prev){var c=r.call(a,"catchLoc"),u=r.call(a,"finallyLoc");if(c&&u){if(this.prev<a.catchLoc)return n(a.catchLoc,!0);if(this.prev<a.finallyLoc)return n(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return n(a.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return n(a.finallyLoc)}}}},abrupt:function(t,e){for(var n=this.tryEntries.length-1;n>=0;--n){var o=this.tryEntries[n];if(o.tryLoc<=this.prev&&r.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,f):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),f},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),C(r),f}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;C(r)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:k(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=void 0),f}},t}function a(t,e,r,n,o,a,i){try{var c=t[a](i),u=c.value}catch(A){return void r(A)}c.done?e(u):Promise.resolve(u).then(n,o)}e.default=function(t){var e=t.preferred,r=t.label,i=t.iconSrc;return{name:r||"XDEFI Wallet",iconSrc:i||"data:image/png;base64,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",iconSrcSet:i||"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL0AAAC9CAYAAADm13wwAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAaGVYSWZNTQAqAAAACAAEAQYAAwAAAAEAAgAAARIAAwAAAAEAAQAAASgAAwAAAAEAAgAAh2kABAAAAAEAAAA+AAAAAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAAC9oAMABAAAAAEAAAC9AAAAALiM9e4AAALkaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA1LjQuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx0aWZmOlBob3RvbWV0cmljSW50ZXJwcmV0YXRpb24+MjwvdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpDb21wcmVzc2lvbj4xPC90aWZmOkNvbXByZXNzaW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpQaXhlbFlEaW1lbnNpb24+MTg5PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgICAgPGV4aWY6Q29sb3JTcGFjZT4xPC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj4xODk8L2V4aWY6UGl4ZWxYRGltZW5z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",svg:t.svg,wallet:function(){var t,e=(t=o().mark((function t(e){var r,n,a;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.createModernProviderInterface,n=e.createLegacyProviderInterface,a=window.xfi&&window.xfi.ethereum,t.abrupt("return",{provider:a,interface:a?"function"===typeof a.enable?r(a):n(a):null});case 3:case"end":return t.stop()}}),t)})),function(){var e=this,r=arguments;return new Promise((function(n,o){var i=t.apply(e,r);function c(t){a(i,n,o,c,u,"next",t)}function u(t){a(i,n,o,c,u,"throw",t)}c(void 0)}))});return function(t){return e.apply(this,arguments)}}(),type:"injected",link:"https://chrome.google.com/webstore/detail/xdefi-wallet/hmeobnfnfcmdkdcmlblgagmfpfboieaf",installMessage:n.a,desktop:!0,mobile:!0,preferred:e}}},1280:function(t,e,r){"use strict";r.d(e,"a",(function(){return n})),r.d(e,"b",(function(){return o}));var n=function(t){var e=t.currentWallet,r=t.selectedWallet;return e?'\n    <p style="font-size: 0.889rem; font-family: inherit; margin: 0.889rem 0;">\n    We have detected that you already have\n    <b>'.concat(e,"</b>\n    installed. If you would prefer to use\n    <b>").concat(r,'</b>\n    instead, then click below to install.\n    </p>\n    <p style="font-size: 0.889rem; font-family: inherit; margin: 0.889rem 0;">\n    <b>Tip:</b>\n    If you already have ').concat(r,' installed, check your\n    browser extension settings to make sure that you have it enabled\n    and that you have disabled any other browser extension wallets.\n    <span\n      class="bn-onboard-clickable"\n      style="color: #4a90e2; font-size: 0.889rem; font-family: inherit;"\n      onclick="window.location.reload();">\n      Then refresh the page.\n    </span>\n    </p>\n    '):'\n    <p style="font-size: 0.889rem; font-family: inherit; margin: 0.889rem 0;">\n    You\'ll need to install <b>'.concat(r,'</b> to continue. Once you have it installed, go ahead and\n    <span\n    class="bn-onboard-clickable"\n      style="color: #4a90e2; font-size: 0.889rem; font-family: inherit;"\n      onclick={window.location.reload();}>\n      refresh the page.\n    </span>\n    ').concat("Opera"===r?'<br><br><i>Hint: If you already have Opera installed, make sure that your web3 wallet is <a style="color: #4a90e2; font-size: 0.889rem; font-family: inherit;" class="bn-onboard-clickable" href="https://help.opera.com/en/touch/crypto-wallet/" rel="noreferrer noopener" target="_blank">enabled</a></i>':"","\n    </p>\n    ")},o=function(t){var e=t.selectedWallet;return'\n  <p style="font-size: 0.889rem;">\n  Tap the button below to <b>Open '.concat(e,"</b>. Please access this site on ").concat(e,"'s in-app browser for a seamless experience.\n  </p>\n  ")}}}]);
//# sourceMappingURL=64.c05632a7.chunk.js.map