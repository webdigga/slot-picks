/*
  Changing behaviour of call me button depending on if mobile or not
*/
function callMeButtonBehaviour() {
  document.querySelector('[data-test="callMeButton"]').addEventListener("click", (event) => {

    console.log(event);
    event.preventDefault();
    window.location.href = /Mobi|Android|iPhone/i.test(navigator.userAgent) ? event.target.href : '/contact/#contact';
  });
}

callMeButtonBehaviour();

if (typeof module === 'object') {
  module.exports = callMeButtonBehaviour;
}
