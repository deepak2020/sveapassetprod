# Sveapasset — Bulk Speaking Mission Generation

**Total missions to generate:** 85
**Target table:** Supabase → `speaking_topics`

---

## 1. Task for Claude

You are designing SWEDISH SPEAKING MISSIONS for a language-learning app called **Sveapasset**. Each mission is a short goal-driven roleplay between the learner and an AI persona called **Svea**.

You will receive a numbered list of 85 mission briefs at the end of this document. For **each** brief, produce ONE JSON object that matches the schema in section 3.

**Return a single JSON array containing all 85 objects, in the same order as the briefs.** No prose before or after. No markdown fences.

---

## 2. Hard rules (apply to every mission)

1. Everything must match the mission's stated **CEFR level** — vocabulary, grammar, sentence length. Do NOT use words a learner at that level would not know.
2. Swedish must sound natural to a native speaker in Sweden today — not textbook, not archaic.
3. All English text must be plain, direct, learner-facing English.
4. Rehearsal drills MUST rehearse the actual curveballs / key phrases from the scenario — they are the user's warm-up before facing Svea live.
5. Counts are exact: **6** `key_vocabulary`, **5** `key_phrases`, **3** `rehearsal_drills` (in the order gap_fill → quick_response → quick_response).
6. Include ONLY the content fields shown in the schema. DO NOT emit `title_sv`, `title_en`, `level`, `category`, `emoji`, or `order` — those come from the metadata and are merged in by the SQL in section 5.
7. Every object in your output array MUST include a `_ref` field equal to the mission's numeric index in the list below (e.g. `"_ref": 1`). This is how outputs are matched back to metadata.

---

## 3. JSON schema (per mission)

```json
{
  "_ref": 1,
  "description_en": "one sentence describing the mission (English)",
  "opener_sv": "Svea's first line to open the roleplay (natural spoken Swedish, short)",
  "opener_en": "English translation of opener_sv",
  "goal": "the concrete outcome, ONE sentence in English",
  "success_criteria": ["3 short English strings — what the user must DO to complete the mission"],
  "curveballs": ["2–3 short English strings — unexpected turns Svea can throw"],
  "cultural_notes": "ONE short English sentence with a Swedish cultural/register tip specific to this scenario",
  "suggested_vocab": ["6 Swedish words/short phrases the learner can lean on"],
  "key_vocabulary": [
    {
      "swedish": "…",
      "english": "…",
      "example_sv": "short natural example using the word",
      "example_en": "English translation",
      "pronunciation_tip": "ONE short English tip, e.g. 'Long a, stress on first syllable'"
    }
    // EXACTLY 6 items. No trivial words like 'jag', 'och', 'är'.
  ],
  "key_phrases": [
    {
      "situation_en": "when to use it, e.g. 'Explaining why you are calling'",
      "phrase_sv": "natural spoken Swedish phrase",
      "phrase_en": "English translation",
      "pronunciation_tip": "ONE short English tip"
    }
    // EXACTLY 5 items.
  ],
  "rehearsal_drills": [
    {
      "type": "gap_fill",
      "prompt_sv": "sentence with exactly ONE blank marked as '___'",
      "prompt_en": "English version (with the same blank)",
      "expected_answer_sv": "the correct word",
      "expected_answer_en": "English translation of the correct word",
      "options": ["4 Swedish words, including the correct one"],
      "hint_en": "short English hint"
    },
    {
      "type": "quick_response",
      "prompt_sv": "short thing Svea says",
      "prompt_en": "English translation",
      "expected_answer_sv": "natural short reply the user could give",
      "expected_answer_en": "English translation of the reply",
      "hint_en": "short English hint",
      "options": null
    },
    {
      "type": "quick_response",
      "prompt_sv": "DIFFERENT curveball Svea might throw",
      "prompt_en": "…",
      "expected_answer_sv": "…",
      "expected_answer_en": "…",
      "hint_en": "…",
      "options": null
    }
  ]
}
```

---

## 4. Mission briefs (85)

Generate one JSON object per brief below. Use the `_ref` value shown for each.

### A1 (14)

#### `_ref: 1` — 👋 Hälsa och presentera dig _(Greet and introduce yourself)_
- **Level:** A1
- **Category:** survival
- **Situation:** The user meets a new Swedish neighbour in the stairwell. They exchange names, where they're from, and how long they've been in Sweden.
- **Learner's goal:** Greet, say your name, where you are from, how long in Sweden

#### `_ref: 2` — 🛒 Köpa mat i mataffären _(Buy food at the grocery store)_
- **Level:** A1
- **Category:** survival
- **Situation:** The user is at ICA and can't find the milk. They ask a staff member and pay at the checkout.
- **Learner's goal:** Ask where an item is, understand aisle number, pay at checkout

#### `_ref: 3` — 🗺️ Fråga efter vägen _(Ask for directions)_
- **Level:** A1
- **Category:** survival
- **Situation:** The user is lost near the central station and needs to find the pharmacy. They stop a passer-by to ask.
- **Learner's goal:** Politely stop someone, ask for a place, understand basic directions

#### `_ref: 4` — 🍽️ Beställa mat på restaurang _(Order food at a restaurant)_
- **Level:** A1
- **Category:** survival
- **Situation:** The user sits down at a lunch restaurant. They order a main dish, water, and ask for the bill.
- **Learner's goal:** Order a dish, ask for water, ask for the bill

