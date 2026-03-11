/** @format */
import { useState, useEffect, useCallback } from "react";

// ── Markdown-bold renderer ────────────────────────────────────────────────────
function RenderMarkdown({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") && p.endsWith("**") ? (
          <strong key={i} style={{ color: "#92400E", fontWeight: 800 }}>
            {p.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({ current, total, correct }) {
  const pct = (current / total) * 100;
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#78716C",
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          Question {current} of {total}
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#059669" }}>
          ✓ {correct} correct
        </span>
      </div>
      <div
        style={{
          height: 6,
          background: "#E7E5E4",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: "linear-gradient(90deg, #F59E0B, #D97706)",
            borderRadius: 999,
            transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>
    </div>
  );
}

// ── Keyboard Hint Bar ─────────────────────────────────────────────────────────
function KeyboardHint({ revealed, canGoPrev }) {
  const keys = revealed
    ? [
        { key: "Enter", label: "Next" },
        { key: "→", label: "Next" },
        ...(canGoPrev ? [{ key: "←", label: "Prev" }] : []),
      ]
    : [
        { key: "A–D", label: "Select" },
        { key: "1–4", label: "Select" },
        { key: "Enter", label: "Submit" },
        { key: "H", label: "Hint" },
        ...(canGoPrev ? [{ key: "←", label: "Prev" }] : []),
      ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 14,
        opacity: 0.72,
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "#A8A29E",
          letterSpacing: 1,
          textTransform: "uppercase",
          marginRight: 4,
        }}
      >
        ⌨ Keys
      </span>
      {keys.map(({ key, label }) => (
        <span
          key={key}
          style={{ display: "flex", alignItems: "center", gap: 4 }}
        >
          <kbd
            style={{
              background: "#F5F5F4",
              border: "1px solid #D6D3D1",
              borderBottom: "2px solid #A8A29E",
              borderRadius: 5,
              padding: "2px 7px",
              fontSize: 11,
              fontFamily: "monospace",
              fontWeight: 700,
              color: "#44403C",
            }}
          >
            {key}
          </kbd>
          <span style={{ fontSize: 11, color: "#A8A29E" }}>{label}</span>
        </span>
      ))}
    </div>
  );
}

// ── Option Button ─────────────────────────────────────────────────────────────
// mode: "normal" | "hint" | "revealed"
// hint  → correct option glows green (★), others fade
// revealed → correct = green ✓, wrong-selected = red ✗, others fade
function OptionButton({ opt, index, selected, correct, mode, onClick }) {
  const letters = ["A", "B", "C", "D"];
  const isCorrect = opt.id === correct;
  const isSelected = opt.id === selected;

  let bg = "#fff";
  let border = "1.5px solid #E7E5E4";
  let badgeBg = "#F5F5F4";
  let badgeColor = "#78716C";
  let textColor = "#1C1917";
  let shadow = "0 1px 4px rgba(0,0,0,0.05)";
  let opacity = 1;
  let icon = letters[index];
  let cursor = "pointer";
  let transform = "none";

  if (mode === "hint") {
    if (isCorrect) {
      bg = "#F0FDF4";
      border = "1.5px solid #86EFAC";
      badgeBg = "#16A34A";
      badgeColor = "#fff";
      textColor = "#14532D";
      shadow = "0 4px 20px rgba(22,163,74,0.2)";
      icon = "★";
      transform = "translateX(4px)";
    } else {
      opacity = 0.38;
    }
  } else if (mode === "revealed") {
    cursor = "default";
    if (isCorrect) {
      bg = "#ECFDF5";
      border = "1.5px solid #6EE7B7";
      badgeBg = "#059669";
      badgeColor = "#fff";
      textColor = "#065F46";
      shadow = "0 4px 16px rgba(5,150,105,0.15)";
      icon = "✓";
    } else if (isSelected) {
      bg = "#FEF2F2";
      border = "1.5px solid #FCA5A5";
      badgeBg = "#EF4444";
      badgeColor = "#fff";
      textColor = "#7F1D1D";
      shadow = "0 4px 16px rgba(239,68,68,0.12)";
      icon = "✗";
    } else {
      opacity = 0.38;
    }
  } else {
    // normal
    if (isSelected) {
      bg = "#FFFBEB";
      border = "1.5px solid #F59E0B";
      badgeBg = "#F59E0B";
      badgeColor = "#fff";
      shadow = "0 4px 16px rgba(245,158,11,0.18)";
      transform = "translateX(4px)";
    }
  }

  return (
    <button
      onClick={() => mode !== "revealed" && onClick(opt.id)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: bg,
        border,
        borderRadius: 12,
        padding: "14px 18px",
        cursor,
        textAlign: "left",
        transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: shadow,
        marginBottom: 10,
        opacity,
        transform,
      }}
      onMouseEnter={(e) => {
        if (mode === "normal" && !isSelected) {
          e.currentTarget.style.borderColor = "#F59E0B";
          e.currentTarget.style.transform = "translateX(4px)";
          e.currentTarget.style.boxShadow = "0 4px 16px rgba(245,158,11,0.1)";
        }
      }}
      onMouseLeave={(e) => {
        if (mode === "normal" && !isSelected) {
          e.currentTarget.style.borderColor = "#E7E5E4";
          e.currentTarget.style.transform = "none";
          e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
        }
      }}
    >
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: badgeBg,
          color: badgeColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 800,
          fontFamily: "monospace",
          flexShrink: 0,
          transition: "all 0.25s",
        }}
      >
        {icon}
      </span>
      <span
        style={{
          fontSize: 14.5,
          fontWeight: 500,
          color: textColor,
          lineHeight: 1.5,
          flex: 1,
        }}
      >
        {opt.text}
      </span>
      {/* "Correct Answer" tag shown on the correct option when user got it wrong */}
      {mode === "revealed" && isCorrect && selected && selected !== correct && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 800,
            color: "#059669",
            background: "#DCFCE7",
            border: "1px solid #86EFAC",
            borderRadius: 999,
            padding: "2px 8px",
            whiteSpace: "nowrap",
            letterSpacing: 0.5,
          }}
        >
          Correct Answer
        </span>
      )}
    </button>
  );
}

