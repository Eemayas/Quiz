const MISTAKES_KEY = 'quiz_mistakes';

// Load all mistakes from localStorage
export const loadMistakes = () => {
  try {
    const data = localStorage.getItem(MISTAKES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading mistakes:', error);
    return [];
  }
};

// Save a single mistake
export const saveMistake = (mistake) => {
  const mistakes = loadMistakes();
  const newMistake = {
    ...mistake,
    id: Date.now(),
    timestamp: new Date().toISOString(),
  };
  mistakes.push(newMistake);
  localStorage.setItem(MISTAKES_KEY, JSON.stringify(mistakes));
  return newMistake;
};

// Save multiple mistakes at once (for batch operations)
export const saveMistakes = (newMistakes) => {
  const mistakes = loadMistakes();
  const timestampedMistakes = newMistakes.map((m, i) => ({
    ...m,
    id: Date.now() + i,
    timestamp: new Date().toISOString(),
  }));
  mistakes.push(...timestampedMistakes);
  localStorage.setItem(MISTAKES_KEY, JSON.stringify(mistakes));
};

// Get mistake count
export const getMistakeCount = () => {
  return loadMistakes().length;
};

// Clear all mistakes
export const clearMistakes = () => {
  localStorage.removeItem(MISTAKES_KEY);
};

// Download mistakes as JSON file
export const downloadMistakesJSON = () => {
  const mistakes = loadMistakes();
  const dataStr = JSON.stringify(mistakes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `quiz-mistakes-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Get mistakes summary (grouped by question)
export const getMistakesSummary = () => {
  const mistakes = loadMistakes();
  const summary = {};
  
  mistakes.forEach((m) => {
    const key = m.question;
    if (!summary[key]) {
      summary[key] = {
        question: m.question,
        correctAnswer: m.correctAnswer,
        count: 0,
        attempts: [],
      };
    }
    summary[key].count++;
    summary[key].attempts.push({
      yourAnswer: m.yourAnswer,
      timestamp: m.timestamp,
    });
  });
  
  return Object.values(summary).sort((a, b) => b.count - a.count);
};
