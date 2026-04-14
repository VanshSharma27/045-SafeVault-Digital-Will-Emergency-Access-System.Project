// ============================================================
// Project Title : Event Management Website
// File          : static/js/script.js
// Student Name  : ______________________________
// Roll Number   : ______________________________
// Date          : ______________________________
// ============================================================

// ── Mobile nav toggle ──
function toggleMenu() {
  document.querySelector('.nav-links').classList.toggle('open');
}

// ── Auto-dismiss flash messages after 4 seconds ──
document.addEventListener('DOMContentLoaded', function () {
  const flashes = document.querySelectorAll('.flash');
  flashes.forEach(flash => {
    setTimeout(() => {
      flash.style.transition = 'opacity .5s';
      flash.style.opacity = '0';
      setTimeout(() => flash.remove(), 500);
    }, 4000);
  });

  // ── Pre-select event from query param on register page ──
  const params   = new URLSearchParams(window.location.search);
  const eventSel = document.getElementById('event_id');
  if (eventSel && params.get('event')) {
    eventSel.value = params.get('event');
  }
});
