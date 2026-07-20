// Auto-generated mission content. Schema: src/lib/missionPrompt.js
// Keyed by title_sv (must match src/data/missionCatalog.js exactly).
export const MISSION_CONTENT_A2 = {
  "Boka tid hos tandläkaren": {
    description_en: "Call a dental clinic with toothache and get an urgent appointment.",
    opener_sv: "Tandläkarmottagningen, hej! Vad kan jag hjälpa dig med?",
    opener_en: "The dental clinic, hello! How can I help you?",
    goal: "Get an urgent dentist appointment today or tomorrow and confirm the time.",
    success_criteria: [
      "Explain that you have toothache and need an urgent appointment",
      "Give your personnummer when the receptionist asks",
      "Confirm the day and time of the appointment"
    ],
    curveballs: [
      "The receptionist says there are no free times today",
      "She asks exactly where it hurts and for how long",
      "She asks if you are already a patient at the clinic"
    ],
    cultural_notes: "In Sweden you are almost always asked for your personnummer when booking healthcare, so have it ready.",
    suggested_vocab: ["tandvärk", "akut", "en tid", "personnummer", "det gör ont", "i morgon"],
    key_vocabulary: [
      { swedish: "tandvärk", english: "toothache", example_sv: "Jag har haft tandvärk sedan i går.", example_en: "I have had toothache since yesterday.", pronunciation_tip: "Two words glued together: TAND-vairk, stress on the first part." },
      { swedish: "akut", english: "urgent", example_sv: "Jag behöver en akut tid.", example_en: "I need an urgent appointment.", pronunciation_tip: "Stress on the last syllable: a-KUT." },
      { swedish: "en tid", english: "an appointment", example_sv: "Kan jag boka en tid i dag?", example_en: "Can I book an appointment today?", pronunciation_tip: "Long i, like 'teed'." },
      { swedish: "personnummer", english: "personal identity number", example_sv: "Vad har du för personnummer?", example_en: "What is your personal identity number?", pronunciation_tip: "Stress the first syllable: peh-SHON-noommer." },
      { swedish: "det gör ont", english: "it hurts", example_sv: "Det gör ont när jag äter.", example_en: "It hurts when I eat.", pronunciation_tip: "'Gör' sounds like 'yur'." },
      { swedish: "ledig", english: "free / available", example_sv: "Finns det någon ledig tid i morgon?", example_en: "Is there any free time tomorrow?", pronunciation_tip: "LEH-dig, long first e." }
    ],
    key_phrases: [
      { situation_en: "Explaining why you are calling", phrase_sv: "Hej, jag ringer för att jag har jätteont i en tand.", phrase_en: "Hi, I'm calling because I have a really bad toothache.", pronunciation_tip: "'Jätteont' = YET-te-oont, stress on 'jätte'." },
      { situation_en: "Asking for an urgent slot", phrase_sv: "Har ni någon akut tid i dag eller i morgon?", phrase_en: "Do you have any urgent appointment today or tomorrow?", pronunciation_tip: "'Någon' is often said 'nån' in speech." },
      { situation_en: "Giving your personnummer", phrase_sv: "Mitt personnummer är åttiofem noll tre tjugo...", phrase_en: "My personal number is eighty-five zero three twenty...", pronunciation_tip: "Say the numbers in pairs, slowly." },
      { situation_en: "Describing the pain", phrase_sv: "Det gör ont när jag tuggar, särskilt på höger sida.", phrase_en: "It hurts when I chew, especially on the right side.", pronunciation_tip: "'Tuggar' has a short u, like 'tug-gar'." },
      { situation_en: "Confirming the booking", phrase_sv: "Så klockan halv tre i morgon? Det passar bra, tack!", phrase_en: "So half past two tomorrow? That works well, thanks!", pronunciation_tip: "Remember: 'halv tre' means 2:30, not 3:30." }
    ],
    rehearsal_drills: [
      { type: "gap_fill", prompt_sv: "Jag har jätteont i en tand. Har ni någon ___ tid i dag?", prompt_en: "I have a really bad toothache. Do you have any ___ appointment today?", expected_answer_sv: "akut", expected_answer_en: "urgent", options: ["akut", "billig", "lång", "trevlig"], hint_en: "The word for something that can't wait." },
      { type: "quick_response", prompt_sv: "Kan jag få ditt personnummer?", prompt_en: "Can I have your personal identity number?", expected_answer_sv: "Ja, det är åttiofem noll tre tjugo, ett två tre fyra.", expected_answer_en: "Yes, it's eighty-five zero three twenty, one two three four.", hint_en: "Give the numbers calmly, in pairs.", options: null },
      { type: "quick_response", prompt_sv: "Tyvärr har vi inga tider i dag. Fungerar i morgon klockan nio?", prompt_en: "Unfortunately we have no times today. Does tomorrow at nine work?", expected_answer_sv: "Ja, i morgon klockan nio fungerar bra. Tack så mycket!", expected_answer_en: "Yes, tomorrow at nine works well. Thank you so much!", hint_en: "Accept the new time and confirm it back.", options: null }
    ]
  },
  "Ringa till vårdcentralen": {
    description_en: "Call the health centre about a three-day fever and book an appointment.",
    opener_sv: "Vårdcentralen, du talar med Svea. Hur kan jag hjälpa dig?",
    opener_en: "The health centre, you're speaking with Svea. How can I help you?",
    goal: "Describe your fever, get an appointment, and write down the time you are given.",
    success_criteria: [
      "Describe your symptoms and say how long you have had them",
      "Ask for an appointment with a doctor or nurse",
      "Repeat back the time you are given to confirm it"
    ],
    curveballs: [
      "The nurse asks if you have taken your temperature and what it was",
      "She suggests a phone appointment instead of a visit",
      "She asks if you have any other symptoms, like a cough or sore throat"
    ],
    cultural_notes: "In Sweden you often talk to a nurse first who decides if you need to see a doctor, so describe your symptoms clearly to her.",
    suggested_vocab: ["feber", "i tre dagar", "symtom", "en sjuksköterska", "boka en tid", "hosta"],
    key_vocabulary: [
      { swedish: "feber", english: "fever", example_sv: "Jag har haft feber i tre dagar.", example_en: "I have had a fever for three days.", pronunciation_tip: "FEH-ber, long first e." },
      { swedish: "symtom", english: "symptom", example_sv: "Har du några andra symtom?", example_en: "Do you have any other symptoms?", pronunciation_tip: "Stress on the last syllable: sym-TOM." },
      { swedish: "sjuksköterska", english: "nurse", example_sv: "Du får prata med en sjuksköterska först.", example_en: "You get to talk to a nurse first.", pronunciation_tip: "Starts with the tricky 'sj' sound, like a soft 'hw': HWOOK-shur-ter-ska." },
      { swedish: "hosta", english: "cough", example_sv: "Jag har också lite hosta.", example_en: "I also have a bit of a cough.", pronunciation_tip: "HOOS-ta, long o." },
      { swedish: "ont i halsen", english: "sore throat", example_sv: "Jag har ont i halsen när jag sväljer.", example_en: "My throat hurts when I swallow.", pronunciation_tip: "'Halsen' = HAL-sen, short a." },
      { swedish: "temperatur", english: "temperature", example_sv: "Jag tog temperaturen i morse.", example_en: "I took my temperature this morning.", pronunciation_tip: "Stress at the end: tem-per-a-TOOR." }
    ],
    key_phrases: [
      { situation_en: "Explaining why you are calling", phrase_sv: "Hej, jag ringer för att jag har haft feber i tre dagar.", phrase_en: "Hi, I'm calling because I have had a fever for three days.", pronunciation_tip: "'Haft' has a short a, like 'huft'." },
      { situation_en: "Asking for an appointment", phrase_sv: "Kan jag få en tid hos en läkare?", phrase_en: "Can I get an appointment with a doctor?", pronunciation_tip: "'Läkare' = LAI-ka-reh, stress first syllable." },
      { situation_en: "Giving your temperature", phrase_sv: "Jag tog tempen i morse, och den var trettionio komma två.", phrase_en: "I took my temperature this morning, and it was thirty-nine point two.", pronunciation_tip: "'Komma' is used for the decimal point." },
      { situation_en: "Mentioning other symptoms", phrase_sv: "Jag har också hosta och lite ont i halsen.", phrase_en: "I also have a cough and a slightly sore throat.", pronunciation_tip: "'Också' = OK-so, the 'ck' is a hard k." },
      { situation_en: "Confirming the time", phrase_sv: "Klockan tio och fyrtiofem i morgon, då kommer jag. Tack!", phrase_en: "Ten forty-five tomorrow, I'll be there. Thanks!", pronunciation_tip: "Say the time back slowly to be sure." }
    ],
    rehearsal_drills: [
      { type: "gap_fill", prompt_sv: "Jag har haft ___ i tre dagar och känner mig mycket trött.", prompt_en: "I have had a ___ for three days and feel very tired.", expected_answer_sv: "feber", expected_answer_en: "fever", options: ["feber", "hunger", "semester", "tur"], hint_en: "Your body is too warm.", },
      { type: "quick_response", prompt_sv: "Har du tagit tempen? Vad låg den på?", prompt_en: "Have you taken your temperature? What was it?", expected_answer_sv: "Ja, i morse. Den var trettionio komma två.", expected_answer_en: "Yes, this morning. It was thirty-nine point two.", hint_en: "Answer yes and give a number with 'komma'.", options: null },
      { type: "quick_response", prompt_sv: "Har du några andra symtom, till exempel hosta eller ont i halsen?", prompt_en: "Do you have any other symptoms, for example a cough or a sore throat?", expected_answer_sv: "Ja, jag har lite hosta, men inte ont i halsen.", expected_answer_en: "Yes, I have a bit of a cough, but not a sore throat.", hint_en: "Mention one symptom you have and one you don't.", options: null }
    ]
  },
  "Hämta paket på ombudet": {
    description_en: "Pick up a parcel at the service point even though you forgot the notification code.",
    opener_sv: "Hej! Ska du hämta ett paket?",
    opener_en: "Hi! Are you here to pick up a parcel?",
    goal: "Collect your parcel using your ID even though you don't have the code.",
    success_criteria: [
      "Explain that you have a parcel but forgot the code",
      "Offer your ID and give your name and address",
      "Sign for the parcel and thank the staff member"
    ],
    curveballs: [
      "The staff member asks which company the parcel is from",
      "The system finds two parcels in your name and she asks which one you want",
      "She asks for your phone number to search for the parcel"
    ],
    cultural_notes: "Most Swedish parcels are collected at a supermarket or kiosk 'ombud', and showing legitimation (ID) is standard and expected.",
    suggested_vocab: ["ett paket", "avi", "koden", "legitimation", "hämta", "skriva under"],
    key_vocabulary: [
      { swedish: "hämta", english: "to pick up / collect", example_sv: "Jag ska hämta ett paket.", example_en: "I'm here to pick up a parcel.", pronunciation_tip: "HEM-ta, short e." },
      { swedish: "avi", english: "delivery notification", example_sv: "Jag fick en avi i mobilen.", example_en: "I got a notification on my phone.", pronunciation_tip: "Stress at the end: a-VEE." },
      { swedish: "kod", english: "code", example_sv: "Jag har tyvärr glömt koden.", example_en: "Unfortunately I have forgotten the code.", pronunciation_tip: "Long o, like 'code' without the y-sound." },
      { swedish: "legitimation", english: "ID", example_sv: "Har du legitimation med dig?", example_en: "Do you have ID with you?", pronunciation_tip: "Often shortened to 'leg' (pronounced 'legg') in speech." },
      { swedish: "skriva under", english: "to sign", example_sv: "Kan du skriva under här?", example_en: "Can you sign here?", pronunciation_tip: "'Skriva' = SKREE-va, long i." },
      { swedish: "glömma", english: "to forget", example_sv: "Jag glömde mobilen hemma.", example_en: "I forgot my phone at home.", pronunciation_tip: "'Glömde' = GLUM-deh, with rounded ö." }
    ],
    key_phrases: [
      { situation_en: "Explaining your problem", phrase_sv: "Jag ska hämta ett paket, men jag har glömt koden.", phrase_en: "I'm here to pick up a parcel, but I have forgotten the code.", pronunciation_tip: "'Glömt' = glumt, short and soft." },
      { situation_en: "Offering your ID instead", phrase_sv: "Jag har legitimation med mig. Räcker det?", phrase_en: "I have ID with me. Is that enough?", pronunciation_tip: "'Räcker' = RECK-er." },
      { situation_en: "Giving your details", phrase_sv: "Jag heter Deepak Rana och bor på Storgatan fem.", phrase_en: "My name is Deepak Rana and I live at Storgatan five.", pronunciation_tip: "Street names end in '-gatan', stress on the first syllable." },
      { situation_en: "Answering which parcel", phrase_sv: "Det är det lilla paketet från Zalando, tror jag.", phrase_en: "It's the small parcel from Zalando, I think.", pronunciation_tip: "'Tror jag' at the end softens the answer." },
      { situation_en: "Finishing up", phrase_sv: "Ska jag skriva under här? Tack för hjälpen!", phrase_en: "Should I sign here? Thanks for the help!", pronunciation_tip: "'Tack för hjälpen' = tack fur YEL-pen." }
    ],
    rehearsal_drills: [
      { type: "gap_fill", prompt_sv: "Jag ska hämta ett paket, men jag har glömt ___.", prompt_en: "I'm here to pick up a parcel, but I have forgotten ___.", expected_answer_sv: "koden", expected_answer_en: "the code", options: ["koden", "maten", "nyckeln", "bilen"], hint_en: "The numbers from the notification message.", },
      { type: "quick_response", prompt_sv: "Har du någon legitimation med dig?", prompt_en: "Do you have any ID with you?", expected_answer_sv: "Ja, här är mitt körkort. Varsågod.", expected_answer_en: "Yes, here is my driving licence. Here you go.", hint_en: "Say yes and hand something over with 'varsågod'.", options: null },
      { type: "quick_response", prompt_sv: "Jag hittar två paket på ditt namn. Vilket vill du hämta?", prompt_en: "I find two parcels in your name. Which one do you want to pick up?", expected_answer_sv: "Oj! Jag tar båda två, tack.", expected_answer_en: "Oh! I'll take both of them, thanks.", hint_en: "You can take both — 'båda två'.", options: null }
    ]
  },
  "Öppna bankkonto": {
    description_en: "Visit a bank branch to open a personal account and answer the clerk's questions.",
    opener_sv: "Hej och välkommen! Vad kan jag hjälpa dig med i dag?",
    opener_en: "Hello and welcome! What can I help you with today?",
    goal: "Open a personal bank account and understand what happens next.",
    success_criteria: [
      "Say clearly that you want to open a personal account",
      "Answer questions about ID, address, and work",
      "Ask what happens next and when you get your card"
    ],
    curveballs: [
      "The clerk asks why you need the account and where your money comes from",
      "She says you need a document you don't have with you",
      "She asks if you also want BankID and a mobile app"
    ],
    cultural_notes: "Swedish banks are required to ask where your money comes from, so don't be offended — it's a routine question for everyone.",
    suggested_vocab: ["ett konto", "öppna", "lön", "anställd", "legitimation", "BankID"],
    key_vocabulary: [
      { swedish: "konto", english: "account", example_sv: "Jag vill öppna ett konto.", example_en: "I want to open an account.", pronunciation_tip: "KON-to, both o's are short." },
      { swedish: "lön", english: "salary", example_sv: "Min lön kommer den tjugofemte.", example_en: "My salary comes on the 25th.", pronunciation_tip: "Long ö, like 'learn' without the r." },
      { swedish: "anställd", english: "employed", example_sv: "Jag är anställd på ett IT-företag.", example_en: "I am employed at an IT company.", pronunciation_tip: "an-STELLD, stress in the middle." },
      { swedish: "fylla i", english: "to fill in", example_sv: "Kan du fylla i den här blanketten?", example_en: "Can you fill in this form?", pronunciation_tip: "'Fylla' = FUL-la with rounded y." },
      { swedish: "blankett", english: "form", example_sv: "Här är blanketten du behöver.", example_en: "Here is the form you need.", pronunciation_tip: "Stress at the end: blan-KETT." },
      { swedish: "bankkort", english: "bank card", example_sv: "När får jag mitt bankkort?", example_en: "When do I get my bank card?", pronunciation_tip: "Two hard k-sounds: BANK-kort." }
    ],
    key_phrases: [
      { situation_en: "Stating why you are there", phrase_sv: "Hej! Jag skulle vilja öppna ett bankkonto.", phrase_en: "Hi! I would like to open a bank account.", pronunciation_tip: "'Skulle vilja' is the polite way to ask — SKOOL-le VIL-ya." },
      { situation_en: "Explaining your job", phrase_sv: "Jag jobbar heltid och får lön varje månad.", phrase_en: "I work full time and get a salary every month.", pronunciation_tip: "'Heltid' = HEL-teed." },
      { situation_en: "Answering where money comes from", phrase_sv: "Pengarna kommer från min lön här i Sverige.", phrase_en: "The money comes from my salary here in Sweden.", pronunciation_tip: "'Pengarna' = PENG-ar-na." },
      { situation_en: "Asking about next steps", phrase_sv: "Vad händer nu? När får jag kortet?", phrase_en: "What happens now? When do I get the card?", pronunciation_tip: "'Händer' = HEN-der." },
      { situation_en: "Asking about BankID", phrase_sv: "Kan jag få BankID också? Det behöver man ju överallt.", phrase_en: "Can I get BankID too? You need it everywhere after all.", pronunciation_tip: "The little word 'ju' means 'as you know'." }
    ],
    rehearsal_drills: [
      { type: "gap_fill", prompt_sv: "Hej! Jag skulle vilja ___ ett bankkonto.", prompt_en: "Hi! I would like to ___ a bank account.", expected_answer_sv: "öppna", expected_answer_en: "open", options: ["öppna", "stänga", "sälja", "glömma"], hint_en: "The opposite of closing.", },
      { type: "quick_response", prompt_sv: "Får jag fråga varifrån pengarna kommer?", prompt_en: "May I ask where the money comes from?", expected_answer_sv: "Absolut, pengarna kommer från min lön. Jag jobbar heltid.", expected_answer_en: "Of course, the money comes from my salary. I work full time.", hint_en: "It's a routine question — answer calmly with 'lön'.", options: null },
      { type: "quick_response", prompt_sv: "Du behöver också ett anställningsbevis. Har du det med dig?", prompt_en: "You also need an employment certificate. Do you have it with you?", expected_answer_sv: "Nej, tyvärr inte. Kan jag mejla det till er senare?", expected_answer_en: "No, unfortunately not. Can I email it to you later?", hint_en: "Say no politely and suggest a solution.", options: null }
    ]
  },
  "Anmäla flytt till Skatteverket": {
    description_en: "Call Skatteverket to find out how to register your new address after moving.",
    opener_sv: "Skatteverket, hej! Vad gäller ditt samtal?",
    opener_en: "The Tax Agency, hello! What is your call about?",
    goal: "Find out how to register your new address and by when you must do it.",
    success_criteria: [
      "Explain that you have moved and want to register the new address",
      "Ask how to do the registration, online or on paper",
      "Ask about the deadline and repeat it back"
    ],
    curveballs: [
      "The officer asks for your old and new address",
      "She asks if more people in the household are moving with you",
      "She explains you can do it online with BankID and asks if you have that"
    ],
    cultural_notes: "In Sweden you must report a move to Skatteverket within a week, because your registered address (folkbokföring) controls many other services.",
    suggested_vocab: ["flytta", "anmäla", "adress", "folkbokförd", "senast", "blankett"],
    key_vocabulary: [
      { swedish: "flytta", english: "to move (house)", example_sv: "Vi flyttade förra veckan.", example_en: "We moved last week.", pronunciation_tip: "FLUT-ta, short y like a short u." },
      { swedish: "anmäla", english: "to report / register", example_sv: "Jag vill anmäla min flytt.", example_en: "I want to report my move.", pronunciation_tip: "AN-mai-la, stress first syllable." },
      { swedish: "adress", english: "address", example_sv: "Min nya adress är Solvägen tre.", example_en: "My new address is Solvägen three.", pronunciation_tip: "Stress at the end: a-DRESS." },
      { swedish: "folkbokförd", english: "registered (as living somewhere)", example_sv: "Var är du folkbokförd i dag?", example_en: "Where are you registered as living today?", pronunciation_tip: "FOLK-book-furd — a very Swedish word worth learning." },
      { swedish: "senast", english: "at the latest", example_sv: "Du ska anmäla flytten senast en vecka efter.", example_en: "You must report the move within a week at the latest.", pronunciation_tip: "SEH-nast, stress first syllable." },
      { swedish: "hushåll", english: "household", example_sv: "Hur många bor i ditt hushåll?", example_en: "How many people live in your household?", pronunciation_tip: "HUS-holl, long u then short o." }
    ],
    key_phrases: [
      { situation_en: "Explaining why you are calling", phrase_sv: "Hej! Jag har precis flyttat och vill anmäla min nya adress.", phrase_en: "Hi! I have just moved and want to register my new address.", pronunciation_tip: "'Precis' = preh-SEES, means 'just'." },
      { situation_en: "Asking how to register", phrase_sv: "Hur gör jag det? Kan man göra det på nätet?", phrase_en: "How do I do that? Can you do it online?", pronunciation_tip: "'På nätet' = on the internet." },
      { situation_en: "Giving your new address", phrase_sv: "Den nya adressen är Solvägen tre i Uppsala.", phrase_en: "The new address is Solvägen three in Uppsala.", pronunciation_tip: "Spell the street name if it's unusual." },
      { situation_en: "Asking about the deadline", phrase_sv: "När måste jag göra anmälan senast?", phrase_en: "When do I have to make the report at the latest?", pronunciation_tip: "'Måste' = MOSS-teh." },
      { situation_en: "Confirming what you heard", phrase_sv: "Okej, så senast en vecka efter flytten. Då gör jag det i dag.", phrase_en: "Okay, so within a week after the move at the latest. Then I'll do it today.", pronunciation_tip: "Repeating the deadline shows you understood." }
    ],
    rehearsal_drills: [
      { type: "gap_fill", prompt_sv: "Jag har precis flyttat och vill ___ min nya adress.", prompt_en: "I have just moved and want to ___ my new address.", expected_answer_sv: "anmäla", expected_answer_en: "report / register", options: ["anmäla", "måla", "hyra", "städa"], hint_en: "The official word for reporting something to an authority.", },
      { type: "quick_response", prompt_sv: "Kan jag få din gamla och din nya adress?", prompt_en: "Can I have your old and your new address?", expected_answer_sv: "Den gamla är Storgatan fem, och den nya är Solvägen tre.", expected_answer_en: "The old one is Storgatan five, and the new one is Solvägen three.", hint_en: "Use 'den gamla' and 'den nya' to keep them apart.", options: null },
      { type: "quick_response", prompt_sv: "Flyttar fler personer i hushållet med dig?", prompt_en: "Are more people in the household moving with you?", expected_answer_sv: "Ja, min fru och våra två barn flyttar också.", expected_answer_en: "Yes, my wife and our two children are also moving.", hint_en: "Mention who else is moving — or say 'Nej, bara jag'.", options: null }
    ]
  },
  "Klaga på en produkt": {
    description_en: "Return a broken phone charger to the store and agree on a refund or replacement.",
    opener_sv: "Hej! Hur kan jag hjälpa dig?",
    opener_en: "Hi! How can I help you?",
    goal: "Get a refund or a new charger for the broken one you bought.",
    success_criteria: [
      "Describe what is wrong with the charger",
      "Show the receipt or explain if you don't have it",
      "Clearly ask for a refund or a replacement and agree on a solution"
    ],
    curveballs: [
      "The assistant asks for the receipt, which you have to look for",
      "She suggests a repair instead of a refund",
      "She asks exactly when and how the charger stopped working"
    ],
    cultural_notes: "In Sweden you have a legal right to complain about a faulty product ('reklamera') for three years, so shops take these requests seriously.",
    suggested_vocab: ["trasig", "kvitto", "fungerar inte", "pengarna tillbaka", "byta", "reklamera"],
    key_vocabulary: [
      { swedish: "trasig", english: "broken", example_sv: "Laddaren är trasig.", example_en: "The charger is broken.", pronunciation_tip: "TRAH-sig, long a." },
      { swedish: "kvitto", english: "receipt", example_sv: "Har du kvittot kvar?", example_en: "Do you still have the receipt?", pronunciation_tip: "KVIT-to, short i, hard k+v." },
      { swedish: "laddare", english: "charger", example_sv: "Jag köpte den här laddaren förra veckan.", example_en: "I bought this charger last week.", pronunciation_tip: "LAD-da-reh, stress first syllable." },
      { swedish: "byta", english: "to exchange", example_sv: "Kan jag byta den mot en ny?", example_en: "Can I exchange it for a new one?", pronunciation_tip: "BUE-ta, long y — round your lips." },
      { swedish: "pengarna tillbaka", english: "money back", example_sv: "Jag vill helst ha pengarna tillbaka.", example_en: "I would prefer to have my money back.", pronunciation_tip: "'Tillbaka' = till-BAH-ka." },
      { swedish: "reklamera", english: "to make a complaint about a product", example_sv: "Jag vill reklamera den här varan.", example_en: "I want to make a complaint about this item.", pronunciation_tip: "Stress near the end: re-kla-MEH-ra." }
    ],
    key_phrases: [
      { situation_en: "Stating the problem", phrase_sv: "Jag köpte den här laddaren här förra veckan, men den fungerar inte.", phrase_en: "I bought this charger here last week, but it doesn't work.", pronunciation_tip: "'Fungerar' = foon-GEH-rar." },
      { situation_en: "Presenting the receipt", phrase_sv: "Här är kvittot. Jag köpte den i torsdags.", phrase_en: "Here is the receipt. I bought it last Thursday.", pronunciation_tip: "'I torsdags' = last Thursday." },
      { situation_en: "Asking for a refund", phrase_sv: "Jag skulle helst vilja ha pengarna tillbaka.", phrase_en: "I would prefer to get my money back.", pronunciation_tip: "'Helst' = preferably." },
      { situation_en: "Accepting a replacement", phrase_sv: "Okej, då byter jag den mot en ny i stället.", phrase_en: "Okay, then I'll exchange it for a new one instead.", pronunciation_tip: "'I stället' = instead." },
      { situation_en: "Describing when it broke", phrase_sv: "Den fungerade två dagar, sedan hände ingenting när jag laddade.", phrase_en: "It worked for two days, then nothing happened when I charged.", pronunciation_tip: "'Sedan' is often said 'sen' in speech." }
    ],
    rehearsal_drills: [
      { type: "gap_fill", prompt_sv: "Laddaren är ___ — den fungerar inte alls.", prompt_en: "The charger is ___ — it doesn't work at all.", expected_answer_sv: "trasig", expected_answer_en: "broken", options: ["trasig", "billig", "gul", "tung"], hint_en: "The word for something that no longer works.", },
      { type: "quick_response", prompt_sv: "Har du kvittot kvar?", prompt_en: "Do you still have the receipt?", expected_answer_sv: "Ja, här är det. Jag köpte laddaren förra veckan.", expected_answer_en: "Yes, here it is. I bought the charger last week.", hint_en: "Hand it over and say when you bought it.", options: null },
      { type: "quick_response", prompt_sv: "Vi kan skicka den på reparation. Är det okej?", prompt_en: "We can send it for repair. Is that okay?", expected_answer_sv: "Nej, helst inte. Jag vill hellre ha pengarna tillbaka eller en ny.", expected_answer_en: "No, preferably not. I'd rather have my money back or a new one.", hint_en: "Politely say no and repeat what you want.", options: null }
    ]
  },
  "Boka frisörtid": {
    description_en: "Call a hair salon to book a cut and colour for Saturday afternoon.",
    opener_sv: "Salong Saxen, hej! Vad kan jag göra för dig?",
    opener_en: "Salon Saxen, hi! What can I do for you?",
    goal: "Book a cut and colour for next Saturday afternoon and know the price.",
    success_criteria: [
      "Say what you want done — a cut and a colour",
      "Agree on a day and time that works",
      "Ask what it will cost and confirm the booking"
    ],
    curveballs: [
      "Saturday afternoon is fully booked and she offers the morning instead",
      "She asks which colour you want and how long your hair is",
      "She asks if you have been to the salon before"
    ],
    cultural_notes: "Swedish hairdressers usually quote separate prices for cut and colour, and it's normal to ask 'Vad kostar det?' directly without it being rude.",
    suggested_vocab: ["klippa", "färga", "en tid", "på lördag", "hur mycket kostar det", "passar"],
    key_vocabulary: [
      { swedish: "klippa sig", english: "to get a haircut", example_sv: "Jag vill klippa mig på lördag.", example_en: "I want to get a haircut on Saturday.", pronunciation_tip: "KLIP-pa, short i." },
      { swedish: "färga", english: "to dye / colour", example_sv: "Jag vill också färga håret.", example_en: "I also want to colour my hair.", pronunciation_tip: "FAIR-ya — the g sounds like y here." },
      { swedish: "hår", english: "hair", example_sv: "Mitt hår är ganska långt.", example_en: "My hair is quite long.", pronunciation_tip: "Long o-like å: 'hore' without the r." },
      { swedish: "passa", english: "to suit / work (for a time)", example_sv: "Passar klockan tre på lördag?", example_en: "Does three o'clock on Saturday work?", pronunciation_tip: "PAS-sa, short a." },
      { swedish: "eftermiddag", english: "afternoon", example_sv: "Helst på eftermiddagen, tack.", example_en: "Preferably in the afternoon, please.", pronunciation_tip: "EF-ter-mid-dag, stress first syllable." },
      { swedish: "fullbokat", english: "fully booked", example_sv: "Lördag eftermiddag är tyvärr fullbokat.", example_en: "Saturday afternoon is unfortunately fully booked.", pronunciation_tip: "FULL-boo-kat." }
    ],
    key_phrases: [
      { situation_en: "Saying what you want", phrase_sv: "Hej! Jag skulle vilja boka tid för klippning och färgning.", phrase_en: "Hi! I would like to book an appointment for a cut and colour.", pronunciation_tip: "'Klippning' = KLIP-ning." },
      { situation_en: "Suggesting a time", phrase_sv: "Har ni något ledigt nästa lördag på eftermiddagen?", phrase_en: "Do you have anything free next Saturday afternoon?", pronunciation_tip: "'Ledigt' = LEH-digt." },
      { situation_en: "Asking the price", phrase_sv: "Vad kostar klippning och färgning tillsammans?", phrase_en: "What do a cut and colour cost together?", pronunciation_tip: "'Tillsammans' = til-SAM-mans." },
      { situation_en: "Describing your hair", phrase_sv: "Jag har ganska långt hår och vill ha en mörkare färg.", phrase_en: "I have quite long hair and want a darker colour.", pronunciation_tip: "'Mörkare' = MUR-ka-reh." },
      { situation_en: "Confirming the booking", phrase_sv: "Perfekt, då säger vi lördag klockan tio. Tack så mycket!", phrase_en: "Perfect, then let's say Saturday at ten. Thank you very much!", pronunciation_tip: "'Då säger vi' = then let's say — a common way to confirm." }
    ],
    rehearsal_drills: [
      { type: "gap_fill", prompt_sv: "Jag skulle vilja boka tid för klippning och ___.", prompt_en: "I would like to book an appointment for a cut and ___.", expected_answer_sv: "färgning", expected_answer_en: "colouring", options: ["färgning", "tvättning", "läsning", "körning"], hint_en: "Changing the colour of your hair.", },
      { type: "quick_response", prompt_sv: "Lördag eftermiddag är tyvärr fullbokat. Fungerar förmiddagen?", prompt_en: "Saturday afternoon is unfortunately fully booked. Does the morning work?", expected_answer_sv: "Ja, det går bra. Har ni något klockan tio?", expected_answer_en: "Yes, that's fine. Do you have anything at ten?", hint_en: "Accept and suggest a specific time.", options: null },
      { type: "quick_response", prompt_sv: "Har du varit hos oss tidigare?", prompt_en: "Have you been to us before?", expected_answer_sv: "Nej, det är första gången. En kompis tipsade om er.", expected_answer_en: "No, it's the first time. A friend recommended you.", hint_en: "'Första gången' = the first time.", options: null }
    ]
  },
  "Fråga hyresvärden om reparation": {
    description_en: "Call the landlord's office to report a broken dishwasher and ask when it will be repaired.",
    opener_sv: "Hej, du har kommit till fastighetskontoret. Vad gäller det?",
    opener_en: "Hi, you have reached the property office. What is it about?",
    goal: "Report the broken dishwasher and find out when a technician can come.",
    success_criteria: [
      "Describe the problem with the dishwasher",
      "Give your name and apartment address",
      "Ask when a technician can come and confirm the day"
    ],
    curveballs: [
      "The office asks if water is leaking onto the floor",
      "The first available technician time is next week — you push for something sooner",
      "She asks if the technician may enter with a master key if you are not home"
    ],
    cultural_notes: "In Swedish rentals the landlord normally pays for repairs to appliances that come with the flat, so report problems early and in a matter-of-fact way.",
    suggested_vocab: ["diskmaskinen", "sönder", "läcker", "en tekniker", "lägenhet", "huvudnyckel"],
    key_vocabulary: [
      { swedish: "diskmaskin", english: "dishwasher", example_sv: "Diskmaskinen har gått sönder.", example_en: "The dishwasher has broken.", pronunciation_tip: "DISK-ma-sheen — 'sk' before i sounds like sh." },
      { swedish: "gå sönder", english: "to break (stop working)", example_sv: "Den gick sönder i går kväll.", example_en: "It broke yesterday evening.", pronunciation_tip: "'Sönder' = SUN-der with rounded ö." },
      { swedish: "läcka", english: "to leak", example_sv: "Det läcker vatten på golvet.", example_en: "Water is leaking onto the floor.", pronunciation_tip: "LECK-a, short e." },
      { swedish: "tekniker", english: "technician", example_sv: "När kan en tekniker komma?", example_en: "When can a technician come?", pronunciation_tip: "TEK-ni-ker, stress first syllable." },
      { swedish: "lägenhet", english: "apartment", example_sv: "Jag bor i lägenhet tolv på Solvägen tre.", example_en: "I live in apartment twelve at Solvägen three.", pronunciation_tip: "LAI-gen-heht." },
      { swedish: "huvudnyckel", english: "master key", example_sv: "Ni får gärna gå in med huvudnyckel.", example_en: "You are welcome to enter with the master key.", pronunciation_tip: "HOO-vud-nuck-el." }
    ],
    key_phrases: [
      { situation_en: "Reporting the problem", phrase_sv: "Hej! Jag ringer för att diskmaskinen i min lägenhet har gått sönder.", phrase_en: "Hi! I'm calling because the dishwasher in my apartment has broken.", pronunciation_tip: "Keep it calm and factual — this is normal in Sweden." },
      { situation_en: "Giving your address", phrase_sv: "Jag bor på Solvägen tre, lägenhet tolv.", phrase_en: "I live at Solvägen three, apartment twelve.", pronunciation_tip: "Say the apartment number clearly." },
      { situation_en: "Asking when help comes", phrase_sv: "När kan en tekniker komma och titta på den?", phrase_en: "When can a technician come and look at it?", pronunciation_tip: "'Titta på' = take a look at." },
      { situation_en: "Pushing for a sooner time", phrase_sv: "Nästa vecka känns långt bort. Finns det ingen tid tidigare?", phrase_en: "Next week feels far away. Isn't there an earlier time?", pronunciation_tip: "'Känns' = shens — the k is soft before ä." },
      { situation_en: "Allowing the master key", phrase_sv: "Jag jobbar på dagarna, så ni får gärna använda huvudnyckeln.", phrase_en: "I work during the day, so you're welcome to use the master key.", pronunciation_tip: "'Gärna' = YAIR-na, means 'gladly'." }
    ],
    rehearsal_drills: [
      { type: "gap_fill", prompt_sv: "Diskmaskinen har gått ___ — den startar inte alls.", prompt_en: "The dishwasher has ___ — it doesn't start at all.", expected_answer_sv: "sönder", expected_answer_en: "broken", options: ["sönder", "hem", "framåt", "runt"], hint_en: "'Gå ___' means to stop working.", },
      { type: "quick_response", prompt_sv: "Läcker det vatten på golvet just nu?", prompt_en: "Is water leaking onto the floor right now?", expected_answer_sv: "Nej, det läcker inte, men maskinen startar inte.", expected_answer_en: "No, it's not leaking, but the machine doesn't start.", hint_en: "Answer the safety question first, then repeat the problem.", options: null },
      { type: "quick_response", prompt_sv: "Teknikern kan komma på onsdag. Är du hemma då, eller får han gå in med huvudnyckel?", prompt_en: "The technician can come on Wednesday. Are you home then, or can he enter with the master key?", expected_answer_sv: "Jag jobbar på onsdag, så han får gärna använda huvudnyckeln.", expected_answer_en: "I'm working on Wednesday, so he's welcome to use the master key.", hint_en: "Choose one option and answer clearly.", options: null }
    ]
  },
  "Skicka ett paket på posten": {
    description_en: "Send a small parcel to Germany and choose a shipping option with tracking.",
    opener_sv: "Hej! Vad kan jag hjälpa dig med?",
    opener_en: "Hi! What can I help you with?",
    goal: "Send your parcel to Germany with the right shipping option and pay.",
    success_criteria: [
      "Say that you want to send a parcel to Germany",
      "Ask about price and delivery time for different options",
      "Choose an option, ask about tracking, and pay"
    ],
    curveballs: [
      "The clerk asks what is inside the parcel",
      "She offers a faster but much more expensive option",
      "She asks if you want insurance for the contents"
    ],
    cultural_notes: "In Sweden you often send parcels from a service counter inside a supermarket, and the clerk will always ask what the parcel contains for customs and safety rules.",
    suggested_vocab: ["skicka", "utomlands", "väger", "spårning", "frakt", "försäkring"],
    key_vocabulary: [
      { swedish: "skicka", english: "to send", example_sv: "Jag vill skicka det här paketet till Tyskland.", example_en: "I want to send this parcel to Germany.", pronunciation_tip: "HWICK-a — 'sk' before i is a soft sh-like sound." },
      { swedish: "väga", english: "to weigh", example_sv: "Hur mycket väger paketet?", example_en: "How much does the parcel weigh?", pronunciation_tip: "VAI-ga, long ä." },
      { swedish: "frakt", english: "shipping / freight", example_sv: "Vad kostar frakten till Tyskland?", example_en: "What does shipping to Germany cost?", pronunciation_tip: "One syllable: frakt." },
      { swedish: "spårning", english: "tracking", example_sv: "Ingår spårning i priset?", example_en: "Is tracking included in the price?", pronunciation_tip: "SPORE-ning." },
      { swedish: "framme", english: "arrived / there", example_sv: "När är paketet framme?", example_en: "When will the parcel arrive?", pronunciation_tip: "FRAM-meh, short a." },
      { swedish: "försäkring", english: "insurance", example_sv: "Vill du ha försäkring på innehållet?", example_en: "Do you want insurance for the contents?", pronunciation_tip: "fur-SAIK-ring, stress in the middle." }
    ],
    key_phrases: [
      { situation_en: "Stating what you want", phrase_sv: "Hej! Jag skulle vilja skicka det här paketet till Tyskland.", phrase_en: "Hi! I would like to send this parcel to Germany.", pronunciation_tip: "'Tyskland' = TUSK-land with rounded y." },
      { situation_en: "Asking about price and time", phrase_sv: "Vad kostar det, och hur lång tid tar det?", phrase_en: "What does it cost, and how long does it take?", pronunciation_tip: "Two questions in one breath — very natural." },
      { situation_en: "Answering what's inside", phrase_sv: "Det är bara kläder och en bok, inget värdefullt.", phrase_en: "It's just clothes and a book, nothing valuable.", pronunciation_tip: "'Värdefullt' = VAIR-deh-fullt." },
      { situation_en: "Choosing the cheaper option", phrase_sv: "Jag tar det billigare alternativet, det är ingen brådska.", phrase_en: "I'll take the cheaper option, there's no rush.", pronunciation_tip: "'Brådska' = BROSS-ka, means 'hurry'." },
      { situation_en: "Asking about tracking", phrase_sv: "Ingår spårning, så jag kan se var paketet är?", phrase_en: "Is tracking included, so I can see where the parcel is?", pronunciation_tip: "'Ingår' = in-GORE, means 'is included'." }
    ],
    rehearsal_drills: [
      { type: "gap_fill", prompt_sv: "Jag skulle vilja ___ det här paketet till Tyskland.", prompt_en: "I would like to ___ this parcel to Germany.", expected_answer_sv: "skicka", expected_answer_en: "send", options: ["skicka", "äta", "öppna", "hämta"], hint_en: "What you do at the post office with a parcel.", },
      { type: "quick_response", prompt_sv: "Vad är det i paketet?", prompt_en: "What is in the parcel?", expected_answer_sv: "Det är bara kläder och en bok, inget värdefullt.", expected_answer_en: "It's just clothes and a book, nothing valuable.", hint_en: "A routine question — describe the contents simply.", options: null },
      { type: "quick_response", prompt_sv: "Vill du ha försäkring på innehållet? Det kostar femtio kronor extra.", prompt_en: "Do you want insurance for the contents? It costs fifty kronor extra.", expected_answer_sv: "Nej tack, det behövs inte. Innehållet är inte så dyrt.", expected_answer_en: "No thanks, that's not needed. The contents aren't that expensive.", hint_en: "Decline politely and give a short reason.", options: null }
    ]
  },
  "Fråga om Wi-Fi och bredband": {
    description_en: "Call your internet provider about very slow Wi-Fi and book a technician visit.",
    opener_sv: "Hej och välkommen till kundtjänst! Hur kan jag hjälpa dig?",
    opener_en: "Hello and welcome to customer service! How can I help you?",
    goal: "Explain the slow internet problem and get a technician visit booked.",
    success_criteria: [
      "Describe the problem and how long it has lasted",
      "Answer basic questions, like whether you have restarted the router",
      "Book a technician visit and confirm the day and time window"
    ],
    curveballs: [
      "The agent asks you to restart the router while you are on the phone",
      "She asks for your customer number, which you have to find",
      "She says the earliest technician slot is in four days"
    ],
    cultural_notes: "Swedish customer service is informal — everyone says 'du' — but expect to wait in a phone queue and to be asked for your customer or personal number early in the call.",
    suggested_vocab: ["bredband", "långsamt", "routern", "starta om", "kundnummer", "tekniker"],
    key_vocabulary: [
      { swedish: "bredband", english: "broadband", example_sv: "Vårt bredband är väldigt långsamt.", example_en: "Our broadband is very slow.", pronunciation_tip: "BREHD-band, two clear parts." },
      { swedish: "långsam", english: "slow", example_sv: "Internet har varit långsamt i en vecka.", example_en: "The internet has been slow for a week.", pronunciation_tip: "LONG-sam, å like 'o' in 'long'." },
      { swedish: "router", english: "router", example_sv: "Jag har redan startat om routern.", example_en: "I have already restarted the router.", pronunciation_tip: "Said like English, often 'ROO-ter'." },
      { swedish: "starta om", english: "to restart", example_sv: "Kan du starta om routern nu?", example_en: "Can you restart the router now?", pronunciation_tip: "Particle 'om' gets the stress: starta OM." },
      { swedish: "kundnummer", english: "customer number", example_sv: "Har du ditt kundnummer till hands?", example_en: "Do you have your customer number at hand?", pronunciation_tip: "KUND-noommer." },
      { swedish: "uppkoppling", english: "connection", example_sv: "Uppkopplingen försvinner flera gånger om dagen.", example_en: "The connection drops several times a day.", pronunciation_tip: "UPP-kopp-ling, stress first syllable." }
    ],
    key_phrases: [
      { situation_en: "Describing the problem", phrase_sv: "Hej! Vårt internet är jättelångsamt och har varit det i en vecka.", phrase_en: "Hi! Our internet is really slow and has been for a week.", pronunciation_tip: "'Jätte-' in front of a word means 'really'." },
      { situation_en: "Saying what you already tried", phrase_sv: "Jag har redan startat om routern flera gånger, men det hjälper inte.", phrase_en: "I have already restarted the router several times, but it doesn't help.", pronunciation_tip: "'Redan' = REH-dan, means 'already'." },
      { situation_en: "Asking for a technician", phrase_sv: "Kan ni skicka en tekniker som tittar på det?", phrase_en: "Can you send a technician to look at it?", pronunciation_tip: "'Skicka' with the soft sh-like start." },
      { situation_en: "Giving your customer number", phrase_sv: "Ett ögonblick... mitt kundnummer är fyra sju två ett nio.", phrase_en: "One moment... my customer number is four seven two one nine.", pronunciation_tip: "'Ett ögonblick' buys you time to look." },
      { situation_en: "Confirming the visit", phrase_sv: "Fredag mellan åtta och tolv, det fungerar. Tack för hjälpen!", phrase_en: "Friday between eight and twelve, that works. Thanks for the help!", pronunciation_tip: "Repeat the time window to confirm." }
    ],
    rehearsal_drills: [
      { type: "gap_fill", prompt_sv: "Jag har redan startat ___ routern, men internet är fortfarande långsamt.", prompt_en: "I have already restarted the router, but the internet is still slow. (I have already started ___ the router...)", expected_answer_sv: "om", expected_answer_en: "again (restart particle)", options: ["om", "på", "ner", "ut"], hint_en: "'Starta ___' means to restart.", },
      { type: "quick_response", prompt_sv: "Kan du starta om routern nu medan vi pratar?", prompt_en: "Can you restart the router now while we're talking?", expected_answer_sv: "Visst, ett ögonblick... Nu har jag startat om den.", expected_answer_en: "Sure, one moment... Now I have restarted it.", hint_en: "Agree, pause with 'ett ögonblick', then report back.", options: null },
      { type: "quick_response", prompt_sv: "Den tidigaste teknikertiden är om fyra dagar, på fredag. Går det bra?", prompt_en: "The earliest technician slot is in four days, on Friday. Is that okay?", expected_answer_sv: "Det är länge, men okej. Fredag går bra. Vilken tid kommer han?", expected_answer_en: "That's a long time, but okay. Friday works. What time will he come?", hint_en: "Accept, but ask for the time window.", options: null }
    ]
  },
  "Beställa hemleverans av mat": {
    description_en: "Call a grocery service to ask about home delivery times, minimum order, and payment.",
    opener_sv: "Hej, du har kommit till Matkassen! Vad kan jag hjälpa dig med?",
    opener_en: "Hi, you have reached Matkassen! What can I help you with?",
    goal: "Find out delivery times, minimum order, and payment options, and place a first order.",
    success_criteria: [
      "Ask which days and times they deliver to your area",
      "Ask about the minimum order and the delivery fee",
      "Ask how to pay and choose a delivery window"
    ],
    curveballs: [
      "She asks for your postcode to check if they deliver to your area",
      "The evening slots are full and she offers a morning delivery",
      "She mentions the delivery is free over a certain amount"
    ],
    cultural_notes: "Grocery delivery is very common in Sweden and almost everyone pays by card or Swish — cash is rarely an option.",
    suggested_vocab: ["hemleverans", "leveranstid", "postnummer", "minsta beställning", "avgift", "betala med kort"],
    key_vocabulary: [
      { swedish: "hemleverans", english: "home delivery", example_sv: "Har ni hemleverans i mitt område?", example_en: "Do you have home delivery in my area?", pronunciation_tip: "HEM-le-ve-rans, stress the first syllable." },
      { swedish: "postnummer", english: "postcode", example_sv: "Mitt postnummer är ett två tre fyra fem.", example_en: "My postcode is one two three four five.", pronunciation_tip: "POST-noommer." },
      { swedish: "avgift", english: "fee", example_sv: "Hur stor är avgiften för leverans?", example_en: "How big is the delivery fee?", pronunciation_tip: "AHV-yift — the g sounds like y." },
      { swedish: "beställning", english: "order", example_sv: "Finns det en minsta beställning?", example_en: "Is there a minimum order?", pronunciation_tip: "beh-STELL-ning." },
      { swedish: "leverera", english: "to deliver", example_sv: "Vilka dagar levererar ni?", example_en: "Which days do you deliver?", pronunciation_tip: "le-ve-REH-ra, stress near the end." },
      { swedish: "Swish", english: "Swish (Swedish payment app)", example_sv: "Kan jag betala med Swish?", example_en: "Can I pay with Swish?", pronunciation_tip: "Said like English 'swish'." }
    ],
    key_phrases: [
      { situation_en: "Asking if they deliver to you", phrase_sv: "Hej! Levererar ni hem till Solvägen i Uppsala?", phrase_en: "Hi! Do you deliver to Solvägen in Uppsala?", pronunciation_tip: "'Levererar ni' — verb first in a yes/no question." },
      { situation_en: "Asking about delivery times", phrase_sv: "Vilka dagar och tider kan man få leverans?", phrase_en: "Which days and times can you get a delivery?", pronunciation_tip: "'Man' here means 'one/you' in general." },
      { situation_en: "Asking about minimum order", phrase_sv: "Finns det någon minsta beställning, och vad kostar leveransen?", phrase_en: "Is there any minimum order, and what does the delivery cost?", pronunciation_tip: "'Minsta' = smallest." },
      { situation_en: "Asking about payment", phrase_sv: "Hur betalar man — med kort eller Swish?", phrase_en: "How do you pay — by card or Swish?", pronunciation_tip: "'Betalar' = beh-TAH-lar." },
      { situation_en: "Choosing a time window", phrase_sv: "Då tar jag torsdag mellan sjutton och tjugo, tack.", phrase_en: "Then I'll take Thursday between five and eight pm, thanks.", pronunciation_tip: "Swedes often use the 24-hour clock: 'sjutton' = 17." }
    ],
    rehearsal_drills: [
      { type: "gap_fill", prompt_sv: "Finns det någon minsta ___ för hemleverans?", prompt_en: "Is there any minimum ___ for home delivery?", expected_answer_sv: "beställning", expected_answer_en: "order", options: ["beställning", "våning", "tidning", "räkning"], hint_en: "What you place when you buy something.", },
      { type: "quick_response", prompt_sv: "Vad har du för postnummer, så kollar jag om vi levererar dit?", prompt_en: "What is your postcode, so I can check if we deliver there?", expected_answer_sv: "Det är sju fem tre två ett.", expected_answer_en: "It's seven five three two one.", hint_en: "Say the five digits one by one.", options: null },
      { type: "quick_response", prompt_sv: "Kvällstiderna på torsdag är fulla. Fungerar en leverans på förmiddagen i stället?", prompt_en: "The evening slots on Thursday are full. Would a morning delivery work instead?", expected_answer_sv: "Ja, det går bra. Mellan nio och tolv passar mig.", expected_answer_en: "Yes, that's fine. Between nine and twelve suits me.", hint_en: "Accept and pick a time window.", options: null }
    ]
  },
  "Prova kläder i butik": {
    description_en: "Ask a shop assistant for a bigger size, try the jacket on, and decide whether to buy it.",
    opener_sv: "Hej! Går det bra, eller behöver du hjälp med något?",
    opener_en: "Hi! Are you doing okay, or do you need help with anything?",
    goal: "Get the right size jacket, try it on, and decide if you want to buy it.",
    success_criteria: [
      "Ask for the jacket in a bigger size",
      "Ask where the fitting rooms are and try it on",
      "Say how it fits and decide to buy it or not"
    ],
    curveballs: [
      "The bigger size is sold out in that colour, but exists in another colour",
      "The assistant asks if you want to become a member for a discount",
      "She offers to order the size to the store or online"
    ],
    cultural_notes: "In Swedish shops the staff usually leave you alone until you ask — saying 'Jag vill bara titta' (I'm just looking) is a normal, polite phrase.",
    suggested_vocab: ["storlek", "provrum", "för liten", "en större", "passar", "slutsåld"],
    key_vocabulary: [
      { swedish: "storlek", english: "size", example_sv: "Har ni den här i en större storlek?", example_en: "Do you have this in a bigger size?", pronunciation_tip: "STOOR-lehk, stress first syllable." },
      { swedish: "provrum", english: "fitting room", example_sv: "Var ligger provrummen?", example_en: "Where are the fitting rooms?", pronunciation_tip: "PROOV-room." },
      { swedish: "prova", english: "to try on", example_sv: "Kan jag prova den här jackan?", example_en: "Can I try on this jacket?", pronunciation_tip: "PROO-va, long o." },
      { swedish: "passa", english: "to fit", example_sv: "Den passar perfekt!", example_en: "It fits perfectly!", pronunciation_tip: "PAS-sa, short a." },
      { swedish: "för liten", english: "too small", example_sv: "Den här är tyvärr för liten.", example_en: "This one is unfortunately too small.", pronunciation_tip: "'För' + adjective = 'too ...'." },
      { swedish: "slutsåld", english: "sold out", example_sv: "Den storleken är tyvärr slutsåld.", example_en: "That size is unfortunately sold out.", pronunciation_tip: "SLOOT-sold." }
    ],
    key_phrases: [
      { situation_en: "Asking for a bigger size", phrase_sv: "Ursäkta, har ni den här jackan i medium?", phrase_en: "Excuse me, do you have this jacket in medium?", pronunciation_tip: "'Ursäkta' = ur-SHECK-ta, to get attention politely." },
      { situation_en: "Asking for the fitting room", phrase_sv: "Var kan jag prova den?", phrase_en: "Where can I try it on?", pronunciation_tip: "Short and simple works best." },
      { situation_en: "Saying it doesn't fit", phrase_sv: "Den är lite för trång över axlarna.", phrase_en: "It's a bit too tight over the shoulders.", pronunciation_tip: "'Trång' = trong, means 'tight'." },
      { situation_en: "Deciding to buy", phrase_sv: "Den här passar bra — jag tar den!", phrase_en: "This one fits well — I'll take it!", pronunciation_tip: "'Jag tar den' = I'll take it." },
      { situation_en: "Declining politely", phrase_sv: "Nej tack, jag funderar lite till.", phrase_en: "No thanks, I'll think about it a bit more.", pronunciation_tip: "'Funderar' = foon-DEH-rar, means 'thinking it over'." }
    ],
    rehearsal_drills: [
      { type: "gap_fill", prompt_sv: "Ursäkta, har ni den här jackan i en större ___?", prompt_en: "Excuse me, do you have this jacket in a bigger ___?", expected_answer_sv: "storlek", expected_answer_en: "size", options: ["storlek", "färg", "påse", "vecka"], hint_en: "S, M, L...", },
      { type: "quick_response", prompt_sv: "Medium är tyvärr slutsåld i svart, men vi har den i mörkblått. Vill du prova?", prompt_en: "Medium is unfortunately sold out in black, but we have it in dark blue. Do you want to try it?", expected_answer_sv: "Ja, varför inte? Jag kan prova den mörkblå.", expected_answer_en: "Yes, why not? I can try the dark blue one.", hint_en: "'Varför inte?' is a relaxed way to say yes.", options: null },
      { type: "quick_response", prompt_sv: "Vill du bli medlem? Då får du tio procent rabatt i dag.", prompt_en: "Do you want to become a member? Then you get ten percent off today.", expected_answer_sv: "Nej tack, det är bra ändå. Jag tar bara jackan.", expected_answer_en: "No thanks, I'm fine anyway. I'll just take the jacket.", hint_en: "Decline the offer politely with 'nej tack'.", options: null }
    ]
  },
  "Klaga hos hyresvärden om buller": {
    description_en: "Call your landlord to complain about neighbours who have loud parties every weekend.",
    opener_sv: "Fastighetskontoret, hej! Vad kan jag hjälpa dig med?",
    opener_en: "The property office, hello! What can I help you with?",
    goal: "Describe the noise problem clearly and find out what the landlord will do.",
    success_criteria: [
      "Explain what the noise is, when it happens, and how often",
      "Say how it affects you, for example that you cannot sleep",
      "Ask what the landlord will do and what happens next"
    ],
    curveballs: [
      "The landlord asks if you have talked to the neighbours yourself",
      "She asks for exact dates and times, so she can document it",
      "She asks which apartment the noise comes from"
    ],
    cultural_notes: "In Swedish apartment buildings there is usually quiet time ('nattro') from around 10 pm, and landlords want written, dated examples before they act.",
    suggested_vocab: ["buller", "grannarna", "fest", "varje helg", "sova", "störa"],
    key_vocabulary: [
      { swedish: "buller", english: "noise", example_sv: "Det är mycket buller på helgerna.", example_en: "There is a lot of noise on weekends.", pronunciation_tip: "BULL-er, short u." },
      { swedish: "granne", english: "neighbour", example_sv: "Mina grannar har fest varje helg.", example_en: "My neighbours have a party every weekend.", pronunciation_tip: "GRAN-neh; plural 'grannar'." },
      { swedish: "störa", english: "to disturb", example_sv: "Musiken stör hela huset.", example_en: "The music disturbs the whole building.", pronunciation_tip: "STUR-a with rounded ö." },
      { swedish: "hög musik", english: "loud music", example_sv: "De spelar hög musik till klockan tre.", example_en: "They play loud music until three o'clock.", pronunciation_tip: "'Hög' = hug with rounded ö, means 'loud/high'." },
      { swedish: "somna", english: "to fall asleep", example_sv: "Barnen kan inte somna på fredagarna.", example_en: "The children can't fall asleep on Fridays.", pronunciation_tip: "SOM-na, short o." },
      { swedish: "anteckna", english: "to write down / note", example_sv: "Jag har antecknat datum och tider.", example_en: "I have written down dates and times.", pronunciation_tip: "AN-teck-na, stress first syllable." }
    ],
    key_phrases: [
      { situation_en: "Explaining the problem", phrase_sv: "Jag ringer för att mina grannar har högljudda fester varje helg.", phrase_en: "I'm calling because my neighbours have loud parties every weekend.", pronunciation_tip: "'Högljudda' = HUG-yood-da, means 'loud'." },
      { situation_en: "Saying how it affects you", phrase_sv: "Musiken håller på till tre på natten, så vi kan inte sova.", phrase_en: "The music goes on until three at night, so we can't sleep.", pronunciation_tip: "'Håller på' = keeps going." },
      { situation_en: "Saying you already tried talking", phrase_sv: "Jag har pratat med dem två gånger, men det hjälper inte.", phrase_en: "I have talked to them twice, but it doesn't help.", pronunciation_tip: "'Gånger' = GONG-er, means 'times'." },
      { situation_en: "Giving documented examples", phrase_sv: "I fredags spelade de hög musik från elva till halv tre.", phrase_en: "Last Friday they played loud music from eleven to half past two.", pronunciation_tip: "'I fredags' = last Friday." },
      { situation_en: "Asking what happens now", phrase_sv: "Vad kan ni göra åt det här? Kan ni skicka en varning?", phrase_en: "What can you do about this? Can you send a warning?", pronunciation_tip: "'Göra åt' = do about." }
    ],
    rehearsal_drills: [
      { type: "gap_fill", prompt_sv: "Mina grannar har fest varje helg, och musiken ___ hela huset.", prompt_en: "My neighbours have a party every weekend, and the music ___ the whole building.", expected_answer_sv: "stör", expected_answer_en: "disturbs", options: ["stör", "städar", "målar", "köper"], hint_en: "What loud noise does to your sleep.", },
      { type: "quick_response", prompt_sv: "Har du pratat med grannarna själv om det här?", prompt_en: "Have you talked to the neighbours yourself about this?", expected_answer_sv: "Ja, två gånger, men det blir ingen skillnad.", expected_answer_en: "Yes, twice, but it makes no difference.", hint_en: "'Ingen skillnad' = no difference.", options: null },
      { type: "quick_response", prompt_sv: "Kan du ge mig några exakta datum och tider? Vi behöver dokumentera det.", prompt_en: "Can you give me some exact dates and times? We need to document it.", expected_answer_sv: "Ja, i fredags spelade de hög musik från elva till halv tre på natten.", expected_answer_en: "Yes, last Friday they played loud music from eleven to half past two at night.", hint_en: "Give one concrete example with day and times.", options: null }
    ]
  },
  "Byta pengar på Forex": {
    description_en: "Exchange 200 euros for Swedish crowns and check the rate and the fee first.",
    opener_sv: "Hej! Vad kan jag hjälpa dig med i dag?",
    opener_en: "Hi! What can I help you with today?",
    goal: "Change 200 euros to crowns, knowing the rate and fee before you say yes.",
    success_criteria: [
      "Say that you want to change 200 euros to Swedish crowns",
      "Ask about today's exchange rate and the fee",
      "Confirm how much you will get and complete the exchange"
    ],
    curveballs: [
      "The clerk asks to see your ID for the exchange",
      "She offers a better rate if you exchange a larger amount",
      "She asks if you want the money in small or large notes"
    ],
    cultural_notes: "Sweden is nearly cashless, so the clerk may gently ask if you really need cash — cards work almost everywhere.",
    suggested_vocab: ["växla", "euro", "kronor", "växelkurs", "avgift", "sedlar"],
    key_vocabulary: [
      { swedish: "växla", english: "to exchange (money)", example_sv: "Jag vill växla tvåhundra euro.", example_en: "I want to exchange two hundred euros.", pronunciation_tip: "VEX-la." },
      { swedish: "växelkurs", english: "exchange rate", example_sv: "Vad är växelkursen i dag?", example_en: "What is the exchange rate today?", pronunciation_tip: "VEX-el-koosh — 'rs' becomes a sh-sound." },
      { swedish: "avgift", english: "fee", example_sv: "Tar ni någon avgift?", example_en: "Do you charge a fee?", pronunciation_tip: "AHV-yift, the g sounds like y." },
      { swedish: "kronor", english: "crowns (SEK)", example_sv: "Hur många kronor får jag?", example_en: "How many crowns do I get?", pronunciation_tip: "KROO-nor, long o." },
      { swedish: "sedel", english: "banknote", example_sv: "Kan jag få små sedlar, tack?", example_en: "Can I have small notes, please?", pronunciation_tip: "SEH-del; plural 'sedlar'." },
      { swedish: "sammanlagt", english: "in total", example_sv: "Hur mycket blir det sammanlagt?", example_en: "How much is it in total?", pronunciation_tip: "SAM-man-lagt." }
    ],
    key_phrases: [
      { situation_en: "Stating what you want", phrase_sv: "Hej! Jag skulle vilja växla tvåhundra euro till svenska kronor.", phrase_en: "Hi! I would like to exchange two hundred euros to Swedish crowns.", pronunciation_tip: "'Tvåhundra' = TVOH-hoon-dra." },
      { situation_en: "Asking about the rate", phrase_sv: "Vad är kursen i dag?", phrase_en: "What is the rate today?", pronunciation_tip: "'Kursen' = KOOSH-en." },
      { situation_en: "Asking about the fee", phrase_sv: "Tillkommer det någon avgift?", phrase_en: "Is there an additional fee?", pronunciation_tip: "'Tillkommer' = is added on top." },
      { situation_en: "Checking the total", phrase_sv: "Så hur mycket får jag sammanlagt i kronor?", phrase_en: "So how much do I get in total in crowns?", pronunciation_tip: "Always check the total before you agree." },
      { situation_en: "Completing the exchange", phrase_sv: "Det låter bra. Då växlar jag, och gärna små sedlar.", phrase_en: "That sounds good. Then I'll exchange, and preferably small notes.", pronunciation_tip: "'Det låter bra' = that sounds good." }
    ],
    rehearsal_drills: [
      { type: "gap_fill", prompt_sv: "Jag skulle vilja ___ tvåhundra euro till svenska kronor.", prompt_en: "I would like to ___ two hundred euros to Swedish crowns.", expected_answer_sv: "växla", expected_answer_en: "exchange", options: ["växla", "låna", "räkna", "tappa"], hint_en: "What you do with money at Forex.", },
      { type: "quick_response", prompt_sv: "Kan jag få se din legitimation, tack?", prompt_en: "Can I see your ID, please?", expected_answer_sv: "Javisst, här är mitt pass.", expected_answer_en: "Of course, here is my passport.", hint_en: "Agree and hand over an ID document.", options: null },
      { type: "quick_response", prompt_sv: "Vill du ha pengarna i stora eller små sedlar?", prompt_en: "Do you want the money in large or small notes?", expected_answer_sv: "Små sedlar, tack. Det är lättare att betala med dem.", expected_answer_en: "Small notes, please. It's easier to pay with them.", hint_en: "Choose one and give a short reason.", options: null }
    ]
  },
  "Boka gymkort": {
    description_en: "Sign up for a gym membership after comparing plans, prices, and cancellation rules.",
    opener_sv: "Hej och välkommen! Är det första gången du är här?",
    opener_en: "Hello and welcome! Is it your first time here?",
    goal: "Choose a membership plan and sign up, knowing the price and how to cancel.",
    success_criteria: [
      "Ask about the different membership plans and prices",
      "Ask about contract length and how to cancel",
      "Choose a plan and sign up"
    ],
    curveballs: [
      "She offers a cheaper plan that requires a twelve-month contract",
      "She asks if you want to add group classes for extra money",
      "She mentions a start-up fee you didn't expect"
    ],
    cultural_notes: "Swedish gym contracts often have a binding period ('bindningstid') and one month's notice, so always ask about 'uppsägningstid' before signing.",
    suggested_vocab: ["gymkort", "medlemskap", "per månad", "bindningstid", "säga upp", "gruppass"],
    key_vocabulary: [
      { swedish: "medlemskap", english: "membership", example_sv: "Vad kostar ett medlemskap per månad?", example_en: "What does a membership cost per month?", pronunciation_tip: "MED-lems-kahp." },
      { swedish: "bindningstid", english: "binding period", example_sv: "Hur lång är bindningstiden?", example_en: "How long is the binding period?", pronunciation_tip: "BIND-nings-teed." },
      { swedish: "säga upp", english: "to cancel (a contract)", example_sv: "Hur säger jag upp kortet om jag flyttar?", example_en: "How do I cancel the card if I move?", pronunciation_tip: "Stress the particle: säga UPP." },
      { swedish: "uppsägningstid", english: "notice period", example_sv: "Ni har en månads uppsägningstid.", example_en: "You have one month's notice period.", pronunciation_tip: "UPP-sayg-nings-teed — long but useful." },
      { swedish: "gruppass", english: "group classes", example_sv: "Ingår gruppass i priset?", example_en: "Are group classes included in the price?", pronunciation_tip: "GROOP-pass." },
      { swedish: "startavgift", english: "start-up fee", example_sv: "Tillkommer det en startavgift?", example_en: "Is there an additional start-up fee?", pronunciation_tip: "START-ahv-yift." }
    ],
    key_phrases: [
      { situation_en: "Saying why you are there", phrase_sv: "Hej! Jag skulle vilja skaffa ett gymkort.", phrase_en: "Hi! I would like to get a gym membership.", pronunciation_tip: "'Skaffa' = to get/acquire." },
      { situation_en: "Comparing plans", phrase_sv: "Vad är skillnaden mellan de olika medlemskapen?", phrase_en: "What is the difference between the different memberships?", pronunciation_tip: "'Skillnaden' = HWILL-na-den, soft sk before i." },
      { situation_en: "Asking about cancellation", phrase_sv: "Hur lång är bindningstiden, och hur säger man upp?", phrase_en: "How long is the binding period, and how do you cancel?", pronunciation_tip: "Ask this before you sign anything." },
      { situation_en: "Reacting to hidden fees", phrase_sv: "Oj, en startavgift också? Det visste jag inte.", phrase_en: "Oh, a start-up fee too? I didn't know that.", pronunciation_tip: "'Oj' is the natural Swedish 'oh/oops'." },
      { situation_en: "Signing up", phrase_sv: "Då tar jag månadskortet utan bindningstid, tack.", phrase_en: "Then I'll take the monthly card without a binding period, thanks.", pronunciation_tip: "'Utan' = without." }
    ],
    rehearsal_drills: [
      { type: "gap_fill", prompt_sv: "Hur lång är ___ om jag väljer det billigare kortet?", prompt_en: "How long is the ___ if I choose the cheaper card?", expected_answer_sv: "bindningstiden", expected_answer_en: "the binding period", options: ["bindningstiden", "öppettiden", "lunchen", "semestern"], hint_en: "The time you must stay in the contract.", },
      { type: "quick_response", prompt_sv: "Det billigare kortet har tolv månaders bindningstid. Är det okej för dig?", prompt_en: "The cheaper card has a twelve-month binding period. Is that okay for you?", expected_answer_sv: "Nej, jag tar hellre kortet utan bindningstid, även om det kostar mer.", expected_answer_en: "No, I'd rather take the card without a binding period, even if it costs more.", hint_en: "'Hellre' = rather. Choose flexibility.", options: null },
      { type: "quick_response", prompt_sv: "Vill du lägga till gruppass för hundra kronor extra i månaden?", prompt_en: "Do you want to add group classes for a hundred kronor extra per month?", expected_answer_sv: "Nej tack, inte just nu. Jag kanske lägger till det senare.", expected_answer_en: "No thanks, not right now. Maybe I'll add it later.", hint_en: "Decline but leave the door open with 'kanske senare'.", options: null }
    ]
  },
  "Anmäla borttappat kort": {
    description_en: "Call the bank to block your lost card and order a replacement.",
    opener_sv: "Välkommen till banken, du talar med Svea. Hur kan jag hjälpa dig?",
    opener_en: "Welcome to the bank, you're speaking with Svea. How can I help you?",
    goal: "Block the lost card, order a new one, and confirm where it will be sent.",
    success_criteria: [
      "Explain that you lost your card and want to block it right away",
      "Answer security questions, like your personnummer",
      "Order a new card and confirm your delivery address"
    ],
    curveballs: [
      "She asks when and where you last used the card",
      "She asks if there are any purchases you don't recognise",
      "She says the new card takes up to a week and offers a temporary solution"
    ],
    cultural_notes: "Swedish banks verify you by personnummer and often BankID even on the phone, so blocking a card is quick once you're identified.",
    suggested_vocab: ["tappa bort", "spärra", "kortet", "ett nytt kort", "misstänkt", "i går kväll"],
    key_vocabulary: [
      { swedish: "tappa bort", english: "to lose (an object)", example_sv: "Jag har tappat bort mitt bankkort.", example_en: "I have lost my bank card.", pronunciation_tip: "Stress the particle: tappa BORT." },
      { swedish: "spärra", english: "to block", example_sv: "Kan ni spärra kortet direkt?", example_en: "Can you block the card right away?", pronunciation_tip: "SPAIR-ra, rolled r if you can." },
      { swedish: "köp", english: "purchase", example_sv: "Jag ser inga konstiga köp.", example_en: "I don't see any strange purchases.", pronunciation_tip: "Sounds like 'shup' — k is soft before ö." },
      { swedish: "senast", english: "most recently / last", example_sv: "Jag använde kortet senast i går kväll.", example_en: "I last used the card yesterday evening.", pronunciation_tip: "SEH-nast." },
      { swedish: "beställa", english: "to order", example_sv: "Jag vill beställa ett nytt kort.", example_en: "I want to order a new card.", pronunciation_tip: "beh-STELL-a." },
      { swedish: "misstänkt", english: "suspicious", example_sv: "Finns det något misstänkt på kontot?", example_en: "Is there anything suspicious on the account?", pronunciation_tip: "MISS-tenkt." }
    ],
    key_phrases: [
      { situation_en: "Explaining the emergency", phrase_sv: "Hej! Jag har tappat bort mitt kort och vill spärra det direkt.", phrase_en: "Hi! I have lost my card and want to block it right away.", pronunciation_tip: "'Direkt' = dee-REKT, means 'immediately'." },
      { situation_en: "Saying when you last used it", phrase_sv: "Jag använde det senast i går kväll på ICA.", phrase_en: "I last used it yesterday evening at ICA.", pronunciation_tip: "'I går kväll' = yesterday evening." },
      { situation_en: "Checking for strange purchases", phrase_sv: "Kan du se om det finns några köp som inte är mina?", phrase_en: "Can you see if there are any purchases that aren't mine?", pronunciation_tip: "'Köp' with the soft sh-like k." },
      { situation_en: "Ordering a new card", phrase_sv: "Kan jag beställa ett nytt kort samtidigt?", phrase_en: "Can I order a new card at the same time?", pronunciation_tip: "'Samtidigt' = sam-TEE-digt." },
      { situation_en: "Confirming the address", phrase_sv: "Skicka det till min hemadress, Solvägen tre i Uppsala.", phrase_en: "Send it to my home address, Solvägen three in Uppsala.", pronunciation_tip: "'Hemadress' = HEM-a-dress." }
    ],
    rehearsal_drills: [
      { type: "gap_fill", prompt_sv: "Jag har tappat bort mitt kort och vill ___ det direkt.", prompt_en: "I have lost my card and want to ___ it right away.", expected_answer_sv: "spärra", expected_answer_en: "block", options: ["spärra", "tvätta", "sälja", "vika"], hint_en: "So no one else can use it.", },
      { type: "quick_response", prompt_sv: "När och var använde du kortet senast?", prompt_en: "When and where did you last use the card?", expected_answer_sv: "Senast i går kväll, på ICA här i stan.", expected_answer_en: "Most recently yesterday evening, at ICA here in town.", hint_en: "Give a time and a place.", options: null },
      { type: "quick_response", prompt_sv: "Det nya kortet tar ungefär en vecka. Klarar du dig utan kort så länge?", prompt_en: "The new card takes about a week. Can you manage without a card until then?", expected_answer_sv: "Ja, det går bra. Jag kan betala med mobilen så länge.", expected_answer_en: "Yes, that's fine. I can pay with my phone in the meantime.", hint_en: "'Så länge' = in the meantime.", options: null }
    ]
  },
  "Boka läkartid för barn": {
    description_en: "Call to book a doctor's appointment for your child who has an ear infection.",
    opener_sv: "Barnavårdscentralen, hej! Vad kan jag hjälpa dig med?",
    opener_en: "The child health centre, hello! What can I help you with?",
    goal: "Describe your child's symptoms and get an appointment today.",
    success_criteria: [
      "Describe the child's symptoms and how long they have lasted",
      "Give the child's age and personnummer",
      "Get an appointment and repeat back the time"
    ],
    curveballs: [
      "The nurse asks if the child has a fever and if you have given any medicine",
      "She asks how old the child is and if this has happened before",
      "The only time today is during your work hours — you have to accept or negotiate"
    ],
    cultural_notes: "Swedish parents have the right to stay home with a sick child ('vabba'), so it's completely normal to take time off for a doctor's visit.",
    suggested_vocab: ["ont i örat", "feber", "min dotter", "min son", "en tid i dag", "medicin"],
    key_vocabulary: [
      { swedish: "öra", english: "ear", example_sv: "Hon har ont i örat.", example_en: "She has ear pain.", pronunciation_tip: "UR-a with rounded ö; 'örat' = the ear." },
      { swedish: "öroninflammation", english: "ear infection", example_sv: "Jag tror att det är en öroninflammation.", example_en: "I think it's an ear infection.", pronunciation_tip: "UR-on-in-flam-ma-SHOON — take it slowly." },
      { swedish: "gråta", english: "to cry", example_sv: "Hon grät hela natten.", example_en: "She cried all night.", pronunciation_tip: "GROH-ta; past tense 'grät'." },
      { swedish: "feber", english: "fever", example_sv: "Han har trettioåtta komma fem i feber.", example_en: "He has a fever of thirty-eight point five.", pronunciation_tip: "FEH-ber." },
      { swedish: "medicin", english: "medicine", example_sv: "Jag gav henne medicin i morse.", example_en: "I gave her medicine this morning.", pronunciation_tip: "me-di-SEEN, stress at the end." },
      { swedish: "vabba", english: "to stay home with a sick child", example_sv: "Jag vabbar i dag, så jag kan komma när som helst.", example_en: "I'm home with my sick child today, so I can come any time.", pronunciation_tip: "VAB-ba — a very Swedish everyday verb." }
    ],
    key_phrases: [
      { situation_en: "Explaining why you are calling", phrase_sv: "Hej! Min dotter har ont i örat och grät hela natten.", phrase_en: "Hi! My daughter has ear pain and cried all night.", pronunciation_tip: "'Dotter' = DOT-ter; 'son' = sohn." },
      { situation_en: "Giving the child's details", phrase_sv: "Hon är tre år, och hennes personnummer är tjugotvå noll fem...", phrase_en: "She is three years old, and her personal number is twenty-two zero five...", pronunciation_tip: "Children's personnummer are asked for too." },
      { situation_en: "Answering about fever", phrase_sv: "Ja, hon har lite feber, trettioåtta komma två i morse.", phrase_en: "Yes, she has a slight fever, thirty-eight point two this morning.", pronunciation_tip: "Use 'komma' for the decimal." },
      { situation_en: "Asking for a time today", phrase_sv: "Kan vi komma in i dag? Hon har väldigt ont.", phrase_en: "Can we come in today? She is in a lot of pain.", pronunciation_tip: "'Väldigt' = VEL-digt, means 'very'." },
      { situation_en: "Confirming the time", phrase_sv: "Klockan kvart över två i dag — vi kommer då. Tack snälla!", phrase_en: "Quarter past two today — we'll come then. Thank you so much!", pronunciation_tip: "'Kvart över två' = 2:15." }
    ],
    rehearsal_drills: [
      { type: "gap_fill", prompt_sv: "Min dotter har ont i ___ och grät hela natten.", prompt_en: "My daughter has pain in her ___ and cried all night.", expected_answer_sv: "örat", expected_answer_en: "the ear", options: ["örat", "handen", "foten", "ryggen"], hint_en: "The body part for an ear infection.", },
      { type: "quick_response", prompt_sv: "Har hon feber, och har du gett henne någon medicin?", prompt_en: "Does she have a fever, and have you given her any medicine?", expected_answer_sv: "Ja, lite feber. Jag gav henne Alvedon i morse.", expected_answer_en: "Yes, a slight fever. I gave her Alvedon this morning.", hint_en: "Answer both questions — fever and medicine.", options: null },
      { type: "quick_response", prompt_sv: "Den enda tiden i dag är klockan elva. Hinner du komma då?", prompt_en: "The only time today is at eleven o'clock. Can you make it then?", expected_answer_sv: "Ja, det löser jag. Jag vabbar i dag, så vi kommer klockan elva.", expected_answer_en: "Yes, I'll sort that out. I'm home with her today, so we'll come at eleven.", hint_en: "'Det löser jag' = I'll sort it out.", options: null }
    ]
  },
  "Kontakta försäkringen efter olycka": {
    description_en: "Call your insurance company to report a minor car accident and learn the next steps.",
    opener_sv: "Försäkringsbolaget, du talar med Svea. Vad har hänt?",
    opener_en: "The insurance company, you're speaking with Svea. What has happened?",
    goal: "Report the accident with the key details and understand what happens next.",
    success_criteria: [
      "Describe what happened, where, and when",
      "Give your registration number and policy details",
      "Ask about the next steps and the deductible"
    ],
    curveballs: [
      "She asks if anyone was injured",
      "She asks if you took photos and got the other driver's details",
      "She explains you must pay a deductible and asks if you want to proceed"
    ],
    cultural_notes: "After a minor accident in Sweden, drivers usually fill in a joint damage report ('skadeanmälan') together calmly — no shouting, just paperwork.",
    suggested_vocab: ["en olycka", "krockade", "registreringsnummer", "skada", "självrisk", "skadeanmälan"],
    key_vocabulary: [
      { swedish: "olycka", english: "accident", example_sv: "Jag var med om en liten olycka i morse.", example_en: "I was in a small accident this morning.", pronunciation_tip: "OO-luck-a, stress first syllable." },
      { swedish: "krocka", english: "to crash / collide", example_sv: "Jag krockade med en annan bil.", example_en: "I collided with another car.", pronunciation_tip: "KROCK-a, short o." },
      { swedish: "skada", english: "damage / injury", example_sv: "Det är en skada på dörren.", example_en: "There is damage on the door.", pronunciation_tip: "SKAH-da, long a." },
      { swedish: "registreringsnummer", english: "registration number", example_sv: "Registreringsnumret är ABC ett två tre.", example_en: "The registration number is ABC one two three.", pronunciation_tip: "Long word — say it in parts: re-gi-STREH-rings-noommer." },
      { swedish: "självrisk", english: "deductible / excess", example_sv: "Hur hög är självrisken?", example_en: "How high is the deductible?", pronunciation_tip: "HWELV-risk — 'sj' is the soft Swedish sound." },
      { swedish: "skadeanmälan", english: "damage report", example_sv: "Vi fyllde i en skadeanmälan tillsammans.", example_en: "We filled in a damage report together.", pronunciation_tip: "SKAH-de-an-mai-lan." }
    ],
    key_phrases: [
      { situation_en: "Reporting the accident", phrase_sv: "Hej! Jag ringer för att anmäla en liten bilolycka.", phrase_en: "Hi! I'm calling to report a small car accident.", pronunciation_tip: "'Anmäla' = AN-mai-la." },
      { situation_en: "Describing what happened", phrase_sv: "En bil körde in i mig bakifrån vid en rödljus i morse.", phrase_en: "A car drove into me from behind at a red light this morning.", pronunciation_tip: "'Bakifrån' = from behind." },
      { situation_en: "Confirming no injuries", phrase_sv: "Ingen blev skadad, det är bara plåtskador.", phrase_en: "No one was injured, it's only bodywork damage.", pronunciation_tip: "'Plåtskador' = damage to the metal, a common phrase." },
      { situation_en: "Giving car details", phrase_sv: "Mitt registreringsnummer är ABC ett två tre.", phrase_en: "My registration number is ABC one two three.", pronunciation_tip: "Say letters and numbers slowly and clearly." },
      { situation_en: "Asking about next steps", phrase_sv: "Vad händer nu, och hur hög är självrisken?", phrase_en: "What happens now, and how high is the deductible?", pronunciation_tip: "Two key questions — ask them together." }
    ],
    rehearsal_drills: [
      { type: "gap_fill", prompt_sv: "Ingen blev skadad — det är bara ___ på bilen.", prompt_en: "No one was injured — there is only ___ on the car.", expected_answer_sv: "skador", expected_answer_en: "damage", options: ["skador", "blommor", "paket", "biljetter"], hint_en: "What a crash leaves on the bodywork.", },
      { type: "quick_response", prompt_sv: "Blev någon skadad i olyckan?", prompt_en: "Was anyone injured in the accident?", expected_answer_sv: "Nej, som tur var blev ingen skadad. Det är bara plåtskador.", expected_answer_en: "No, luckily no one was injured. It's only bodywork damage.", hint_en: "'Som tur var' = luckily.", options: null },
      { type: "quick_response", prompt_sv: "Tog du bilder på skadorna och fick du den andra förarens uppgifter?", prompt_en: "Did you take photos of the damage and get the other driver's details?", expected_answer_sv: "Ja, jag tog bilder med mobilen, och vi bytte telefonnummer och registreringsnummer.", expected_answer_en: "Yes, I took photos with my phone, and we exchanged phone numbers and registration numbers.", hint_en: "'Vi bytte' = we exchanged.", options: null }
    ]
  },
  "Fråga om SL-kort": {
    description_en: "Buy a monthly transit card and find out which zones your commute needs.",
    opener_sv: "Hej! Hur kan jag hjälpa dig?",
    opener_en: "Hi! How can I help you?",
    goal: "Buy the right monthly card for your commute and know how to use it.",
    success_criteria: [
      "Explain where you travel from and to every day",
      "Ask which card or zone you need and what it costs",
      "Buy the card and ask how to load it or renew it"
    ],
    curveballs: [
      "She asks if you want the card on your phone in the app instead of a plastic card",
      "She asks if you are a student or have a discount",
      "She mentions the card starts today unless you choose a later start date"
    ],
    cultural_notes: "In Stockholm one SL monthly card covers the whole county — buses, metro, and commuter trains — and most people carry it in the app rather than as a plastic card.",
    suggested_vocab: ["månadskort", "pendla", "zon", "gäller", "ladda", "rabatt"],
    key_vocabulary: [
      { swedish: "månadskort", english: "monthly card", example_sv: "Jag skulle vilja köpa ett månadskort.", example_en: "I would like to buy a monthly card.", pronunciation_tip: "MOH-nads-court." },
      { swedish: "pendla", english: "to commute", example_sv: "Jag pendlar mellan Solna och T-centralen.", example_en: "I commute between Solna and T-centralen.", pronunciation_tip: "PEND-la." },
      { swedish: "gälla", english: "to be valid", example_sv: "Gäller kortet på pendeltåget också?", example_en: "Is the card valid on the commuter train too?", pronunciation_tip: "YELL-a — g is soft before ä." },
      { swedish: "ladda", english: "to load / top up", example_sv: "Hur laddar jag kortet nästa månad?", example_en: "How do I top up the card next month?", pronunciation_tip: "LAD-da." },
      { swedish: "rabatt", english: "discount", example_sv: "Finns det rabatt för studenter?", example_en: "Is there a discount for students?", pronunciation_tip: "ra-BATT, stress at the end." },
      { swedish: "spärren", english: "the ticket barrier", example_sv: "Du blippar kortet vid spärren.", example_en: "You tap the card at the barrier.", pronunciation_tip: "SPAIR-ren; 'blippa' = to tap." }
    ],
    key_phrases: [
      { situation_en: "Explaining your commute", phrase_sv: "Hej! Jag pendlar varje dag mellan Solna och city. Vilket kort behöver jag?", phrase_en: "Hi! I commute every day between Solna and the city centre. Which card do I need?", pronunciation_tip: "'Pendlar' — a word you'll use a lot in Stockholm." },
      { situation_en: "Asking about coverage", phrase_sv: "Gäller månadskortet på både tunnelbana och buss?", phrase_en: "Is the monthly card valid on both the metro and the bus?", pronunciation_tip: "'Tunnelbana' = TOON-nel-bah-na, the metro." },
      { situation_en: "Asking the price", phrase_sv: "Vad kostar ett månadskort för vuxen?", phrase_en: "What does a monthly card for an adult cost?", pronunciation_tip: "'Vuxen' = VOOK-sen, means 'adult'." },
      { situation_en: "Choosing app or card", phrase_sv: "Jag tar det i appen, det är smidigare.", phrase_en: "I'll take it in the app, that's more convenient.", pronunciation_tip: "'Smidigare' = SMEE-di-ga-reh, means 'smoother/easier'." },
      { situation_en: "Choosing the start date", phrase_sv: "Kan kortet börja gälla på måndag i stället för i dag?", phrase_en: "Can the card start being valid on Monday instead of today?", pronunciation_tip: "'Börja gälla' = start being valid." }
    ],
    rehearsal_drills: [
      { type: "gap_fill", prompt_sv: "Jag ___ varje dag mellan Solna och T-centralen.", prompt_en: "I ___ every day between Solna and T-centralen.", expected_answer_sv: "pendlar", expected_answer_en: "commute", options: ["pendlar", "sover", "simmar", "sjunger"], hint_en: "Travelling the same route to work daily.", },
      { type: "quick_response", prompt_sv: "Vill du ha kortet i appen eller som ett plastkort?", prompt_en: "Do you want the card in the app or as a plastic card?", expected_answer_sv: "I appen, tack. Då kan jag inte tappa bort det.", expected_answer_en: "In the app, please. Then I can't lose it.", hint_en: "Choose one and give a simple reason.", options: null },
      { type: "quick_response", prompt_sv: "Kortet börjar gälla i dag. Är det okej, eller vill du ha ett senare startdatum?", prompt_en: "The card starts today. Is that okay, or do you want a later start date?", expected_answer_sv: "Kan det börja gälla på måndag i stället? Jag börjar jobba då.", expected_answer_en: "Can it start on Monday instead? I start work then.", hint_en: "Ask for Monday with 'i stället'.", options: null }
    ]
  },
  "Beställa glasögon hos optiker": {
    description_en: "Order new glasses at the optician — choose lenses and frames within your budget.",
    opener_sv: "Hej och välkommen! Vad kan jag hjälpa dig med i dag?",
    opener_en: "Hello and welcome! What can I help you with today?",
    goal: "Order glasses that fit your needs and budget, and agree on a pickup date.",
    success_criteria: [
      "Explain what you need glasses for, for example reading or a computer",
      "Choose frames and lens type, and state your budget",
      "Agree on the price and ask when the glasses will be ready"
    ],
    curveballs: [
      "She asks when you last had an eye test and suggests a new one",
      "She recommends extras like anti-reflective coating that cost more",
      "The frames you like are over your budget and she suggests alternatives"
    ],
    cultural_notes: "Swedish opticians usually offer a free or cheap eye test ('synundersökning') when you buy glasses, so it's normal to ask for one in the same visit.",
    suggested_vocab: ["glasögon", "synundersökning", "bågar", "glas", "budget", "hämta ut"],
    key_vocabulary: [
      { swedish: "glasögon", english: "glasses", example_sv: "Jag behöver nya glasögon.", example_en: "I need new glasses.", pronunciation_tip: "GLAHS-ur-gon — 'ögon' means 'eyes'." },
      { swedish: "synundersökning", english: "eye test", example_sv: "När gjorde du en synundersökning senast?", example_en: "When did you last have an eye test?", pronunciation_tip: "SUEN-un-der-suk-ning — say it in parts." },
      { swedish: "bågar", english: "frames", example_sv: "Jag gillar de där svarta bågarna.", example_en: "I like those black frames.", pronunciation_tip: "BOH-gar, long å." },
      { swedish: "glas", english: "lenses (glass)", example_sv: "Vad kostar glasen utan extra behandling?", example_en: "What do the lenses cost without extra treatment?", pronunciation_tip: "Same word as 'glass' the material; long a." },
      { swedish: "antireflex", english: "anti-reflective coating", example_sv: "Behöver jag verkligen antireflex?", example_en: "Do I really need anti-reflective coating?", pronunciation_tip: "AN-ti-re-flex, like English." },
      { swedish: "hämta ut", english: "to pick up (an order)", example_sv: "När kan jag hämta ut glasögonen?", example_en: "When can I pick up the glasses?", pronunciation_tip: "Stress the particle: hämta UT." }
    ],
    key_phrases: [
      { situation_en: "Explaining what you need", phrase_sv: "Hej! Jag behöver nya glasögon, framför allt för datorn.", phrase_en: "Hi! I need new glasses, mainly for the computer.", pronunciation_tip: "'Framför allt' = above all / mainly." },
      { situation_en: "Answering about your last eye test", phrase_sv: "Min senaste synundersökning var för tre år sedan.", phrase_en: "My last eye test was three years ago.", pronunciation_tip: "'För ... sedan' = ... ago." },
      { situation_en: "Stating your budget", phrase_sv: "Jag vill helst inte betala mer än tvåtusen kronor totalt.", phrase_en: "I'd prefer not to pay more than two thousand kronor in total.", pronunciation_tip: "'Tvåtusen' = TVOH-too-sen." },
      { situation_en: "Questioning an extra", phrase_sv: "Behöver jag verkligen det, eller går det bra utan?", phrase_en: "Do I really need that, or is it fine without?", pronunciation_tip: "'Verkligen' = VERK-li-gen, means 'really'." },
      { situation_en: "Asking about pickup", phrase_sv: "När är glasögonen klara att hämta ut?", phrase_en: "When are the glasses ready to pick up?", pronunciation_tip: "'Klara' = ready." }
    ],
    rehearsal_drills: [
      { type: "gap_fill", prompt_sv: "Jag behöver nya glasögon, framför allt för ___.", prompt_en: "I need new glasses, mainly for ___.", expected_answer_sv: "datorn", expected_answer_en: "the computer", options: ["datorn", "maten", "duschen", "musiken"], hint_en: "The screen you work at all day.", },
      { type: "quick_response", prompt_sv: "När gjorde du en synundersökning senast? Vi kan göra en ny i dag.", prompt_en: "When did you last have an eye test? We can do a new one today.", expected_answer_sv: "För tre år sedan, så en ny undersökning låter bra.", expected_answer_en: "Three years ago, so a new test sounds good.", hint_en: "Say how long ago and accept the offer.", options: null },
      { type: "quick_response", prompt_sv: "De här bågarna kostar tretusen kronor. Vad har du för budget?", prompt_en: "These frames cost three thousand kronor. What is your budget?", expected_answer_sv: "Det är för dyrt för mig. Jag vill ligga under tvåtusen totalt.", expected_answer_en: "That's too expensive for me. I want to stay under two thousand in total.", hint_en: "'Ligga under' = stay under (an amount).", options: null }
    ]
  },
};
