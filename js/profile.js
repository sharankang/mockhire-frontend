document.addEventListener("DOMContentLoaded", () => {
  const listEl = document.getElementById("resumeList");
  const resumeList = JSON.parse(localStorage.getItem("resumeList") || "[]");

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
      resumeList.splice(idx, 1);
      localStorage.setItem("resumeList", JSON.stringify(resumeList));
      location.reload(); 
    });
  });
});
