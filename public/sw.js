if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let t={};const d=e=>n(e,o),f={module:{uri:o},exports:t,require:d};i[o]=Promise.all(s.map((e=>f[e]||d(e)))).then((e=>(r(...e),t)))}}define(["./workbox-fe70dbfd"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index.110a7ecd.js",revision:null},{url:"assets/index.dcab01f2.css",revision:null},{url:"assets/vendor.e0d7c679.js",revision:null},{url:"index.html",revision:"43f0b4a23918ff89e73ba154fe105c11"},{url:"favicon.ico",revision:"830545eb60fe15494691f1961c0a75f0"},{url:"apple-touch-icon.png",revision:"7b738ef802659efc7768887bd9b13aba"},{url:"android-chrome-192x192.png",revision:"a0df06341152b0304df284b15d2d9a53"},{url:"manifest.webmanifest",revision:"bd5b6c9e4faad20349fd25cd0054c5a1"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));