// Auto-generated mission content. Schema: src/lib/missionPrompt.js

export const MISSION_CONTENT_C1 = {
  "Hålla ett tal på bröllop": {
    description_en: "Deliver a two-minute best-man or maid-of-honour speech in Swedish with a story, a joke, and a toast.",
    opener_sv: "Då slår vi klirr i glasen — nu är det dags för dagens toastmadame att lämna över ordet till dig. Varsågod!",
    opener_en: "Let's clink the glasses — it's time for today's toastmadame to hand the floor over to you. Go ahead!",
    goal: "Give a well-structured wedding speech that opens warmly, tells a personal story, lands a joke, and ends with a toast.",
    success_criteria: [
      "Open by addressing the couple and the guests, and say who you are",
      "Tell one personal story about the bride or groom with a build-up and a punchline",
      "Close with warm wishes and lead the room in a skål",
    ],
    curveballs: [
      "The room laughs so long at your joke that you have to pause and regain the thread",
      "Someone playfully heckles: 'Berätta om Berlinresan!'",
      "The bride starts crying happy tears mid-speech and you need to acknowledge it gracefully",
    ],
    cultural_notes: "Swedish weddings are run by a toastmaster with a strict speech list, so keeping to your slot and under three minutes is a mark of respect, and everyone waits for your 'skål' cue to drink.",
    suggested_vocab: ["kära brudpar", "å hela festens vägnar", "höja glasen", "en skål för", "hjärtligt", "vän genom vått och torrt"],
    key_vocabulary: [
      { swedish: "brudpar", english: "bridal couple", example_sv: "Kära brudpar, kära gäster — vilken dag det här är!", example_en: "Dear bridal couple, dear guests — what a day this is!", pronunciation_tip: "BROOD-par, long u in 'brud'" },
      { swedish: "hedrad", english: "honoured", example_sv: "Jag är otroligt hedrad över att få stå här i dag.", example_en: "I am incredibly honoured to stand here today.", pronunciation_tip: "HEED-rad, long e" },
      { swedish: "vittna om", english: "to bear witness to", example_sv: "Jag har fått vittna om deras kärlek på nära håll i tio år.", example_en: "I've been able to witness their love up close for ten years.", pronunciation_tip: "VITT-na OM, crisp double t" },
      { swedish: "genom vått och torrt", english: "through thick and thin", example_sv: "Han har varit min vän genom vått och torrt.", example_en: "He has been my friend through thick and thin.", pronunciation_tip: "'vått' = vott, 'torrt' = torrt — both short and punchy" },
      { swedish: "höja glasen", english: "to raise the glasses", example_sv: "Nu vill jag be er alla att höja glasen.", example_en: "Now I'd like to ask you all to raise your glasses.", pronunciation_tip: "HUR-ya GLAH-sen, 'ö' + soft j" },
      { swedish: "skål", english: "cheers, a toast", example_sv: "En skål för kärleken — skål!", example_en: "A toast to love — cheers!", pronunciation_tip: "skawl, long å, hold it slightly for effect" },
    ],
    key_phrases: [
      { situation_en: "Opening and introducing yourself", phrase_sv: "Kära brudpar, kära gäster — för er som inte känner mig är jag Sara, brudens äldsta och, vågar jag påstå, mest tålmodiga vän.", phrase_en: "Dear bridal couple, dear guests — for those who don't know me, I'm Sara, the bride's oldest and, dare I say, most patient friend.", pronunciation_tip: "Pause after 'gäster' to let the room settle" },
      { situation_en: "Launching the story", phrase_sv: "Låt mig ta er tillbaka till en regnig kväll för femton år sedan, då allt det här faktiskt började.", phrase_en: "Let me take you back to a rainy evening fifteen years ago, when all of this actually began.", pronunciation_tip: "Slow down — storytelling pace, not conversation pace" },
      { situation_en: "Landing the joke", phrase_sv: "Och det var i det ögonblicket jag insåg: han hade inte förlorat en plånbok — han hade hittat en fru.", phrase_en: "And that was the moment I realised: he hadn't lost a wallet — he had found a wife.", pronunciation_tip: "Beat of silence before the punchline; stress 'fru'" },
      { situation_en: "Turning warm and sincere", phrase_sv: "Skämt åsido — det ni två har är något som vi andra bara kan hoppas på.", phrase_en: "Joking aside — what you two have is something the rest of us can only hope for.", pronunciation_tip: "'Skämt åsido' = shemt OH-see-doo, drop your tone here" },
      { situation_en: "Leading the toast", phrase_sv: "Så jag ber er alla att resa er, höja glasen och skåla med mig — för kärleken, och för brudparet. Skål!", phrase_en: "So I ask you all to stand, raise your glasses and toast with me — to love, and to the bridal couple. Cheers!", pronunciation_tip: "Project your voice; the final 'Skål!' is a command to the room" },
    ],
    rehearsal_drills: [
      { type: "gap_fill", prompt_sv: "Nu ber jag er alla att resa er och ___ glasen för brudparet.", prompt_en: "Now I ask you all to stand and ___ your glasses to the bridal couple.", expected_answer_sv: "höja", expected_answer_en: "raise", options: ["höja", "sänka", "tömma", "fylla"], hint_en: "What you do with the glass right before 'skål'." },
      { type: "quick_response", prompt_sv: "Berätta om Berlinresan! Alla vill höra om Berlinresan!", prompt_en: "Tell us about the Berlin trip! Everyone wants to hear about the Berlin trip!", expected_answer_sv: "Haha, den historien sparar vi till efterfesten — brudens mamma sitter faktiskt här längst fram.", expected_answer_en: "Haha, we're saving that story for the after-party — the bride's mother is actually sitting right here at the front.", hint_en: "Deflect the heckle with humour and move on gracefully.", options: null },
      { type: "quick_response", prompt_sv: "Åh nej, nu börjar bruden gråta — hela bordet tittar på dig.", prompt_en: "Oh no, the bride is starting to cry — the whole table is looking at you.", expected_answer_sv: "Och det där, mina vänner, är lyckotårar — ta fram näsdukarna, för jag är inte klar än.", expected_answer_en: "And that, my friends, is happy tears — get your tissues out, because I'm not done yet.", hint_en: "Acknowledge the emotion warmly and keep the room with you.", options: null },
    ],
  },

  "Debattera i panel": {
    description_en: "Defend a clear position on remote work in a live panel debate, with examples and rebuttals.",
    opener_sv: "Välkomna till dagens panel om distansarbete. Vi börjar med dig — du menar ju att hybridarbete är här för att stanna. Utveckla gärna din tes.",
    opener_en: "Welcome to today's panel on remote work. We'll start with you — you argue that hybrid work is here to stay. Please develop your thesis.",
    goal: "Defend a clear thesis for 60 seconds, support it with a concrete example, and rebut an opposing argument without losing composure.",
    success_criteria: [
      "State a sharp thesis and support it with structured arguments",
      "Use at least one concrete example or piece of evidence",
      "Rebut an opponent's point directly and reclaim the framing",
    ],
    curveballs: [
      "A fellow panelist interrupts you mid-argument",
      "The moderator pushes back: 'But doesn't the research say the opposite?'",
      "The opponent misrepresents your position and you must correct it briefly",
    ],
    cultural_notes: "Swedish debate culture rewards calm, evidence-led argumentation ('sakligt') — raising your voice or interrupting aggressively costs you the room's sympathy.",
    suggested_vocab: ["tes", "belägg", "invändning", "låt mig tala till punkt", "tvärtom", "sammanfattningsvis"],
    key_vocabulary: [
      { swedish: "tes", english: "thesis, main claim", example_sv: "Min tes är enkel: flexibilitet ger både bättre resultat och friskare medarbetare.", example_en: "My thesis is simple: flexibility gives both better results and healthier employees.", pronunciation_tip: "tess — one short syllable" },
      { swedish: "belägg", english: "evidence, support", example_sv: "Det finns gott om belägg för att produktiviteten inte sjunker.", example_en: "There is plenty of evidence that productivity does not drop.", pronunciation_tip: "be-LEGG, stress on second syllable" },
      { swedish: "invändning", english: "objection", example_sv: "Jag förstår invändningen, men den bygger på en förlegad bild av kontorsarbete.", example_en: "I understand the objection, but it rests on an outdated picture of office work.", pronunciation_tip: "IN-vend-ning, stress on first syllable" },
      { swedish: "saklig", english: "objective, factual (in tone)", example_sv: "Låt oss hålla diskussionen saklig.", example_en: "Let's keep the discussion factual.", pronunciation_tip: "SAHK-lig, long a" },
      { swedish: "tvärtom", english: "on the contrary", example_sv: "Tvärtom visar siffrorna att engagemanget ökar.", example_en: "On the contrary, the figures show that engagement increases.", pronunciation_tip: "TVAIRT-om, stress on first syllable" },
      { swedish: "sammanfattningsvis", english: "in summary", example_sv: "Sammanfattningsvis: frågan är inte om, utan hur.", example_en: "In summary: the question is not if, but how.", pronunciation_tip: "sam-man-FATT-nings-vees — signal word, say it clearly" },
    ],
    key_phrases: [
      { situation_en: "Stating your thesis", phrase_sv: "Låt mig vara tydlig från början: hybridarbete är inte ett experiment längre — det är det nya normala.", phrase_en: "Let me be clear from the start: hybrid work is no longer an experiment — it is the new normal.", pronunciation_tip: "Pause after 'början' for rhetorical weight" },
      { situation_en: "Introducing evidence", phrase_sv: "Och det här är inte bara min åsikt — titta på vilket större svenskt bolag som helst som försökt tvinga tillbaka folk fem dagar i veckan.", phrase_en: "And this is not just my opinion — look at any major Swedish company that has tried to force people back five days a week.", pronunciation_tip: "'vilket ... som helst' — spoken-Swedish emphasis pattern" },
      { situation_en: "Handling an interruption", phrase_sv: "Jag ska strax bemöta det — men låt mig först tala till punkt.", phrase_en: "I'll address that in a moment — but first let me finish my point.", pronunciation_tip: "'tala till punkt' — firm but polite, no raised voice" },
      { situation_en: "Rebutting an argument", phrase_sv: "Det där låter övertygande, men det stämmer helt enkelt inte — siffrorna pekar åt rakt motsatt håll.", phrase_en: "That sounds convincing, but it simply isn't true — the figures point in exactly the opposite direction.", pronunciation_tip: "Stress 'inte' and 'motsatt' — your two power words" },
      { situation_en: "Correcting a misrepresentation", phrase_sv: "Nu lägger du ord i min mun. Jag har aldrig sagt att kontoret är dött — jag säger att det måste förtjäna sin plats.", phrase_en: "Now you're putting words in my mouth. I never said the office is dead — I'm saying it has to earn its place.", pronunciation_tip: "'lägger ord i min mun' — set idiom, deliver it calmly" },
    ],
    rehearsal_drills: [
      { type: "gap_fill", prompt_sv: "Det finns gott om ___ för att produktiviteten faktiskt ökar med hybridarbete.", prompt_en: "There is plenty of ___ that productivity actually increases with hybrid work.", expected_answer_sv: "belägg", expected_answer_en: "evidence", options: ["belägg", "beslut", "besvär", "belopp"], hint_en: "What you cite to back up a claim in a debate." },
      { type: "quick_response", prompt_sv: "Ursäkta att jag avbryter, men det där stämmer ju inte alls—", prompt_en: "Sorry to interrupt, but that's not true at all—", expected_answer_sv: "Låt mig tala till punkt, så lovar jag att bemöta din invändning direkt efteråt.", expected_answer_en: "Let me finish my point, and I promise to address your objection right after.", hint_en: "Reclaim the floor politely with the set phrase 'tala till punkt'.", options: null },
      { type: "quick_response", prompt_sv: "Men färsk forskning pekar väl snarare på att distansarbete försämrar samarbetet?", prompt_en: "But doesn't recent research rather suggest that remote work worsens collaboration?", expected_answer_sv: "Vissa studier visar det, ja — men de mäter oftast helt på distans, inte hybrid. Min poäng handlar om balansen.", expected_answer_en: "Some studies show that, yes — but they usually measure fully remote, not hybrid. My point is about the balance.", hint_en: "Concede narrowly, then draw the distinction that saves your thesis.", options: null },
    ],
  },

  "Förhandla konsultkontrakt": {
    description_en: "Negotiate hourly rate, scope, and payment terms for a consulting contract with a new client.",
    opener_sv: "Kul att vi kunde ses! Vi är väldigt intresserade av att jobba med dig — men jag ska vara ärlig: ert prisförslag ligger en bit över vår budget.",
    opener_en: "Great that we could meet! We're very interested in working with you — but I'll be honest: your price proposal is a fair bit above our budget.",
    goal: "Agree a contract where you defend your rate, define a clear scope, and lock down payment terms.",
    success_criteria: [
      "Anchor and defend your hourly rate with reference to the value you deliver",
      "Define the scope precisely and flag what counts as additional work",
      "Agree concrete payment terms (invoicing schedule, payment deadline)",
    ],
    curveballs: [
      "The client asks for a 20 % discount in exchange for 'more work later'",
      "The client wants to add tasks to the scope without changing the price",
      "The client proposes 60-day payment terms instead of your standard 30",
    ],
    cultural_notes: "Swedish business negotiation is consensus-oriented and low-drama — firm, well-reasoned pushback is respected, while haggling theatrics or pressure tactics undermine trust.",
    suggested_vocab: ["timarvode", "omfattning", "tilläggsarbete", "betalningsvillkor", "fakturera", "avtala"],
    key_vocabulary: [
      { swedish: "timarvode", english: "hourly rate/fee", example_sv: "Mitt timarvode ligger på tolvhundra kronor exklusive moms.", example_en: "My hourly rate is twelve hundred kronor excluding VAT.", pronunciation_tip: "TEEM-ar-voo-de, long i in 'tim'" },
      { swedish: "omfattning", english: "scope", example_sv: "Vi behöver spika omfattningen innan vi pratar pris.", example_en: "We need to nail down the scope before we talk price.", pronunciation_tip: "OM-fatt-ning, stress on first syllable" },
      { swedish: "tilläggsarbete", english: "additional work (outside scope)", example_sv: "Allt utanför det här dokumentet räknas som tilläggsarbete.", example_en: "Everything outside this document counts as additional work.", pronunciation_tip: "TILL-leggs-ar-be-te" },
      { swedish: "betalningsvillkor", english: "payment terms", example_sv: "Mina betalningsvillkor är trettio dagar netto.", example_en: "My payment terms are thirty days net.", pronunciation_tip: "be-TAHL-nings-vill-kor" },
      { swedish: "fakturera", english: "to invoice", example_sv: "Jag fakturerar månadsvis, i slutet av varje månad.", example_en: "I invoice monthly, at the end of each month.", pronunciation_tip: "fak-tu-RE-ra, stress on 're'" },
      { swedish: "motprestation", english: "something in return, counter-commitment", example_sv: "En rabatt kräver en motprestation, till exempel en garanterad volym.", example_en: "A discount requires something in return, for example a guaranteed volume.", pronunciation_tip: "MOOT-pre-sta-tshoon" },
    ],
    key_phrases: [
      { situation_en: "Anchoring your rate with value", phrase_sv: "Mitt arvode speglar att ni får en senior specialist som levererar från dag ett — det brukar löna sig snabbt.", phrase_en: "My fee reflects that you get a senior specialist who delivers from day one — that usually pays off quickly.", pronunciation_tip: "'speglar' = SPEG-lar; calm, confident delivery" },
      { situation_en: "Responding to a discount request", phrase_sv: "Jag kan diskutera priset, men då behöver jag något i utbyte — till exempel ett längre åtagande.", phrase_en: "I can discuss the price, but then I need something in exchange — for example a longer commitment.", pronunciation_tip: "'åtagande' = OH-ta-gan-de" },
      { situation_en: "Guarding the scope", phrase_sv: "Det låter som en bra idé, men det ligger utanför omfattningen vi pratat om — jag lägger gärna ett separat förslag på det.", phrase_en: "That sounds like a good idea, but it's outside the scope we've discussed — I'm happy to put together a separate proposal for it.", pronunciation_tip: "Friendly tone; 'separat förslag' is the key move" },
      { situation_en: "Holding your payment terms", phrase_sv: "Sextio dagar fungerar tyvärr inte för ett litet bolag som mitt — trettio dagar är min gräns.", phrase_en: "Sixty days unfortunately doesn't work for a small company like mine — thirty days is my limit.", pronunciation_tip: "'tyvärr' = tü-VAIRR softens the refusal" },
      { situation_en: "Summarising the agreement", phrase_sv: "Ska vi sammanfatta? Tolvhundra i timmen, den här omfattningen, månadsvis fakturering och trettio dagars betalningsvillkor.", phrase_en: "Shall we summarise? Twelve hundred an hour, this scope, monthly invoicing and thirty-day payment terms.", pronunciation_tip: "List each item with a small pause — you're closing the deal" },
    ],
    rehearsal_drills: [
      { type: "gap_fill", prompt_sv: "Allt som ligger utanför det här dokumentet räknas som ___ och offereras separat.", prompt_en: "Everything outside this document counts as ___ and is quoted separately.", expected_answer_sv: "tilläggsarbete", expected_answer_en: "additional work", options: ["tilläggsarbete", "tillsvidare", "underarbete", "mervärde"], hint_en: "The contract word for out-of-scope tasks." },
      { type: "quick_response", prompt_sv: "Om du går ner tjugo procent nu så lovar jag att det blir mycket mer jobb framöver.", prompt_en: "If you come down twenty percent now, I promise there'll be a lot more work down the line.", expected_answer_sv: "Jag hör det ofta, tyvärr. Vill ni ha rabatt får vi skriva in en garanterad volym i avtalet — annars står priset fast.", expected_answer_en: "I hear that a lot, unfortunately. If you want a discount we'll have to write a guaranteed volume into the contract — otherwise the price stands.", hint_en: "Trade concessions for commitments in writing, never for promises.", options: null },
      { type: "quick_response", prompt_sv: "Vår ekonomiavdelning kör alltid sextio dagars betalningstid — det är standard hos oss.", prompt_en: "Our finance department always runs sixty-day payment terms — that's standard with us.", expected_answer_sv: "Jag förstår att det är er standard, men min är trettio dagar. Vi kan mötas på fakturering varannan vecka om det hjälper er process.", expected_answer_en: "I understand that's your standard, but mine is thirty days. We could meet at invoicing every other week if that helps your process.", hint_en: "Hold your limit but offer a creative alternative.", options: null },
    ],
  },

  "Intervjuas i podd på svenska": {
    description_en: "Be the guest on a Swedish podcast about your career — give full, natural answers and land a clear takeaway.",
    opener_sv: "Varmt välkommen till podden! Jättekul att ha dig här. Vi kör igång direkt: vem är du, och hur hamnade du där du är i dag?",
    opener_en: "A warm welcome to the podcast! Great to have you here. Let's dive right in: who are you, and how did you end up where you are today?",
    goal: "Carry a podcast interview with fluent 2–3 sentence answers, one vivid story, and a memorable takeaway for listeners.",
    success_criteria: [
      "Give developed answers of 2–3 sentences instead of one-liners",
      "Tell one vivid story with a beginning, a turning point and a lesson",
      "End with a clear takeaway or advice directed at the listeners",
    ],
    curveballs: [
      "The host asks a very personal question about your biggest failure",
      "The host playfully challenges you: 'Det där låter som en klyscha — vad menar du egentligen?'",
      "The host asks you to give one piece of advice to listeners in exactly one sentence",
    ],
    cultural_notes: "Swedish podcast conversation is intimate and self-deprecating — openly owning your failures ('jantelagen'-friendly humility) wins listeners far more than polished self-promotion.",
    suggested_vocab: ["vändpunkt", "med facit i hand", "klyscha", "misslyckande", "ta med sig", "spola tillbaka"],
    key_vocabulary: [
      { swedish: "vändpunkt", english: "turning point", example_sv: "Den stora vändpunkten kom när jag vågade säga upp mig.", example_en: "The big turning point came when I dared to resign.", pronunciation_tip: "VEND-punkt, both syllables crisp" },
      { swedish: "med facit i hand", english: "with hindsight", example_sv: "Med facit i hand var det det bästa som kunde hända.", example_en: "With hindsight, it was the best thing that could have happened.", pronunciation_tip: "FAH-sit, stress on first syllable" },
      { swedish: "misslyckande", english: "failure", example_sv: "Mitt största misslyckande blev min viktigaste lärare.", example_en: "My biggest failure became my most important teacher.", pronunciation_tip: "miss-LYCK-an-de, 'y' like German ü" },
      { swedish: "klyscha", english: "cliché", example_sv: "Det låter som en klyscha, men det är sant på riktigt.", example_en: "It sounds like a cliché, but it's genuinely true.", pronunciation_tip: "KLY-sha, 'sch' = sh" },
      { swedish: "drivkraft", english: "driving force, motivation", example_sv: "Min största drivkraft har alltid varit nyfikenhet.", example_en: "My biggest driving force has always been curiosity.", pronunciation_tip: "DREEV-kraft, long i" },
      { swedish: "ta med sig", english: "to take away (a lesson)", example_sv: "Om lyssnarna ska ta med sig en enda sak är det den här.", example_en: "If the listeners should take away one single thing, it's this.", pronunciation_tip: "Unstressed 'sig' = say" },
    ],
    key_phrases: [
      { situation_en: "Opening your self-introduction", phrase_sv: "Kort version: jag kom hit för tio år sedan utan ett ord svenska, och i dag driver jag ett eget bolag — det är en ganska osannolik resa.", phrase_en: "Short version: I came here ten years ago without a word of Swedish, and today I run my own company — it's a fairly unlikely journey.", pronunciation_tip: "'osannolik' = oo-SAN-no-leek" },
      { situation_en: "Launching your story", phrase_sv: "Om vi spolar tillbaka till 2019, så satt jag där med ett nedlagt projekt och noll kunder — och det var där allting vände.", phrase_en: "If we rewind to 2019, I was sitting there with a cancelled project and zero customers — and that's where everything turned.", pronunciation_tip: "'spolar tillbaka' — podcast-friendly storytelling phrase" },
      { situation_en: "Owning a failure with humour", phrase_sv: "Jag ska vara helt ärlig: jag misslyckades kapitalt, och det är jag nästan lite stolt över i dag.", phrase_en: "I'll be completely honest: I failed spectacularly, and today I'm almost a little proud of that.", pronunciation_tip: "'kapitalt' = ka-pi-TAHLT, stress at the end" },
      { situation_en: "Defusing the cliché challenge", phrase_sv: "Haha, du har rätt, det låter som en klyscha — så låt mig göra det konkret med ett exempel.", phrase_en: "Haha, you're right, it does sound like a cliché — so let me make it concrete with an example.", pronunciation_tip: "Laugh first, then pivot — keeps it warm" },
      { situation_en: "Landing the takeaway", phrase_sv: "Om lyssnarna ska ta med sig en enda sak från det här samtalet, så är det: börja innan du känner dig redo.", phrase_en: "If the listeners should take one single thing from this conversation, it's this: start before you feel ready.", pronunciation_tip: "Slow down on the final clause — it's your headline" },
    ],
    rehearsal_drills: [
      { type: "gap_fill", prompt_sv: "Med ___ i hand var det där misslyckandet det bästa som kunde hända mig.", prompt_en: "With ___ in hand (in hindsight), that failure was the best thing that could happen to me.", expected_answer_sv: "facit", expected_answer_en: "the answer key (hindsight)", options: ["facit", "faktura", "fakta", "fokus"], hint_en: "The idiom 'med ___ i hand' means looking back with full knowledge." },
      { type: "quick_response", prompt_sv: "Nu blir jag nyfiken — vad är ditt största misslyckande, ärligt talat?", prompt_en: "Now I'm curious — what's your biggest failure, honestly?", expected_answer_sv: "Ärligt? Mitt första bolag gick i konkurs efter arton månader. Det sved enormt, men det lärde mig allt jag kan om kassaflöde.", expected_answer_en: "Honestly? My first company went bankrupt after eighteen months. It stung enormously, but it taught me everything I know about cash flow.", hint_en: "Own the failure openly, then flip it into the lesson.", options: null },
      { type: "quick_response", prompt_sv: "Avsluta med ett råd till lyssnarna — men bara en enda mening!", prompt_en: "Finish with one piece of advice for the listeners — but only one single sentence!", expected_answer_sv: "Börja innan du känner dig redo, för det ögonblicket kommer aldrig.", expected_answer_en: "Start before you feel ready, because that moment never comes.", hint_en: "One punchy sentence — your prepared takeaway.", options: null },
    ],
  },
};
