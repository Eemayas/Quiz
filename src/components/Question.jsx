import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css'; // This is required for math styling!

const Question = ({ question, selectedOption, onSelect, isLocked, showFeedback }) => {
    // Note: In your parser, we changed options to be an array of strings.
    // So 'opt' here is the string text of the option.
    const isCorrect = selectedOption === question.correctAnswer;
    const isSelected = (optText) => selectedOption === optText;
    const isCorrectAnswer = (optText) => question.correctAnswer === optText;

    // Configuration for Markdown + Math
    const markdownConfig = {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
    };

    return (
        <div className="question-card fade-in">
            <div className="question-header">
                <span className="question-number">Question {question.id + 1}</span>
                <div className="question-text">
                    <ReactMarkdown {...markdownConfig}>{question.question}</ReactMarkdown>
                </div>
            </div>

            <div className="options-list">
                {question.options.map((optText, index) => {
                    let optionClass = 'option-item';

                    if (showFeedback) {
                        if (isCorrectAnswer(optText)) {
                            optionClass += ' correct';
                        } else if (isSelected(optText) && !isCorrect) {
                            optionClass += ' incorrect';
                        } else {
                            optionClass += ' disabled';
                        }
                    } else if (isSelected(optText)) {
                        optionClass += ' selected';
                    }

                    return (
                        <button
                            key={index}
                            className={optionClass}
                            onClick={() => !isLocked && onSelect(optText)}
                            disabled={isLocked}
                        >
                            {/* We use the index as a visual label (A, B, C...) */}
                            <span className="option-marker">
                                {String.fromCharCode(65 + index)}
                            </span>
                            <div className="option-text">
                                <ReactMarkdown {...markdownConfig}>{optText}</ReactMarkdown>
                            </div>
                            {showFeedback && isCorrectAnswer(optText) && <span className="status-icon">✓</span>}
                            {showFeedback && isSelected(optText) && !isCorrect && <span className="status-icon">✗</span>}
                        </button>
                    );
                })}
            </div>

            {showFeedback && (
                <div className={`explanation-box ${isCorrect ? 'success' : 'error'} fade-in-up`}>
                    <div className="result-status">
                        {isCorrect ? 'Correct! 🎉' : 'Incorrect'}
                    </div>
                    {question.explanation && (
                        <div className="explanation-text">
                            <strong>Explanation:</strong>
                            <div className="explanation-content">
                                <ReactMarkdown {...markdownConfig}>
                                    {question.explanation}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Question;