/* MGL — collections par franchise. Le catalogue et les données locales restent intacts. */
(function () {
  'use strict';
  if (typeof games === 'undefined' || typeof render !== 'function') return;

  var activeSaga = null;
  var showAllGames = false;
  var grid = document.getElementById('grid');
  var libraryHeading = grid && grid.previousElementSibling;
  var libraryTitle = libraryHeading && libraryHeading.querySelector('h2');
  var count = document.getElementById('countLabel');
  var controls = document.querySelector('.controls');
  if (!grid || !controls || !libraryTitle || !count) return;

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function franchise(game) {
    var label = String(game.saga || '').trim();
    var name = String(game.title || '').trim();
    if (/^Final Fantasy\b/i.test(label) || /\bFinal Fantasy VII\b/i.test(name) || /^Final Fantasy\b/i.test(name)) return 'Final Fantasy';
    if (/Spyro/i.test(label) || /^The Legend of Spyro\b/i.test(name)) return 'Spyro';
    if (/^Resident Evil\b/i.test(label) || /^Resident Evil\b/i.test(name)) return 'Resident Evil';
    if (!label || label === '—' || label === '-') return null;
    return label;
  }

  function collections() {
    var groups = new Map();
    games.forEach(function (game) {
      var name = franchise(game);
      if (!name) return;
      if (!groups.has(name)) groups.set(name, []);
      groups.get(name).push(game);
    });
    return Array.from(groups.entries())
      .filter(function (entry) { return entry[1].length >= 2; })
      .sort(function (a, b) { return b[1].length - a[1].length || a[0].localeCompare(b[0], 'fr'); });
  }

  var section = document.createElement('section');
  section.id = 'sagaSection';
  section.className = 'sagaSection';
  section.setAttribute('aria-label', 'Collections de franchises');
  section.innerHTML = '<div class="sectionTitle"><div><div class="eyebrow">MES COLLECTIONS</div><h2>Franchises</h2></div><button id="sagaViewMode" class="sagaViewMode" type="button"></button></div><div id="sagaGrid" class="sagaGrid"></div>';
  controls.parentNode.insertBefore(section, controls);

  var breadcrumb = document.createElement('div');
  breadcrumb.id = 'sagaBreadcrumb';
  breadcrumb.className = 'sagaBreadcrumb';
  breadcrumb.hidden = true;
  breadcrumb.innerHTML = '<button class="sagaBack" type="button">← Toutes les franchises</button><span>COLLECTION OUVERTE</span>';
  libraryHeading.parentNode.insertBefore(breadcrumb, libraryHeading);

  function renderCollections() {
    var groups = collections();
    section.hidden = groups.length === 0;
    document.getElementById('sagaViewMode').textContent = showAllGames ? 'Vue par dossiers' : 'Voir tous les jeux';
    document.getElementById('sagaGrid').innerHTML = groups.map(function (entry) {
      var name = entry[0];
      var items = entry[1];
      var artwork = items.filter(function (g) { return g.poster || g.cover; }).slice(0, 3).map(function (game) {
        return '<img src="' + escapeHtml(game.poster || game.cover) + '" alt="" loading="lazy" onerror="this.style.visibility=' + "'hidden'" + '">';
      }).join('');
      return '<button type="button" class="sagaFolder' + (activeSaga === name ? ' selected' : '') + '" data-saga="' + escapeHtml(name) + '" aria-pressed="' + (activeSaga === name) + '">' +
        '<span class="sagaCoverStack" aria-hidden="true">' + artwork + '</span>' +
        '<span class="sagaFolderInfo"><strong>' + escapeHtml(name) + '</strong><small>' + items.length + ' jeux <span aria-hidden="true">↗</span></small></span></button>';
    }).join('');
  }

  function updateLibraryView() {
    if (activeSaga && document.getElementById('q').value.trim()) activeSaga = null;
    var grouped = new Set(collections().map(function (entry) { return entry[0]; }));
    var query = document.getElementById('q').value.trim();
    var soloView = !activeSaga && !showAllGames && folder === 'all' && filter === 'Tous' && !query;
    var visible = 0;

    Array.from(grid.querySelectorAll('.card')).forEach(function (card) {
      var action = card.querySelector('.cardOpen');
      var match = action && String(action.getAttribute('onclick')).match(/^openGame\((\d+)\)$/);
      var game = match ? games[Number(match[1])] : null;
      var name = game ? franchise(game) : null;
      var keep = activeSaga ? name === activeSaga : (!soloView || !grouped.has(name));
      card.hidden = !keep;
      if (keep) visible++;
    });

    if (!visible && !grid.querySelector('.empty')) {
      grid.insertAdjacentHTML('beforeend', '<div class="empty">Aucun jeu à afficher dans cette sélection 🎮</div>');
    }
    libraryTitle.textContent = activeSaga || (soloView ? 'Jeux hors dossiers' : 'Ma bibliothèque');
    count.textContent = visible + ' jeu' + (visible > 1 ? 'x' : '');
    breadcrumb.hidden = !activeSaga;
    renderCollections();
  }

  var originalRender = render;
  render = function () {
    originalRender();
    updateLibraryView();
  };

  var originalSetFolder = setFolder;
  setFolder = function (name) {
    activeSaga = null;
    originalSetFolder(name);
  };

  document.getElementById('sagaGrid').addEventListener('click', function (event) {
    var button = event.target.closest('[data-saga]');
    if (!button) return;
    activeSaga = button.dataset.saga;
    showAllGames = false;
    folder = 'all';
    document.getElementById('q').value = '';
    setFilter('Tous');
    controls.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  document.getElementById('sagaViewMode').addEventListener('click', function () {
    showAllGames = !showAllGames;
    activeSaga = null;
    folder = 'all';
    document.getElementById('q').value = '';
    setFilter('Tous');
  });

  breadcrumb.querySelector('.sagaBack').addEventListener('click', function () {
    activeSaga = null;
    render();
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  render();
})();
