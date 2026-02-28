/* app_phrases.js — clean final build (1000 phrases)
   - Self-contained, programmatic generator
   - No duplicate declarations
   - Ends with: window.FLASHCARDS = out; })();
*/

(function () {
  console.log('app_phrases.js: start');

  const out = [];
  const seen = new Set();
  function add(it, en) {
    it = String(it || '').trim();
    en = String(en || '').trim();
    if (!it || !en) return;
    const key = it + '||' + en;
    if (!seen.has(key)) {
      seen.add(key);
      out.push({ it, en });
    }
  }

  // -------------------------
  // Core conversational starters
  // -------------------------
  [
    ["Ciao!", "Hi!"], ["Buongiorno", "Good morning"], ["Buonasera", "Good evening"], ["Buonanotte", "Good night"],
    ["Come stai?", "How are you?"], ["Come va?", "How's it going?"], ["Sto bene, grazie", "I'm fine, thank you"],
    ["E tu?", "And you?"], ["Piacere di conoscerti", "Nice to meet you"],
    ["Grazie", "Thank you"], ["Grazie mille", "Thanks a lot"], ["Prego", "You're welcome"],
    ["Per favore", "Please"], ["Mi scusi", "Excuse me (formal)"], ["Scusa", "Excuse me / Sorry (informal)"],
    ["Mi dispiace", "I'm sorry"], ["Nessun problema", "No problem"], ["Di niente", "Don't mention it"],
    ["Parli inglese?", "Do you speak English?"], ["Non capisco", "I don't understand"], ["Capisco", "I understand"],
    ["Quanto costa?", "How much is it?"], ["Dov'è il bagno?", "Where is the bathroom?"],
    ["Il conto, per favore", "The bill, please"], ["Che ore sono?", "What time is it?"],
    ["A dopo", "See you later"], ["A presto", "See you soon"], ["A domani", "See you tomorrow"],
    ["Buona giornata", "Have a nice day"], ["Buon fine settimana", "Have a good weekend"]
  ].forEach(([it, en]) => add(it, en));

  // -------------------------
  // Useful travel pieces
  // -------------------------
  const cities = ["Roma","Milano","Napoli","Torino","Firenze","Bologna","Venezia","Verona","Genova","Pisa",
                  "Palermo","Catania","Bari","Lecce","Como","Bergamo","Trento","Trieste","Perugia","Siena"];
  cities.forEach(c => add(`Un biglietto per ${c}, per favore`, `A ticket to ${c}, please`));

  [
    ["Vorrei un caffè, per favore", "I'd like a coffee, please"],
    ["Vorrei una birra, per favore", "I'd like a beer, please"],
    ["Una bottiglia d'acqua, per favore", "A bottle of water, please"],
    ["Posso pagare con carta?", "Can I pay by card?"],
    ["Accettate carte di credito?", "Do you accept credit cards?"],
    ["Posso provarlo?", "Can I try it on?"],
    ["Dove sono i camerini?", "Where are the fitting rooms?"],
    ["È troppo caro", "It's too expensive"],
    ["Ha uno sconto?", "Is there a discount?"]
  ].forEach(([it, en]) => add(it, en));

  // -------------------------
  // Directions, time & weather
  // -------------------------
  ["A destra","A sinistra","Dritto","Vicino","Lontano","All'angolo","Dietro","Davanti"]
    .forEach(x => add(x, x === "A destra" ? "To the right"
                     : x === "A sinistra" ? "To the left"
                     : x === "Dritto" ? "Straight ahead"
                     : x === "Vicino" ? "Near"
                     : x === "Lontano" ? "Far"
                     : x === "All'angolo" ? "At the corner"
                     : x === "Dietro" ? "Behind" : "In front"));

  [
    ["Che tempo fa oggi?", "What's the weather like today?"],
    ["Fa caldo", "It's hot"], ["Fa freddo", "It's cold"], ["C'è il sole", "It's sunny"],
    ["È nuvoloso", "It's cloudy"], ["Sta piovendo", "It's raining"], ["Tira vento", "It's windy"]
  ].forEach(([it, en]) => add(it, en));

  [
    ["A che ora apre?", "What time does it open?"], ["A che ora chiude?", "What time does it close?"],
    ["A che ora parte il treno?", "What time does the train leave?"],
    ["A che ora arriva l'autobus?", "What time does the bus arrive?"],
    ["È in ritardo", "It's delayed"], ["È in orario", "It's on time"]
  ].forEach(([it, en]) => add(it, en));

  // -------------------------
  // Section 46: Hedges & time modifiers (we'll reuse for top-up)
  // -------------------------
  const okPhrases = [