#### `_ref: 5` — 🚌 Köpa bussbiljett _(Buy a bus ticket)_
- **Level:** A1
- **Category:** survival
- **Situation:** The user needs a single ticket to the city centre and asks the driver about the price and payment options.
- **Learner's goal:** Ask price, ask if card works, confirm destination

#### `_ref: 6` — 🕐 Fråga om öppettider _(Ask about opening hours)_
- **Level:** A1
- **Category:** survival
- **Situation:** The user calls a shop to ask when they open on Saturday and if they close early.
- **Learner's goal:** Ask opening hours for a specific day, confirm closing time

#### `_ref: 7` — 🚕 Beställa taxi _(Order a taxi)_
- **Level:** A1
- **Category:** survival
- **Situation:** The user calls a taxi company to book a ride to the airport for tomorrow morning.
- **Learner's goal:** Give address, destination, time, and phone number

#### `_ref: 8` — 📅 Boka bord _(Book a table)_
- **Level:** A1
- **Category:** survival
- **Situation:** The user calls a restaurant to book a table for two people at 7 pm on Friday.
- **Learner's goal:** Give date, time, number of people, name for the booking

#### `_ref: 9` — ☀️ Prata om vädret _(Talk about the weather)_
- **Level:** A1
- **Category:** survival
- **Situation:** The user makes small talk with a colleague in the elevator about today's weather and the weekend forecast.
- **Learner's goal:** Comment on today, ask about the weekend forecast, react

#### `_ref: 10` — 👨‍👩‍👧 Berätta om din familj _(Talk about your family)_
- **Level:** A1
- **Category:** survival
- **Situation:** A new friend at SFI asks about the user's family — parents, siblings, children, where they live.
- **Learner's goal:** Describe family members and where they live

#### `_ref: 11` — 💼 Säga vad du gör på jobbet _(Say what you do for work)_
- **Level:** A1
- **Category:** survival
- **Situation:** At a mingel, someone asks what the user does for a living. They give job title, employer, and one thing they like about it.
- **Learner's goal:** State job, employer, one thing you like about the job

#### `_ref: 12` — 🍺 Beställa i baren _(Order at the bar)_
- **Level:** A1
- **Category:** survival
- **Situation:** The user is at a pub and orders a beer, then asks about a local specialty.
- **Learner's goal:** Order a drink, ask a recommendation, pay

#### `_ref: 13` — 🎉 Berätta om din helg _(Talk about your weekend)_
- **Level:** A1
- **Category:** survival
- **Situation:** A colleague asks 'Hur var helgen?' on Monday morning. The user shares one thing they did and asks back.
- **Learner's goal:** Share one weekend activity, ask the colleague about theirs

#### `_ref: 14` — 💰 Fråga om priser _(Ask about prices)_
- **Level:** A1
- **Category:** survival
- **Situation:** The user is at a flea market and wants to buy a jacket. They ask the price and try to bargain a little.
- **Learner's goal:** Ask price, react to the amount, make a lower offer

### A2 (19)

#### `_ref: 15` — 🏥 Ringa till vårdcentralen _(Call the health centre)_
- **Level:** A2
- **Category:** service
- **Situation:** The user has had a fever for three days and calls 1177 / vårdcentralen to book an appointment.
- **Learner's goal:** Describe symptoms, request an appointment, note the time given

#### `_ref: 16` — 📦 Hämta paket på ombudet _(Collect a parcel at the pick-up point)_
- **Level:** A2
- **Category:** service
- **Situation:** The user goes to their local ICA to pick up a package but forgot the notification code. They have ID.
- **Learner's goal:** Explain missing code, show ID, collect the parcel

#### `_ref: 17` — 🏦 Öppna bankkonto _(Open a bank account)_
- **Level:** A2
- **Category:** service
- **Situation:** The user visits a bank branch to open a personal account. Svea is the bank clerk asking about ID, address, and employment.
- **Learner's goal:** State purpose, provide personal details, understand the next steps

#### `_ref: 18` — 🏠 Anmäla flytt till Skatteverket _(Report a move to Skatteverket)_
- **Level:** A2
- **Category:** service
- **Situation:** The user calls Skatteverket to ask how to register a new address after moving apartments.
- **Learner's goal:** Explain the move, ask how to register, note the deadline

#### `_ref: 19` — 📱 Klaga på en produkt _(Complain about a product)_
- **Level:** A2
- **Category:** service
- **Situation:** The user returns a broken phone charger to the store. Svea plays the shop assistant asking for the receipt.
- **Learner's goal:** Describe the problem, request refund or replacement, agree on solution

#### `_ref: 20` — 💇 Boka frisörtid _(Book a hairdresser)_
- **Level:** A2
- **Category:** service
- **Situation:** The user calls a hairdresser to book a cut and colour for next Saturday afternoon.
- **Learner's goal:** Describe what you want done, agree on a time, confirm price

#### `_ref: 21` — 🔧 Fråga hyresvärden om reparation _(Ask your landlord about a repair)_
- **Level:** A2
- **Category:** service
- **Situation:** The user's dishwasher is broken. They call the landlord's office to report it and ask when a technician can come.
- **Learner's goal:** Describe the problem, ask when it will be fixed

#### `_ref: 22` — ✉️ Skicka ett paket på posten _(Send a parcel at the post office)_
- **Level:** A2
- **Category:** service
- **Situation:** The user wants to send a small parcel to Germany and asks about price, delivery time, and tracking.
- **Learner's goal:** State destination, choose shipping option, pay

