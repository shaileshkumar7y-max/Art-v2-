/* BLACKED PUSSY INNERWEAR — Halloween 2027 interactions. No backend or personal data. */
'use strict';
(() => {
  const root = document.getElementById('halloween-section');
  if (!root) return;

  const moods = [
    { name: 'Velvet Noir', copy: 'A deep-black editorial direction with quiet luxury and strong contrast.', target: 'collection-section' },
    { name: 'Moonlit Muse', copy: 'A softer, atmospheric route through portraits, form and expressive composition.', target: 'art-section' },
    { name: 'Crimson Hour', copy: 'A dramatic wine-and-rose palette for a new creative brief.', target: 'creator-section' },
    { name: 'Gothic Atelier', copy: 'Explore gesture, balance and silhouette through the pose study room.', target: 'pose-section' },
    { name: 'Ember Rose', copy: 'Warm highlights, graceful details and an elegant after-dark mood.', target: 'collection-section' },
    { name: 'Shadow Sketch', copy: 'A monochrome direction inspired by charcoal, graphite and classical studies.', target: 'art-section' }
  ];

  const wheel = root.querySelector('[data-hw-wheel]');
  const spinButton = root.querySelector('[data-hw-spin]');
  const resultTitle = root.querySelector('[data-hw-result-title]');
  const resultCopy = root.querySelector('[data-hw-result-copy]');
  const resultGo = root.querySelector('[data-hw-result-go]');
  const status = root.querySelector('[data-hw-status]');
  let selectedMood = null;
  let busy = false;
  let rotation = 0;

  function scrollToSection(id) {
    const target = document.getElementById(id);
    if (!target) return;
    target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }

  root.querySelectorAll('[data-hw-scroll]').forEach(button => {
    button.addEventListener('click', () => scrollToSection(button.getAttribute('data-hw-scroll')));
  });

  if (spinButton && wheel) {
    spinButton.addEventListener('click', () => {
      if (busy) return;
      busy = true;
      spinButton.disabled = true;
      resultGo.hidden = true;
      if (status) status.textContent = 'The wheel is choosing your direction…';

      const index = Math.floor(Math.random() * moods.length);
      selectedMood = moods[index];
      const sectorCenter = index * 60 + 30;
      const targetRotation = 360 * 5 + (360 - sectorCenter);
      rotation += targetRotation;
      wheel.style.transform = `rotate(${rotation}deg)`;

      const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.setTimeout(() => {
        resultTitle.textContent = selectedMood.name;
        resultCopy.textContent = selectedMood.copy;
        resultGo.hidden = false;
        busy = false;
        spinButton.disabled = false;
        if (status) status.textContent = 'Mood selected. Explore it whenever you are ready.';
      }, reduceMotion ? 50 : 4100);
    });
  }

  resultGo?.addEventListener('click', () => {
    if (selectedMood) scrollToSection(selectedMood.target);
  });

  const countdown = root.querySelector('[data-hw-countdown]');
  if (countdown) {
    const days = countdown.querySelector('[data-hw-days]');
    const hours = countdown.querySelector('[data-hw-hours]');
    const minutes = countdown.querySelector('[data-hw-minutes]');
    const seconds = countdown.querySelector('[data-hw-seconds]');
    const message = countdown.querySelector('[data-hw-countdown-status]');
    const eventTime = new Date('2027-10-31T23:59:59+05:30').getTime();
    const pad = value => String(value).padStart(2, '0');
    const updateCountdown = () => {
      const remaining = eventTime - Date.now();
      if (remaining <= 0) {
        days.textContent = '00'; hours.textContent = '00'; minutes.textContent = '00'; seconds.textContent = '00';
        if (message) message.textContent = 'Halloween 2027 is here — explore the seasonal edit.';
        return;
      }
      const totalSeconds = Math.floor(remaining / 1000);
      days.textContent = String(Math.floor(totalSeconds / 86400));
      hours.textContent = pad(Math.floor((totalSeconds % 86400) / 3600));
      minutes.textContent = pad(Math.floor((totalSeconds % 3600) / 60));
      seconds.textContent = pad(totalSeconds % 60);
      if (message) message.textContent = 'The seasonal edit is being prepared.';
    };
    updateCountdown();
    window.setInterval(updateCountdown, 1000);
  }

  // Mark a failed remote campaign asset without hiding the surrounding card or breaking the page.
  root.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => {
      img.classList.add('hw-image-unavailable');
      img.alt = `${img.alt || 'Campaign image'} — image unavailable; check your connection.`;
    }, { once: true });
  });
})();
