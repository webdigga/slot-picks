/*
  Click event that scrolls the user to see more reasons why Kaboola is the best option
*/
function moreButtonScroll() {
  const moreButton = document.querySelector('[data-test="moreButton"]');
  const moreButtonLocation = document.querySelector('[data-test="moreButtonLocation"]');

  if(moreButton) {
    moreButton.addEventListener('click', () => {
      if(moreButtonLocation) moreButtonLocation.scrollIntoView(
        {
          behavior: "smooth",
          block: "start"
        }
      );
    });
  }
}

moreButtonScroll();

if (typeof module === 'object') {
  module.exports = moreButtonScroll;
}
