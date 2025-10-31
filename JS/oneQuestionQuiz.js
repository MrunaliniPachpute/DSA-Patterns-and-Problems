// Utility for full quiz loader
function showQuizFullLoader() {
  const overlay = document.getElementById('quiz-full-loader');
  if (overlay) { overlay.style.display = 'flex'; overlay.style.opacity = '1'; }
}
function hideQuizFullLoader() {
  const overlay = document.getElementById('quiz-full-loader');
  if (overlay) { overlay.style.opacity = '0'; setTimeout(() => { overlay.style.display = 'none'; }, 210); }
}

function showQuizSkeleton(container) {
  if (!container) return;
  let skel = '<div class="skeleton-quiz-line" style="width:60%;height:28px;"></div>';
  for(let i=0;i<4;++i) skel += '<div class="skeleton-quiz-line" style="width:'+(74-10*i)+'%;"></div>';
  container.innerHTML = skel;
}

document.addEventListener('DOMContentLoaded', () => {
    const questionContainer = document.getElementById('one-question-container');
    const apiUrl = 'https://opentdb.com/api.php?amount=1&category=18&type=multiple';
    let correctAnswer = '';

    const wrongAnswerMessages = [
        "Not quite! Even the greatest minds make mistakes. Try again!",
        "That's not the one. Persistence is the key to unlocking the code!",
        "Oops! Every error is a lesson learned. Give it another shot.",
        "Close! Don't give up, you're building your brain's neural network.",
        "Incorrect, but remember: bugs are just unexpected features. Try again!",
        "That's a good guess, but not the right one. Keep thinking!"
    ];

    const decodeText = (text) => {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    };

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    async function fetchQuestion() {
        showQuizFullLoader();
        const container = document.getElementById('one-question-container');
        showQuizSkeleton(container);
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            hideQuizFullLoader();
            displayQuestion(data.results[0]);
        } catch (error) {
            hideQuizFullLoader();
            if (container) container.innerHTML = '<p>Sorry, could not fetch a question. Please try again later.</p>';
            console.error('Fetch error:', error);
        }
    }

    const displayQuestion = (questionData) => {
        correctAnswer = decodeText(questionData.correct_answer);
        const incorrectAnswers = questionData.incorrect_answers.map(answer => decodeText(answer));
        const allOptions = shuffleArray([...incorrectAnswers, correctAnswer]);

        const optionsHtml = allOptions.map(option =>
            `<button class="oq-option-btn">${option}</button>`
        ).join('');

        questionContainer.innerHTML = `
            <div id="one-question-card">
                <h2>Today's Quick Question 🧠</h2>
                <p id="oq-question">${decodeText(questionData.question)}</p>
                <div id="oq-options">${optionsHtml}</div>
                <div id="oq-feedback">
                    <button id="oq-show-answer-btn">Show Answer</button>
                </div>
            </div>
        `;

        document.querySelectorAll('.oq-option-btn').forEach(button => {
            button.addEventListener('click', handleOptionClick);
        });
    };

    const handleOptionClick = (event) => {
        const selectedButton = event.target;
        const selectedAnswer = selectedButton.textContent;
        const allOptionButtons = document.querySelectorAll('.oq-option-btn');

        allOptionButtons.forEach(btn => btn.disabled = true);

        if (selectedAnswer === correctAnswer) {
            selectedButton.classList.add('correct');
            confetti({
                particleCount: 150,
                spread: 180,
                origin: { y: 0.6 }
            });
        } else {
            selectedButton.classList.add('incorrect');
            const randomMessage = wrongAnswerMessages[Math.floor(Math.random() * wrongAnswerMessages.length)];
            alert(randomMessage);
        }

        document.getElementById('oq-show-answer-btn').style.display = 'inline-block';
        document.getElementById('oq-show-answer-btn').addEventListener('click', showCorrectAnswer);
    };

    const showCorrectAnswer = () => {
        document.querySelectorAll('.oq-option-btn').forEach(btn => {
            if (btn.textContent === correctAnswer) {
                btn.classList.remove('incorrect');
                btn.classList.add('correct');
            }
        });
    };

    fetchQuestion();
});