// ── Explanation Panel ─────────────────────────────────────────────────────────
// mode: "hint" | "correct" | "wrong"
function ExplanationPanel({ explanation, mode, wrongText, correctText }) {
  const cfg = {
    hint: {
      bg: "#FFFBEB",
      border: "#FDE68A",
      icon: "💡",
      label: "Hint — Correct answer is highlighted above",
      labelColor: "#D97706",
    },
    correct: {
      bg: "#ECFDF5",
      border: "#6EE7B7",
      icon: "🎉",
      label: "Correct!",
      labelColor: "#059669",
    },
    wrong: {
      bg: "#FEF2F2",
      border: "#FCA5A5",
      icon: "📖",
      label: "Explanation",
      labelColor: "#DC2626",
    },
  }[mode];

  return (
    <div
      style={{
        marginTop: 20,
        background: cfg.bg,
        border: `1.5px solid ${cfg.border}`,
        borderRadius: 14,
        padding: "20px 22px",
        animation: "slideDown 0.3s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 18 }}>{cfg.icon}</span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: cfg.labelColor,
          }}
        >
          {cfg.label}
        </span>
      </div>

      {/* Wrong answer: show selected vs correct side-by-side */}
      {mode === "wrong" && wrongText && correctText && (
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 14,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 130,
              background: "#FEE2E2",
              border: "1px solid #FCA5A5",
              borderRadius: 10,
              padding: "10px 14px",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: "#EF4444",
                letterSpacing: 1,
                marginBottom: 5,
                textTransform: "uppercase",
              }}
            >
              ✗ Your Answer
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "#7F1D1D" }}>
              {wrongText}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#A8A29E",
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            →
          </div>
          <div
            style={{
              flex: 1,
              minWidth: 130,
              background: "#DCFCE7",
              border: "1px solid #86EFAC",
              borderRadius: 10,
              padding: "10px 14px",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: "#16A34A",
                letterSpacing: 1,
                marginBottom: 5,
                textTransform: "uppercase",
              }}
            >
              ✓ Correct Answer
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "#14532D" }}>
              {correctText}
            </div>
          </div>
        </div>
      )}

      <p style={{ margin: 0, fontSize: 14, color: "#44403C", lineHeight: 1.8 }}>
        <RenderMarkdown text={explanation} />
      </p>
    </div>
  );
}

