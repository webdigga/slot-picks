/*
  Click event that scrolls the user to see more reasons why Kaboola is the best option
*/
const moreButton = document.querySelector('[data-test="moreButton"]');
const reasons = document.querySelector('[data-test="reasons"]');

if(moreButton) {
  moreButton.addEventListener('click', () => {
    if(reasons) document.querySelector('[data-test="reasons"]').scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

/*
  Click event that toggles menu open and close
*/
const menuButton = document.querySelector('[data-test="menuButton"]');
const burger = document.querySelector('[data-test="burger"]');
const cross = document.querySelector('[data-test="cross"]');

if(menuButton) {
  menuButton.addEventListener('click', () => {
    const menu = document.querySelector('[data-test="menu"]');

    if(menu) {
      menu.classList.toggle("hidden");
      menu.classList.toggle("menuStyles");

      menuButton.classList.toggle("transition");
      menuButton.classList.toggle("transform-180");

      burger.classList.toggle("block");
      burger.classList.toggle("hidden");

      cross.classList.toggle("block");
      cross.classList.toggle("hidden");
    }
  });
}
