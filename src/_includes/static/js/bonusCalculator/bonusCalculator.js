/*
  Bonus calculator - calculates bonus values per deposit amount
*/
function bonusCalculator() {
  var calculator = document.querySelector('[data-test="bonusCalculator"]');
  if (!calculator) return;

  var depositInput = calculator.querySelector('[data-test="depositInput"]');
  var rows = calculator.querySelectorAll('[data-test="bonusRow"]');

  // Hide calculator if no bonus rows exist
  if (!rows.length) {
    calculator.style.display = 'none';
    return;
  }

  function calculate() {
    var deposit = parseFloat(depositInput.value) || 0;
    if (deposit < 0) deposit = 0;
    if (deposit > 10000) deposit = 10000;

    rows.forEach(function(row) {
      var pct = parseFloat(row.getAttribute('data-bonus-pct')) || 0;
      var max = parseFloat(row.getAttribute('data-bonus-max')) || 0;
      var wagering = parseFloat(row.getAttribute('data-wagering')) || 0;
      var spinsCount = parseInt(row.getAttribute('data-spins-count'), 10) || 0;
      var spinValue = parseFloat(row.getAttribute('data-spin-value')) || 0;

      var bonus = Math.min(deposit * pct / 100, max);
      var spinsTotal = spinsCount * spinValue;
      var totalPlay = deposit + bonus + spinsTotal;
      var wageringReq = (bonus + spinsTotal) * wagering;

      row.querySelector('[data-test="bonusAmount"]').textContent = deposit > 0 && pct > 0 ? '\u00A3' + bonus.toFixed(2) : '-';
      row.querySelector('[data-test="spinsValue"]').textContent = spinsCount > 0 ? '\u00A3' + spinsTotal.toFixed(2) + ' (' + spinsCount + ' spins)' : '-';
      row.querySelector('[data-test="totalPlay"]').textContent = deposit > 0 ? '\u00A3' + totalPlay.toFixed(2) : '-';
      row.querySelector('[data-test="wageringAmount"]').textContent = wagering > 0 && (bonus > 0 || spinsTotal > 0) ? '\u00A3' + wageringReq.toFixed(2) + ' (' + wagering + 'x)' : 'None';
    });
  }

  depositInput.addEventListener('input', calculate);
  calculate();
}

bonusCalculator();

if (typeof module === 'object') {
  module.exports = bonusCalculator;
}
