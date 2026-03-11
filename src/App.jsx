/** @format */
import { useState } from "react";
import "./App.css";
// import QuizInput from "./components/QuizInput";
import Quiz from "./components/Quiz";
import { parseQuizMarkdown } from "./utils/parser";

const STEPS = [
  {
    num: "01",
    title: "Open the Website",
    icon: "🌐",
    items: [
      "Open your web browser (Chrome, Edge, Firefox, etc.)",
      <>
        Go to:{" "}
        <a
          href="https://nec-license.gitbook.io/books"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#f472b6", textDecoration: "none", fontWeight: 700 }}
        >
          nec-license.gitbook.io/books ↗
        </a>
      </>,
    ],
  },
  {
    num: "02",
    title: "Select the Course",
    icon: "📚",
    items: [
      "Click the course selector dropdown on the page",
      'Choose your course (e.g., "computer-license")',
      "The selected course content will load",
    ],
  },
  {
    num: "03",
    title: "Open Chapter / Page",
    icon: "📖",
    items: [
      "From the left sidebar (GitBook navigation), click the chapter or section",
      'Example: "NEC-License-Computer"',
      "Wait until the content page fully loads",
    ],
  },
  {
    num: "04",
    title: "Copy the Markdown",
    icon: "📋",
    items: [
      'Look at the top-right corner — click the "Copy ▾" button',
      "GitBook automatically copies the Markdown to your clipboard",
      "✅ Markdown text is now copied!",
    ],
  },
  {
    num: "05",
    title: "Paste into the Text Box",
    icon: "✍️",
    items: [
      "Click inside the textbox below",
      "Paste: Windows Ctrl+V  |  Mac ⌘+V",
      "Markdown content will appear in the textbox",
    ],
  },
  {
    num: "06",
    title: "Verify & Start",
    icon: "✅",
    items: [
      "Check headings (#, ##), bullet points (-, *), and formatting",
      'Click "Start Quiz" and you\'re done!',
      "🎉 All set — enjoy your quiz!",
    ],
  },
];

import { Component } from "react";
import Question from "./components/Question";

