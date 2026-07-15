// Maps Språk topic names (as stored on Lesson.topic) to emoji + English label
// + a short conversation opener. Used by the Tala topic strip so any Språk
// topic can jump straight into a Prata conversation on that theme.

const META = {
  // Common SFI topics — extend freely.
  "Familj": { emoji: "👨‍👩‍👧", en: "Family", opener_sv: "Berätta lite om din familj — vilka bor du med?" },
  "Familjen": { emoji: "👨‍👩‍👧", en: "Family", opener_sv: "Berätta lite om din familj — vilka bor du med?" },
  "Mat": { emoji: "🍽️", en: "Food", opener_sv: "Vad brukar du äta till frukost? Berätta!" },
  "Mat och dryck": { emoji: "🍽️", en: "Food & drink", opener_sv: "Vad brukar du äta till frukost? Berätta!" },
  "Hälsa": { emoji: "🏥", en: "Health", opener_sv: "Hur mår du idag? Motionerar du något?" },
  "Kroppen": { emoji: "🫀", en: "The body", opener_sv: "Berätta — vad gör du för att må bra?" },
  "Arbete": { emoji: "💼", en: "Work", opener_sv: "Vad jobbar du med — eller vad skulle du vilja jobba med?" },
  "Jobb": { emoji: "💼", en: "Work", opener_sv: "Vad jobbar du med — eller vad skulle du vilja jobba med?" },
  "Hemma": { emoji: "🏠", en: "At home", opener_sv: "Berätta om ditt hem — hur ser det ut?" },
  "Hemmet": { emoji: "🏠", en: "At home", opener_sv: "Berätta om ditt hem — hur ser det ut?" },
  "Bostad": { emoji: "🏠", en: "Housing", opener_sv: "Var bor du? Berätta om din bostad." },
  "Handla": { emoji: "🛒", en: "Shopping", opener_sv: "Vad brukar du köpa när du handlar mat?" },
  "Shopping": { emoji: "🛒", en: "Shopping", opener_sv: "Vad brukar du köpa när du handlar mat?" },
  "Skola": { emoji: "🎒", en: "School", opener_sv: "Berätta om din skola eller kurs — vad läser du?" },
  "Utbildning": { emoji: "🎓", en: "Education", opener_sv: "Vilken utbildning har du? Vad vill du plugga vidare?" },
  "Resa": { emoji: "✈️", en: "Travel", opener_sv: "Har du rest någonstans i Sverige? Vart vill du åka?" },
  "Resor": { emoji: "✈️", en: "Travel", opener_sv: "Har du rest någonstans i Sverige? Vart vill du åka?" },
  "Fritid": { emoji: "🎨", en: "Free time", opener_sv: "Vad gör du på fritiden? Har du någon hobby?" },
  "Väder": { emoji: "☀️", en: "Weather", opener_sv: "Vilket väder är det där du bor idag?" },
  "Vädret": { emoji: "☀️", en: "Weather", opener_sv: "Vilket väder är det där du bor idag?" },
  "Tid": { emoji: "🕒", en: "Time", opener_sv: "När stiger du upp på morgonen? Berätta om din dag." },
  "Kläder": { emoji: "👕", en: "Clothes", opener_sv: "Vad har du på dig idag? Vilken färg gillar du?" },
  "Transport": { emoji: "🚌", en: "Transport", opener_sv: "Hur tar du dig till jobbet eller skolan?" },
  "Sverige": { emoji: "🇸🇪", en: "Sweden", opener_sv: "Vad tycker du bäst om med Sverige?" },
  "Presentation": { emoji: "👋", en: "Introductions", opener_sv: "Hej! Kan du berätta lite om dig själv?" },
  "Hälsningar": { emoji: "👋", en: "Greetings", opener_sv: "Hej! Hur mår du idag?" },
  "Läkare": { emoji: "🩺", en: "Doctor", opener_sv: "Hej, kom in. Vad kan jag hjälpa dig med idag?" },
  "Sjukdom": { emoji: "🤒", en: "Illness", opener_sv: "Hur mår du? Är du sjuk eller frisk idag?" },
  "Djur": { emoji: "🐶", en: "Animals", opener_sv: "Har du något husdjur? Vilket djur gillar du bäst?" },
  "Natur": { emoji: "🌲", en: "Nature", opener_sv: "Tycker du om att vara ute i naturen? Berätta." },
  "Miljö": { emoji: "🌍", en: "Environment", opener_sv: "Vad gör du för att hjälpa miljön?" },
};

const DEFAULT_META = {
  emoji: "💬",
  en: "",
  opener_sv: "Hej! Ska vi prata om det här ämnet på svenska?",
};

export function getTopicMeta(topic) {
  if (!topic) return DEFAULT_META;
  return META[topic] || { ...DEFAULT_META, en: topic };
}