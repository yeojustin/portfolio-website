const chatBody = document.getElementById("chatBody");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const clearChatBtn = document.getElementById("clearChatBtn");
const helloBtn = document.getElementById("helloBtn");
const leftPane = document.getElementById("leftPane");
const quickTemplateButtons = document.querySelectorAll(".quick-template");

const LINKS = {
  github: "https://github.com/yeojustin",
  linkedin: "https://www.linkedin.com/in/justinyeo177",
  resume:
    "https://drive.google.com/file/d/1i0R7KawB4l4v5WFFYbwySkblLhCRkFfp/view?usp=sharing",
  email: "mailto:yeojustinnn@gmail.com",
};

const JUSTIN_KB = {
  intro: [
    "Justin is an AI Product Engineer and 0->1 Builder.",
    "He focuses on vibe coding, agentic workflows, and fast MVP execution.",
  ],
  google: [
    "Google Cloud (AI/ML Solutions Engineer Trainee): architected an internal agentic AI solution.",
    "Delivered PRD + Google ADK architecture + GTM strategy.",
    "Reduced manual workflows by 50% and secured VP-level alignment for global open-source adoption.",
  ],
  wins: [
    "2x hackathon winner.",
    "2nd runner-up (Top 3) out of 300+ teams in an APAC-wide internal Google hackathon.",
  ],
  enterprise: [
    "Delivered 7 enterprise AI POCs for Tier-1 global banks.",
    "Focused on RAG pipelines, LLM evaluation frameworks, and Gemini-based solutioning.",
  ],
  stack: [
    "Google ADK, Vertex AI, Gemini 1.5",
    "TypeScript/Next.js, JavaScript, Python (FastAPI/Flask), C++, C",
    "GCP, RAG, prompt engineering, LLM fine-tuning",
  ],
  projects: [
    "Better Resume Builder (TypeScript + LaTeX + ADK)",
    "Large-DF-Reader-CPP (high-performance C++ CLI)",
    "Two-Do List (Next.js)",
    "Unix-Shell-V4 (C)",
  ],
};

function starterMarkup() {
  return `
    <div class="starter-wrap">
      <button class="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-600 shadow-soft transition hover:-translate-y-0.5 hover:bg-slate-50" id="helloBtn" type="button">
        Start quick chat (basic Q&A)
      </button>
    </div>
  `;
}

function formatBotReply(text) {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const withLineBreaks = escaped.replace(/\n/g, "<br>");

  const withLinks = withLineBreaks.replace(/(https?:\/\/[^\s<]+)/g, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });

  return withLinks.replace(
    /\bmailto:[^\s<]+/g,
    (emailLink) => `<a href="${emailLink}">${emailLink.replace("mailto:", "")}</a>`
  );
}

function appendMessage(role, text) {
  const starterWrap = chatBody.querySelector(".starter-wrap");
  if (starterWrap) starterWrap.remove();

  const bubble = document.createElement("div");
  bubble.className = `chat-message ${role}`;
  if (role === "bot") {
    bubble.innerHTML = formatBotReply(text);
  } else {
    bubble.textContent = text;
  }
  chatBody.appendChild(bubble);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function appendStatusMessage(text) {
  const status = document.createElement("div");
  status.className = "chat-message bot";
  status.textContent = text;
  status.dataset.status = "true";
  chatBody.appendChild(status);
  chatBody.scrollTop = chatBody.scrollHeight;
  return status;
}

function buildFrontendReply(message) {
  const q = message.toLowerCase();

  if (/(where.*portfolio|portfolio link|portfolio url)/.test(q)) {
    return [
      "You can find Justin's work here:",
      `- GitHub: ${LINKS.github}`,
      `- Resume: ${LINKS.resume}`,
      `- LinkedIn: ${LINKS.linkedin}`,
    ].join("\n");
  }

  if (/(hello|hi|hey)/.test(q)) {
    return [
      "Hey! Note: this chatbot is still work in progress.",
      "It can answer basic questions for now.",
      ...JUSTIN_KB.intro,
    ].join("\n");
  }
  if (/(google|vp|hackathon|impact|bank|poc)/.test(q)) {
    return ["Google Experience:", ...JUSTIN_KB.google, ...JUSTIN_KB.wins, ...JUSTIN_KB.enterprise]
      .map((line, i) => (i === 0 ? line : `- ${line}`))
      .join("\n");
  }
  if (/(stack|tech|arsenal|tools|language|framework)/.test(q)) {
    return ["Technical Stack:", ...JUSTIN_KB.stack]
      .map((line, i) => (i === 0 ? line : `- ${line}`))
      .join("\n");
  }
  if (/(project|portfolio|github|build)/.test(q)) {
    return [
      "Portfolio Projects:",
      ...JUSTIN_KB.projects.map((p) => `- ${p}`),
      `- GitHub: ${LINKS.github}`,
      `- Resume: ${LINKS.resume}`,
    ].join("\n");
  }
  if (/(contact|reach|email|linkedin|resume|hire)/.test(q)) {
    return [
      "You can reach Justin here:",
      `- LinkedIn: ${LINKS.linkedin}`,
      `- Email: ${LINKS.email}`,
      `- GitHub: ${LINKS.github}`,
      `- Resume: ${LINKS.resume}`,
    ].join("\n");
  }

  return [
    ...JUSTIN_KB.intro,
    "",
    "Quick links:",
    `- GitHub: ${LINKS.github}`,
    `- LinkedIn: ${LINKS.linkedin}`,
    `- Resume: ${LINKS.resume}`,
  ].join("\n");
}

async function handleUserMessage(message) {
  if (!message.trim()) return;
  appendMessage("user", message.trim());

  const loading = appendStatusMessage("Thinking...");
  window.setTimeout(() => {
    loading.remove();
    appendMessage("bot", buildFrontendReply(message.trim()));
  }, 280);
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const message = chatInput.value;
  chatInput.value = "";
  handleUserMessage(message);
});

if (helloBtn) {
  helloBtn.addEventListener("click", () => {
    handleUserMessage("Hi Justin, tell me about your work.");
  });
}

clearChatBtn.addEventListener("click", () => {
  chatBody.innerHTML = starterMarkup();
  const resetHelloBtn = document.getElementById("helloBtn");
  if (resetHelloBtn) {
    resetHelloBtn.addEventListener("click", () => {
      handleUserMessage("Hi Justin, tell me about your work.");
    });
  }
});

quickTemplateButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const templateQuestion = button.dataset.question || "";
    if (!templateQuestion) return;
    chatInput.value = "";
    handleUserMessage(templateQuestion);
  });
});

if (leftPane) {
  leftPane.addEventListener("mousemove", (event) => {
    const rect = leftPane.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    leftPane.style.setProperty("--mx", `${x}%`);
    leftPane.style.setProperty("--my", `${y}%`);
  });

  leftPane.addEventListener("mouseleave", () => {
    leftPane.style.setProperty("--mx", "50%");
    leftPane.style.setProperty("--my", "50%");
  });
}
