// app.js — self-contained dataset + robust UI with guards
(function () {
  // ----------------------------
  // 1) Build dataset (Italian -> English), then export to window.FLASHCARDS
  // ----------------------------
  function buildDataset() {
    const out = [];
    const seen = new Set();
    const add = (it, en) => {
      it = (it || '').trim();
      en = (en || '').trim();
      if (!it || !en) return;
      const k = it + '||' + en;
      if (!seen.has(k)) { seen.add(k); out.push({ it, en }); }
    };

    // Core starters
    [
      ["Ciao!", "Hi!"], ["Buongiorno", "Good morning"], ["Buonasera", "Good evening"], ["Buonanotte", "Good night"],
      ["Come stai?", "How are you?"], ["Come va?", "How's it going?"], ["Sto bene, grazie", "I'm fine, thank you"],
      ["E tu?", "And you?"], ["Piacere di conoscerti", "Nice to meet you"], ["Grazie", "Thank you"],
      ["Grazie mille", "Thanks a lot"], ["Prego", "You're welcome"], ["Per favore", "Please"],
      ["Mi scusi", "Excuse me (formal)"], ["Scusa", "Excuse me / Sorry (informal)"], ["Mi dispiace", "I'm sorry"],
      ["Nessun problema", "No problem"], ["Di niente", "Don't mention it"], ["Parli inglese?", "Do you speak English?"],
      ["Non capisco", "I don't understand"], ["Capisco", "I understand"], ["Quanto costa?", "How much is it?"],
      ["Dov'è il bagno?", "Where is the bathroom?"], ["Il conto, per favore", "The bill, please"],
      ["Che ore sono?", "What time is it?"], ["A dopo", "See you later"], ["A presto", "See you soon"],
      ["A domani", "See you tomorrow"], ["Buona giornata", "Have a nice day"], ["Buon fine settimana", "Have a good weekend"]
    ].forEach(([it, en]) => add(it, en));

    // Tickets to cities
    "Roma,Milano,Napoli,Torino,Firenze,Bologna,Venezia,Verona,Genova,Pisa,Palermo,Catania,Bari,Lecce,Como,Bergamo,Trento,Trieste,Perugia,Siena"
      .split(",").forEach(c => add(`Un biglietto per ${c}, per favore`, `A ticket to ${c}, please`));

    // Simple orders & shopping
    [
      ["Vorrei un caffè, per favore", "I'd like a coffee, please"],
      ["Vorrei una birra, per favore", "I'd like a beer, please"],
      ["Una bottiglia d'acqua, per favore", "A bottle of water, please"],
      ["Posso pagare con carta?", "Can I pay by card?"],
      ["Accettate carte di credito?", "Do you accept credit cards?"],
      ["Posso provarlo?", "Can I try it on?"],
      ["Dove sono i camerini?", "Where are the fitting rooms?"],
      ["È troppo caro", "It's too expensive"], ["Ha uno sconto?", "Is there a discount?"]
    ].forEach(([it, en]) => add(it, en));

    // Directions, weather, time
    [["A destra","To the right"],["A sinistra","To the left"],["Dritto","Straight ahead"],["Vicino","Near"],["Lontano","Far"],["All'angolo","At the corner"],["Dietro","Behind"],["Davanti","In front"]]
      .forEach(([it,en]) => add(it,en));
    [["Che tempo fa oggi?","What's the weather like today?"],["Fa caldo","It's hot"],["Fa freddo","It's cold"],["C'è il sole","It's sunny"],["È nuvoloso","It's cloudy"],["Sta piovendo","It's raining"],["Tira vento","It's windy"]]
      .forEach(([it,en]) => add(it,en));
    [["A che ora apre?","What time does it open?"],["A che ora chiude?","What time does it close?"],["A che ora parte il treno?","What time does the train leave?"],["A che ora arriva l'autobus?","What time does the bus arrive?"],["È in ritardo","It's delayed"],["È in orario","It's on time"]]
      .forEach(([it,en]) => add(it,en));

    // Hedging phrases for top-up
    const okPhrases = [
      ["Va bene per me","Works for me"], ["Non sono sicuro","I'm not sure"],
      ["Penso di sì","I think so"], ["Penso di no","I don't think so"],
      ["Sono d'accordo","I agree"], ["Non sono d'accordo","I disagree"],
      ["Forse","Maybe"], ["Vediamo","Let's see"]
    ];

    // Time modifiers (aligned IT/EN)
    const genTimes = ["oggi","domani","dopodomani","stasera","domani mattina","domani pomeriggio"];
    const genTimesEn = ["today","tomorrow","the day after tomorrow","this evening","tomorrow morning","tomorrow afternoon"];

    // Generator bases (verbs, objects, places)
    const genVerbs = [
      ["prenotare", "book"], ["comprare", "buy"], ["trovare", "find"], ["noleggiare", "rent"],
      ["visitare", "visit"], ["chiamare", "call"], ["prendere", "get"], ["cambiare", "change"]
    ];

    const genObjectsIt = [
      "un tavolo","un taxi","una camera","un biglietto","una guida","una visita","una lezione",
      "una SIM","un adattatore","una mappa","una prenotazione","una ricevuta","una fattura",
      "del pane","dell'acqua","del vino","dei francobolli","un regalo","dei biglietti","un posto"
    ];
    const genObjectsEn = [
      "a table","a taxi","a room","a ticket","a guide","a tour","a lesson",
      "a SIM card","an adapter","a map","a reservation","a receipt","an invoice",
      "some bread","some water","some wine","some stamps","a gift","some tickets","a seat/place"
    ];

    const genPlacesIt = [
      "a Roma","a Milano","in centro","all'aeroporto","in stazione","in hotel",
      "al museo","al ristorante","alla spiaggia","in farmacia"
    ];
    const genPlacesEn = [
      "in Rome","in Milan","in the city center","at the airport","at the station","at the hotel",
      "at the museum","at the restaurant","at the beach","at the pharmacy"
    ];

    // Sanity logs (just in case)
    if (genObjectsIt.length !== genObjectsEn.length)
      console.warn('Object arrays length mismatch:', genObjectsIt.length, genObjectsEn.length);
    if (genTimes.length !== genTimesEn.length)
      console.warn('Time arrays length mismatch:', genTimes.length, genTimesEn.length);
    if (genPlacesIt.length !== genPlacesEn.length)
      console.warn('Place arrays length mismatch:', genPlacesIt.length, genPlacesEn.length);

    // Generate many unique combos and stop at 1000
    outer:
    for (const [vIt, vEn] of genVerbs) {
      for (let oi = 0; oi < genObjectsIt.length; oi++) {
        const objIt = genObjectsIt[oi], objEn = genObjectsEn[oi];
        for (let pi = 0; pi < genPlacesIt.length; pi++) {
          const itPlace = genPlacesIt[pi], enPlace = genPlacesEn[pi];
          for (let ti = 0; ti < genTimes.length; ti++) {
            if (out.length >= 1000) break outer;
            const whenIt = genTimes[ti], whenEn = genTimesEn[ti];
            add(
              `Vorrei ${vIt} ${objIt} ${whenIt} ${itPlace}`,
              `I'd like to ${vEn} ${objEn} ${whenEn} ${enPlace}`
            );
          }
        }
      }
    }

    // If still <1000 (unlikely), top up with hedges + time mods
    const timeMods = ["adesso","più tardi","stasera","domani","questa settimana","questo weekend"];
    for (let i = 0; out.length < 1000 && i < 5000; i++) {
      const [itBase, enBase] = okPhrases[i % okPhrases.length];
      const mod = timeMods[i % timeMods.length];
      add(`${itBase}, ${mod}`, `${enBase}, ${mod}`);
    }
    return out;
  }

  // Build once & export globally
  window.FLASHCARDS = buildDataset();
  console.log('Dataset built in app.js, length =', window.FLASHCARDS.length);

  // ----------------------------
  // 2) UI logic (with strong guards)
  // ----------------------------
  function startApp() {
    const getCards = () => Array.isArray(window.FLASHCARDS) ? window.FLASHCARDS : [];
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

    // Preferences
    const prefs = JSON.parse(localStorage.getItem("prefs") || "{}");
    optShuffleOnStart.checked = !!prefs.shuffleOnStart;
    optEnFirst.checked = !!prefs.enFirst;

    // Shuffle on start (if chosen)
    if (optShuffleOnStart.checked) shuffleArraySafe(window.FLASHCARDS);
    showEnglish = optEnFirst.checked;

    // Init totals
    statTotal.textContent = String(getCards().length);

    // ---------- Actions ----------
    btnReveal.onclick = () => { showEnglish = true; renderCardSafe(); };

    btnNext.onclick = () => {
      const cards = getCards();
      if (cards.length === 0) return;
      index = (index + 1) % cards.length;
      learning.add(index);
      persist();
      showEnglish = optEnFirst.checked;
      renderCardSafe();
    };

    btnKnown.onclick = () => {
      const cards = getCards();
      if (cards.length === 0) return;
      known.add(index); learning.delete(index);
      persist(); renderCardSafe();
    };

    btnShuffle.onclick = () => {
      shuffleArraySafe(window.FLASHCARDS);
      index = 0; showEnglish = optEnFirst.checked;
      renderCardSafe();
    };

    btnSettings.onclick = () => modal.showModal();

    btnReset.onclick = () => {
      known.clear();
      learning.clear();
      localStorage.removeItem("known");
      localStorage.removeItem("learning");
      renderCardSafe();
    };

    optShuffleOnStart.onchange = savePrefs;
    optEnFirst.onchange = () => { savePrefs(); showEnglish = optEnFirst.checked; renderCardSafe(); };

    // ---------- Helpers ----------
    function renderCardSafe() {
      const cards = getCards();
      const len = cards.length;

      // Update stats regardless
      statKnown.textContent = known.size;
      statLearning.textContent = learning.size;
      statTotal.textContent = String(len);

      if (len === 0) {
        elIt.textContent = "(no cards)";
        elEn.textContent = "";
        elEn.classList.add("hidden");
        elIt.classList.remove("hidden");
        statIndex.textContent = "0";
        return;
      }

      // Clamp index
      if (index < 0) index = 0;
      if (index >= len) index = 0;

      const c = cards[index];
      if (!c || typeof c.it !== "string" || typeof c.en !== "string") {
        // Skip broken entries defensively
        index = (index + 1) % len;
        return renderCardSafe();
      }

      elIt.textContent = c.it;
      elEn.textContent = c.en;
      statIndex.textContent = String(index + 1);

      if (showEnglish) {
        elIt.classList.add("hidden");
        elEn.classList.remove("hidden");
      } else {
        elIt.classList.remove("hidden");
        elEn.classList.add("hidden");
      }
    }

    function shuffleArraySafe(arr) {
      if (!Array.isArray(arr) || arr.length < 2) return;
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

    // First render
    renderCardSafe();
  }

  // Start after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startApp);
  } else {
    startApp();
  }
})();
