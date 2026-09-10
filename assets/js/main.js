  // Mobile nav toggle
const toggle = document.getElementById('menuToggle');
const links = document.getElementById('navLinks');
if (toggle && links){
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }));
}

// Generic scroll-reveal (staggered, Apple-style)
const revealEls = document.querySelectorAll('.reveal-on-scroll');
if ('IntersectionObserver' in window && revealEls.length){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const el = entry.target;
        const i = Array.from(revealEls).indexOf(el);
        el.style.transitionDelay = (Math.min(i % 3, 2) * 0.1) + 's';
        el.classList.add('in-view');
        io.unobserve(el);
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in-view'));
}

// "How we work" — draw the connecting line and step in each stage in sequence
const stepsWrap = document.querySelector('.steps');
const stepEls = document.querySelectorAll('.step');
if (stepsWrap && 'IntersectionObserver' in window){
  const stepIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        stepsWrap.classList.add('line-drawn');
        stepEls.forEach((el, i) => {
          el.style.transitionDelay = (0.15 + i * 0.1) + 's';
          el.classList.add('in-view');
        });
        stepIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });
  stepIo.observe(stepsWrap);
} else if (stepsWrap){
  stepsWrap.classList.add('line-drawn');
  stepEls.forEach(el => el.classList.add('in-view'));
}

// Animated number counters (Trust section)
const counters = document.querySelectorAll('.count[data-target]');
if (counters.length){
  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();
    function tick(now){
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window){
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(el => cio.observe(el));
  } else {
    counters.forEach(el => { el.textContent = el.getAttribute('data-target') + (el.getAttribute('data-suffix')||''); });
  }
}

// Portfolio filter (only present on portfolio page)
const filterBtns = document.querySelectorAll('.filter-btn');
if (filterBtns.length){
  const cards = document.querySelectorAll('.portfolio-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.getAttribute('data-filter');
      cards.forEach(card => {
        const show = f === 'all' || card.getAttribute('data-category') === f;
        card.style.display = show ? '' : 'none';
      });
    });
  });
}

// Swiper sliders (Industries, Case studies, Testimonials — index page only)
if (typeof Swiper !== 'undefined'){
  if (document.querySelector('.industry-swiper')){
    new Swiper('.industry-swiper', {
      slidesPerView: 1.15,
      spaceBetween: 18,
      grabCursor: true,
      loop: true,
      autoplay: { delay: 3200, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: '.industry-pagination', clickable: true },
      navigation: { nextEl: '.industry-next', prevEl: '.industry-prev' },
      breakpoints: {
        620: { slidesPerView: 2, spaceBetween: 20 },
        980: { slidesPerView: 3, spaceBetween: 22 }
      }
    });
  }
  if (document.querySelector('.case-swiper')){
    new Swiper('.case-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      grabCursor: true,
      loop: true,
      autoHeight: true,
      autoplay: { delay: 4200, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: '.case-pagination', clickable: true },
      navigation: { nextEl: '.case-next', prevEl: '.case-prev' },
      breakpoints: {
        860: { slidesPerView: 2, spaceBetween: 24, autoHeight: false }
      }
    });
  }
  if (document.querySelector('.testi-swiper')){
    new Swiper('.testi-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      grabCursor: true,
      loop: true,
      autoHeight: true,
      autoplay: { delay: 3800, disableOnInteraction: false, pauseOnMouseEnter: true },
      pagination: { el: '.testi-pagination', clickable: true },
      navigation: { nextEl: '.testi-next', prevEl: '.testi-prev' },
      breakpoints: {
        860: { slidesPerView: 2, spaceBetween: 24, autoHeight: false }
      }
    });
  }
}

// Contact form (static — no backend, opens WhatsApp/email with prefilled message)
const contactForm = document.getElementById('contactForm');
if (contactForm){
  const cfSubmit = document.getElementById('cf-submit');
  const cfStatus = document.getElementById('cf-status');
  const cfDefaultLabel = cfSubmit ? cfSubmit.textContent : 'Send message';

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (cfStatus){ cfStatus.className = 'form-status'; cfStatus.textContent = ''; }

    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    if (!name || !email){
      if (cfStatus){ cfStatus.className = 'form-status is-error'; cfStatus.textContent = 'Please fill in your name and email.'; }
      return;
    }

    if (cfSubmit){ cfSubmit.disabled = true; cfSubmit.textContent = 'Sending...'; }

    fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { 'Accept': 'application/json' }
    })
    .then((response) => {
      if (response.ok){
        if (cfStatus){ cfStatus.className = 'form-status is-success'; cfStatus.textContent = "Message sent — we'll get back to you within one business day."; }
        contactForm.reset();
      } else {
        if (cfStatus){ cfStatus.className = 'form-status is-error'; cfStatus.textContent = "Couldn't send your message. Please try again or WhatsApp us directly."; }
      }
    })
    .catch(() => {
      if (cfStatus){ cfStatus.className = 'form-status is-error'; cfStatus.textContent = "Couldn't send your message. Please check your connection and try again."; }
    })
    .finally(() => {
      if (cfSubmit){ cfSubmit.disabled = false; cfSubmit.textContent = cfDefaultLabel; }
    });
  });
}
