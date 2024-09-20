/*
  Click event that toggles menu open and close
*/
function menuToggle() {
  const menuButton = document.querySelector('[data-test="menuButton"]');
  const burger = document.querySelector('[data-test="burger"]');
  const cross = document.querySelector('[data-test="cross"]');

  
  if(menuButton) {
    menuButton.addEventListener('click', () => {
      const menu = document.querySelector('[data-test="menu"]');

      if(menu) {
        menu.classList.toggle("hidden");
        menu.classList.toggle("menu-styles");

        menuButton.classList.toggle("transition");
        menuButton.classList.toggle("transform-180");

        burger.classList.toggle("block");
        burger.classList.toggle("hidden");

        cross.classList.toggle("block");
        cross.classList.toggle("hidden");
      }
    });
  }
}

menuToggle();

if (typeof module === 'object') {
  module.exports = menuToggle;
}
