// Flashcard data: add/edit here
const FLASHCARDS = [
  { it: 'ciao', en: 'hello' },
  { it: 'grazie', en: 'thank you' },
  { it: 'per favore', en: 'please' },
  { it: 'buongiorno', en: 'good morning' },
  { it: 'arrivederci', en: 'goodbye' },
  { it: 'acqua', en: 'water' },
  { it: 'pane', en: 'bread' },
  { it: 'vino', en: 'wine' },
  { it: 'dove', en: 'where' },
  { it: 'quando', en: 'when' },
  { it: 'quanto costa?', en: 'how much does it cost?' },
  { it: 'mi scusi', en: 'excuse me' },
  { it: 'mi chiamo…', en: 'my name is…' },
  { it: 'piacere', en: 'nice to meet you' },
  { it: 'bagno', en: 'bathroom' },
  { it: 'stazione', en: 'station' },
  { it: 'sinistra', en: 'left' },
  { it: 'destra', en: 'right' },
  { it: 'oggi', en: 'today' },
  { it: 'domani', en: 'tomorrow' },
];

// State
let index = 0;
let showEnglish = false;
let known = new Set(JSON.parse(localStorage.getItem('known') || '[]'));
let learning = new Set(JSON.parse(localStorage.getItem('learning') || '[]'));

// Elements
const elIt = document.getElementById('text-it');
const elEn = document.getElementById('text-en');
const card = document.getElementById('card');
const btnReveal = document.getElementById('btn-reveal');
const btnNext = document.getElementById('btn-next');
const btnKnown = document.getElementById('btn-mark-known');
const btnShuffle = document.getElementById('btn-shuffle');
const statIndex = document.getElementById('stat-index');
const statTotal = document.getElementById('stat-total');
const statKnown = document.getElementById('stat-known');
const statLearning = document.getElementById('stat-learning');
const btnSettings = document.getElementById('btn-settings');
const modal = document.getElementById('settings-modal');
const optShuffleOnStart = document.getElementById('opt-shuffle-on-start');
const optEnFirst = document.getElementById('opt-en-first');
const btnReset = document.getElementById('btn-reset');

statTotal.textContent = FLASHCARDS.length;

// Load prefs
const prefs = JSON.parse(localStorage.getItem('prefs') || '{}');
optShuffleOnStart.checked = !!prefs.shuffleOnStart;
optEnFirst.checked = !!prefs.enFirst;
showEnglish = optEnFirst.checked;

if (optShuffleOnStart.checked) shuffle(FLASHCARDS);
render();

// Event handlers
btnReveal.addEventListener('click', () => {
  showEnglish = true;
  render();
});

btnNext.addEventListener('click', () => {
  index = (index + 1) % FLASHCARDS.length;
  showEnglish = optEnFirst.checked;
  markLearning(index);
  render();
});

btnKnown.addEventListener('click', () => {
  known.add(index);
  learning.delete(index);
  persist();
  render();
});

btnShuffle.addEventListener('click', () => {
  shuffle(FLASHCARDS);
  index = 0;
  render();
});

btnSettings.addEventListener('click', () => modal.showModal());
btnReset.addEventListener('click', () => {
  known.clear();
  learning.clear();
  localStorage.removeItem('known');
  localStorage.removeItem('learning');
  render();
});

optShuffleOnStart.addEventListener('change', () => savePrefs());
optEnFirst.addEventListener('change', () => { savePrefs(); showEnglish = optEnFirst.checked; render(); });

card.addEventListener('click', toggle);
card.addEventListener('keyup', (e) => {
  if (e.code === 'Space' || e.code === 'Enter') toggle();
});

function toggle(){ showEnglish = !showEnglish; render(); }

function render(){
  const c = FLASHCARDS[index];
  elIt.textContent = c.it;
  elEn.textContent = c.en;
  statIndex.textContent = index + 1;
  statKnown.textContent = known.size;
  statLearning.textContent = learning.size;

  if (showEnglish) {
    elEn.classList.remove('hidden');
    elIt.classList.add('hidden');
  } else {
    elIt.classList.remove('hidden');
    elEn.classList.add('hidden');
  }
}

function shuffle(arr){
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function markLearning(i){
  learning.add(i);
  persist();
}

function persist(){
  localStorage.setItem('known', JSON.stringify(Array.from(known)));
  localStorage.setItem('learning', JSON.stringify(Array.from(learning)));
}

function savePrefs(){
  localStorage.setItem('prefs', JSON.stringify({
    shuffleOnStart: optShuffleOnStart.checked,
    enFirst: optEnFirst.checked,
  }));
}
