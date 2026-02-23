(function () {
  var config = window.LANDING_CONFIG || {};
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var RATE_LIMIT_MS = 45000;
  var RATE_LIMIT_KEY = 'young_socios_last_submit_at';

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el && value) el.textContent = value;
  }

  function setLink(id, value, placeholderSuffix) {
    var el = document.getElementById(id);
    if (!el) return;

    var invalid = !value || value.indexOf('(Configurar') === 0;
    if (invalid) {
      el.href = '#';
      el.classList.add('pointer-events-none', 'opacity-60');
      if (placeholderSuffix && el.textContent.indexOf(placeholderSuffix) === -1) {
        el.textContent = el.textContent + ' ' + placeholderSuffix;
      }
      return;
    }

    el.href = value;
  }

  function toWhatsappUrl(phone, message) {
    if (!phone) return '';
    var cleanPhone = String(phone).replace(/[^\d]/g, '');
    if (!cleanPhone) return '';
    var text = encodeURIComponent(message || 'Hola! Quiero hacerme socio de Young Universitario.');
    return 'https://wa.me/' + cleanPhone + '?text=' + text;
  }

  function getUtmParams() {
    var params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get('utm_source') || '',
      utm_medium: params.get('utm_medium') || '',
      utm_campaign: params.get('utm_campaign') || '',
      utm_content: params.get('utm_content') || '',
      utm_term: params.get('utm_term') || '',
    };
  }

  function setStatus(message, type) {
    var statusEl = document.getElementById('formStatus');
    if (!statusEl) return;

    statusEl.textContent = message || '';
    statusEl.classList.remove('text-zinc-700', 'text-clubRed', 'text-emerald-700');

    if (type === 'error') {
      statusEl.classList.add('text-clubRed');
    } else if (type === 'success') {
      statusEl.classList.add('text-emerald-700');
    } else {
      statusEl.classList.add('text-zinc-700');
    }
  }

  function setSubmitting(isSubmitting) {
    var button = document.getElementById('submitButton');
    if (!button) return;

    button.disabled = isSubmitting;
    button.textContent = isSubmitting ? 'Enviando...' : 'Enviar datos';
  }

  function secondsRemaining() {
    var lastSubmitAt = Number(localStorage.getItem(RATE_LIMIT_KEY) || '0');
    if (!lastSubmitAt) return 0;

    var diff = Date.now() - lastSubmitAt;
    if (diff >= RATE_LIMIT_MS) return 0;

    return Math.ceil((RATE_LIMIT_MS - diff) / 1000);
  }

  function readFileAsBase64(file) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        var result = reader.result || '';
        var base64 = String(result).split(',')[1] || '';
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function setMemberType(type) {
    var hidden = document.getElementById('memberTypeHidden');
    var newFields = document.getElementById('newMemberFields');
    var renewFields = document.getElementById('renewMemberFields');
    var newRequired = document.querySelectorAll('[data-required-new]');
    var renewRequired = document.querySelectorAll('[data-required-renew]');

    if (hidden) hidden.value = type;

    if (type === 'renovacion') {
      if (newFields) newFields.classList.add('hidden');
      if (renewFields) renewFields.classList.remove('hidden');
      newRequired.forEach(function (el) {
        el.required = false;
      });
      renewRequired.forEach(function (el) {
        el.required = true;
      });
    } else {
      if (newFields) newFields.classList.remove('hidden');
      if (renewFields) renewFields.classList.add('hidden');
      newRequired.forEach(function (el) {
        el.required = true;
      });
      renewRequired.forEach(function (el) {
        el.required = false;
      });
    }
  }

  function handleMemberTypeSwitch() {
    var radios = document.querySelectorAll('input[name="memberType"]');
    radios.forEach(function (radio) {
      radio.addEventListener('change', function (event) {
        setMemberType(event.target.value);
      });
    });

    var checked = document.querySelector('input[name="memberType"]:checked');
    setMemberType(checked ? checked.value : 'nuevo');
  }

  function handleFaq() {
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
  }

  function handleReveal() {
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
  }

  function handleBenefitsCarousel() {
    var track = document.getElementById('benefitsTrack');
    var prev = document.getElementById('benefitsPrev');
    var next = document.getElementById('benefitsNext');
    if (!track || !prev || !next) return;

    var scrollAmount = function () {
      return Math.max(track.clientWidth * 0.82, 280);
    };

    prev.addEventListener('click', function () {
      track.scrollBy({ left: -scrollAmount(), behavior: reducedMotion ? 'auto' : 'smooth' });
    });

    next.addEventListener('click', function () {
      track.scrollBy({ left: scrollAmount(), behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  async function submitForm(event) {
    event.preventDefault();

    var form = event.currentTarget;
    var formData = new FormData(form);
    var memberType = formData.get('member_type') || 'nuevo';

    if (formData.get('company')) {
      setStatus('No se pudo enviar. Probá nuevamente.', 'error');
      return;
    }

    if (!form.reportValidity()) {
      setStatus('Revisá los campos obligatorios.', 'error');
      return;
    }

    var remaining = secondsRemaining();
    if (remaining > 0) {
      setStatus('Esperá ' + remaining + ' segundos antes de volver a enviar.', 'error');
      return;
    }

    if (!config.N8N_WEBHOOK_URL || config.N8N_WEBHOOK_URL.indexOf('(Configurar') === 0) {
      setStatus('Falta configurar N8N_WEBHOOK_URL en config.js.', 'error');
      return;
    }

    if (!config.FORM_KEY || config.FORM_KEY.indexOf('(Configurar') === 0) {
      setStatus('Falta configurar FORM_KEY en config.js.', 'error');
      return;
    }

    var ci = memberType === 'renovacion' ? String(formData.get('ci_renew') || '').trim() : String(formData.get('ci_new') || '').trim();

    if (memberType === 'renovacion' && /[^0-9]/.test(ci)) {
      setStatus('Para renovación ingresá la cédula sin puntos ni guiones.', 'error');
      return;
    }

    var payload = {
      createdAt: new Date().toISOString(),
      pageUrl: window.location.href,
      member_type: memberType,
      nombre: memberType === 'renovacion' ? '' : String(formData.get('nombre') || '').trim(),
      ci: ci,
      telefono: memberType === 'renovacion' ? '' : String(formData.get('telefono_whatsapp') || '').trim(),
      email: memberType === 'renovacion' ? '' : String(formData.get('email') || '').trim(),
      plan: String(formData.get('plan') || '').trim(),
      payment_ref: String(formData.get('payment_ref') || '').trim(),
    };

    var paymentProof = formData.get('payment_proof');
    if (memberType === 'renovacion' && paymentProof && paymentProof.size > 0) {
      if (paymentProof.size > 4 * 1024 * 1024) {
        setStatus('El comprobante supera 4MB. Subí un archivo más liviano.', 'error');
        return;
      }

      try {
        payload.payment_proof = {
          fileName: paymentProof.name,
          mimeType: paymentProof.type || 'application/octet-stream',
          base64: await readFileAsBase64(paymentProof),
        };
      } catch (fileError) {
        setStatus('No se pudo leer el comprobante. Probá con otro archivo.', 'error');
        return;
      }
    }

    var utm = getUtmParams();
    payload.utm_source = utm.utm_source;
    payload.utm_medium = utm.utm_medium;
    payload.utm_campaign = utm.utm_campaign;
    payload.utm_content = utm.utm_content;
    payload.utm_term = utm.utm_term;

    setSubmitting(true);
    setStatus('Enviando...', 'info');

    try {
      var response = await fetch(config.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-FORM-KEY': config.FORM_KEY,
        },
        body: JSON.stringify(payload),
      });

      var responseData = null;
      try {
        responseData = await response.json();
      } catch (parseError) {
        responseData = null;
      }

      if (!response.ok) {
        var errorMessage =
          (responseData && responseData.message) || 'No se pudo enviar. Verificá tu conexión e intentá de nuevo.';
        throw new Error(errorMessage);
      }

      var successMessage =
        (responseData && responseData.ok === true && responseData.message) ||
        '¡Listo! Tus datos fueron enviados correctamente.';

      localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
      form.reset();
      setMemberType('nuevo');
      setStatus(successMessage, 'success');
    } catch (error) {
      setStatus(error.message || 'Error inesperado al enviar el formulario.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  function init() {
    setText('heroTitle', 'Hacete socio de ' + (config.CLUB_NAME || 'Young Universitario'));
    setText('heroBadge', 'Campaña de socios • ' + (config.CITY || 'Young, Uruguay'));
    setText('priceMonthly', config.PRICE_MONTHLY || '(Configurar precio)');
    setText('priceYearly', config.PRICE_YEARLY || '(Configurar precio)');

    setLink('instagramTop', config.INSTAGRAM_URL);
    setLink('instagramBottom', config.INSTAGRAM_URL);
    setLink('payMonthly', config.MP_LINK_MONTHLY, '(Configurar link)');
    setLink('payYearly', config.MP_LINK_YEARLY, '(Configurar link)');

    var whatsappUrl = toWhatsappUrl(config.CONTACT_WHATSAPP, config.WHATSAPP_MESSAGE);
    setLink('whatsappTop', whatsappUrl);
    setLink('whatsappBottom', whatsappUrl);

    var contactText = 'Instagram del club';
    if (config.CONTACT_WHATSAPP) {
      contactText = 'WhatsApp: ' + config.CONTACT_WHATSAPP;
    } else if (config.CONTACT_EMAIL) {
      contactText = 'Email: ' + config.CONTACT_EMAIL;
    }

    setText('contactText', contactText);
    setText('contactFooter', 'Contacto: ' + contactText);

    var form = document.getElementById('socioForm');
    if (form) {
      form.addEventListener('submit', submitForm);
    }

    handleMemberTypeSwitch();
    handleBenefitsCarousel();
    handleFaq();
    handleReveal();
  }

  init();
})();
