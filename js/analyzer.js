const GEMINI_API_KEY = "AIzaSyDvqpCfM5Obdh4eBb1YIVZzt7qnhnPy_l8"; // 🔑 Replace with your actual key
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

async function analyzeATS(resumeText, jdText) {
  const prompt = `
Compare the following resume and job description.

Give:
1. A realistic ATS-style score out of 100.
2. A short summary of what matched.
3. Specific suggestions to improve the resume for this JD.

Resume:
${resumeText}

Job Description:
${jdText}
`;

  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    })
  });

  const data = await response.json();
  const output = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "No output.";

  return parseOutput(output);
}

function parseOutput(text) {
  const scoreMatch = text.match(/score\s*[:\-]?\s*(\d+)/i);
  const matchSummary = text.split("match")[1]?.split("suggest")[0]?.trim() || "Not found";
  const suggestions = text.split("suggest")[1]?.trim() || "Not found";

  return {
    score: scoreMatch ? scoreMatch[1] : "N/A",
    match: matchSummary,
    suggestions: suggestions
  };
}






