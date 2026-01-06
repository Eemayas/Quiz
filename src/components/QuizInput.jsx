import React, { useState } from 'react';

const QuizInput = ({ onStartQuiz }) => {
    const [text, setText] = useState('');

    const handleStart = () => {
        if (text.trim()) {
            onStartQuiz(text);
        } else {
            alert('Please paste some markdown content first.');
        }
    };

    return (
        <div className="quiz-input-container">
            <div className="input-card">
                <h2>Paste Quiz Markdown</h2>
                <p className="input-instruction">Paste your markdown content below to generate the quiz.</p>
                <textarea
                    className="markdown-input"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste markdown here (e.g., #### 1. Question...)"
                    rows={10}
                />
                <button
                    className="start-btn"
                    onClick={handleStart}
                    disabled={!text.trim()}
                >
                    Start Quiz
                </button>
            </div>
        </div>
    );
};

export default QuizInput;
