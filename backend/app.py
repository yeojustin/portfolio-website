import json
import os
import re
from pathlib import Path
from urllib import error, parse, request

from dotenv import load_dotenv
from flask import Flask, jsonify, request as flask_request, send_from_directory

BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent

load_dotenv(BASE_DIR / ".env")
load_dotenv(PROJECT_DIR / ".env")

RAG_DIR = BASE_DIR / "rag"
CV_FILE = RAG_DIR / "cv.md"
GITHUB_FILE = RAG_DIR / "github.md"

PORT = int(os.getenv("PORT", "3000"))
GITHUB_USERNAME = os.getenv("GITHUB_USERNAME", "").strip()
CHATBOT_MODE = "poc_no_llm"

app = Flask(__name__, static_folder=str(PROJECT_DIR), static_url_path="")


def tokenize(text: str) -> list[str]:
    cleaned = re.sub(r"[^a-z0-9\s]", " ", text.lower())
    return [token for token in cleaned.split() if len(token) > 2]


def split_into_chunks(text: str, chunk_size: int = 480) -> list[str]:
    cleaned = text.replace("\r", "").strip()
    if not cleaned:
        return []

    paragraphs = re.split(r"\n\s*\n", cleaned)
    chunks: list[str] = []
    current = ""

    for paragraph in paragraphs:
        candidate = f"{current}\n\n{paragraph}" if current else paragraph
        if len(candidate) > chunk_size and current:
            chunks.append(current.strip())
            current = paragraph
        else:
            current = candidate

    if current:
        chunks.append(current.strip())
    return chunks


def score_chunk(chunk: str, query_tokens: list[str]) -> int:
    chunk_tokens = set(tokenize(chunk))
    return sum(1 for token in query_tokens if token in chunk_tokens)


def read_file_if_exists(file_path: Path) -> str:
    try:
        return file_path.read_text(encoding="utf-8")
    except OSError:
        return ""


def fetch_github_context() -> str:
    if not GITHUB_USERNAME:
        return ""

    url = (
        f"https://api.github.com/users/"
        f"{parse.quote(GITHUB_USERNAME)}/repos?sort=updated&per_page=8"
    )
    req = request.Request(url, headers={"Accept": "application/vnd.github+json"})

    try:
        with request.urlopen(req, timeout=10) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except (error.URLError, error.HTTPError, json.JSONDecodeError, TimeoutError):
        return ""

    if not isinstance(payload, list) or not payload:
        return ""

    lines = []
    for repo in payload:
        if not isinstance(repo, dict):
            continue
        name = repo.get("name") or "unknown-repo"
        stars = repo.get("stargazers_count", 0)
        language = repo.get("language") or "n/a"
        description = repo.get("description")
        desc_text = f" - {description}" if description else ""
        lines.append(f"- {name} (stars: {stars}, language: {language}){desc_text}")

    if not lines:
        return ""

    return f"Live GitHub repos for {GITHUB_USERNAME}:\n" + "\n".join(lines)


def build_rag_context(question: str) -> str:
    cv_text = read_file_if_exists(CV_FILE)
    github_local = read_file_if_exists(GITHUB_FILE)
    github_live = fetch_github_context()

    merged_parts = []
    if cv_text:
        merged_parts.append(f"CV CONTEXT\n{cv_text}")
    if github_local:
        merged_parts.append(f"GITHUB NOTES CONTEXT\n{github_local}")
    if github_live:
        merged_parts.append(f"GITHUB LIVE CONTEXT\n{github_live}")

    if not merged_parts:
        return "No RAG docs found yet. Add backend/rag/cv.md and backend/rag/github.md for better answers."

    merged = "\n\n".join(merged_parts)
    query_tokens = tokenize(question)
    chunks = split_into_chunks(merged)

    ranked = sorted(
        [{"chunk": chunk, "score": score_chunk(chunk, query_tokens)} for chunk in chunks],
        key=lambda item: item["score"],
        reverse=True,
    )[:4]

    return "\n\n---\n\n".join(item["chunk"] for item in ranked)


def build_poc_reply(message: str, context: str) -> str:
    lowered = message.lower()

    if any(word in lowered for word in ["hello", "hi", "hey"]):
        return (
            "Hey! I am Justin Yeo's assistant. "
            "Ask me about 0->1 projects, Google Cloud delivery, technical stack, or how to contact Justin."
        )

    if any(word in lowered for word in ["contact", "reach", "email", "telegram", "hire"]):
        return "Best way to reach Justin is via Telegram, LinkedIn, or Email from the portfolio links."

    if any(word in lowered for word in ["stack", "tech", "tools", "backend", "frontend", "arsenal"]):
        return (
            "Justin's technical arsenal includes Google ADK, Vertex AI, Gemini 1.5, "
            "RAG pipelines, prompt engineering, TypeScript (Next.js), Python (FastAPI/Flask), C++, C, and GCP."
        )

    if any(word in lowered for word in ["google", "hackathon", "vp", "bank", "poc", "impact"]):
        return (
            "At Google Cloud, Justin solutioned and delivered 7 enterprise AI POCs for Tier-1 global banks, "
            "won 2 hackathons (including Top 3 out of 300+ APAC teams), and drove VP-level alignment "
            "for global open-source adoption of an internal agentic workflow."
        )

    if any(word in lowered for word in ["project", "github", "portfolio", "build"]):
        return (
            "Key 0->1 builds include Better Resume Builder (ADK + TypeScript + LaTeX), "
            "Large-DF-Reader-CPP (high-performance C++ CLI), Two-Do List (Next.js), and Unix-Shell-V4 (C)."
        )

    snippets = [chunk.strip() for chunk in context.split("\n\n---\n\n") if chunk.strip()]
    if snippets:
        top_two = snippets[:2]
        bullets = "\n\n".join(f"- {chunk[:420]}" for chunk in top_two)
        return (
            "Here is what I found from Justin's portfolio knowledge base:\n\n"
            f"{bullets}\n\n"
            "Ask a more specific question for a better targeted answer."
        )

    return (
        "I do not have enough context yet. Please add more details in "
        "backend/rag/cv.md and backend/rag/github.md."
    )


@app.route("/api/chat", methods=["POST"])
def chat() -> tuple:
    payload = flask_request.get_json(silent=True) or {}
    message = str(payload.get("message", "")).strip()

    if not message:
        return jsonify({"error": "Message is required."}), 400

    context = build_rag_context(message)
    reply = build_poc_reply(message, context)
    return jsonify({"reply": reply})


@app.route("/api/health", methods=["GET"])
def health() -> tuple:
    return (
        jsonify(
            {
                "ok": True,
                "mode": CHATBOT_MODE,
                "hasGithubUsername": bool(GITHUB_USERNAME),
            }
        ),
        200,
    )


@app.route("/", methods=["GET"])
def index() -> tuple:
    return send_from_directory(PROJECT_DIR, "index.html")


@app.route("/<path:asset_path>", methods=["GET"])
def static_files(asset_path: str):
    file_path = PROJECT_DIR / asset_path
    if file_path.exists() and file_path.is_file():
        return send_from_directory(PROJECT_DIR, asset_path)
    return ("Not Found", 404)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT, debug=False)
