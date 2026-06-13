/* =========================
   FORMAT RESPONSE (CLEAN CHAT STYLE)
========================= */
function formatResponse(text) {
    return text
        .replace(/^### (.*$)/gim, "<h3 style='color:#a78bfa;'>$1</h3>")
        .replace(/^## (.*$)/gim, "<h2 style='color:#38bdf8;'>$1</h2>")
        .replace(/^# (.*$)/gim, "<h1 style='color:#facc15;'>$1</h1>")
        .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        .replace(/^\* (.*$)/gim, "<li>$1</li>")
        .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
        .replace(/\n/g, "<br>");
}


/* =========================
   OPEN CHAT
========================= */
function openChat() {
    document.getElementById("chat-box").style.display = "block";
}


function sendChatMessage() {

    const message = document.getElementById("chat-message").value;

    document.getElementById("response-box").innerHTML = "⏳ Thinking...";

    fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("response-box").innerHTML =
            formatResponse(data.response);
    });

    document.getElementById("chat-message").value = "";
}

/* =========================
   NOTES + DOWNLOAD
========================= */
async function generateNotes() {

    const message = document.getElementById("message").value;

    document.getElementById("response-box").innerHTML = "⏳ Generating Notes...";

    const response = await fetch("http://127.0.0.1:8000/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });

    const data = await response.json();

    window.lastNotes = data.response;

    document.getElementById("response-box").innerHTML = `
        ${formatResponse(data.response)}
        <br><br>
        <button onclick="downloadNotes()">📥 Download Notes</button>
    `;

    document.getElementById("message").value = "";
}

function downloadNotes() {
    const blob = new Blob([window.lastNotes], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "notes.txt";
    link.click();
}


/* =========================
   QUIZ STATE RESET
========================= */
function clearUI() {
    document.getElementById("response-box").innerHTML = "";
    document.getElementById("quiz-box").innerHTML = "";
}


/* =========================
   GENERATE QUIZ (FIXED)
========================= */
async function generateQuiz() {

    clearUI(); // IMPORTANT FIX

    const message = document.getElementById("message").value;

    document.getElementById("quiz-box").innerHTML = "⏳ Creating Quiz...";

    const response = await fetch("http://127.0.0.1:8000/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });

    const data = await response.json();

    window.quizData = parseQuiz(data.response);

    renderQuiz(window.quizData);

    document.getElementById("message").value = "";
}


/* =========================
   FIXED PARSER (MAIN FIX)
========================= */
function parseQuiz(text) {

    const blocks = text.split("Question").filter(q => q.trim());

    return blocks.map(block => {

        const lines = block
            .split("\n")
            .map(l => l.trim())
            .filter(l => l);

        let question = "";
        let options = [];
        let answer = "";

        lines.forEach(line => {

            if (line.match(/^[0-9]*[:.]/)) {
                question = line;
            }

            if (line.match(/^[a-d]\)/i)) {
                options.push(line);
            }

            if (line.toLowerCase().includes("answer")) {
                answer = line.split(":")[1]?.trim().toLowerCase();
            }
        });

        return {
            question,
            options,
            answer,
            selected: null
        };
    });
}


/* =========================
   RENDER QUIZ (FIXED UI)
========================= */
function renderQuiz(quiz) {

    let html = "";

    quiz.forEach((q, index) => {

        html += `
            <div class="card">
                <p><b>${q.question || "Question missing"}</b></p>
        `;

        q.options.forEach(opt => {
            html += `
                <button onclick="selectAnswer(${index}, '${opt[0].toLowerCase()}')">
                    ${opt}
                </button>
            `;
        });

        html += `</div>`;
    });

    html += `<br><button onclick="submitQuiz()">Submit Quiz</button>`;

    document.getElementById("quiz-box").innerHTML = html;
}


/* =========================
   SELECT ANSWER
========================= */
function selectAnswer(index, answer) {
    window.quizData[index].selected = answer;
}


/* =========================
   SUBMIT QUIZ (FIXED SCORE)
========================= */
function submitQuiz() {

    let score = 0;

    let review = "";

    window.quizData.forEach((q, i) => {

        if (q.selected === q.answer) {
            score++;
        }

        review += `
            <div class="card">
                <p><b>Q${i + 1}:</b> ${q.question}</p>
                <p>Correct: ${q.answer}</p>
                <p>Your Answer: ${q.selected || "Not answered"}</p>
            </div>
        `;
    });

    document.getElementById("quiz-box").innerHTML = `
        <h2>Score: ${score}/${window.quizData.length}</h2>
        <br>
        ${review}
    `;
}


/* =========================
   SUMMARY (NO CHANGE)
========================= */
async function generateSummary() {

    const message = document.getElementById("message").value;

    document.getElementById("response-box").innerHTML = "⏳ Processing...";

    const response = await fetch("http://127.0.0.1:8000/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
    });

    const data = await response.json();

    document.getElementById("response-box").innerHTML =
        formatResponse(data.response);

    document.getElementById("message").value = "";
}