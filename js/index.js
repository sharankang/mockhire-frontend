document.addEventListener("DOMContentLoaded", () => {
  const authBtn = document.getElementById("auth-btn");
  const getStartedBtn = document.getElementById("getStartedBtn");
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (isLoggedIn) {
    // Show Logout
    authBtn.textContent = "Log Out";
    authBtn.href = "#";
    getStartedBtn.style.display = "none";

    authBtn.addEventListener("click", () => {
      localStorage.setItem("isLoggedIn", "false");
      localStorage.removeItem("loggedInUser");
      window.location.href = "login.html";
    });

  } else {
    authBtn.textContent = "Sign In";
    authBtn.href = "login.html";
    getStartedBtn.style.display = "block";
  }
});
