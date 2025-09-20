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
});
