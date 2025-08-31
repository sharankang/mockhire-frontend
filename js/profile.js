if (localStorage.getItem("isLoggedIn") !== "true") {
  alert("You must log in first.");
  window.location.href = "login.html";
}

const activeUser = localStorage.getItem("activeUser");
let users = JSON.parse(localStorage.getItem("mockhireUsers") || "{}");

if (!activeUser || !users[activeUser]) {
  alert("Invalid session. Please log in again.");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("activeUser");
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const listEl = document.getElementById("resumeList");
  const resumeList = users[activeUser].resumes || [];

  if(resumeList.length === 0) {
    listEl.textContent = "You haven’t uploaded any resumes yet.";
    return;
  }

  const ul = document.createElement("ul");
  resumeList.forEach((resume, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${resume.filename}</strong> 
      <small>(${resume.date})</small>
      <button data-index="${index}" class="delete-btn">Delete</button>
    `;
    ul.appendChild(li);
  });
  listEl.appendChild(ul);

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = btn.getAttribute("data-index");
      users[activeUser].resumes.splice(idx, 1);
      localStorage.setItem("mockhireUsers", JSON.stringify(users));
      location.reload();
    });
  });
});
