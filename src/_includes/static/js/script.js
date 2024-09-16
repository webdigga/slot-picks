/*
  Click event that scrolls the user to see more reasons why Kaboola is the best option
*/
const moreButton = document.querySelector('[data-test="moreButton"]');
const moreButtonLocation = document.querySelector('[data-test="moreButtonLocation"]');

if(moreButton) {
  moreButton.addEventListener('click', () => {
    if(moreButtonLocation) moreButtonLocation.scrollIntoView({ behavior: "smooth", block: "start" });
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

/*
  Cookie consent
*/
if(document.body.classList.contains('prod')) {
  const cookieBanner = document.querySelector('[data-test="cookieBanner"]');

  if(!localStorage.getItem('consentGranted')) {
    cookieBanner.classList.remove('hidden');
  }

  document.querySelector('[data-test="consentButton"]').addEventListener('click', () => {
    localStorage.setItem('consentGranted', true);

    loadGtagScript();

    cookieBanner.classList.add('hidden');
  });        

  if(localStorage.getItem("consentGranted")) {
    loadGtagScript();
  }

  function loadGtagScript() {
    function gtag() { dataLayer.push(arguments); }

    gtag('consent', 'update', {
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      ad_storage: 'granted',
      analytics_storage: 'granted'
    });

    const gtagScript = document.createElement('script');
    gtagScript.defer = true;
    gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=GTAG_ID';

    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(gtagScript,firstScript);
  }
}
