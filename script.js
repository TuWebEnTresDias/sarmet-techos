(() => {
  'use strict';

  const defaultPhone = document.documentElement.dataset.defaultPhone || '';
  const params = new URLSearchParams(window.location.search);

  function toWhatsAppNumber(value) {
    if (typeof value !== 'string' || value.length > 32 || !/^\+?[\d\s().-]+$/.test(value.trim())) return null;

    let digits = value.replace(/\D/g, '');
    if (digits.startsWith('00')) digits = digits.slice(2);

    if (digits.startsWith('549') && digits.length === 13) {
      const national = digits.slice(3);
      return /^\d{10}$/.test(national) && !/^(\d)\1+$/.test(national) ? digits : null;
    }

    if (digits.startsWith('54') && digits.length === 12) digits = digits.slice(2);
    else if (digits.startsWith('0') && digits.length === 11) digits = digits.slice(1);

    if (!/^\d{10}$/.test(digits) || /^(\d)\1+$/.test(digits) || digits.startsWith('15')) return null;
    return '549' + digits;
  }

  const phoneValues = params.getAll('t');
  const phone = phoneValues.length === 0
    ? toWhatsAppNumber(defaultPhone)
    : phoneValues.length === 1
      ? toWhatsAppNumber(phoneValues[0])
      : null;

  function buildWhatsAppUrl(message) {
    const url = new URL('https://wa.me/');
    url.pathname = '/' + phone;
    url.searchParams.set('text', message);
    return url.toString();
  }

  document.querySelectorAll('[data-whatsapp]').forEach((link) => {
    if (!phone) {
      link.removeAttribute('href');
      link.setAttribute('aria-disabled', 'true');
      return;
    }

    const isModel = link.dataset.whatsapp === 'model';
    const model = link.dataset.model || '';
    const message = isModel
      ? 'Hola, Sarmet. Me interesa consultar por el modelo de referencia "' + model + '". ¿Lo realizan? Quisiera contarles sobre mi proyecto.'
      : 'Hola, Sarmet. Quiero consultar por un trabajo de techos en Catamarca Capital.';
    link.href = buildWhatsAppUrl(message);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  if (!phone) {
    const status = document.querySelector('[data-contact-status]');
    if (status) {
      status.textContent = 'No se pudo preparar el enlace de WhatsApp. Revisá el teléfono del enlace e intentá de nuevo.';
      status.hidden = false;
    }
  }

  const year = document.getElementById('currentYear');
  if (year) year.textContent = String(new Date().getFullYear());

  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileNav');

  if (toggle && menu) {
    const setMenuOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      menu.hidden = !open;
      menu.toggleAttribute('inert', !open);
    };

    toggle.addEventListener('click', () => {
      setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false);
        toggle.focus();
      }
    });
  }
})();
