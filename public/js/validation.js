document.addEventListener("DOMContentLoaded", () => {
  /*  Login Form */
  const loginForm = document.querySelector("form[action='/auth/login']");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      const email = loginForm.querySelector("#loginEmail");
      const password = loginForm.querySelector("#loginPassword");

      if (!email.value.includes("@")) {
        e.preventDefault();
        alert("Please enter a valid email address.");
        email.focus();
      } else if (password.value.length < 6) {
        e.preventDefault();
        alert("Password must be at least 6 characters.");
        password.focus();
      }
    });
  }

  /* Registration Form  */
  const registerForm = document.querySelector("form[action='/auth/register']");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      const firstName = registerForm.querySelector("#firstName");
      const lastName = registerForm.querySelector("#lastName");
      const email = registerForm.querySelector("#email");
      const password = registerForm.querySelector("#password");
      const accept = registerForm.querySelector("input[name='accept']");

      if (firstName.value.trim() === "") {
        e.preventDefault();
        alert("First name is required.");
        firstName.focus();
      } else if (lastName.value.trim() === "") {
        e.preventDefault();
        alert("Last name is required.");
        lastName.focus();
      } else if (!email.value.includes("@")) {
        e.preventDefault();
        alert("Please enter a valid email.");
        email.focus();
      } else if (password.value.length < 8) {
        e.preventDefault();
        alert("Password must be at least 8 characters.");
        password.focus();
      } else if (!accept.checked) {
        e.preventDefault();
        alert("You must accept the Terms of Service and Privacy Policy.");
      }
    });
  }
});
