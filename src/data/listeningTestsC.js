// Hörförståelse — mock listening tests modeled on the national SFI course C
// test format. All content is original, written for this app.
//
// audioUrl: pre-generated audio file (Azure Speech). When null, the app falls
// back to reading the transcript with the browser's speech synthesis.

export const LISTENING_TESTS_C = [
  {
    id: "c-test-1",
    title: "Hörförståelse C — Test 1",
    description: "Fem ljudklipp: samtal, telefonsamtal, röstmeddelande, utrop och en berättelse. Du får lyssna på varje klipp två gånger.",
    items: [
      {
        id: "c1-helgplaner",
        type: "dialogue",
        typeLabel: "Samtal",
        typeEmoji: "💬",
        intro: "Två vänner, Lina och Omar, pratar om helgen.",
        audioUrl: null,
        transcript: [
          { speaker: "Lina", text: "Hej Omar! Vad ska du göra i helgen?" },
          { speaker: "Omar", text: "Hej Lina! Jag är inte säker än. På lördag måste jag jobba till klockan tre, men sedan är jag ledig." },
          { speaker: "Lina", text: "Perfekt! Vi tänkte grilla i parken på lördag kväll. Kan du komma efter jobbet?" },
          { speaker: "Omar", text: "Ja, gärna! Ska jag ta med något?" },
          { speaker: "Lina", text: "Kan du köpa dricka? Vi har redan kött och sallad." },
          { speaker: "Omar", text: "Absolut. Hur dags börjar ni?" },
          { speaker: "Lina", text: "Vi ses vid den stora grillplatsen klockan fem. Om det regnar är vi hemma hos mig i stället." },
          { speaker: "Omar", text: "Toppen! Då ses vi på lördag." },
        ],
        questions: [
          {
            q: "När slutar Omar att jobba på lördag?",
            options: ["Klockan tolv", "Klockan tre", "Klockan fem", "Han jobbar inte på lördag"],
            correctIndex: 1,
          },
          {
            q: "Vad ska Omar ta med till grillkvällen?",
            options: ["Kött", "Sallad", "Dricka", "Ingenting"],
            correctIndex: 2,
          },
          {
            q: "Vad gör de om det regnar?",
            options: ["De ställer in grillkvällen", "De grillar i parken ändå", "De träffas hemma hos Lina", "De går på restaurang"],
            correctIndex: 2,
          },
        ],
      },
      {
        id: "c1-vardcentralen",
        type: "phone",
        typeLabel: "Telefonsamtal",
        typeEmoji: "📞",
        intro: "Amir ringer till vårdcentralen.",
        audioUrl: null,
        transcript: [
          { speaker: "Karin", text: "Vårdcentralen Söder, du talar med Karin." },
          { speaker: "Amir", text: "Hej, jag heter Amir Hassan. Jag skulle vilja boka en tid hos läkare. Jag har haft ont i halsen och feber i tre dagar." },
          { speaker: "Karin", text: "Okej. Har du varit hos oss tidigare?" },
          { speaker: "Amir", text: "Ja, jag är listad hos er." },
          { speaker: "Karin", text: "Då ska vi se. Vi har en tid i morgon klockan kvart över tio hos doktor Lindberg. Passar det?" },
          { speaker: "Amir", text: "I morgon förmiddag är det svårt. Jag måste lämna barnen på förskolan och sedan har jag ett möte. Finns det något på eftermiddagen?" },
          { speaker: "Karin", text: "Klockan halv tre i morgon eftermiddag, går det bra?" },
          { speaker: "Amir", text: "Ja, det passar perfekt." },
          { speaker: "Karin", text: "Bra. Ta med legitimation och kom tio minuter innan. Besöket kostar tvåhundra kronor, eller är gratis om du har frikort." },
          { speaker: "Amir", text: "Tack så mycket! Hej då." },
        ],
        questions: [
          {
            q: "Varför ringer Amir till vårdcentralen?",
            options: ["Han vill beställa medicin", "Han vill boka en läkartid", "Han vill avboka en tid", "Han vill fråga om öppettider"],
            correctIndex: 1,
          },
          {
            q: "När får Amir en tid hos läkaren?",
            options: ["I dag klockan kvart över tio", "I morgon klockan kvart över tio", "I morgon klockan halv tre", "På fredag klockan halv tre"],
            correctIndex: 2,
          },
          {
            q: "Vad ska Amir ta med sig till besöket?",
            options: ["Sitt frikort", "Sin legitimation", "Tvåhundra kronor kontant", "Ett sjukintyg"],
            correctIndex: 1,
          },
        ],
      },
      {
        id: "c1-skolmeddelande",
        type: "voicemail",
        typeLabel: "Röstmeddelande",
        typeEmoji: "📱",
        intro: "Ett röstmeddelande från en lärare till Saras föräldrar.",
        audioUrl: null,
        transcript: [
          { speaker: "Eva", text: "Hej! Det här är ett meddelande till Sara Ahmeds föräldrar, från Björkskolan. Jag heter Eva Lundgren och är Saras klasslärare. Jag ringer för att påminna om utvecklingssamtalet på torsdag den fjortonde, klockan halv fem. Vi ses i klassrum B tolv på andra våningen. Om tiden inte passar kan ni ringa mig senast på onsdag. Observera också att eleverna slutar tidigare på fredag, redan klockan tolv, eftersom lärarna har planeringsdag. Tack och hej då!" },
        ],
        questions: [
          {
            q: "Varför ringer läraren?",
            options: ["Sara är sjuk och måste hämtas", "Hon vill påminna om ett möte", "Skolan ska stängas på torsdag", "Sara har glömt sina böcker"],
            correctIndex: 1,
          },
          {
            q: "Var ska utvecklingssamtalet vara?",
            options: ["I matsalen", "I klassrum B tolv", "På lärarens kontor", "I aulan på första våningen"],
            correctIndex: 1,
          },
          {
            q: "Vad händer på fredag?",
            options: ["Eleverna är lediga hela dagen", "Eleverna slutar klockan tolv", "Det är utvecklingssamtal", "Skolan börjar senare"],
            correctIndex: 1,
          },
        ],
      },
      {
        id: "c1-tagutrop",
        type: "announcement",
        typeLabel: "Utrop",
        typeEmoji: "📢",
        intro: "Ett utrop på en tågstation.",
        audioUrl: null,
        transcript: [
          { speaker: "Utropare", text: "Här är ett viktigt meddelande till resande mot Uppsala. Tåget med avgång sexton och fyrtiotvå är försenat med ungefär tjugo minuter på grund av ett signalfel. Tåget avgår dessutom från spår sju i stället för spår tre. Vi beklagar förseningen. Resenärer kan också ta pendeltåget mot Märsta och byta där." },
        ],
        questions: [
          {
            q: "Varför är tåget försenat?",
            options: ["Det har hänt en olycka", "Det är ett signalfel", "Det är dåligt väder", "Det saknas personal"],
            correctIndex: 1,
          },
          {
            q: "Från vilket spår avgår tåget?",
            options: ["Spår tre", "Spår sju", "Spår sexton", "Spår tjugo"],
            correctIndex: 1,
          },
        ],
      },
      {
        id: "c1-fatimas-jobb",
        type: "monologue",
        typeLabel: "Berättelse",
        typeEmoji: "🎙️",
        intro: "Fatima berättar om sitt arbete.",
        audioUrl: null,
        transcript: [
          { speaker: "Fatima", text: "Jag heter Fatima och jag arbetar som undersköterska på ett äldreboende i Malmö. Jag har jobbat där i fem år. Jag arbetar ofta tidiga morgnar, mitt pass börjar klockan sju, men ibland jobbar jag också kvällar och helger. Det bästa med mitt jobb är kontakten med de äldre. Vi pratar, spelar kort och ibland sjunger vi tillsammans. Det svåraste är att vi ofta har för lite personal, så det blir stressigt. Nästa år vill jag vidareutbilda mig till sjuksköterska. Därför läser jag svenska på kvällarna, för att klara antagningen till högskolan." },
        ],
        questions: [
          {
            q: "Var arbetar Fatima?",
            options: ["På ett sjukhus", "På en förskola", "På ett äldreboende", "På en vårdcentral"],
            correctIndex: 2,
          },
          {
            q: "Vad tycker Fatima är svårast med jobbet?",
            options: ["De tidiga morgnarna", "Att det ofta är för lite personal", "Kontakten med de äldre", "Att jobba på helger"],
            correctIndex: 1,
          },
          {
            q: "Varför läser Fatima svenska på kvällarna?",
            options: ["Hon vill byta jobb till en skola", "Hon vill klara antagningen till högskolan", "Hon vill hjälpa sina barn med läxor", "Hennes chef kräver det"],
            correctIndex: 1,
          },
        ],
      },
    ],
  },
];

export function getListeningTest(course, testId) {
  if (course?.toUpperCase() !== "C") return null;
  if (!testId) return LISTENING_TESTS_C[0];
  return LISTENING_TESTS_C.find((t) => t.id === testId) || null;
}
