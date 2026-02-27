// app.js — robust startup that ensures the phrase dataset is present

(function () {
  // ---- bootstrapping: ensure dataset is loaded ----
  function ensureDatasetThen(startFn) {
    // If FLASHCARDS already present and non-empty, go
    if (Array.isArray(window.FLASHCARDS) && window.FLASHCARDS.length > 0) {
      console.log('Dataset ready:', window.FLASHCARDS.length);
      startFn();
      return;
    }

    // If a <script src="app_phrases.js"> tag exists, wait a tick then re-check
    const existing = document.querySelector('script[src*="app_phrases"]');
    if (existing) {
      setTimeout(() => {
        if (Array.isArray(window.FLASHCARDS) && window.FLASHCARDS.length > 0) {
          console.log('Dataset became ready:', window.FLASHCARDS.length);
          startFn();
        } else {
          // As a fallback, inject with a cache-busting query (prevents SW/HTTP caching issues)
          injectDataset(startFn);
        }
      }, 50);
      return;
    }

    // No tag found? inject now.
    injectDataset(startFn);
  }

  function injectDataset(startFn) {
    const s = document.createElement('script');
    // bump the query to beat caches if needed
    s.src = './app_phrases.js?v=10';
    s.async = false; // load & execute in order
    s.onload = () => {
      console.log('Injected dataset size:', window.FLASHCARDS && window.FLASHCARDS.length);
      startFn();
    };
    s.onerror = () => console.error('Failed to load app_phrases.js');
    document.head.appendChild(s);
  }

  // ---- your original app logic, wrapped in startApp() ----
  function startApp() {
    // Guard again (helps if dataset still failed to load)
    if (!Array.isArray(window.FLASHCARDS) || window.FLASHCARDS.length === 0) {
      alert('The phrase list failed to load. Try reloading the page.');
      return;
    }

    // === BEGIN original logic ===

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

    // Load preferences
    const prefs = JSON.parse(localStorage.getItem("prefs") || "{}");
    optShuffleOnStart.checked = !!prefs.shuffleOnStart;
    optEnFirst.checked = !!prefs.enFirst;

    if (optShuffleOnStart.checked) shuffleArray(window.FLASHCARDS);

    showEnglish = optEnFirst.checked;

    renderCard();

    // ------------------- Behavior -------------------

    btnReveal.onclick = () => { showEnglish = true; renderCard(); };

    btnNext.onclick = () => {
      index = (index + 1) % window.FLASHCARDS.length;
      learning.add(index);
      persist();
      showEnglish = optEnFirst.checked;
      renderCard();
    };

    btnKnown.onclick = () => {
      known.add(index);
      learning.delete(index);
      persist();
      renderCard();
    };

    btnShuffle.onclick = () => {
      shuffleArray(window.FLASHCARDS);
      index = 0;
      renderCard();
    };

    card.onclick = () => {
      showEnglish = !showEnglish;
      renderCard();
    };

    btnSettings.onclick = () => modal.showModal();

    btnReset.onclick = () => {
      known.clear();
      learning.clear();
      localStorage.removeItem("known");
      localStorage.removeItem("learning");
      renderCard();
    };

    optShuffleOnStart.onchange = savePrefs;
    optEnFirst.onchange = () => {
      savePrefs();
      showEnglish = optEnFirst.checked;
      renderCard();
    };

    // ------------------- Helpers -------------------

    function renderCard() {
      const cardData = window.FLASHCARDS[index];
      elIt.textContent = cardData.it;
      elEn.textContent = cardData.en;

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
      localStorage.setItem(
        "prefs",
        JSON.stringify({
          shuffleOnStart: optShuffleOnStart.checked,
          enFirst: optEnFirst.checked,
        })
      );
    }

    // === END original logic ===
  }

  // Boot after DOM is ready (ensures <script> tags exist)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ensureDatasetThen(startApp));
  } else {
    ensureDatasetThen(startApp);
  }
})();
