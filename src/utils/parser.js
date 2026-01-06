/**
 * Parses Quiz Markdown and returns a randomized simulation.
 * - Shuffles options
 * - Removes numbering/labels from options
 * - Preserves LaTeX and Markdown symbols
 * - Correctly maps answers after shuffling
 */
export const parseQuizMarkdown = (text) => {
  const questions = [];
  
  // Split by headings (### or ####) followed by the question number
  const blocks = text.split(/^#{3,4}\s+/m).slice(1);

  // Helper: Fisher-Yates Shuffle
  const shuffle = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  blocks.forEach((block, index) => {
    const lines = block.trim().split('\n');
    
    // 1. Extract Question Text
    // Removes the "301. " style prefix if present
    const questionText = lines[0].replace(/^\d+\.\s*/, '').trim();

    // 2. Extract and Clean Options
    let rawOptions = [];
    const optionRegex = /^(\d+|[A-D])[\.\)]\s+(.*)/;
    
    lines.slice(1).forEach(line => {
      const match = line.trim().match(optionRegex);
      if (match) {
        rawOptions.push({
          originalId: match[1], // e.g., "1" or "A"
          text: match[2].trim() // The actual content (preserves LaTeX)
        });
      }
    });

    // 3. Extract the Answer Identifier (e.g., "1" or "A")
    // Looking for pattern: **Answer:** 1) or **Answer:** A)
    const answerMatch = block.match(/\*\*Answer:\*\*\s*(\d+|[A-D])/i);
    const correctId = answerMatch ? answerMatch[1] : null;

    // Find the actual text of the correct answer before we shuffle
    const correctOptionObj = rawOptions.find(opt => opt.originalId === correctId);
    const correctAnswerText = correctOptionObj ? correctOptionObj.text : null;

    // 4. Extract Explanation (removes Markdown formatting)
    let explanation = '';
    const expMatch = block.match(/\*\*Explanation:\*\*([\s\S]*)$/);
    if (expMatch) {
      explanation = expMatch[1].trim();
    }

    // 5. Finalize Question Object
    if (questionText && rawOptions.length > 0 && correctAnswerText) {
      // Shuffle the options array
      const shuffledOptions = shuffle(rawOptions).map(opt => opt.text);

      questions.push({
        id: index + 1, // Set-specific ID
        question: questionText,
        options: shuffledOptions,
        correctAnswer: correctAnswerText, // Use the text for validation later
        explanation: explanation
      });
    }
  });

  return questions;
};