/*
  Quick compare - select 2-3 sites for side-by-side comparison
*/
function quickCompare() {
  var STORAGE_KEY = 'sp_compare';
  var MAX_ITEMS = 3;

  function getSelected() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveSelected(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function getCompareData(card) {
    var dataEl = card.querySelector('[data-test="compareData"]');
    if (dataEl) {
      try { return JSON.parse(dataEl.textContent); } catch (e) { return null; }
    }
    return null;
  }

  // Build the sticky bottom bar
  var bar = document.createElement('div');
  bar.setAttribute('data-test', 'compareBar');
  bar.className = 'fixed bottom-0 left-0 right-0 z-50 bg-bg-card border-t border-border-dark shadow-2xl transform translate-y-full transition-transform duration-300';
  bar.innerHTML = '<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">'
    + '<div data-test="compareItems" class="flex items-center gap-3 flex-1 overflow-x-auto"></div>'
    + '<div class="flex items-center gap-2 flex-shrink-0">'
    + '<button data-test="compareClear" class="px-4 py-2 text-sm font-semibold text-neon-red border border-neon-red/30 rounded-lg hover:bg-neon-red/10 transition-colors">Clear All</button>'
    + '<a data-test="compareOpen" href="/compare/comparison-tool/" class="px-4 py-2 text-sm font-semibold bg-neon-green text-bg-primary rounded-lg hover:bg-neon-green-dim transition-colors inline-flex items-center">Compare</a>'
    + '</div></div>';
  document.body.appendChild(bar);

  var compareItemsEl = bar.querySelector('[data-test="compareItems"]');
  var compareOpenLink = bar.querySelector('[data-test="compareOpen"]');
  var compareClearBtn = bar.querySelector('[data-test="compareClear"]');

  // Check if we're on the comparison tool page
  var toolPage = document.querySelector('[data-test="compareToolPage"]');
  var compareTableInline = toolPage ? toolPage.querySelector('[data-test="compareTableInline"]') : null;
  var compareEmptyState = toolPage ? toolPage.querySelector('[data-test="compareEmptyState"]') : null;
  var compareClearRow = toolPage ? toolPage.querySelector('[data-test="compareClearRow"]') : null;
  var compareToolClear = toolPage ? toolPage.querySelector('[data-test="compareToolClear"]') : null;

  function renderCompareTable() {
    if (!compareTableInline) return;
    var items = getSelected();

    if (items.length < 2) {
      compareTableInline.innerHTML = '';
      if (compareEmptyState) compareEmptyState.classList.remove('hidden');
      if (compareClearRow) compareClearRow.classList.add('hidden');
      return;
    }

    if (compareEmptyState) compareEmptyState.classList.add('hidden');
    if (compareClearRow) compareClearRow.classList.remove('hidden');

    var isDraw = items[0].type === 'draw';

    var rows = [
      { label: 'Logo', key: 'logo' },
      { label: 'Score', key: 'score' },
      { label: isDraw ? 'Jackpot' : 'Welcome Offer', key: isDraw ? 'jackpot' : 'welcomeOffer' },
      { label: isDraw ? 'Entry Cost' : 'Min Deposit', key: isDraw ? 'entryCost' : 'minDeposit' },
      { label: 'Highlights', key: 'highlights' },
      { label: '', key: 'cta' }
    ];

    var colWidth = Math.floor(100 / items.length);
    var html = '<div class="bg-bg-card border border-border-dark rounded-xl p-6 overflow-x-auto"><table class="w-full table-fixed">';
    html += '<colgroup><col class="w-[120px]">';
    items.forEach(function() { html += '<col style="width:' + colWidth + '%">'; });
    html += '</colgroup>';
    rows.forEach(function(row) {
      html += '<tr class="border-b border-border-dark/50">';
      html += '<td class="py-4 pr-4 text-text-muted text-sm font-medium align-top whitespace-nowrap">' + row.label + '</td>';
      items.forEach(function(item) {
        html += '<td class="py-4 px-4 align-top">';
        if (row.key === 'logo') {
          html += '<div class="flex flex-col items-center gap-2">';
          if (item.brand) {
            html += '<div class="w-full py-3 rounded-lg flex items-center justify-center border border-border-dark/50" style="background-color:' + (item.imageColour || '#1A1A2E') + '">'
              + '<img src="' + item.brand + '" alt="' + item.title + '" class="max-w-[140px] max-h-[45px] object-contain" width="140" height="45" loading="lazy"></div>';
          }
          html += '<span class="text-text-primary font-semibold text-sm">' + item.title + '</span></div>';
        } else if (row.key === 'score') {
          var scoreClass = item.score >= 90 ? 'text-neon-green border-neon-green/30 bg-neon-green/20' : item.score >= 80 ? 'text-neon-blue border-neon-blue/30 bg-neon-blue/20' : 'text-neon-purple border-neon-purple/30 bg-neon-purple/20';
          html += '<span class="inline-flex items-center justify-center w-10 h-10 rounded-lg border text-lg font-bold ' + scoreClass + '">' + (item.score || '-') + '</span>';
        } else if (row.key === 'highlights') {
          var highlights = item.highlights || [];
          if (highlights.length) {
            html += '<ul class="space-y-1">';
            highlights.forEach(function(h) {
              var text = typeof h === 'string' ? h : h.text;
              html += '<li class="text-text-secondary text-xs flex items-start gap-1"><svg class="w-3.5 h-3.5 text-neon-green flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>' + text + '</li>';
            });
            html += '</ul>';
          } else {
            html += '<span class="text-text-muted text-xs">-</span>';
          }
        } else if (row.key === 'cta') {
          if (item.externalUrl) {
            html += '<a href="' + item.externalUrl + '?utm_source=slotpicks&utm_medium=affiliate&utm_campaign=compare" target="_blank" rel="noopener" class="inline-flex items-center justify-center py-2 px-4 rounded-lg font-semibold text-sm bg-neon-green text-bg-primary hover:bg-neon-green-dim transition-colors w-full">' + (isDraw ? 'Play Now' : 'Claim Bonus') + '</a>';
          }
          if (item.reviewUrl) {
            html += '<a href="' + item.reviewUrl + '" class="block text-center text-neon-blue hover:text-neon-green text-xs mt-2 transition-colors">Read Review</a>';
          }
        } else {
          html += '<span class="text-text-secondary text-sm">' + (item[row.key] || '-') + '</span>';
        }
        html += '</td>';
      });
      html += '</tr>';
    });
    html += '</table></div>';
    compareTableInline.innerHTML = html;
  }

  function updateBar() {
    var items = getSelected();

    // Update toggle button states on cards
    var allToggles = document.querySelectorAll('[data-test="compareToggle"]');
    allToggles.forEach(function(btn) {
      var id = btn.getAttribute('data-compare-target');
      var isSelected = items.some(function(item) { return item.id === id; });
      if (isSelected) {
        btn.classList.add('border-neon-green', 'text-neon-green', 'bg-neon-green/10');
        btn.classList.remove('border-border-dark', 'text-text-secondary');
      } else {
        btn.classList.remove('border-neon-green', 'text-neon-green', 'bg-neon-green/10');
        btn.classList.add('border-border-dark', 'text-text-secondary');
      }
    });

    // Update bar items
    compareItemsEl.innerHTML = items.map(function(item) {
      var logoHtml = item.brand
        ? '<div class="flex-shrink-0 w-[80px] h-[32px] rounded-md flex items-center justify-center border border-border-dark/50 overflow-hidden" style="background-color:' + (item.imageColour || '#1A1A2E') + '"><img src="' + item.brand + '" alt="" class="max-w-[64px] max-h-[22px] object-contain" width="64" height="22"></div>'
        : '';
      return '<div class="flex items-center gap-2 px-3 py-1.5 bg-bg-secondary rounded-lg flex-shrink-0">'
        + logoHtml
        + '<span class="text-text-primary text-xs font-medium whitespace-nowrap">' + item.title + '</span>'
        + '<button data-remove-id="' + item.id + '" class="ml-1 w-7 h-7 flex items-center justify-center rounded-full text-text-muted hover:text-neon-red hover:bg-neon-red/10 text-base leading-none transition-colors" aria-label="Remove">&times;</button>'
        + '</div>';
    }).join('');

    // Bind remove buttons
    compareItemsEl.querySelectorAll('[data-remove-id]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var id = btn.getAttribute('data-remove-id');
        var current = getSelected().filter(function(item) { return item.id !== id; });
        saveSelected(current);
        updateBar();
      });
    });

    // Show/hide bar (hide on tool page since table is inline)
    if (items.length > 0 && !toolPage) {
      bar.classList.remove('translate-y-full');
    } else if (toolPage) {
      // On tool page, show bar only when items selected but use it just for quick access
      if (items.length > 0) {
        bar.classList.remove('translate-y-full');
      } else {
        bar.classList.add('translate-y-full');
      }
    } else {
      bar.classList.add('translate-y-full');
    }

    // Update compare link text
    compareOpenLink.textContent = 'Compare' + (items.length > 0 ? ' (' + items.length + ')' : '');
    if (items.length < 2) {
      compareOpenLink.classList.add('opacity-40', 'pointer-events-none');
    } else {
      compareOpenLink.classList.remove('opacity-40', 'pointer-events-none');
    }

    // Render inline table on tool page
    if (toolPage) {
      renderCompareTable();
    }
  }

  function toggleItem(card) {
    var data = getCompareData(card);
    if (!data) return;
    var items = getSelected();
    var exists = items.findIndex(function(item) { return item.id === data.id; });

    if (exists !== -1) {
      items.splice(exists, 1);
    } else {
      if (items.length >= MAX_ITEMS) return;
      items.push(data);
    }

    saveSelected(items);
    updateBar();
  }

  function clearAll() {
    saveSelected([]);
    updateBar();
  }

  // Event bindings
  compareClearBtn.addEventListener('click', clearAll);

  if (compareToolClear) {
    compareToolClear.addEventListener('click', clearAll);
  }

  // Bind compare toggle buttons on cards (including tool page mini-cards)
  document.querySelectorAll('[data-test="compareToggle"]').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var card = btn.closest('[data-test="siteCard"], [data-test="drawCard"], [data-test="comparePickCard"]');
      if (card) toggleItem(card);
    });
  });

  // Initial state
  updateBar();
}

quickCompare();

if (typeof module === 'object') {
  module.exports = quickCompare;
}
