// Extra Kurs C listening clips. Each one has pre-generated audio spoken by
// neural Swedish voices (a different voice per speaker in dialogues), so the
// clip sounds like a person talking instead of the browser's robotic reader.
// They are merged into the Kurs C bank on top of the clips stored in the
// listening_bank table.

const AUDIO_BASE = "https://base44.app/api/apps/6a05a8cd3d89f28998abebbd/files/mp/public/6a05a8cd3d89f28998abebbd/";

export const LISTENING_EXTRA_C = [
  {
    id: "c-dia-051",
    type: "dialogue",
    intro: "Två kollegor, Petter och Nadia, pratar om lunchen.",
    audioUrl: `${AUDIO_BASE}828b24103_c-dia-051.mp3`,
    transcript: [
      { speaker: "Petter", text: "Ska vi äta lunch nu? Jag är jättehungrig." },
      { speaker: "Nadia", text: "Ja, gärna. Men jag har bara trettio minuter, för klockan ett har jag ett möte med chefen." },
      { speaker: "Petter", text: "Det finns ett nytt ställe på hörnet. De har soppa och smörgåsar." },
      { speaker: "Nadia", text: "Perfekt, det går fort. Jag tar en tomatsoppa." },
      { speaker: "Petter", text: "Jag tar en kycklingsmörgås. Ska vi gå direkt?" },
      { speaker: "Nadia", text: "Ja, men jag måste först skicka ett mejl. Jag kommer om två minuter." },
    ],
    questions: [
      { q: "Hur lång lunchrast har Nadia?", options: ["Tjugo minuter", "Trettio minuter", "En timme", "Hon har ingen rast"], correctIndex: 1 },
      { q: "Vad ska Nadia äta?", options: ["Kycklingsmörgås", "Tomatsoppa", "Sallad", "Pasta"], correctIndex: 1 },
      { q: "Varför kan Nadia inte gå direkt?", options: ["Hon måste ringa chefen", "Hon måste skicka ett mejl", "Hon måste hämta sin jacka", "Hon väntar på en kollega"], correctIndex: 1 },
    ],
  },
  {
    id: "c-dia-052",
    type: "dialogue",
    intro: "Två grannar, Sara och Kemal, pratar i tvättstugan.",
    audioUrl: `${AUDIO_BASE}fddbac534_c-dia-052.mp3`,
    transcript: [
      { speaker: "Sara", text: "Hej Kemal! Är du också på väg till tvättstugan?" },
      { speaker: "Kemal", text: "Ja, jag har bokat tid mellan fem och åtta. Men maskinen i hörnet verkar vara trasig." },
      { speaker: "Sara", text: "Igen? Den har varit trasig två gånger den här månaden." },
      { speaker: "Kemal", text: "Man måste anmäla det till hyresvärden. Vet du hur man gör?" },
      { speaker: "Sara", text: "Ja, man skickar ett ärende i appen. Jag kan visa dig." },
      { speaker: "Kemal", text: "Tack! Förresten, vet du när sophämtningen kommer den här veckan?" },
      { speaker: "Sara", text: "På torsdag morgon, eftersom måndag var en helgdag." },
    ],
    questions: [
      { q: "Vad är problemet i tvättstugan?", options: ["Det finns ingen ledig tid", "En maskin är trasig", "Det är ingen el", "Dörren är låst"], correctIndex: 1 },
      { q: "Hur ska Kemal anmäla felet?", options: ["Han ska ringa hyresvärden", "Han ska skicka ett ärende i appen", "Han ska prata med vicevärden", "Han ska skriva en lapp"], correctIndex: 1 },
      { q: "När hämtas soporna den här veckan?", options: ["På måndag", "På onsdag", "På torsdag", "På fredag"], correctIndex: 2 },
    ],
  },
  {
    id: "c-tel-051",
    type: "phone",
    intro: "Rania ringer till sin internetleverantör.",
    audioUrl: `${AUDIO_BASE}3506aad25_c-tel-051.mp3`,
    transcript: [
      { speaker: "Support", text: "Hej och välkommen till supporten. Vad kan jag hjälpa dig med?" },
      { speaker: "Rania", text: "Hej, jag heter Rania och jag har problem med mitt internet hemma. Det har inte fungerat sedan i går kväll." },
      { speaker: "Support", text: "Hej Rania! Har du startat om routern?" },
      { speaker: "Rania", text: "Ja, jag har dragit ut sladden och väntat i två minuter, men det hjälper inte." },
      { speaker: "Support", text: "Okej. Jag ser att det finns ett fel på linjen i ditt område. Vi räknar med att det är lagat före klockan sex i kväll." },
      { speaker: "Rania", text: "Bra. Får jag någon ersättning för dagarna utan internet?" },
      { speaker: "Support", text: "Ja, du kan ansöka om avdrag. Jag skickar en länk till dig via sms." },
      { speaker: "Rania", text: "Tack så mycket!" },
    ],
    questions: [
      { q: "Vad är problemet hemma hos Rania?", options: ["Routern är för gammal", "Internet fungerar inte", "Hon har glömt lösenordet", "Räkningen är obetald"], correctIndex: 1 },
      { q: "När beräknas felet vara lagat?", options: ["Inom en timme", "Före klockan sex i kväll", "I morgon", "Nästa vecka"], correctIndex: 1 },
      { q: "Vad skickar supporten?", options: ["En ny router", "En länk via sms", "En faktura", "En tekniker"], correctIndex: 1 },
    ],
  },
  {
    id: "c-tel-052",
    type: "phone",
    intro: "Tomas ringer till förskolan.",
    audioUrl: `${AUDIO_BASE}4fe12e2c5_c-tel-052.mp3`,
    transcript: [
      { speaker: "Personal", text: "Förskolan Solen, det är Lisa." },
      { speaker: "Tomas", text: "Hej, det är Tomas, pappa till Alma på Blå avdelning. Jag ringer för att hämta henne tidigare i dag." },
      { speaker: "Personal", text: "Hej Tomas! Vad bra att du ringer. När kommer du?" },
      { speaker: "Tomas", text: "Om ungefär en timme. Jag har fått en tid hos läkaren med Alma klockan två." },
      { speaker: "Personal", text: "Okej, jag säger till personalen. Kom ihåg att skriva i appen också." },
      { speaker: "Tomas", text: "Det ska jag göra. Förresten, är det stängt på fredag?" },
      { speaker: "Personal", text: "Ja, på fredag har vi planeringsdag, så förskolan är stängd." },
    ],
    questions: [
      { q: "Varför ringer Tomas?", options: ["Alma är sjuk", "Han vill hämta Alma tidigare", "Han vill boka ett möte", "Han vill anmäla en ledig dag"], correctIndex: 1 },
      { q: "Vart ska Tomas och Alma klockan två?", options: ["Till tandläkaren", "Till läkaren", "Till simhallen", "Till biblioteket"], correctIndex: 1 },
      { q: "Vad gäller på fredag?", options: ["Förskolan öppnar sent", "Förskolan är stängd", "Det är utflykt", "Det är studiedag för barnen"], correctIndex: 1 },
    ],
  },
  {
    id: "c-rost-051",
    type: "voicemail",
    intro: "Ett röstmeddelande från en tandvårdsklinik.",
    audioUrl: `${AUDIO_BASE}06574ad84_c-rost-051.mp3`,
    transcript: [
      { speaker: "Tandvården", text: "Hej! Det här är ett meddelande från Tandvården Centrum till Mehdi Karimi. Du har en tid hos oss på tisdag den tjugofjärde klockan tio och trettio. Kom gärna fem minuter innan. Om du behöver boka om tiden, ring oss senast dagen innan. Kom också ihåg att ta med ditt frikort om du har ett. Tack och hej!" },
    ],
    questions: [
      { q: "Varför ringer kliniken?", options: ["För att påminna om en tid", "För att avboka en tid", "För att sälja en behandling", "För att fråga om betalning"], correctIndex: 0 },
      { q: "När är tiden?", options: ["På tisdag klockan tio och trettio", "På torsdag klockan tio", "På tisdag klockan elva", "På måndag klockan halv elva"], correctIndex: 0 },
      { q: "Vad ska Mehdi ta med?", options: ["Sin legitimation", "Sitt frikort", "Sin journal", "En remiss"], correctIndex: 1 },
    ],
  },
  {
    id: "c-rost-052",
    type: "voicemail",
    intro: "Ett röstmeddelande från en vän som ska flytta.",
    audioUrl: `${AUDIO_BASE}a914b2b66_c-rost-052.mp3`,
    transcript: [
      { speaker: "Lovisa", text: "Hej, det är Lovisa! Jag ringer om lördag. Vi flyttar ju då, och jag undrar om du fortfarande kan hjälpa till. Vi börjar klockan nio och hyr en liten lastbil. Du behöver inte ta med något, vi har kartonger och tejp. Efteråt bjuder vi på pizza. Ring mig gärna i kväll så vet jag hur många vi blir. Hej då!" },
    ],
    questions: [
      { q: "Vad ska de göra på lördag?", options: ["Flytta", "Måla om", "Städa", "Handla möbler"], correctIndex: 0 },
      { q: "När börjar de?", options: ["Klockan åtta", "Klockan nio", "Klockan tio", "Klockan tolv"], correctIndex: 1 },
      { q: "Vad bjuder de på efteråt?", options: ["Fika", "Pizza", "Glass", "Ingenting"], correctIndex: 1 },
    ],
  },
  {
    id: "c-utrop-051",
    type: "announcement",
    intro: "Ett utrop på en tågstation.",
    audioUrl: `${AUDIO_BASE}645d18f37_c-utrop-051.mp3`,
    transcript: [
      { speaker: "Utrop", text: "Kära resenärer, tåget mot Göteborg klockan femton och fyrtio kommer att avgå från spår fyra i stället för spår två. Det beror på ett signalfel. Avgången är försenad med ungefär tio minuter. Resenärer som ska vidare mot Uddevalla kan byta tåg i Göteborg. Vi ber om ursäkt för förseningen." },
    ],
    questions: [
      { q: "Vilket spår avgår tåget från?", options: ["Spår två", "Spår tre", "Spår fyra", "Spår femton"], correctIndex: 2 },
      { q: "Varför byter tåget spår?", options: ["Det är mycket folk", "Det är ett signalfel", "Det snöar", "Det står ett annat tåg på spåret"], correctIndex: 1 },
      { q: "Hur mycket är tåget försenat?", options: ["Fem minuter", "Tio minuter", "Tjugo minuter", "Det är inte försenat"], correctIndex: 1 },
    ],
  },
  {
    id: "c-utrop-052",
    type: "announcement",
    intro: "Ett utrop i en mataffär strax före stängning.",
    audioUrl: `${AUDIO_BASE}8fb0e296b_c-utrop-052.mp3`,
    transcript: [
      { speaker: "Utrop", text: "Kära kunder! Butiken stänger om femton minuter, klockan tjugo. Kassa två och kassa tre är öppna. Glöm inte att ta med dig dina varor från bandet och kontrollera att du har fått ditt kvitto. Vi öppnar igen i morgon klockan åtta. Välkomna åter och tack för i kväll!" },
    ],
    questions: [
      { q: "När stänger butiken?", options: ["Om fem minuter", "Om femton minuter", "Klockan nio", "Klockan halv nio"], correctIndex: 1 },
      { q: "Vilka kassor är öppna?", options: ["Kassa ett och två", "Kassa två och tre", "Bara kassa ett", "Alla kassor"], correctIndex: 1 },
      { q: "När öppnar butiken i morgon?", options: ["Klockan sju", "Klockan åtta", "Klockan nio", "Klockan tio"], correctIndex: 1 },
    ],
  },
  {
    id: "c-ber-051",
    type: "monologue",
    intro: "Ahmed berättar om hur han lärde sig svenska.",
    audioUrl: `${AUDIO_BASE}d70e648d2_c-ber-051.mp3`,
    transcript: [
      { speaker: "Ahmed", text: "Jag kom till Sverige för sex år sedan och började på SFI direkt. Först var det svårt, för alla pratade så fort. Jag lyssnade på radio varje morgon och skrev ner tio nya ord varje dag. Efter ett år fick jag jobb på ett lager, och där pratade vi svenska hela dagarna. Det var den bästa träningen. Nu läser jag svenska på distans på kvällarna, för jag vill bli undersköterska. Mitt tips är att prata mycket och inte vara rädd för att göra fel." },
    ],
    questions: [
      { q: "Hur länge sedan kom Ahmed till Sverige?", options: ["För två år sedan", "För sex år sedan", "För tio år sedan", "Förra året"], correctIndex: 1 },
      { q: "Var fick Ahmed jobb efter ett år?", options: ["På ett lager", "På en skola", "På ett café", "På ett sjukhus"], correctIndex: 0 },
      { q: "Vad vill Ahmed bli?", options: ["Lärare", "Undersköterska", "Busschaufför", "Tolk"], correctIndex: 1 },
    ],
  },
  {
    id: "c-ber-052",
    type: "monologue",
    intro: "Maria berättar om sin nya lägenhet.",
    audioUrl: `${AUDIO_BASE}c64150794_c-ber-052.mp3`,
    transcript: [
      { speaker: "Maria", text: "I våras flyttade vi till en lägenhet i Hjällbo. Den är mindre än den vi hade förut, men den är billigare och ligger nära spårvagnen. Det tar bara tolv minuter till centrum. Det bästa är balkongen, där odlar jag tomater och kryddor. Det sämsta är att det är lyhört, så vi hör grannarna ganska mycket. Vi trivs ändå bra, och barnen har fått nya kompisar i gården." },
    ],
    questions: [
      { q: "Varför flyttade Maria?", options: ["Hon ville bo nära centrum", "Lägenheten är billigare", "Hon behövde en större lägenhet", "Hon fick jobb i en annan stad"], correctIndex: 1 },
      { q: "Vad odlar Maria på balkongen?", options: ["Blommor", "Tomater och kryddor", "Potatis", "Ingenting"], correctIndex: 1 },
      { q: "Vad är det sämsta med lägenheten?", options: ["Den är liten", "Det är lyhört", "Det är långt till spårvagnen", "Det finns ingen balkong"], correctIndex: 1 },
    ],
  },
  {
    id: "c-nyh-051",
    type: "news",
    intro: "Ett kort nyhetsinslag på radion om bibliotekets öppettider.",
    audioUrl: `${AUDIO_BASE}82ab2296a_c-nyh-051.mp3`,
    transcript: [
      { speaker: "Nyhetsuppläsare", text: "Och så lokala nyheter. Biblioteket i centrum förlänger sina öppettider från och med nästa vecka. På vardagar är biblioteket öppet till klockan tjugo i stället för klockan arton. På lördagar öppnar biblioteket redan klockan nio. Den nya satsningen kostar kommunen två miljoner kronor per år. Bibliotekschefen säger att många studenter har efterfrågat längre öppettider." },
    ],
    questions: [
      { q: "Vad handlar nyheten om?", options: ["Nya busslinjer", "Längre öppettider på biblioteket", "En ny skola", "Ett vägarbete"], correctIndex: 1 },
      { q: "Hur länge är biblioteket öppet på vardagar efter ändringen?", options: ["Till klockan arton", "Till klockan nitton", "Till klockan tjugo", "Dygnet runt"], correctIndex: 2 },
      { q: "Varför förlänger biblioteket sina öppettider?", options: ["Kommunen kräver det", "Studenter har efterfrågat det", "Det är sommar", "Fler böcker har köpts in"], correctIndex: 1 },
    ],
  },
  {
    id: "c-nyh-052",
    type: "news",
    intro: "Ett kort nyhetsinslag på radion om vädret.",
    audioUrl: `${AUDIO_BASE}75c9d4ed3_c-nyh-052.mp3`,
    transcript: [
      { speaker: "Nyhetsuppläsare", text: "Vädret. SMHI varnar för kraftigt snöfall i norra delarna av länet under natten mot onsdag. Det kan komma upp till tjugo centimeter snö, och på morgonen kan det bli svårt att ta sig fram på vägarna. Flera busslinjer kan ställas in. Kommunen uppmanar alla att undvika onödiga resor och att ta på sig bra skor. Skolorna håller öppet som vanligt, men skolskjutsarna kan bli försenade." },
    ],
    questions: [
      { q: "Vad varnar SMHI för?", options: ["Kraftig vind", "Kraftigt snöfall", "Regn och åska", "Halka på sjön"], correctIndex: 1 },
      { q: "Hur mycket snö kan det komma?", options: ["Upp till tio centimeter", "Upp till tjugo centimeter", "Upp till en meter", "Ingen snö"], correctIndex: 1 },
      { q: "Vad gäller för skolorna?", options: ["De är stängda", "De öppnar senare", "De håller öppet som vanligt", "De har distansundervisning"], correctIndex: 2 },
    ],
  },
  {
    id: "c-match-051",
    type: "matching",
    intro: "Fyra personer berättar hur de tar sig till jobbet. Matcha varje person med rätt färdmedel. Två alternativ blir över.",
    audioUrl: `${AUDIO_BASE}e17d8fe68_c-match-051.mp3`,
    transcript: [
      { speaker: "Albin", text: "Jag bor bara två kilometer från jobbet, så jag går dit varje morgon. Det tar ungefär tjugofem minuter och jag slipper trängas." },
      { speaker: "Nour", text: "Jag pendlar från Södertälje, så jag tar pendeltåget. Det tar fyrtio minuter, men jag kan läsa på vägen." },
      { speaker: "Ilona", text: "Jag cyklar året runt, även på vintern. Det går fortare än bussen och jag sparar pengar." },
      { speaker: "Rasmus", text: "Jag kör bil, för min arbetsplats ligger utanför stan där bussarna går sällan. Jag delar bil med en kollega." },
    ],
    questions: [
      { q: "Hur tar Albin sig till jobbet?", options: ["Går", "Tar pendeltåget", "Cyklar", "Kör bil", "Tar bussen", "Åker spårvagn"], correctIndex: 0 },
      { q: "Hur tar Nour sig till jobbet?", options: ["Går", "Tar pendeltåget", "Cyklar", "Kör bil", "Tar bussen", "Åker spårvagn"], correctIndex: 1 },
      { q: "Hur tar Ilona sig till jobbet?", options: ["Går", "Tar pendeltåget", "Cyklar", "Kör bil", "Tar bussen", "Åker spårvagn"], correctIndex: 2 },
      { q: "Hur tar Rasmus sig till jobbet?", options: ["Går", "Tar pendeltåget", "Cyklar", "Kör bil", "Tar bussen", "Åker spårvagn"], correctIndex: 3 },
    ],
  },
  {
    id: "c-match-052",
    type: "matching",
    intro: "Fyra personer berättar om sina bostäder. Matcha varje person med rätt boende. Två alternativ blir över.",
    audioUrl: `${AUDIO_BASE}be0ebe314_c-match-052.mp3`,
    transcript: [
      { speaker: "Yusuf", text: "Vi bor i en hyresrätt på femte våningen med tre rum. Hyran är ganska hög, men vi behöver inte bry oss om reparationer." },
      { speaker: "Elin", text: "Jag äger min lägenhet i en bostadsrättsförening. Föreningen tar hand om tvättstugan och gården." },
      { speaker: "Karin", text: "Jag bor i ett radhus med en liten trädgård. Det tar en timme att pendla, men barnen kan leka ute." },
      { speaker: "Petter", text: "Jag hyr ett rum i andra hand i en studentkorridor. Det är billigt och nära universitetet." },
    ],
    questions: [
      { q: "Hur bor Yusuf?", options: ["Hyresrätt", "Bostadsrätt", "Radhus", "Rum i andra hand", "Villa", "Kolonistuga"], correctIndex: 0 },
      { q: "Hur bor Elin?", options: ["Hyresrätt", "Bostadsrätt", "Radhus", "Rum i andra hand", "Villa", "Kolonistuga"], correctIndex: 1 },
      { q: "Hur bor Karin?", options: ["Hyresrätt", "Bostadsrätt", "Radhus", "Rum i andra hand", "Villa", "Kolonistuga"], correctIndex: 2 },
      { q: "Hur bor Petter?", options: ["Hyresrätt", "Bostadsrätt", "Radhus", "Rum i andra hand", "Villa", "Kolonistuga"], correctIndex: 3 },
    ],
  },
];