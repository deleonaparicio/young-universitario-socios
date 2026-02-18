(function () {
  var config = window.LANDING_CONFIG || {};

  function text(id, value) {
    var el = document.getElementById(id);
    if (el && value) el.textContent = value;
  }

  function setLink(id, url) {
    var el = document.getElementById(id);
    if (!el) return;

    var invalid = !url || url === '(Configurar link)';
    if (invalid) {
      el.href = '#';
      el.classList.add('disabled');
      if (
        id === 'payMonthly' ||
        id === 'payYearly' ||
        id === 'formMonthly' ||
        id === 'formYearly' ||
        id === 'formBottom' ||
        id === 'quickForm'
      ) {
        el.textContent = el.textContent + ' (Configurar link)';
      }
      return;
    }

    el.href = url;
  }

  text('heroTitle', 'Hacete socio de ' + (config.CLUB_NAME || 'Young Universitario'));
  text(
    'heroSubtitle',
    'Apoyá al club de ' + (config.CITY || 'Young') + ' con una cuota simple. Pagás en segundos y listo.'
  );

  text('priceMonthly', config.PRICE_MONTHLY || '$ 0 / mes');
  text('priceYearly', config.PRICE_YEARLY || '$ 0 / año');

  setLink('instagramTop', config.INSTAGRAM_URL);
  setLink('instagramBottom', config.INSTAGRAM_URL);
  setLink('payMonthly', config.MP_LINK_MONTHLY);
  setLink('payYearly', config.MP_LINK_YEARLY);
  setLink('formMonthly', config.FORM_URL);
  setLink('formYearly', config.FORM_URL);
  setLink('formBottom', config.FORM_URL);
  setLink('quickForm', config.FORM_URL);

  var contactText = document.getElementById('contactText');
  if (contactText) {
    if (config.CONTACT_WHATSAPP) {
      contactText.textContent = 'Escribinos por WhatsApp: ' + config.CONTACT_WHATSAPP;
    } else if (config.CONTACT_EMAIL) {
      contactText.textContent = 'Escribinos por email: ' + config.CONTACT_EMAIL;
    } else {
      contactText.textContent = 'Contactanos por Instagram para ayudarte.';
    }
  }

  var revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add('is-visible');
    });
  }
})();
