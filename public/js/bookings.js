// public/js/bookings.js
(function () {
  function token() {
    return localStorage.getItem('token');
  }
  function authHeaders() {
    return {
      'Authorization': `Bearer ${token()}`,
      'Content-Type': 'application/json'
    };
  }
  function requireLogin() {
    M && M.toast ? M.toast({ html: 'Please log in to continue', displayLength: 2500 }) : alert('Please log in to continue');
    window.location.href = '/login?next=' + encodeURIComponent(window.location.pathname);
  }
  function ok(res) {
    if (res.status === 401) requireLogin();
    if (!res.ok) throw new Error('Request failed');
    return res.json().catch(() => ({}));
  }

  // New booking form -> POST /api/bookings/request/:serviceId
  const newForm = document.getElementById('new-booking-form');
  if (newForm) {
    newForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const t = token(); if (!t) return requireLogin();

      // serviceId can come from hidden input OR select
      const sel = newForm.querySelector('[name="serviceId"]');
      const serviceId = sel && sel.value ? sel.value : null;
      if (!serviceId) return M.toast({ html: 'Please select a service', displayLength: 2500 });

      try {
        const res = await fetch(`/api/bookings/request/${serviceId}`, {
          method: 'POST',
          headers: authHeaders()
          // body not required by your API; date/time/notes are currently cosmetic
        }).then(ok);

        M.toast({ html: 'Booking request sent!', displayLength: 2000 });
        // Reload or navigate to bookings list
        window.location.reload();
      } catch (err) {
        M.toast({ html: 'Booking failed', displayLength: 3000 });
        console.error(err);
      }
    });
  }

  // Accept / Decline buttons
  document.querySelectorAll('.js-accept').forEach(btn => {
    btn.addEventListener('click', async () => {
      const t = token(); if (!t) return requireLogin();
      const id = btn.dataset.id;
      try {
        await fetch(`/api/bookings/${id}/accept`, { method: 'POST', headers: authHeaders() }).then(ok);
        M.toast({ html: 'Accepted', displayLength: 1500 });
        window.location.reload();
      } catch (e) {
        M.toast({ html: 'Failed to accept', displayLength: 2500 });
      }
    });
  });

  document.querySelectorAll('.js-decline').forEach(btn => {
    btn.addEventListener('click', async () => {
      const t = token(); if (!t) return requireLogin();
      const id = btn.dataset.id;
      try {
        await fetch(`/api/bookings/${id}/decline`, { method: 'POST', headers: authHeaders() }).then(ok);
        M.toast({ html: 'Declined', displayLength: 1500 });
        window.location.reload();
      } catch (e) {
        M.toast({ html: 'Failed to decline', displayLength: 2500 });
      }
    });
  });

  // Quick message form -> POST /api/bookings/:id/message
  document.querySelectorAll('.js-quick-message').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const t = token(); if (!t) return requireLogin();
      const id = form.dataset.id;
      const text = (new FormData(form).get('text') || '').trim();
      if (!text) return;
      try {
        await fetch(`/api/bookings/${id}/message`, {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify({ text })
        }).then(ok);
        M.toast({ html: 'Message sent', displayLength: 1500 });
        form.reset();
      } catch (e2) {
        M.toast({ html: 'Failed to send message', displayLength: 2500 });
      }
    });
  });
})();
