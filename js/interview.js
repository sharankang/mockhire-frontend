import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const API_KEY = "placeholder_for_api_key"; // Replace with you gemini api key
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

let jdContext = "";
let chatHistory = [];
let questionCount = 0;
let maxQuestions = 5;

const jdForm = document.getElementById("jdForm");
const chatContainer = document.getElementById("chat-container");
const chatBox = document.getElementById("chat-box");
const userAnswerInput = document.getElementById("userAnswer");
const sendBtn = document.getElementById("sendAnswer");
const finalScoreEl = document.getElementById("finalScore");

jdForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = document.getElementById("jdFile").files[0];
  jdContext = document.getElementById("jdText").value.trim();

  if (file) {
    jdContext = await extractTextFromPDF(file);
  }

  if (!jdContext) {
    alert("Please upload or paste a job description first.");
    return;
  }

  jdForm.style.display = "none";
  chatContainer.style.display = "block";
  startSimulation();
});

function startSimulation() {
  appendMessage("AI", "Let's start your interview! First question: <em>Tell me about yourself.</em>");
}

sendBtn.addEventListener("click", async () => {
  const answer = userAnswerInput.value.trim();
  if (!answer) return;

  appendMessage("You", answer);
  userAnswerInput.value = "";

  chatHistory.push({ role: "user", content: answer });
  questionCount++;

  if (questionCount >= maxQuestions) {
    await giveFinalFeedback();
    return;
  }

  const prompt = `
  You are an interviewer. Based on the job description:
  ${jdContext}
  
  Candidate's last answer: "${answer}"
  
  Ask the next realistic interview question (short and natural).
  `;

  try {
    const res = await model.generateContent(prompt);
    const nextQuestion = (await res.response.text()).trim();
    appendMessage("AI", nextQuestion);
  } catch (err) {
    console.error("Error:", err);
    appendMessage("AI", "Sorry, I had trouble generating the next question.");
  }
});

async function giveFinalFeedback() {
  const prompt = `
  You are an interview coach. Based on this interview simulation:

  Job Description: ${jdContext}
  Answers: ${chatHistory.map(h => `${h.role}: ${h.content}`).join("\n")}

  Provide feedback in this **structured format**:

  ### Strengths
  - bullet points

  ### Weaknesses
  - bullet points

  ### Suggestions
  - bullet points

  ### Final Score
  - Score: XX/100
  `;

  try {
    const res = await model.generateContent(prompt);
    const feedback = (await res.response.text()).trim();

    finalScoreEl.innerHTML = marked.parse(feedback); // Render markdown properly
    chatContainer.style.display = "none";
    finalScoreEl.style.display = "block";
  } catch (err) {
    console.error("Error:", err);
    finalScoreEl.textContent = "Error generating feedback.";
  }
}

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("chat-message");
  msg.innerHTML = `<strong>${sender}:</strong> ${text}`;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function extractTextFromPDF(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async function() {
      try {
        const typedarray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map(item => item.str);
          text += strings.join(" ") + "\n";
        }
        resolve(text);
      } catch (e) {
        console.error("PDF read error:", e);
        resolve(null);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}
