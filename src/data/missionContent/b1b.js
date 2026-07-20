// Auto-generated mission content. Schema: src/lib/missionPrompt.js
// B1 missions, orders 316+. Keyed by title_sv (must match src/data/missionCatalog.js exactly).
export const MISSION_CONTENT_B1B = {
  "Diskutera med kollega om projekt": {
    description_en: "Disagree politely with a colleague about a project plan and land on a compromise.",
    opener_sv: "Du, jag har tänkt på projektet. Jag tycker att vi borde skjuta upp lanseringen till efter sommaren. Vad säger du?",
    opener_en: "Hey, I've been thinking about the project. I think we should postpone the launch until after the summer. What do you say?",
    goal: "Listen to your colleague's suggestion, disagree politely, and propose a compromise you both can accept.",
    success_criteria: [
      "Show you have understood the colleague's suggestion before responding",
      "Disagree politely with at least one clear reason",
      "Propose a concrete compromise and get agreement on a next step"
    ],
    curveballs: [
      "Svea says the boss already likes her idea",
      "Svea asks you to decide right now, today",
      "Svea gets slightly annoyed and asks why you always say no"
    ],
    cultural_notes: "Swedish workplaces value consensus, so soften disagreement with phrases like 'jag förstår hur du tänker, men...' instead of a blunt no.",
    suggested_vocab: ["skjuta upp", "en deadline", "ett förslag", "en kompromiss", "hålla med", "å ena sidan"],
    key_vocabulary: [
      {
        swedish: "ett förslag",
        english: "a suggestion, a proposal",
        example_sv: "Det är ett intressant förslag, men jag ser ett problem.",
        example_en: "That's an interesting suggestion, but I see one problem.",
        pronunciation_tip: "Stress on the second syllable: för-SLAG."
      },
      {
        swedish: "skjuta upp",
        english: "to postpone",
        example_sv: "Jag vill inte skjuta upp lanseringen igen.",
        example_en: "I don't want to postpone the launch again.",
        pronunciation_tip: "'Skj' sounds like a soft 'hw/sh' sound: 'hwoo-ta'."
      },
      {
        swedish: "hålla med",
        english: "to agree",
        example_sv: "Jag håller med om första delen, men inte resten.",
        example_en: "I agree with the first part, but not the rest.",
        pronunciation_tip: "Long 'å' in 'hålla', like 'o' in 'or'."
      },
      {
        swedish: "en kompromiss",
        english: "a compromise",
        example_sv: "Kan vi hitta en kompromiss som funkar för båda?",
        example_en: "Can we find a compromise that works for both of us?",
        pronunciation_tip: "Stress on the last syllable: kompro-MISS."
      },
      {
        swedish: "en tidsplan",
        english: "a schedule, a timeline",
        example_sv: "Tidsplanen är redan väldigt tajt.",
        example_en: "The timeline is already very tight.",
        pronunciation_tip: "Say it as two words glued together: TIDS-plan."
      },
      {
        swedish: "en nackdel",
        english: "a disadvantage, a downside",
        example_sv: "En nackdel är att kunden får vänta längre.",
        example_en: "One downside is that the customer has to wait longer.",
        pronunciation_tip: "Stress on the first syllable: NACK-del."
      }
    ],
    key_phrases: [
      {
        situation_en: "Showing you understood before disagreeing",
        phrase_sv: "Jag förstår hur du tänker, men jag ser det lite annorlunda.",
        phrase_en: "I understand your thinking, but I see it a bit differently.",
        pronunciation_tip: "'Annorlunda' has stress on the first syllable: AN-nor-lun-da."
      },
      {
        situation_en: "Disagreeing politely",
        phrase_sv: "Jag håller inte riktigt med där, faktiskt.",
        phrase_en: "I don't quite agree there, actually.",
        pronunciation_tip: "'Riktigt' is often said 'RIK-tit' in fast speech."
      },
      {
        situation_en: "Giving your reason",
        phrase_sv: "Problemet är att kunden redan väntar på leveransen.",
        phrase_en: "The problem is that the customer is already waiting for the delivery.",
        pronunciation_tip: "Stress 'PRO-blemet' lightly, keep the sentence flowing."
      },
      {
        situation_en: "Proposing a compromise",
        phrase_sv: "Kan vi inte göra så här i stället: vi behåller datumet men minskar omfattningen?",
        phrase_en: "Couldn't we do this instead: we keep the date but reduce the scope?",
        pronunciation_tip: "'I stället' is said as one unit: 'ee-STEL-let'."
      },
      {
        situation_en: "Confirming the agreement",
        phrase_sv: "Så vi är överens om att testa det här först?",
        phrase_en: "So we agree to try this first?",
        pronunciation_tip: "'Överens' has stress on the last syllable: ö-ver-ENS."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Jag förstår hur du tänker, men jag håller inte riktigt ___.",
        prompt_en: "I understand your thinking, but I don't quite ___.",
        expected_answer_sv: "med",
        expected_answer_en: "agree (lit. 'with')",
        options: ["med", "till", "om", "på"],
        hint_en: "The verb is 'hålla med' — to agree.",
      },
      {
        type: "quick_response",
        prompt_sv: "Chefen gillar redan min idé, så det är nog bäst att vi kör på den.",
        prompt_en: "The boss already likes my idea, so it's probably best we go with it.",
        expected_answer_sv: "Okej, men jag vill ändå lyfta mitt förslag med chefen innan vi bestämmer oss.",
        expected_answer_en: "Okay, but I'd still like to raise my suggestion with the boss before we decide.",
        hint_en: "Stay calm — ask that your idea is heard before the decision.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Kan vi inte bara bestämma det här nu, direkt?",
        prompt_en: "Can't we just decide this now, right away?",
        expected_answer_sv: "Jag vill hellre fundera till i morgon, så vi tar ett bra beslut.",
        expected_answer_en: "I'd rather think about it until tomorrow, so we make a good decision.",
        hint_en: "Politely buy time — suggest deciding tomorrow instead.",
        options: null
      }
    ]
  },

  "Boka bilverkstad": {
    description_en: "Call a car workshop, describe a strange noise, and book a time with a price estimate.",
    opener_sv: "Bergs bilverkstad, det är Micke. Hur kan jag hjälpa dig?",
    opener_en: "Berg's car workshop, this is Micke. How can I help you?",
    goal: "Describe the noise your car makes, book a workshop slot, and get a rough price estimate.",
    success_criteria: [
      "Describe the noise: what it sounds like and when it happens",
      "Book a specific day and time for the workshop visit",
      "Ask what it might cost and how long it will take"
    ],
    curveballs: [
      "Micke asks what car model and year you have",
      "The first suggested time doesn't work — you must ask for another",
      "Micke says they may need to keep the car overnight"
    ],
    cultural_notes: "Swedish workshops usually give a rough estimate ('prisuppskattning') by phone but confirm the real price only after inspecting the car.",
    suggested_vocab: ["ett ljud", "bromsarna", "lämna in bilen", "en prisuppskattning", "hämta", "det låter som"],
    key_vocabulary: [
      {
        swedish: "ett ljud",
        english: "a sound, a noise",
        example_sv: "Det kommer ett konstigt ljud när jag bromsar.",
        example_en: "There's a strange noise when I brake.",
        pronunciation_tip: "The 'lj' is silent 'l': say 'yood'."
      },
      {
        swedish: "bromsa",
        english: "to brake",
        example_sv: "Ljudet hörs bara när jag bromsar.",
        example_en: "The noise is only heard when I brake.",
        pronunciation_tip: "Short 'o', like 'brom-sa'."
      },
      {
        swedish: "lämna in",
        english: "to drop off (a car for service)",
        example_sv: "Kan jag lämna in bilen på torsdag morgon?",
        example_en: "Can I drop off the car on Thursday morning?",
        pronunciation_tip: "Stress 'LÄM-na', 'in' is short and clear."
      },
      {
        swedish: "en verkstad",
        english: "a workshop, a garage",
        example_sv: "Jag har aldrig varit på den här verkstaden förut.",
        example_en: "I've never been to this workshop before.",
        pronunciation_tip: "Stress on the first syllable: VERK-stad."
      },
      {
        swedish: "en prisuppskattning",
        english: "a price estimate",
        example_sv: "Kan du ge mig en ungefärlig prisuppskattning?",
        example_en: "Can you give me a rough price estimate?",
        pronunciation_tip: "Break it up: pris-UPP-skatt-ning."
      },
      {
        swedish: "hämta",
        english: "to pick up",
        example_sv: "När kan jag hämta bilen igen?",
        example_en: "When can I pick up the car again?",
        pronunciation_tip: "'Ä' like 'e' in 'hem': 'HEM-ta'."
      }
    ],
    key_phrases: [
      {
        situation_en: "Explaining why you are calling",
        phrase_sv: "Hej, jag ringer för att min bil låter konstigt och jag skulle vilja boka en tid.",
        phrase_en: "Hi, I'm calling because my car sounds strange and I'd like to book a time.",
        pronunciation_tip: "'Konstigt' is said 'KON-stit' — the 'g' softens."
      },
      {
        situation_en: "Describing the noise",
        phrase_sv: "Det låter som ett gnisslande ljud framifrån när jag bromsar.",
        phrase_en: "It sounds like a squeaking noise from the front when I brake.",
        pronunciation_tip: "'Gnisslande' — pronounce the 'g': 'g-NISS-lan-de'."
      },
      {
        situation_en: "Asking for a time",
        phrase_sv: "Har ni någon tid i början av nästa vecka?",
        phrase_en: "Do you have any time early next week?",
        pronunciation_tip: "'Någon' is usually said 'NÅN' in speech."
      },
      {
        situation_en: "Asking about the price",
        phrase_sv: "Ungefär vad kan det kosta, tror du?",
        phrase_en: "Roughly what could it cost, do you think?",
        pronunciation_tip: "'Ungefär' has stress at the end: un-ge-FÄR."
      },
      {
        situation_en: "Confirming the booking",
        phrase_sv: "Perfekt, då lämnar jag in bilen på tisdag klockan åtta.",
        phrase_en: "Perfect, then I'll drop off the car on Tuesday at eight.",
        pronunciation_tip: "'Åtta' has a long 'å' and hard double 't': 'OT-ta'."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Det låter som ett konstigt ljud när jag ___.",
        prompt_en: "It sounds like a strange noise when I ___.",
        expected_answer_sv: "bromsar",
        expected_answer_en: "brake",
        options: ["bromsar", "tankar", "parkerar", "tvättar"],
        hint_en: "The noise comes when you slow the car down.",
      },
      {
        type: "quick_response",
        prompt_sv: "Vad är det för bil? Märke och årsmodell?",
        prompt_en: "What car is it? Make and model year?",
        expected_answer_sv: "Det är en Volvo V60 från 2018.",
        expected_answer_en: "It's a Volvo V60 from 2018.",
        hint_en: "Give the make and the year — any car works.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Vi kan behöva ha kvar bilen över natten. Funkar det?",
        prompt_en: "We may need to keep the car overnight. Does that work?",
        expected_answer_sv: "Det är okej, men kan ni ringa mig när den är klar?",
        expected_answer_en: "That's okay, but can you call me when it's ready?",
        hint_en: "Accept, but ask them to call you when the car is done.",
        options: null
      }
    ]
  },

  "Reklamera en produkt online": {
    description_en: "Call customer service about a wrong item from an online order and arrange a return.",
    opener_sv: "Hej och välkommen till kundtjänst, du pratar med Svea. Vad kan jag hjälpa dig med?",
    opener_en: "Hi and welcome to customer service, you're speaking with Svea. What can I help you with?",
    goal: "Explain that you received the wrong item, request a solution, and confirm how the return works.",
    success_criteria: [
      "Explain clearly what you ordered and what you actually received",
      "Ask for a solution: the right item, or your money back",
      "Confirm the return process and when you get a refund"
    ],
    curveballs: [
      "Svea asks for your order number",
      "Svea offers a discount code instead of a refund",
      "Svea says the right item is out of stock"
    ],
    cultural_notes: "In Sweden the word 'reklamera' means complaining about a faulty or wrong product — it is your legal right under konsumentköplagen, so you can be firm but stay polite.",
    suggested_vocab: ["beställa", "fel vara", "ett ordernummer", "skicka tillbaka", "pengarna tillbaka", "en retursedel"],
    key_vocabulary: [
      {
        swedish: "beställa",
        english: "to order",
        example_sv: "Jag beställde en blå jacka förra veckan.",
        example_en: "I ordered a blue jacket last week.",
        pronunciation_tip: "Stress on the second syllable: be-STÄL-la."
      },
      {
        swedish: "reklamera",
        english: "to file a complaint about a product",
        example_sv: "Jag vill reklamera en vara jag fick i går.",
        example_en: "I want to make a complaint about an item I received yesterday.",
        pronunciation_tip: "Stress near the end: re-kla-ME-ra."
      },
      {
        swedish: "ett ordernummer",
        english: "an order number",
        example_sv: "Mitt ordernummer är 45832.",
        example_en: "My order number is 45832.",
        pronunciation_tip: "Say it as one long word: OR-der-num-mer."
      },
      {
        swedish: "en återbetalning",
        english: "a refund",
        example_sv: "När får jag min återbetalning?",
        example_en: "When do I get my refund?",
        pronunciation_tip: "'Åter' has a long 'å': 'OH-ter-be-tal-ning'."
      },
      {
        swedish: "skicka tillbaka",
        english: "to send back",
        example_sv: "Hur skickar jag tillbaka den felaktiga varan?",
        example_en: "How do I send back the wrong item?",
        pronunciation_tip: "'Skicka' has a soft 'sh' start: 'SHIK-ka'."
      },
      {
        swedish: "en retursedel",
        english: "a return slip",
        example_sv: "Kan ni mejla mig en retursedel?",
        example_en: "Can you email me a return slip?",
        pronunciation_tip: "Stress: re-TUR-se-del."
      }
    ],
    key_phrases: [
      {
        situation_en: "Explaining why you are calling",
        phrase_sv: "Hej, jag ringer för att jag har fått fel vara i min beställning.",
        phrase_en: "Hi, I'm calling because I received the wrong item in my order.",
        pronunciation_tip: "'Beställning' — stress the middle: be-STÄLL-ning."
      },
      {
        situation_en: "Saying what you ordered vs. what arrived",
        phrase_sv: "Jag beställde en blå jacka i storlek medium, men fick en röd i small.",
        phrase_en: "I ordered a blue jacket in size medium, but got a red one in small.",
        pronunciation_tip: "'Storlek' — stress the first syllable: STOR-lek."
      },
      {
        situation_en: "Asking for a solution",
        phrase_sv: "Jag vill helst ha rätt vara skickad till mig, annars vill jag ha pengarna tillbaka.",
        phrase_en: "I'd prefer to have the right item sent to me, otherwise I want my money back.",
        pronunciation_tip: "'Helst' is short and sharp — one quick syllable."
      },
      {
        situation_en: "Politely declining an offer you don't want",
        phrase_sv: "Tack, men en rabattkod räcker inte — jag vill ha en återbetalning.",
        phrase_en: "Thanks, but a discount code isn't enough — I want a refund.",
        pronunciation_tip: "'Räcker' — 'ä' like in 'best': 'REK-ker'."
      },
      {
        situation_en: "Confirming the return process",
        phrase_sv: "Så jag skickar tillbaka varan med retursedeln, och sen får jag pengarna inom en vecka?",
        phrase_en: "So I send the item back with the return slip, and then I get the money within a week?",
        pronunciation_tip: "Keep the question tone rising at the end — you're confirming."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Jag ringer för att jag har fått ___ vara i min beställning.",
        prompt_en: "I'm calling because I received the ___ item in my order.",
        expected_answer_sv: "fel",
        expected_answer_en: "wrong",
        options: ["fel", "rätt", "billig", "trasig"],
        hint_en: "The item was not what you ordered.",
      },
      {
        type: "quick_response",
        prompt_sv: "Absolut, jag ska hjälpa dig. Har du ditt ordernummer?",
        prompt_en: "Of course, I'll help you. Do you have your order number?",
        expected_answer_sv: "Ja, det är 45832.",
        expected_answer_en: "Yes, it's 45832.",
        hint_en: "Just give the number — read it clearly.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Jag kan tyvärr inte skicka rätt vara — den är slut i lager. Men jag kan erbjuda en rabattkod?",
        prompt_en: "Unfortunately I can't send the right item — it's out of stock. But I can offer a discount code?",
        expected_answer_sv: "Nej tack, då vill jag hellre ha pengarna tillbaka.",
        expected_answer_en: "No thanks, then I'd rather have my money back.",
        hint_en: "Decline politely and ask for a refund instead.",
        options: null
      }
    ]
  },

  "Ringa Arbetsförmedlingen": {
    description_en: "Call the Swedish employment agency to ask about a course, your eligibility, and how to apply.",
    opener_sv: "Arbetsförmedlingen, du pratar med Svea. Vad gäller ditt samtal?",
    opener_en: "The Employment Agency, you're speaking with Svea. What is your call regarding?",
    goal: "Ask about the course you saw, find out if you qualify, and note the application deadline.",
    success_criteria: [
      "Explain which course you are calling about and why",
      "Ask whether you are eligible and what the requirements are",
      "Find out how to apply and note the deadline"
    ],
    curveballs: [
      "Svea asks if you are registered ('inskriven') at Arbetsförmedlingen",
      "Svea says the course requires B1 Swedish and asks about your level",
      "Svea mentions the deadline is this Friday"
    ],
    cultural_notes: "Calls to Swedish authorities are informal — everyone says 'du', and it's completely normal to ask the officer to repeat or slow down.",
    suggested_vocab: ["en utbildning", "inskriven", "ansöka", "ett krav", "en sista ansökningsdag", "arbetslös"],
    key_vocabulary: [
      {
        swedish: "en utbildning",
        english: "a training programme, an education",
        example_sv: "Jag såg en utbildning till busschaufför på er hemsida.",
        example_en: "I saw a training programme for bus drivers on your website.",
        pronunciation_tip: "Stress the second syllable: ut-BILD-ning."
      },
      {
        swedish: "inskriven",
        english: "registered (at the agency)",
        example_sv: "Jag har varit inskriven sedan i mars.",
        example_en: "I've been registered since March.",
        pronunciation_tip: "Stress the first part: IN-skri-ven."
      },
      {
        swedish: "ansöka",
        english: "to apply",
        example_sv: "Hur gör jag för att ansöka till kursen?",
        example_en: "How do I apply for the course?",
        pronunciation_tip: "Stress: AN-sö-ka, long 'ö'."
      },
      {
        swedish: "ett krav",
        english: "a requirement",
        example_sv: "Vilka krav finns det för att komma in?",
        example_en: "What requirements are there to get in?",
        pronunciation_tip: "One short syllable, long 'a': 'krahv'."
      },
      {
        swedish: "arbetslös",
        english: "unemployed",
        example_sv: "Jag är arbetslös just nu och letar jobb.",
        example_en: "I'm unemployed right now and looking for work.",
        pronunciation_tip: "Stress first and last: AR-bets-LÖS."
      },
      {
        swedish: "en sista ansökningsdag",
        english: "an application deadline",
        example_sv: "När är sista ansökningsdag för kursen?",
        example_en: "When is the application deadline for the course?",
        pronunciation_tip: "Long compound — break it: an-SÖK-nings-dag."
      }
    ],
    key_phrases: [
      {
        situation_en: "Explaining why you are calling",
        phrase_sv: "Hej, jag ringer angående en utbildning jag såg på er hemsida.",
        phrase_en: "Hi, I'm calling about a training programme I saw on your website.",
        pronunciation_tip: "'Angående' — stress the middle: an-GÅ-en-de."
      },
      {
        situation_en: "Asking about eligibility",
        phrase_sv: "Kan jag söka den utbildningen, eller finns det särskilda krav?",
        phrase_en: "Can I apply for that programme, or are there special requirements?",
        pronunciation_tip: "'Särskilda' is often said 'SÄR-shil-da'."
      },
      {
        situation_en: "Describing your situation",
        phrase_sv: "Jag är inskriven hos er sedan i våras och söker jobb aktivt.",
        phrase_en: "I've been registered with you since this spring and I'm actively looking for work.",
        pronunciation_tip: "'Sedan' is usually shortened to 'sen' in speech."
      },
      {
        situation_en: "Asking how to apply",
        phrase_sv: "Hur ansöker jag — gör jag det på webben eller via min handläggare?",
        phrase_en: "How do I apply — do I do it online or through my case officer?",
        pronunciation_tip: "'Handläggare' — stress first syllable: HAND-läg-ga-re."
      },
      {
        situation_en: "Noting the deadline",
        phrase_sv: "Okej, sista ansökningsdag är på fredag — det antecknar jag.",
        phrase_en: "Okay, the application deadline is Friday — I'll note that down.",
        pronunciation_tip: "'Antecknar' — stress the second syllable: an-TECK-nar."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Hej, jag ringer ___ en utbildning jag såg på er hemsida.",
        prompt_en: "Hi, I'm calling ___ a training programme I saw on your website.",
        expected_answer_sv: "angående",
        expected_answer_en: "regarding",
        options: ["angående", "eftersom", "istället", "förutom"],
        hint_en: "A formal-but-common word for 'about/regarding' on the phone.",
      },
      {
        type: "quick_response",
        prompt_sv: "Är du inskriven hos oss på Arbetsförmedlingen?",
        prompt_en: "Are you registered with us at the Employment Agency?",
        expected_answer_sv: "Ja, jag har varit inskriven sedan i mars.",
        expected_answer_en: "Yes, I've been registered since March.",
        hint_en: "Say yes and since when.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Kursen kräver svenska på B1-nivå. Hur ser det ut för dig?",
        prompt_en: "The course requires Swedish at B1 level. How does that look for you?",
        expected_answer_sv: "Det går bra — jag läser svenska nu och ligger på B1-nivå.",
        expected_answer_en: "That's fine — I'm studying Swedish now and I'm at B1 level.",
        hint_en: "Confirm your level with confidence.",
        options: null
      }
    ]
  },

  "Fråga om barnbidrag": {
    description_en: "Call Försäkringskassan to ask when child benefit will be paid after moving to Sweden.",
    opener_sv: "Försäkringskassan, du pratar med Svea. Hur kan jag hjälpa dig?",
    opener_en: "The Social Insurance Agency, you're speaking with Svea. How can I help you?",
    goal: "Explain that you recently moved to Sweden and find out what you need to send in to receive child benefit.",
    success_criteria: [
      "Explain your situation: you moved to Sweden with your child",
      "Ask when the child benefit will start being paid",
      "Understand and repeat back which documents you need to send in"
    ],
    curveballs: [
      "Svea asks for your personnummer",
      "Svea says your case is missing a document",
      "Svea explains the money goes automatically to one parent's account"
    ],
    cultural_notes: "Barnbidrag is paid automatically to most families in Sweden without applying, but newcomers must first be registered as insured with Försäkringskassan.",
    suggested_vocab: ["barnbidrag", "ett personnummer", "flytta till", "ett intyg", "en handläggningstid", "utbetalning"],
    key_vocabulary: [
      {
        swedish: "barnbidrag",
        english: "child benefit",
        example_sv: "Jag undrar när barnbidraget börjar betalas ut.",
        example_en: "I'm wondering when the child benefit starts being paid.",
        pronunciation_tip: "Stress: BARN-bi-drag."
      },
      {
        swedish: "ett personnummer",
        english: "a personal identity number",
        example_sv: "Mitt barn har fått sitt personnummer nu.",
        example_en: "My child has received their personal identity number now.",
        pronunciation_tip: "Stress: per-SON-num-mer."
      },
      {
        swedish: "ett intyg",
        english: "a certificate, a document proving something",
        example_sv: "Behöver ni något intyg från mig?",
        example_en: "Do you need any certificate from me?",
        pronunciation_tip: "Stress the second syllable: in-TYG."
      },
      {
        swedish: "en utbetalning",
        english: "a payment (paid out to you)",
        example_sv: "När kommer den första utbetalningen?",
        example_en: "When does the first payment come?",
        pronunciation_tip: "Stress: UT-be-tal-ning."
      },
      {
        swedish: "en handläggningstid",
        english: "a processing time",
        example_sv: "Hur lång är handläggningstiden just nu?",
        example_en: "How long is the processing time right now?",
        pronunciation_tip: "Break it up: hand-LÄGG-nings-tid."
      },
      {
        swedish: "försäkrad",
        english: "insured (covered by the system)",
        example_sv: "Räknas jag som försäkrad i Sverige nu?",
        example_en: "Do I count as insured in Sweden now?",
        pronunciation_tip: "Stress the middle: för-SÄK-rad."
      }
    ],
    key_phrases: [
      {
        situation_en: "Explaining your situation",
        phrase_sv: "Hej, jag flyttade till Sverige i april med min dotter, och jag undrar över barnbidraget.",
        phrase_en: "Hi, I moved to Sweden in April with my daughter, and I'm wondering about the child benefit.",
        pronunciation_tip: "'Undrar' — short 'u', stress first syllable: UN-drar."
      },
      {
        situation_en: "Asking when payment starts",
        phrase_sv: "När kan vi räkna med den första utbetalningen?",
        phrase_en: "When can we expect the first payment?",
        pronunciation_tip: "'Räkna med' means 'count on/expect' — say it as one chunk."
      },
      {
        situation_en: "Asking what you need to send in",
        phrase_sv: "Behöver jag skicka in några papper, eller sker allt automatiskt?",
        phrase_en: "Do I need to send in any papers, or does everything happen automatically?",
        pronunciation_tip: "'Sker' has a soft 'sh' start: 'shair'."
      },
      {
        situation_en: "Checking you understood",
        phrase_sv: "Bara så jag förstår rätt: jag ska skicka in ett intyg om att vi bor här?",
        phrase_en: "Just so I understand correctly: I should send in a certificate that we live here?",
        pronunciation_tip: "Rising tone at the end — you're double-checking."
      },
      {
        situation_en: "Asking about processing time",
        phrase_sv: "Ungefär hur lång tid tar det innan ni har fattat ett beslut?",
        phrase_en: "Roughly how long does it take before you've made a decision?",
        pronunciation_tip: "'Beslut' — stress the last syllable: be-SLUT."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "När kommer den första ___ av barnbidraget?",
        prompt_en: "When does the first ___ of the child benefit come?",
        expected_answer_sv: "utbetalningen",
        expected_answer_en: "payment",
        options: ["utbetalningen", "ansökan", "räkningen", "blanketten"],
        hint_en: "The money being paid out to you.",
      },
      {
        type: "quick_response",
        prompt_sv: "Kan jag få ditt personnummer, tack?",
        prompt_en: "Can I have your personal identity number, please?",
        expected_answer_sv: "Ja, det är 850412-1234.",
        expected_answer_en: "Yes, it's 850412-1234.",
        hint_en: "Give the number slowly and clearly.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Jag ser att det saknas ett intyg i ditt ärende. Kan du skicka in det?",
        prompt_en: "I see a certificate is missing in your case. Can you send it in?",
        expected_answer_sv: "Absolut. Vilket intyg är det, och vart ska jag skicka det?",
        expected_answer_en: "Of course. Which certificate is it, and where should I send it?",
        hint_en: "Agree, then ask which document and where to send it.",
        options: null
      }
    ]
  },

  "Klaga hos hyresvärden om mögel": {
    description_en: "Call your landlord about mould in the bathroom and demand an inspection.",
    opener_sv: "Hej, det är Svea på fastighetskontoret. Vad kan jag hjälpa dig med?",
    opener_en: "Hi, this is Svea at the property office. What can I help you with?",
    goal: "Describe the mould problem clearly, request an inspection, and agree on a date for the visit.",
    success_criteria: [
      "Describe the problem: where the mould is and how long it has been there",
      "Firmly request an inspection of the bathroom",
      "Agree on a concrete date and time for the visit"
    ],
    curveballs: [
      "Svea suggests you just clean it yourself with mould spray",
      "Svea says the first available time is in three weeks",
      "Svea asks if you have ventilated the bathroom properly"
    ],
    cultural_notes: "Swedish tenants have strong legal rights — landlords must fix mould, and mentioning a report to 'hyresnämnden' (the rent tribunal) is the polite-but-serious escalation.",
    suggested_vocab: ["mögel", "en hyresvärd", "en besiktning", "fukt", "i taket", "åtgärda"],
    key_vocabulary: [
      {
        swedish: "mögel",
        english: "mould",
        example_sv: "Det växer mögel i taket i badrummet.",
        example_en: "Mould is growing on the bathroom ceiling.",
        pronunciation_tip: "'Mö-gel' — 'ö' like the vowel in 'fur'."
      },
      {
        swedish: "en hyresvärd",
        english: "a landlord",
        example_sv: "Jag har försökt nå min hyresvärd hela veckan.",
        example_en: "I've been trying to reach my landlord all week.",
        pronunciation_tip: "Stress: HY-res-värd."
      },
      {
        swedish: "en besiktning",
        english: "an inspection",
        example_sv: "Jag vill att ni gör en besiktning så snart som möjligt.",
        example_en: "I want you to do an inspection as soon as possible.",
        pronunciation_tip: "Stress the middle: be-SIKT-ning."
      },
      {
        swedish: "fukt",
        english: "moisture, damp",
        example_sv: "Det känns som att det finns fukt i väggen.",
        example_en: "It feels like there's moisture in the wall.",
        pronunciation_tip: "Short 'u', hard ending: 'fookt'."
      },
      {
        swedish: "åtgärda",
        english: "to fix, to take action on",
        example_sv: "Problemet måste åtgärdas snabbt, det är en hälsorisk.",
        example_en: "The problem must be fixed quickly, it's a health risk.",
        pronunciation_tip: "Stress the first syllable: ÅT-gär-da."
      },
      {
        swedish: "en hälsorisk",
        english: "a health risk",
        example_sv: "Mögel är en hälsorisk, särskilt för barn.",
        example_en: "Mould is a health risk, especially for children.",
        pronunciation_tip: "Stress: HEL-so-risk."
      }
    ],
    key_phrases: [
      {
        situation_en: "Explaining why you are calling",
        phrase_sv: "Hej, jag ringer för att det har blivit mögel i mitt badrum.",
        phrase_en: "Hi, I'm calling because mould has appeared in my bathroom.",
        pronunciation_tip: "'Blivit' is often shortened to 'blitt' in fast speech."
      },
      {
        situation_en: "Describing the problem in detail",
        phrase_sv: "Det är svarta fläckar i taket, och de har blivit större de senaste veckorna.",
        phrase_en: "There are black spots on the ceiling, and they've grown bigger in recent weeks.",
        pronunciation_tip: "'Fläckar' — 'ä' like 'e' in 'fleck': 'FLEK-kar'."
      },
      {
        situation_en: "Requesting an inspection firmly",
        phrase_sv: "Jag vill att ni kommer och gör en besiktning så snart som möjligt.",
        phrase_en: "I want you to come and do an inspection as soon as possible.",
        pronunciation_tip: "Keep a calm, steady tone — firm but not angry."
      },
      {
        situation_en: "Pushing back on a slow or weak solution",
        phrase_sv: "Det räcker inte att jag städar själv — det här är ert ansvar som hyresvärd.",
        phrase_en: "It's not enough for me to clean it myself — this is your responsibility as the landlord.",
        pronunciation_tip: "Stress 'ERT ansvar' to underline whose responsibility it is."
      },
      {
        situation_en: "Agreeing on a date",
        phrase_sv: "Torsdag klockan tio fungerar bra — då är jag hemma.",
        phrase_en: "Thursday at ten works well — I'll be home then.",
        pronunciation_tip: "'Fungerar' — stress the middle: fun-GE-rar."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Jag vill att ni kommer och gör en ___ av badrummet.",
        prompt_en: "I want you to come and do an ___ of the bathroom.",
        expected_answer_sv: "besiktning",
        expected_answer_en: "inspection",
        options: ["besiktning", "beställning", "betalning", "belöning"],
        hint_en: "A professional visit to check the damage.",
      },
      {
        type: "quick_response",
        prompt_sv: "Kan du inte bara torka bort det med lite mögelspray själv?",
        prompt_en: "Can't you just wipe it off yourself with some mould spray?",
        expected_answer_sv: "Nej, det här är ett större problem — det är ert ansvar att åtgärda det.",
        expected_answer_en: "No, this is a bigger problem — it's your responsibility to fix it.",
        hint_en: "Refuse politely and remind them whose responsibility it is.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Den första tiden vi har är om tre veckor, tyvärr.",
        prompt_en: "The first time we have is in three weeks, unfortunately.",
        expected_answer_sv: "Tre veckor är för länge — mögel är en hälsorisk. Kan ni komma tidigare?",
        expected_answer_en: "Three weeks is too long — mould is a health risk. Can you come earlier?",
        hint_en: "Say it's too long, mention the health risk, ask for an earlier time.",
        options: null
      }
    ]
  },

  "Möte med studievägledare": {
    description_en: "Meet a study counsellor to plan your path to becoming a nurse in Sweden.",
    opener_sv: "Hej och välkommen! Sätt dig. Så, du funderar på att plugga vidare — berätta!",
    opener_en: "Hi and welcome! Have a seat. So, you're thinking about studying — tell me!",
    goal: "Explain your goal of becoming a nurse, ask about the requirements, and agree on your next steps.",
    success_criteria: [
      "Explain your goal and your current background clearly",
      "Ask what grades or courses are required to get in",
      "Agree on at least one concrete next step before you leave"
    ],
    curveballs: [
      "Svea asks if your foreign grades have been evaluated by UHR",
      "Svea says you first need to complete a Komvux course in science",
      "Svea asks how you plan to support yourself while studying (CSN)"
    ],
    cultural_notes: "Adult education is very normal in Sweden — Komvux and CSN student aid make career changes common at any age, so no one will think it strange.",
    suggested_vocab: ["en sjuksköterska", "behörighet", "betyg", "komvux", "söka till", "studiemedel"],
    key_vocabulary: [
      {
        swedish: "en sjuksköterska",
        english: "a nurse",
        example_sv: "Mitt mål är att bli sjuksköterska här i Sverige.",
        example_en: "My goal is to become a nurse here in Sweden.",
        pronunciation_tip: "Tricky word: 'hwook-HWER-ster-ska' — both 'sj' and 'sk' are soft."
      },
      {
        swedish: "behörighet",
        english: "eligibility, formal qualification",
        example_sv: "Vad krävs för att få behörighet till utbildningen?",
        example_en: "What is required to be eligible for the programme?",
        pronunciation_tip: "Stress: be-HÖ-rig-het."
      },
      {
        swedish: "ett betyg",
        english: "a grade",
        example_sv: "Mina betyg är från mitt hemland.",
        example_en: "My grades are from my home country.",
        pronunciation_tip: "Stress the last syllable: be-TYG."
      },
      {
        swedish: "komvux",
        english: "municipal adult education",
        example_sv: "Jag kan läsa upp mina betyg på komvux.",
        example_en: "I can improve my grades at adult education.",
        pronunciation_tip: "Two clear syllables: KOM-vux."
      },
      {
        swedish: "studiemedel",
        english: "student aid (loans and grants)",
        example_sv: "Kan jag få studiemedel från CSN under utbildningen?",
        example_en: "Can I get student aid from CSN during the programme?",
        pronunciation_tip: "Stress: STU-di-e-me-del."
      },
      {
        swedish: "söka till",
        english: "to apply to (a programme)",
        example_sv: "När kan jag söka till utbildningen?",
        example_en: "When can I apply to the programme?",
        pronunciation_tip: "'Söka' has a long 'ö': 'SEU-ka'."
      }
    ],
    key_phrases: [
      {
        situation_en: "Explaining your goal",
        phrase_sv: "Mitt mål är att bli sjuksköterska, och jag vill veta vilken väg som är bäst för mig.",
        phrase_en: "My goal is to become a nurse, and I want to know which path is best for me.",
        pronunciation_tip: "'Väg' has a long 'ä': 'vairg'."
      },
      {
        situation_en: "Describing your background",
        phrase_sv: "Jag har gymnasieutbildning från mitt hemland och har jobbat inom vården i två år.",
        phrase_en: "I have upper-secondary education from my home country and have worked in healthcare for two years.",
        pronunciation_tip: "'Vården' — long 'å': 'VOR-den'."
      },
      {
        situation_en: "Asking about requirements",
        phrase_sv: "Vilka ämnen behöver jag komplettera för att bli behörig?",
        phrase_en: "Which subjects do I need to complete to become eligible?",
        pronunciation_tip: "'Komplettera' — stress near the end: kom-ple-TE-ra."
      },
      {
        situation_en: "Asking about money during studies",
        phrase_sv: "Hur funkar det med studiemedel medan jag pluggar?",
        phrase_en: "How does student aid work while I'm studying?",
        pronunciation_tip: "'Funkar' and 'pluggar' are casual, everyday words — use them."
      },
      {
        situation_en: "Agreeing on next steps",
        phrase_sv: "Så mitt nästa steg är att skicka mina betyg till UHR — då gör jag det den här veckan.",
        phrase_en: "So my next step is to send my grades to UHR — I'll do that this week.",
        pronunciation_tip: "UHR is said letter by letter: 'oo-hoh-air'."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Vilka ämnen behöver jag läsa för att bli ___ till utbildningen?",
        prompt_en: "Which subjects do I need to study to become ___ for the programme?",
        expected_answer_sv: "behörig",
        expected_answer_en: "eligible",
        options: ["behörig", "berömd", "beroende", "bekväm"],
        hint_en: "The formal word for meeting the entry requirements.",
      },
      {
        type: "quick_response",
        prompt_sv: "Har du fått dina utländska betyg bedömda av UHR?",
        prompt_en: "Have you had your foreign grades evaluated by UHR?",
        expected_answer_sv: "Inte än, men jag kan skicka in dem. Hur gör jag det?",
        expected_answer_en: "Not yet, but I can send them in. How do I do that?",
        hint_en: "Be honest — say not yet and ask how to do it.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Du behöver först läsa naturkunskap på komvux. Hur känns det?",
        prompt_en: "You first need to take a science course at Komvux. How does that feel?",
        expected_answer_sv: "Det är okej — det är värt det. När startar nästa kurs?",
        expected_answer_en: "That's okay — it's worth it. When does the next course start?",
        hint_en: "Accept the extra step and ask when the course starts.",
        options: null
      }
    ]
  },
};
