-- ============================================================
-- New grammar topics (10 additions)
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

INSERT INTO grammar_topics (id,category_id,title,title_sv,description,rule,sort_order) VALUES
  ('plural-forms','beginner','Plural Forms','Pluralformer','Swedish nouns have 5 plural patterns — learn to spot which one applies.','Swedish plurals follow five patterns:
1. -or (en flicka → flickor) — most en-words ending in -a
2. -ar (en bil → bilar) — most other en-words
3. -er (en stad → städer) — many en-words, often with vowel change
4. -n (ett äpple → äpplen) — ett-words ending in a vowel
5. No ending (ett hus → hus) — ett-words ending in a consonant

Tip: the definite plural always adds -na to the indefinite plural (bilar → bilarna), except group 5 which adds -en (hus → husen).',4),
  ('possessives','beginner','Possessives','Possessiva pronomen','min/mitt/mina, din/ditt/dina — possessives agree with the noun they describe.','Swedish possessives agree with the gender and number of the noun they modify (not the owner). min/din/sin: en-word singular. mitt/ditt/sitt: ett-word singular. mina/dina/sina: all plurals. hans/hennes/dess/deras don''t change. Sin/sitt/sina refer back to the subject of the clause (reflexive possessives) — they can only be used when the possessor IS the subject.',5),
  ('basic-svo','beginner','Basic Sentence Structure','Grundläggande meningsbyggnad','Subject–Verb–Object: the foundation before learning V2 inversion.','The default Swedish word order is Subject + Verb + Object (SVO), the same as English. Jag äter mat (I eat food). Adverbs of time typically go at the end: Jag äter mat varje dag. The key difference from English comes when something other than the subject starts the sentence — then the verb and subject invert (V2 rule). But understanding SVO first is essential.',6),
  ('comparative','intermediate','Comparative Adjectives','Komparation','stor → större → störst. Three degrees of comparison.','Swedish adjectives have three degrees: positive (stor), comparative (större), superlative (störst). Most adjectives add -are (comparative) and -ast (superlative). Short adjectives often have irregular forms: bra → bättre → bäst, dålig → sämre → sämst, gammal → äldre → äldst, liten → mindre → minst, stor → större → störst, lång → längre → längst. Use ''mer/mest'' for long adjectives: intressant → mer intressant → mest intressant.',4),
  ('reflexive-verbs','intermediate','Reflexive Verbs','Reflexiva verb','Verbs where the action reflects back on the subject: tvätta sig, känna sig.','Reflexive verbs use a reflexive pronoun that refers back to the subject. The pronoun changes by person: tvätta mig (I wash myself), tvätta dig (you wash yourself), tvätta sig (he/she/they wash themselves), tvätta oss (we wash ourselves), tvätta er (you all). ''Sig'' is the third person reflexive — very common. Many Swedish verbs are reflexive that aren''t in English: gifta sig (marry), känna sig (feel), sätta sig (sit down), klä sig (get dressed), skynda sig (hurry).',5),
  ('genitive','intermediate','Genitive (-s)','Genitiv','Showing possession with -s — no apostrophe in Swedish.','Swedish genitive is formed by adding -s directly to the noun (no apostrophe). Mannens bil = the man''s car. Stockholms stad = the city of Stockholm. Key rules: -s is added to the definite or indefinite form depending on context. If the noun already ends in -s, you can still add -s (or sometimes nothing). Genitive always precedes the noun it modifies. Alternative: use ''av'' (of) for longer phrases: staden av Stockholm.',6),
  ('impersonal-man','advanced','Impersonal ''man''','Opersonligt ''man''','How to say ''one'', ''you'', ''people'' or ''they'' in general statements.','''Man'' (one/you/people) is used for general statements without a specific subject — equivalent to English ''one'', ''you in general'', or ''they say''. Man takes the same verb form as han/hon. Its object form is ''en'' (not ''man''): Man kan lära sig svenska om man vill. Det kan göra en trött. Note: ''man'' is very common in Swedish everyday speech — much more than ''one'' in English. Also used to avoid passive voice: Man talar svenska här = Swedish is spoken here.',4),
  ('compound-nouns','advanced','Compound Nouns','Sammansatta substantiv','Swedish combines words freely — busshållplats, körkort, dagmamma.','Swedish forms compound nouns by joining two or more words together (no space or hyphen usually). The gender and plural of the compound come from the LAST word: en buss + en hållplats = en busshållplats. A connecting -s- is often added between parts: arbete + dag = arbetsdag (not arbetedag). The stress falls on the FIRST part. This is very different from English which often keeps words separate (''bus stop'', ''driving licence''). Tip: when you see a long Swedish word, try splitting it into parts.',5),
  ('subjunctive-om','advanced','Subjunctive & Om-clauses','Konjunktiv & om-satser','Expressing hypothetical and unreal conditions with om + past tense.','Swedish rarely uses the formal subjunctive (vore, vare, etc.) except in set phrases. Instead, hypothetical/counterfactual conditions use: om + past tense → skulle + infinitive. Om jag hade tid, skulle jag komma (If I had time, I would come). For past counterfactuals: om + pluperfect → skulle ha + supinum. Om jag hade vetat, skulle jag ha kommit. Note: in the om-clause you use past tense (hade), NOT conditional (skulle). Set phrases still using subjunctive: Vore det inte bättre? Leve kungen! Må du ha det bra!',6),
  ('complex-word-order','advanced','Complex Word Order','Komplex meningsbyggnad','Fronting, multiple adverbials, and sentence-level word order at advanced level.','At advanced level, Swedish word order allows flexible fronting of different elements while maintaining V2. The slot before the verb (position 1) can hold: a time adverbial (Igår), a place adverbial (I Stockholm), an object (Den boken), or an entire clause (När han kom). After the verb: subject, then sentence adverbs (inte/redan/alltid/aldrig) in a fixed order, then other elements. Sentence adverbs follow a hierarchy: inte > aldrig > alltid > redan > fortfarande. In formal writing, participle constructions replace relative clauses: Kommande från Stockholm = Coming from Stockholm.',8)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, rule=EXCLUDED.rule, description=EXCLUDED.description;

INSERT INTO grammar_exercises (topic_id,question,options,correct_index,explanation,sort_order) VALUES
  ('plural-forms','Plural of ''en bil'' (car):','["bilar","bilor","bilen"]',0,'Bil → bilar (group 2: -ar). Most short en-words that don''t end in -a use -ar.',0),
  ('plural-forms','Plural of ''en flicka'' (girl):','["flickar","flickor","flicken"]',1,'Flicka → flickor (group 1: -or). en-words ending in -a replace -a with -or.',1),
  ('plural-forms','Plural of ''ett hus'' (house):','["husar","huser","hus"]',2,'Hus → hus (group 5: no ending). ett-words ending in a consonant don''t change in the plural.',2),
  ('plural-forms','Plural of ''ett äpple'' (apple):','["äpplar","äpplen","äppler"]',1,'Äpple → äpplen (group 4: -n). ett-words ending in a vowel add -n.',3),
  ('plural-forms','Plural of ''en stad'' (city):','["stadar","städer","stader"]',1,'Stad → städer (group 3: -er with vowel change a→ä). Common pattern for many en-words.',4),
  ('plural-forms','Definite plural of ''bilar'':','["bilarna","bilaren","bilars"]',0,'Indefinite plural bilar → definite plural bilarna. Groups 1-3: add -na to the plural form.',5),
  ('plural-forms','Plural of ''en man'' (man):','["manar","männer","män"]',2,'Man → män. Irregular plural with vowel change only — no suffix added.',6),
  ('plural-forms','Plural of ''ett barn'' (child):','["barnar","barnen","barn"]',2,'Barn → barn (group 5: no ending). Definite plural: barnen.',7),
  ('possessives','Choose: ''___ bil är röd.'' (my car, en-word)','["Min","Mitt","Mina"]',0,'Bil is an en-word → use min. Min bil.',0),
  ('possessives','Choose: ''___ hus är stort.'' (my house, ett-word)','["Min","Mitt","Mina"]',1,'Hus is an ett-word → use mitt. Mitt hus.',1),
  ('possessives','Choose: ''___ barn är söta.'' (my children, plural)','["Min","Mitt","Mina"]',2,'Plural → always mina. Mina barn.',2),
  ('possessives','Which is correct?
''Han älskar ___ familj.''','["sin","hans","sitt"]',0,'Sin refers back to the subject (han). Han älskar sin familj = He loves his (own) family.',3),
  ('possessives','Choose: ''Det är ___ bok.'' (your book, en-word)','["din","ditt","dina"]',0,'Bok is an en-word → din bok.',4),
  ('possessives','Which is correct?
''Jag ser hennes ___.'' (her car)','["bil","bils","bilen"]',0,'After hennes/hans/deras, the noun stays indefinite: hennes bil (not hennes bilen).',5),
  ('possessives','Choose the right form:
''Vi älskar ___ stad.'' (our city, en-word)','["vår","vårt","våra"]',0,'Stad is an en-word → vår stad. Vår/vårt/våra follow the same pattern as min/mitt/mina.',6),
  ('basic-svo','Which is the correct SVO sentence?','["Äter jag mat.","Jag äter mat.","Mat äter jag."]',1,'Basic SVO: Subject (Jag) + Verb (äter) + Object (mat).',0),
  ('basic-svo','Identify the subject:
''Maria dricker kaffe.''','["Maria","dricker","kaffe"]',0,'The subject is who/what does the action: Maria.',1),
  ('basic-svo','Identify the verb:
''Barnen leker i parken.''','["Barnen","leker","parken"]',1,'The verb is the action: leker (play/are playing).',2),
  ('basic-svo','Build the sentence: he / reads / a book','["Han läser en bok.","Läser han en bok.","En bok han läser."]',0,'SVO: Han (S) + läser (V) + en bok (O).',3),
  ('basic-svo','Where does ''varje dag'' go?
''Jag tränar ___.''','["varje dag","dag varje","each day"]',0,'Time adverbials typically go at the end in basic SVO sentences: Jag tränar varje dag.',4),
  ('basic-svo','Which sentence is correct SVO?','["Vi bor i Stockholm.","Bor vi i Stockholm.","I Stockholm vi bor."]',0,'Vi (S) + bor (V) + i Stockholm (place). Normal SVO order.',5),
  ('comparative','Comparative of ''stor'' (big):','["störare","större","störst"]',1,'Stor → större (comparative). Irregular: the vowel changes o→ö.',0),
  ('comparative','Superlative of ''lång'' (tall/long):','["långare","längre","längst"]',2,'Lång → längre (comparative) → längst (superlative). Vowel change a→ä.',1),
  ('comparative','Comparative of ''bra'' (good):','["braare","bättre","bäst"]',1,'Bra → bättre (comparative) → bäst (superlative). Completely irregular — must memorise.',2),
  ('comparative','Choose: ''Den här boken är ___ (more interesting) än den andra.''','["intressantare","mer intressant","mest intressant"]',1,'Long adjectives use ''mer'' for comparative: mer intressant. Both forms are actually accepted, but mer intressant is more natural.',3),
  ('comparative','Superlative of ''gammal'' (old):','["gammalt","äldst","äldre"]',1,'Gammal → äldre (comparative) → äldst (superlative). Irregular with vowel change.',4),
  ('comparative','Fill in: ''Hon springer ___ (faster) än mig.''','["snabbast","snabbare","mer snabb"]',1,'Short adjectives: snabb → snabbare (add -are). Snabbast is superlative.',5),
  ('comparative','Choose: ''Det är ___ (the best) kaffe jag druckit.''','["bättre","bäst","mest bra"]',1,'Superlative of bra = bäst. Used here as an adjective before the noun: det bästa kaffet.',6),
  ('reflexive-verbs','Choose: ''Jag ___ varje morgon.'' (get dressed)','["klär","klär mig","klär sig"]',1,'First person: klä sig → klär mig. The reflexive pronoun changes to match the subject.',0),
  ('reflexive-verbs','Fill in: ''Han ___ trött idag.'' (feels)','["känner","känner sig","känner mig"]',1,'Third person: känna sig → känner sig. ''Sig'' is used for han/hon/det/de.',1),
  ('reflexive-verbs','Choose: ''Vi ___ i soffan.'' (sat down)','["satte","satte oss","satte sig"]',1,'First person plural: sätta sig → satte oss. Vi = oss.',2),
  ('reflexive-verbs','Which is correct?
''De ___ (got married) förra året.''','["gifte","gifte sig","gifte dem"]',1,'Gifta sig = to get married. Third person plural uses sig: gifte sig.',3),
  ('reflexive-verbs','Fill in: ''Skynda ___! Vi är sena.'' (hurry up)','["dig","sig","mig"]',0,'Imperative addressed to ''du'': Skynda dig! The reflexive is dig when talking directly to someone.',4),
  ('reflexive-verbs','Choose: ''Hon ___ om livet i Sverige.'' (found out/informed herself)','["informerade","informerade sig","informerade henne"]',1,'Informera sig = to find out / inform oneself. Third person: informerade sig.',5),
  ('genitive','Genitive of ''mannen'' (the man):','["mannens","mannens''","av mannen"]',0,'Add -s with no apostrophe: mannen → mannens. Swedish never uses apostrophe for possession.',0),
  ('genitive','Which is correct? ''The dog''s bowl''','["hundens skål","hunden''s skål","skålen av hunden"]',0,'Hundens skål — genitive -s added directly to the definite form, no apostrophe.',1),
  ('genitive','Genitive of ''Sverige'' (Sweden):','["Sveriges","Sverigens","av Sverige"]',0,'Sverige → Sveriges. Proper nouns add -s directly: Sveriges Radio, Sveriges kung.',2),
  ('genitive','Which is correct? ''Maria''s book''','["Marias bok","Maria''s bok","Bok av Maria"]',0,'Marias bok — names add -s without apostrophe: Marias, Anders bil, Erikas hus.',3),
  ('genitive','Choose: ''The children''s school''','["barnens skola","barns skola","barnenas skola"]',0,'Barn (plural definite: barnen) → barnens skola. Genitive of definite plural.',4),
  ('genitive','Genitive of ''Lars'' (a name ending in -s):','["Lars bil","Lars'' bil","Larss bil"]',1,'When a name ends in -s, add apostrophe + nothing, or just use the name: Lars'' bil or Lars bil. Both are correct.',5),
  ('impersonal-man','Which is correct?
''___ kan lära sig svenska snabbt.''','["Man","En","Det"]',0,'Man = one/you/people in general statements. Man kan lära sig svenska snabbt.',0),
  ('impersonal-man','Object form of ''man'':
''Det kan göra ___ trött.''','["man","en","sig"]',1,'Object form of man is ''en''. Det kan göra en trött = It can make one tired.',1),
  ('impersonal-man','Rewrite passively using ''man'':
''Svenska talas här.''','["Man talar svenska här.","Man talar här svenska.","Svenska man talar här."]',0,'Man talar svenska här = One speaks Swedish here / Swedish is spoken here. Man avoids passive -s form.',2),
  ('impersonal-man','Which is correct?
''I Sverige ___ man kaffe hela dagen.''','["dricker","dricka","dricker sig"]',0,'Man uses same verb form as han/hon — third person singular: dricker.',3),
  ('impersonal-man','Choose the natural Swedish:
''You should exercise more.'' (general advice)','["Du borde träna mer.","Man borde träna mer.","En borde träna mer."]',1,'For general advice not directed at a specific person, Swedish uses ''man'': Man borde träna mer.',4),
  ('impersonal-man','Fill in: ''När ___ är sjuk bör ___ vila.''','["man / man","en / man","man / en"]',0,'Man is used throughout: När man är sjuk bör man vila = When one is sick, one should rest.',5),
  ('compound-nouns','What does ''busshållplats'' mean?','["bus driver","bus stop","bus ticket"]',1,'Buss (bus) + hållplats (stopping place) = bus stop. The meaning comes from combining the parts.',0),
  ('compound-nouns','What gender is ''en busshållplats''?','["en (utrum)","ett (neutrum)","It depends"]',0,'The gender comes from the LAST word: hållplats = en-word → en busshållplats.',1),
  ('compound-nouns','Which is correct?
''a driving licence'' in Swedish','["kör kort","körkort","kör-kort"]',1,'Köra (drive) + kort (card/licence) = körkort. One word, no space or hyphen.',2),
  ('compound-nouns','Compound: ''mat'' + ''butik'' = ?','["matbutik","mat butik","mats butik"]',0,'Mat (food) + butik (shop) = matbutik (food shop / grocery store). No space, no connecting -s here.',3),
  ('compound-nouns','What gender is ''ett arbete'' and what does ''arbetsdag'' mean?','["en-word; working day","ett-word; working day","ett-word; work place"]',1,'Arbete is an ett-word, but arbetsdag: dag = en-word. Working day. Note the connecting -s: arbets-dag.',4),
  ('compound-nouns','Split the compound ''sjukhus'':','["sjuk + hus (sick + house)","sjuk + hus (hospital)","sjut + hus"]',1,'Sjuk (sick/ill) + hus (house/building) = sjukhus (hospital). The compound has its own meaning.',5),
  ('subjunctive-om','Choose: ''Om jag ___ tid, skulle jag hjälpa dig.''','["har","hade","skulle ha"]',1,'In the om-clause, use past tense (hade), not conditional. Om jag hade tid = If I had time.',0),
  ('subjunctive-om','Which is correct?
''If I were rich…''','["Om jag är rik…","Om jag vore rik…","Om jag skulle vara rik…"]',1,'Om jag vore rik = If I were rich. ''Vore'' is the subjunctive of ''vara'' — still used in this set phrase.',1),
  ('subjunctive-om','Complete the hypothetical:
''Om vi ___ (had trained) mer, skulle vi ha vunnit.''','["tränade","hade tränat","skulle träna"]',1,'Past counterfactual om-clause uses pluperfect: hade tränat (had trained).',2),
  ('subjunctive-om','Which is correct?','["Om han skulle komma, ring mig.","Om han kom, ring mig.","Om han kommer, ring mig."]',2,'For real/possible conditions (maybe he will come), use present tense: Om han kommer = If he comes.',3),
  ('subjunctive-om','Translate: ''If I had known, I would have called.''','["Om jag visste, skulle jag ringa.","Om jag hade vetat, skulle jag ha ringt.","Om jag vet, skulle jag ha ringt."]',1,'Past counterfactual: om + pluperfect (hade vetat) → skulle ha + supinum (ringt).',4),
  ('subjunctive-om','Identify the subjunctive set phrase:','["Jag vill vara glad.","Leve Sverige!","Om Sverige är bra."]',1,'Leve Sverige! = Long live Sweden! ''Leve'' is a subjunctive form — rare in modern Swedish but kept in set phrases.',5),
  ('complex-word-order','Which is correct? (fronting the object)','["Den boken har jag redan läst.","Den boken jag har redan läst.","Jag har redan läst den boken."]',0,'Fronting the object (Den boken) triggers V2 inversion: Den boken har jag... Both first and third options are grammatically fine, but first is the fronted version.',0),
  ('complex-word-order','Correct order of sentence adverbs:
''Jag ___ ___ förstår det.''','["inte alltid","alltid inte","inte aldrig"]',0,'Inte comes before alltid in the adverb hierarchy: Jag förstår inte alltid det → Jag förstår det inte alltid.',1),
  ('complex-word-order','Which correctly fronts the time clause?','["När han kom, gick vi hem.","När han kom, vi gick hem.","Gick vi hem, när han kom."]',0,'Fronting a clause triggers V2: När han kom (pos.1) + gick (verb, pos.2) + vi (subject, pos.3).',2),
  ('complex-word-order','Choose the correct formal construction:
''The man living in Stockholm''','["Mannen som bor i Stockholm","Mannen boende i Stockholm","Mannen i Stockholm boende"]',1,'Mannen boende i Stockholm uses a present participle (boende) — more formal/written than the relative clause version.',3),
  ('complex-word-order','Which is correct with multiple adverbials?','["Igår åt jag snabbt lunch hemma.","Igår åt jag hemma snabbt lunch.","Igår snabbt åt jag lunch hemma."]',0,'Order of adverbials: time (igår) → manner (snabbt) → place (hemma) is flexible but manner before place is natural. V2 maintained: Igår åt jag...',4),
  ('complex-word-order','Choose: ''She has still not arrived.''','["Hon har fortfarande inte kommit.","Hon har inte fortfarande kommit.","Hon fortfarande inte har kommit."]',0,'Fortfarande (still) comes before inte in the sentence adverb hierarchy: har + fortfarande + inte + kommit.',5);