import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const API_KEY = "ADD_GEMINI_API_KEY"; 
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

document.getElementById("resumeForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const fileInput = document.getElementById("resumeFile");
  const resultEl = document.getElementById("validationResult");

  if(fileInput.files.length === 0) {
    resultEl.textContent = "Please select a PDF file.";
    return;
  }

  const file = fileInput.files[0];
  resultEl.textContent = "Reading PDF..."; 
  const text = await extractTextFromPDF(file);

  if(!text) {
    resultEl.textContent = "Could not read PDF.";
    return;
  }

  resultEl.textContent = "Checking resume with AI...";

  const prompt = `Check if this resume text includes these keywords: "Skills", "Experience", "Education". 
List missing keywords, or say "valid" if all are present. Resume text:
${text}`;

  try {
    const res = await model.generateContent(prompt);
    const output = res.response.text().trim().toLowerCase();
    console.log("Gemini output:", output);

    if(output.includes("valid")) {
      const resumeList = JSON.parse(localStorage.getItem("resumeList") || "[]");
      resumeList.push({
        filename: file.name,
        date: new Date().toLocaleString()
      });
      localStorage.setItem("resumeList", JSON.stringify(resumeList));
      localStorage.setItem("resumeText", text);





//////////////
      window.location.href = "jd.html";
    } else {
      resultEl.textContent = "Missing keywords: " + output;
    }
  } catch (err) {
    console.error("Error:", err);
    resultEl.textContent = "Error checking resume.";
  }
});

// PDF.js extraction
async function extractTextFromPDF(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async function() {
      try {
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument(typedarray).promise;
        let text = "";
        for(let i=1; i<=pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map(item => item.str);
          text += strings.join(" ") + "\n";
        }
        resolve(text);
      } catch(e) {
        console.error(e);
        resolve(null);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}
