(function () {
  function toast(html, ms = 2000) {
    if (window.M && M.toast) M.toast({ html, displayLength: ms });
    else alert(html);
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (window.M && M.FormSelect) {
      const elems = document.querySelectorAll("select");
      M.FormSelect.init(elems);
    }
  });

  function token() {
    return localStorage.getItem("token");
  }
  function authHeaders() {
    const h = { "Content-Type": "application/json" };
    const t = token();
    if (t) h["Authorization"] = `Bearer ${t}`; // optional, cookie will still work
    return h;
  }
  function requireLogin() {
    toast("Please log in to continue", 2500);
    window.location.href =
      "/login?next=" + encodeURIComponent(window.location.pathname);
  }
  async function ok(res) {
    if (res.status === 401) {
      requireLogin();
      throw new Error("Unauthorized");
    }
    if (!res.ok) throw new Error("Request failed");
    try {
      return await res.json();
    } catch {
      return {};
    }
  }

  // New booking form -> POST /api/bookings/request/:serviceId
  const newForm = document.getElementById("new-booking-form");
  if (newForm) {
    newForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const sel = newForm.querySelector('[name="serviceId"]');
      const serviceId = sel && sel.value ? sel.value : null;
      if (!serviceId) return toast("Please select a service", 2500);

      try {
        await fetch(`/api/bookings/request/${serviceId}`, {
          method: "POST",
          headers: authHeaders(), // sends Bearer if present
          credentials: "same-origin", // send httpOnly cookie
          // body not required by your API yet
        }).then(ok);

        toast("Booking request sent!", 2000);
        window.location.reload();
      } catch (err) {
        console.error(err);
        toast("Booking failed", 3000);
      }
    });
  }

  // Accept / Decline buttons
  document.querySelectorAll(".js-accept").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      try {
        await fetch(`/api/bookings/${id}/accept`, {
          method: "POST",
          headers: authHeaders(),
          credentials: "same-origin",
        }).then(ok);
        toast("Accepted", 1500);
        window.location.reload();
      } catch {
        toast("Failed to accept", 2500);
      }
    });
  });

  document.querySelectorAll(".js-decline").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      try {
        await fetch(`/api/bookings/${id}/decline`, {
          method: "POST",
          headers: authHeaders(),
          credentials: "same-origin",
        }).then(ok);
        toast("Declined", 1500);
        window.location.reload();
      } catch {
        toast("Failed to decline", 2500);
      }
    });
  });

  // Quick message form -> POST /api/bookings/:id/message
  document.querySelectorAll(".js-quick-message").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = form.dataset.id;
      const text = (new FormData(form).get("text") || "").trim();
      if (!text) return;

      try {
        await fetch(`/api/bookings/${id}/message`, {
          method: "POST",
          headers: authHeaders(),
          credentials: "same-origin",
          body: JSON.stringify({ text }),
        }).then(ok);
        toast("Message sent", 1500);
        form.reset();
      } catch {
        toast("Failed to send message", 2500);
      }
    });
  });
})();
