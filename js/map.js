/**
 * Map rendering and highlighting module
 */
const Map = {
  container: null,
  neighborhoods: [],
  highlightedPath: null,
  originalName: null,

  /**
   * Initialize map module
   */
  async init() {
    this.container = document.getElementById('map-container');
    await this.loadMap();
    this.highlightRandom();
    this.bindHoverEvents();
  },

  /**
   * Load the SVG map
   */
  async loadMap() {
    try {
      const response = await fetch('data/sf-map.svg');
      const svgText = await response.text();
      this.container.innerHTML = svgText;

      // Get all neighborhood paths
      const svg = this.container.querySelector('svg');
      if (svg) {
        this.neighborhoods = Array.from(svg.querySelectorAll('path[data-name]'));
      }
    } catch (error) {
      console.error('Failed to load map:', error);
      this.container.innerHTML = '<p>Failed to load map</p>';
    }
  },

  /**
   * Highlight a random neighborhood
   */
  highlightRandom() {
    if (this.neighborhoods.length === 0) return;

    // Remove previous highlight
    if (this.highlightedPath) {
      this.highlightedPath.classList.remove('highlighted');
    }

    // Select random neighborhood
    const randomIndex = Math.floor(Math.random() * this.neighborhoods.length);
    this.highlightedPath = this.neighborhoods[randomIndex];
    this.highlightedPath.classList.add('highlighted');

    // Store and display the original name
    this.originalName = this.highlightedPath.getAttribute('data-name');
    this.updateNameDisplay(this.originalName);
  },

  /**
   * Bind hover events to neighborhoods
   */
  bindHoverEvents() {
    // Hover over a neighborhood shows its name
    this.neighborhoods.forEach(path => {
      path.addEventListener('mouseenter', () => {
        const name = path.getAttribute('data-name');
        this.updateNameDisplay(name);
      });
    });

    // Leaving the map reverts to the original highlighted name
    this.container.addEventListener('mouseleave', () => {
      this.updateNameDisplay(this.originalName);
    });
  },

  /**
   * Update the neighborhood name display
   * @param {string} name - Neighborhood name to display
   */
  updateNameDisplay(name) {
    const nameElement = document.getElementById('neighborhood-name');
    if (nameElement) {
      nameElement.textContent = name || '';
    }
  },

  /**
   * Get the currently highlighted neighborhood name
   * @returns {string|null}
   */
  getHighlightedName() {
    return this.highlightedPath?.getAttribute('data-name') || null;
  }
};
