/*
  Changing behaviour of call me anchor depending on if mobile or not
*/
function callMeAnchorBehaviour() {
  const callMeAnchor = document.querySelector('[data-test="callMeAnchor"]');

  if(callMeAnchor) {
    callMeAnchor.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = /Mobi|Android|iPhone/i.test(navigator.userAgent) ? event.target.href : '/contact/#contact';
    });
  }
}

callMeAnchorBehaviour();

if (typeof module === 'object') {
  module.exports = callMeAnchorBehaviour;
}
