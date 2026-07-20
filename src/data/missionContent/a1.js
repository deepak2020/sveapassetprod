// Auto-generated mission content. Schema: src/lib/missionPrompt.js
// Keyed by title_sv (must match src/data/missionCatalog.js exactly).
export const MISSION_CONTENT_A1 = {
  "Beställa fika på café": {
    description_en: "Order a coffee and a cinnamon bun at a Swedish café, choose eat-in or takeaway, and pay by card.",
    opener_sv: "Hej! Vad vill du ha?",
    opener_en: "Hi! What would you like?",
    goal: "Order a coffee and a kanelbulle, say if you want to eat here or take away, and pay with your card.",
    success_criteria: [
      "Order a coffee and a cinnamon bun",
      "Say if you want to eat in or take away",
      "Pay by card and say thank you"
    ],
    curveballs: [
      "The cinnamon buns are sold out and Svea offers a different pastry",
      "Svea asks if you want milk in your coffee",
      "The card machine is slow and Svea asks you to try again"
    ],
    cultural_notes: "Fika is a daily coffee-and-pastry ritual in Sweden, and a simple 'Hej!' is the normal way to greet staff in any café.",
    suggested_vocab: ["en kaffe", "en kanelbulle", "här", "ta med", "betala", "kortet"],
    key_vocabulary: [
      {
        swedish: "en kaffe",
        english: "a coffee",
        example_sv: "Jag tar en kaffe, tack.",
        example_en: "I'll have a coffee, please.",
        pronunciation_tip: "Stress on the last syllable: ka-FFE."
      },
      {
        swedish: "kanelbulle",
        english: "cinnamon bun",
        example_sv: "En kanelbulle också, tack.",
        example_en: "A cinnamon bun too, please.",
        pronunciation_tip: "Four syllables: ka-NEL-bul-le."
      },
      {
        swedish: "ta med",
        english: "to take away",
        example_sv: "Jag vill ta med, tack.",
        example_en: "I want it to take away, please.",
        pronunciation_tip: "Short a in 'ta', like 'tah'."
      },
      {
        swedish: "betala",
        english: "to pay",
        example_sv: "Kan jag betala med kort?",
        example_en: "Can I pay by card?",
        pronunciation_tip: "Stress on the middle: be-TA-la."
      },
      {
        swedish: "kort",
        english: "card",
        example_sv: "Jag betalar med kort.",
        example_en: "I'm paying by card.",
        pronunciation_tip: "The o sounds like 'oo' in 'door': koort."
      },
      {
        swedish: "mjölk",
        english: "milk",
        example_sv: "Med mjölk, tack.",
        example_en: "With milk, please.",
        pronunciation_tip: "The j is like English y: 'myulk'."
      }
    ],
    key_phrases: [
      {
        situation_en: "Ordering your drink",
        phrase_sv: "Jag tar en kaffe, tack.",
        phrase_en: "I'll have a coffee, please.",
        pronunciation_tip: "Say 'tack' with a short a, like 'tuck'."
      },
      {
        situation_en: "Adding a pastry to the order",
        phrase_sv: "Och en kanelbulle, tack.",
        phrase_en: "And a cinnamon bun, please.",
        pronunciation_tip: "'Och' often sounds like just 'å' (aw)."
      },
      {
        situation_en: "Answering eat-in or takeaway",
        phrase_sv: "Jag äter här.",
        phrase_en: "I'm eating here.",
        pronunciation_tip: "'Äter' starts like the e in 'air': EH-ter."
      },
      {
        situation_en: "Asking to pay by card",
        phrase_sv: "Kan jag betala med kort?",
        phrase_en: "Can I pay by card?",
        pronunciation_tip: "Rising tone at the end for the question."
      },
      {
        situation_en: "When something is sold out and you accept another option",
        phrase_sv: "Okej, då tar jag den istället.",
        phrase_en: "Okay, then I'll take that one instead.",
        pronunciation_tip: "'Istället' has stress in the middle: i-STEL-let."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Jag tar en kaffe och en ___, tack.",
        prompt_en: "I'll have a coffee and a ___, please.",
        expected_answer_sv: "kanelbulle",
        expected_answer_en: "cinnamon bun",
        options: ["kanelbulle", "mjölk", "kort", "vatten"],
        hint_en: "The classic Swedish fika pastry."
      },
      {
        type: "quick_response",
        prompt_sv: "Vill du äta här eller ta med?",
        prompt_en: "Do you want to eat here or take away?",
        expected_answer_sv: "Jag äter här, tack.",
        expected_answer_en: "I'm eating here, thanks.",
        hint_en: "Choose 'här' (here) or 'ta med' (take away).",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Tyvärr, kanelbullarna är slut. Vill du ha en chokladboll?",
        prompt_en: "Sorry, the cinnamon buns are sold out. Would you like a chocolate ball?",
        expected_answer_sv: "Ja tack, då tar jag den istället.",
        expected_answer_en: "Yes please, I'll take that one instead.",
        hint_en: "Accept the other pastry with 'istället' (instead).",
        options: null
      }
    ]
  },
  "Hälsa och presentera dig": {
    description_en: "Meet a new neighbour in the stairwell and introduce yourself: your name, where you are from, and how long you have lived in Sweden.",
    opener_sv: "Hej! Jag heter Svea. Jag bor på våning tre. Är du ny här?",
    opener_en: "Hi! My name is Svea. I live on the third floor. Are you new here?",
    goal: "Greet your neighbour, say your name, where you are from, and how long you have been in Sweden.",
    success_criteria: [
      "Greet and say your name",
      "Say which country you are from",
      "Say how long you have been in Sweden"
    ],
    curveballs: [
      "Svea asks which floor you live on",
      "Svea asks if you like living in Sweden",
      "Svea says your name is nice and asks you to repeat it"
    ],
    cultural_notes: "Swedes usually keep first meetings short and friendly, and everyone uses first names — even with strangers.",
    suggested_vocab: ["jag heter", "jag kommer från", "granne", "bor", "trevligt", "ett år"],
    key_vocabulary: [
      {
        swedish: "heta",
        english: "to be called",
        example_sv: "Jag heter Amir.",
        example_en: "My name is Amir.",
        pronunciation_tip: "Long e: HE-ta, like 'hey-ta'."
      },
      {
        swedish: "komma från",
        english: "to come from",
        example_sv: "Jag kommer från Indien.",
        example_en: "I come from India.",
        pronunciation_tip: "'Från' rhymes with 'lawn': frawn."
      },
      {
        swedish: "granne",
        english: "neighbour",
        example_sv: "Du är min nya granne.",
        example_en: "You are my new neighbour.",
        pronunciation_tip: "Short a and double n: GRAN-ne."
      },
      {
        swedish: "bo",
        english: "to live (in a place)",
        example_sv: "Jag bor på våning två.",
        example_en: "I live on the second floor.",
        pronunciation_tip: "Long o, like 'boo'."
      },
      {
        swedish: "trevlig",
        english: "nice, pleasant",
        example_sv: "Trevligt att träffas!",
        example_en: "Nice to meet you!",
        pronunciation_tip: "The g is soft: TREV-lee."
      },
      {
        swedish: "ett år",
        english: "one year",
        example_sv: "Jag har bott här i ett år.",
        example_en: "I have lived here for one year.",
        pronunciation_tip: "'År' sounds like 'oar'."
      }
    ],
    key_phrases: [
      {
        situation_en: "Saying your name",
        phrase_sv: "Hej! Jag heter Amir.",
        phrase_en: "Hi! My name is Amir.",
        pronunciation_tip: "'Hej' sounds like English 'hey'."
      },
      {
        situation_en: "Saying where you are from",
        phrase_sv: "Jag kommer från Indien.",
        phrase_en: "I come from India.",
        pronunciation_tip: "Stress 'kommer': KOM-mer."
      },
      {
        situation_en: "Saying how long you have been in Sweden",
        phrase_sv: "Jag har bott i Sverige i två år.",
        phrase_en: "I have lived in Sweden for two years.",
        pronunciation_tip: "'Sverige' sounds like 'SVER-ye'."
      },
      {
        situation_en: "Responding when you meet someone new",
        phrase_sv: "Trevligt att träffas!",
        phrase_en: "Nice to meet you!",
        pronunciation_tip: "'Träffas' has a short e sound: TREF-fas."
      },
      {
        situation_en: "Answering if you like it in Sweden",
        phrase_sv: "Ja, jag trivs bra här.",
        phrase_en: "Yes, I like it here.",
        pronunciation_tip: "'Trivs' is one quick syllable: treevs."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Hej! Jag ___ Amir. Trevligt att träffas!",
        prompt_en: "Hi! My name ___ Amir. Nice to meet you!",
        expected_answer_sv: "heter",
        expected_answer_en: "am called",
        options: ["heter", "bor", "kommer", "trivs"],
        hint_en: "The verb Swedes use to say their name.",
      },
      {
        type: "quick_response",
        prompt_sv: "Var kommer du ifrån?",
        prompt_en: "Where do you come from?",
        expected_answer_sv: "Jag kommer från Indien.",
        expected_answer_en: "I come from India.",
        hint_en: "Answer with 'Jag kommer från' + your country.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Trivs du i Sverige?",
        prompt_en: "Do you like it in Sweden?",
        expected_answer_sv: "Ja, jag trivs bra här.",
        expected_answer_en: "Yes, I like it here.",
        hint_en: "Use the verb 'trivs' in your answer.",
        options: null
      }
    ]
  },
  "Köpa mat i mataffären": {
    description_en: "Ask a staff member at ICA where the milk is, understand the aisle number, and pay at the checkout.",
    opener_sv: "Hej! Kan jag hjälpa dig med något?",
    opener_en: "Hi! Can I help you with something?",
    goal: "Find the milk by asking staff, understand where it is, and pay for your food at the checkout.",
    success_criteria: [
      "Ask where the milk is",
      "Understand and repeat the aisle or direction",
      "Pay at the checkout and answer if you want a bag"
    ],
    curveballs: [
      "Svea asks if you want a bag at the checkout",
      "The milk you want is sold out and Svea suggests another brand",
      "Svea asks if you have a member card"
    ],
    cultural_notes: "In Swedish supermarkets you usually bag your own groceries, and bags cost a few kronor extra.",
    suggested_vocab: ["mjölken", "var finns", "hylla", "kassan", "en påse", "det blir"],
    key_vocabulary: [
      {
        swedish: "mjölk",
        english: "milk",
        example_sv: "Var finns mjölken?",
        example_en: "Where is the milk?",
        pronunciation_tip: "The j is like y: 'myulk'."
      },
      {
        swedish: "hylla",
        english: "shelf, aisle",
        example_sv: "Mjölken står på hylla fem.",
        example_en: "The milk is on aisle five.",
        pronunciation_tip: "Double l, short y: HYL-la."
      },
      {
        swedish: "kassa",
        english: "checkout",
        example_sv: "Du betalar i kassan.",
        example_en: "You pay at the checkout.",
        pronunciation_tip: "Short a sounds: KAS-sa."
      },
      {
        swedish: "påse",
        english: "bag",
        example_sv: "Vill du ha en påse?",
        example_en: "Do you want a bag?",
        pronunciation_tip: "'På' sounds like 'paw': PAW-se."
      },
      {
        swedish: "längst bort",
        english: "at the far end",
        example_sv: "Mjölken finns längst bort.",
        example_en: "The milk is at the far end.",
        pronunciation_tip: "'Längst' sounds like 'lengst'."
      },
      {
        swedish: "slut",
        english: "sold out, finished",
        example_sv: "Den mjölken är tyvärr slut.",
        example_en: "That milk is unfortunately sold out.",
        pronunciation_tip: "Long u, like 'sloot'."
      }
    ],
    key_phrases: [
      {
        situation_en: "Asking where an item is",
        phrase_sv: "Ursäkta, var finns mjölken?",
        phrase_en: "Excuse me, where is the milk?",
        pronunciation_tip: "'Ursäkta' is or-SHEK-ta."
      },
      {
        situation_en: "Checking you understood the directions",
        phrase_sv: "Hylla fem, längst bort?",
        phrase_en: "Aisle five, at the far end?",
        pronunciation_tip: "Repeat with rising tone to confirm."
      },
      {
        situation_en: "Thanking someone for help",
        phrase_sv: "Tack för hjälpen!",
        phrase_en: "Thanks for the help!",
        pronunciation_tip: "'Hjälpen' — the h is silent: YEL-pen."
      },
      {
        situation_en: "Answering about a bag at the checkout",
        phrase_sv: "Ja tack, en påse.",
        phrase_en: "Yes please, one bag.",
        pronunciation_tip: "Keep it short — this is normal in Sweden."
      },
      {
        situation_en: "Saying you will pay by card",
        phrase_sv: "Jag betalar med kort.",
        phrase_en: "I'm paying by card.",
        pronunciation_tip: "'Kort' has a long o: koort."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Ursäkta, var ___ mjölken?",
        prompt_en: "Excuse me, where ___ the milk?",
        expected_answer_sv: "finns",
        expected_answer_en: "is",
        options: ["finns", "heter", "kostar", "betalar"],
        hint_en: "The verb for asking where something is located.",
      },
      {
        type: "quick_response",
        prompt_sv: "Vill du ha en påse?",
        prompt_en: "Do you want a bag?",
        expected_answer_sv: "Ja tack, en påse.",
        expected_answer_en: "Yes please, one bag.",
        hint_en: "Answer yes or no — 'ja tack' or 'nej tack'.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Den mjölken är slut, men vi har en annan. Går det bra?",
        prompt_en: "That milk is sold out, but we have another one. Is that okay?",
        expected_answer_sv: "Ja, det går bra.",
        expected_answer_en: "Yes, that's fine.",
        hint_en: "Accept with 'det går bra' (that works).",
        options: null
      }
    ]
  },
  "Fråga efter vägen": {
    description_en: "Stop a passer-by near the central station and ask for directions to the pharmacy.",
    opener_sv: "Ja, hej? Kan jag hjälpa dig?",
    opener_en: "Yes, hi? Can I help you?",
    goal: "Politely stop someone, ask where the pharmacy is, and understand simple directions.",
    success_criteria: [
      "Stop someone politely with 'ursäkta'",
      "Ask where the pharmacy is",
      "Repeat the directions to check you understood"
    ],
    curveballs: [
      "Svea speaks fast and you must ask her to repeat slowly",
      "Svea says the pharmacy is closed and points you to another one",
      "Svea asks if you want to walk or take the bus"
    ],
    cultural_notes: "'Ursäkta' is the polite way to stop a stranger in Sweden — no titles or 'sir/madam' are needed.",
    suggested_vocab: ["ursäkta", "apoteket", "till vänster", "till höger", "rakt fram", "långsamt"],
    key_vocabulary: [
      {
        swedish: "apotek",
        english: "pharmacy",
        example_sv: "Var ligger apoteket?",
        example_en: "Where is the pharmacy?",
        pronunciation_tip: "Stress the last syllable: a-po-TEK."
      },
      {
        swedish: "till vänster",
        english: "to the left",
        example_sv: "Gå till vänster vid banken.",
        example_en: "Go left at the bank.",
        pronunciation_tip: "'Vänster' sounds like 'VEN-ster'."
      },
      {
        swedish: "till höger",
        english: "to the right",
        example_sv: "Apoteket ligger till höger.",
        example_en: "The pharmacy is on the right.",
        pronunciation_tip: "The g is soft: 'HUH-ger'."
      },
      {
        swedish: "rakt fram",
        english: "straight ahead",
        example_sv: "Gå rakt fram i två minuter.",
        example_en: "Go straight ahead for two minutes.",
        pronunciation_tip: "Both words are short and clipped."
      },
      {
        swedish: "nära",
        english: "near, close",
        example_sv: "Är det nära?",
        example_en: "Is it close?",
        pronunciation_tip: "Long ä, like the e in 'air': NAIR-a."
      },
      {
        swedish: "långsamt",
        english: "slowly",
        example_sv: "Kan du prata långsamt?",
        example_en: "Can you speak slowly?",
        pronunciation_tip: "'Lång' rhymes with 'song': LONG-samt."
      }
    ],
    key_phrases: [
      {
        situation_en: "Stopping a stranger politely",
        phrase_sv: "Ursäkta, kan jag fråga en sak?",
        phrase_en: "Excuse me, can I ask you something?",
        pronunciation_tip: "'Ursäkta' is or-SHEK-ta."
      },
      {
        situation_en: "Asking where a place is",
        phrase_sv: "Var ligger apoteket?",
        phrase_en: "Where is the pharmacy?",
        pronunciation_tip: "'Ligger' has a hard g: LIG-ger."
      },
      {
        situation_en: "Asking someone to speak slowly",
        phrase_sv: "Kan du prata lite långsammare?",
        phrase_en: "Can you speak a little more slowly?",
        pronunciation_tip: "Stress 'långsammare': long-SAM-ma-re."
      },
      {
        situation_en: "Checking you understood the directions",
        phrase_sv: "Rakt fram och sedan till vänster?",
        phrase_en: "Straight ahead and then to the left?",
        pronunciation_tip: "'Sedan' often sounds like 'sen'."
      },
      {
        situation_en: "Asking how far it is",
        phrase_sv: "Är det långt dit?",
        phrase_en: "Is it far from here?",
        pronunciation_tip: "'Dit' means 'to there' — say it like 'deet'."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "___, var ligger apoteket?",
        prompt_en: "___, where is the pharmacy?",
        expected_answer_sv: "Ursäkta",
        expected_answer_en: "Excuse me",
        options: ["Ursäkta", "Hejdå", "Tack", "Varsågod"],
        hint_en: "The polite word to stop a stranger.",
      },
      {
        type: "quick_response",
        prompt_sv: "Gå rakt fram, sväng vänster vid banken, sen höger, sen... förstår du?",
        prompt_en: "Go straight ahead, turn left at the bank, then right, then... do you understand?",
        expected_answer_sv: "Förlåt, kan du prata lite långsammare?",
        expected_answer_en: "Sorry, can you speak a little more slowly?",
        hint_en: "Ask her to slow down.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Det apoteket är stängt idag. Men det finns ett till vid torget.",
        prompt_en: "That pharmacy is closed today. But there is another one by the square.",
        expected_answer_sv: "Okej, tack! Hur går jag till torget?",
        expected_answer_en: "Okay, thanks! How do I walk to the square?",
        hint_en: "Ask for directions to the other pharmacy.",
        options: null
      }
    ]
  },
  "Beställa mat på restaurang": {
    description_en: "Sit down at a lunch restaurant, order a main dish and water, and ask for the bill.",
    opener_sv: "Hej och välkommen! Vill du beställa?",
    opener_en: "Hi and welcome! Would you like to order?",
    goal: "Order a main dish and water, and ask for the bill when you are done.",
    success_criteria: [
      "Order a main dish from the menu",
      "Ask for water",
      "Ask for the bill"
    ],
    curveballs: [
      "The dish you want is finished and Svea recommends today's special",
      "Svea asks if you have any allergies",
      "Svea asks if everything tasted good"
    ],
    cultural_notes: "At Swedish lunch restaurants, tap water is free and 'dagens rätt' (dish of the day) is the cheap standard choice.",
    suggested_vocab: ["menyn", "dagens rätt", "vatten", "notan", "beställa", "god"],
    key_vocabulary: [
      {
        swedish: "beställa",
        english: "to order",
        example_sv: "Jag vill beställa nu.",
        example_en: "I want to order now.",
        pronunciation_tip: "Stress the middle: be-STEL-la."
      },
      {
        swedish: "dagens rätt",
        english: "dish of the day",
        example_sv: "Jag tar dagens rätt.",
        example_en: "I'll have the dish of the day.",
        pronunciation_tip: "'Rätt' has a short e sound: ret."
      },
      {
        swedish: "vatten",
        english: "water",
        example_sv: "Ett glas vatten, tack.",
        example_en: "A glass of water, please.",
        pronunciation_tip: "Short a, double t: VAT-ten."
      },
      {
        swedish: "notan",
        english: "the bill",
        example_sv: "Kan jag få notan?",
        example_en: "Can I have the bill?",
        pronunciation_tip: "Long o: NOO-tan."
      },
      {
        swedish: "allergisk",
        english: "allergic",
        example_sv: "Jag är allergisk mot nötter.",
        example_en: "I am allergic to nuts.",
        pronunciation_tip: "Stress: al-LER-gisk."
      },
      {
        swedish: "gott",
        english: "tasty, good (about food)",
        example_sv: "Det var jättegott!",
        example_en: "It was very tasty!",
        pronunciation_tip: "Short o, double t: got."
      }
    ],
    key_phrases: [
      {
        situation_en: "Ordering your food",
        phrase_sv: "Jag tar dagens rätt, tack.",
        phrase_en: "I'll have the dish of the day, please.",
        pronunciation_tip: "'Jag tar' is the everyday way to order."
      },
      {
        situation_en: "Asking for water",
        phrase_sv: "Kan jag få ett glas vatten?",
        phrase_en: "Can I have a glass of water?",
        pronunciation_tip: "'Få' sounds like 'faw'."
      },
      {
        situation_en: "Answering about allergies",
        phrase_sv: "Nej, jag är inte allergisk mot något.",
        phrase_en: "No, I'm not allergic to anything.",
        pronunciation_tip: "'Något' often sounds like 'NÅTT' in speech."
      },
      {
        situation_en: "Saying the food was good",
        phrase_sv: "Det var jättegott, tack.",
        phrase_en: "It was very tasty, thanks.",
        pronunciation_tip: "'Jätte' means 'very': YET-te."
      },
      {
        situation_en: "Asking for the bill",
        phrase_sv: "Kan jag få notan, tack?",
        phrase_en: "Can I have the bill, please?",
        pronunciation_tip: "Rising tone at the end."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Kan jag få ___, tack? Jag vill betala.",
        prompt_en: "Can I have ___, please? I want to pay.",
        expected_answer_sv: "notan",
        expected_answer_en: "the bill",
        options: ["notan", "menyn", "vatten", "maten"],
        hint_en: "What you ask for when you want to pay.",
      },
      {
        type: "quick_response",
        prompt_sv: "Är du allergisk mot något?",
        prompt_en: "Are you allergic to anything?",
        expected_answer_sv: "Nej, jag är inte allergisk mot något.",
        expected_answer_en: "No, I'm not allergic to anything.",
        hint_en: "Answer yes or no about allergies.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Tyvärr är fisken slut. Men dagens rätt är köttbullar. Den är jättegod!",
        prompt_en: "Sorry, the fish is finished. But the dish of the day is meatballs. It's very good!",
        expected_answer_sv: "Okej, då tar jag dagens rätt istället.",
        expected_answer_en: "Okay, then I'll have the dish of the day instead.",
        hint_en: "Accept the recommendation with 'istället'.",
        options: null
      }
    ]
  },
  "Köpa bussbiljett": {
    description_en: "Buy a single bus ticket to the city centre and ask the driver about the price and how to pay.",
    opener_sv: "Hej! Vart ska du?",
    opener_en: "Hi! Where are you going?",
    goal: "Ask how much a single ticket costs, check that you can pay by card, and confirm the bus goes to the city centre.",
    success_criteria: [
      "Say where you are going",
      "Ask what a single ticket costs",
      "Ask if you can pay by card"
    ],
    curveballs: [
      "The bus does not take cash and Svea points to the card reader",
      "Svea says this bus does not go to the centre and tells you which one does",
      "Svea asks if you want a single ticket or a 24-hour ticket"
    ],
    cultural_notes: "Most Swedish buses are cashless, so you pay with a card, an app, or a travel card — never with coins.",
    suggested_vocab: ["en biljett", "enkel", "centrum", "kosta", "med kort", "kontanter"],
    key_vocabulary: [
      {
        swedish: "biljett",
        english: "ticket",
        example_sv: "En biljett till centrum, tack.",
        example_en: "One ticket to the centre, please.",
        pronunciation_tip: "Stress the end: bil-YET."
      },
      {
        swedish: "enkel",
        english: "single (ticket)",
        example_sv: "Jag vill ha en enkel biljett.",
        example_en: "I want a single ticket.",
        pronunciation_tip: "Stress the first syllable: EN-kel."
      },
      {
        swedish: "centrum",
        english: "city centre",
        example_sv: "Går bussen till centrum?",
        example_en: "Does the bus go to the centre?",
        pronunciation_tip: "The c is like s: SEN-trum."
      },
      {
        swedish: "kosta",
        english: "to cost",
        example_sv: "Vad kostar en biljett?",
        example_en: "How much does a ticket cost?",
        pronunciation_tip: "Short o: KOS-ta."
      },
      {
        swedish: "kontanter",
        english: "cash",
        example_sv: "Vi tar inte kontanter.",
        example_en: "We don't take cash.",
        pronunciation_tip: "Stress the middle: kon-TAN-ter."
      },
      {
        swedish: "hållplats",
        english: "bus stop",
        example_sv: "Vilken hållplats ska jag gå av på?",
        example_en: "Which stop should I get off at?",
        pronunciation_tip: "'Håll' sounds like 'hall': HOLL-plats."
      }
    ],
    key_phrases: [
      {
        situation_en: "Saying where you are going",
        phrase_sv: "Jag ska till centrum.",
        phrase_en: "I'm going to the centre.",
        pronunciation_tip: "'Ska' is short and quick: skah."
      },
      {
        situation_en: "Asking the price",
        phrase_sv: "Vad kostar en enkel biljett?",
        phrase_en: "How much is a single ticket?",
        pronunciation_tip: "'Vad' often sounds like 'va' in speech."
      },
      {
        situation_en: "Asking about paying by card",
        phrase_sv: "Kan jag betala med kort?",
        phrase_en: "Can I pay by card?",
        pronunciation_tip: "Rising tone at the end."
      },
      {
        situation_en: "Checking the bus goes to your stop",
        phrase_sv: "Går den här bussen till centrum?",
        phrase_en: "Does this bus go to the centre?",
        pronunciation_tip: "'Går' sounds like 'gore'."
      },
      {
        situation_en: "Choosing a single ticket",
        phrase_sv: "En enkel, tack.",
        phrase_en: "A single, please.",
        pronunciation_tip: "Short answers are completely normal."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Vad ___ en enkel biljett till centrum?",
        prompt_en: "How much ___ a single ticket to the centre?",
        expected_answer_sv: "kostar",
        expected_answer_en: "costs",
        options: ["kostar", "betalar", "går", "heter"],
        hint_en: "The verb for asking a price.",
      },
      {
        type: "quick_response",
        prompt_sv: "Vi tar inte kontanter. Du kan betala med kort där.",
        prompt_en: "We don't take cash. You can pay by card there.",
        expected_answer_sv: "Okej, jag betalar med kort.",
        expected_answer_en: "Okay, I'll pay by card.",
        hint_en: "Say you will pay by card.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Den här bussen går inte till centrum. Du ska ta buss fyra.",
        prompt_en: "This bus doesn't go to the centre. You should take bus four.",
        expected_answer_sv: "Okej, tack! Var stannar buss fyra?",
        expected_answer_en: "Okay, thanks! Where does bus four stop?",
        hint_en: "Thank the driver and ask where the right bus stops.",
        options: null
      }
    ]
  },
  "Fråga om öppettider": {
    description_en: "Call a shop and ask when they open on Saturday and what time they close.",
    opener_sv: "Hej, det här är Lindqvists butik. Hur kan jag hjälpa dig?",
    opener_en: "Hi, this is Lindqvist's shop. How can I help you?",
    goal: "Ask what time the shop opens on Saturday and confirm when it closes.",
    success_criteria: [
      "Ask when the shop opens on Saturday",
      "Ask when the shop closes",
      "Repeat the times to confirm you understood"
    ],
    curveballs: [
      "The shop closes early on Saturday and Svea gives a different time than usual",
      "Svea asks if you are looking for something special",
      "The shop is closed on Sunday and Svea mentions it"
    ],
    cultural_notes: "Many small Swedish shops close early on Saturdays and are fully closed on Sundays, so people always check 'lördagsöppet'.",
    suggested_vocab: ["öppnar", "stänger", "på lördag", "klockan", "öppettider", "stängt"],
    key_vocabulary: [
      {
        swedish: "öppna",
        english: "to open",
        example_sv: "När öppnar ni på lördag?",
        example_en: "When do you open on Saturday?",
        pronunciation_tip: "'Ö' is like the u in 'fur': UHP-na."
      },
      {
        swedish: "stänga",
        english: "to close",
        example_sv: "När stänger ni idag?",
        example_en: "When do you close today?",
        pronunciation_tip: "'Stänger' sounds like 'STENG-er'."
      },
      {
        swedish: "lördag",
        english: "Saturday",
        example_sv: "Har ni öppet på lördag?",
        example_en: "Are you open on Saturday?",
        pronunciation_tip: "'Lör' rhymes with 'fur': LUHR-dag."
      },
      {
        swedish: "klockan",
        english: "at ... o'clock",
        example_sv: "Vi öppnar klockan tio.",
        example_en: "We open at ten o'clock.",
        pronunciation_tip: "Often shortened to 'klockan tio' → 'klockan TI-o'."
      },
      {
        swedish: "öppettider",
        english: "opening hours",
        example_sv: "Vad har ni för öppettider?",
        example_en: "What are your opening hours?",
        pronunciation_tip: "Two parts: ÖPP-et-TI-der."
      },
      {
        swedish: "stängt",
        english: "closed",
        example_sv: "Vi har stängt på söndag.",
        example_en: "We are closed on Sunday.",
        pronunciation_tip: "One short syllable: stengt."
      }
    ],
    key_phrases: [
      {
        situation_en: "Starting the phone call",
        phrase_sv: "Hej! Jag har en fråga om era öppettider.",
        phrase_en: "Hi! I have a question about your opening hours.",
        pronunciation_tip: "'Era' means 'your' (to a shop): EH-ra."
      },
      {
        situation_en: "Asking when they open",
        phrase_sv: "När öppnar ni på lördag?",
        phrase_en: "When do you open on Saturday?",
        pronunciation_tip: "'Ni' means 'you' when talking to a business."
      },
      {
        situation_en: "Asking when they close",
        phrase_sv: "Och när stänger ni?",
        phrase_en: "And when do you close?",
        pronunciation_tip: "'Och' often sounds like 'å'."
      },
      {
        situation_en: "Confirming the times",
        phrase_sv: "Så ni har öppet från tio till tre?",
        phrase_en: "So you are open from ten to three?",
        pronunciation_tip: "'Från ... till' means 'from ... to'."
      },
      {
        situation_en: "Ending the call politely",
        phrase_sv: "Tack så mycket! Hej då!",
        phrase_en: "Thank you very much! Goodbye!",
        pronunciation_tip: "'Hej då' is hey-DAW."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "När ___ ni på lördag?",
        prompt_en: "When do you ___ on Saturday?",
        expected_answer_sv: "öppnar",
        expected_answer_en: "open",
        options: ["öppnar", "stänger", "kostar", "kommer"],
        hint_en: "The verb for when a shop starts the day.",
      },
      {
        type: "quick_response",
        prompt_sv: "Vi öppnar klockan tio, men på lördag stänger vi redan klockan tre.",
        prompt_en: "We open at ten, but on Saturday we close as early as three.",
        expected_answer_sv: "Okej, så ni har öppet från tio till tre på lördag?",
        expected_answer_en: "Okay, so you are open from ten to three on Saturday?",
        hint_en: "Repeat the times back to confirm.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Letar du efter något speciellt?",
        prompt_en: "Are you looking for something special?",
        expected_answer_sv: "Nej tack, jag ville bara fråga om öppettiderna.",
        expected_answer_en: "No thanks, I just wanted to ask about the opening hours.",
        hint_en: "Say you only wanted to know the hours.",
        options: null
      }
    ]
  },
  "Beställa taxi": {
    description_en: "Call a taxi company and book a ride to the airport for tomorrow morning, giving your address, time, and phone number.",
    opener_sv: "Taxi Stockholm, hej! Vad kan jag hjälpa dig med?",
    opener_en: "Taxi Stockholm, hi! How can I help you?",
    goal: "Book a taxi to the airport for tomorrow morning and give your address, pickup time, and phone number.",
    success_criteria: [
      "Say you want a taxi to the airport tomorrow morning",
      "Give your address and pickup time",
      "Give your phone number clearly"
    ],
    curveballs: [
      "Svea asks you to repeat your phone number more slowly",
      "The time you want is busy and Svea offers 15 minutes earlier",
      "Svea asks how many people are travelling"
    ],
    cultural_notes: "In Sweden you say phone numbers digit by digit or in pairs, so practise your numbers before calling.",
    suggested_vocab: ["en taxi", "flygplatsen", "imorgon bitti", "adressen", "telefonnummer", "klockan sju"],
    key_vocabulary: [
      {
        swedish: "flygplats",
        english: "airport",
        example_sv: "Jag ska till flygplatsen.",
        example_en: "I'm going to the airport.",
        pronunciation_tip: "'Flyg' has a y like French u: FLEEG-plats."
      },
      {
        swedish: "imorgon bitti",
        english: "tomorrow morning",
        example_sv: "Jag behöver en taxi imorgon bitti.",
        example_en: "I need a taxi tomorrow morning.",
        pronunciation_tip: "'Bitti' is BIT-ti — very common in speech."
      },
      {
        swedish: "adress",
        english: "address",
        example_sv: "Min adress är Storgatan 5.",
        example_en: "My address is Storgatan 5.",
        pronunciation_tip: "Stress the end: a-DRESS."
      },
      {
        swedish: "telefonnummer",
        english: "phone number",
        example_sv: "Mitt telefonnummer är 070-123 45 67.",
        example_en: "My phone number is 070-123 45 67.",
        pronunciation_tip: "Say it in parts: te-le-FON-num-mer."
      },
      {
        swedish: "hämta",
        english: "to pick up",
        example_sv: "Kan ni hämta mig klockan sju?",
        example_en: "Can you pick me up at seven?",
        pronunciation_tip: "'Hämta' sounds like 'HEM-ta'."
      },
      {
        swedish: "behöva",
        english: "to need",
        example_sv: "Jag behöver en taxi.",
        example_en: "I need a taxi.",
        pronunciation_tip: "Stress the middle: be-HUH-va."
      }
    ],
    key_phrases: [
      {
        situation_en: "Saying why you are calling",
        phrase_sv: "Hej! Jag vill boka en taxi till flygplatsen.",
        phrase_en: "Hi! I want to book a taxi to the airport.",
        pronunciation_tip: "'Boka' has a long o: BOO-ka."
      },
      {
        situation_en: "Saying when you want the taxi",
        phrase_sv: "Imorgon bitti, klockan sju.",
        phrase_en: "Tomorrow morning, at seven o'clock.",
        pronunciation_tip: "'Sju' is tricky — like 'hwoo' with round lips."
      },
      {
        situation_en: "Giving your address",
        phrase_sv: "Adressen är Storgatan 5.",
        phrase_en: "The address is Storgatan 5.",
        pronunciation_tip: "Street numbers come after the street name."
      },
      {
        situation_en: "Giving your phone number",
        phrase_sv: "Mitt nummer är noll sju noll, ett två tre, fyra fem, sex sju.",
        phrase_en: "My number is zero seven zero, one two three, four five, six seven.",
        pronunciation_tip: "Say the digits slowly in small groups."
      },
      {
        situation_en: "Accepting a different pickup time",
        phrase_sv: "Det går bra med kvart i sju.",
        phrase_en: "A quarter to seven works fine.",
        pronunciation_tip: "'Kvart i sju' = 6:45."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Hej! Jag vill ___ en taxi till flygplatsen imorgon bitti.",
        prompt_en: "Hi! I want to ___ a taxi to the airport tomorrow morning.",
        expected_answer_sv: "boka",
        expected_answer_en: "book",
        options: ["boka", "köpa", "hämta", "betala"],
        hint_en: "The verb for reserving a taxi or a table.",
      },
      {
        type: "quick_response",
        prompt_sv: "Kan du ta ditt telefonnummer igen, lite långsammare?",
        prompt_en: "Can you give your phone number again, a little more slowly?",
        expected_answer_sv: "Ja, noll sju noll, ett två tre, fyra fem, sex sju.",
        expected_answer_en: "Yes, zero seven zero, one two three, four five, six seven.",
        hint_en: "Repeat the number slowly, digit by digit.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Klockan sju är fullbokat. Går det bra kvart i sju istället?",
        prompt_en: "Seven o'clock is fully booked. Is a quarter to seven okay instead?",
        expected_answer_sv: "Ja, det går bra med kvart i sju.",
        expected_answer_en: "Yes, a quarter to seven works fine.",
        hint_en: "Accept the earlier time with 'det går bra'.",
        options: null
      }
    ]
  },
  "Boka bord": {
    description_en: "Call a restaurant and book a table for two people at 7 pm on Friday, giving your name for the booking.",
    opener_sv: "Restaurang Solsidan, hej! Hur kan jag hjälpa dig?",
    opener_en: "Restaurant Solsidan, hi! How can I help you?",
    goal: "Book a table for two people at 7 pm on Friday and give your name for the booking.",
    success_criteria: [
      "Say you want to book a table for two on Friday",
      "Say the time you want",
      "Give your name for the booking"
    ],
    curveballs: [
      "7 pm is full and Svea offers 8 pm instead",
      "Svea asks you to spell your name",
      "Svea asks if you want a table inside or outside"
    ],
    cultural_notes: "Swedes usually give times with the 24-hour clock on the phone, so 7 pm is often 'klockan nitton'.",
    suggested_vocab: ["boka bord", "två personer", "på fredag", "klockan sju", "i mitt namn", "bokstavera"],
    key_vocabulary: [
      {
        swedish: "boka",
        english: "to book",
        example_sv: "Jag vill boka ett bord.",
        example_en: "I want to book a table.",
        pronunciation_tip: "Long o: BOO-ka."
      },
      {
        swedish: "bord",
        english: "table",
        example_sv: "Ett bord för två, tack.",
        example_en: "A table for two, please.",
        pronunciation_tip: "The d is almost silent: boord."
      },
      {
        swedish: "person",
        english: "person",
        example_sv: "Vi är två personer.",
        example_en: "We are two people.",
        pronunciation_tip: "Stress the end: per-SOON."
      },
      {
        swedish: "fredag",
        english: "Friday",
        example_sv: "På fredag klockan sju.",
        example_en: "On Friday at seven o'clock.",
        pronunciation_tip: "'Fre' has a long e: FREH-dag."
      },
      {
        swedish: "namn",
        english: "name",
        example_sv: "Bokningen är i mitt namn.",
        example_en: "The booking is in my name.",
        pronunciation_tip: "One quick syllable: namn."
      },
      {
        swedish: "bokstavera",
        english: "to spell",
        example_sv: "Kan du bokstavera ditt namn?",
        example_en: "Can you spell your name?",
        pronunciation_tip: "Stress: bok-sta-VE-ra."
      }
    ],
    key_phrases: [
      {
        situation_en: "Saying why you are calling",
        phrase_sv: "Hej! Jag vill boka ett bord för två.",
        phrase_en: "Hi! I want to book a table for two.",
        pronunciation_tip: "'För två' — round your lips for 'ö'."
      },
      {
        situation_en: "Giving the day and time",
        phrase_sv: "På fredag klockan sju på kvällen.",
        phrase_en: "On Friday at seven in the evening.",
        pronunciation_tip: "'På kvällen' makes it clear you mean pm."
      },
      {
        situation_en: "Giving your name for the booking",
        phrase_sv: "Namnet är Amir.",
        phrase_en: "The name is Amir.",
        pronunciation_tip: "Simple and short — this is all they need."
      },
      {
        situation_en: "Accepting a different time",
        phrase_sv: "Klockan åtta går också bra.",
        phrase_en: "Eight o'clock also works.",
        pronunciation_tip: "'Åtta' sounds like 'OT-ta'."
      },
      {
        situation_en: "Confirming the booking at the end",
        phrase_sv: "Tack! Då ses vi på fredag.",
        phrase_en: "Thanks! See you on Friday then.",
        pronunciation_tip: "'Ses' means 'see each other': sehs."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Jag vill boka ett ___ för två personer på fredag.",
        prompt_en: "I want to book a ___ for two people on Friday.",
        expected_answer_sv: "bord",
        expected_answer_en: "table",
        options: ["bord", "rum", "namn", "glas"],
        hint_en: "What you sit at in a restaurant.",
      },
      {
        type: "quick_response",
        prompt_sv: "Klockan sju är tyvärr fullt. Går klockan åtta bra?",
        prompt_en: "Seven o'clock is unfortunately full. Does eight o'clock work?",
        expected_answer_sv: "Ja, klockan åtta går också bra.",
        expected_answer_en: "Yes, eight o'clock also works.",
        hint_en: "Accept the later time.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Vilket namn ska jag skriva? Kan du bokstavera?",
        prompt_en: "What name should I write? Can you spell it?",
        expected_answer_sv: "Amir. A-M-I-R.",
        expected_answer_en: "Amir. A-M-I-R.",
        hint_en: "Say your name and spell it letter by letter.",
        options: null
      }
    ]
  },
  "Prata om vädret": {
    description_en: "Make small talk with a colleague in the elevator about today's weather and the weekend forecast.",
    opener_sv: "Hej! Oj, vilket väder idag, va?",
    opener_en: "Hi! Wow, what weather today, right?",
    goal: "Comment on today's weather, ask about the weekend forecast, and react to the answer.",
    success_criteria: [
      "Say something about today's weather",
      "Ask what the weather will be like at the weekend",
      "React to the forecast with a short comment"
    ],
    curveballs: [
      "Svea says it will rain all weekend and waits for your reaction",
      "Svea asks if you like Swedish winters",
      "Svea says the sun is coming next week"
    ],
    cultural_notes: "Weather is the safest small-talk topic in Sweden, and a short 'va?' at the end invites you to agree.",
    suggested_vocab: ["vädret", "det regnar", "solen skiner", "kallt", "i helgen", "hoppas"],
    key_vocabulary: [
      {
        swedish: "väder",
        english: "weather",
        example_sv: "Vilket fint väder idag!",
        example_en: "What nice weather today!",
        pronunciation_tip: "Long ä: VAI-der."
      },
      {
        swedish: "regna",
        english: "to rain",
        example_sv: "Det regnar mycket idag.",
        example_en: "It's raining a lot today.",
        pronunciation_tip: "The g is soft: RENG-na."
      },
      {
        swedish: "sol",
        english: "sun",
        example_sv: "Solen skiner idag!",
        example_en: "The sun is shining today!",
        pronunciation_tip: "Long o: sool."
      },
      {
        swedish: "kallt",
        english: "cold",
        example_sv: "Det är kallt ute.",
        example_en: "It's cold outside.",
        pronunciation_tip: "Short a, double l: kalt."
      },
      {
        swedish: "helg",
        english: "weekend",
        example_sv: "Vad blir det för väder i helgen?",
        example_en: "What will the weather be like at the weekend?",
        pronunciation_tip: "The g is soft: hel-y."
      },
      {
        swedish: "hoppas",
        english: "to hope",
        example_sv: "Jag hoppas det blir sol.",
        example_en: "I hope it will be sunny.",
        pronunciation_tip: "Short o, double p: HOP-pas."
      }
    ],
    key_phrases: [
      {
        situation_en: "Commenting on nice weather",
        phrase_sv: "Ja, vilket fint väder idag!",
        phrase_en: "Yes, what nice weather today!",
        pronunciation_tip: "'Vilket' + adjective is how you exclaim."
      },
      {
        situation_en: "Commenting on bad weather",
        phrase_sv: "Ja, det regnar hela tiden.",
        phrase_en: "Yes, it rains all the time.",
        pronunciation_tip: "'Hela tiden' = all the time."
      },
      {
        situation_en: "Asking about the weekend forecast",
        phrase_sv: "Vad blir det för väder i helgen?",
        phrase_en: "What will the weather be like at the weekend?",
        pronunciation_tip: "'Blir' sounds like 'bleer'."
      },
      {
        situation_en: "Reacting to a bad forecast",
        phrase_sv: "Åh nej! Jag hoppas det blir bättre.",
        phrase_en: "Oh no! I hope it gets better.",
        pronunciation_tip: "'Bättre' sounds like 'BET-tre'."
      },
      {
        situation_en: "Reacting to a good forecast",
        phrase_sv: "Vad skönt! Då blir det en fin helg.",
        phrase_en: "How nice! Then it will be a nice weekend.",
        pronunciation_tip: "'Skönt' — sk before ö sounds like 'hw': hwuhnt."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Vad blir det för väder i ___?",
        prompt_en: "What will the weather be like at the ___?",
        expected_answer_sv: "helgen",
        expected_answer_en: "weekend",
        options: ["helgen", "vädret", "solen", "kassan"],
        hint_en: "Saturday and Sunday together.",
      },
      {
        type: "quick_response",
        prompt_sv: "Det ska tyvärr regna hela helgen.",
        prompt_en: "Unfortunately it's going to rain all weekend.",
        expected_answer_sv: "Åh nej! Jag hoppas det blir bättre nästa helg.",
        expected_answer_en: "Oh no! I hope it gets better next weekend.",
        hint_en: "React with 'Åh nej' and a hope for better weather.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Gillar du vintern i Sverige?",
        prompt_en: "Do you like the winter in Sweden?",
        expected_answer_sv: "Den är fin, men det är för kallt för mig!",
        expected_answer_en: "It's nice, but it's too cold for me!",
        hint_en: "Give a short honest answer about the cold.",
        options: null
      }
    ]
  },
  "Berätta om din familj": {
    description_en: "Answer a new SFI friend's questions about your family — parents, siblings, children, and where they live.",
    opener_sv: "Du, jag är nyfiken — har du familj här i Sverige?",
    opener_en: "Hey, I'm curious — do you have family here in Sweden?",
    goal: "Describe your family members and say where they live.",
    success_criteria: [
      "Say who is in your family",
      "Say where they live",
      "Ask your friend one question about their family"
    ],
    curveballs: [
      "Svea asks how old your children or siblings are",
      "Svea asks if you miss your family back home",
      "Svea shows a photo of her family and asks about yours"
    ],
    cultural_notes: "Swedes happily talk about family with new friends, but they ask open questions and never push if you keep it short.",
    suggested_vocab: ["familj", "syskon", "barn", "föräldrar", "de bor i", "saknar"],
    key_vocabulary: [
      {
        swedish: "familj",
        english: "family",
        example_sv: "Min familj bor i Iran.",
        example_en: "My family lives in Iran.",
        pronunciation_tip: "Stress the end: fa-MILL-y."
      },
      {
        swedish: "syskon",
        english: "sibling(s)",
        example_sv: "Jag har två syskon.",
        example_en: "I have two siblings.",
        pronunciation_tip: "'Sy' has the tight Swedish y: SYS-kon."
      },
      {
        swedish: "föräldrar",
        english: "parents",
        example_sv: "Mina föräldrar bor kvar hemma.",
        example_en: "My parents still live back home.",
        pronunciation_tip: "Four syllables: fuh-REL-drar."
      },
      {
        swedish: "barn",
        english: "child, children",
        example_sv: "Jag har ett barn, en dotter.",
        example_en: "I have one child, a daughter.",
        pronunciation_tip: "One syllable, silent r feel: bahn."
      },
      {
        swedish: "gift",
        english: "married",
        example_sv: "Jag är gift och har två barn.",
        example_en: "I am married and have two children.",
        pronunciation_tip: "Soft g, like y: yift."
      },
      {
        swedish: "sakna",
        english: "to miss (someone)",
        example_sv: "Jag saknar min mamma.",
        example_en: "I miss my mum.",
        pronunciation_tip: "Stress the first syllable: SAK-na."
      }
    ],
    key_phrases: [
      {
        situation_en: "Saying who is in your family",
        phrase_sv: "Jag har en fru och två barn.",
        phrase_en: "I have a wife and two children.",
        pronunciation_tip: "'Fru' has a long u: froo."
      },
      {
        situation_en: "Saying where your family lives",
        phrase_sv: "Mina föräldrar bor i Iran.",
        phrase_en: "My parents live in Iran.",
        pronunciation_tip: "'Bor i' + country/city."
      },
      {
        situation_en: "Talking about siblings",
        phrase_sv: "Jag har en bror och en syster.",
        phrase_en: "I have a brother and a sister.",
        pronunciation_tip: "'Bror' has a long o: broor."
      },
      {
        situation_en: "Saying you miss someone",
        phrase_sv: "Ja, jag saknar dem mycket.",
        phrase_en: "Yes, I miss them a lot.",
        pronunciation_tip: "'Dem' is pronounced 'dom'."
      },
      {
        situation_en: "Asking back about their family",
        phrase_sv: "Och du? Har du syskon?",
        phrase_en: "And you? Do you have siblings?",
        pronunciation_tip: "'Och du?' is the easy way to return a question."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Jag har en bror och en syster. Mina ___ bor i Iran.",
        prompt_en: "I have a brother and a sister. My ___ live in Iran.",
        expected_answer_sv: "föräldrar",
        expected_answer_en: "parents",
        options: ["föräldrar", "syskon", "barn", "grannar"],
        hint_en: "Your mum and dad together.",
      },
      {
        type: "quick_response",
        prompt_sv: "Hur gamla är dina barn?",
        prompt_en: "How old are your children?",
        expected_answer_sv: "Min dotter är fem år och min son är tre år.",
        expected_answer_en: "My daughter is five and my son is three.",
        hint_en: "Use '... år' after the numbers.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Saknar du din familj?",
        prompt_en: "Do you miss your family?",
        expected_answer_sv: "Ja, jag saknar dem mycket. Vi pratar varje vecka.",
        expected_answer_en: "Yes, I miss them a lot. We talk every week.",
        hint_en: "Answer honestly and add one detail.",
        options: null
      }
    ]
  },
  "Säga vad du gör på jobbet": {
    description_en: "At a mingle, answer what you do for a living: your job title, your employer, and one thing you like about the job.",
    opener_sv: "Trevligt att träffas! Vad jobbar du med?",
    opener_en: "Nice to meet you! What do you do for work?",
    goal: "Say your job, where you work, and one thing you like about your job.",
    success_criteria: [
      "Say your job title",
      "Say where you work",
      "Say one thing you like about the job"
    ],
    curveballs: [
      "Svea asks how long you have worked there",
      "Svea asks what you did before you came to Sweden",
      "Svea asks the same question back — 'Och du då?'"
    ],
    cultural_notes: "'Vad jobbar du med?' is a standard Swedish mingle question, and modest, short answers work better than long titles.",
    suggested_vocab: ["jag jobbar som", "på ett företag", "kollegor", "trivs", "sedan två år", "roligt"],
    key_vocabulary: [
      {
        swedish: "jobba",
        english: "to work",
        example_sv: "Jag jobbar som kock.",
        example_en: "I work as a chef.",
        pronunciation_tip: "Short o, double b: YOB-ba."
      },
      {
        swedish: "företag",
        english: "company",
        example_sv: "Jag jobbar på ett litet företag.",
        example_en: "I work at a small company.",
        pronunciation_tip: "Three parts: FUH-re-tag."
      },
      {
        swedish: "kollega",
        english: "colleague",
        example_sv: "Mina kollegor är trevliga.",
        example_en: "My colleagues are nice.",
        pronunciation_tip: "Stress the middle: kol-LE-ga."
      },
      {
        swedish: "trivas",
        english: "to enjoy / feel at home",
        example_sv: "Jag trivs på mitt jobb.",
        example_en: "I enjoy my job.",
        pronunciation_tip: "'Trivs' is one quick syllable: treevs."
      },
      {
        swedish: "roligt",
        english: "fun",
        example_sv: "Det är roligt att träffa kunder.",
        example_en: "It's fun to meet customers.",
        pronunciation_tip: "The g is soft: ROO-leet."
      },
      {
        swedish: "sedan",
        english: "since, for (time)",
        example_sv: "Jag har jobbat där sedan 2023.",
        example_en: "I have worked there since 2023.",
        pronunciation_tip: "Often shortened to 'sen' in speech."
      }
    ],
    key_phrases: [
      {
        situation_en: "Saying your job",
        phrase_sv: "Jag jobbar som kock.",
        phrase_en: "I work as a chef.",
        pronunciation_tip: "'Som' + job title, no article needed."
      },
      {
        situation_en: "Saying where you work",
        phrase_sv: "Jag jobbar på en restaurang i stan.",
        phrase_en: "I work at a restaurant in town.",
        pronunciation_tip: "'Stan' is short for 'staden' (the town)."
      },
      {
        situation_en: "Saying what you like about the job",
        phrase_sv: "Jag gillar mina kollegor.",
        phrase_en: "I like my colleagues.",
        pronunciation_tip: "'Gillar' is the everyday word for 'like'."
      },
      {
        situation_en: "Saying how long you have worked there",
        phrase_sv: "Jag har jobbat där i två år.",
        phrase_en: "I have worked there for two years.",
        pronunciation_tip: "'I två år' = for two years."
      },
      {
        situation_en: "Returning the question",
        phrase_sv: "Och du då? Vad jobbar du med?",
        phrase_en: "And you? What do you do for work?",
        pronunciation_tip: "'Och du då?' keeps the mingle going."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Jag jobbar ___ kock på en restaurang.",
        prompt_en: "I work ___ a chef at a restaurant.",
        expected_answer_sv: "som",
        expected_answer_en: "as",
        options: ["som", "med", "på", "till"],
        hint_en: "The little word before a job title.",
      },
      {
        type: "quick_response",
        prompt_sv: "Hur länge har du jobbat där?",
        prompt_en: "How long have you worked there?",
        expected_answer_sv: "Jag har jobbat där i två år.",
        expected_answer_en: "I have worked there for two years.",
        hint_en: "Use 'i' + number of years.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Vad gjorde du innan du kom till Sverige?",
        prompt_en: "What did you do before you came to Sweden?",
        expected_answer_sv: "Jag jobbade som lärare i mitt hemland.",
        expected_answer_en: "I worked as a teacher in my home country.",
        hint_en: "Past tense: 'jag jobbade som' + job.",
        options: null
      }
    ]
  },
  "Beställa i baren": {
    description_en: "Order a beer at a pub, ask the bartender for a local recommendation, and pay.",
    opener_sv: "Hej hej! Vad får det vara?",
    opener_en: "Hi there! What can I get you?",
    goal: "Order a beer, ask about a local specialty, and pay for your drink.",
    success_criteria: [
      "Order a beer",
      "Ask for a local recommendation",
      "Pay and say thank you"
    ],
    curveballs: [
      "Svea asks if you want a large or small beer",
      "Svea asks to see your ID",
      "Svea recommends a local beer and asks if you want to try it"
    ],
    cultural_notes: "In Sweden you order and pay at the bar right away, and staff may ask for ID ('leg') even if you look over 20.",
    suggested_vocab: ["en öl", "stor eller liten", "rekommendera", "något lokalt", "leg", "det blir bra"],
    key_vocabulary: [
      {
        swedish: "öl",
        english: "beer",
        example_sv: "En öl, tack.",
        example_en: "A beer, please.",
        pronunciation_tip: "Like the u in 'fur': uhl."
      },
      {
        swedish: "stor",
        english: "large",
        example_sv: "En stor öl, tack.",
        example_en: "A large beer, please.",
        pronunciation_tip: "Long o: stoor."
      },
      {
        swedish: "liten",
        english: "small",
        example_sv: "En liten går bra.",
        example_en: "A small one is fine.",
        pronunciation_tip: "Long i: LEE-ten."
      },
      {
        swedish: "rekommendera",
        english: "to recommend",
        example_sv: "Vad kan du rekommendera?",
        example_en: "What can you recommend?",
        pronunciation_tip: "Stress near the end: re-kom-men-DE-ra."
      },
      {
        swedish: "lokal",
        english: "local",
        example_sv: "Har ni något lokalt?",
        example_en: "Do you have anything local?",
        pronunciation_tip: "Stress the end: lo-KAL."
      },
      {
        swedish: "leg",
        english: "ID (colloquial)",
        example_sv: "Har du leg med dig?",
        example_en: "Do you have ID with you?",
        pronunciation_tip: "Short for 'legitimation': legg."
      }
    ],
    key_phrases: [
      {
        situation_en: "Ordering a beer",
        phrase_sv: "En stor öl, tack.",
        phrase_en: "A large beer, please.",
        pronunciation_tip: "Short and direct is perfectly polite."
      },
      {
        situation_en: "Asking for a recommendation",
        phrase_sv: "Vad rekommenderar du?",
        phrase_en: "What do you recommend?",
        pronunciation_tip: "Stress: re-kom-men-DE-rar."
      },
      {
        situation_en: "Asking about something local",
        phrase_sv: "Har ni någon lokal öl?",
        phrase_en: "Do you have any local beer?",
        pronunciation_tip: "'Någon' often sounds like 'NON' in speech."
      },
      {
        situation_en: "Showing your ID",
        phrase_sv: "Ja, här är mitt leg.",
        phrase_en: "Yes, here is my ID.",
        pronunciation_tip: "'Här är' flows together: 'hair-air'."
      },
      {
        situation_en: "Accepting the recommendation and paying",
        phrase_sv: "Den tar jag! Kan jag betala direkt?",
        phrase_en: "I'll take that one! Can I pay right away?",
        pronunciation_tip: "'Direkt' has stress at the end: di-REKT."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Vad ___ du? Något lokalt?",
        prompt_en: "What do you ___? Something local?",
        expected_answer_sv: "rekommenderar",
        expected_answer_en: "recommend",
        options: ["rekommenderar", "betalar", "beställer", "dricker"],
        hint_en: "The verb for asking a tip from the bartender.",
      },
      {
        type: "quick_response",
        prompt_sv: "Stor eller liten?",
        prompt_en: "Large or small?",
        expected_answer_sv: "En stor, tack.",
        expected_answer_en: "A large one, please.",
        hint_en: "Pick a size and add 'tack'.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Kan jag få se ditt leg?",
        prompt_en: "Can I see your ID?",
        expected_answer_sv: "Ja, självklart. Här är mitt leg.",
        expected_answer_en: "Yes, of course. Here is my ID.",
        hint_en: "Agree and hand over your ID.",
        options: null
      }
    ]
  },
  "Berätta om din helg": {
    description_en: "Answer a colleague's Monday question 'Hur var helgen?' — share one thing you did and ask about their weekend.",
    opener_sv: "God morgon! Hur var helgen?",
    opener_en: "Good morning! How was your weekend?",
    goal: "Say how your weekend was, share one thing you did, and ask your colleague about theirs.",
    success_criteria: [
      "Say how your weekend was",
      "Share one activity in past tense",
      "Ask the colleague about their weekend"
    ],
    curveballs: [
      "Svea asks a follow-up about what you watched or where you went",
      "Svea tells a long story about her weekend and waits for a reaction",
      "Svea asks what you are doing next weekend"
    ],
    cultural_notes: "'Hur var helgen?' is the standard Monday greeting at Swedish workplaces, and a short positive answer plus a question back is all it needs.",
    suggested_vocab: ["helgen", "jättebra", "jag tittade på", "träffade", "lugn", "och du då?"],
    key_vocabulary: [
      {
        swedish: "helg",
        english: "weekend",
        example_sv: "Helgen var jättebra!",
        example_en: "The weekend was great!",
        pronunciation_tip: "Soft g at the end: hel-y."
      },
      {
        swedish: "lugn",
        english: "calm, quiet",
        example_sv: "Det var en lugn helg.",
        example_en: "It was a quiet weekend.",
        pronunciation_tip: "The g is silent: loongn → 'lungn'."
      },
      {
        swedish: "titta på",
        english: "to watch",
        example_sv: "Jag tittade på en film.",
        example_en: "I watched a film.",
        pronunciation_tip: "Past tense: TIT-ta-de."
      },
      {
        swedish: "träffa",
        english: "to meet",
        example_sv: "Jag träffade några vänner.",
        example_en: "I met some friends.",
        pronunciation_tip: "'Träffade' has three syllables: TREF-fa-de."
      },
      {
        swedish: "laga mat",
        english: "to cook",
        example_sv: "Vi lagade mat tillsammans.",
        example_en: "We cooked together.",
        pronunciation_tip: "'Laga' has a long a: LAH-ga."
      },
      {
        swedish: "promenad",
        english: "walk",
        example_sv: "Vi tog en lång promenad.",
        example_en: "We took a long walk.",
        pronunciation_tip: "Stress the end: pro-me-NAD."
      }
    ],
    key_phrases: [
      {
        situation_en: "Answering how the weekend was",
        phrase_sv: "Den var jättebra, tack!",
        phrase_en: "It was great, thanks!",
        pronunciation_tip: "'Jättebra' = 'very good': YET-te-bra."
      },
      {
        situation_en: "Sharing one thing you did",
        phrase_sv: "Jag träffade några vänner på lördag.",
        phrase_en: "I met some friends on Saturday.",
        pronunciation_tip: "Past tense verbs end in -de: träffa-DE."
      },
      {
        situation_en: "Saying it was a quiet weekend",
        phrase_sv: "Det var en lugn helg, jag var mest hemma.",
        phrase_en: "It was a quiet weekend, I was mostly at home.",
        pronunciation_tip: "'Hemma' = at home: HEM-ma."
      },
      {
        situation_en: "Asking back about their weekend",
        phrase_sv: "Och du då? Vad gjorde du?",
        phrase_en: "And you? What did you do?",
        pronunciation_tip: "'Gjorde' sounds like 'YOO-rde'."
      },
      {
        situation_en: "Reacting to their story",
        phrase_sv: "Vad kul! Det låter trevligt.",
        phrase_en: "How fun! That sounds nice.",
        pronunciation_tip: "'Kul' has a long u: kool."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Jag ___ några vänner på lördag.",
        prompt_en: "I ___ some friends on Saturday.",
        expected_answer_sv: "träffade",
        expected_answer_en: "met",
        options: ["träffade", "tittade", "lagade", "jobbade"],
        hint_en: "Past tense of the verb 'to meet'.",
      },
      {
        type: "quick_response",
        prompt_sv: "Vad kul! Vad såg ni för film?",
        prompt_en: "How fun! What film did you watch?",
        expected_answer_sv: "Vi såg en komedi. Den var jätterolig.",
        expected_answer_en: "We watched a comedy. It was really funny.",
        hint_en: "Name a type of film and say what you thought.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Vad ska du göra nästa helg då?",
        prompt_en: "So what are you doing next weekend?",
        expected_answer_sv: "Jag vet inte än, kanske en lång promenad. Och du?",
        expected_answer_en: "I don't know yet, maybe a long walk. And you?",
        hint_en: "It's fine to say you don't know yet — then ask back.",
        options: null
      }
    ]
  },
  "Fråga om priser": {
    description_en: "Ask the price of a jacket at a flea market, react to the amount, and try to bargain a little.",
    opener_sv: "Hej! Den där jackan är fin, eller hur?",
    opener_en: "Hi! That jacket is nice, isn't it?",
    goal: "Ask what the jacket costs, react to the price, and offer a lower amount.",
    success_criteria: [
      "Ask what the jacket costs",
      "React to the price",
      "Make a lower offer"
    ],
    curveballs: [
      "Svea says a high price and waits for your reaction",
      "Svea refuses your first offer and suggests a price in the middle",
      "Svea says it's card or Swish only, no cash"
    ],
    cultural_notes: "Bargaining is fine at Swedish flea markets (loppis) but is done gently — a friendly smile and one counter-offer is enough.",
    suggested_vocab: ["Vad kostar den?", "jackan", "dyrt", "billigare", "femtio kronor", "Swish"],
    key_vocabulary: [
      {
        swedish: "jacka",
        english: "jacket",
        example_sv: "Vad kostar den här jackan?",
        example_en: "How much is this jacket?",
        pronunciation_tip: "Short a, ck like k: YAK-ka."
      },
      {
        swedish: "dyr",
        english: "expensive",
        example_sv: "Oj, det var lite dyrt.",
        example_en: "Oh, that's a bit expensive.",
        pronunciation_tip: "Tight Swedish y: deer with round lips."
      },
      {
        swedish: "billig",
        english: "cheap",
        example_sv: "Kan du göra det lite billigare?",
        example_en: "Can you make it a bit cheaper?",
        pronunciation_tip: "Soft g: BIL-lee."
      },
      {
        swedish: "kronor",
        english: "crowns (Swedish money)",
        example_sv: "Den kostar hundra kronor.",
        example_en: "It costs one hundred crowns.",
        pronunciation_tip: "Long o in 'kro': KROO-nor."
      },
      {
        swedish: "pruta",
        english: "to bargain",
        example_sv: "Kan man pruta lite?",
        example_en: "Can one bargain a little?",
        pronunciation_tip: "Long u: PROO-ta."
      },
      {
        swedish: "Swish",
        english: "Swish (Swedish payment app)",
        example_sv: "Kan jag betala med Swish?",
        example_en: "Can I pay with Swish?",
        pronunciation_tip: "Said like the English word 'swish'."
      }
    ],
    key_phrases: [
      {
        situation_en: "Asking the price",
        phrase_sv: "Vad kostar den här jackan?",
        phrase_en: "How much is this jacket?",
        pronunciation_tip: "'Den här' = this one: den-HAIR."
      },
      {
        situation_en: "Reacting to a high price",
        phrase_sv: "Oj, det var lite dyrt.",
        phrase_en: "Oh, that's a bit expensive.",
        pronunciation_tip: "'Oj' is the Swedish 'oops/wow': oy."
      },
      {
        situation_en: "Making a lower offer",
        phrase_sv: "Kan jag få den för femtio kronor?",
        phrase_en: "Can I have it for fifty crowns?",
        pronunciation_tip: "'Femtio' often sounds like 'FEM-ti'."
      },
      {
        situation_en: "Meeting in the middle",
        phrase_sv: "Okej, vi säger sjuttio. Går det bra?",
        phrase_en: "Okay, let's say seventy. Is that okay?",
        pronunciation_tip: "'Vi säger' = 'let's say': vee-SAY-er."
      },
      {
        situation_en: "Asking how to pay",
        phrase_sv: "Kan jag betala med Swish?",
        phrase_en: "Can I pay with Swish?",
        pronunciation_tip: "Almost everyone at a loppis takes Swish."
      }
    ],
    rehearsal_drills: [
      {
        type: "gap_fill",
        prompt_sv: "Oj, det var lite ___. Kan jag få den för femtio?",
        prompt_en: "Oh, that's a bit ___. Can I have it for fifty?",
        expected_answer_sv: "dyrt",
        expected_answer_en: "expensive",
        options: ["dyrt", "billigt", "fint", "kallt"],
        hint_en: "The opposite of cheap.",
      },
      {
        type: "quick_response",
        prompt_sv: "Den kostar hundra kronor.",
        prompt_en: "It costs one hundred crowns.",
        expected_answer_sv: "Oj, det var lite dyrt. Kan jag få den för femtio?",
        expected_answer_en: "Oh, that's a bit expensive. Can I have it for fifty?",
        hint_en: "React to the price, then make a lower offer.",
        options: null
      },
      {
        type: "quick_response",
        prompt_sv: "Femtio är för lite. Men vi kan säga sjuttio kronor.",
        prompt_en: "Fifty is too little. But we can say seventy crowns.",
        expected_answer_sv: "Okej, sjuttio går bra. Kan jag betala med Swish?",
        expected_answer_en: "Okay, seventy is fine. Can I pay with Swish?",
        hint_en: "Accept the middle price and ask about payment.",
        options: null
      }
    ]
  },
};