// ── Results Screen ────────────────────────────────────────────────────────────
function ResultsScreen({ questions, answers, onReset, onRetry }) {
  const correct = answers.filter(
    (a, i) => a === questions[i].correctAnswer,
  ).length;
  const pct = Math.round((correct / questions.length) * 100);
  const emoji = pct === 100 ? "🏆" : pct >= 70 ? "🎯" : pct >= 50 ? "📚" : "💪";
  const label =
    pct === 100
      ? "Perfect!"
      : pct >= 70
        ? "Well Done!"
        : pct >= 50
          ? "Keep Studying!"
          : "Keep Practicing!";

  return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>{emoji}</div>
      <h2
        style={{
          fontSize: 32,
          fontWeight: 900,
          color: "#1C1917",
          fontFamily: "'Georgia', serif",
          margin: "0 0 8px",
        }}
      >
        {label}
      </h2>
      <div
        style={{
          display: "inline-flex",
          alignItems: "baseline",
          gap: 4,
          background: "linear-gradient(135deg, #F59E0B, #D97706)",
          borderRadius: 16,
          padding: "10px 28px",
          margin: "12px 0 28px",
        }}
      >
        <span
          style={{
            fontSize: 44,
            fontWeight: 900,
            color: "#fff",
            fontFamily: "monospace",
          }}
        >
          {correct}
        </span>
        <span style={{ fontSize: 20, color: "rgba(255,255,255,0.7)" }}>
          / {questions.length}
        </span>
      </div>

      <div style={{ textAlign: "left", marginBottom: 28 }}>
        {questions.map((q, i) => {
          const isCorrect = answers[i] === q.correctAnswer;
          const chosen = q.options.find((o) => o.id === answers[i]);
          const correctOpt = q.options.find((o) => o.id === q.correctAnswer);
          return (
            <div
              key={i}
              style={{
                background: isCorrect ? "#ECFDF5" : "#FEF2F2",
                border: `1px solid ${isCorrect ? "#6EE7B7" : "#FCA5A5"}`,
                borderRadius: 12,
                padding: "14px 18px",
                marginBottom: 10,
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 18, flexShrink: 0, marginTop: 2 }}>
                {isCorrect ? "✅" : "❌"}
              </span>
              <div>
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "#1C1917",
                  }}
                >
                  Q{i + 1}. {q.question}
                </p>
                {!isCorrect && (
                  <p style={{ margin: 0, fontSize: 12.5, color: "#78716C" }}>
                    Your answer:{" "}
                    <span style={{ color: "#EF4444", fontWeight: 700 }}>
                      {chosen?.text || "—"}
                    </span>
                    {" · "}Correct:{" "}
                    <span style={{ color: "#059669", fontWeight: 700 }}>
                      {correctOpt?.text}
                    </span>
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={onRetry}
          style={{
            padding: "14px 32px",
            background: "linear-gradient(135deg, #F59E0B, #D97706)",
            border: "none",
            borderRadius: 12,
            color: "#fff",
            fontSize: 15,
            fontWeight: 800,
            cursor: "pointer",
            fontFamily: "'Georgia', serif",
            letterSpacing: 0.5,
          }}
        >
          🔁 Retry Quiz
        </button>
        <button
          onClick={onReset}
          style={{
            padding: "14px 32px",
            background: "#fff",
            border: "1.5px solid #E7E5E4",
            borderRadius: 12,
            color: "#44403C",
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ← New Quiz
        </button>
      </div>
    </div>
  );
}

// ── Main Quiz Component ───────────────────────────────────────────────────────
export default function Quiz({ questions, onReset }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [finished, setFinished] = useState(false);

  // history[i] = { selected, revealed } — persists state per question for back/forward navigation
  const [history, setHistory] = useState([]);

  const q = questions[current];
  const isCorrect = selected === q.correctAnswer;
  const isWrong = revealed && !!selected && !isCorrect;

  // Count correct from history
  const correctCount = history.filter(
    (h, i) => h?.revealed && h?.selected === questions[i]?.correctAnswer,
  ).length;

  // Option display mode
  const optionMode = revealed ? "revealed" : showHint ? "hint" : "normal";

  // ── Helpers ────────────────────────────────────────────────────────────────
  const saveCurrentToHistory = useCallback(
    (extra = {}) => {
      setHistory((prev) => {
        const next = [...prev];
        next[current] = { selected, revealed, ...extra };
        return next;
      });
    },
    [current, selected, revealed],
  );

  const handleSelect = (id) => {
    if (revealed) return;
    setSelected(id);
    setShowHint(false);
  };

  const handleCheck = useCallback(() => {
    if (!selected) return;
    setRevealed(true);
    setShowHint(false);
  }, [selected]);

  const handleNext = useCallback(() => {
    // Commit current state
    const newHistory = [...history];
    newHistory[current] = { selected, revealed: true };
    setHistory(newHistory);

    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      const nextIdx = current + 1;
      const saved = newHistory[nextIdx];
      setCurrent(nextIdx);
      setSelected(saved?.selected ?? null);
      setRevealed(saved?.revealed ?? false);
      setShowHint(false);
    }
  }, [history, current, selected, questions.length]);

  const handlePrev = useCallback(() => {
    if (current === 0) return;
    // Save current (even if not yet submitted) before going back
    const newHistory = [...history];
    newHistory[current] = { selected, revealed };
    setHistory(newHistory);

    const prevIdx = current - 1;
    const saved = newHistory[prevIdx];
    setCurrent(prevIdx);
    // Restore exactly what was there before (selected answer + whether it was revealed)
    setSelected(saved?.selected ?? null);
    setRevealed(saved?.revealed ?? false);
    setShowHint(false);
  }, [current, history, selected, revealed]);

  // ── Keyboard bindings ─────────────────────────────────────────────────────
  useEffect(() => {
    if (finished) return;
    const onKey = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
      const key = e.key.toUpperCase();

      if (["A", "B", "C", "D"].includes(key) && !revealed) {
        const opt = q.options[{ A: 0, B: 1, C: 2, D: 3 }[key]];
        if (opt) {
          e.preventDefault();
          handleSelect(opt.id);
        }
        return;
      }
      if (["1", "2", "3", "4"].includes(key) && !revealed) {
        const opt = q.options[parseInt(key) - 1];
        if (opt) {
          e.preventDefault();
          handleSelect(opt.id);
        }
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        revealed ? handleNext() : selected && handleCheck();
        return;
      }
      if (e.key === "ArrowRight" && revealed) {
        e.preventDefault();
        handleNext();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
        return;
      }
      if (key === "H" && !revealed) {
        e.preventDefault();
        setShowHint((h) => !h);
        return;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    finished,
    revealed,
    selected,
    current,
    q,
    handleCheck,
    handleNext,
    handlePrev,
  ]);

  // ── Retry / Reset ─────────────────────────────────────────────────────────
  const handleRetry = () => {
    setCurrent(0);
    setSelected(null);
    setRevealed(false);
    setShowHint(false);
    setHistory([]);
    setFinished(false);
  };

  const finalAnswers = questions.map((_, i) => history[i]?.selected ?? null);

  if (finished) {
    return (
      <div style={{ width: "100%", maxWidth: 720, margin: "0 auto" }}>
        <ResultsScreen
          questions={questions}
          answers={finalAnswers}
          onReset={onReset}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  const wrongText = q.options.find((o) => o.id === selected)?.text;
  const correctText = q.options.find((o) => o.id === q.correctAnswer)?.text;

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: 720,
          margin: "0 auto",
          animation: "fadeIn 0.3s ease",
        }}
      >
        <ProgressBar
          current={current + 1}
          total={questions.length}
          correct={correctCount}
        />
        <KeyboardHint revealed={revealed} canGoPrev={current > 0} />

        {/* ── Question Card ── */}
        <div
          style={{
            background: "#fff",
            border: "1px solid #E7E5E4",
            borderRadius: 20,
            padding: "32px 36px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.07)",
            marginBottom: 16,
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
              gap: 8,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {current > 0 && (
                <button
                  onClick={handlePrev}
                  title="Previous question (←)"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: "#F5F5F4",
                    border: "1px solid #E7E5E4",
                    color: "#78716C",
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                    lineHeight: 1,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#FFFBEB";
                    e.currentTarget.style.borderColor = "#FDE68A";
                    e.currentTarget.style.color = "#D97706";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#F5F5F4";
                    e.currentTarget.style.borderColor = "#E7E5E4";
                    e.currentTarget.style.color = "#78716C";
                  }}
                >
                  ‹
                </button>
              )}
              <span
                style={{
                  background: "#FFFBEB",
                  border: "1px solid #FDE68A",
                  color: "#D97706",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  padding: "4px 12px",
                  borderRadius: 999,
                }}
              >
                Q {current + 1} / {questions.length}
              </span>
            </div>

            {/* Right side: hint button OR visited badge */}
            {!revealed ? (
              <button
                onClick={() => setShowHint((h) => !h)}
                title="Toggle hint (H)"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  background: showHint ? "#F0FDF4" : "#F5F5F4",
                  border: `1px solid ${showHint ? "#86EFAC" : "#E7E5E4"}`,
                  borderRadius: 999,
                  color: showHint ? "#16A34A" : "#78716C",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                💡 {showHint ? "Hide Hint" : "Show Hint"}
              </button>
            ) : (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: isCorrect ? "#059669" : "#DC2626",
                  background: isCorrect ? "#DCFCE7" : "#FEE2E2",
                  border: `1px solid ${isCorrect ? "#86EFAC" : "#FCA5A5"}`,
                  borderRadius: 999,
                  padding: "4px 12px",
                }}
              >
                {isCorrect ? "✓ Correct" : "✗ Wrong"}
              </span>
            )}
          </div>

          {/* Question text */}
          <h2
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#1C1917",
              lineHeight: 1.65,
              margin: "0 0 24px",
              fontFamily: "'Georgia', serif",
            }}
          >
            {q.question}
          </h2>

          {/* Options */}
          <div>
            {q.options.map((opt, i) => (
              <OptionButton
                key={opt.id}
                opt={opt}
                index={i}
                selected={selected}
                correct={q.correctAnswer}
                mode={optionMode}
                onClick={handleSelect}
              />
            ))}
          </div>

          {/* Hint panel */}
          {showHint && !revealed && (
            <ExplanationPanel explanation={q.explanation} mode="hint" />
          )}

          {/* Post-answer explanation */}
          {revealed && (
            <ExplanationPanel
              explanation={q.explanation}
              mode={isCorrect ? "correct" : "wrong"}
              wrongText={wrongText}
              correctText={correctText}
            />
          )}
        </div>

        {/* ── Action buttons ── */}
        <div style={{ display: "flex", gap: 12 }}>
          {!revealed ? (
            <button
              onClick={handleCheck}
              disabled={!selected}
              style={{
                flex: 1,
                padding: "15px",
                background: selected
                  ? "linear-gradient(135deg, #F59E0B, #D97706)"
                  : "#E7E5E4",
                border: "none",
                borderRadius: 12,
                color: selected ? "#fff" : "#A8A29E",
                fontSize: 15,
                fontWeight: 800,
                cursor: selected ? "pointer" : "not-allowed",
                letterSpacing: 0.5,
                fontFamily: "'Georgia', serif",
                transition: "all 0.2s",
              }}
            >
              {selected ? "Check Answer ✓" : "Select an option"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              style={{
                flex: 1,
                padding: "15px",
                background: "linear-gradient(135deg, #F59E0B, #D97706)",
                border: "none",
                borderRadius: 12,
                color: "#fff",
                fontSize: 15,
                fontWeight: 800,
                cursor: "pointer",
                letterSpacing: 0.5,
                fontFamily: "'Georgia', serif",
                transition: "all 0.2s",
              }}
            >
              {current + 1 >= questions.length
                ? "See Results →"
                : "Next Question →"}
            </button>
          )}

          {onReset && (
            <button
              onClick={onReset}
              style={{
                padding: "15px 20px",
                background: "#fff",
                border: "1.5px solid #E7E5E4",
                borderRadius: 12,
                color: "#78716C",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
              }}
              title="Back to input"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </>
  );
}
