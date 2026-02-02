/**
 * Main initialization module
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize theme first
  await Theme.init();

  // Initialize shortcuts
  await Shortcuts.init();

  // Get the current mode
  const mode = await Storage.getMode();

  // Initialize map (but don't bind hover events in quiz mode)
  await Map.loadMap();
  Map.highlightRandom();

  if (mode === 'quiz') {
    // Quiz mode
    document.getElementById('standard-display').style.display = 'none';
    document.getElementById('quiz-display').style.display = 'block';
    await Quiz.init();
  } else {
    // Standard mode
    Map.bindHoverEvents();
  }

  // Settings button
  document.getElementById('settings-button').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
});
