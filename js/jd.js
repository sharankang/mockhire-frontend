import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

if (localStorage.getItem("isLoggedIn") !== "true") {
  alert("You must log in first.");
  window.location.href = "index.html";
}

const API_KEY = "placeholder_for_api_key";   //Replace with you gemini api key
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

document.getElementById("jdForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const file = document.getElementById("jdFile").files[0];
  let jdText = document.getElementById("jdText").value.trim();
  const resultEl = document.getElementById("result");

  if (file) {
    resultEl.textContent = "📄 Reading JD PDF...";
    jdText = await extractTextFromPDF(file);
  }

  if (!jdText) {
    resultEl.textContent = "Please upload JD PDF or paste text.";
    return;
  }

  const resumeText = localStorage.getItem("resumeText");
  if (!resumeText) {
    resultEl.textContent = "Resume not found. Please upload resume again.";
    return;
  }

  resultEl.textContent = "Evaluating with AI...";
  const prompt = `
  You are an ATS evaluator. Compare this resume against this job description.
  
  Provide feedback in **markdown** with the following structure:

  ### ATS Score
  - XX/100

  ### Key Strengths
  - bullet points

  ### Gaps / Weaknesses
  - bullet points

  ### Suggestions for Improvement
  - bullet points

  Resume:
  ${resumeText}

  Job description:
  ${jdText}
  `;

  try {
    const res = await model.generateContent(prompt);
    const output = (await res.response.text()).trim();
    console.log("Gemini output:", output);
    resultEl.innerHTML = marked.parse(output);
  } catch (err) {
    console.error("Gemini error:", err);
    resultEl.textContent = "Error evaluating resume.";
  }
});

async function extractTextFromPDF(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async function () {
      try {
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item) => item.str);
          text += strings.join(" ") + "\n";
        }
        resolve(text.trim());
      } catch (e) {
        console.error("PDF read error:", e);
        resolve(null);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}
