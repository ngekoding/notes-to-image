if(!self.define){let e,i={};const d=(d,n)=>(d=new URL(d+".js",n).href,i[d]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=d,e.onload=i,document.head.appendChild(e)}else e=d,importScripts(d),i()})).then((()=>{let e=i[d];if(!e)throw new Error(`Module ${d} didn’t register its module`);return e})));self.define=(n,r)=>{const s=e||("document"in self?document.currentScript.src:"")||location.href;if(i[s])return;let a={};const c=e=>d(e,s),o={module:{uri:s},exports:a,require:c};i[s]=Promise.all(n.map((e=>o[e]||c(e)))).then((e=>(r(...e),a)))}}define(["./workbox-3625d7b0"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"apple-touch-icon.png",revision:"f001ea185f0a6c95d604db3e60c7e5a0"},{url:"assets/abjad_arabic_icon_bold.926ffc6f.svg",revision:null},{url:"assets/frame-top-left-corner.f474dadc.svg",revision:null},{url:"assets/index.9b73d7e1.css",revision:null},{url:"assets/index.d2116292.js",revision:null},{url:"favicon-16x16.png",revision:"b4c51209df2fdecc3d3318e3a28a8362"},{url:"favicon-32x32.png",revision:"104d846c9bfeac035f2f8aebfd446d55"},{url:"favicon.ico",revision:"9dc95f6cdf6c705d2763acfa7c53d6ba"},{url:"index.html",revision:"da63ca4477016d9c3164f82595c85504"},{url:"logo-outlined-white.svg",revision:"a289db0eb0bcd36448321eda8a326d89"},{url:"logo-outlined.svg",revision:"38dd1e91990cdea12424dcd4787d42a8"},{url:"logo.svg",revision:"a9053cfa0457feda13644a151ef30a24"},{url:"pwa-192x192.png",revision:"ca73cc75614afd80b9db1c6f1c4733dc"},{url:"pwa-512x512.png",revision:"b98065356a0916b83b453118c879d602"},{url:"registerSW.js",revision:"28d1941427465c591e39d8f90030a3af"},{url:"safari-pinned-tab.svg",revision:"75d6fadbfa3888f8b500a0dc9e60cb06"},{url:"vite.svg",revision:"8e3a10e157f75ada21ab742c022d5430"},{url:"logo-outlined.svg",revision:"38dd1e91990cdea12424dcd4787d42a8"},{url:"apple-touch-icon.png",revision:"f001ea185f0a6c95d604db3e60c7e5a0"},{url:"pwa-192x192.png",revision:"ca73cc75614afd80b9db1c6f1c4733dc"},{url:"pwa-512x512.png",revision:"b98065356a0916b83b453118c879d602"},{url:"manifest.webmanifest",revision:"1eafa702df085d4ff14d0d55d200948b"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
