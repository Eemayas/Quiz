import React, { useState, useEffect } from 'react';
import Question from './Question';
import { saveMistake, loadMistakes, downloadMistakesJSON, clearMistakes, getMistakeCount } from '../utils/mistakeTracker';

const Quiz = ({ questions, onReset }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [isLocked, setIsLocked] = useState(false);
    const [score, setScore] = useState(0);
    const [showSummary, setShowSummary] = useState(false);
    const [sessionMistakes, setSessionMistakes] = useState(0);
    const [totalMistakes, setTotalMistakes] = useState(getMistakeCount());

    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;
    const progress = ((currentQuestionIndex) / totalQuestions) * 100;
    const [copied, setCopied] = useState(false);

    const copyMistakesToClipboard = () => {
        const mistakesData = localStorage.getItem('quiz_mistakes');
    
   

    navigator.clipboard.writeText(mistakesData).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    });
};
    const handleSelect = (optionId) => {
        if (isLocked) return;

        // Immediate feedback mode: Lock immediately on select? 
        // Or select then click check? 
        // User said "check one question at a time and dwell on it".
        // Let's select, then show feedback immediately.

        const isCorrect = optionId === currentQuestion.correctAnswer;

        setUserAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: optionId
        }));

        setIsLocked(true);

        if (isCorrect) {
            setScore(prev => prev + 1);
        } else {
            // Track the mistake
            const mistakeData = {
                question: currentQuestion.question,
                questionId: currentQuestion.id,
                options: currentQuestion.options,
                yourAnswer: optionId,
                yourAnswerText: currentQuestion.options.find(o => o.id === optionId)?.text,
                correctAnswer: currentQuestion.correctAnswer,
                correctAnswerText: currentQuestion.options.find(o => o.id === currentQuestion.correctAnswer)?.text,
                explanation: currentQuestion.explanation,
            };
            saveMistake(mistakeData);
            setSessionMistakes(prev => prev + 1);
            setTotalMistakes(getMistakeCount());
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setIsLocked(false);
        } else {
            setShowSummary(true);
        }
    };

    if (showSummary) {
        const percentage = Math.round((score / totalQuestions) * 100);
        return (
            <div className="quiz-container fade-in">
                <div className="score-summary">
                    <h2>Quiz Completed! 🎓</h2>
                    <div className="score-circle">
                        <span className="score-number">{score}</span>
                        <span className="score-total">/ {totalQuestions}</span>
                    </div>
                    <div className="score-percentage">{percentage}% Correct</div>
                    <p className="score-message">
                        {percentage >= 80 ? "Excellent work! 🌟" :
                            percentage >= 50 ? "Good effort! 👍" : "Keep practicing! 💪"}
                    </p>
                    <div className="summary-actions">
                        <button onClick={onReset} className="reset-btn">Start New Quiz</button>
                        {totalMistakes > 0 && (
                            <>
                                {totalMistakes > 0 && (
                                <button 
                                    onClick={copyMistakesToClipboard} 
                                    className={`download-btn ${copied ? 'success' : ''}`}
                                >
                                    {copied ? (
                                    <>✅ Copied to Clipboard!</>
                                    ) : (
                                    <>📋 Copy All Mistakes ({totalMistakes})</>
                                    )}
                                </button>
                                )}
                                <button 
                                    onClick={() => { clearMistakes(); setTotalMistakes(0); }} 
                                    className="clear-btn"
                                >
                                    🗑️ Clear Mistake History
                                </button>
                            </>
                        )}
                    </div>
                    {sessionMistakes > 0 && (
                        <p className="session-mistakes">You made {sessionMistakes} mistake{sessionMistakes > 1 ? 's' : ''} this session</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-container">
            <div className="quiz-header">
                <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                </div>
                <div className="quiz-stats">
                    <span>Question {currentQuestionIndex + 1} / {totalQuestions}</span>
                    <span className="current-score">Score: {score}</span>
                </div>
            </div>

            <Question
                key={currentQuestion.id}
                question={currentQuestion}
                selectedOption={userAnswers[currentQuestion.id]}
                onSelect={handleSelect}
                isLocked={isLocked}
                showFeedback={isLocked}
            />

            <div className="quiz-footer">
                {isLocked ? (
                    <button
                        onClick={handleNext}
                        className="next-btn fade-in"
                        autoFocus
                    >
                        {currentQuestionIndex === totalQuestions - 1 ? "Finish Quiz" : "Next Question →"}
                    </button>
                ) : (
                    <div className="placeholder-btn">Select an answer</div>
                )}
            </div>
        </div>
    );
};

export default Quiz;
