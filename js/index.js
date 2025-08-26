document.addEventListener("DOMContentLoaded", () => {
  const authBtn = document.getElementById("auth-btn");
  const getStartedBtn = document.getElementById("getStartedBtn");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (isLoggedIn) {
    // Show Logout
    authBtn.textContent = "Log Out";
    authBtn.href = "#"; // prevent going to login
    getStartedBtn.style.display = "none"; // hide "Get Started" button

    authBtn.addEventListener("click", () => {
      localStorage.setItem("isLoggedIn", "false");
      localStorage.removeItem("loggedInUser");
      window.location.href = "login.html";
    });

  } else {
    // Show Sign In
    authBtn.textContent = "Sign In";
    authBtn.href = "login.html";
    getStartedBtn.style.display = "block"; // make sure button is visible
  }
});
