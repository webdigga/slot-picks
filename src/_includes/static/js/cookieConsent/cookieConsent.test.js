/**
 * @jest-environment jsdom
 */
const cookieConsent = require('./cookieConsent');

describe('cookieConsent', () => {
  let cookieBanner, consentButton, firstScript;

  beforeEach(() => {
    // Setup initial DOM structure
    document.body.innerHTML = `
      <div data-test="cookieBanner" class="hidden"></div>
      <button data-test="consentButton"></button>
      <script></script>
    `;

    cookieBanner = document.querySelector('[data-test="cookieBanner"]');
    consentButton = document.querySelector('[data-test="consentButton"]');
    firstScript = document.querySelector('script');

    // Mock localStorage
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      return key === 'consentGranted' ? null : '';
    });
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});

    // Mock dataLayer and gtag function
    global.dataLayer = [];
    global.gtag = jest.fn();

    // Mock document.createElement
    jest.spyOn(document, 'createElement').mockImplementation((element) => {
      if (element === 'script') {
        return {
          defer: false,
          src: '',
          tagName: 'SCRIPT',
          parentNode: {
            insertBefore: jest.fn(),
          },
        };
      }
    });

    // Mock firstScript's parentNode
    jest.spyOn(firstScript, 'parentNode', 'get').mockReturnValue({
      insertBefore: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    document.body.classList.remove('prod'); // Ensure prod class is removed
    global.dataLayer = [];
  });

  test('displays the cookie banner if consent is not granted', () => {
    // Ensure localStorage returns null for consentGranted
    localStorage.getItem.mockReturnValue(null);
    
    document.body.classList.add('prod'); // Enable production mode
    cookieConsent(); // Call the function

    // Ensure the cookie banner is displayed (not hidden)
    expect(cookieBanner.classList.contains('hidden')).toBe(false); // Should be false if displayed
  });

  test('hides the cookie banner and sets consent when consent button is clicked', () => {
    document.body.classList.add('prod'); // Enable production mode
    cookieConsent();
    consentButton.click();

    expect(localStorage.setItem).toHaveBeenCalledWith('consentGranted', true);
    expect(cookieBanner.classList.contains('hidden')).toBe(true);
    expect(global.dataLayer.length).toBeGreaterThan(0);

    const pushedData = global.dataLayer[0];
    expect(pushedData[0]).toBe('consent');
    expect(pushedData[1]).toBe('update');
    expect(pushedData[2]).toEqual(expect.objectContaining({
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      ad_storage: 'granted',
      analytics_storage: 'granted',
    }));

    expect(document.createElement).toHaveBeenCalledWith('script');
  });

  test('loads the gtag script immediately if consent was previously granted', () => {
    document.body.classList.add('prod'); // Enable production mode
    localStorage.getItem.mockReturnValue('true');

    cookieConsent();

    expect(global.dataLayer.length).toBeGreaterThan(0);

    const pushedData = global.dataLayer[0];
    expect(pushedData[0]).toBe('consent');
    expect(pushedData[1]).toBe('update');
    expect(pushedData[2]).toEqual(expect.objectContaining({
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      ad_storage: 'granted',
      analytics_storage: 'granted',
    }));

    expect(document.createElement).toHaveBeenCalledWith('script');
    expect(cookieBanner.classList.contains('hidden')).toBe(true);
  });

  test('does nothing if not in production mode', () => {
    // Spy on addEventListener to check if it's called
    const addEventListenerSpy = jest.spyOn(EventTarget.prototype, 'addEventListener');

    // Call cookieConsent without the 'prod' class
    cookieConsent();

    // Ensure the cookie banner is still hidden
    expect(cookieBanner.classList.contains('hidden')).toBe(true); // Should be true initially

    // Ensure no localStorage item is set
    expect(localStorage.setItem).not.toHaveBeenCalled();

    // Ensure no event listeners were added
    expect(addEventListenerSpy).not.toHaveBeenCalledWith('click', expect.any(Function)); // Should not be called

    // Clean up the spy
    addEventListenerSpy.mockRestore();
  });
});
