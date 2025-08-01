document.getElementById("uploadForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const resumeText = document.getElementById("resume").value.toLowerCase();
  const jdText = document.getElementById("jd").value.toLowerCase();

  const jdWords = jdText.split(/\W+/).filter(word => word.length > 3);
  const resumeWords = resumeText.split(/\W+/);

  let matchCount = 0;
  jdWords.forEach(word => {
    if (resumeWords.includes(word)) {
      matchCount++;
    }
  });

  const score = Math.min(100, Math.round((matchCount / jdWords.length) * 100));

  document.getElementById("matchScoreText").innerHTML = `
    🔍 Match Score: <strong>${score}%</strong><br><br>
    ${score > 70 ? "✅ Great fit! Your resume aligns well with the JD." :
                   score > 40 ? "⚠️ Decent match. You might want to tweak your resume." :
                   "❌ Low match. Try tailoring your resume to this role."}
  `;

  document.getElementById("matchResult").classList.remove("hidden");
  document.querySelector(".upload-section").classList.add("hidden");
});



function resetUploadForm() {
  document.getElementById("uploadForm").reset();
  document.getElementById("matchResult").classList.add("hidden");
  document.querySelector(".upload-section").classList.remove("hidden");
}







console.log("Upload logic will go here...");
