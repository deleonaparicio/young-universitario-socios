(function () {
  var config = window.LANDING_CONFIG || {};
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el && value) el.textContent = value;
  }

  function setLink(id, value, placeholderSuffix) {
    var el = document.getElementById(id);
    if (!el) return;

    var invalid = !value || value === '(Configurar link)';
    if (invalid) {
      el.href = '#';
      el.classList.add('pointer-events-none', 'opacity-60');
      if (placeholderSuffix) el.textContent = el.textContent + ' ' + placeholderSuffix;
      return;
    }

    el.href = value;
  }

  setText('heroTitle', 'Hacete socio de ' + (config.CLUB_NAME || 'Young Universitario'));
  setText('heroBadge', 'Campana de socios • ' + (config.CITY || 'Young, Uruguay'));
  setText('heroSubtitle', 'Apoyá al club en segundos: elegí plan, pagá fácil y completá tus datos para recibir tu carnet.');

  setText('priceMonthly', config.PRICE_MONTHLY || '(Configurar precio)');
  setText('priceYearly', config.PRICE_YEARLY || '(Configurar precio)');

  setLink('instagramTop', config.INSTAGRAM_URL);
  setLink('instagramBottom', config.INSTAGRAM_URL);
  setLink('payMonthly', config.MP_LINK_MONTHLY, '(Configurar link)');
  setLink('payYearly', config.MP_LINK_YEARLY, '(Configurar link)');
  setLink('formMonthly', config.FORM_URL, '(Configurar link)');
  setLink('formYearly', config.FORM_URL, '(Configurar link)');
  setLink('formBottom', config.FORM_URL, '(Configurar link)');

  var contactText = 'Instagram del club';
  if (config.CONTACT_WHATSAPP) {
    contactText = 'WhatsApp: ' + config.CONTACT_WHATSAPP;
  }

  setText('contactText', contactText);
  setText('contactFooter', 'Contacto: ' + contactText);

  var faqTriggers = document.querySelectorAll('.faq-trigger');
  faqTriggers.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      if (!item) return;

      var isOpen = item.classList.contains('open');
      item.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  var revealItems = document.querySelectorAll('.reveal');
  if (reducedMotion) {
    revealItems.forEach(function (el) {
      el.classList.add('in');
    });
    return;
  }

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealItems.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealItems.forEach(function (el) {
      el.classList.add('in');
    });
  }
})();
