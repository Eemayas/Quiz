import { useState } from 'react'
import './App.css'
import QuizInput from './components/QuizInput'
import Quiz from './components/Quiz'
import { parseQuizMarkdown } from './utils/parser'

function App() {
  const [quizData, setQuizData] = useState(null);

  const handleStartQuiz = (markdownContent) => {
    try {
      const questions = parseQuizMarkdown(markdownContent);
      if (questions.length > 0) {
        setQuizData(questions);
      } else {
        alert('No questions found! Please check the markdown format.');
      }
    } catch (error) {
      console.error('Error parsing markdown:', error);
      alert('Error parsing markdown. See console for details.');
    }
  };

  const handleReset = () => {
    setQuizData(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Markdown Quiz</h1>
      </header>
      <main className="app-main">
        {!quizData ? (
          <QuizInput onStartQuiz={handleStartQuiz} />
        ) : (
          <Quiz questions={quizData} onReset={handleReset} />
        )}
      </main>
    </div>
  )
}

export default App
