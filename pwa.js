/* Register the static app shell for offline use on HTTPS / GitHub Pages. */
'use strict';
(() => {
  const status = document.getElementById('connectionStatus');
  const installButton = document.getElementById('installAppButton');
  let installPrompt = null;
  function updateConnection() {
    if (!status) return;
    const online = navigator.onLine;
    status.textContent = online ? 'Online · offline-ready library' : 'Offline · saved library available';
    status.classList.toggle('offline',!online);
  }
  window.addEventListener('online',updateConnection);
  window.addEventListener('offline',updateConnection);
  updateConnection();
  window.addEventListener('beforeinstallprompt',event => {
    event.preventDefault(); installPrompt = event;
    installButton?.classList.remove('hidden');
  });
  installButton?.addEventListener('click',async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    installPrompt = null; installButton.classList.add('hidden');
  });
  window.addEventListener('appinstalled',() => { installButton?.classList.add('hidden'); if(status) status.textContent='Installed · offline-ready library'; });
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load',() => {
      navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(() => {
        if (status) status.textContent = navigator.onLine ? 'Online · install cache unavailable' : 'Offline · cached content only';
      });
    },{once:true});
  }
})();
