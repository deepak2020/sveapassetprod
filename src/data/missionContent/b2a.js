// Auto-generated mission content. Schema: src/lib/missionPrompt.js
// B2 missions, orders 401-411. Keyed by title_sv (must match src/data/missionCatalog.js exactly).
export const MISSION_CONTENT_B2A = {
  "Diskutera en nyhet": {
    description_en: "Discuss a recent climate policy news story with a friend over coffee and share your opinion politely.",
    opener_sv: "Såg du nyheten om det nya klimatförslaget? Helt orimligt, tycker jag. Vad säger du?",
    opener_en: "Did you see the news about the new climate proposal? Completely unreasonable, I think. What do you say?",
    goal: "Share a clear opinion on the news story, agree or disagree politely, and back it up with at least one reason.",
    success_criteria: [
      "State your own opinion on the climate proposal clearly",
      "Agree or disagree with your friend in a polite way",
      "Give at least one concrete reason for your view"
    ],
    curveballs: [
      "Your friend claims you have misunderstood the proposal completely",
      "Your friend asks what you would do instead if you were in charge",
      "Your friend suddenly changes sides and agrees with you"
    ],
    cultural_notes: "Swedes often soften disagreement with phrases like 'jag förstår hur du menar, men…' — blunt confrontation over coffee is unusual.",
    suggested_vocab: ["förslaget", "å ena sidan", "å andra sidan", "hållbart", "en poäng", "tveksam"],
    key_vocabulary: [
      {
        swedish: "ett förslag",
        english: "a proposal",
        example_sv: "Jag tycker faktiskt att förslaget är ganska rimligt.",
        example_en: "I actually think the proposal is quite reasonable.",
        pronunciation_tip: "Stress on the second syllable: för-SLAG."
      },
      {
        swedish: "rimlig",
        english: "reasonable",
        example_sv: "Är det verkligen rimligt att höja skatten så mycket?",
        example_en: "Is it really reasonable to raise the tax that much?",
        pronunciation_tip: "Short i, stress on the first syllable: RIM-lig."
      },
      {
        swedish: "hållbar",
        english: "sustainable",
        example_sv: "Vi behöver en mer hållbar politik på lång sikt.",
        example_en: "We need a more sustainable policy in the long run.",
        pronunciation_tip: "Long å as in English 'awe': HÅLL-bar."
      },
      {
        swedish: "tveksam",
        english: "doubtful, hesitant",
        example_sv: "Jag är lite tveksam till om det verkligen funkar i praktiken.",
        example_en: "I'm a bit doubtful whether it really works in practice.",
        pronunciation_tip: "Stress on the first syllable: TVEK-sam."
      },
      {
        swedish: "å andra sidan",
        english: "on the other hand",
        example_sv: "Å andra sidan måste någon ju betala för omställningen.",
        example_en: "On the other hand, someone has to pay for the transition.",
        pronunciation_tip: "Å sounds like 'oh'; say it as one smooth phrase."
      },
      {
        swedish: "påverka",
        english: "to influence, to affect",
        example_sv: "Det här kommer att påverka vanliga hushåll ganska mycket.",
        example_en: "This will affect ordinary households quite a lot.",
        pronunciation_tip: "Stress on the first syllable: PÅ-verka."
      }
    ],
    key_phrases: [
      {
        situation_en: "Agreeing partly before disagreeing",
        phrase_sv: "Jag förstår hur du menar, men jag ser det lite annorlunda.",
        phrase_en: "I see what you mean, but I look at it a bit differently.",
        pronunciation_tip: "Flow through 'annorlunda': ANN-or-lun-da."
      },
      {
        situation_en: "Giving your opinion with a reason",
        phrase_sv: "Jag tycker faktiskt att det är ett steg i rätt riktning, eftersom vi måste börja någonstans.",
        phrase_en: "I actually think it's a step in the right direction, because we have to start somewhere.",
        pronunciation_tip: "'Faktiskt' is often said quickly: FAK-tist."
      },
      {
        situation_en: "Admitting the other side has a point",
        phrase_sv: "Du har en poäng där, det hade jag inte tänkt på.",
        phrase_en: "You have a point there, I hadn't thought of that.",
        pronunciation_tip: "'Poäng' has two syllables: po-ÄNG."
      },
      {
        situation_en: "Disagreeing politely",
        phrase_sv: "Där håller jag nog inte riktigt med dig, faktiskt.",
        phrase_en: "There I don't quite agree with you, actually.",
        pronunciation_tip: "'Nog' softens the sentence — keep it unstressed."
      },
      {
        situation_en: "Asking what the other person thinks",
        phrase_sv: "Men hur tänker du kring själva kostnaden?",
        phrase_en: "But what are your thoughts on the actual cost?",
        pronunciation_tip: "'Kring' has a hard k and short i."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Jag förstår hur du menar, men jag ser det lite ___.",
        prompt_en: "I see what you mean, but I look at it a bit ___.",
        expected_answer_sv: "annorlunda",
        expected_answer_en: "differently",
        options: ["annorlunda", "likadant", "sällan", "ungefär"],
        hint_en: "You are politely saying you have a different view.",
      },
      {
        type: "quick_response",
        prompt_sv: "Ärligt talat tror jag att du har missförstått hela förslaget.",
        prompt_en: "Honestly, I think you've misunderstood the whole proposal.",
        expected_answer_sv: "Det kan hända, men som jag har förstått det handlar det främst om högre bensinskatt.",
        expected_answer_en: "That may be, but as I've understood it, it's mainly about a higher fuel tax.",
        hint_en: "Stay calm and explain what you actually understood.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Okej, men vad skulle du göra i stället om du fick bestämma?",
        prompt_en: "Okay, but what would you do instead if you got to decide?",
        expected_answer_sv: "Jag skulle nog satsa mer på kollektivtrafiken, så att fler faktiskt kan ställa bilen.",
        expected_answer_en: "I would probably invest more in public transport, so more people can actually leave the car at home.",
        hint_en: "Suggest one concrete alternative — use 'jag skulle nog…'.",
        options: null
      }
    ]
  },

  "Löneförhandling med chefen": {
    description_en: "Negotiate a 6 % raise at your annual salary review, backing your case with evidence and handling a counter-offer.",
    opener_sv: "Välkommen in! Då var det dags för ditt lönesamtal. Hur tänker du kring din lön i år?",
    opener_en: "Come on in! Time for your salary review. What are your thoughts on your salary this year?",
    goal: "Propose a 6 % raise, support it with concrete achievements, and respond constructively to the boss's counter-offer.",
    success_criteria: [
      "Propose a specific number or percentage for the raise",
      "Back your request with at least two concrete achievements",
      "Respond to the counter-offer without just giving in"
    ],
    curveballs: [
      "The boss says the budget only allows for 2 % this year",
      "The boss asks why you deserve more than your colleagues",
      "The boss offers extra vacation days instead of money"
    ],
    cultural_notes: "Salary talks in Sweden are calm and fact-based — bring concrete results rather than emotional appeals, and don't be afraid of a short silence.",
    suggested_vocab: ["löneökning", "ansvar", "resultat", "motivera", "budgeten", "ett motbud"],
    key_vocabulary: [
      {
        swedish: "en löneökning",
        english: "a pay raise",
        example_sv: "Jag skulle vilja diskutera en löneökning på sex procent.",
        example_en: "I would like to discuss a pay raise of six percent.",
        pronunciation_tip: "Compound word: LÖ-ne-ök-ning, stress on the first part."
      },
      {
        swedish: "ett ansvar",
        english: "a responsibility",
        example_sv: "Jag har tagit på mig betydligt mer ansvar det senaste året.",
        example_en: "I have taken on considerably more responsibility over the last year.",
        pronunciation_tip: "Stress on the second syllable: an-SVAR."
      },
      {
        swedish: "motivera",
        english: "to justify, to motivate",
        example_sv: "Låt mig motivera varför jag tycker att det är en rimlig nivå.",
        example_en: "Let me justify why I think that's a reasonable level.",
        pronunciation_tip: "Stress on the third syllable: mo-ti-VE-ra."
      },
      {
        swedish: "ett motbud",
        english: "a counter-offer",
        example_sv: "Tack för motbudet, men jag hade hoppats på lite mer.",
        example_en: "Thanks for the counter-offer, but I had hoped for a bit more.",
        pronunciation_tip: "MOT-bud — both vowels are long."
      },
      {
        swedish: "prestera",
        english: "to perform",
        example_sv: "Teamet har presterat över målen två kvartal i rad.",
        example_en: "The team has performed above target two quarters in a row.",
        pronunciation_tip: "Stress on the second syllable: pre-STE-ra."
      },
      {
        swedish: "marknadsmässig",
        english: "in line with the market",
        example_sv: "Min nuvarande lön ligger under vad som är marknadsmässigt.",
        example_en: "My current salary is below what is in line with the market.",
        pronunciation_tip: "Long compound: MARK-nads-mäss-ig, stress at the front."
      }
    ],
    key_phrases: [
      {
        situation_en: "Proposing your number",
        phrase_sv: "Utifrån mina resultat i år tycker jag att sex procent vore en rimlig höjning.",
        phrase_en: "Based on my results this year, I think six percent would be a reasonable raise.",
        pronunciation_tip: "'Vore' is a soft, polite form — keep it unstressed."
      },
      {
        situation_en: "Backing your case with evidence",
        phrase_sv: "Jag har till exempel dragit in två nya kunder och tagit över ansvaret för onboardingen.",
        phrase_en: "For example, I've brought in two new clients and taken over responsibility for onboarding.",
        pronunciation_tip: "'Till exempel' is often shortened in speech: till ex-EM-pel."
      },
      {
        situation_en: "Pushing back on a low counter-offer",
        phrase_sv: "Jag förstår att budgeten är tajt, men två procent känns lågt med tanke på vad jag har levererat.",
        phrase_en: "I understand the budget is tight, but two percent feels low considering what I've delivered.",
        pronunciation_tip: "'Tajt' sounds like English 'tight'."
      },
      {
        situation_en: "Suggesting a compromise",
        phrase_sv: "Skulle vi kunna mötas på fyra procent, med en ny avstämning till våren?",
        phrase_en: "Could we meet at four percent, with a new check-in in the spring?",
        pronunciation_tip: "'Avstämning' — stress the first syllable: AV-stäm-ning."
      },
      {
        situation_en: "Asking for time to think",
        phrase_sv: "Får jag fundera på erbjudandet och återkomma i morgon?",
        phrase_en: "May I think about the offer and get back to you tomorrow?",
        pronunciation_tip: "'Återkomma' — stress the first syllable: Å-ter-komma."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Jag förstår att budgeten är tajt, men två procent känns ___ med tanke på vad jag har levererat.",
        prompt_en: "I understand the budget is tight, but two percent feels ___ considering what I've delivered.",
        expected_answer_sv: "lågt",
        expected_answer_en: "low",
        options: ["lågt", "högt", "lagom", "dyrt"],
        hint_en: "You are pushing back because the offer is not enough.",
      },
      {
        type: "quick_response",
        prompt_sv: "Jag måste vara ärlig — budgeten tillåter bara två procent i år.",
        prompt_en: "I have to be honest — the budget only allows two percent this year.",
        expected_answer_sv: "Jag förstår, men med tanke på mina resultat hoppas jag att vi kan mötas på fyra procent.",
        expected_answer_en: "I understand, but considering my results, I hope we can meet at four percent.",
        hint_en: "Acknowledge the constraint, then suggest a compromise number.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Vad skulle du säga om vi erbjuder extra semesterdagar i stället för mer lön?",
        prompt_en: "What would you say if we offered extra vacation days instead of more pay?",
        expected_answer_sv: "Det är ett intressant förslag, men just nu prioriterar jag lönen. Får jag fundera och återkomma?",
        expected_answer_en: "That's an interesting offer, but right now I prioritize the salary. May I think it over and get back to you?",
        hint_en: "Don't say yes right away — state your priority and buy time.",
        options: null
      }
    ]
  },

  "Hålla presentation för team": {
    description_en: "Present last quarter's results to eight colleagues in a clear, structured way and handle two questions.",
    opener_sv: "Okej allihopa, nu kör vi igång. Ordet är ditt — berätta hur kvartalet har gått!",
    opener_en: "Okay everyone, let's get started. The floor is yours — tell us how the quarter went!",
    goal: "Deliver a structured two-minute presentation of the quarterly results and answer two questions with detail.",
    success_criteria: [
      "Open with a clear structure — say what you will cover",
      "Present at least one positive result and one challenge with numbers",
      "Answer two questions with concrete detail"
    ],
    curveballs: [
      "A colleague interrupts to question one of your numbers",
      "Someone asks a question you don't know the answer to",
      "You are asked to summarize everything in one sentence"
    ],
    cultural_notes: "Swedish workplace presentations are low-key and fact-driven — modest phrasing like 'ganska bra' often means 'very good', and interrupting with questions is normal and not rude.",
    suggested_vocab: ["kvartalet", "en ökning", "en utmaning", "sammanfattningsvis", "siffrorna", "målet"],
    key_vocabulary: [
      {
        swedish: "ett kvartal",
        english: "a quarter (three months)",
        example_sv: "Det här kvartalet har varit starkare än vi väntade oss.",
        example_en: "This quarter has been stronger than we expected.",
        pronunciation_tip: "Stress on the second syllable: kvar-TAL."
      },
      {
        swedish: "en ökning",
        english: "an increase",
        example_sv: "Vi ser en ökning på tolv procent jämfört med förra kvartalet.",
        example_en: "We're seeing a twelve percent increase compared to last quarter.",
        pronunciation_tip: "Ö like the vowel in 'fur': ÖK-ning."
      },
      {
        swedish: "en utmaning",
        english: "a challenge",
        example_sv: "Den största utmaningen har varit leveranstiderna.",
        example_en: "The biggest challenge has been the delivery times.",
        pronunciation_tip: "Stress on the first syllable: UT-ma-ning."
      },
      {
        swedish: "sammanfattningsvis",
        english: "in summary",
        example_sv: "Sammanfattningsvis var det ett bra kvartal, trots vissa problem.",
        example_en: "In summary, it was a good quarter, despite some problems.",
        pronunciation_tip: "Long word — break it up: samman-FATT-nings-vis."
      },
      {
        swedish: "jämfört med",
        english: "compared to",
        example_sv: "Jämfört med i fjol ligger vi klart bättre till.",
        example_en: "Compared to last year, we're in a clearly better position.",
        pronunciation_tip: "'Jämfört' — soft j like English y: YEM-fört."
      },
      {
        swedish: "ett mål",
        english: "a goal, a target",
        example_sv: "Vi nådde målet med god marginal.",
        example_en: "We reached the target with a good margin.",
        pronunciation_tip: "Long å: sounds like 'mawl'."
      }
    ],
    key_phrases: [
      {
        situation_en: "Opening with a structure",
        phrase_sv: "Jag tänkte börja med siffrorna, sen utmaningarna, och avsluta med planen framåt.",
        phrase_en: "I'll start with the numbers, then the challenges, and finish with the plan going forward.",
        pronunciation_tip: "'Tänkte' is a soft way to say 'I plan to' — say it quickly."
      },
      {
        situation_en: "Presenting a key result",
        phrase_sv: "Försäljningen ökade med tolv procent, vilket är klart över målet.",
        phrase_en: "Sales increased by twelve percent, which is clearly above target.",
        pronunciation_tip: "'Vilket' links the clauses — don't pause before it."
      },
      {
        situation_en: "Handling a question you can't answer",
        phrase_sv: "Bra fråga — det har jag faktiskt inte siffror på just nu, men jag återkommer i morgon.",
        phrase_en: "Good question — I actually don't have numbers on that right now, but I'll get back to you tomorrow.",
        pronunciation_tip: "Keep the tone light and confident, not apologetic."
      },
      {
        situation_en: "Standing by your numbers when challenged",
        phrase_sv: "Jag är rätt säker på den siffran, men vi kan dubbelkolla den tillsammans efteråt.",
        phrase_en: "I'm quite sure about that number, but we can double-check it together afterwards.",
        pronunciation_tip: "'Rätt' here means 'quite' — short ä sound."
      },
      {
        situation_en: "Wrapping up",
        phrase_sv: "Sammanfattningsvis: ett starkt kvartal, men vi behöver få ordning på leveranstiderna.",
        phrase_en: "In summary: a strong quarter, but we need to sort out the delivery times.",
        pronunciation_tip: "Pause briefly after 'sammanfattningsvis' for effect."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Försäljningen ökade med tolv procent, ___ är klart över målet.",
        prompt_en: "Sales increased by twelve percent, ___ is clearly above target.",
        expected_answer_sv: "vilket",
        expected_answer_en: "which",
        options: ["vilket", "vilken", "som om", "därför"],
        hint_en: "A linking word referring back to the whole previous statement.",
      },
      {
        type: "quick_response",
        prompt_sv: "Vänta lite — är den där siffran verkligen rätt? Jag har sett andra siffror.",
        prompt_en: "Hang on — is that number really correct? I've seen different figures.",
        expected_answer_sv: "Jag är rätt säker på den, men vi kan gärna dubbelkolla tillsammans efter mötet.",
        expected_answer_en: "I'm quite sure about it, but we're welcome to double-check together after the meeting.",
        hint_en: "Stay calm, stand by your number, offer to verify.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Kan du sammanfatta hela kvartalet i en enda mening?",
        prompt_en: "Can you summarize the whole quarter in a single sentence?",
        expected_answer_sv: "Absolut — ett starkt kvartal med tolv procents tillväxt, men leveranstiderna måste bli bättre.",
        expected_answer_en: "Absolutely — a strong quarter with twelve percent growth, but the delivery times have to improve.",
        hint_en: "One positive, one challenge — keep it to one sentence.",
        options: null
      }
    ]
  },

  "Ge kritik till en kollega": {
    description_en: "Give constructive feedback to a junior colleague who missed a deadline, and agree on a concrete change.",
    opener_sv: "Hej! Tack för att du tog dig tid. Du sa att du ville prata om nåt — vad gäller det?",
    opener_en: "Hi! Thanks for making time. You said you wanted to talk about something — what's it about?",
    goal: "Deliver specific, kind feedback about the missed deadline and agree together on a concrete change going forward.",
    success_criteria: [
      "Frame the feedback kindly and start with something positive",
      "Be specific about what happened and its consequences",
      "Agree on one concrete change for the future"
    ],
    curveballs: [
      "The colleague gets defensive and blames the unclear brief",
      "The colleague reveals a personal reason behind the missed deadline",
      "The colleague asks bluntly if their job is at risk"
    ],
    cultural_notes: "In Swedish work culture feedback is given gently and as a dialogue between equals — harsh top-down criticism damages trust, so frame it as solving a problem together.",
    suggested_vocab: ["en deadline", "återkoppling", "uppskatta", "konsekvenser", "framöver", "stämma av"],
    key_vocabulary: [
      {
        swedish: "återkoppling",
        english: "feedback",
        example_sv: "Jag ville ge dig lite återkoppling på det senaste projektet.",
        example_en: "I wanted to give you some feedback on the latest project.",
        pronunciation_tip: "Stress on the first syllable: Å-ter-kopp-ling."
      },
      {
        swedish: "uppskatta",
        english: "to appreciate",
        example_sv: "Jag uppskattar verkligen din energi i teamet.",
        example_en: "I really appreciate your energy in the team.",
        pronunciation_tip: "Double consonants are short and sharp: upp-SKAT-ta."
      },
      {
        swedish: "en konsekvens",
        english: "a consequence",
        example_sv: "Förseningen fick konsekvenser för hela leveransen.",
        example_en: "The delay had consequences for the whole delivery.",
        pronunciation_tip: "Stress on the last syllable: kon-se-KVENS."
      },
      {
        swedish: "framöver",
        english: "going forward",
        example_sv: "Hur kan vi undvika det här framöver?",
        example_en: "How can we avoid this going forward?",
        pronunciation_tip: "Stress in the middle: fram-Ö-ver."
      },
      {
        swedish: "stämma av",
        english: "to check in, to sync",
        example_sv: "Kan vi stämma av varje fredag så att inget faller mellan stolarna?",
        example_en: "Can we check in every Friday so nothing falls through the cracks?",
        pronunciation_tip: "Particle verb — stress falls on 'av'."
      },
      {
        swedish: "flagga",
        english: "to flag, to raise early",
        example_sv: "Det är helt okej att flagga tidigt om tiden inte räcker.",
        example_en: "It's totally fine to flag early if there isn't enough time.",
        pronunciation_tip: "Short a, double g: FLAG-ga."
      }
    ],
    key_phrases: [
      {
        situation_en: "Opening kindly before the criticism",
        phrase_sv: "Först och främst — jag är verkligen nöjd med kvaliteten på det du gör.",
        phrase_en: "First of all — I'm really happy with the quality of what you do.",
        pronunciation_tip: "'Nöjd' rhymes roughly with 'employed' without the l."
      },
      {
        situation_en: "Naming the problem specifically",
        phrase_sv: "Samtidigt blev rapporten klar tre dagar för sent, och det påverkade hela teamet.",
        phrase_en: "At the same time, the report was finished three days late, and that affected the whole team.",
        pronunciation_tip: "'Samtidigt' softens the shift — stress: sam-TI-digt."
      },
      {
        situation_en: "Inviting their perspective",
        phrase_sv: "Hur ser du själv på vad som hände?",
        phrase_en: "How do you see what happened yourself?",
        pronunciation_tip: "'Själv' — sj is a soft 'hw/sh' sound: SHELV."
      },
      {
        situation_en: "Responding to defensiveness",
        phrase_sv: "Jag hör vad du säger, och briefen kunde säkert varit tydligare — men jag hade behövt veta det tidigare.",
        phrase_en: "I hear what you're saying, and the brief could certainly have been clearer — but I would have needed to know that earlier.",
        pronunciation_tip: "Keep an even, calm tone through the whole sentence."
      },
      {
        situation_en: "Agreeing on a change",
        phrase_sv: "Ska vi säga att du flaggar direkt om en deadline känns tajt, så stämmer vi av på fredagar?",
        phrase_en: "Shall we say that you flag right away if a deadline feels tight, and we check in on Fridays?",
        pronunciation_tip: "'Ska vi säga att…' is a common soft way to propose a deal."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Det är helt okej att ___ tidigt om tiden inte räcker.",
        prompt_en: "It's totally fine to ___ early if there isn't enough time.",
        expected_answer_sv: "flagga",
        expected_answer_en: "flag (raise the issue)",
        options: ["flagga", "klaga", "vägra", "skryta"],
        hint_en: "Raise a warning before the problem happens.",
      },
      {
        type: "quick_response",
        prompt_sv: "Ärligt talat var briefen jättesluddrig — det är väl inte mitt fel?",
        prompt_en: "Honestly, the brief was really vague — that's not my fault, is it?",
        expected_answer_sv: "Jag hör vad du säger, och den kunde varit tydligare. Men då behöver du säga till direkt, inte efter deadlinen.",
        expected_answer_en: "I hear what you're saying, and it could have been clearer. But then you need to speak up right away, not after the deadline.",
        hint_en: "Acknowledge their point, then hold the line on early flagging.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Okej… betyder det här att mitt jobb är i fara?",
        prompt_en: "Okay… does this mean my job is at risk?",
        expected_answer_sv: "Nej, absolut inte. Det här handlar om att hitta ett bättre arbetssätt, inget annat.",
        expected_answer_en: "No, absolutely not. This is about finding a better way of working, nothing else.",
        hint_en: "Reassure clearly and bring it back to the concrete change.",
        options: null
      }
    ]
  },

  "Diskutera bostadspriser": {
    description_en: "Join a dinner conversation about how hard it is to buy a first apartment and share your view with an example.",
    opener_sv: "Vi pratade precis om bostadsmarknaden — hur ska unga överhuvudtaget kunna köpa en första lägenhet idag? Vad tänker du?",
    opener_en: "We were just talking about the housing market — how are young people even supposed to buy a first apartment today? What do you think?",
    goal: "Contribute a clear opinion on housing prices, back it with one concrete example, and react to someone else's view.",
    success_criteria: [
      "Share your own opinion on the housing market",
      "Give one concrete example, e.g. a price or a personal story",
      "React to another guest's view — agree or push back politely"
    ],
    curveballs: [
      "A guest claims young people just need to stop buying lattes and save more",
      "Someone asks how it works in your home country",
      "A guest says renting is actually smarter than buying"
    ],
    cultural_notes: "Housing is a national obsession in Sweden — mentioning 'kontantinsatsen' or the rental queue ('bostadskön') instantly shows you understand the debate.",
    suggested_vocab: ["kontantinsats", "bolån", "hyresrätt", "bostadsrätt", "budgivning", "amortera"],
    key_vocabulary: [
      {
        swedish: "en kontantinsats",
        english: "a down payment",
        example_sv: "Det svåraste är att spara ihop till kontantinsatsen.",
        example_en: "The hardest part is saving up for the down payment.",
        pronunciation_tip: "Compound: kon-TANT-in-sats — stress on 'tant'."
      },
      {
        swedish: "ett bolån",
        english: "a mortgage",
        example_sv: "Bankerna är ganska hårda med vem som får bolån.",
        example_en: "The banks are quite strict about who gets a mortgage.",
        pronunciation_tip: "Two long vowels: BO-lån."
      },
      {
        swedish: "en hyresrätt",
        english: "a rental apartment",
        example_sv: "Att få en hyresrätt i Stockholm kan ta tio år i kön.",
        example_en: "Getting a rental apartment in Stockholm can take ten years in the queue.",
        pronunciation_tip: "HY-res-rätt — y is like French 'u'."
      },
      {
        swedish: "en budgivning",
        english: "a bidding war",
        example_sv: "Budgivningen slutade långt över utgångspriset.",
        example_en: "The bidding ended way above the asking price.",
        pronunciation_tip: "BUD-giv-ning — hard g."
      },
      {
        swedish: "amortera",
        english: "to pay down a loan",
        example_sv: "Man måste amortera ganska mycket varje månad numera.",
        example_en: "You have to pay down quite a lot every month these days.",
        pronunciation_tip: "Stress on the third syllable: a-mor-TE-ra."
      },
      {
        swedish: "ha råd med",
        english: "to be able to afford",
        example_sv: "Många unga har helt enkelt inte råd med en tvåa i stan.",
        example_en: "Many young people simply can't afford a two-room flat in town.",
        pronunciation_tip: "'Råd' has a long å — sounds like 'rawd'."
      }
    ],
    key_phrases: [
      {
        situation_en: "Sharing your view on the market",
        phrase_sv: "Om du frågar mig är det största problemet kontantinsatsen, inte månadskostnaden.",
        phrase_en: "If you ask me, the biggest problem is the down payment, not the monthly cost.",
        pronunciation_tip: "'Om du frågar mig' is a natural opinion opener — say it as one unit."
      },
      {
        situation_en: "Giving a concrete example",
        phrase_sv: "En kompis till mig la bud på en etta i Uppsala — den gick för en halv miljon över utgångspriset.",
        phrase_en: "A friend of mine bid on a studio in Uppsala — it went for half a million above the asking price.",
        pronunciation_tip: "'La bud' = placed a bid; short and punchy."
      },
      {
        situation_en: "Pushing back on a simplistic argument",
        phrase_sv: "Ärligt talat tror jag inte att det handlar om lattekonsumtion — priserna har dragit ifrån lönerna helt.",
        phrase_en: "Honestly, I don't think it's about latte spending — prices have completely outpaced wages.",
        pronunciation_tip: "'Dragit ifrån' — stress 'ifrån': ee-FRAWN."
      },
      {
        situation_en: "Agreeing with someone",
        phrase_sv: "Precis, det är exakt det jag menar.",
        phrase_en: "Exactly, that's exactly what I mean.",
        pronunciation_tip: "'Precis' — stress the last syllable: pre-SEES."
      },
      {
        situation_en: "Comparing with another country",
        phrase_sv: "Där jag kommer ifrån är det vanligare att hyra hela livet, så det här med bostadsrätter var nytt för mig.",
        phrase_en: "Where I come from it's more common to rent your whole life, so this thing with owned apartments was new to me.",
        pronunciation_tip: "'Det här med…' is a handy phrase for 'this whole thing about…'."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Många unga har helt enkelt inte ___ med en tvåa i stan.",
        prompt_en: "Many young people simply can't ___ a two-room flat in town.",
        expected_answer_sv: "råd",
        expected_answer_en: "afford (have the means)",
        options: ["råd", "tid", "lust", "plats"],
        hint_en: "'Ha ___ med' means to be able to afford something.",
      },
      {
        type: "quick_response",
        prompt_sv: "Alltså, unga idag borde bara sluta köpa kaffe och börja spara i stället.",
        prompt_en: "I mean, young people today should just stop buying coffee and start saving instead.",
        expected_answer_sv: "Ärligt talat räcker inte det — priserna har stigit mycket snabbare än lönerna.",
        expected_answer_en: "Honestly, that's not enough — prices have risen much faster than wages.",
        hint_en: "Push back politely with the wages-versus-prices argument.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Hur funkar det där du kommer ifrån — köper folk sin första lägenhet tidigt?",
        prompt_en: "How does it work where you come from — do people buy their first apartment early?",
        expected_answer_sv: "Nej, där jag kommer ifrån hyr de flesta ganska länge, så bostadsrätter var något nytt för mig.",
        expected_answer_en: "No, where I come from most people rent for quite a long time, so owned apartments were something new to me.",
        hint_en: "Give a short comparison — 'där jag kommer ifrån…'.",
        options: null
      }
    ]
  },

  "Debattera integration": {
    description_en: "At a mingle, discuss integration in Sweden with nuance, avoid clichés, and disagree politely when needed.",
    opener_sv: "Jag läste en debattartikel om integration i morse — det känns som att alla har en åsikt men ingen lösning. Vad tänker du själv?",
    opener_en: "I read an opinion piece about integration this morning — it feels like everyone has an opinion but no solution. What do you think yourself?",
    goal: "Present a nuanced view on integration, back it with your own experience or an example, and disagree politely if challenged.",
    success_criteria: [
      "Present a view that acknowledges more than one side of the issue",
      "Support your view with an example or personal experience",
      "Disagree politely with at least one statement without escalating"
    ],
    curveballs: [
      "The other person makes a sweeping generalization about immigrants",
      "You are asked directly about your own experience of integrating",
      "The other person says the topic is too sensitive to discuss at all"
    ],
    cultural_notes: "Swedes often approach sensitive political topics cautiously at first — showing nuance and saying 'det är en komplex fråga' earns more respect than strong one-liners.",
    suggested_vocab: ["samhället", "en förenkling", "nyanserad", "arbetsmarknaden", "en generalisering", "erfarenhet"],
    key_vocabulary: [
      {
        swedish: "samhället",
        english: "society",
        example_sv: "Språket är nyckeln för att komma in i samhället.",
        example_en: "The language is the key to getting into society.",
        pronunciation_tip: "sam-HELL-et — double l is short and crisp."
      },
      {
        swedish: "nyanserad",
        english: "nuanced",
        example_sv: "Jag försöker ha en nyanserad bild av frågan.",
        example_en: "I try to have a nuanced view of the issue.",
        pronunciation_tip: "Stress on the third syllable: ny-an-SE-rad."
      },
      {
        swedish: "en förenkling",
        english: "an oversimplification",
        example_sv: "Det där låter som en ganska grov förenkling, tycker jag.",
        example_en: "That sounds like a pretty crude oversimplification, I think.",
        pronunciation_tip: "för-ENK-ling — stress in the middle."
      },
      {
        swedish: "arbetsmarknaden",
        english: "the job market",
        example_sv: "Att komma in på arbetsmarknaden är ofta det svåraste steget.",
        example_en: "Getting into the job market is often the hardest step.",
        pronunciation_tip: "Long compound: AR-bets-mark-na-den."
      },
      {
        swedish: "en generalisering",
        english: "a generalization",
        example_sv: "Det blir lätt generaliseringar när man pratar om stora grupper.",
        example_en: "It easily turns into generalizations when you talk about large groups.",
        pronunciation_tip: "Stress near the end: ge-ne-ra-li-SE-ring."
      },
      {
        swedish: "en erfarenhet",
        english: "an experience",
        example_sv: "Min egen erfarenhet är att jobbet betydde mer än kurserna.",
        example_en: "My own experience is that the job mattered more than the courses.",
        pronunciation_tip: "er-FA-ren-het — stress on 'fa'."
      }
    ],
    key_phrases: [
      {
        situation_en: "Opening with a nuanced position",
        phrase_sv: "Det är en komplex fråga — jag tror både språket och jobben spelar stor roll.",
        phrase_en: "It's a complex issue — I think both the language and jobs play a big role.",
        pronunciation_tip: "'Komplex' — stress the last syllable: kom-PLEX."
      },
      {
        situation_en: "Using your own experience",
        phrase_sv: "Jag kan bara utgå från min egen erfarenhet, och för mig var jobbet den stora skillnaden.",
        phrase_en: "I can only go by my own experience, and for me the job was the big difference.",
        pronunciation_tip: "'Utgå från' — stress on 'ut': UT-gaw."
      },
      {
        situation_en: "Challenging a generalization politely",
        phrase_sv: "Jag tror man ska vara försiktig med att dra alla över en kam.",
        phrase_en: "I think you should be careful about tarring everyone with the same brush.",
        pronunciation_tip: "'Dra alla över en kam' is a set idiom — say it smoothly."
      },
      {
        situation_en: "Acknowledging a real problem without agreeing fully",
        phrase_sv: "Visst finns det problem, men jag tycker inte att det är hela bilden.",
        phrase_en: "Sure, there are problems, but I don't think that's the whole picture.",
        pronunciation_tip: "'Visst' concedes a point — short i, strong s."
      },
      {
        situation_en: "Keeping the conversation open",
        phrase_sv: "Jag tycker faktiskt att det är bra att vi kan prata om det här utan att bli osams.",
        phrase_en: "I actually think it's good that we can talk about this without falling out.",
        pronunciation_tip: "'Osams' means on bad terms — O-sams, stress at the front."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Jag tror man ska vara försiktig med att dra alla över en ___.",
        prompt_en: "I think you should be careful about tarring everyone with the same ___ (brush).",
        expected_answer_sv: "kam",
        expected_answer_en: "comb (idiom: same brush)",
        options: ["kam", "gräns", "linje", "kant"],
        hint_en: "A Swedish idiom about unfair generalizations — literally a 'comb'.",
      },
      {
        type: "quick_response",
        prompt_sv: "Ärligt talat vill de flesta som kommer hit inte ens lära sig svenska.",
        prompt_en: "Honestly, most people who come here don't even want to learn Swedish.",
        expected_answer_sv: "Det tycker jag är en förenkling — de flesta jag känner kämpar verkligen med språket varje dag.",
        expected_answer_en: "I think that's an oversimplification — most people I know really struggle with the language every day.",
        hint_en: "Name it as a generalization and counter with your experience.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Du som har flyttat hit själv — vad var svårast för dig?",
        prompt_en: "You who moved here yourself — what was hardest for you?",
        expected_answer_sv: "Ärligt talat var det att få det första jobbet — efter det lossnade både språket och det sociala.",
        expected_answer_en: "Honestly, it was getting the first job — after that both the language and the social side took off.",
        hint_en: "Share one concrete personal experience, not a general answer.",
        options: null
      }
    ]
  },

  "Prata med chefen om stress": {
    description_en: "Tell your manager in a 1:1 that you have been overloaded for weeks, be specific, and propose a solution.",
    opener_sv: "Hej, kul att ses! Du ville boka in ett extra samtal — hur har du det egentligen?",
    opener_en: "Hi, good to see you! You wanted to book an extra chat — how are you doing, really?",
    goal: "Describe your workload honestly with concrete examples and agree on at least one change to reduce the pressure.",
    success_criteria: [
      "Describe the stress with concrete examples, not just feelings",
      "Say clearly that the current workload is not sustainable",
      "Propose at least one concrete solution or ask for prioritization"
    ],
    curveballs: [
      "The manager says everyone is stressed right now and it will pass",
      "The manager asks why you haven't said anything earlier",
      "The manager offers to move a project but asks which one you'd drop"
    ],
    cultural_notes: "Talking openly about stress is accepted in Swedish workplaces — managers are legally responsible for the work environment, so being direct is seen as professional, not weak.",
    suggested_vocab: ["arbetsbelastning", "prioritera", "hållbart", "överbelastad", "gränser", "avlasta"],
    key_vocabulary: [
      {
        swedish: "arbetsbelastning",
        english: "workload",
        example_sv: "Min arbetsbelastning har varit orimlig de senaste veckorna.",
        example_en: "My workload has been unreasonable in recent weeks.",
        pronunciation_tip: "AR-bets-be-last-ning — stress at the front."
      },
      {
        swedish: "prioritera",
        english: "to prioritize",
        example_sv: "Jag behöver hjälp att prioritera mellan projekten.",
        example_en: "I need help prioritizing between the projects.",
        pronunciation_tip: "Stress near the end: pri-o-ri-TE-ra."
      },
      {
        swedish: "överbelastad",
        english: "overloaded",
        example_sv: "Jag har känt mig överbelastad i flera veckor nu.",
        example_en: "I've felt overloaded for several weeks now.",
        pronunciation_tip: "Ö-ver-be-LAST-ad — long word, keep it even."
      },
      {
        swedish: "hållbart",
        english: "sustainable",
        example_sv: "Det här tempot är inte hållbart i längden.",
        example_en: "This pace is not sustainable in the long run.",
        pronunciation_tip: "HÅLL-bart — long å at the start."
      },
      {
        swedish: "avlasta",
        english: "to relieve, take load off",
        example_sv: "Finns det någon som kan avlasta mig med rapporteringen?",
        example_en: "Is there anyone who can relieve me of the reporting?",
        pronunciation_tip: "AV-las-ta — stress on the first syllable."
      },
      {
        swedish: "sätta gränser",
        english: "to set boundaries",
        example_sv: "Jag behöver bli bättre på att sätta gränser, men jag behöver också stöd.",
        example_en: "I need to get better at setting boundaries, but I also need support.",
        pronunciation_tip: "'Gränser' — GREN-ser with a short ä."
      }
    ],
    key_phrases: [
      {
        situation_en: "Opening the difficult topic",
        phrase_sv: "Jag ville prata ärligt med dig — de senaste veckorna har varit för mycket för mig.",
        phrase_en: "I wanted to talk honestly with you — the last few weeks have been too much for me.",
        pronunciation_tip: "'Ärligt' — soft ä, stress at the front: ÄR-ligt."
      },
      {
        situation_en: "Being specific about the load",
        phrase_sv: "Konkret handlar det om att jag kör tre projekt parallellt och jobbar över nästan varje kväll.",
        phrase_en: "Concretely, it's that I'm running three projects in parallel and working late almost every evening.",
        pronunciation_tip: "'Parallellt' — stress the last syllable: pa-ra-LELLT."
      },
      {
        situation_en: "Saying it is not sustainable",
        phrase_sv: "Jag klarar det ett tag till, men i längden är det inte hållbart.",
        phrase_en: "I can manage it a while longer, but in the long run it's not sustainable.",
        pronunciation_tip: "'I längden' — link the words: ee-LENG-den."
      },
      {
        situation_en: "Proposing a solution",
        phrase_sv: "Mitt förslag är att vi pausar kundportalen tills rekryteringen är klar.",
        phrase_en: "My suggestion is that we pause the customer portal until the recruitment is done.",
        pronunciation_tip: "'Förslag' — stress on the second syllable: för-SLAG."
      },
      {
        situation_en: "Asking for prioritization",
        phrase_sv: "Om allt inte hinns med — vad vill du att jag prioriterar först?",
        phrase_en: "If there isn't time for everything — what do you want me to prioritize first?",
        pronunciation_tip: "'Hinns med' means 'can be fitted in time-wise'."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Jag klarar det ett tag till, men i längden är det inte ___.",
        prompt_en: "I can manage it a while longer, but in the long run it's not ___.",
        expected_answer_sv: "hållbart",
        expected_answer_en: "sustainable",
        options: ["hållbart", "möjligt", "roligt", "vanligt"],
        hint_en: "The word Swedes use about a pace you can't keep up forever.",
      },
      {
        type: "quick_response",
        prompt_sv: "Jag förstår, men ärligt talat är alla ganska stressade just nu. Det brukar lugna sig.",
        prompt_en: "I understand, but honestly everyone is quite stressed right now. It usually calms down.",
        expected_answer_sv: "Det förstår jag, men för mig handlar det inte om en tuff vecka — det har pågått i över en månad.",
        expected_answer_en: "I get that, but for me it's not about one tough week — it has been going on for over a month.",
        hint_en: "Don't let it be brushed off — point to how long it has lasted.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Okej, vi kan flytta ett projekt. Vilket skulle du släppa i så fall?",
        prompt_en: "Okay, we can move one project. Which one would you drop in that case?",
        expected_answer_sv: "Då skulle jag släppa kundportalen — den har minst tidspress och är lättast att lämna över.",
        expected_answer_en: "Then I would drop the customer portal — it has the least time pressure and is easiest to hand over.",
        hint_en: "Pick one and give a short reason — show you've thought it through.",
        options: null
      }
    ]
  },

  "Argumentera mot ett förslag på möte": {
    description_en: "Object respectfully to a colleague's proposal in a team meeting, explain why, and offer an alternative.",
    opener_sv: "…så mitt förslag är att vi flyttar hela lanseringen till december. Vad tycker ni andra? Du ser fundersam ut.",
    opener_en: "…so my proposal is that we move the whole launch to December. What do the rest of you think? You look thoughtful.",
    goal: "Disagree with the proposal respectfully, give a clear reason, and put a concrete alternative on the table.",
    success_criteria: [
      "Voice your disagreement politely but clearly",
      "Give at least one concrete reason why the proposal is risky",
      "Propose a concrete alternative"
    ],
    curveballs: [
      "The colleague asks if you have a better idea yourself",
      "The chair says there is no time and wants to decide right now",
      "Another colleague loudly supports the original proposal"
    ],
    cultural_notes: "Swedish meetings run on consensus — objections framed as questions or concerns ('jag ser en risk med…') land far better than a flat 'det är fel'.",
    suggested_vocab: ["invända", "en risk", "ett alternativ", "konsekvenserna", "tveksam", "ett beslut"],
    key_vocabulary: [
      {
        swedish: "invända",
        english: "to object",
        example_sv: "Får jag invända lite mot den tidsplanen?",
        example_en: "May I object a bit to that timeline?",
        pronunciation_tip: "IN-ven-da — stress on the first syllable."
      },
      {
        swedish: "en risk",
        english: "a risk",
        example_sv: "Jag ser en tydlig risk med att vänta till december.",
        example_en: "I see a clear risk in waiting until December.",
        pronunciation_tip: "Short i, sharp sk: RISK."
      },
      {
        swedish: "ett alternativ",
        english: "an alternative",
        example_sv: "Kan vi titta på ett alternativ innan vi bestämmer oss?",
        example_en: "Can we look at an alternative before we decide?",
        pronunciation_tip: "Stress on the last syllable: al-ter-na-TIV."
      },
      {
        swedish: "ett beslut",
        english: "a decision",
        example_sv: "Det känns som ett stort beslut att ta på stående fot.",
        example_en: "It feels like a big decision to make on the spot.",
        pronunciation_tip: "be-SLUT — stress on the second syllable."
      },
      {
        swedish: "en konsekvens",
        english: "a consequence",
        example_sv: "Har vi tänkt igenom konsekvenserna för supportteamet?",
        example_en: "Have we thought through the consequences for the support team?",
        pronunciation_tip: "kon-se-KVENS — stress at the end."
      },
      {
        swedish: "skjuta upp",
        english: "to postpone",
        example_sv: "Om vi skjuter upp lanseringen tappar vi momentum.",
        example_en: "If we postpone the launch we lose momentum.",
        pronunciation_tip: "'Skjuta' starts with the soft Swedish sj-sound: HWU-ta."
      }
    ],
    key_phrases: [
      {
        situation_en: "Introducing your objection softly",
        phrase_sv: "Jag hör vad du säger, men jag ser ett par risker med det här.",
        phrase_en: "I hear what you're saying, but I see a couple of risks with this.",
        pronunciation_tip: "'Ett par' — short and quick, means 'a couple of'."
      },
      {
        situation_en: "Giving your main reason",
        phrase_sv: "Flyttar vi till december krockar vi med julhandeln, och då försvinner vi i bruset.",
        phrase_en: "If we move to December we clash with the Christmas shopping season, and then we disappear in the noise.",
        pronunciation_tip: "'Krockar' — hard k, short o: KROCK-ar."
      },
      {
        situation_en: "Proposing an alternative",
        phrase_sv: "Mitt motförslag är att vi kör en mindre lansering i oktober och skalar upp sen.",
        phrase_en: "My counter-proposal is that we do a smaller launch in October and scale up afterwards.",
        pronunciation_tip: "'Motförslag' — stress at the front: MOT-för-slag."
      },
      {
        situation_en: "Resisting a rushed decision",
        phrase_sv: "Kan vi ta ett beslut i morgon i stället? Det här känns för stort att avgöra på stående fot.",
        phrase_en: "Can we decide tomorrow instead? This feels too big to settle on the spot.",
        pronunciation_tip: "'På stående fot' is an idiom — say it as one chunk."
      },
      {
        situation_en: "Keeping it collegial",
        phrase_sv: "Jag är inte emot idén i sig, jag vill bara att vi tänker igenom tajmingen.",
        phrase_en: "I'm not against the idea as such, I just want us to think through the timing.",
        pronunciation_tip: "'I sig' means 'in itself' — ee-SAY, said quickly."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Jag hör vad du säger, men jag ser ett par ___ med det här.",
        prompt_en: "I hear what you're saying, but I see a couple of ___ with this.",
        expected_answer_sv: "risker",
        expected_answer_en: "risks",
        options: ["risker", "fördelar", "priser", "regler"],
        hint_en: "The polite Swedish way to flag problems with a proposal.",
      },
      {
        type: "quick_response",
        prompt_sv: "Okej, om du inte gillar december — har du något bättre förslag själv?",
        prompt_en: "Okay, if you don't like December — do you have a better suggestion yourself?",
        expected_answer_sv: "Ja, mitt motförslag är en mindre lansering i oktober, så kan vi skala upp efter jul.",
        expected_answer_en: "Yes, my counter-proposal is a smaller launch in October, and then we can scale up after Christmas.",
        hint_en: "Always have an alternative ready — that's what makes the objection land.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Vi hinner inte diskutera mer — kan vi bara klubba förslaget nu?",
        prompt_en: "We don't have time to discuss more — can we just approve the proposal now?",
        expected_answer_sv: "Jag skulle hellre att vi tar beslutet i morgon — det här är för stort att avgöra på stående fot.",
        expected_answer_en: "I would rather we make the decision tomorrow — this is too big to settle on the spot.",
        hint_en: "Push for a delay politely — use 'på stående fot'.",
        options: null
      }
    ]
  },

  "Berätta en anekdot på middag": {
    description_en: "Tell a short, funny travel story at a dinner party — set the scene, build tension, and land the punchline.",
    opener_sv: "Ni har väl alla råkat ut för nåt galet på resa? Du då — har du någon bra historia?",
    opener_en: "Surely you've all had something crazy happen while travelling? What about you — got a good story?",
    goal: "Tell a travel anecdote with a clear beginning, rising tension, and a punchline that lands.",
    success_criteria: [
      "Set the scene — where, when, and who was involved",
      "Build tension so listeners want to know what happens",
      "Land the punchline clearly at the end"
    ],
    curveballs: [
      "A guest interrupts in the middle with a question",
      "Someone says the same thing happened to them and starts taking over",
      "A guest doesn't get the punchline and asks you to explain it"
    ],
    cultural_notes: "Swedish dinner-party storytelling is understated — self-deprecating humour ('jag kände mig som en idiot') gets bigger laughs than boasting.",
    suggested_vocab: ["det visade sig", "plötsligt", "pinsamt", "till slut", "mitt i alltihop", "skratta"],
    key_vocabulary: [
      {
        swedish: "det visade sig",
        english: "it turned out",
        example_sv: "Det visade sig att bussen gick åt helt fel håll.",
        example_en: "It turned out the bus was going in completely the wrong direction.",
        pronunciation_tip: "'Visade' — VEE-sa-de, long i-sound."
      },
      {
        swedish: "plötsligt",
        english: "suddenly",
        example_sv: "Plötsligt stod hela hotellpersonalen och tittade på mig.",
        example_en: "Suddenly the whole hotel staff stood there looking at me.",
        pronunciation_tip: "PLÖTS-ligt — the ö is like the vowel in 'fur'."
      },
      {
        swedish: "pinsamt",
        english: "embarrassing",
        example_sv: "Det var det mest pinsamma som hänt mig på en resa.",
        example_en: "It was the most embarrassing thing that's happened to me on a trip.",
        pronunciation_tip: "PIN-samt — stress on the first syllable."
      },
      {
        swedish: "till slut",
        english: "in the end, finally",
        example_sv: "Till slut fattade jag att jag stått i fel kö hela tiden.",
        example_en: "In the end I realized I'd been standing in the wrong queue the whole time.",
        pronunciation_tip: "Two short words, stress on 'slut'."
      },
      {
        swedish: "mitt i alltihop",
        english: "in the middle of it all",
        example_sv: "Och mitt i alltihop börjar det ösregna.",
        example_en: "And in the middle of it all it starts pouring down.",
        pronunciation_tip: "Said as one fast chunk: mitt-ee-ALL-ti-hop."
      },
      {
        swedish: "gapskratta",
        english: "to roar with laughter",
        example_sv: "Taxichauffören bara gapskrattade åt mig.",
        example_en: "The taxi driver just roared with laughter at me.",
        pronunciation_tip: "GAP-skrat-ta — hard g at the start."
      }
    ],
    key_phrases: [
      {
        situation_en: "Setting the scene",
        phrase_sv: "Det här var för några år sen, när jag och en kompis var i Lissabon.",
        phrase_en: "This was a few years ago, when a friend and I were in Lisbon.",
        pronunciation_tip: "'För några år sen' — 'sen' is the spoken form of 'sedan'."
      },
      {
        situation_en: "Building tension",
        phrase_sv: "Och det var då allting började gå fel, på riktigt.",
        phrase_en: "And that's when everything started going wrong, for real.",
        pronunciation_tip: "Slow down slightly here — you're building suspense."
      },
      {
        situation_en: "Holding the floor after an interruption",
        phrase_sv: "Vänta, vänta — det bästa kommer nu.",
        phrase_en: "Wait, wait — the best part is coming now.",
        pronunciation_tip: "Repeat 'vänta' quickly with a smile — it's playful, not rude."
      },
      {
        situation_en: "Landing the punchline",
        phrase_sv: "Och det visade sig att vi hade suttit på fel färja — i tre timmar.",
        phrase_en: "And it turned out we'd been sitting on the wrong ferry — for three hours.",
        pronunciation_tip: "Pause just before the last part for maximum effect."
      },
      {
        situation_en: "Wrapping up with self-irony",
        phrase_sv: "Så numera dubbelkollar jag biljetten ungefär fem gånger.",
        phrase_en: "So nowadays I double-check the ticket about five times.",
        pronunciation_tip: "'Numera' means 'these days' — nu-ME-ra."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Och det ___ sig att vi hade suttit på fel färja — i tre timmar.",
        prompt_en: "And it ___ out we'd been sitting on the wrong ferry — for three hours.",
        expected_answer_sv: "visade",
        expected_answer_en: "turned (it turned out)",
        options: ["visade", "kände", "tänkte", "hörde"],
        hint_en: "'Det ___ sig att…' is the classic storytelling reveal phrase.",
      },
      {
        type: "quick_response",
        prompt_sv: "Vänta, förlåt att jag avbryter — men var det där i Portugal eller Spanien?",
        prompt_en: "Wait, sorry to interrupt — but was that in Portugal or Spain?",
        expected_answer_sv: "I Portugal! Men vänta, det bästa kommer nu.",
        expected_answer_en: "In Portugal! But wait, the best part is coming now.",
        hint_en: "Answer briefly, then grab the floor back with 'det bästa kommer nu'.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Hehe… fast jag fattar inte riktigt — vad var det som var så roligt?",
        prompt_en: "Hehe… but I don't quite get it — what was so funny?",
        expected_answer_sv: "Alltså, vi trodde vi var på väg till stranden — men färjan gick till en industrihamn!",
        expected_answer_en: "Well, we thought we were on our way to the beach — but the ferry went to an industrial port!",
        hint_en: "Explain the punchline in one light sentence — keep the smile in your voice.",
        options: null
      }
    ]
  },

  "Diskutera film eller serie": {
    description_en: "Discuss a Netflix series over fika — describe it briefly, share your opinion, and back it up.",
    opener_sv: "Har du sett den där nya serien alla pratar om? Vi höll på att sträcktitta hela helgen. Vad tyckte du?",
    opener_en: "Have you seen that new series everyone is talking about? We almost binge-watched all weekend. What did you think?",
    goal: "Describe the show briefly, give a clear opinion, and support it with at least one concrete reason.",
    success_criteria: [
      "Describe the show in two or three sentences without spoiling it",
      "Give a clear opinion — what worked and what didn't",
      "Back your opinion with at least one concrete example"
    ],
    curveballs: [
      "Your friend loved the exact thing you disliked",
      "Your friend almost spoils the ending and you have to stop them",
      "Your friend asks you to recommend something similar"
    ],
    cultural_notes: "Fika conversations about series are a national pastime — asking 'har du kommit till avsnittet där…?' before revealing anything shows good spoiler etiquette.",
    suggested_vocab: ["handlingen", "ett avsnitt", "sträcktitta", "en rollfigur", "spoila", "överskattad"],
    key_vocabulary: [
      {
        swedish: "handlingen",
        english: "the plot",
        example_sv: "Handlingen är ganska seg i början men lyfter efter tredje avsnittet.",
        example_en: "The plot is quite slow at the start but takes off after episode three.",
        pronunciation_tip: "HAND-ling-en — stress on the first syllable."
      },
      {
        swedish: "ett avsnitt",
        english: "an episode",
        example_sv: "Sista avsnittet var faktiskt det bästa i hela serien.",
        example_en: "The last episode was actually the best in the whole series.",
        pronunciation_tip: "AV-snitt — short vowels, crisp t."
      },
      {
        swedish: "sträcktitta",
        english: "to binge-watch",
        example_sv: "Vi sträcktittade på hela säsongen på en helg.",
        example_en: "We binge-watched the whole season in one weekend.",
        pronunciation_tip: "STRECK-tit-ta — the ä sounds like short e."
      },
      {
        swedish: "en rollfigur",
        english: "a character",
        example_sv: "Huvudrollfiguren känns verkligen trovärdig.",
        example_en: "The main character feels really believable.",
        pronunciation_tip: "ROLL-fi-gur — stress at the front."
      },
      {
        swedish: "spoila",
        english: "to spoil (a plot)",
        example_sv: "Säg inget mer — du får inte spoila slutet!",
        example_en: "Don't say any more — you can't spoil the ending!",
        pronunciation_tip: "Borrowed from English: SPOJ-la."
      },
      {
        swedish: "överskattad",
        english: "overrated",
        example_sv: "Ärligt talat tycker jag att serien är lite överskattad.",
        example_en: "Honestly, I think the series is a bit overrated.",
        pronunciation_tip: "Ö-ver-SKAT-tad — stress on 'skat'."
      }
    ],
    key_phrases: [
      {
        situation_en: "Describing the show briefly",
        phrase_sv: "Det är en thriller om en familj som flyttar till en liten ö — mer vill jag inte avslöja.",
        phrase_en: "It's a thriller about a family that moves to a small island — I don't want to reveal more.",
        pronunciation_tip: "'Avslöja' — stress in the middle: av-SLÖ-ja."
      },
      {
        situation_en: "Giving a mixed opinion",
        phrase_sv: "Jag tyckte den var sevärd, men slutet kändes lite för stressat.",
        phrase_en: "I thought it was worth watching, but the ending felt a bit too rushed.",
        pronunciation_tip: "'Sevärd' = worth seeing: SE-värd."
      },
      {
        situation_en: "Backing up your opinion",
        phrase_sv: "Framför allt är skådespeleriet grymt — särskilt hon som spelar mamman.",
        phrase_en: "Above all, the acting is brilliant — especially the woman who plays the mother.",
        pronunciation_tip: "'Grymt' literally means 'cruel' but is slang for 'awesome'."
      },
      {
        situation_en: "Stopping a spoiler",
        phrase_sv: "Nej nej, säg inget mer — jag har bara sett tre avsnitt!",
        phrase_en: "No no, don't say any more — I've only seen three episodes!",
        pronunciation_tip: "Say it fast and with a laugh — it's playful panic."
      },
      {
        situation_en: "Disagreeing about taste",
        phrase_sv: "Kul att du gillade det — för mig var det tvärtom det svagaste i serien.",
        phrase_en: "Glad you liked it — for me it was, on the contrary, the weakest part of the series.",
        pronunciation_tip: "'Tvärtom' = the opposite: TVÄRT-om."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Nej nej, säg inget mer — du får inte ___ slutet!",
        prompt_en: "No no, don't say any more — you can't ___ the ending!",
        expected_answer_sv: "spoila",
        expected_answer_en: "spoil",
        options: ["spoila", "glömma", "gissa", "ändra"],
        hint_en: "The English loanword Swedes use about ruining a plot.",
      },
      {
        type: "quick_response",
        prompt_sv: "Va, tyckte du inte om slutet? Det var ju det bästa i hela serien!",
        prompt_en: "What, you didn't like the ending? That was the best thing in the whole series!",
        expected_answer_sv: "Kul att du gillade det! För mig kändes det för stressat — allt löste sig på fem minuter.",
        expected_answer_en: "Glad you liked it! For me it felt too rushed — everything got resolved in five minutes.",
        hint_en: "Disagree in a friendly way and give your concrete reason.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Om jag gillade den här serien — har du nåt liknande att rekommendera?",
        prompt_en: "If I liked this series — do you have anything similar to recommend?",
        expected_answer_sv: "Absolut, då tror jag att du skulle gilla Bron — samma mörka stämning men ännu bättre rollfigurer.",
        expected_answer_en: "Absolutely, then I think you'd like The Bridge — the same dark mood but even better characters.",
        hint_en: "Name one show and say in one phrase why it's similar.",
        options: null
      }
    ]
  },

  "Boka mäklarvisning": {
    description_en: "Call a real estate agent about an apartment you saw on Hemnet, ask detail questions, and book a viewing.",
    opener_sv: "Svensson Mäkleri, det här är Anna. Hej, vad kan jag hjälpa dig med?",
    opener_en: "Svensson Real Estate, this is Anna. Hi, how can I help you?",
    goal: "Book a viewing of the apartment, ask at least two detail questions, and confirm the time.",
    success_criteria: [
      "Say which apartment you are calling about and ask for a viewing",
      "Ask at least two detail questions, e.g. about fees or the building",
      "Confirm the viewing time clearly before hanging up"
    ],
    curveballs: [
      "The public viewing is fully booked and only a private slot is possible",
      "The agent mentions a planned renovation with a fee increase",
      "The agent asks if you have a mortgage pre-approval ('lånelöfte')"
    ],
    cultural_notes: "Swedish apartment hunting runs through Hemnet and fast bidding — asking about 'avgiften' and the association's finances signals you're a serious buyer.",
    suggested_vocab: ["en visning", "avgiften", "föreningen", "ett lånelöfte", "utgångspris", "ett stambyte"],
    key_vocabulary: [
      {
        swedish: "en visning",
        english: "a viewing",
        example_sv: "Jag ringer angående visningen av tvåan på Storgatan.",
        example_en: "I'm calling about the viewing of the two-room flat on Storgatan.",
        pronunciation_tip: "VEES-ning — long i-sound."
      },
      {
        swedish: "avgiften",
        english: "the monthly fee",
        example_sv: "Hur hög är avgiften till föreningen per månad?",
        example_en: "How high is the monthly fee to the association?",
        pronunciation_tip: "AV-yif-ten — the g is soft, like y."
      },
      {
        swedish: "föreningen",
        english: "the housing association",
        example_sv: "Hur ser föreningens ekonomi ut?",
        example_en: "What do the association's finances look like?",
        pronunciation_tip: "för-E-ning-en — stress on the second syllable."
      },
      {
        swedish: "ett lånelöfte",
        english: "a mortgage pre-approval",
        example_sv: "Jag har redan ett lånelöfte från banken.",
        example_en: "I already have a pre-approval from the bank.",
        pronunciation_tip: "LÅ-ne-löf-te — two long vowels at the start."
      },
      {
        swedish: "utgångspris",
        english: "asking price",
        example_sv: "Tror du att den går över utgångspriset?",
        example_en: "Do you think it will go above the asking price?",
        pronunciation_tip: "UT-gångs-pris — stress at the front."
      },
      {
        swedish: "ett stambyte",
        english: "a pipe replacement (major renovation)",
        example_sv: "Är det något stambyte planerat i huset?",
        example_en: "Is any pipe replacement planned in the building?",
        pronunciation_tip: "STAM-by-te — y like French 'u'."
      }
    ],
    key_phrases: [
      {
        situation_en: "Explaining why you are calling",
        phrase_sv: "Hej! Jag ringer angående tvåan på Storgatan 14 som ligger ute på Hemnet.",
        phrase_en: "Hi! I'm calling about the two-room flat at Storgatan 14 that's listed on Hemnet.",
        pronunciation_tip: "'Angående' = regarding: an-GÅ-en-de."
      },
      {
        situation_en: "Asking for a viewing",
        phrase_sv: "Finns det någon visning inplanerad, och går det att boka en tid?",
        phrase_en: "Is there a viewing scheduled, and is it possible to book a slot?",
        pronunciation_tip: "'Inplanerad' — stress: IN-pla-ne-rad."
      },
      {
        situation_en: "Asking about the association's finances",
        phrase_sv: "Hur ser föreningens ekonomi ut — är det några stora renoveringar på gång?",
        phrase_en: "What do the association's finances look like — are there any big renovations coming up?",
        pronunciation_tip: "'På gång' = coming up, in the works."
      },
      {
        situation_en: "Responding to the lånelöfte question",
        phrase_sv: "Ja, jag har ett lånelöfte klart hos banken sen förra veckan.",
        phrase_en: "Yes, I have a pre-approval ready with the bank since last week.",
        pronunciation_tip: "'Sen' = since (spoken form of 'sedan')."
      },
      {
        situation_en: "Confirming the time",
        phrase_sv: "Då säger vi söndag klockan tre — jag har bokat in det. Tack så mycket!",
        phrase_en: "Then we'll say Sunday at three — I've put it in my calendar. Thanks a lot!",
        pronunciation_tip: "'Då säger vi…' is the standard phrase for locking in a time."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Hur hög är ___ till föreningen per månad?",
        prompt_en: "How high is the monthly ___ to the association?",
        expected_answer_sv: "avgiften",
        expected_answer_en: "fee",
        options: ["avgiften", "hyran", "räntan", "skatten"],
        hint_en: "What you pay monthly to a bostadsrättsförening — not rent.",
      },
      {
        type: "quick_response",
        prompt_sv: "Tyvärr är söndagens visning fullbokad, men jag kan erbjuda en privat visning på måndag kväll.",
        prompt_en: "Unfortunately Sunday's viewing is fully booked, but I can offer a private viewing on Monday evening.",
        expected_answer_sv: "Det låter bra — måndag kväll funkar. Vilken tid passar dig?",
        expected_answer_en: "That sounds good — Monday evening works. What time suits you?",
        hint_en: "Accept the alternative and nail down the time.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Jag ska bara fråga — har du ett lånelöfte från banken redan?",
        prompt_en: "Just to ask — do you already have a mortgage pre-approval from the bank?",
        expected_answer_sv: "Ja, jag har ett lånelöfte klart sen förra veckan, så jag kan lägga bud direkt.",
        expected_answer_en: "Yes, I have a pre-approval ready since last week, so I can bid right away.",
        hint_en: "Answer confidently — it shows you're a serious buyer.",
        options: null
      }
    ]
  }
};
