/*! For license information please see 40.30e1c9ed.chunk.js.LICENSE.txt */
(this["webpackJsonpgamma-portal"]=this["webpackJsonpgamma-portal"]||[]).push([[40],{1260:function(t,e,n){"use strict";n.r(e);var r=n(1280);function o(){o=function(){return t};var t={},e=Object.prototype,n=e.hasOwnProperty,r="function"==typeof Symbol?Symbol:{},i=r.iterator||"@@iterator",a=r.asyncIterator||"@@asyncIterator",c=r.toStringTag||"@@toStringTag";function l(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{l({},"")}catch(O){l=function(t,e,n){return t[e]=n}}function s(t,e,n,r){var o=e&&e.prototype instanceof h?e:h,i=Object.create(o.prototype),a=new E(r||[]);return i._invoke=function(t,e,n){var r="suspendedStart";return function(o,i){if("executing"===r)throw new Error("Generator is already running");if("completed"===r){if("throw"===o)throw i;return _()}for(n.method=o,n.arg=i;;){var a=n.delegate;if(a){var c=L(a,n);if(c){if(c===f)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if("suspendedStart"===r)throw r="completed",n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r="executing";var l=u(t,e,n);if("normal"===l.type){if(r=n.done?"completed":"suspendedYield",l.arg===f)continue;return{value:l.arg,done:n.done}}"throw"===l.type&&(r="completed",n.method="throw",n.arg=l.arg)}}}(t,n,a),i}function u(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(O){return{type:"throw",arg:O}}}t.wrap=s;var f={};function h(){}function p(){}function d(){}var y={};l(y,i,(function(){return this}));var v=Object.getPrototypeOf,m=v&&v(v(k([])));m&&m!==e&&n.call(m,i)&&(y=m);var g=d.prototype=h.prototype=Object.create(y);function w(t){["next","throw","return"].forEach((function(e){l(t,e,(function(t){return this._invoke(e,t)}))}))}function b(t,e){var r;this._invoke=function(o,i){function a(){return new e((function(r,a){!function r(o,i,a,c){var l=u(t[o],t,i);if("throw"!==l.type){var s=l.arg,f=s.value;return f&&"object"==typeof f&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,a,c)}),(function(t){r("throw",t,a,c)})):e.resolve(f).then((function(t){s.value=t,a(s)}),(function(t){return r("throw",t,a,c)}))}c(l.arg)}(o,i,r,a)}))}return r=r?r.then(a,a):a()}}function L(t,e){var n=t.iterator[e.method];if(void 0===n){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=void 0,L(t,e),"throw"===e.method))return f;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return f}var r=u(n,t.iterator,e.arg);if("throw"===r.type)return e.method="throw",e.arg=r.arg,e.delegate=null,f;var o=r.arg;return o?o.done?(e[t.resultName]=o.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,f):o:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,f)}function x(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function C(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function E(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(x,this),this.reset(!0)}function k(t){if(t){var e=t[i];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var r=-1,o=function e(){for(;++r<t.length;)if(n.call(t,r))return e.value=t[r],e.done=!1,e;return e.value=void 0,e.done=!0,e};return o.next=o}}return{next:_}}function _(){return{value:void 0,done:!0}}return p.prototype=d,l(g,"constructor",d),l(d,"constructor",p),p.displayName=l(d,c,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===p||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,d):(t.__proto__=d,l(t,c,"GeneratorFunction")),t.prototype=Object.create(g),t},t.awrap=function(t){return{__await:t}},w(b.prototype),l(b.prototype,a,(function(){return this})),t.AsyncIterator=b,t.async=function(e,n,r,o,i){void 0===i&&(i=Promise);var a=new b(s(e,n,r,o),i);return t.isGeneratorFunction(n)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},w(g),l(g,c,"Generator"),l(g,i,(function(){return this})),l(g,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=[];for(var n in t)e.push(n);return e.reverse(),function n(){for(;e.length;){var r=e.pop();if(r in t)return n.value=r,n.done=!1,n}return n.done=!0,n}},t.values=k,E.prototype={constructor:E,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(C),!t)for(var e in this)"t"===e.charAt(0)&&n.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(n,r){return a.type="throw",a.arg=t,e.next=n,r&&(e.method="next",e.arg=void 0),!!r}for(var o=this.tryEntries.length-1;o>=0;--o){var i=this.tryEntries[o],a=i.completion;if("root"===i.tryLoc)return r("end");if(i.tryLoc<=this.prev){var c=n.call(i,"catchLoc"),l=n.call(i,"finallyLoc");if(c&&l){if(this.prev<i.catchLoc)return r(i.catchLoc,!0);if(this.prev<i.finallyLoc)return r(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return r(i.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return r(i.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var i=o;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,f):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),f},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),C(n),f}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;C(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:k(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=void 0),f}},t}function i(t,e,n,r,o,i,a){try{var c=t[i](a),l=c.value}catch(s){return void n(s)}c.done?e(l):Promise.resolve(l).then(r,o)}e.default=function(t){var e=t.preferred;return{name:t.label||"Bitpie",iconSrc:t.iconSrc,svg:t.svg||'\n<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">\n    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.72147 0.714294H30.3108C35.1186 0.714294 39.0161 4.61182 39.0161 9.41965V31.0089C39.0161 35.8168 35.1186 39.7143 30.3108 39.7143H8.72147C3.91363 39.7143 0.0161133 35.8168 0.0161133 31.0089V9.41965C0.0161133 4.61182 3.91363 0.714294 8.72147 0.714294Z" fill="url(#paint0_linear)"/>\n    <path d="M19.6902 35.1875C27.8635 35.1875 34.4893 28.5617 34.4893 20.3884C34.4893 12.2151 27.8635 5.58929 19.6902 5.58929C11.5169 5.58929 4.89111 12.2151 4.89111 20.3884C4.89111 28.5617 11.5169 35.1875 19.6902 35.1875Z" fill="white"/>\n    <path fill-rule="evenodd" clip-rule="evenodd" d="M19.5161 0.714294C30.2857 0.714294 39.0161 9.44474 39.0161 20.2143C39.0161 30.9838 30.2857 39.7143 19.5161 39.7143C8.74656 39.7143 0.0161133 30.9838 0.0161133 20.2143C0.0161133 9.44474 8.74656 0.714294 19.5161 0.714294ZM19.4287 5.34882C11.2187 5.34882 4.5632 12.0043 4.5632 20.2143C4.5632 28.4243 11.2187 35.0798 19.4287 35.0798C27.6386 35.0798 34.2941 28.4243 34.2941 20.2143C34.2941 12.0043 27.6386 5.34882 19.4287 5.34882Z" fill="url(#paint1_linear)"/>\n    <path fill-rule="evenodd" clip-rule="evenodd" d="M21.7479 27.6254C22.3598 28.6852 21.9967 30.0404 20.9369 30.6524C19.877 31.2643 18.5218 30.9011 17.9099 29.8413L17.2448 28.6899L16.0937 29.3546C15.0338 29.9665 13.6786 29.6034 13.0667 28.5435C12.4548 27.4837 12.8179 26.1285 13.8778 25.5166L15.0288 24.8517L13.2562 21.7814L12.105 22.4461C11.0452 23.058 9.68995 22.6949 9.07805 21.635C8.46614 20.5752 8.82927 19.2199 9.88913 18.608L11.0402 17.9432L10.3758 16.7918C9.76387 15.732 10.127 14.3768 11.1869 13.7649C12.2467 13.1529 13.6019 13.5161 14.2138 14.5759L14.8784 15.7271L17.9487 13.9545L17.2843 12.8032C16.6724 11.7434 17.0355 10.3881 18.0954 9.77622C19.1552 9.16431 20.5105 9.52745 21.1224 10.5873L21.7869 11.7385L22.9386 11.0739C23.9984 10.462 25.3536 10.8252 25.9655 11.885C26.5775 12.9449 26.2143 14.3001 25.1545 14.912L24.003 15.5768L25.7756 18.647L26.9272 17.9825C27.987 17.3706 29.3423 17.7337 29.9542 18.7935C30.5661 19.8534 30.203 21.2086 29.1431 21.8205L27.9916 22.4853L28.6565 23.6367C29.2684 24.6966 28.9052 26.0518 27.8454 26.6637C26.7855 27.2756 25.4303 26.9125 24.8184 25.8526L24.1533 24.7013L21.0831 26.4739L21.7479 27.6254ZM18.8671 22.6356L21.9373 20.863L20.1647 17.7928L17.0945 19.5654L18.8671 22.6356Z" fill="url(#paint2_linear)"/>\n    <defs>\n        <linearGradient id="paint0_linear" x1="20.509" y1="39.7143" x2="20.509" y2="0.714294" gradientUnits="userSpaceOnUse">\n            <stop stop-color="#1E3DA0"/>\n            <stop offset="1" stop-color="#3750DE"/>\n        </linearGradient>\n        <linearGradient id="paint1_linear" x1="19.5161" y1="0.714294" x2="19.5161" y2="39.7143" gradientUnits="userSpaceOnUse">\n            <stop stop-color="#1D3BA3" stop-opacity="0"/>\n            <stop offset="1" stop-color="#173793" stop-opacity="0.652938"/>\n        </linearGradient>\n        <linearGradient id="paint2_linear" x1="24.3911" y1="28.658" x2="14.6411" y2="11.7705" gradientUnits="userSpaceOnUse">\n            <stop stop-color="#1E3DA0"/>\n            <stop offset="1" stop-color="#3750DE"/>\n        </linearGradient>\n    </defs>\n</svg>\n',wallet:function(){var t,e=(t=o().mark((function t(e){var n,r,i,a;return o().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=e.getProviderName,r=e.createModernProviderInterface,i=e.createLegacyProviderInterface,a=window.ethereum||window.web3&&window.web3.currentProvider,t.abrupt("return",{provider:a,interface:a&&"Bitpie"===n(a)?"function"===typeof a.enable?r(a):i(a):null});case 3:case"end":return t.stop()}}),t)})),function(){var e=this,n=arguments;return new Promise((function(r,o){var a=t.apply(e,n);function c(t){i(a,r,o,c,l,"next",t)}function l(t){i(a,r,o,c,l,"throw",t)}c(void 0)}))});return function(t){return e.apply(this,arguments)}}(),type:"injected",link:"https://bitpiehk.com",installMessage:r.b,mobile:!0,preferred:e}}},1280:function(t,e,n){"use strict";n.d(e,"a",(function(){return r})),n.d(e,"b",(function(){return o}));var r=function(t){var e=t.currentWallet,n=t.selectedWallet;return e?'\n    <p style="font-size: 0.889rem; font-family: inherit; margin: 0.889rem 0;">\n    We have detected that you already have\n    <b>'.concat(e,"</b>\n    installed. If you would prefer to use\n    <b>").concat(n,'</b>\n    instead, then click below to install.\n    </p>\n    <p style="font-size: 0.889rem; font-family: inherit; margin: 0.889rem 0;">\n    <b>Tip:</b>\n    If you already have ').concat(n,' installed, check your\n    browser extension settings to make sure that you have it enabled\n    and that you have disabled any other browser extension wallets.\n    <span\n      class="bn-onboard-clickable"\n      style="color: #4a90e2; font-size: 0.889rem; font-family: inherit;"\n      onclick="window.location.reload();">\n      Then refresh the page.\n    </span>\n    </p>\n    '):'\n    <p style="font-size: 0.889rem; font-family: inherit; margin: 0.889rem 0;">\n    You\'ll need to install <b>'.concat(n,'</b> to continue. Once you have it installed, go ahead and\n    <span\n    class="bn-onboard-clickable"\n      style="color: #4a90e2; font-size: 0.889rem; font-family: inherit;"\n      onclick={window.location.reload();}>\n      refresh the page.\n    </span>\n    ').concat("Opera"===n?'<br><br><i>Hint: If you already have Opera installed, make sure that your web3 wallet is <a style="color: #4a90e2; font-size: 0.889rem; font-family: inherit;" class="bn-onboard-clickable" href="https://help.opera.com/en/touch/crypto-wallet/" rel="noreferrer noopener" target="_blank">enabled</a></i>':"","\n    </p>\n    ")},o=function(t){var e=t.selectedWallet;return'\n  <p style="font-size: 0.889rem;">\n  Tap the button below to <b>Open '.concat(e,"</b>. Please access this site on ").concat(e,"'s in-app browser for a seamless experience.\n  </p>\n  ")}}}]);
//# sourceMappingURL=40.30e1c9ed.chunk.js.map