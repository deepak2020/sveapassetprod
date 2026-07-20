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

  "Presentera en idé på jobbet": {
    description_en: "Pitch a small process change at the weekly team meeting and handle a critical question.",
    opener_sv: "Okej, nästa punkt på agendan. Du hade en idé du ville ta upp, eller hur? Varsågod.",
    opener_en: "Okay, next item on the agenda. You had an idea you wanted to bring up, right? Go ahead.",
    goal: "Present your idea clearly, back it with one good reason, and handle a critical question calmly.",
    success_criteria: [
      "Present the idea in two or three clear sentences",
      "Give at least one concrete reason or benefit",
      "Answer a critical question without getting defensive"
    ],
    curveballs: [
      "A colleague asks if the change will cost anything",
      "Svea says 'we tried something similar two years ago and it didn't work'",
      "Svea asks you to summarise the idea in one sentence for the boss"
    ],
    cultural_notes: "In Swedish meetings a soft pitch works best — frame your idea as a suggestion to discuss ('jag tänkte att vi kanske kunde...') rather than a finished decision.",
    suggested_vocab: ["ett förslag", "spara tid", "en fördel", "testa", "en förbättring", "det skulle innebära"],
    key_vocabulary: [
      {
        swedish: "en förbättring",
        english: "an improvement",
        example_sv: "Jag tror att det här skulle vara en stor förbättring.",
        example_en: "I think this would be a big improvement.",
        pronunciation_tip: "Stress the middle: för-BÄTT-ring."
      },
      {
        swedish: "spara tid",
        english: "to save time",
        example_sv: "Vi skulle spara tid varje vecka med den här lösningen.",
        example_en: "We would save time every week with this solution.",
        pronunciation_tip: "Long 'a' in 'spara': 'SPAH-ra'."
      },
      {
        swedish: "en fördel",
        english: "an advantage",
        example_sv: "Den största fördelen är att alla ser samma information.",
        example_en: "The biggest advantage is that everyone sees the same information.",
        pronunciation_tip: "Stress the first syllable: FÖR-del."
      },
      {
        swedish: "innebära",
        english: "to mean, to involve",
        example_sv: "Vad skulle det innebära för teamet i praktiken?",
        example_en: "What would it mean for the team in practice?",
        pronunciation_tip: "Stress: in-ne-BÄ-ra."
      },
      {
        swedish: "testa",
        english: "to try out, to test",
        example_sv: "Kan vi inte testa det i en månad och sen utvärdera?",
        example_en: "Can't we try it for a month and then evaluate?",
        pronunciation_tip: "Short 'e', double 't': 'TES-ta'."
      },
      {
        swedish: "en invändning",
        english: "an objection",
        example_sv: "Det är en bra invändning — låt mig förklara.",
        example_en: "That's a good objection — let me explain.",
        pronunciation_tip: "Stress: in-VÄND-ning."
      }
    ],
    key_phrases: [
      {
        situation_en: "Opening your pitch softly",
        phrase_sv: "Jag tänkte att vi kanske kunde ändra hur vi hanterar veckorapporterna.",
        phrase_en: "I was thinking we could maybe change how we handle the weekly reports.",
        pronunciation_tip: "'Kanske' is often said 'KAN-she'."
      },
      {
        situation_en: "Giving your main reason",
        phrase_sv: "Poängen är att vi skulle spara ungefär en timme per person och vecka.",
        phrase_en: "The point is that we would save about an hour per person per week.",
        pronunciation_tip: "'Poängen' — stress the 'äng': po-ENG-en."
      },
      {
        situation_en: "Handling a critical question calmly",
        phrase_sv: "Bra fråga. Det kostar ingenting extra — vi använder verktyg vi redan har.",
        phrase_en: "Good question. It costs nothing extra — we use tools we already have.",
        pronunciation_tip: "Start with 'Bra fråga' to buy a second and sound confident."
      },
      {
        situation_en: "Responding to 'we tried that before'",
        phrase_sv: "Jag förstår, men skillnaden den här gången är att vi börjar i liten skala.",
        phrase_en: "I understand, but the difference this time is that we start on a small scale.",
        pronunciation_tip: "'Skillnaden' — stress first syllable: SKILL-na-den."
      },
      {
        situation_en: "Suggesting a low-risk trial",
        phrase_sv: "Kan vi testa i en månad och sen ta ett beslut tillsammans?",
        phrase_en: "Can we try it for a month and then make a decision together?",
        pronunciation_tip: "'Tillsammans' — stress the middle: till-SAM-mans."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Den största ___ är att vi sparar en timme per vecka.",
        prompt_en: "The biggest ___ is that we save an hour per week.",
        expected_answer_sv: "fördelen",
        expected_answer_en: "advantage",
        options: ["fördelen", "nackdelen", "räkningen", "pausen"],
        hint_en: "The positive side of your idea.",
      },
      {
        type: "quick_response",
        prompt_sv: "Låter intressant, men kommer det här att kosta något?",
        prompt_en: "Sounds interesting, but will this cost anything?",
        expected_answer_sv: "Nej, ingenting extra — vi använder verktyg vi redan har.",
        expected_answer_en: "No, nothing extra — we use tools we already have.",
        hint_en: "Reassure them: no extra cost, existing tools.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Vi testade något liknande för två år sedan, och det funkade inte.",
        prompt_en: "We tried something similar two years ago, and it didn't work.",
        expected_answer_sv: "Jag förstår, men den här gången börjar vi i liten skala och utvärderar efter en månad.",
        expected_answer_en: "I understand, but this time we start small and evaluate after a month.",
        hint_en: "Acknowledge, then explain what is different this time.",
        options: null
      }
    ]
  },

  "Prata om semesterplaner": {
    description_en: "Chat with a colleague over lunch about your summer vacation plans.",
    opener_sv: "Nämen, vad gott det ser ut! Du, har du några planer för semestern i år?",
    opener_en: "Oh, that looks tasty! Hey, do you have any plans for the vacation this year?",
    goal: "Share your vacation plan, ask about your colleague's plans, and react naturally to their answer.",
    success_criteria: [
      "Describe your vacation plan with at least two details",
      "Ask your colleague about their plans",
      "React to their answer with a follow-up comment or question"
    ],
    curveballs: [
      "Svea says she's staying home all summer — 'hemester'",
      "Svea asks exactly which weeks you'll be away",
      "Svea recommends a place she loves and asks if you've been there"
    ],
    cultural_notes: "Swedes often take three to four consecutive weeks off in July, and asking 'vilka veckor har du?' (which weeks do you have?) is standard small talk — weeks are referred to by number.",
    suggested_vocab: ["semester", "ledig", "en stuga", "resa bort", "vecka 29", "ser fram emot"],
    key_vocabulary: [
      {
        swedish: "semester",
        english: "vacation",
        example_sv: "Jag har semester i fyra veckor i juli.",
        example_en: "I have four weeks of vacation in July.",
        pronunciation_tip: "Stress the middle: se-MES-ter."
      },
      {
        swedish: "ledig",
        english: "off (from work), free",
        example_sv: "Jag är ledig vecka 28 till 31.",
        example_en: "I'm off from week 28 to 31.",
        pronunciation_tip: "Long 'e': 'LEE-dig'."
      },
      {
        swedish: "en stuga",
        english: "a cottage, a cabin",
        example_sv: "Vi har hyrt en stuga vid en sjö i Småland.",
        example_en: "We've rented a cottage by a lake in Småland.",
        pronunciation_tip: "Long 'u': 'STOO-ga'."
      },
      {
        swedish: "resa bort",
        english: "to go away, to travel",
        example_sv: "Vi ska resa bort två veckor i sommar.",
        example_en: "We're going away for two weeks this summer.",
        pronunciation_tip: "'Resa' has a long 'e': 'REE-sa'."
      },
      {
        swedish: "se fram emot",
        english: "to look forward to",
        example_sv: "Jag ser verkligen fram emot att bara koppla av.",
        example_en: "I'm really looking forward to just relaxing.",
        pronunciation_tip: "Say it as one chunk: 'ser-fram-e-MOT'."
      },
      {
        swedish: "koppla av",
        english: "to relax, to unwind",
        example_sv: "Planen är att bada, läsa och koppla av.",
        example_en: "The plan is to swim, read and relax.",
        pronunciation_tip: "Double 'p' makes it snappy: 'KOP-pla av'."
      }
    ],
    key_phrases: [
      {
        situation_en: "Sharing your plan",
        phrase_sv: "Vi ska hyra en stuga vid havet i tre veckor, i slutet av juli.",
        phrase_en: "We're renting a cottage by the sea for three weeks, at the end of July.",
        pronunciation_tip: "'Havet' — long 'a': 'HAH-vet'."
      },
      {
        situation_en: "Saying which weeks you're off",
        phrase_sv: "Jag är ledig vecka 29 till 32, så nästan hela juli.",
        phrase_en: "I'm off week 29 to 32, so almost all of July.",
        pronunciation_tip: "Swedes say week numbers a lot — practice 'tjugonio' (29)."
      },
      {
        situation_en: "Asking about their plans",
        phrase_sv: "Vad ska du göra då — ska ni resa någonstans?",
        phrase_en: "What are you doing then — are you going anywhere?",
        pronunciation_tip: "'Någonstans' is usually said 'NÅN-stans'."
      },
      {
        situation_en: "Reacting with interest",
        phrase_sv: "Åh, vad härligt! Hur länge ska ni vara där?",
        phrase_en: "Oh, how lovely! How long will you be there?",
        pronunciation_tip: "'Härligt' — say 'HAIR-lit', the 'g' softens."
      },
      {
        situation_en: "Reacting to someone staying home",
        phrase_sv: "Hemester kan vara riktigt skönt — då slipper man allt resande.",
        phrase_en: "A staycation can be really nice — then you avoid all the travelling.",
        pronunciation_tip: "'Skönt' — soft 'sh' start: 'shurnt'."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Jag är ___ vecka 29 till 32, nästan hela juli.",
        prompt_en: "I'm ___ week 29 to 32, almost all of July.",
        expected_answer_sv: "ledig",
        expected_answer_en: "off (from work)",
        options: ["ledig", "upptagen", "sjuk", "sen"],
        hint_en: "The word for being free from work.",
      },
      {
        type: "quick_response",
        prompt_sv: "Vi ska faktiskt vara hemma hela sommaren i år — hemester!",
        prompt_en: "We're actually staying home all summer this year — staycation!",
        expected_answer_sv: "Vad skönt! Då kan ni upptäcka saker på hemmaplan. Har ni något planerat?",
        expected_answer_en: "How nice! Then you can discover things close to home. Do you have anything planned?",
        hint_en: "React positively and ask a follow-up.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Ni måste åka till Gotland någon gång — har du varit där?",
        prompt_en: "You have to go to Gotland sometime — have you been there?",
        expected_answer_sv: "Nej, inte än, men jag har hört att det är jättefint. Vad ska man se där?",
        expected_answer_en: "No, not yet, but I've heard it's beautiful. What should you see there?",
        hint_en: "Say you haven't, sound interested, ask what to see.",
        options: null
      }
    ]
  },

  "Kondolera en kollega": {
    description_en: "Offer a short, warm condolence to a colleague whose father has passed away.",
    opener_sv: "Hej... ja, du kanske hörde att min pappa gick bort i förra veckan.",
    opener_en: "Hi... well, you maybe heard that my dad passed away last week.",
    goal: "Express your condolences briefly and warmly, offer practical help, and respect your colleague's space.",
    success_criteria: [
      "Express condolences in one or two short, sincere sentences",
      "Offer concrete help, for example taking over a task",
      "Let the colleague steer — don't push for details"
    ],
    curveballs: [
      "Svea starts to tear up and goes quiet",
      "Svea changes the subject to work",
      "Svea says 'it's fine, we knew it was coming'"
    ],
    cultural_notes: "Swedes keep condolences short and low-key — 'jag beklagar sorgen' plus a quiet offer of help is warmer than a long emotional speech.",
    suggested_vocab: ["beklagar sorgen", "gå bort", "en begravning", "ta hand om dig", "säg till", "finnas där"],
    key_vocabulary: [
      {
        swedish: "beklaga",
        english: "to express sympathy, to be sorry about",
        example_sv: "Jag beklagar sorgen, verkligen.",
        example_en: "I'm so sorry for your loss, truly.",
        pronunciation_tip: "Stress the middle: be-KLA-ga."
      },
      {
        swedish: "gå bort",
        english: "to pass away",
        example_sv: "Jag hörde att din pappa har gått bort.",
        example_en: "I heard that your father has passed away.",
        pronunciation_tip: "Gentler than 'dö' (die) — always use this at work."
      },
      {
        swedish: "sorgen",
        english: "the grief, the sorrow",
        example_sv: "Sorgen tar tid — var snäll mot dig själv.",
        example_en: "Grief takes time — be kind to yourself.",
        pronunciation_tip: "'SOR-yen' — the 'g' sounds like 'y'."
      },
      {
        swedish: "en begravning",
        english: "a funeral",
        example_sv: "Ta all ledighet du behöver för begravningen.",
        example_en: "Take all the time off you need for the funeral.",
        pronunciation_tip: "Stress: be-GRAV-ning."
      },
      {
        swedish: "avlasta",
        english: "to take over some load, to relieve",
        example_sv: "Jag kan avlasta dig med rapporten den här veckan.",
        example_en: "I can take the report off your hands this week.",
        pronunciation_tip: "Stress the first syllable: AV-las-ta."
      },
      {
        swedish: "säg till",
        english: "let me know, just say the word",
        example_sv: "Säg till om det är något jag kan göra.",
        example_en: "Let me know if there's anything I can do.",
        pronunciation_tip: "'Säg' sounds like 'say': 'say till'."
      }
    ],
    key_phrases: [
      {
        situation_en: "Expressing condolences",
        phrase_sv: "Jag beklagar sorgen. Jag tänker på dig.",
        phrase_en: "I'm so sorry for your loss. I'm thinking of you.",
        pronunciation_tip: "Say it slowly and quietly — the tone matters most."
      },
      {
        situation_en: "Offering concrete help",
        phrase_sv: "Om du vill kan jag ta över dina möten den här veckan.",
        phrase_en: "If you want, I can take over your meetings this week.",
        pronunciation_tip: "'Ta över' — stress 'Ö-ver'."
      },
      {
        situation_en: "Giving them space",
        phrase_sv: "Vi behöver inte prata om det — men jag finns här om du vill.",
        phrase_en: "We don't have to talk about it — but I'm here if you want.",
        pronunciation_tip: "'Finns' has a short 'i': 'finns', not 'feens'."
      },
      {
        situation_en: "Responding when they go quiet",
        phrase_sv: "Ta den tid du behöver. Ska jag hämta en kaffe åt dig?",
        phrase_en: "Take the time you need. Shall I get you a coffee?",
        pronunciation_tip: "A small practical offer breaks a heavy silence gently."
      },
      {
        situation_en: "Ending the conversation warmly",
        phrase_sv: "Ta hand om dig, och säg till om det är något.",
        phrase_en: "Take care of yourself, and let me know if there's anything.",
        pronunciation_tip: "This is the standard warm goodbye in hard moments."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Jag ___ sorgen. Jag tänker på dig.",
        prompt_en: "I'm so ___ for your loss. I'm thinking of you.",
        expected_answer_sv: "beklagar",
        expected_answer_en: "sorry (expressing sympathy)",
        options: ["beklagar", "berättar", "beställer", "betalar"],
        hint_en: "The fixed phrase for condolences: '... sorgen'.",
      },
      {
        type: "quick_response",
        prompt_sv: "Förlåt... det är bara lite mycket just nu. (hon blir tyst)",
        prompt_en: "Sorry... it's just a bit much right now. (she goes quiet)",
        expected_answer_sv: "Du behöver inte säga något. Ska jag hämta en kaffe åt dig?",
        expected_answer_en: "You don't have to say anything. Shall I get you a coffee?",
        hint_en: "Don't fill the silence with questions — offer something small and practical.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Men vi kan prata om annat — hur går det med projektet?",
        prompt_en: "But we can talk about something else — how's the project going?",
        expected_answer_sv: "Det rullar på, ta det lugnt med det. Och säg till om jag kan avlasta dig.",
        expected_answer_en: "It's ticking along, don't worry about it. And let me know if I can take some load off you.",
        hint_en: "Follow their lead to work talk, but repeat your offer to help.",
        options: null
      }
    ]
  },

  "Julmiddag med svenska familjen": {
    description_en: "Join a Swedish Christmas dinner: greet everyone, compliment the food, and join the small talk.",
    opener_sv: "Välkommen, välkommen! God jul! Kom in i värmen — maten är nästan klar. Hänger du av dig jackan?",
    opener_en: "Welcome, welcome! Merry Christmas! Come in from the cold — the food is almost ready. Will you hang up your jacket?",
    goal: "Greet the family, compliment the host and the food, and take part in the table small talk.",
    success_criteria: [
      "Greet the hosts and wish them 'God jul'",
      "Compliment at least one dish on the julbord",
      "Join a conversation topic at the table and ask a question"
    ],
    curveballs: [
      "Someone offers you sill (pickled herring) and watches you taste it",
      "The family asks how you celebrate Christmas in your home country",
      "Everyone suddenly stands up for Kalle Anka at three o'clock"
    ],
    cultural_notes: "Many Swedish families stop everything at 3 pm on Christmas Eve to watch Kalle Anka (Donald Duck) on TV — join in, it's a beloved tradition, not a joke.",
    suggested_vocab: ["god jul", "julbord", "sill", "köttbullar", "jättegott", "en tradition"],
    key_vocabulary: [
      {
        swedish: "julbord",
        english: "Christmas buffet",
        example_sv: "Vilket fantastiskt julbord ni har dukat fram!",
        example_en: "What a fantastic Christmas buffet you've laid out!",
        pronunciation_tip: "'Jul' sounds like 'yool': 'YOOL-bord'."
      },
      {
        swedish: "sill",
        english: "pickled herring",
        example_sv: "Jag har faktiskt aldrig smakat sill förut.",
        example_en: "I've actually never tasted pickled herring before.",
        pronunciation_tip: "Short 'i', like 'sill' in 'windowsill'."
      },
      {
        swedish: "en värd",
        english: "a host",
        example_sv: "Tack för att vi fick komma — ni är fantastiska värdar.",
        example_en: "Thanks for having us — you're fantastic hosts.",
        pronunciation_tip: "'Värd' sounds like 'vaird'."
      },
      {
        swedish: "jättegott",
        english: "really tasty",
        example_sv: "Janssons frestelse var jättegott!",
        example_en: "The Jansson's temptation was really tasty!",
        pronunciation_tip: "'Jätte' = 'YET-te', the go-to word for 'very'."
      },
      {
        swedish: "en tradition",
        english: "a tradition",
        example_sv: "Vilken är er viktigaste tradition på julafton?",
        example_en: "What is your most important tradition on Christmas Eve?",
        pronunciation_tip: "Stress the end: tra-di-SHON."
      },
      {
        swedish: "fira",
        english: "to celebrate",
        example_sv: "Hemma hos oss firar vi jul på juldagen i stället.",
        example_en: "In my home we celebrate Christmas on Christmas Day instead.",
        pronunciation_tip: "Long 'i': 'FEE-ra'."
      }
    ],
    key_phrases: [
      {
        situation_en: "Greeting on arrival",
        phrase_sv: "God jul! Tack så mycket för att jag fick komma.",
        phrase_en: "Merry Christmas! Thank you so much for having me.",
        pronunciation_tip: "'God jul' is said 'goo-YOOL' — the 'd' almost disappears."
      },
      {
        situation_en: "Complimenting the food",
        phrase_sv: "Åh, vad allting ser gott ut! Har du lagat allt själv?",
        phrase_en: "Oh, everything looks so tasty! Did you make it all yourself?",
        pronunciation_tip: "'Gott' has a hard double 't': 'got'."
      },
      {
        situation_en: "Trying something new politely",
        phrase_sv: "Jag har aldrig smakat sill förut, men jag provar gärna!",
        phrase_en: "I've never tasted herring before, but I'm happy to try!",
        pronunciation_tip: "'Gärna' — 'YAIR-na', a key politeness word."
      },
      {
        situation_en: "Asking about traditions",
        phrase_sv: "Vad är det här med Kalle Anka klockan tre — berätta!",
        phrase_en: "What's this thing with Donald Duck at three o'clock — tell me!",
        pronunciation_tip: "'Kalle Anka' — both words stress the first syllable."
      },
      {
        situation_en: "Thanking when you leave",
        phrase_sv: "Tack för en underbar kväll — maten var helt fantastisk.",
        phrase_en: "Thanks for a wonderful evening — the food was absolutely fantastic.",
        pronunciation_tip: "'Underbar' — stress the first syllable: UN-der-bar."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "God jul! Tack så mycket för att jag fick ___.",
        prompt_en: "Merry Christmas! Thank you so much for having me (lit. that I got to ___).",
        expected_answer_sv: "komma",
        expected_answer_en: "come",
        options: ["komma", "gå", "äta", "sova"],
        hint_en: "The standard guest phrase: 'tack för att jag fick ...'.",
      },
      {
        type: "quick_response",
        prompt_sv: "Här, du måste smaka sillen! Den är inlagd efter mormors recept.",
        prompt_en: "Here, you have to taste the herring! It's pickled after grandma's recipe.",
        expected_answer_sv: "Jag har aldrig smakat sill förut, men jag provar gärna. Mm, det var faktiskt gott!",
        expected_answer_en: "I've never tasted herring before, but I'll happily try. Mm, that was actually good!",
        hint_en: "Be a good sport — try it and say something positive.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Hur firar ni jul i ditt hemland då? Berätta!",
        prompt_en: "So how do you celebrate Christmas in your home country? Tell us!",
        expected_answer_sv: "Hemma hos oss firar vi på juldagen, med mycket mat och hela familjen samlad.",
        expected_answer_en: "Back home we celebrate on Christmas Day, with lots of food and the whole family together.",
        hint_en: "Share one or two simple details about your own tradition.",
        options: null
      }
    ]
  },

  "Midsommarfirande": {
    description_en: "Celebrate your first Midsummer: ask about the traditions, join a snapsvisa, and thank the hosts.",
    opener_sv: "Hej och glad midsommar! Kul att du kom! Vi ska precis klä midsommarstången — vill du hjälpa till?",
    opener_en: "Hi and happy Midsummer! Great that you came! We're just about to decorate the maypole — do you want to help?",
    goal: "Ask about the Midsummer traditions, join in the singing, and thank the hosts warmly.",
    success_criteria: [
      "Ask about at least one tradition, like the maypole or the flower crowns",
      "Join in when everyone sings a snapsvisa",
      "Thank the hosts before you leave"
    ],
    curveballs: [
      "Everyone starts dancing 'Små grodorna' and pulls you in",
      "Someone hands you a snaps and starts singing 'Helan går'",
      "Svea tells you to pick seven flowers to put under your pillow"
    ],
    cultural_notes: "At Midsummer everyone joins the silly frog dance and the drinking songs regardless of age — joining in enthusiastically matters far more than doing it right.",
    suggested_vocab: ["glad midsommar", "midsommarstången", "en blomsterkrans", "en snapsvisa", "sjunga med", "dansa"],
    key_vocabulary: [
      {
        swedish: "midsommarstången",
        english: "the maypole",
        example_sv: "Ska vi hjälpas åt att resa midsommarstången?",
        example_en: "Shall we help each other raise the maypole?",
        pronunciation_tip: "Long compound: mid-SOM-mar-stång-en."
      },
      {
        swedish: "en blomsterkrans",
        english: "a flower crown",
        example_sv: "Hur gör man en blomsterkrans?",
        example_en: "How do you make a flower crown?",
        pronunciation_tip: "Stress: BLOM-ster-krans."
      },
      {
        swedish: "en snapsvisa",
        english: "a drinking song",
        example_sv: "Kan du lära mig en snapsvisa?",
        example_en: "Can you teach me a drinking song?",
        pronunciation_tip: "'SNAPS-vee-sa' — short 'a' in snaps."
      },
      {
        swedish: "sjunga med",
        english: "to sing along",
        example_sv: "Jag kan inte orden, men jag sjunger med ändå!",
        example_en: "I don't know the words, but I'll sing along anyway!",
        pronunciation_tip: "'Sjunga' starts with a soft 'hw' sound: 'HWUNG-a'."
      },
      {
        swedish: "en tradition",
        english: "a tradition",
        example_sv: "Vilken rolig tradition — varför gör man så?",
        example_en: "What a fun tradition — why do you do that?",
        pronunciation_tip: "Stress the end: tra-di-SHON."
      },
      {
        swedish: "skåla",
        english: "to toast, to say cheers",
        example_sv: "Vi skålar och säger 'skål' innan vi dricker.",
        example_en: "We toast and say 'cheers' before we drink.",
        pronunciation_tip: "Long 'å': 'SKOH-la'."
      }
    ],
    key_phrases: [
      {
        situation_en: "Greeting at the party",
        phrase_sv: "Glad midsommar! Tack för att jag fick vara med.",
        phrase_en: "Happy Midsummer! Thanks for letting me join.",
        pronunciation_tip: "'Glad' has a long 'a': 'glahd'."
      },
      {
        situation_en: "Asking about a tradition",
        phrase_sv: "Varför dansar man runt stången som grodor? Berätta!",
        phrase_en: "Why do you dance around the pole like frogs? Tell me!",
        pronunciation_tip: "'Grodor' — long 'o': 'GROO-dor'."
      },
      {
        situation_en: "Joining the singing",
        phrase_sv: "Jag kan inte texten, men jag hänger på ändå!",
        phrase_en: "I don't know the lyrics, but I'll join in anyway!",
        pronunciation_tip: "'Hänger på' = 'join in' — very useful casual phrase."
      },
      {
        situation_en: "Declining or accepting a snaps politely",
        phrase_sv: "En liten till mig, tack — och skål allihop!",
        phrase_en: "A small one for me, thanks — and cheers everyone!",
        pronunciation_tip: "'Allihop' — stress the end: al-li-HOP."
      },
      {
        situation_en: "Thanking the hosts",
        phrase_sv: "Tack för en fantastisk dag — nu förstår jag varför ni älskar midsommar!",
        phrase_en: "Thanks for a fantastic day — now I understand why you love Midsummer!",
        pronunciation_tip: "End with warmth — Swedes remember a good 'tack'."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Jag kan inte texten, men jag sjunger ___ ändå!",
        prompt_en: "I don't know the lyrics, but I'll sing ___ anyway!",
        expected_answer_sv: "med",
        expected_answer_en: "along",
        options: ["med", "bort", "ut", "ner"],
        hint_en: "The particle that turns 'sing' into 'sing along'.",
      },
      {
        type: "quick_response",
        prompt_sv: "Kom igen, nu dansar vi Små grodorna! Alla är med!",
        prompt_en: "Come on, now we dance the Little Frogs! Everyone joins!",
        expected_answer_sv: "Haha, okej, jag hänger på — visa mig hur man gör!",
        expected_answer_en: "Haha, okay, I'm in — show me how it's done!",
        hint_en: "Say yes with a laugh and ask them to show you.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Du vet väl att du ska plocka sju sorters blommor och lägga under kudden i natt?",
        prompt_en: "You do know you're supposed to pick seven kinds of flowers and put them under your pillow tonight?",
        expected_answer_sv: "Nej, det visste jag inte! Vad händer då — berätta mer!",
        expected_answer_en: "No, I didn't know that! What happens then — tell me more!",
        hint_en: "Show curiosity and ask what the tradition means.",
        options: null
      }
    ]
  },

  "Ringa 112": {
    description_en: "Call 112 after seeing a car accident: report what happened, where, and follow the operator's instructions.",
    opener_sv: "SOS 112, vad har inträffat?",
    opener_en: "SOS 112, what has happened?",
    goal: "Report the accident calmly: say what happened, exactly where, how many people are involved, and follow the operator's instructions.",
    success_criteria: [
      "State clearly WHAT happened and WHERE — road, town or nearest landmark",
      "Say how many people are involved and whether anyone seems hurt",
      "Follow the operator's instructions and stay on the line until told to hang up"
    ],
    curveballs: [
      "The operator asks if the injured person is awake and breathing",
      "The operator asks you to stay on the line and not hang up",
      "The operator asks whether the road is blocked and if there is fire or smoke"
    ],
    cultural_notes: "On a real 112 call the operator leads the conversation with what-where-who, help is dispatched while you are still talking, and you never hang up until the operator says so.",
    suggested_vocab: ["en olycka", "skadad", "vid medvetande", "andas", "en ambulans", "stanna kvar"],
    key_vocabulary: [
      {
        swedish: "en olycka",
        english: "an accident",
        example_sv: "Det har hänt en trafikolycka på riksväg 40.",
        example_en: "There's been a traffic accident on route 40.",
        pronunciation_tip: "Stress the first syllable: O-lyck-a."
      },
      {
        swedish: "skadad",
        english: "injured",
        example_sv: "En person verkar vara skadad.",
        example_en: "One person appears to be injured.",
        pronunciation_tip: "Long first 'a': 'SKAH-dad'."
      },
      {
        swedish: "andas",
        english: "to breathe",
        example_sv: "Han andas, men han svarar inte när jag pratar.",
        example_en: "He is breathing, but he doesn't respond when I talk.",
        pronunciation_tip: "Stress the first syllable: AN-das."
      },
      {
        swedish: "vid medvetande",
        english: "conscious",
        example_sv: "Föraren är vid medvetande och kan prata.",
        example_en: "The driver is conscious and can talk.",
        pronunciation_tip: "'Medvetande' — stress: MED-ve-tan-de."
      },
      {
        swedish: "en ambulans",
        english: "an ambulance",
        example_sv: "Behöver ni skicka en ambulans hit?",
        example_en: "Do you need to send an ambulance here?",
        pronunciation_tip: "Stress the last syllable: am-bu-LANS."
      },
      {
        swedish: "en avfart",
        english: "an exit (from a road)",
        example_sv: "Olyckan är precis efter avfarten mot Mölndal.",
        example_en: "The accident is just after the exit towards Mölndal.",
        pronunciation_tip: "Stress the first syllable: AV-fart."
      }
    ],
    key_phrases: [
      {
        situation_en: "Saying what happened",
        phrase_sv: "Det har hänt en bilolycka — två bilar har krockat.",
        phrase_en: "There's been a car accident — two cars have crashed.",
        pronunciation_tip: "'Krockat' — short 'o', hard 'k': 'KROCK-at'."
      },
      {
        situation_en: "Saying where you are",
        phrase_sv: "Vi är på väg 40, strax efter avfarten mot Landvetter, i riktning mot Borås.",
        phrase_en: "We're on route 40, just after the exit towards Landvetter, heading towards Borås.",
        pronunciation_tip: "'Strax' means 'just/shortly' — short and sharp: 'strax'."
      },
      {
        situation_en: "Describing the people involved",
        phrase_sv: "Det är två personer i bilen — föraren är vaken men blöder från pannan.",
        phrase_en: "There are two people in the car — the driver is awake but bleeding from the forehead.",
        pronunciation_tip: "'Blöder' — long 'ö': 'BLEU-der'."
      },
      {
        situation_en: "Answering the breathing question",
        phrase_sv: "Ja, han andas, men han verkar inte helt vid medvetande.",
        phrase_en: "Yes, he's breathing, but he doesn't seem fully conscious.",
        pronunciation_tip: "Speak slowly and clearly — the operator needs every word."
      },
      {
        situation_en: "Confirming you will follow instructions",
        phrase_sv: "Okej, jag stannar kvar på linjen och rör inte den skadade.",
        phrase_en: "Okay, I'll stay on the line and won't move the injured person.",
        pronunciation_tip: "'Stannar kvar' = 'stay/remain' — one calm chunk."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Det har hänt en ___ — två bilar har krockat.",
        prompt_en: "There's been an ___ — two cars have crashed.",
        expected_answer_sv: "olycka",
        expected_answer_en: "accident",
        options: ["olycka", "fest", "försening", "utflykt"],
        hint_en: "The key word to report to 112.",
      },
      {
        type: "quick_response",
        prompt_sv: "Är personen vaken? Andas hen normalt?",
        prompt_en: "Is the person awake? Are they breathing normally?",
        expected_answer_sv: "Han är vaken och andas, men han blöder från pannan.",
        expected_answer_en: "He's awake and breathing, but he's bleeding from the forehead.",
        hint_en: "Answer both parts: awake? breathing? Then add what you see.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Hjälpen är på väg. Stanna kvar på linjen tills jag säger till. Är vägen blockerad?",
        prompt_en: "Help is on the way. Stay on the line until I tell you. Is the road blocked?",
        expected_answer_sv: "Ja, jag stannar kvar. Ena filen är blockerad, men bilar kan köra förbi långsamt.",
        expected_answer_en: "Yes, I'll stay on. One lane is blocked, but cars can pass slowly.",
        hint_en: "Confirm you'll stay on the line, then answer the road question.",
        options: null
      }
    ]
  },

  "Sommarplaner med kollegor": {
    description_en: "Share your summer vacation plans with colleagues in June and ask good follow-up questions.",
    opener_sv: "Snart är det äntligen sommar! Vi satt precis och pratade semester. Vad har du för planer i år?",
    opener_en: "Finally, summer is almost here! We were just talking about vacation. What are your plans this year?",
    goal: "Share your summer plan, ask at least two follow-up questions, and react naturally to what colleagues say.",
    success_criteria: [
      "Describe your summer plan with a couple of details",
      "Ask at least two follow-up questions about others' plans",
      "React naturally — show interest or surprise"
    ],
    curveballs: [
      "A colleague asks who covers your tasks while you're away",
      "Svea says her trip was cancelled and she's disappointed",
      "Svea asks if you'll close your email completely during vacation"
    ],
    cultural_notes: "In Sweden it's normal — almost expected — to be fully offline during summer vacation, and colleagues will encourage you not to check email at all.",
    suggested_vocab: ["semesterplaner", "vecka 30", "täcka upp", "helt ledig", "en utflykt", "ladda batterierna"],
    key_vocabulary: [
      {
        swedish: "semesterplaner",
        english: "vacation plans",
        example_sv: "Har ni redan spikat era semesterplaner?",
        example_en: "Have you already fixed your vacation plans?",
        pronunciation_tip: "Stress: se-MES-ter-pla-ner."
      },
      {
        swedish: "täcka upp",
        english: "to cover (for someone at work)",
        example_sv: "Anna täcker upp för mig när jag är borta.",
        example_en: "Anna covers for me while I'm away.",
        pronunciation_tip: "'Täcka' — 'ä' like 'e' in 'deck': 'TEK-ka'."
      },
      {
        swedish: "ladda batterierna",
        english: "to recharge your batteries",
        example_sv: "Jag behöver verkligen ladda batterierna i sommar.",
        example_en: "I really need to recharge my batteries this summer.",
        pronunciation_tip: "'Ladda' — short 'a', double 'd': 'LAD-da'."
      },
      {
        swedish: "en utflykt",
        english: "an outing, a day trip",
        example_sv: "Vi planerar några utflykter i skärgården.",
        example_en: "We're planning a few day trips in the archipelago.",
        pronunciation_tip: "Stress the first syllable: UT-flykt."
      },
      {
        swedish: "inställd",
        english: "cancelled",
        example_sv: "Vår resa blev tyvärr inställd.",
        example_en: "Our trip was unfortunately cancelled.",
        pronunciation_tip: "Stress: in-STÄLLD."
      },
      {
        swedish: "spika",
        english: "to nail down, to fix (a plan)",
        example_sv: "Vi har inte spikat datumen än.",
        example_en: "We haven't nailed down the dates yet.",
        pronunciation_tip: "Long 'i': 'SPEE-ka'."
      }
    ],
    key_phrases: [
      {
        situation_en: "Sharing your plan",
        phrase_sv: "Jag ska vara ledig vecka 29 till 31 — först en vecka i fjällen, sen hemma.",
        phrase_en: "I'm off week 29 to 31 — first a week in the mountains, then at home.",
        pronunciation_tip: "'Fjällen' — soft 'fj': 'FYEL-len'."
      },
      {
        situation_en: "Asking a follow-up question",
        phrase_sv: "Vart ska ni ta vägen i år då? Samma ställe som förra sommaren?",
        phrase_en: "Where are you off to this year then? Same place as last summer?",
        pronunciation_tip: "'Vart ska ni ta vägen' is the natural way to ask 'where are you headed'."
      },
      {
        situation_en: "Reacting with sympathy",
        phrase_sv: "Åh nej, vad tråkigt att resan blev inställd! Vad gör ni i stället?",
        phrase_en: "Oh no, what a shame the trip was cancelled! What are you doing instead?",
        pronunciation_tip: "'Tråkigt' — say 'TROH-kit', the 'g' softens."
      },
      {
        situation_en: "Talking about work coverage",
        phrase_sv: "Anna täcker upp för mig, så allt är förberett innan jag går.",
        phrase_en: "Anna is covering for me, so everything is prepared before I leave.",
        pronunciation_tip: "'Förberett' — stress: för-be-RETT."
      },
      {
        situation_en: "Saying you'll be offline",
        phrase_sv: "Jag tänker faktiskt stänga av mejlen helt — jag behöver ladda batterierna.",
        phrase_en: "I'm actually going to switch off email completely — I need to recharge my batteries.",
        pronunciation_tip: "'Mejlen' sounds like English 'mail' + 'en': 'MAY-len'."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Anna täcker ___ för mig när jag är på semester.",
        prompt_en: "Anna covers ___ me while I'm on vacation.",
        expected_answer_sv: "upp",
        expected_answer_en: "for (particle in 'cover for')",
        options: ["upp", "ner", "av", "om"],
        hint_en: "The particle in the work phrase 'täcka ___ för någon'.",
      },
      {
        type: "quick_response",
        prompt_sv: "Vem tar dina arbetsuppgifter när du är borta?",
        prompt_en: "Who takes your tasks while you're away?",
        expected_answer_sv: "Anna täcker upp för mig — vi går igenom allt veckan innan.",
        expected_answer_en: "Anna is covering for me — we'll go through everything the week before.",
        hint_en: "Name a colleague and say you'll hand over before you leave.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Vår resa till Italien blev tyvärr inställd, så jag är lite besviken faktiskt.",
        prompt_en: "Our trip to Italy was unfortunately cancelled, so I'm a bit disappointed actually.",
        expected_answer_sv: "Åh, vad tråkigt! Vad ska ni hitta på i stället?",
        expected_answer_en: "Oh, what a shame! What will you do instead?",
        hint_en: "Show sympathy first, then ask what they'll do instead.",
        options: null
      }
    ]
  },
};
