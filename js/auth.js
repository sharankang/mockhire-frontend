const signInBtn = document.getElementById("signInBtn");
const signUpBtn = document.getElementById("signUpBtn");
const authForm = document.getElementById("authForm");
const authMessage = document.getElementById("authMessage");

let mode = "signin";

signInBtn.addEventListener("click", () => {
  mode = "signin";
  signInBtn.classList.add("active");
  signUpBtn.classList.remove("active");
  authForm.querySelector(".btn-primary").textContent = "Sign In";
  authMessage.textContent = "";
});

signUpBtn.addEventListener("click", () => {
  mode = "signup";
  signUpBtn.classList.add("active");
  signInBtn.classList.remove("active");
  authForm.querySelector(".btn-primary").textContent = "Sign Up";
  authMessage.textContent = "";
});

authForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    authMessage.textContent = "Please enter username and password.";
    return;
  }

  let users = JSON.parse(localStorage.getItem("mockhireUsers") || "{}");

  if (mode === "signup") {
    if (users[username]) {
      authMessage.textContent = "Username already exists.";
    } else {
      users[username] = {
        password: password,
        resumes: [] // each user has their own resume list
      };
      localStorage.setItem("mockhireUsers", JSON.stringify(users));
      authMessage.textContent = "Sign up successful! Please sign in.";
      signInBtn.click();
    }
  } else if (mode === "signin") {
    if (users[username] && users[username].password === password) {
      authMessage.textContent = "Login successful!";
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("activeUser", username); // track who’s logged in
      window.location.href = "index.html";
    } else {
      authMessage.textContent = "Invalid username or password.";
    }
  }
});
