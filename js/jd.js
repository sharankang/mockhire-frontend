import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const API_KEY = "ADD_GEMINI_API_KEY";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

document.getElementById("jdForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const file = document.getElementById("jdFile").files[0];
  let jdText = document.getElementById("jdText").value.trim();
  const resultEl = document.getElementById("result");

  if(file) {
    resultEl.textContent = "Reading JD PDF...";
    jdText = await extractTextFromPDF(file);
  }

  if(!jdText) {
    resultEl.textContent = "Please upload JD PDF or paste text.";
    return;
  }

  const resumeText = localStorage.getItem("resumeText");
  if(!resumeText) {
    resultEl.textContent = "Resume not found. Please upload resume again.";
    return;
  }

  resultEl.textContent = "Evaluating with AI...";
  const prompt = `You are an ATS system. Compare this resume against this job description.
Give:
- An ATS score out of 100
- 3-5 bullet point suggestions to improve the resume.

Resume:
${resumeText}

Job description:
${jdText}`;

  try {
    const res = await model.generateContent(prompt);
    const output = (await res.response.text()).trim();
    console.log("Gemini output:", output);
    resultEl.innerHTML = "<pre>" + output + "</pre>";
  } catch(err) {
    console.error("Gemini error:", err);
    resultEl.textContent = "Error evaluating resume.";
  }
});

// PDF.js reader
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
        console.error("PDF read error:", e);
        resolve(null);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}
