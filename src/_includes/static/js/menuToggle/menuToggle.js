/*
  Click event that toggles menu open and close
*/
function menuToggle() {
  const toggleOpen = document.querySelector('[data-test="toggleOpen"]');
  const toggleClose = document.querySelector('[data-test="toggleClose"]');
  const menu = document.querySelector('[data-test="menu"]');

  if(toggleOpen) {
    toggleOpen.addEventListener('click', () => {
      if(menu) {
        menu.classList.remove("max-lg:hidden");
        menu.classList.add("max-lg:block");
      }
    });
  }

  if(toggleClose) {
    toggleClose.addEventListener('click', () => {
      if(menu) {
        menu.classList.remove("max-lg:block");
        menu.classList.add("max-lg:hidden");
      }
    });
  }
}

menuToggle();

if (typeof module === 'object') {
  module.exports = menuToggle;
}
