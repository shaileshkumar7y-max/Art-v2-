'use strict';

// Small, localised copy switch. No third-party library or network request.
(() => {
  const button = document.getElementById('voiceToggle');
  if (!button) return;

  const nodes = Array.from(document.querySelectorAll('[data-voice]'));
  const storageKey = 'naked-canvas-brand-language';
  let language = 'en';

  try {
    const saved = window.localStorage.getItem(storageKey);
    if (saved === 'hi') language = 'hi';
  } catch (_) {
    // Language switching still works when browser storage is unavailable.
  }

  function apply(nextLanguage) {
    language = nextLanguage === 'hi' ? 'hi' : 'en';
    for (const node of nodes) {
      const replacement = node.dataset[language];
      if (typeof replacement === 'string' && replacement.length) node.textContent = replacement;
    }
    button.textContent = language === 'en' ? 'EN' : 'HI';
    button.setAttribute('aria-label', language === 'en' ? 'Switch to Hinglish' : 'Switch to English');
    button.setAttribute('aria-pressed', language === 'hi' ? 'true' : 'false');
    document.documentElement.lang = language === 'hi' ? 'hi' : 'en';
    try {
      window.localStorage.setItem(storageKey, language);
    } catch (_) {
      // Do not block the page when storage is disabled or full.
    }
  }

  button.addEventListener('click', () => apply(language === 'en' ? 'hi' : 'en'));
  apply(language);
})();
