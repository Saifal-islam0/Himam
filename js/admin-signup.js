document.addEventListener('DOMContentLoaded', () => {
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

  document.querySelectorAll('.toggle-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      btn.classList.toggle('is-visible', !showing);
    });
  });

  const wizardForm = document.getElementById('adminSignupForm');
  if (wizardForm) {
    const steps = Array.from(wizardForm.querySelectorAll('.form-step'));
    const indicators = Array.from(wizardForm.querySelectorAll('.stepper-step'));
    const lines = Array.from(wizardForm.querySelectorAll('.stepper-line'));

    function goToStep(stepNum) {
      steps.forEach(s => s.classList.toggle('is-active', Number(s.dataset.step) === stepNum));
      indicators.forEach(ind => {
        const n = Number(ind.dataset.stepIndicator);
        ind.classList.toggle('is-active', n === stepNum);
        ind.classList.toggle('is-done', n < stepNum);
      });
      lines.forEach((line, i) => line.classList.toggle('is-done', (i + 1) < stepNum));
      const activeStep = steps.find(s => Number(s.dataset.step) === stepNum);
      if (activeStep) {
        const firstField = activeStep.querySelector('input, textarea, select');
        if (firstField) firstField.focus({ preventScroll: true });
      }
    }

    wizardForm.querySelectorAll('.step-next').forEach(btn => {
      btn.addEventListener('click', () => {
        const currentStep = btn.closest('.form-step');
        const requiredFields = currentStep.querySelectorAll('[required]');
        for (const field of requiredFields) {
          if (!field.reportValidity()) return;
        }
        goToStep(Number(btn.dataset.next));
      });
    });

    wizardForm.querySelectorAll('.step-prev').forEach(btn => {
      btn.addEventListener('click', () => goToStep(Number(btn.dataset.prev)));
    });
  }

  const form = document.getElementById('adminSignupForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      const p1 = document.getElementById('password');
      const p2 = document.getElementById('password2');
      if (p1 && p2 && p1.value !== p2.value) {
        e.preventDefault();
        p2.setCustomValidity('كلمتا المرور غير متطابقتين');
        p2.reportValidity();
        return;
      } else if (p2) {
        p2.setCustomValidity('');
      }
    });
    const p2 = document.getElementById('password2');
    if (p2) p2.addEventListener('input', () => p2.setCustomValidity(''));
  }

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
});