#### `_ref: 23` — 📶 Fråga om Wi-Fi och bredband _(Ask about Wi-Fi and broadband)_
- **Level:** A2
- **Category:** service
- **Situation:** The user's internet is very slow. They call the ISP to complain and ask for a technician.
- **Learner's goal:** Describe the problem, ask for a fix, book a technician visit

#### `_ref: 24` — 🥕 Beställa hemleverans av mat _(Order grocery delivery)_
- **Level:** A2
- **Category:** service
- **Situation:** The user calls a grocery service to ask about home delivery times and how to pay.
- **Learner's goal:** Ask delivery windows, minimum order, payment method

#### `_ref: 25` — 👕 Prova kläder i butik _(Try on clothes in a store)_
- **Level:** A2
- **Category:** service
- **Situation:** The user finds a jacket they like but needs a bigger size. They ask a shop assistant.
- **Learner's goal:** Ask for a different size or colour, try it on, decide

#### `_ref: 26` — 🔊 Klaga hos hyresvärden om buller _(Complain to landlord about noise)_
- **Level:** A2
- **Category:** service
- **Situation:** The neighbours have loud parties every weekend. The user calls the landlord to report this.
- **Learner's goal:** Describe the problem clearly, ask what the landlord will do

#### `_ref: 27` — 💱 Byta pengar på Forex _(Exchange money at Forex)_
- **Level:** A2
- **Category:** service
- **Situation:** The user wants to change 200 euros to Swedish crowns and asks about the rate and fee.
- **Learner's goal:** State amount, ask about rate and fees, complete the exchange

#### `_ref: 28` — 💪 Boka gymkort _(Sign up for a gym membership)_
- **Level:** A2
- **Category:** service
- **Situation:** The user visits a gym to sign up. Svea is the receptionist explaining prices and contract length.
- **Learner's goal:** Compare plans, ask about cancellation, sign up

#### `_ref: 29` — 💳 Anmäla borttappat kort _(Report a lost bank card)_
- **Level:** A2
- **Category:** service
- **Situation:** The user calls the bank to block a lost card and order a new one.
- **Learner's goal:** Block the card, order replacement, confirm delivery address

#### `_ref: 30` — 👶 Boka läkartid för barn _(Book a doctor for your child)_
- **Level:** A2
- **Category:** service
- **Situation:** The user's child has an ear infection. They call BVC to book an appointment.
- **Learner's goal:** Describe child's symptoms, request an appointment, understand time given

#### `_ref: 31` — 🚗 Kontakta försäkringen efter olycka _(Contact insurance after an accident)_
- **Level:** A2
- **Category:** service
- **Situation:** The user was in a minor car accident. They call the insurance company to report it.
- **Learner's goal:** Describe what happened, give details, ask about next steps

#### `_ref: 32` — 🚇 Fråga om SL-kort _(Ask about a monthly transit card)_
- **Level:** A2
- **Category:** service
- **Situation:** The user goes to SL Center to buy a monthly card and asks which zones cover their commute.
- **Learner's goal:** Explain your commute, choose the right zone, buy the card

#### `_ref: 33` — 👓 Beställa glasögon hos optiker _(Order glasses at the optician)_
- **Level:** A2
- **Category:** service
- **Situation:** The user needs new glasses. Svea is the optician asking about lens type and budget.
- **Learner's goal:** Explain what you need, choose frames, agree on price and pickup date

### B1 (27)

#### `_ref: 34` — 📝 Utvecklingssamtal på förskolan _(Development talk at preschool)_
- **Level:** B1
- **Category:** society
- **Situation:** The user meets the preschool teacher for a scheduled development talk about their child's progress.
- **Learner's goal:** Ask about child's progress, raise one concern, agree on next steps

#### `_ref: 35` — 🏫 Föräldramöte i skolan _(Parent meeting at school)_
- **Level:** B1
- **Category:** society
- **Situation:** The user attends a parent meeting where the teacher discusses upcoming trips and homework routines.
- **Learner's goal:** Ask one question, agree to help with something, thank the teacher

#### `_ref: 36` — ☕ Small talk med kollegor på fikarasten _(Small talk with colleagues at fika)_
- **Level:** B1
- **Category:** work
- **Situation:** The user joins the daily 10-minute fika. Colleagues chat about weekend plans, TV series, and vacation.
- **Learner's goal:** Join a topic, share one story, ask a follow-up

#### `_ref: 37` — 🤒 Be om sjukledigt _(Call in sick)_
- **Level:** B1
- **Category:** work
- **Situation:** The user is unwell and calls the manager in the morning to explain and hand off urgent tasks.
- **Learner's goal:** Explain you are sick, hand off one urgent task, apologise briefly

#### `_ref: 38` — 📊 Delta i möte på jobbet _(Participate in a work meeting)_
- **Level:** B1
- **Category:** work
- **Situation:** The user joins a weekly team meeting. They give a quick status update and ask one question.
- **Learner's goal:** Give short status update, ask one clarifying question

#### `_ref: 39` — 🏢 Prata med grannen om trapphuset _(Talk to neighbour about the stairwell)_
- **Level:** B1
- **Category:** society
- **Situation:** The neighbour leaves shoes in the stairwell blocking the exit. The user politely asks them to move them.
- **Learner's goal:** Raise the issue politely, agree on a solution

#### `_ref: 40` — 🏘️ Föreningsmöte i bostadsrätt _(Housing co-op meeting)_
- **Level:** B1
- **Category:** society
- **Situation:** The user attends the yearly BRF meeting where a fee increase is discussed.
- **Learner's goal:** Understand the proposal, ask one question, share your view

