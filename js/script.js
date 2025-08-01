
// // script.js
// document.getElementById("loginBtn").addEventListener("click", function () {
//   const username = document.getElementById("username").value.trim();
//   const password = document.getElementById("password").value.trim();

//   if (username && password) {
//     document.getElementById("authSection").classList.add("hidden");
//     document.getElementById("mainApp").classList.remove("hidden");
//   } else {
//     alert("Please enter both username and password.");
//   }
// });

// // Replace this with your own Gemini 1.5 Flash API key
// const GEMINI_API_KEY = "AIzaSyATsejWMFwg-eWtQU7ViDF_JHSeNBO9L1c";

// async function callGeminiAPI(promptText) {
//   const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       contents: [
//         {
//           parts: [
//             { text: promptText }
//           ]
//         }
//       ]
//     })
//   });

//   const data = await response.json();
//   const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from Gemini.";
//   return reply;
// }


// document.getElementById("analyzeBtn").addEventListener("click", async () => {
//   const resume = document.getElementById("resumeText").value.trim();
//   const jd = document.getElementById("jdText").value.trim();

//   if (!resume || !jd) {
//     alert("Please paste both resume and job description.");
//     return;
//   }

//   const prompt = `Compare the following resume with the job description and give:
// 1. A short match percentage.
// 2. 3 strengths from the resume.
// 3. 3 suggestions to improve resume fit.

// Resume:
// ${resume}

// Job Description:
// ${jd}`;

//   document.getElementById("aiFeedback").innerText = "Analyzing...";
//   document.getElementById("aiResult").classList.remove("hidden");

//   try {
//     const result = await callGeminiAPI(prompt);
//     document.getElementById("aiFeedback").innerHTML = result.replace(/\n/g, "<br>");
//   } catch (err) {
//     document.getElementById("aiFeedback").innerText = "Something went wrong. Please try again.";
//   }
// });








document.getElementById("atsForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const resume = document.getElementById("resume").value.trim();
  const jd = document.getElementById("jd").value.trim();

  if (!resume || !jd) {
    alert("Please enter both resume and job description.");
    return;
  }

  try {
    const { score, match, suggestions } = await analyzeATS(resume, jd);

    document.getElementById("score").textContent = score;
    document.getElementById("match").textContent = match;
    document.getElementById("suggestions").textContent = suggestions;

    document.getElementById("result").classList.remove("hidden");
    document.querySelector(".form-section").classList.add("hidden");
  } catch (error) {
    alert("Something went wrong while analyzing.");
    console.error(error);
  }
});

function resetForm() {
  document.getElementById("atsForm").reset();
  document.getElementById("result").classList.add("hidden");
  document.querySelector(".form-section").classList.remove("hidden");
}
