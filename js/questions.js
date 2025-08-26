import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const API_KEY = "placeholder_for_api_key";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

document.getElementById("questionForm").addEventListener("submit", async function(e) {
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

  resultEl.textContent = "Generating questions with AI...";
  const prompt = `You are an interview coach. Generate 5-10 relevant interview questions (both technical and behavioral) 
that could be asked for a candidate applying to this job, based on this job description:
${jdText}`;

  try {
    const res = await model.generateContent(prompt);
    const output = (await res.response.text()).trim();
    console.log("Gemini output:", output);

    resultEl.innerHTML = `
      <div class="suggestions-title">Suggested Interview Questions:</div>
      <div class="suggestions-text">${output}</div>
    `;
  } catch (err) {
    console.error("Gemini error:", err);
    resultEl.textContent = "Error generating questions.";
  }
});

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
