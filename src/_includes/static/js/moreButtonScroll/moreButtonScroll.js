/*
  Click event that scrolls the user to the next section down
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
