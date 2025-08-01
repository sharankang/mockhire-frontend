// auth.js

let isSignIn = true;

document.getElementById("toggle-link").addEventListener("click", (e) => {
  e.preventDefault();
  isSignIn = !isSignIn;
  updateForm();
});

document.getElementById("auth-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const msg = document.getElementById("auth-msg");

  if (!email || !password) {
    msg.textContent = "All fields are required.";
    return;
  }

  if (isSignIn) {
    const storedUser = JSON.parse(localStorage.getItem(email));
    if (storedUser && storedUser.password === password) {
      msg.style.color = "green";
      msg.textContent = "Login successful! Redirecting...";
      setTimeout(() => {
        window.location.href = "upload.html";
      }, 1000);
    } else {
      msg.style.color = "red";
      msg.textContent = "Invalid email or password.";
    }
  } else {
    if (localStorage.getItem(email)) {
      msg.style.color = "red";
      msg.textContent = "User already exists.";
    } else {
      localStorage.setItem(email, JSON.stringify({ password }));
      msg.style.color = "green";
      msg.textContent = "Account created! You can now sign in.";
      isSignIn = true;
      updateForm();
    }
  }
});

function updateForm() {
  const title = document.getElementById("form-title");
  const submitBtn = document.getElementById("submit-btn");
  const toggleLink = document.getElementById("toggle-link");
  const msg = document.getElementById("auth-msg");

  title.textContent = isSignIn ? "Sign In" : "Sign Up";
  submitBtn.textContent = isSignIn ? "Sign In" : "Sign Up";
  toggleLink.textContent = isSignIn ? "Sign Up" : "Sign In";
  msg.textContent = "";
}
