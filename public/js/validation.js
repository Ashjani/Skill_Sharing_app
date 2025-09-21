document.addEventListener("DOMContentLoaded", () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  // --- helpers ---
  function ensureHelper(input) {
    let helper = input.parentElement.querySelector(".helper-text.__dyn");
    if (!helper) {
      helper = document.createElement("span");
      helper.className = "helper-text __dyn";
      input.parentElement.appendChild(helper);
    }
    return helper;
  }

  function setError(input, message) {
    input.classList.add("invalid");
    const helper = ensureHelper(input);
    helper.textContent = message;
    helper.style.color = "#e53935";
    if (window.M && M.toast && !input.__toasted) {
      M.toast({ html: message, displayLength: 1800 });
      input.__toasted = true; // avoid spamming toast on every keystroke
      setTimeout(() => {
        input.__toasted = false;
      }, 1000);
    }
  }

  function clearError(input) {
    input.classList.remove("invalid");
    const helper = input.parentElement.querySelector(".helper-text.__dyn");
    if (helper) helper.textContent = "";
  }

  function required(input, label) {
    const val = input.value.trim();
    if (!val) {
      setError(input, `${label} is required.`);
      return false;
    }
    clearError(input);
    return true;
  }

  // ---------------- Register ----------------
  const registerForm = document.querySelector("form[action='/auth/register']");
  if (registerForm) {
    const firstName = registerForm.querySelector("#firstName");
    const lastName = registerForm.querySelector("#lastName");
    const email = registerForm.querySelector("#email");
    const password = registerForm.querySelector("#password");
    const accept = registerForm.querySelector("input[name='accept']");

    // live validation
    if (firstName)
      firstName.addEventListener("blur", () =>
        required(firstName, "First name")
      );
    if (lastName)
      lastName.addEventListener("blur", () => required(lastName, "Last name"));

    if (email) {
      email.addEventListener("input", () => {
        const v = email.value.trim();
        if (!v) setError(email, "Email address is required.");
        else if (!emailRegex.test(v))
          setError(email, "Please enter a valid email address.");
        else clearError(email);
      });
    }

    if (password) {
      password.addEventListener("input", () => {
        const v = password.value;
        if (!v) setError(password, "Password is required.");
        else if (v.length < 8)
          setError(password, "Password must be at least 8 characters.");
        else clearError(password);
      });
    }

    registerForm.addEventListener("submit", (e) => {
      let ok = true;

      if (firstName && !required(firstName, "First name")) ok = false;
      if (lastName && !required(lastName, "Last name")) ok = false;

      if (email) {
        const v = email.value.trim();
        if (!v) {
          setError(email, "Email address is required.");
          ok = false;
        } else if (!emailRegex.test(v)) {
          setError(email, "Please enter a valid email address.");
          ok = false;
        } else clearError(email);
      }

      if (password) {
        const v = password.value;
        if (!v) {
          setError(password, "Password is required.");
          ok = false;
        } else if (v.length < 8) {
          setError(password, "Password must be at least 8 characters.");
          ok = false;
        } else clearError(password);
      }

      if (accept && !accept.checked) {
        if (window.M && M.toast) {
          M.toast({
            html: "You must accept the Terms of Service and Privacy Policy.",
            displayLength: 2500,
          });
        }
        ok = false;
      }

      if (!ok) e.preventDefault();
    });
  }

  // ---------------- Login ----------------
  const loginForm = document.querySelector("form[action='/auth/login']");
  if (loginForm) {
    const email = loginForm.querySelector("#loginEmail");
    const password = loginForm.querySelector("#loginPassword");

    if (email) {
      email.addEventListener("input", () => {
        const v = email.value.trim();
        if (!v) setError(email, "Email address is required.");
        else if (!emailRegex.test(v))
          setError(email, "Please enter a valid email address.");
        else clearError(email);
      });
    }

    if (password) {
      password.addEventListener("input", () => {
        const v = password.value;
        if (!v) setError(password, "Password is required.");
        else clearError(password);
      });
    }

    loginForm.addEventListener("submit", (e) => {
      let ok = true;

      if (email) {
        const v = email.value.trim();
        if (!v) {
          setError(email, "Email address is required.");
          ok = false;
        } else if (!emailRegex.test(v)) {
          setError(email, "Please enter a valid email address.");
          ok = false;
        } else clearError(email);
      }

      if (password) {
        const v = password.value;
        if (!v) {
          setError(password, "Password is required.");
          ok = false;
        } else clearError(password);
      }

      if (!ok) e.preventDefault();
    });
  }

  // ---------------- Contact ----------------
const contactForm = document.getElementById("contactForm");
console.log("[validation] contactForm found?", !!contactForm);

if (contactForm) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  const phoneRegex = /^[+\d()\-.\s]{6,20}$/; // flexible but safe

  const firstName = contactForm.querySelector("#firstName");
  const lastName  = contactForm.querySelector("#lastName");
  const email     = contactForm.querySelector("#email");
  const phone     = contactForm.querySelector("#phone");
  const subject   = contactForm.querySelector("#subject"); // native <select>
  const message   = contactForm.querySelector("#message");
  const consent   = contactForm.querySelector("input[name='consent']"); // <-- correct

  // live validation
  firstName?.addEventListener("blur", () => required(firstName, "First name"));
  lastName?.addEventListener("blur",  () => required(lastName,  "Last name"));

  email?.addEventListener("input", () => {
    const v = email.value.trim();
    if (!v) setError(email, "Email address is required.");
    else if (!emailRegex.test(v)) setError(email, "Please enter a valid email address.");
    else clearError(email);
  });

  phone?.addEventListener("input", () => {
    const v = phone.value.trim();
    if (v && !phoneRegex.test(v)) setError(phone, "Enter a valid phone (digits, +, (), - allowed).");
    else clearError(phone);
  });

  message?.addEventListener("input", () => {
    const len = message.value.trim().length;
    if (len < 20) setError(message, "Message must be at least 20 characters.");
    else clearError(message);
  });

  // consent live toggle
  consent?.addEventListener("change", () => {
    if (consent.checked) clearError(consent);
    else setError(consent, "You must agree to receive communications before submitting.");
  });

  // Validate the select (Materialize-enhanced ok)
  function validateSelect(sel) {
    if (!sel || !sel.value) {
      const visible = sel.closest(".input-field")?.querySelector("input") || sel;
      setError(visible, "Please choose a subject.");
      return false;
    }
    const visible = sel.closest(".input-field")?.querySelector("input") || sel;
    clearError(visible);
    return true;
  }

  contactForm.addEventListener("submit", (e) => {
    let ok = true;

    if (!required(firstName, "First name")) ok = false;
    if (!required(lastName,  "Last name"))  ok = false;

    const eVal = email.value.trim();
    if (!eVal) { setError(email, "Email address is required."); ok = false; }
    else if (!emailRegex.test(eVal)) { setError(email, "Please enter a valid email address."); ok = false; }
    else clearError(email);

    const pVal = phone.value.trim();
    if (pVal && !phoneRegex.test(pVal)) { setError(phone, "Enter a valid phone."); ok = false; }
    else clearError(phone);

    if (!validateSelect(subject)) ok = false;

    const mVal = message.value.trim();
    if (mVal.length < 20) { setError(message, "Message must be at least 20 characters."); ok = false; }
    else clearError(message);

    if (consent && !consent.checked) {
      setError(consent, "You must agree to receive communications before submitting.");
      window.M?.toast && M.toast({ html: "Please agree to communications.", displayLength: 2000 });
      ok = false;
    }

    if (!ok) {
      e.preventDefault();
      window.M?.toast && M.toast({ html: "Please fix the highlighted fields.", displayLength: 2500 });
    } else {
      window.M?.toast && M.toast({ html: "Sending...", displayLength: 1200 });
    }
  });
}
});
