/**
 * MedPREP pricing — single source of truth.
 *
 * Time-boxed launch discount: PKR 999 (was PKR 1,699, "41% off"),
 * active now through September 20, 2026 (inclusive, Asia/Karachi time).
 * After the cutoff, every page on the site automatically reverts to the
 * standing price (PKR 1,700, was PKR 2,500) with no manual toggle needed.
 *
 * Any page that shows a price includes this file and marks the relevant
 * element with a `data-price="..."` attribute (see below) so it updates
 * itself automatically. To change the discount, edit PROMO/STANDING/
 * PROMO_CUTOFF below — nothing else needs to change.
 */
(function () {
  'use strict';

  // Inclusive through end-of-day Sep 20, 2026 in Pakistan Standard Time (UTC+5).
  var PROMO_CUTOFF = new Date('2026-09-20T23:59:59+05:00');

  var PROMO = { original: 1699, active: 999, label: '41% off' };
  var STANDING = { original: 2500, active: 1700, label: '32% off' };

  var pricing = (new Date() <= PROMO_CUTOFF) ? PROMO : STANDING;

  function fmt(n) {
    return n.toLocaleString('en-PK');
  }

  function applyPricing() {
    // Bare number only, e.g. "1,700"
    document.querySelectorAll('[data-price="active-num"]').forEach(function (el) {
      el.textContent = fmt(pricing.active);
    });
    document.querySelectorAll('[data-price="original-num"]').forEach(function (el) {
      el.textContent = fmt(pricing.original);
    });
    // "PKR 1,700"
    document.querySelectorAll('[data-price="active-full"]').forEach(function (el) {
      el.textContent = 'PKR ' + fmt(pricing.active);
    });
    document.querySelectorAll('[data-price="original-full"]').forEach(function (el) {
      el.textContent = 'PKR ' + fmt(pricing.original);
    });
    // "41% off" / "32% off"
    document.querySelectorAll('[data-price="label"]').forEach(function (el) {
      el.textContent = pricing.label;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyPricing);
  } else {
    applyPricing();
  }

  // Exposed so pages with their own pricing logic (e.g. register.html's
  // checkout flow) can read the current numbers directly instead of
  // duplicating the cutoff/amount logic.
  window.MEDPREP_PRICING = pricing;
})();