#### `_ref: 41` — 👨‍⚕️ Boka läkartid för dig själv _(Book a doctor appointment for yourself)_
- **Level:** B1
- **Category:** service
- **Situation:** The user has had back pain for two weeks and calls vårdcentralen for an appointment.
- **Learner's goal:** Describe symptoms in detail, request appointment, follow instructions

#### `_ref: 42` — 🩺 Beskriva symtom för läkare _(Describe symptoms to a doctor)_
- **Level:** B1
- **Category:** service
- **Situation:** At the doctor's office, the user describes headaches, when they started, and what makes them worse.
- **Learner's goal:** Describe symptoms, duration, triggers, answer follow-up questions

#### `_ref: 43` — 💰 Diskutera lön med chefen _(Discuss salary with your boss)_
- **Level:** B1
- **Category:** work
- **Situation:** The user asks their manager for a salary review, giving reasons based on results this year.
- **Learner's goal:** State request, give two supporting reasons, propose a number

#### `_ref: 44` — 🍼 Föräldraledighet med HR _(Parental leave with HR)_
- **Level:** B1
- **Category:** work
- **Situation:** The user meets HR to plan 6 months of parental leave starting in autumn.
- **Learner's goal:** State timing, ask about handover, agree on next step

#### `_ref: 45` — 💬 Boka språkkafé _(Sign up for language café)_
- **Level:** B1
- **Category:** society
- **Situation:** The user calls the local library to join a Swedish language café for beginners.
- **Learner's goal:** Ask when it meets, register, confirm the location

#### `_ref: 46` — 📚 Prata med SFI-läraren om betyg _(Talk to SFI teacher about grades)_
- **Level:** B1
- **Category:** society
- **Situation:** The user is unhappy with a grade and books time with the SFI teacher to discuss it.
- **Learner's goal:** Ask for reasons, share your view, agree on how to improve

#### `_ref: 47` — 🤝 Diskutera med kollega om projekt _(Discuss a project with a colleague)_
- **Level:** B1
- **Category:** work
- **Situation:** A colleague suggests changing the plan for a project. The user disagrees politely and proposes a compromise.
- **Learner's goal:** Listen, disagree politely, propose a compromise

#### `_ref: 48` — 🔩 Boka bilverkstad _(Book a car workshop)_
- **Level:** B1
- **Category:** service
- **Situation:** The car is making a strange noise. The user calls a workshop to describe it and book a time.
- **Learner's goal:** Describe the noise, book a slot, ask for a price estimate

#### `_ref: 49` — 📦 Reklamera en produkt online _(Complain about an online order)_
- **Level:** B1
- **Category:** service
- **Situation:** The user received the wrong item from an online store and calls customer service.
- **Learner's goal:** Explain the problem, request a solution, confirm the return process

#### `_ref: 50` — 📞 Ringa Arbetsförmedlingen _(Call the employment agency)_
- **Level:** B1
- **Category:** society
- **Situation:** The user calls Arbetsförmedlingen to ask about a course they saw advertised.
- **Learner's goal:** Ask about eligibility, apply, note the deadline

#### `_ref: 51` — 👶 Fråga om barnbidrag _(Ask about child benefit)_
- **Level:** B1
- **Category:** society
- **Situation:** The user calls Försäkringskassan to ask when barnbidrag will be paid after moving to Sweden.
- **Learner's goal:** Explain your situation, understand what you need to send in

#### `_ref: 52` — 🏚️ Klaga hos hyresvärden om mögel _(Report mould to landlord)_
- **Level:** B1
- **Category:** service
- **Situation:** There is mould in the bathroom. The user calls the landlord and demands an inspection.
- **Learner's goal:** Describe the problem, request inspection, agree on a date

#### `_ref: 53` — 🎓 Möte med studievägledare _(Meeting with study counsellor)_
- **Level:** B1
- **Category:** society
- **Situation:** The user wants to study to become a nurse. They meet a studievägledare to discuss the path.
- **Learner's goal:** Explain your goal, ask about requirements, agree on next steps

#### `_ref: 54` — 💡 Presentera en idé på jobbet _(Pitch an idea at work)_
- **Level:** B1
- **Category:** work
- **Situation:** The user proposes a small process change in the weekly team meeting.
- **Learner's goal:** Present the idea, give one reason, handle a critical question

#### `_ref: 55` — 🏖️ Prata om semesterplaner _(Talk about vacation plans)_
- **Level:** B1
- **Category:** work
- **Situation:** A colleague asks about the user's summer plans over lunch.
- **Learner's goal:** Share your plan, ask theirs, react to their answer

#### `_ref: 56` — 🕊️ Kondolera en kollega _(Offer condolences to a colleague)_
- **Level:** B1
- **Category:** work
- **Situation:** A colleague's father has passed away. The user offers a short condolence in the office.
- **Learner's goal:** Express condolences briefly, offer help, respect their space

#### `_ref: 57` — 🎄 Julmiddag med svenska familjen _(Christmas dinner with Swedish family)_
- **Level:** B1
- **Category:** seasonal
- **Situation:** The user is invited to julbord. They greet everyone, compliment the food, and take part in small talk.
- **Learner's goal:** Greet, compliment host, join a topic