function QuizInput({ onStart }) {
  const [text, setText] = useState("");
  const [openStep, setOpenStep] = useState(null);

  return (
    <div style={{ width: "100%", maxWidth: 820, margin: "0 auto" }}>
      {/* Step Guide */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <span
            style={{
              display: "inline-block",
              background: "#FEF3C7",
              color: "#92400E",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 3,
              textTransform: "uppercase",
              padding: "5px 16px",
              borderRadius: 999,
              marginBottom: 12,
            }}
          >
            How It Works
          </span>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: "#1C1917",
              margin: "0 0 6px",
              fontFamily: "'Georgia', serif",
              letterSpacing: "-0.5px",
            }}
          >
            Step-by-Step Guide
          </h2>
          <p style={{ color: "#78716C", fontSize: 14, margin: 0 }}>
            Click any step to see the details
          </p>
        </div>

        {/* Flow Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 4,
            background: "#FFFBEB",
            border: "1px solid #FDE68A",
            borderRadius: 12,
            padding: "12px 20px",
            marginBottom: 20,
          }}
        >
          {[
            "Open Site",
            "Select Course",
            "Open Chapter",
            "Copy Markdown",
            "Paste Content",
            "Start Quiz",
          ].map((l, i, arr) => (
            <span
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 4 }}
            >
              <span
                style={{
                  background: i === 5 ? "#D97706" : "#fff",
                  border: i === 5 ? "none" : "1px solid #FDE68A",
                  color: i === 5 ? "#fff" : "#92400E",
                  borderRadius: 7,
                  padding: "4px 12px",
                  fontSize: 12,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                {l}
              </span>
              {i < arr.length - 1 && (
                <span style={{ color: "#F59E0B", fontSize: 13 }}>→</span>
              )}
            </span>
          ))}
        </div>

        {/* Step Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: 10,
          }}
        >
          {STEPS.map((s, i) => (
            <div
              key={i}
              onClick={() => setOpenStep(openStep === i ? null : i)}
              style={{
                background: openStep === i ? "#FFFBEB" : "#fff",
                border: `1px solid ${openStep === i ? "#F59E0B" : "#E7E5E4"}`,
                borderRadius: 12,
                padding: "16px 18px",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow:
                  openStep === i
                    ? "0 4px 20px rgba(245,158,11,0.15)"
                    : "0 1px 4px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#D97706",
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      fontFamily: "monospace",
                    }}
                  >
                    Step {s.num}
                  </div>
                  <div
                    style={{ fontSize: 15, fontWeight: 700, color: "#1C1917" }}
                  >
                    {s.title}
                  </div>
                </div>
                <span
                  style={{
                    color: "#F59E0B",
                    fontSize: 20,
                    transform: openStep === i ? "rotate(90deg)" : "none",
                    transition: "transform 0.2s",
                  }}
                >
                  ›
                </span>
              </div>
              {openStep === i && (
                <ul
                  style={{
                    margin: "12px 0 0",
                    padding: "12px 0 0",
                    borderTop: "1px solid #FDE68A",
                    listStyle: "none",
                  }}
                >
                  {s.items.map((item, j) => (
                    <li
                      key={j}
                      style={{
                        fontSize: 13.5,
                        color: "#44403C",
                        lineHeight: 1.8,
                        display: "flex",
                        gap: 8,
                      }}
                    >
                      <span style={{ color: "#F59E0B", flexShrink: 0 }}>›</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Input Card */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #E7E5E4",
          borderRadius: 20,
          padding: "36px 40px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.07)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 6,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#F59E0B",
              display: "inline-block",
            }}
          />
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              margin: 0,
              color: "#1C1917",
              fontFamily: "'Georgia', serif",
            }}
          >
            Paste Quiz Markdown
          </h2>
        </div>
        <p
          style={{
            color: "#78716C",
            fontSize: 14,
            margin: "0 0 20px",
            lineHeight: 1.6,
          }}
        >
          Complete Steps 1–5 above, then paste your copied GitBook markdown
          below.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste markdown here (e.g., #### 1. Question...)"
          rows={10}
          style={{
            width: "100%",
            background: "#FAFAF9",
            border: "1.5px solid #E7E5E4",
            borderRadius: 12,
            color: "#1C1917",
            fontSize: 14,
            padding: "14px 16px",
            resize: "vertical",
            fontFamily: "'Courier New', monospace",
            lineHeight: 1.7,
            boxSizing: "border-box",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#F59E0B")}
          onBlur={(e) => (e.target.style.borderColor = "#E7E5E4")}
        />
        {text.trim() && (
          <p
            style={{
              fontSize: 12,
              color: "#059669",
              margin: "8px 0 0",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#059669",
                display: "inline-block",
              }}
            />
            {text.length} characters ready
          </p>
        )}
        <button
          onClick={() => text.trim() && onStart(text)}
          disabled={!text.trim()}
          style={{
            width: "100%",
            marginTop: 20,
            padding: "16px",
            background: text.trim()
              ? "linear-gradient(135deg, #F59E0B, #D97706)"
              : "#E7E5E4",
            border: "none",
            borderRadius: 12,
            color: text.trim() ? "#fff" : "#A8A29E",
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: 1,
            cursor: text.trim() ? "pointer" : "not-allowed",
            textTransform: "uppercase",
            transition: "all 0.2s",
            fontFamily: "'Georgia', serif",
          }}
        >
          {text.trim() ? "Start Quiz →" : "Paste Markdown to Begin"}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [quizData, setQuizData] = useState(null);

  const handleStartQuiz = (markdownContent) => {
    try {
      const questions = parseQuizMarkdown(markdownContent);
      if (questions.length > 0) setQuizData(questions);
      else
        alert(
          "No questions found! Please check the markdown format.\n\nExpected format:\n#### 1. Question text\n- [ ] Option A\n- [x] Correct option\n- [ ] Option C",
        );
    } catch (e) {
      console.error("Error parsing markdown:", e);
      alert("Error parsing markdown. See console for details.");
    }
  };

  const handleReset = () => {
    setQuizData(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#FAF9F7",
        fontFamily: "'Segoe UI', Tahoma, sans-serif",
      }}
    >
      {/* Subtle top accent */}
      <div
        style={{
          height: 4,
          background: "linear-gradient(90deg, #F59E0B, #D97706, #92400E)",
        }}
      />

      <header
        style={{
          padding: "32px 24px 20px",
          textAlign: "center",
          borderBottom: "1px solid #E7E5E4",
          background: "#fff",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: "#D97706",
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          ✦ Learning Tool
        </div>
        <h1
          style={{
            fontSize: "clamp(28px,5vw,48px)",
            fontWeight: 900,
            color: "#1C1917",
            margin: 0,
            fontFamily: "'Georgia', serif",
            letterSpacing: "-1px",
          }}
        >
          Markdown Quiz
        </h1>
        <p style={{ color: "#78716C", fontSize: 15, margin: "8px 0 0" }}>
          Paste GitBook markdown and test your knowledge instantly
        </p>
      </header>

      <main
        style={{
          padding: "40px 24px 80px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {!quizData ? (
          <QuizInput onStart={handleStartQuiz} />
        ) : (
          <Quiz questions={quizData} onReset={handleReset} />
        )}
      </main>
    </div>
  );
}
