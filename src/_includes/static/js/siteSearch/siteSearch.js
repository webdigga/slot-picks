/*
  Site search - lazy-loads JSON index on first focus, filters on input
*/
function siteSearch() {
  var searchInput = document.querySelector('[data-test="searchInput"]');
  var searchInputMobile = document.querySelector('[data-test="searchInputMobile"]');
  var searchDropdown = document.querySelector('[data-test="searchDropdown"]');
  var searchDropdownMobile = document.querySelector('[data-test="searchDropdownMobile"]');
  var searchToggle = document.querySelector('[data-test="searchToggle"]');
  var mobileSearchBar = document.querySelector('[data-test="mobileSearchBar"]');

  var index = null;
  var activeInput = null;
  var activeDropdown = null;

  function loadIndex() {
    if (index) return Promise.resolve(index);
    return fetch('/search-index.json')
      .then(function(r) { return r.json(); })
      .then(function(data) { index = data; return data; });
  }

  function renderResults(results, dropdown) {
    if (!results.length) {
      dropdown.innerHTML = '<div class="px-4 py-3 text-text-muted text-sm">No results found</div>';
      dropdown.classList.remove('hidden');
      return;
    }
    var html = results.slice(0, 8).map(function(item) {
      var typeLabel = item.type || 'page';
      var scoreHtml = item.score ? '<span class="ml-auto text-xs font-bold text-neon-green">' + item.score + '</span>' : '';
      var brandHtml = item.brand ? '<img src="' + item.brand + '" alt="" class="w-8 h-8 rounded object-contain bg-white/10 flex-shrink-0" width="32" height="32" loading="lazy">' : '<span class="w-8 h-8 rounded bg-bg-secondary flex items-center justify-center flex-shrink-0 text-xs text-text-muted">' + typeLabel.charAt(0).toUpperCase() + '</span>';
      return '<a href="' + item.url + '" class="flex items-center gap-3 px-4 py-3 hover:bg-bg-secondary/50 transition-colors border-b border-border-dark/50 last:border-0" data-test="searchResult">'
        + brandHtml
        + '<div class="flex-1 min-w-0">'
        + '<div class="text-text-primary text-sm font-medium truncate">' + item.title + '</div>'
        + '<span class="text-xs text-text-muted capitalize">' + typeLabel + '</span>'
        + '</div>'
        + scoreHtml
        + '</a>';
    }).join('');
    dropdown.innerHTML = html;
    dropdown.classList.remove('hidden');
  }

  function handleInput(e) {
    var query = e.target.value.trim().toLowerCase();
    var dropdown = e.target === searchInput ? searchDropdown : searchDropdownMobile;
    activeInput = e.target;
    activeDropdown = dropdown;

    if (!query || query.length < 2) {
      dropdown.classList.add('hidden');
      return;
    }

    loadIndex().then(function(data) {
      var results = data.filter(function(item) {
        var haystack = (item.title + ' ' + (item.description || '')).toLowerCase();
        return haystack.indexOf(query) !== -1;
      });
      renderResults(results, dropdown);
    });
  }

  function closeAll() {
    if (searchDropdown) searchDropdown.classList.add('hidden');
    if (searchDropdownMobile) searchDropdownMobile.classList.add('hidden');
  }

  function setupInput(input, dropdown) {
    if (!input) return;
    input.addEventListener('focus', function() { loadIndex(); });
    input.addEventListener('input', handleInput);
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeAll();
        input.blur();
      }
    });
  }

  setupInput(searchInput, searchDropdown);
  setupInput(searchInputMobile, searchDropdownMobile);

  if (searchToggle && mobileSearchBar) {
    searchToggle.addEventListener('click', function() {
      var isHidden = mobileSearchBar.classList.contains('hidden');
      mobileSearchBar.classList.toggle('hidden');
      if (isHidden && searchInputMobile) {
        searchInputMobile.focus();
      }
    });
  }

  document.addEventListener('click', function(e) {
    var isInsideSearch = false;
    if (searchInput && searchInput.contains(e.target)) isInsideSearch = true;
    if (searchDropdown && searchDropdown.contains(e.target)) isInsideSearch = true;
    if (searchInputMobile && searchInputMobile.contains(e.target)) isInsideSearch = true;
    if (searchDropdownMobile && searchDropdownMobile.contains(e.target)) isInsideSearch = true;
    if (searchToggle && searchToggle.contains(e.target)) isInsideSearch = true;
    if (mobileSearchBar && mobileSearchBar.contains(e.target)) isInsideSearch = true;
    if (!isInsideSearch) closeAll();
  });
}

siteSearch();

if (typeof module === 'object') {
  module.exports = siteSearch;
}