#### `_ref: 58` — 🌻 Midsommarfirande _(Midsummer celebration)_
- **Level:** B1
- **Category:** seasonal
- **Situation:** The user attends their first midsommar. They ask about traditions and join a snapsvisa.
- **Learner's goal:** Ask about traditions, join the singing, thank the hosts

#### `_ref: 59` — 🚨 Ringa 112 _(Call 112 (emergency))_
- **Level:** B1
- **Category:** emergency
- **Situation:** The user sees a car accident and calls 112. The operator asks what, where, and who.
- **Learner's goal:** State what, where, who, follow operator instructions

#### `_ref: 60` — ☀️ Sommarplaner med kollegor _(Summer plans with colleagues)_
- **Level:** B1
- **Category:** seasonal
- **Situation:** In June, colleagues share vacation plans. The user shares theirs and asks two follow-ups.
- **Learner's goal:** Share plan, ask follow-ups, react


### B2 (21)

#### `_ref: 61` — 📈 Löneförhandling med chefen _(Salary negotiation with your boss)_
- **Level:** B2
- **Category:** work
- **Situation:** The annual salary review. The user has prepared arguments and negotiates for a raise of 6 %.
- **Learner's goal:** Propose a number, back it with evidence, respond to counter-offer

#### `_ref: 62` — 📊 Hålla presentation för team _(Give a presentation to a team)_
- **Level:** B2
- **Category:** work
- **Situation:** The user presents last quarter's results to 8 colleagues and takes 2 questions.
- **Learner's goal:** Structure a 2-min presentation, handle 2 questions with detail

#### `_ref: 63` — 💬 Ge kritik till en kollega _(Give feedback to a colleague)_
- **Level:** B2
- **Category:** work
- **Situation:** A junior colleague missed a deadline. The user gives constructive feedback in a 1:1.
- **Learner's goal:** Frame kindly, be specific, agree on a change

#### `_ref: 64` — 🏘️ Diskutera bostadspriser _(Discuss housing prices)_
- **Level:** B2
- **Category:** nuance
- **Situation:** Friends at a middag talk about how hard it is to buy a first apartment. The user shares their view.
- **Learner's goal:** Contribute an opinion, cite one example, react to another view

#### `_ref: 65` — 🌍 Debattera integration _(Debate integration)_
- **Level:** B2
- **Category:** nuance
- **Situation:** At a mingel, someone brings up integration in Sweden. The user shares a nuanced view.
- **Learner's goal:** Share a nuanced view, avoid clichés, disagree politely if needed

#### `_ref: 66` — 😩 Prata med chefen om stress _(Talk to your boss about stress)_
- **Level:** B2
- **Category:** work
- **Situation:** The user has been overloaded for weeks and asks the manager for support in a 1:1.
- **Learner's goal:** Describe the situation, be specific, propose a solution

#### `_ref: 67` — 🗣️ Argumentera mot ett förslag på möte _(Argue against a proposal in a meeting)_
- **Level:** B2
- **Category:** work
- **Situation:** In a team meeting, a colleague proposes something the user thinks is a bad idea. The user objects respectfully.
- **Learner's goal:** Disagree politely, give a clear reason, propose an alternative

#### `_ref: 68` — 🍷 Berätta en anekdot på middag _(Tell an anecdote at dinner)_
- **Level:** B2
- **Category:** nuance
- **Situation:** At a dinner party, the user tells a short funny travel story with a clear punchline.
- **Learner's goal:** Set the scene, build tension, land the point

#### `_ref: 69` — 🎬 Diskutera film eller serie _(Discuss a film or series)_
- **Level:** B2
- **Category:** nuance
- **Situation:** Friends at fika talk about a Netflix show. The user shares an opinion with a reason.
- **Learner's goal:** Describe the show briefly, share opinion, back it up

#### `_ref: 70` — 🔑 Boka mäklarvisning _(Book a real estate viewing)_
- **Level:** B2
- **Category:** service
- **Situation:** The user calls a real estate agent about an apartment they saw on Hemnet.
- **Learner's goal:** Request a viewing, ask 2 detail questions, confirm time

#### `_ref: 71` — 🏠 Förhandla hyra med hyresvärd _(Negotiate rent with landlord)_
- **Level:** B2
- **Category:** service
- **Situation:** The landlord wants to raise the rent by 8 %. The user pushes back and negotiates.
- **Learner's goal:** Push back politely, give reasons, aim for a lower increase

#### `_ref: 72` — 🎤 Anställningsintervju — beteendefråga _(Job interview — behavioural question)_
- **Level:** B2
- **Category:** work
- **Situation:** The interviewer asks 'Berätta om en gång du löste en konflikt på jobbet.' The user answers using STAR.
- **Learner's goal:** Give a 90-second STAR answer, land the outcome

#### `_ref: 73` — ⚖️ Klaga hos konsumentverket _(Complain to consumer agency)_
- **Level:** B2
- **Category:** service
- **Situation:** A shop refuses to refund a faulty item. The user calls Konsumentverket for advice.
- **Learner's goal:** Explain the case clearly, ask for concrete next steps

#### `_ref: 74` — 🗳️ Prata om politik med släkting _(Talk politics with a relative)_
- **Level:** B2
- **Category:** nuance
- **Situation:** A relative brings up the recent election. The user shares views without escalating.
- **Learner's goal:** Share view, disagree respectfully, de-escalate if it heats up

#### `_ref: 75` — 🥂 Ge ett tack-tal på jobbfest _(Give a thank-you speech at a work party)_
- **Level:** B2
- **Category:** work
- **Situation:** The user is leaving a job. They give a short thank-you speech at their farewell fika.
- **Learner's goal:** Thank people, share one memory, wish them well

