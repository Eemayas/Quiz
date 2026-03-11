/**
 * Parses Quiz Markdown into a structured Question array.
 *
 * Handles:
 *  - Questions with escaped dots:  "1\. Question text"
 *  - Multi-line questions (with inline LaTeX blocks)
 *  - LaTeX options:  "1. $$\frac{L I^2}{2}$$"
 *  - True/False questions (2 options)
 *  - Answers inside <details> blocks: "**Answer:** 3. ..."
 *  - Shuffles options and remaps correctAnswer to the new letter id
 *
 * Output format:
 *   {
 *     id: number,
 *     question: string,
 *     options: { id: string, text: string }[],   // ids are "a", "b", "c", "d"
 *     correctAnswer: string,                      // letter id of the correct option
 *     explanation?: string,
 *   }
 *
 * @format
 */

export function parseQuizMarkdown(markdown) {
  const lines = markdown.split("\n");
  const questions = [];
  let currentQuestion = null;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // Match question heading #### 1. Question
    const questionMatch = line.match(/^####\s*\d+\.\s*(.*)/);
    if (questionMatch) {
      if (currentQuestion) questions.push(currentQuestion);
      currentQuestion = {
        question: questionMatch[1],
        options: [],
        correctAnswer: "",
        explanation: "",
      };
      continue;
    }

    // Match numbered options 1. Option text
    const optionMatch = line.match(/^(\d+)\.\s*(.*)/);
    if (optionMatch && currentQuestion) {
      currentQuestion.options.push({
        id: optionMatch[1],
        text: optionMatch[2],
      });
      continue;
    }

    // Start of <details> section
    if (line.startsWith("<details>") && currentQuestion) {
      let detailsContent = "";
      i++; // skip <details> line
      while (i < lines.length && !lines[i].trim().startsWith("</details>")) {
        detailsContent += lines[i] + "\n";
        i++;
      }

      // Extract correct answer
      const answerMatch = detailsContent.match(/\*\*Answer:\*\*\s*(\d+)/);
      if (answerMatch) currentQuestion.correctAnswer = answerMatch[1];

      // Extract explanation
      const explanationMatch = detailsContent.match(
        /\*\*Explanation:\*\*\\?\s*([\s\S]*)/,
      );
      if (explanationMatch) {
        // Clean up trailing tags or whitespace
        currentQuestion.explanation = explanationMatch[1]
          .trim()
          .replace(/<\/?pre[^>]*>|<\/?code[^>]*>/g, "")
          .trim();
      }
      continue;
    }
  }

  if (currentQuestion) questions.push(currentQuestion);
  console.log("🚀 ~ parseQuizMarkdown ~ questions:", questions);

  return questions;
}
