import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

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

document.getElementById("resumeForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const fileInput = document.getElementById("resumeFile");
  const resultEl = document.getElementById("validationResult");

  if(fileInput.files.length === 0) {
    resultEl.textContent = "Please select a PDF file!";
    return;
  }

  const file = fileInput.files[0];
  resultEl.textContent = "Reading PDF...";
  const text = await extractTextFromPDF(file);

  if(!text) {
    resultEl.textContent = "❌ Could not read PDF.";
    return;
  }

  const requiredSections = ["education", "skills"];
  const missing = requiredSections.filter(section => !text.toLowerCase().includes(section));

  if (missing.length > 0) {
    resultEl.textContent = "⚠️ Missing sections: " + missing.join(", ");
    return;
  }

  localStorage.setItem("resumeText", text);

  users[activeUser].resumes.push({
    filename: file.name,
    date: new Date().toLocaleString(),
    text: text
  });
  localStorage.setItem("mockhireUsers", JSON.stringify(users));

  window.location.href = "jd.html";
});

async function extractTextFromPDF(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async function() {
      try {
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        let text = "";
        for(let i=1; i<=pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map(item => item.str);
          text += strings.join(" ") + "\n";
        }
        resolve(text.trim());
      } catch(e) {
        console.error(e);
        resolve(null);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}