#### `_ref: 76` — 🌱 Diskutera miljö och klimat _(Discuss environment and climate)_
- **Level:** B2
- **Category:** nuance
- **Situation:** A friend argues that individual actions do not matter for the climate. The user pushes back.
- **Learner's goal:** Disagree with a reason, cite one fact, stay respectful

#### `_ref: 77` — 📄 Byta jobb — säga upp dig _(Quit your job)_
- **Level:** B2
- **Category:** work
- **Situation:** The user meets their manager to hand in their resignation and agree on a handover plan.
- **Learner's goal:** State the decision, explain briefly, agree on handover

#### `_ref: 78` — 🎒 Föräldrasamtal om barns problem _(Parent meeting about child issue)_
- **Level:** B2
- **Category:** society
- **Situation:** The school raises concerns about the user's child being disruptive. The user listens and responds.
- **Learner's goal:** Listen actively, ask for detail, agree on a plan

#### `_ref: 79` — 🚪 Klaga på grannen till styrelsen _(Complain about neighbour to board)_
- **Level:** B2
- **Category:** society
- **Situation:** The user writes/calls the BRF board about a neighbour who smokes on the balcony.
- **Learner's goal:** Describe the problem, request action, remain civil

#### `_ref: 80` — 👮 Rapportera stöld till polisen _(Report a theft to the police)_
- **Level:** B2
- **Category:** emergency
- **Situation:** The user's bike was stolen. They call the police to file a report.
- **Learner's goal:** Give details of the item, when/where, provide contact info

#### `_ref: 81` — 🍂 Höstmörker och må-bra-tips _(Autumn darkness and wellbeing tips)_
- **Level:** B2
- **Category:** seasonal
- **Situation:** A colleague talks about struggling with the dark autumn. The user shows empathy and shares a tip.
- **Learner's goal:** Show empathy, share one tip, ask a follow-up


### C1 (4)

#### `_ref: 82` — 💒 Hålla ett tal på bröllop _(Give a wedding speech)_
- **Level:** C1
- **Category:** nuance
- **Situation:** The user gives a 2-minute best-man/woman speech in Swedish including a joke and a toast.
- **Learner's goal:** Open, story, joke, warm close, skål

#### `_ref: 83` — 🎙️ Debattera i panel _(Debate on a panel)_
- **Level:** C1
- **Category:** nuance
- **Situation:** The user is on a work panel debating remote work. They defend a position for 60 seconds.
- **Learner's goal:** Defend a clear thesis, use one example, rebut one point

#### `_ref: 84` — 📝 Förhandla konsultkontrakt _(Negotiate a consulting contract)_
- **Level:** C1
- **Category:** work
- **Situation:** The user negotiates hourly rate, scope, and payment terms with a new client.
- **Learner's goal:** Anchor rate, define scope, agree on payment terms

#### `_ref: 85` — 🎧 Intervjuas i podd på svenska _(Be interviewed on a podcast)_
- **Level:** C1
- **Category:** nuance
- **Situation:** A Swedish podcast interviews the user about their career. Answers should be full, natural, and clear.
- **Learner's goal:** Give 2–3 sentence answers, tell one story, land a takeaway


---

## 5. After Claude returns the JSON array

Save Claude's array as `missions.json`. Then run the following in the **Supabase SQL editor** to import all 85 missions in one shot. It merges Claude's content with the fixed metadata using `_ref`.

> First make sure the temporary insert policy is still active:
> `create policy "temp seed insert" on speaking_topics for insert with check (true);`

