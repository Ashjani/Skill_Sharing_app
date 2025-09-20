document.addEventListener("DOMContentLoaded", () => {
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i; 
  // Utility functions
  function ensureHelper(input) {
    // Check if a helper text span already exists
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
    if (window.M && M.toast) {
      
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

  // Register Form

  const registerForm = document.querySelector("form[action='/auth/register']");
  if (registerForm) {
    const firstName = registerForm.querySelector("#firstName");
    const lastName = registerForm.querySelector("#lastName");
    const email = registerForm.querySelector("#email");
    const password = registerForm.querySelector("#password");
    const accept = registerForm.querySelector("input[name='accept']");

    // live validation
    firstName.addEventListener("blur", () => required(firstName, "First name"));
    lastName.addEventListener("blur", () => required(lastName, "Last name"));

    email.addEventListener("input", () => {
      const val = email.value.trim();
      if (!val) {
        setError(email, "Email address is required.");
      } else if (!emailRegex.test(val)) {
        setError(email, "Please enter a valid email address.");
      } else {
        clearError(email);
      }
    });

    password.addEventListener("input", () => {
      const val = password.value;
      if (!val) {
        setError(password, "Password is required.");
      } else if (val.length < 8) {
        setError(password, "Password must be at least 8 characters.");
      } else {
        clearError(password);
      }
    });

    registerForm.addEventListener("submit", (e) => {
      let ok = true;

      if (!required(firstName, "First name")) ok = false;
      if (!required(lastName, "Last name")) ok = false;

      const eVal = email.value.trim();
      if (!eVal) {
        setError(email, "Email address is required.");
        ok = false;
      } else if (!emailRegex.test(eVal)) {
        setError(email, "Please enter a valid email address.");
        ok = false;
      } else {
        clearError(email);
      }

      const pVal = password.value;
      if (!pVal) {
        setError(password, "Password is required.");
        ok = false;
      } else if (pVal.length < 8) {
        setError(password, "Password must be at least 8 characters.");
        ok = false;
      } else {
        clearError(password);
      }

      if (!accept.checked) {
        
        if (window.M && M.toast) {
          M.toast({
            html:
              "You must accept the Terms of Service and Privacy Policy to continue.",
            displayLength: 2500,
          });
        }
        ok = false;
      }

      if (!ok) e.preventDefault();
    });
  }

  // login Form

  const loginForm = document.querySelector("form[action='/auth/login']");
  if (loginForm) {
    const email = loginForm.querySelector("#loginEmail");
    const password = loginForm.querySelector("#loginPassword");

    email.addEventListener("input", () => {
      const val = email.value.trim();
      if (!val) {
        setError(email, "Email address is required.");
      } else if (!emailRegex.test(val)) {
        setError(email, "Please enter a valid email address.");
      } else {
        clearError(email);
      }
    });

    password.addEventListener("input", () => {
      const val = password.value;
      if (!val) {
        setError(password, "Password is required.");
      } else {
        clearError(password);
      }
    });

    loginForm.addEventListener("submit", (e) => {
      let ok = true;

      const eVal = email.value.trim();
      if (!eVal) {
        setError(email, "Email address is required.");
        ok = false;
      } else if (!emailRegex.test(eVal)) {
        setError(email, "Please enter a valid email address.");
        ok = false;
      } else {
        clearError(email);
      }

      const pVal = password.value;
      if (!pVal) {
        setError(password, "Password is required.");
        ok = false;
      } else {
        clearError(password);
      }

      if (!ok) e.preventDefault();
    });
  }
});
