/* phrases_1000.js — generates exactly 1000 phrases with aligned EN translations */
(function () {
  console.log('phrases_1000.js: start');

  const out = [];
  const seen = new Set();
  const add = (it, en) => {
    it = (it || '').trim(); en = (en || '').trim();
    if (!it || !en) return;
    const k = it + '||' + en;
    if (!seen.has(k)) { seen.add(k); out.push({ it, en }); }
  };

  // --- Core starters ---
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

  // --- Cities (tickets) ---
  "Roma,Milano,Napoli,Torino,Firenze,Bologna,Venezia,Verona,Genova,Pisa,Palermo,Catania,Bari,Lecce,Como,Bergamo,Trento,Trieste,Perugia,Siena"
    .split(",").forEach(c => add(`Un biglietto per ${c}, per favore`, `A ticket to ${c}, please`));

  // --- Simple orders & shopping ---
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

  // --- Directions, time & weather ---
  [["A destra","To the right"],["A sinistra","To the left"],["Dritto","Straight ahead"],["Vicino","Near"],["Lontano","Far"],["All'angolo","At the corner"],["Dietro","Behind"],["Davanti","In front"]]
    .forEach(([it,en])=>add(it,en));
  [["Che tempo fa oggi?","What's the weather like today?"],["Fa caldo","It's hot"],["Fa freddo","It's cold"],["C'è il sole","It's sunny"],["È nuvoloso","It's cloudy"],["Sta piovendo","It's raining"],["Tira vento","It's windy"]]
    .forEach(([it,en])=>add(it,en));
  [["A che ora apre?","What time does it open?"],["A che ora chiude?","What time does it close?"],["A che ora parte il treno?","What time does the train leave?"],["A che ora arriva l'autobus?","What time does the bus arrive?"],["È in ritardo","It's delayed"],["È in orario","It's on time"]]
    .forEach(([it,en])=>add(it,en));

  // --- Hedging phrases (for top-up) ---
  const okPhrases = [
    ["Va bene per me","Works for me"], ["Non sono sicuro","I'm not sure"],
    ["Penso di sì","I think so"], ["Penso di no","I don't think so"],
    ["Sono d'accordo","I agree"], ["Non sono d'accordo","I disagree"],
    ["Forse","Maybe"], ["Vediamo","Let's see"]
  ];

  // --- Time modifiers (IT + EN aligned) ---
  const genTimes = ["oggi","domani","dopodomani","stasera","domani mattina","domani pomeriggio"];
  const genTimesEn = ["today","tomorrow","the day after tomorrow","this evening","tomorrow morning","tomorrow afternoon"];

  // --- Generator bases (verbs, objects, places) ---
  const genVerbs = [
    ["prenotare", "book"], ["comprare", "buy"], ["trovare", "find"], ["noleggiare", "rent"],
    ["visitare", "visit"], ["chiamare", "call"], ["prendere", "get"], ["cambiare", "change"]
  ];

  const genObjectsIt = [
    "un tavolo","un taxi","una camera","un biglietto","una guida","una visita","una lezione",
    "una SIM","un adattatore","una mappa","una prenotazione","una ricevuta","una fattura",
    "del pane","dell'acqua","del vino","dei francobolli","un regalo","dei biglietti","un posto"
  ];
  // NEW: 1:1 English counterparts (same index as Italian)
  const genObjectsEn = [
    "a table","a taxi","a room","a ticket","a guide","a tour","a lesson",