```sql
-- Paste Claude's JSON array between the $$ markers.
-- The CTE joins each generated object with the fixed metadata by _ref.

with generated as (
  select value as obj, (value->>'_ref')::int as ref
  from json_array_elements($$
    [ PASTE_CLAUDES_JSON_ARRAY_HERE ]
  $$::json)
),
metadata (ref, title_sv, title_en, level, category, emoji, "order") as (
  values
    (1, 'Hälsa och presentera dig', 'Greet and introduce yourself', 'A1', 'survival', '👋', 102),
    (2, 'Köpa mat i mataffären', 'Buy food at the grocery store', 'A1', 'survival', '🛒', 103),
    (3, 'Fråga efter vägen', 'Ask for directions', 'A1', 'survival', '🗺️', 104),
    (4, 'Beställa mat på restaurang', 'Order food at a restaurant', 'A1', 'survival', '🍽️', 105),
    (5, 'Köpa bussbiljett', 'Buy a bus ticket', 'A1', 'survival', '🚌', 106),
    (6, 'Fråga om öppettider', 'Ask about opening hours', 'A1', 'survival', '🕐', 107),
    (7, 'Beställa taxi', 'Order a taxi', 'A1', 'survival', '🚕', 108),
    (8, 'Boka bord', 'Book a table', 'A1', 'survival', '📅', 109),
    (9, 'Prata om vädret', 'Talk about the weather', 'A1', 'survival', '☀️', 110),
    (10, 'Berätta om din familj', 'Talk about your family', 'A1', 'survival', '👨‍👩‍👧', 111),
    (11, 'Säga vad du gör på jobbet', 'Say what you do for work', 'A1', 'survival', '💼', 112),
    (12, 'Beställa i baren', 'Order at the bar', 'A1', 'survival', '🍺', 113),
    (13, 'Berätta om din helg', 'Talk about your weekend', 'A1', 'survival', '🎉', 114),
    (14, 'Fråga om priser', 'Ask about prices', 'A1', 'survival', '💰', 115),
    (15, 'Ringa till vårdcentralen', 'Call the health centre', 'A2', 'service', '🏥', 202),
    (16, 'Hämta paket på ombudet', 'Collect a parcel at the pick-up point', 'A2', 'service', '📦', 203),
    (17, 'Öppna bankkonto', 'Open a bank account', 'A2', 'service', '🏦', 204),
    (18, 'Anmäla flytt till Skatteverket', 'Report a move to Skatteverket', 'A2', 'service', '🏠', 205),
    (19, 'Klaga på en produkt', 'Complain about a product', 'A2', 'service', '📱', 206),
    (20, 'Boka frisörtid', 'Book a hairdresser', 'A2', 'service', '💇', 207),
    (21, 'Fråga hyresvärden om reparation', 'Ask your landlord about a repair', 'A2', 'service', '🔧', 208),
    (22, 'Skicka ett paket på posten', 'Send a parcel at the post office', 'A2', 'service', '✉️', 209),
    (23, 'Fråga om Wi-Fi och bredband', 'Ask about Wi-Fi and broadband', 'A2', 'service', '📶', 210),
    (24, 'Beställa hemleverans av mat', 'Order grocery delivery', 'A2', 'service', '🥕', 211),
    (25, 'Prova kläder i butik', 'Try on clothes in a store', 'A2', 'service', '👕', 212),
    (26, 'Klaga hos hyresvärden om buller', 'Complain to landlord about noise', 'A2', 'service', '🔊', 213),
    (27, 'Byta pengar på Forex', 'Exchange money at Forex', 'A2', 'service', '💱', 214),
    (28, 'Boka gymkort', 'Sign up for a gym membership', 'A2', 'service', '💪', 215),
    (29, 'Anmäla borttappat kort', 'Report a lost bank card', 'A2', 'service', '💳', 216),
    (30, 'Boka läkartid för barn', 'Book a doctor for your child', 'A2', 'service', '👶', 217),
    (31, 'Kontakta försäkringen efter olycka', 'Contact insurance after an accident', 'A2', 'service', '🚗', 218),
    (32, 'Fråga om SL-kort', 'Ask about a monthly transit card', 'A2', 'service', '🚇', 219),
    (33, 'Beställa glasögon hos optiker', 'Order glasses at the optician', 'A2', 'service', '👓', 220),
    (34, 'Utvecklingssamtal på förskolan', 'Development talk at preschool', 'B1', 'society', '📝', 302),
    (35, 'Föräldramöte i skolan', 'Parent meeting at school', 'B1', 'society', '🏫', 303),
    (36, 'Small talk med kollegor på fikarasten', 'Small talk with colleagues at fika', 'B1', 'work', '☕', 305),
    (37, 'Be om sjukledigt', 'Call in sick', 'B1', 'work', '🤒', 306),
    (38, 'Delta i möte på jobbet', 'Participate in a work meeting', 'B1', 'work', '📊', 307),
    (39, 'Prata med grannen om trapphuset', 'Talk to neighbour about the stairwell', 'B1', 'society', '🏢', 308),
    (40, 'Föreningsmöte i bostadsrätt', 'Housing co-op meeting', 'B1', 'society', '🏘️', 309),
    (41, 'Boka läkartid för dig själv', 'Book a doctor appointment for yourself', 'B1', 'service', '👨‍⚕️', 310),
    (42, 'Beskriva symtom för läkare', 'Describe symptoms to a doctor', 'B1', 'service', '🩺', 311),
    (43, 'Diskutera lön med chefen', 'Discuss salary with your boss', 'B1', 'work', '💰', 312),
    (44, 'Föräldraledighet med HR', 'Parental leave with HR', 'B1', 'work', '🍼', 313),
    (45, 'Boka språkkafé', 'Sign up for language café', 'B1', 'society', '💬', 314),
    (46, 'Prata med SFI-läraren om betyg', 'Talk to SFI teacher about grades', 'B1', 'society', '📚', 315),
    (47, 'Diskutera med kollega om projekt', 'Discuss a project with a colleague', 'B1', 'work', '🤝', 316),
    (48, 'Boka bilverkstad', 'Book a car workshop', 'B1', 'service', '🔩', 317),
    (49, 'Reklamera en produkt online', 'Complain about an online order', 'B1', 'service', '📦', 318),
    (50, 'Ringa Arbetsförmedlingen', 'Call the employment agency', 'B1', 'society', '📞', 319),
    (51, 'Fråga om barnbidrag', 'Ask about child benefit', 'B1', 'society', '👶', 320),
    (52, 'Klaga hos hyresvärden om mögel', 'Report mould to landlord', 'B1', 'service', '🏚️', 321),
    (53, 'Möte med studievägledare', 'Meeting with study counsellor', 'B1', 'society', '🎓', 322),
    (54, 'Presentera en idé på jobbet', 'Pitch an idea at work', 'B1', 'work', '💡', 323),
    (55, 'Prata om semesterplaner', 'Talk about vacation plans', 'B1', 'work', '🏖️', 324),
    (56, 'Kondolera en kollega', 'Offer condolences to a colleague', 'B1', 'work', '🕊️', 325),
    (57, 'Julmiddag med svenska familjen', 'Christmas dinner with Swedish family', 'B1', 'seasonal', '🎄', 326),
    (58, 'Midsommarfirande', 'Midsummer celebration', 'B1', 'seasonal', '🌻', 327),
    (59, 'Ringa 112', 'Call 112 (emergency)', 'B1', 'emergency', '🚨', 328),
    (60, 'Sommarplaner med kollegor', 'Summer plans with colleagues', 'B1', 'seasonal', '☀️', 329),
    (61, 'Löneförhandling med chefen', 'Salary negotiation with your boss', 'B2', 'work', '📈', 402),
    (62, 'Hålla presentation för team', 'Give a presentation to a team', 'B2', 'work', '📊', 403),
    (63, 'Ge kritik till en kollega', 'Give feedback to a colleague', 'B2', 'work', '💬', 404),
    (64, 'Diskutera bostadspriser', 'Discuss housing prices', 'B2', 'nuance', '🏘️', 405),
    (65, 'Debattera integration', 'Debate integration', 'B2', 'nuance', '🌍', 406),
    (66, 'Prata med chefen om stress', 'Talk to your boss about stress', 'B2', 'work', '😩', 407),
    (67, 'Argumentera mot ett förslag på möte', 'Argue against a proposal in a meeting', 'B2', 'work', '🗣️', 408),
    (68, 'Berätta en anekdot på middag', 'Tell an anecdote at dinner', 'B2', 'nuance', '🍷', 409),
    (69, 'Diskutera film eller serie', 'Discuss a film or series', 'B2', 'nuance', '🎬', 410),
    (70, 'Boka mäklarvisning', 'Book a real estate viewing', 'B2', 'service', '🔑', 411),
    (71, 'Förhandla hyra med hyresvärd', 'Negotiate rent with landlord', 'B2', 'service', '🏠', 412),
    (72, 'Anställningsintervju — beteendefråga', 'Job interview — behavioural question', 'B2', 'work', '🎤', 413),
    (73, 'Klaga hos konsumentverket', 'Complain to consumer agency', 'B2', 'service', '⚖️', 414),
    (74, 'Prata om politik med släkting', 'Talk politics with a relative', 'B2', 'nuance', '🗳️', 415),
    (75, 'Ge ett tack-tal på jobbfest', 'Give a thank-you speech at a work party', 'B2', 'work', '🥂', 416),
    (76, 'Diskutera miljö och klimat', 'Discuss environment and climate', 'B2', 'nuance', '🌱', 417),
    (77, 'Byta jobb — säga upp dig', 'Quit your job', 'B2', 'work', '📄', 418),
    (78, 'Föräldrasamtal om barns problem', 'Parent meeting about child issue', 'B2', 'society', '🎒', 419),
    (79, 'Klaga på grannen till styrelsen', 'Complain about neighbour to board', 'B2', 'society', '🚪', 420),
    (80, 'Rapportera stöld till polisen', 'Report a theft to the police', 'B2', 'emergency', '👮', 421),
    (81, 'Höstmörker och må-bra-tips', 'Autumn darkness and wellbeing tips', 'B2', 'seasonal', '🍂', 422),
    (82, 'Hålla ett tal på bröllop', 'Give a wedding speech', 'C1', 'nuance', '💒', 501),
    (83, 'Debattera i panel', 'Debate on a panel', 'C1', 'nuance', '🎙️', 502),
    (84, 'Förhandla konsultkontrakt', 'Negotiate a consulting contract', 'C1', 'work', '📝', 503),
    (85, 'Intervjuas i podd på svenska', 'Be interviewed on a podcast', 'C1', 'nuance', '🎧', 504)
)
insert into speaking_topics (
  title_sv, title_en, level, category, emoji, "order",
  description_en, opener_sv, opener_en, goal,
  success_criteria, curveballs, cultural_notes, suggested_vocab,
  key_vocabulary, key_phrases, rehearsal_drills
)
select
  m.title_sv, m.title_en, m.level, m.category, m.emoji, m."order",
  g.obj->>'description_en',
  g.obj->>'opener_sv',
  g.obj->>'opener_en',
  g.obj->>'goal',
  coalesce(g.obj->'success_criteria', '[]'::json)::jsonb,
  coalesce(g.obj->'curveballs', '[]'::json)::jsonb,
  g.obj->>'cultural_notes',
  coalesce(g.obj->'suggested_vocab', '[]'::json)::jsonb,
  coalesce(g.obj->'key_vocabulary', '[]'::json)::jsonb,
  coalesce(g.obj->'key_phrases', '[]'::json)::jsonb,
  coalesce(g.obj->'rehearsal_drills', '[]'::json)::jsonb
from generated g
join metadata m on m.ref = g.ref
on conflict (title_sv) do update set
  title_en         = excluded.title_en,
  level            = excluded.level,
  category         = excluded.category,
  emoji            = excluded.emoji,
  "order"          = excluded."order",
  description_en   = excluded.description_en,
  opener_sv        = excluded.opener_sv,
  opener_en        = excluded.opener_en,
  goal             = excluded.goal,
  success_criteria = excluded.success_criteria,
  curveballs       = excluded.curveballs,
  cultural_notes   = excluded.cultural_notes,
  suggested_vocab  = excluded.suggested_vocab,
  key_vocabulary   = excluded.key_vocabulary,
  key_phrases      = excluded.key_phrases,
  rehearsal_drills = excluded.rehearsal_drills;
```

When it succeeds, drop the temp policy:

```sql
drop policy "temp seed insert" on speaking_topics;
```
