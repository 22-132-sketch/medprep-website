/**
 * MedPREP pricing — single source of truth.
 *
 * Time-boxed launch discount: PKR 999 (was PKR 1,699, "41% off"),
 * active now through September 20, 2026 (inclusive, Asia/Karachi time).
 * After the cutoff, every page on the site automatically reverts to the
 * standing price (Full plan PKR 1,699, was PKR 2,500) with no manual toggle needed.
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
  var STANDING = { original: 2500, active: 1699, label: '32% off' };

  var pricing = (new Date() <= PROMO_CUTOFF) ? PROMO : STANDING;

  // Plans (Session 2b). ONE table for the site; keep keys in sync with the admin (js/premium.js)
  // and the app (Public/plans.js). Any two 999 plans cost more than Full, so a second plan is an
  // upgrade to Full for +PKR 700. 'active-num' above is the Full price.
  var PLANS = {
    full:     { label: 'Full',               price: 1699, features: ['MCQs', 'Notes', 'Flashcards', 'OSPE', '360\u00b0 View', 'Challenge a friend'] },
    mcq_fc:   { label: 'MCQs + Flashcards',  price: 999,  features: ['MCQs', 'Flashcards', 'Challenge a friend'] },
    notes_fc: { label: 'Notes + Flashcards', price: 999,  features: ['Notes', 'Flashcards'] },
    ospe:     { label: 'OSPE + Flashcards',  price: 999,  features: ['OSPE', 'Flashcards'] },
    upgrade:  { label: 'Upgrade to Full',    price: 700,  features: [] }
  };

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
    // Per-plan prices: data-price="plan-mcq_fc" -> "999" ; data-price="plan-full" -> "1,699"
    document.querySelectorAll('[data-price^="plan-"]').forEach(function (el) {
      var k = el.getAttribute('data-price').slice(5);
      if (PLANS[k]) el.textContent = fmt(PLANS[k].price);
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
  window.MEDPREP_PLANS = PLANS;
})();
