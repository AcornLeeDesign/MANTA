/**
 * Generates typographic scale from smallest to largest
 * @param {number} smallest - The smallest font size (h5)
 * @param {number} ratio - The multiplier between sizes (default: 1.618 for golden ratio)
 * @returns {Object} Scale object { h1, h2, h3, h4, h5 }
 */
export const generateScale = (smallest = 1, ratio = 1.618) => ({
  h5: `${smallest}em`,
  h4: `${(smallest * ratio).toFixed(3)}em`,
  h3: `${(smallest * ratio ** 2).toFixed(3)}em`,
  h2: `${(smallest * ratio ** 3).toFixed(3)}em`,
  h1: `${(smallest * ratio ** 4).toFixed(3)}em`,
});

/**
 * Applies scale to document root as CSS variables
 * @param {number} smallest - The smallest font size (h5)
 * @param {number} ratio - The multiplier between sizes
 */
export const applyScaleToRoot = (smallest = 1, ratio = 1.618) => {
  const scale = generateScale(smallest, ratio);
  Object.entries(scale).forEach(([heading, size]) => {
    document.documentElement.style.setProperty(`--${heading}`, size);
  });
};

// Usage:
// import { generateScale, applyScaleToRoot } from './utils/typescale';
// const scale = generateScale(1, 1.618); // smallest=1em, ratio=1.618
// applyScaleToRoot(1, 1.618); // Apply to CSS variables

