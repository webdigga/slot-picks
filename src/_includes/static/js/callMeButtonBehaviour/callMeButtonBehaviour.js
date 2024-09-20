/*
  Changing behaviour of call me button depending on if mobile or not
*/
function callMeButtonBehaviour() {
  const button = document.querySelector('[data-test="callMeButton"]');

  if (!button) {
    console.error('Button not found when trying to attach event listener');
    return;
  }

  button.addEventListener("click", (event) => {
    event.preventDefault();
    window.location.href = /Mobi|Android|iPhone/i.test(navigator.userAgent) ? event.target.href : '/contact/#contact';
  });
}

callMeButtonBehaviour();

if (typeof module === 'object') {
  module.exports = callMeButtonBehaviour;
}
