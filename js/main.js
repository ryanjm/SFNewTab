/**
 * Main initialization module
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize shortcuts
  await Shortcuts.init();

  // Initialize map
  await Map.init();
});
