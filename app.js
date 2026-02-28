// app.js — minimal, deterministic bootstrap that always waits for the dataset.
(function () {
  function loadDatasetThenStart(startFn) {
    // If already present (e.g., from a previous load), start immediately.
    if (Array.isArray(window.FLASHCARDS) && window.FLASHCARDS.length > 0) {
      console.log('Dataset present:', window.FLASHCARDS.length);
      startFn();
      return;
    }
    // Inject with a cache-busting query to avoid any stale SW/CDN copies.
    const s = document.createElement('script');
    s.src = './app_phrases.js?v=' + Date.now();
    s.async = false;
    s.onload = () => {
      console.log('Dataset loaded. length =', window.FLASHCARDS && window.FLASHCARDS.length);
      if (Array.isArray(window.FLASHCARDS) && window.FLASHCARDS.length > 0) {
        startFn();
      } else {
        alert('The phrase list loaded but was empty. Try reloading the page.');
      }
    };
    s.onerror = (e) => {
      console.error('Failed to load app_phrases.js', e);
      alert('Could not download the phrase list file. Please try again.');
    };
    document.head.appendChild(s);
  }

  function startApp() {
    // Guard
    if (!Array.isArray(window.FLASHCARDS) || window.FLASHCARDS.length === 0) {
      alert('The phrase list failed to load. Reload the page.');
      return;
    }

    let index = 0;
    let showEnglish = false;

    let known = new Set(JSON.parse(localStorage.getItem("known") || "[]"));
    let learning = new Set(JSON.parse(localStorage.getItem("learning") || "[]"));

    const elIt = document.getElementById("text-it");
    const elEn = document.getElementById("text-en");
    const card = document.getElementById("card");

    const btnReveal = document.getElementById("btn-reveal");
    const btnNext = document.getElementById("btn-next");
    const btnKnown = document.getElementById("btn-mark-known");
    const btnShuffle = document.getElementById("btn-shuffle");

    const statIndex = document.getElementById("stat-index");
    const statTotal = document.getElementById("stat-total");
    const statKnown = document.getElementById("stat-known");
    const statLearning = document.getElementById("stat-learning");

    const modal = document.getElementById("settings-modal");
    const btnSettings = document.getElementById("btn-settings");
    const btnReset = document.getElementById("btn-reset");
    const optShuffleOnStart = document.getElementById("opt-shuffle-on-start");
    const optEnFirst = document.getElementById("opt-en-first");

    statTotal.textContent = window.FLASHCARDS.length;

    // Preferences
    const prefs = JSON.parse(localStorage.getItem("prefs") || "{}");
    optShuffleOnStart.checked = !!prefs.shuffleOnStart;
    optEnFirst.checked = !!prefs.enFirst;

    if (optShuffleOnStart.checked) shuffleArray(window.FLASHCARDS);
    showEnglish = optEnFirst.checked;

    renderCard();

    // Behaviours
    btnReveal.onclick = () => { showEnglish = true; renderCard(); };
    btnNext.onclick = () => {
      index = (index + 1) % window.FLASHCARDS.length;
      learning.add(index);
      persist();
      showEnglish = optEnFirst.checked;
      renderCard();
    };
    btnKnown.onclick = () => {
      known.add(index); learning.delete(index);
      persist(); renderCard();
    };
    btnShuffle.onclick = () => {
      shuffleArray(window.FLASHCARDS); index = 0; renderCard();
    };
    card.onclick = () => { showEnglish = !showEnglish; renderCard(); };

    btnSettings.onclick = () => modal.showModal();
    btnReset.onclick = () => {
      known.clear(); learning.clear();
      localStorage.removeItem("known");
      localStorage.removeItem("learning");
      renderCard();
    };

    optShuffleOnStart.onchange = savePrefs;
    optEnFirst.onchange = () => { savePrefs(); showEnglish = optEnFirst.checked; renderCard(); };

    // Helpers
    function renderCard() {
      const c = window.FLASHCARDS[index];
      elIt.textContent = c.it;
      elEn.textContent = c.en;

      statIndex.textContent = index + 1;
      statKnown.textContent = known.size;
      statLearning.textContent = learning.size;

      if (showEnglish) {
        elIt.classList.add("hidden");
        elEn.classList.remove("hidden");
      } else {
        elIt.classList.remove("hidden");
        elEn.classList.add("hidden");
      }
    }
    function shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    function persist() {
      localStorage.setItem("known", JSON.stringify([...known]));
      localStorage.setItem("learning", JSON.stringify([...learning]));
    }
    function savePrefs() {
      localStorage.setItem("prefs", JSON.stringify({
        shuffleOnStart: optShuffleOnStart.checked,
        enFirst: optEnFirst.checked,
      }));
    }
  }

  // Start after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => loadDatasetThenStart(startApp));
  } else {
    loadDatasetThenStart(startApp);
  }
})();
