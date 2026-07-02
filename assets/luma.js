(() => {
  const header = document.querySelector('[data-luma-header]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');

  const setHeaderState = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 16);
  };

  setHeaderState();
  window.addEventListener('scroll', setHeaderState, { passive: true });

  toggle?.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    if (menu) menu.hidden = isOpen;
    document.documentElement.classList.toggle('menu-open', !isOpen);
  });

  menu?.addEventListener('click', (event) => {
    if (event.target === menu || event.target.closest('a')) {
      toggle?.setAttribute('aria-expanded', 'false');
      menu.hidden = true;
      document.documentElement.classList.remove('menu-open');
    }
  });

  document.querySelectorAll('[data-product-form]').forEach((form) => {
    const sectionId = form.getAttribute('data-product-form');
    const variantData = document.getElementById(`ProductVariants-${sectionId}`);
    const variants = variantData ? JSON.parse(variantData.textContent) : [];
    const selects = Array.from(form.querySelectorAll('[data-option-position]'));
    const variantInput = form.querySelector('[data-variant-id]');
    const submit = form.querySelector('[data-product-submit]');

    const updateVariant = () => {
      const selectedOptions = selects.map((select) => select.value);
      const variant = variants.find((candidate) => {
        return selectedOptions.every((value, index) => candidate.options[index] === value);
      });

      if (!variant || !variantInput || !submit) return;

      variantInput.value = variant.id;
      submit.disabled = !variant.available;
      submit.textContent = variant.available ? 'Add to bag' : 'Sold out';
    };

    selects.forEach((select) => select.addEventListener('change', updateVariant));
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.querySelector('[data-alive-hero]');
  const showroom = document.querySelector('[data-spatial-showroom]');
  const videoPlayer = document.querySelector('[data-interaction-video-player]');
  const video = videoPlayer?.querySelector('video');
  const transition = document.querySelector('[data-alive-transition]');
  let interactionTimer;
  let lastInteraction = 0;

  const cursor = document.createElement('div');
  cursor.className = 'alive-cursor';
  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    document.body.appendChild(cursor);
  }

  const setSpark = (event, target) => {
    const rect = target.getBoundingClientRect();
    target.style.setProperty('--spark-x', `${event.clientX - rect.left}px`);
    target.style.setProperty('--spark-y', `${event.clientY - rect.top}px`);
  };

  const playInteractionVideo = (source, type, event) => {
    if (reduceMotion || !videoPlayer) return;

    window.clearTimeout(interactionTimer);
    const hasSource = source && source !== 'undefined';

    if (event) {
      videoPlayer.style.setProperty('--video-x', `${event.clientX}px`);
      videoPlayer.style.setProperty('--video-y', `${event.clientY}px`);
    }

    videoPlayer.classList.toggle('has-video', Boolean(hasSource));
    videoPlayer.classList.add('is-playing');

    if (video && hasSource && video.currentSrc !== source) {
      video.innerHTML = '';
      const sourceNode = document.createElement('source');
      sourceNode.src = source;
      if (type && type !== 'undefined') sourceNode.type = type;
      video.appendChild(sourceNode);
      video.load();
    }

    if (video && hasSource) {
      video.currentTime = 0;
      video.play().catch(() => {
        videoPlayer.classList.remove('has-video');
      });
    }

    interactionTimer = window.setTimeout(() => {
      videoPlayer.classList.remove('is-playing');
      video?.pause();
    }, hasSource ? 1400 : 820);
  };

  if ((hero || showroom) && !reduceMotion) {
    const interactionHost = showroom || hero;
    const interactionSource = interactionHost.dataset.interactionVideo;
    const interactionType = interactionHost.dataset.interactionVideoType;

    window.addEventListener('pointermove', (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      hero?.style.setProperty('--alive-x', x.toFixed(3));
      hero?.style.setProperty('--alive-y', y.toFixed(3));
      showroom?.style.setProperty('--showroom-x', x.toFixed(3));
      showroom?.style.setProperty('--showroom-y', y.toFixed(3));
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate3d(-50%, -50%, 0)`;
      cursor.classList.add('is-visible');
    }, { passive: true });

    window.addEventListener('scroll', () => {
      const scroll = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
      hero?.style.setProperty('--alive-scroll', scroll.toFixed(3));
    }, { passive: true });

    document.querySelectorAll('a, button, .product-card, .liquid-feature__glass, .glass-select, input, [data-portal], [data-alive-tilt]').forEach((element) => {
      element.addEventListener('pointermove', (event) => setSpark(event, element), { passive: true });
      element.addEventListener('pointerenter', (event) => {
        cursor.classList.add('is-active');
        const now = Date.now();
        if (now - lastInteraction > 900) {
          lastInteraction = now;
          playInteractionVideo(interactionSource, interactionType, event);
        }
      });
      element.addEventListener('pointerleave', () => cursor.classList.remove('is-active'));
      element.addEventListener('click', (event) => playInteractionVideo(interactionSource, interactionType, event));
    });
  }

  if (transition && !reduceMotion) {
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a[href]');
      if (!link) return;
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (link.target && link.target !== '_self') return;

      const url = new URL(link.href, window.location.href);
      const samePageAnchor = url.pathname === window.location.pathname && url.hash;
      if (url.origin !== window.location.origin || samePageAnchor) return;

      event.preventDefault();
      transition.classList.add('is-active');
      window.setTimeout(() => {
        window.location.href = link.href;
      }, 520);
    });
  }

  document.querySelectorAll('.cinematic-intro').forEach((intro) => {
    const sessionKey = intro.dataset.sessionKey;
    const playOnce = intro.dataset.playOnce === 'true';
    const duration = Number(intro.dataset.duration || 0);

    if (playOnce && sessionStorage.getItem(sessionKey) === 'true') {
      intro.remove();
      return;
    }

    document.documentElement.classList.add('cinematic-intro-active');

    const closeIntro = () => {
      intro.classList.add('is-hidden');
      document.documentElement.classList.remove('cinematic-intro-active');
      if (playOnce) sessionStorage.setItem(sessionKey, 'true');
      window.setTimeout(() => intro.remove(), 780);
    };

    intro.querySelector('.cinematic-intro__enter')?.addEventListener('click', closeIntro);
    if (duration > 0) window.setTimeout(closeIntro, duration * 1000);
  });
})();
