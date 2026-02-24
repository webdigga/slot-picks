/*
  Filter and sort cards on listing pages
*/
function filterSort() {
  var filterBar = document.querySelector('[data-test="filterBar"]');
  if (!filterBar) return;

  var sortSelect = filterBar.querySelector('[data-test="sortSelect"]');
  var chips = filterBar.querySelectorAll('[data-test="filterChip"]');
  var resultCount = filterBar.querySelector('[data-test="resultCount"]');
  var noResults = filterBar.querySelector('[data-test="noResults"]');
  var clearBtn = filterBar.querySelector('[data-test="clearFilters"]');
  var grid = document.querySelector('[data-test="cardGrid"]');
  if (!grid) return;

  var activeFilters = {};

  function getCards() {
    return Array.prototype.slice.call(grid.querySelectorAll('[data-test="siteCard"], [data-test="drawCard"]'));
  }

  function applyFilters() {
    var cards = getCards();
    var shown = 0;
    var total = cards.length;

    cards.forEach(function(card) {
      var visible = true;

      if (activeFilters['top-rated']) {
        var score = parseInt(card.getAttribute('data-score'), 10);
        if (isNaN(score) || score < 90) visible = false;
      }

      if (activeFilters['free-spins']) {
        if (card.getAttribute('data-has-free-spins') !== 'true') visible = false;
      }

      if (activeFilters['no-wagering']) {
        if (card.getAttribute('data-no-wagering') !== 'true') visible = false;
      }

      card.style.display = visible ? '' : 'none';
      if (visible) shown++;
    });

    if (resultCount) {
      resultCount.textContent = shown + ' of ' + total + ' shown';
    }

    if (noResults) {
      if (shown === 0) {
        noResults.classList.remove('hidden');
      } else {
        noResults.classList.add('hidden');
      }
    }
  }

  function applySort() {
    var value = sortSelect ? sortSelect.value : 'date-desc';
    var cards = getCards();

    cards.sort(function(a, b) {
      if (value === 'score-desc') {
        return (parseInt(b.getAttribute('data-score'), 10) || 0) - (parseInt(a.getAttribute('data-score'), 10) || 0);
      } else if (value === 'score-asc') {
        return (parseInt(a.getAttribute('data-score'), 10) || 0) - (parseInt(b.getAttribute('data-score'), 10) || 0);
      } else if (value === 'date-desc') {
        return (b.getAttribute('data-date') || '').localeCompare(a.getAttribute('data-date') || '');
      }
      return 0;
    });

    cards.forEach(function(card) {
      grid.appendChild(card);
    });
  }

  function toggleChip(chip) {
    var filter = chip.getAttribute('data-filter');
    activeFilters[filter] = !activeFilters[filter];

    if (activeFilters[filter]) {
      chip.classList.add('border-neon-green', 'text-neon-green', 'bg-neon-green/10');
      chip.classList.remove('border-border-dark', 'text-text-secondary');
    } else {
      chip.classList.remove('border-neon-green', 'text-neon-green', 'bg-neon-green/10');
      chip.classList.add('border-border-dark', 'text-text-secondary');
    }

    applyFilters();
  }

  function clearAll() {
    activeFilters = {};
    chips.forEach(function(chip) {
      chip.classList.remove('border-neon-green', 'text-neon-green', 'bg-neon-green/10');
      chip.classList.add('border-border-dark', 'text-text-secondary');
    });
    applyFilters();
  }

  chips.forEach(function(chip) {
    chip.addEventListener('click', function() { toggleChip(chip); });
  });

  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      applySort();
      applyFilters();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', clearAll);
  }

  // Initial count
  applyFilters();
}

filterSort();

if (typeof module === 'object') {
  module.exports = filterSort;
}
