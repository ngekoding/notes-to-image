if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('/notes-to-image/sw.js', { scope: '/notes-to-image/' })})}