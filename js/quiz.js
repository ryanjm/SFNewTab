/**
 * Quiz mode module
 */
const Quiz = {
  correctAnswer: null,
  answered: false,
  optionsContainer: null,
  resultElement: null,
  statsElement: null,

  /**
   * Initialize quiz mode
   */
  async init() {
    this.optionsContainer = document.getElementById('quiz-options');
    this.resultElement = document.getElementById('quiz-result');
    this.statsElement = document.getElementById('quiz-stats');

    await this.setupQuiz();
    await this.updateStats();
  },

  /**
   * Set up the quiz with answer options
   */
  async setupQuiz() {
    // Get the correct answer from the highlighted neighborhood
    this.correctAnswer = Map.getHighlightedName();
    if (!this.correctAnswer) return;

    // Get two random wrong answers
    const wrongAnswers = this.getRandomWrongAnswers(2);

    // Combine and shuffle options
    const options = this.shuffle([this.correctAnswer, ...wrongAnswers]);

    // Render the options
    this.renderOptions(options);
  },

  /**
   * Get random wrong answers from available neighborhoods
   * @param {number} count - Number of wrong answers to get
   * @returns {Array<string>}
   */
  getRandomWrongAnswers(count) {
    const allNames = Map.neighborhoods
      .map(path => path.getAttribute('data-name'))
      .filter(name => name && name !== this.correctAnswer);

    const shuffled = this.shuffle([...allNames]);
    return shuffled.slice(0, count);
  },

  /**
   * Shuffle an array
   * @param {Array} array
   * @returns {Array}
   */
  shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  },

  /**
   * Render quiz option buttons
   * @param {Array<string>} options
   */
  renderOptions(options) {
    this.optionsContainer.innerHTML = options.map(name => `
      <button class="quiz-option" data-answer="${this.escapeHtml(name)}">
        ${this.escapeHtml(name)}
      </button>
    `).join('');

    // Add click handlers
    this.optionsContainer.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => this.handleAnswer(btn));
    });
  },

  /**
   * Handle answer selection
   * @param {HTMLElement} button
   */
  async handleAnswer(button) {
    if (this.answered) return;
    this.answered = true;

    const selectedAnswer = button.dataset.answer;
    const isCorrect = selectedAnswer === this.correctAnswer;

    // Mark the button
    button.classList.add(isCorrect ? 'correct' : 'wrong');

    // If wrong, also highlight the correct answer
    if (!isCorrect) {
      this.optionsContainer.querySelectorAll('.quiz-option').forEach(btn => {
        if (btn.dataset.answer === this.correctAnswer) {
          btn.classList.add('correct');
        }
      });
    }

    // Disable all buttons
    this.optionsContainer.querySelectorAll('.quiz-option').forEach(btn => {
      btn.disabled = true;
    });

    // Show result
    this.resultElement.textContent = isCorrect ? 'Correct!' : 'Wrong!';
    this.resultElement.className = `quiz-result ${isCorrect ? 'correct' : 'wrong'}`;

    // Save result and update stats
    await Storage.addQuizResult(isCorrect);
    await this.updateStats();
  },

  /**
   * Update the stats display
   */
  async updateStats() {
    const stats = await Storage.getQuizStats();
    if (stats.total > 0) {
      this.statsElement.textContent = `Last 7 days: ${stats.correct}/${stats.total} (${stats.accuracy}%)`;
    } else {
      this.statsElement.textContent = '';
    }
  },

  /**
   * Escape HTML special characters
   * @param {string} str
   * @returns {string}
   */
  escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};
