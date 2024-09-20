/**
 * @jest-environment jsdom
 */
const moreButtonScroll = require('./moreButtonScroll');

describe('moreButtonScroll', () => {
  let moreButton, moreButtonLocation;

  beforeEach(() => {
    // Set up the DOM elements before each test
    document.body.innerHTML = `
      <button data-test="moreButton"></button>
      <div data-test="moreButtonLocation"></div>
    `;
    
    moreButton = document.querySelector('[data-test="moreButton"]');
    moreButtonLocation = document.querySelector('[data-test="moreButtonLocation"]');

    // Mock scrollIntoView
    moreButtonLocation.scrollIntoView = jest.fn();

    // Call the function to attach event listeners
    moreButtonScroll();
  });

  test('scrolls into view when moreButton is clicked', () => {
    // Simulate the click event
    moreButton.click();

    // Check if scrollIntoView was called on the moreButtonLocation element
    expect(moreButtonLocation.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
  });

  test('does not throw error if moreButton is not present', () => {
    // Remove the moreButton from the DOM
    moreButton.remove();

    // Call the function again
    expect(() => moreButtonScroll()).not.toThrow();
  });
});