document.addEventListener('DOMContentLoaded', () => {
  // hero background video: force highest available playback quality
  (function () {
    const heroFrame = document.getElementById('heroYtBg');
    if (!heroFrame) return;

    function forceHD(player) {
      try {
        const levels = player.getAvailableQualityLevels ? player.getAvailableQualityLevels() : [];
        const best = levels && levels.length ? levels[0] : 'hd1080';
        player.setPlaybackQuality(best);
      } catch (e) {}
    }

    window.onYouTubeIframeAPIReady = function () {
      const heroPlayer = new YT.Player('heroYtBg', {
        events: {
          onReady: (e) => {
            forceHD(e.target);
            // re-assert periodically in case YouTube's auto bitrate adjustment lowers it
            setInterval(() => forceHD(e.target), 6000);
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) forceHD(e.target);
          }
        }
      });
    };

    if (!window.YT) {
      const ytScript = document.createElement('script');
      ytScript.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(ytScript);
    }
  })();

  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  const themeBtn = document.querySelector('.theme-toggle');
  const root = document.documentElement;
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isDark = root.getAttribute('data-theme') === 'dark';
      if (isDark) {
        root.removeAttribute('data-theme');
        try { localStorage.setItem('himam-theme', 'light'); } catch (e) {}
      } else {
        root.setAttribute('data-theme', 'dark');
        try { localStorage.setItem('himam-theme', 'dark'); } catch (e) {}
      }
    });
  }

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  const sectorCards = document.querySelectorAll('.sector-card');
  sectorCards.forEach(card => {
    card.addEventListener('click', () => {
      const wasFlipped = card.classList.contains('flipped');
      sectorCards.forEach(c => c.classList.remove('flipped'));
      if (!wasFlipped) card.classList.add('flipped');
    });
  });

  const sectorsScroll = document.querySelector('.sectors-scroll');
  if (sectorsScroll) {
    let autoTimer = null;

    const getStep = () => {
      const card = sectorsScroll.querySelector('.sector-card');
      if (!card) return 320;
      const gap = parseFloat(getComputedStyle(sectorsScroll).columnGap || getComputedStyle(sectorsScroll).gap || 24);
      return card.getBoundingClientRect().width + gap;
    };

    const atEnd = () => {
      const max = sectorsScroll.scrollWidth - sectorsScroll.clientWidth;
      return Math.abs(sectorsScroll.scrollLeft) >= max - 4;
    };
    const atStart = () => Math.abs(sectorsScroll.scrollLeft) <= 4;

    function stepForward() {
      if (atEnd()) {
        sectorsScroll.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        sectorsScroll.scrollBy({ left: -getStep(), behavior: 'smooth' });
      }
    }
    function stepBack() {
      if (atStart()) {
        sectorsScroll.scrollTo({ left: -(sectorsScroll.scrollWidth), behavior: 'smooth' });
      } else {
        sectorsScroll.scrollBy({ left: getStep(), behavior: 'smooth' });
      }
    }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(stepForward, 3000);
    }
    function stopAuto() {
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = null;
    }

    sectorsScroll.addEventListener('mouseenter', stopAuto);
    sectorsScroll.addEventListener('mouseleave', startAuto);
    sectorsScroll.addEventListener('touchstart', stopAuto, { passive: true });

    document.querySelectorAll('.sectors-arrow').forEach(btn => {
      btn.addEventListener('click', () => {
        stopAuto();
        if (btn.dataset.dir === 'prev') stepBack(); else stepForward();
        startAuto();
      });
    });

    startAuto();
  }

  function loadVideoEmbed(container) {
    const videoId = container.dataset.videoId;
    if (!videoId || container.dataset.loaded === '1') return;
    container.dataset.loaded = '1';
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    iframe.title = container.getAttribute('aria-label') || 'فيديو';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    container.innerHTML = '';
    container.appendChild(iframe);
  }
  document.querySelectorAll('[data-video-id]').forEach(el => {
    el.addEventListener('click', () => loadVideoEmbed(el));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        loadVideoEmbed(el);
      }
    });
  });

  const items = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(i => io.observe(i));

  const nums = document.querySelectorAll('.num[data-count]');
  const io2 = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCount(e.target);
        io2.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  nums.forEach(n => io2.observe(n));

  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = (Number.isInteger(target) ? Math.round(val) : val.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
});