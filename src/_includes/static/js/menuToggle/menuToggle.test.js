/**
 * @jest-environment jsdom
 */
const menuToggle = require('./menuToggle');

describe('menuToggle', () => {
  let toggleOpen, toggleClose, menu;

  beforeEach(() => {
    document.body.innerHTML = `
      <button data-test="toggleOpen">Open</button>
      <button data-test="toggleClose">Close</button>
      <div data-test="menu" class="max-lg:hidden"></div>
    `;

    toggleOpen = document.querySelector('[data-test="toggleOpen"]');
    toggleClose = document.querySelector('[data-test="toggleClose"]');
    menu = document.querySelector('[data-test="menu"]');

    menuToggle();
  });

  test('should open the menu when toggleOpen is clicked', () => {
    toggleOpen.click();
    expect(menu.classList.contains('max-lg:block')).toBe(true);
    expect(menu.classList.contains('max-lg:hidden')).toBe(false);
  });

  test('should close the menu when toggleClose is clicked', () => {
    toggleOpen.click(); // First open the menu
    toggleClose.click();
    expect(menu.classList.contains('max-lg:block')).toBe(false);
    expect(menu.classList.contains('max-lg:hidden')).toBe(true);
  });
});