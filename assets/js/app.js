!function(e){var t={};function o(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,o),i.l=!0,i.exports}o.m=e,o.c=t,o.d=function(e,t,r){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(o.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)o.d(r,i,function(t){return e[t]}.bind(null,i));return r},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=1)}([function(e,t,o){"use strict";var r,i,n,s;s=function(){var e=function(){"object"==typeof console&&(arguments[0]="[js-widget-hooks] "+arguments[0],console.error.apply(console,arguments))};return{widgetClass:"widget",widgetDataName:"widgets",scriptClass:"dyn-script",vars:{},registered:{},registeredFinalls:{},register:function(t,o,r){this.registered[t]&&e("[WARNING] Widget "+t+" was already registered: Override."),this.registered[t]=[o,r]},setOptions:function(e){e&&["widgetClass","scriptClass","widgetDataName"].forEach(function(t){void 0!==e[t]&&(this[t]=e[t])}.bind(this))},init:function(t,o){var r,i,n=[],s={},a=[],c=this;for(r in this.setOptions(o),this.registered)n[n.length]=[r,this.registered[r][1]],s[r]=[];for(i in n.sort((function(e,t){return void 0!==e[1]&&void 0===t[1]?-1:void 0===e[1]&&void 0!==t[1]||e[1]<t[1]?1:e[1]>t[1]?-1:0})),t||(t=document.querySelector("body")),t||e("No root element could be found - is the DOM loaded already?"),t.querySelectorAll("."+c.widgetClass).forEach((function(t){var o=c.widgetDataName,r=t.dataset[o],i=0;r?r.split(" ").forEach((function(o){void 0!==s[o]?(s[o].push(t),i++):(e("No method for widget "+o+" provided on %o",t),t.classList.add(c.widgetClass+"-config-error"))})):(e("missing data-"+o+" attribute on %o",t),t.classList.add(c.widgetClass+"-config-error")),i||t.classList.remove(c.widgetClass)})),n.forEach((function(e){var t=e[0];s[t].forEach((function(e){a[a.length]=e,c.initSpecific(e,t)})),c.registeredFinalls[t]&&c.registeredFinalls[t](),delete s[t]})),a)a[i].classList.remove(this.widgetClass)},initSpecific:function(t,o,r){try{(t.classList.contains(this.widgetClass)||r)&&(this.registered[o][0](t),t.classList.add(this.widgetClass+"-initialized"))}catch(r){return e("Error during execution of widget %o at %o:\n%o",o,t,r),t.classList.add(this.widgetClass+"-error"),!1}return!0}}},e.exports?e.exports=s():(i=[],void 0===(n="function"==typeof(r=s)?r.apply(t,i):r)||(e.exports=n))},function(e,t,o){"use strict";o.r(t);var r,i=o(0),n=o.n(i),s=["You do not have permission to access this content","There was a problem providing access to protected content.","no level found in manifest"];n.a.register("video-player",(function(e){var t,o=e,r=0,i=5e3,n=500,a=o.id||"player"+Math.round(1e3*Math.random()),c=e.dataset.poster_img,d={width:"100%",cast:{},aspectratio:"889:500",hlshtml:!0,playlist:[{sources:[{file:e.dataset.hls_url}],image:c}]},l=function(e){o.id||(o.id=a),jwplayer(a).setup(d),u(a),e&&jwplayer(a).on("ready",(function(e){e&&r<5&&(++r>1?jwplayer(a).play():window.setTimeout((function(){jwplayer(a).play()}),500),console.log("Automated Player Reset & Restart %o/%o",r,5))}))},u=function(e){"#debug"===window.location.hash&&jwplayer(e).on("all",(function(e,t){["time","userActive","userInactive","viewable"].indexOf(e)<0&&console.log("%o - %o",e,t)})),jwplayer(e).on("buffer",(function(){clearTimeout(t),t=setTimeout((function(){l(!0),i*=2}),i)})),jwplayer(e).on("play",(function(){clearTimeout(t),i=5e3,n=500,r=0})),jwplayer(e).on("error",(function(e){console.log(e);var o;o=s.some((function(t){return!!(e.sourceError&&e.sourceError.reason&&e.sourceError.reason.indexOf(t)>-1)||e.message.indexOf(t)>-1})),clearTimeout(t),o||(t=setTimeout((function(){l(!0),n*=2}),n))}))};console.log("player config init %o",d),l()})),r=function(){n.a.init(document.querySelector("body"),{widgetClass:"js-dwbn-jw-widget"})},document.addEventListener("DOMContentLoaded",r),"interactive"!==document.readyState&&"complete"!==document.readyState||r()}]);
//# sourceMappingURL=app.js.map