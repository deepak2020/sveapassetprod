-- ============================================================
-- Grammar tables
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================

-- Topics table
CREATE TABLE IF NOT EXISTS grammar_topics (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL CHECK (category_id IN ('beginner','intermediate','advanced')),
  title TEXT NOT NULL,
  title_sv TEXT,
  description TEXT,
  rule TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Exercises table
CREATE TABLE IF NOT EXISTS grammar_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id TEXT NOT NULL REFERENCES grammar_topics(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_index INTEGER NOT NULL,
  explanation TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE grammar_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE grammar_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read grammar_topics" ON grammar_topics FOR SELECT USING (true);
CREATE POLICY "public read grammar_exercises" ON grammar_exercises FOR SELECT USING (true);

-- ============================================================
-- Seed data
-- ============================================================

INSERT INTO grammar_topics (id, category_id, title, title_sv, description, rule, sort_order) VALUES
  ('en-ett', 'beginner', 'Noun Gender (en / ett)', 'Substantivens genus', 'Every Swedish noun is either en- or ett-word. Learn the most common patterns.', 'Swedish nouns are either ''en'' (utrum/common gender, ~75% of nouns) or ''ett'' (neutrum). The gender determines article and adjective endings throughout the sentence. Common patterns: living creatures are usually en-words; many short everyday objects are ett-words. There are no hard rules — memorisation + pattern recognition is key.', 0),
  ('definite-forms', 'beginner', 'Definite Forms', 'Bestämd form', 'Add -en or -et to make a noun definite (the dog, the house).', 'In Swedish, ''the'' is added as a suffix to the noun — not a separate word. en-words get -en (hund → hunden), ett-words get -et (hus → huset). Plural definite forms use -na (en-words) or -en/-a (ett-words). When an adjective comes before a definite noun, you use den/det/de as a separate word too (double definiteness: den stora hunden).', 1),
  ('present-tense', 'beginner', 'Present Tense', 'Presens', 'All persons share the same form — Swedish present tense is simpler than English.', 'Swedish present tense is formed by adding -r to the infinitive (or stem). All persons use the same form: jag äter, du äter, han äter, vi äter. Irregular verbs to memorise: vara → är, ha → har, gå → går, stå → står, komma → kommer. The -r ending is the key marker of Swedish present tense.', 2),
  ('negation', 'beginner', 'Negation with ''inte''', 'Negation med ''inte''', 'Where exactly does ''inte'' go in a sentence?', 'In main clauses, ''inte'' comes directly after the finite verb: Jag äter inte (I don''t eat). In subordinate clauses, ''inte'' comes before the finite verb: ...att jag inte äter. This is one of the most common word-order mistakes made by English speakers, who put ''not'' before the verb in all positions.', 3),
  ('basic-pronouns', 'beginner', 'Pronouns', 'Pronomen', 'Subject and object forms — jag/mig, han/honom, hon/henne…', 'Swedish pronouns have two forms: subject (used before the verb) and object (used after the verb or preposition). Key pairs: jag/mig, du/dig, han/honom, hon/henne, det/det, vi/oss, ni/er, de/dem. Common mistake: using ''dom'' (spoken) vs ''de/dem'' (written).', 4),
  ('adjective-agreement', 'intermediate', 'Adjective Agreement', 'Adjektivkongruens', 'Adjectives change ending depending on gender, number, and definiteness.', 'Swedish adjectives agree with the noun in gender and number. Pattern: en-word (no ending), ett-word (add -t), plural (add -a), definite (add -a with den/det/de before). Example: en stor bil / ett stort hus / stora bilar / den stora bilen. Adjectives ending in -d often change to -t (röd → rött).', 0),
  ('v2-rule', 'intermediate', 'V2 Word Order', 'V2-regeln', 'The verb always comes second in a main clause — even after adverbs.', 'In Swedish main clauses, the finite verb MUST be in position 2. If something other than the subject starts the sentence (an adverb, time expression, or object), the subject and verb invert. This is called the V2 (verb-second) rule. English only inverts in questions; Swedish does it in statements too. Example: Idag ATE jag frukost (Today I ate breakfast) → Idag åt jag frukost.', 1),
  ('past-tense', 'intermediate', 'Past Tense', 'Preteritum & Perfekt', 'Preteritum (simple past) vs Perfekt (har + participle) — when to use each.', 'Swedish has two main past tenses. Preteritum (simple past): for completed events, often with time markers like igår/förra veckan. Perfekt (har + supinum): for recent events or events relevant to the present. Regular verbs: -ade ending (köpa → köpte) or -ade (arbeta → arbetade). Key irregulars: vara→var, ha→hade, gå→gick, komma→kom, se→såg, äta→åt.', 2),
  ('modal-verbs', 'intermediate', 'Modal Verbs', 'Modalverb', 'Kan, ska, måste, vill, får, borde — how and when to use each.', 'Swedish modal verbs are followed by the infinitive WITHOUT ''att''. Key modals: kan (can/be able to), ska (will/going to), måste (must/have to), vill (want to), får (may/allowed to), borde (should). They have the same form for all persons in present tense. Past: kunde, skulle, var tvungen att, ville, fick, borde.', 3),
  ('subordinate-clauses', 'intermediate', 'Subordinate Clauses', 'Bisatser', 'Word order changes inside ''att'', ''om'', ''när'' clauses.', 'Inside subordinate clauses (after att, om, när, eftersom, etc.), word order changes: inte/aldrig/redan come BEFORE the verb (not after as in main clauses). Pattern: conjunction + subject + (inte) + verb + rest. Example main clause: Jag äter inte. Subordinate: ...att jag inte äter. This is one of the trickiest rules in Swedish.', 4),
  ('passive-voice', 'advanced', 'Passive Voice', 'Passiv form', 'Two passive constructions: -s form and bli + participle.', 'Swedish passive has two forms. 1) -s passive: add -s to verb (läsa → läses, köpa → köps). Most common in writing and formal speech. 2) Bli + past participle: Huset blir byggt. More common in spoken language. The agent (by whom) uses ''av'': Boken läses av många. Past -s passive: läsas (infinitive), lästes (preteritum past).', 0),
  ('participles', 'advanced', 'Participles', 'Particip', 'Present (-ande) and past participles used as adjectives.', 'Present participles end in -ande (or -ende) and describe ongoing action: springande barn (running children). They don''t change for gender or number. Past participles act as adjectives and do agree: en skriven text / ett skrivet brev / skrivna texter. Past participle forms: en-words (-ad), ett-words (-at), plural (-ade).', 1),
  ('conditional', 'advanced', 'Conditional Mood', 'Konditionalis', '''Skulle + infinitive'' for wishes, hypotheticals, and polite requests.', 'Swedish conditional is formed with ''skulle'' + infinitive (without att). Used for: hypothetical situations (Om jag hade tid, skulle jag...), polite requests (Skulle du kunna hjälpa mig?), and wishes. Past conditional: skulle ha + supinum (Om jag hade vetat, skulle jag ha kommit). Note: conditional is not used in the ''om'' clause itself — that uses past tense.', 2),
  ('relative-clauses', 'advanced', 'Relative Clauses', 'Relativsatser', 'Using ''som'', ''vars'', and ''vilket'' to add information about nouns.', 'The main relative pronoun in Swedish is ''som'' (who/which/that). It''s used for all genders and numbers: mannen som bor här / boken som jag läste. ''Som'' can be subject or object in the clause but CANNOT be omitted (unlike English ''that''). ''Vars'' = whose. ''Vilket'' refers back to a whole clause: Han vann, vilket var fantastiskt.', 3),
  ('double-definiteness', 'advanced', 'Double Definiteness', 'Dubbel bestämdhet', 'When you need BOTH ''den/det/de'' AND the definite suffix together.', 'Swedish has ''double definiteness'': when an adjective modifies a definite noun, you need BOTH the definite article (den/det/de) AND the -en/-et suffix on the noun. Example: bilen (the car) but den röda bilen (the red car — not ''den röd bil''). This is unique to Swedish and confuses many learners. Exception: possessives and demonstratives don''t use the suffix: min bil, denna bil.', 4)
ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, rule=EXCLUDED.rule, description=EXCLUDED.description;

-- Clear existing exercises before re-seeding
DELETE FROM grammar_exercises;

INSERT INTO grammar_exercises (topic_id, question, options, correct_index, explanation, sort_order) VALUES
  ('en-ett', 'Which article is correct?
''___ hund springer i parken.''', '["en","ett"]', 0, 'Hund (dog) is an en-word — living creatures are almost always en-words.', 0),
  ('en-ett', 'Choose the right article:
''___ barn leker utomhus.''', '["en","ett"]', 1, 'Barn (child) is one of the most common ett-words — memorise it!', 1),
  ('en-ett', 'Fill in: ''___ hus är stort.''', '["en","ett"]', 1, 'Hus (house) is an ett-word. Most short, simple nouns for objects are ett.', 2),
  ('en-ett', 'Which is correct?
''___ dag är solig.''', '["en","ett"]', 0, 'Dag (day) is an en-word. Abstract time concepts are usually en.', 3),
  ('en-ett', 'Choose: ''___ äpple är rött.''', '["en","ett"]', 1, 'Äpple (apple) is an ett-word — fruits are often ett but there are exceptions.', 4),
  ('en-ett', 'Which article: ''___ stol står vid bordet.''', '["en","ett"]', 0, 'Stol (chair) is an en-word. Furniture words vary — stol/soffa/säng are all en.', 5),
  ('en-ett', 'Fill in: ''___ bord är brunt.''', '["en","ett"]', 1, 'Bord (table) is an ett-word, unlike most furniture.', 6),
  ('en-ett', 'Choose: ''___ bil är röd.''', '["en","ett"]', 0, 'Bil (car) is an en-word — vehicles are nearly always en.', 7),
  ('definite-forms', 'Make definite: ''hund'' (dog, en-word)', '["hunden","hundt","hundena"]', 0, 'en-words add -en in singular definite: hund → hunden.', 0),
  ('definite-forms', 'Make definite: ''hus'' (house, ett-word)', '["husen","huset","husena"]', 1, 'ett-words add -et in singular definite: hus → huset.', 1),
  ('definite-forms', 'Which is correct? ''Jag ser ___ (the cat).''', '["katt","katten","kattens"]', 1, 'Katt is an en-word → katten. Used as direct object here.', 2),
  ('definite-forms', 'Definite plural of ''bil'' (car, en-word):', '["bilens","bilar","bilarna"]', 2, 'en-words plural definite: bilar → bilarna (adds -na).', 3),
  ('definite-forms', 'Which is right? ''___ barn är trött.'' (The child is tired)', '["Det","Den","En"]', 0, 'Barn is an ett-word, so use ''det'' as demonstrative: Det barnet. But predicatively: Det barn = that child (neutral).', 4),
  ('definite-forms', 'Make definite: ''bok'' (book, en-word)', '["boken","boket","böcker"]', 0, 'Bok → boken. Note: the plural is böcker (with vowel change), but singular definite is boken.', 5),
  ('present-tense', 'Conjugate ''att äta'' (to eat):
''Jag ___ middag kl 18.''', '["äta","äter","ätade"]', 1, 'äta → äter. Add -r to the infinitive for most verbs.', 0),
  ('present-tense', 'Fill in: ''Hon ___ svenska och engelska.''', '["talar","tala","talat"]', 0, 'tala → talar. All persons: jag/du/han/vi/ni/de talar.', 1),
  ('present-tense', 'Correct form of ''vara'' (be):
''Vi ___ hemma idag.''', '["vara","var","är"]', 2, 'vara is irregular → är in present tense for ALL persons.', 2),
  ('present-tense', 'Fill in: ''De ___ kaffe på morgonen.''', '["dricker","dricka","drack"]', 0, 'dricka → dricker (the -a in the infinitive changes to -er).', 3),
  ('present-tense', 'Choose: ''Jag ___ till jobbet varje dag.''', '["gå","gick","går"]', 2, 'gå → går. Short infinitives like gå, stå, bo add only -r.', 4),
  ('present-tense', 'Conjugate ''ha'' (have):
''Du ___ en bra dag.''', '["ha","har","hade"]', 1, 'ha → har. One of the most common irregular verbs.', 5),
  ('present-tense', 'Fill in: ''Han ___ en stor hund.''', '["har","hava","hade"]', 0, 'Present tense of ha is always har, for all persons.', 6),
  ('negation', 'Where does ''inte'' go?
''Jag ___ förstår ___ svenska.''', '["inte / —","— / inte","inte / inte"]', 1, 'In main clauses: verb THEN inte. Jag förstår inte svenska.', 0),
  ('negation', 'Which is correct?', '["Jag inte äter kött.","Jag äter inte kött.","Inte jag äter kött."]', 1, 'Main clause: subject + verb + inte. Jag äter inte kött.', 1),
  ('negation', 'Correct subordinate clause:
''Jag vet att han ___ kommer.''', '["inte","ej","icke"]', 0, 'In subordinate clauses after ''att'', inte comes BEFORE the verb: att han inte kommer.', 2),
  ('negation', 'Choose the correct sentence:', '["Hon arbetar inte på söndagar.","Hon inte arbetar på söndagar.","Inte hon arbetar på söndagar."]', 0, 'Subject + verb + inte is the correct main clause order.', 3),
  ('negation', 'Which is right?
''Jag vet att de ___ bor här.''', '["inte","ej","no"]', 0, 'In the subordinate clause ''att de bor här'', inte goes before the verb: att de inte bor här.', 4),
  ('basic-pronouns', 'Choose the subject pronoun:
''___ bor i Stockholm.''', '["Mig","Jag","Honom"]', 1, 'Jag is the subject form. Mig is the object form (e.g. ''Han ser mig'').', 0),
  ('basic-pronouns', 'Choose the object form:
''Han hälsar på ___.''', '["hon","henne","hennes"]', 1, 'After a verb or preposition, use object form: henne (her).', 1),
  ('basic-pronouns', 'Fill in: ''___ (they) spelar fotboll.''', '["De","Dem","Dom"]', 0, 'De is subject form. Dem is object form. In writing, use de/dem (not dom).', 2),
  ('basic-pronouns', 'Which is correct?
''Jag ser ___ (them) i parken.''', '["de","dem","deras"]', 1, 'Object form of de is dem: Jag ser dem.', 3),
  ('basic-pronouns', 'Choose: ''___ (we) har en stor familj.''', '["Oss","Vi","Vår"]', 1, 'Vi is subject form. Oss is object form: Han hjälper oss.', 4),
  ('adjective-agreement', 'Choose: ''en ___ (big) stol''', '["stor","stort","stora"]', 0, 'en-words: no extra ending. en stor stol.', 0),
  ('adjective-agreement', 'Fill in: ''ett ___ (big) hus''', '["stor","stort","stora"]', 1, 'ett-words: add -t. ett stort hus.', 1),
  ('adjective-agreement', 'Choose: ''___ (big) bilar''', '["stor","stort","stora"]', 2, 'Plural: always -a. stora bilar.', 2),
  ('adjective-agreement', 'Which is correct? ''den ___ boken''', '["ny","nytt","nya"]', 2, 'Definite form (after den/det/de): always -a. den nya boken.', 3),
  ('adjective-agreement', 'Fill in: ''ett ___ (red) äpple''', '["röd","rött","röda"]', 1, 'ett-word + adjective ending in -d → -tt. rött äpple.', 4),
  ('adjective-agreement', 'Choose: ''en ___ (new) dag''', '["ny","nytt","nya"]', 0, 'en-word, indefinite singular: no ending. en ny dag.', 5),
  ('adjective-agreement', 'Which is right? ''det ___ (old) huset''', '["gammal","gammalt","gamla"]', 2, 'Definite (det + noun): adjective gets -a. det gamla huset.', 6),
  ('v2-rule', 'Which sentence is correct?', '["Idag jag åt frukost.","Idag åt jag frukost.","Jag åt idag frukost."]', 1, 'When idag starts the sentence, verb comes next (position 2): Idag åt jag...', 0),
  ('v2-rule', 'Correct V2: ''Igår ___ hon till skolan.''', '["gick","hon gick","gå"]', 0, 'Igår (adverb) is position 1, so verb (gick) must be position 2: Igår gick hon...', 1),
  ('v2-rule', 'Which is correct?', '["På morgonen dricker hon kaffe.","På morgonen hon dricker kaffe.","Hon dricker på morgonen kaffe."]', 0, 'På morgonen is pos. 1 → verb second → subject third: På morgonen dricker hon...', 2),
  ('v2-rule', 'Choose: ''Sedan ___ de hem.''', '["gick","de gick","gå"]', 0, 'Sedan (then) starts the clause → V2: Sedan gick de hem.', 3),
  ('v2-rule', 'Is this correct? ''Varje dag studerar jag svenska.''', '["Yes, correct V2","No — should be ''Varje dag jag studerar''","No — should start with ''Jag''"]', 0, 'Varje dag = pos. 1, studerar = pos. 2, jag = pos. 3. Perfect V2.', 4),
  ('v2-rule', 'Which is correct?', '["Ofta jag arbetar hemifrån.","Jag arbetar ofta hemifrån.","Arbetar jag ofta hemifrån."]', 1, 'Jag (subject) starts → normal order: subject + verb + adverb.', 5),
  ('past-tense', 'Choose preteritum of ''gå'':
''Vi ___ hem igår.''', '["gick","har gått","gå"]', 0, 'With igår (yesterday), use preteritum: gick. Perfect would be: vi har gått.', 0),
  ('past-tense', 'Which is correct?
''Jag ___ aldrig ätit sushi.''', '["har","hade","åt"]', 0, 'Perfekt (har + supinum) for experience/relevance to present: Jag har aldrig ätit.', 1),
  ('past-tense', 'Past tense of ''vara'':
''Vi ___ hemma hela helgen.''', '["är","var","varit"]', 1, 'vara → var (preteritum). Hela helgen suggests a completed past period.', 2),
  ('past-tense', 'Choose: ''Han ___ (buy) en ny bil förra månaden.''', '["köpte","har köpt","köper"]', 0, 'Förra månaden = specific past time marker → use preteritum: köpte.', 3),
  ('past-tense', 'Which is correct?
''De ___ just (just arrived) hem.''', '["kom","har kommit","kommer"]', 1, 'Just = very recently, still relevant now → perfekt: har kommit.', 4),
  ('past-tense', 'Past of ''se'' (see):
''Jag ___ en bra film igår.''', '["ser","såg","sett"]', 1, 'se → såg (preteritum). Common irregular: se/ser/såg/sett.', 5),
  ('modal-verbs', 'Choose: ''Jag ___ inte äta gluten.''', '["kan inte","måste inte","inte kan"]', 0, 'Kan inte = cannot. Måste inte = must not (prohibition). Context: physical inability → kan inte.', 0),
  ('modal-verbs', 'Fill in: ''Du ___ (should) träna mer.''', '["ska","borde","vill"]', 1, 'Borde = should (advice). Ska = will/going to. Vill = want to.', 1),
  ('modal-verbs', 'Which is correct?
''Får jag ___ ett glas vatten?''', '["be om","beom","fråga om"]', 0, 'Får jag be om = may I ask for. Får = may (permission). Modal + infinitive without att.', 2),
  ('modal-verbs', 'Choose: ''De ___ (must) lämna in rapporten imorgon.''', '["måste","borde","kan"]', 0, 'Måste = must (obligation). Borde = should (suggestion). Imorgon = deadline → måste.', 3),
  ('modal-verbs', 'Fill in: ''Jag ___ (want to) lära mig svenska.''', '["vill","ska","måste"]', 0, 'Vill = want to. Ska = will/plans. Context: expressing desire → vill.', 4),
  ('modal-verbs', 'Which is correct?
''Han ___ (is going to) flytta till Göteborg.''', '["ska","vill","kan"]', 0, 'Ska = future plans / going to. Han ska flytta = He is going to move.', 5),
  ('subordinate-clauses', 'Which is correct subordinate clause?
''Jag vet att han ___.''', '["inte kommer","kommer inte","ej kommer"]', 0, 'In subordinate clauses: subject + inte + verb. att han inte kommer.', 0),
  ('subordinate-clauses', 'Choose: ''Om du ___ tid, ring mig!''', '["har inte","inte har","have not"]', 1, 'Subordinate clause after ''om'': inte before verb. Om du inte har tid...', 1),
  ('subordinate-clauses', 'Which is correct?', '["Jag tror att hon alltid tränar.","Jag tror att hon tränar alltid.","Jag tror alltid att hon tränar."]', 0, 'In subordinate clause after att: adverb (alltid) before verb: att hon alltid tränar.', 2),
  ('subordinate-clauses', 'Fill in: ''Han sa att han ___ (had never been) i Sverige.''', '["aldrig hade varit","hade aldrig varit","aldrig var"]', 0, 'Subordinate clause: subject + aldrig + verb: att han aldrig hade varit.', 3),
  ('subordinate-clauses', 'Which clause is correct?', '["...eftersom vi inte har pengar.","...eftersom vi har inte pengar.","...eftersom inte vi har pengar."]', 0, 'Eftersom introduces subordinate clause: vi + inte + har. vi inte har pengar.', 4),
  ('passive-voice', 'Form the -s passive:
''De säljer biljetter.'' → ''Biljetter ___.''', '["säljas","säljs","sälja"]', 1, 'Present -s passive: sälja → säljs. Remove the -a and add -s.', 0),
  ('passive-voice', 'Which is correct passive?
''Huset ___ (was built) 1920.''', '["byggdes","byggdes av","byggs"]', 0, 'Past -s passive: bygga → byggdes. Preteritum passive.', 1),
  ('passive-voice', 'Choose the bli-passive:
''Rapporten ___ snart.''', '["skrivs","blir skriven","skrivades"]', 1, 'Bli + past participle: blir skriven. More colloquial than -s form.', 2),
  ('passive-voice', 'Fill in: ''Boken ___ av Astrid Lindgren.''', '["skrevs","skrives","skrivade"]', 0, 'Past passive -s: skriva → skrevs. Agent introduced by ''av''.', 3),
  ('passive-voice', 'Which is correct?', '["Maten serveras kl 18.","Maten servar kl 18.","Maten serverats kl 18."]', 0, 'Present -s passive: serva → serveras. Kl 18 = time marker, so present/scheduled.', 4),
  ('participles', 'Form the present participle of ''sjunga'':
''en ___ fågel''', '["sjungande","sjungen","sjungad"]', 0, 'Present participle: sjunga → sjungande. Add -ande to the stem.', 0),
  ('participles', 'Choose the correct past participle:
''ett ___ (broken) fönster''', '["bruten","brutet","brustet"]', 1, 'ett-word: past participle adds -et → brutet fönster.', 1),
  ('participles', 'Which is correct?
''en ___ (written) rapport''', '["skrivet","skriven","skrivande"]', 1, 'en-word: past participle takes -en → skriven rapport.', 2),
  ('participles', 'Choose: ''___ (sleeping) barn sover länge.''', '["Sovande","Sovade","Sovad"]', 0, 'Present participle: sova → sovande. No gender/number change.', 3),
  ('participles', 'Which is correct for plural?
''___ (painted) väggar''', '["målad","målat","målade"]', 2, 'Plural past participle always ends in -ade: målade väggar.', 4),
  ('conditional', 'Complete: ''Om jag hade pengar, ___ jag resa mer.''', '["ska","skulle","vill"]', 1, 'Om + past tense → conditional clause with skulle. Skulle jag resa.', 0),
  ('conditional', 'Polite request: ''___ du kunna hjälpa mig?''', '["Ska","Skulle","Kan"]', 1, 'Skulle is more polite than ska or kan for requests: Skulle du kunna...?', 1),
  ('conditional', 'Past conditional: ''Om jag ___ (had known), skulle jag ha kommit.''', '["visste","hade vetat","vet"]', 1, 'In the om-clause, use pluperfect (hade + supinum): hade vetat.', 2),
  ('conditional', 'Which is correct?', '["Jag skulle vilja ha ett kaffe.","Jag vill ska ha ett kaffe.","Jag ska vilja ha ett kaffe."]', 0, 'Skulle + vilja + infinitive = polite ''I would like''. Standard polite form.', 3),
  ('conditional', 'Choose: ''Vi ___ (would have) vunnit om vi hade tränat mer.''', '["skulle vinna","skulle ha vunnit","hade vunnit"]', 1, 'Past conditional: skulle ha + supinum. Skulle ha vunnit = would have won.', 4),
  ('relative-clauses', 'Choose: ''Boken ___ jag läste var bra.''', '["som","vilket","vars"]', 0, 'Som is the relative pronoun for all genders: boken som jag läste.', 0),
  ('relative-clauses', 'Which is correct?
''Mannen ___ bor granne med oss heter Anders.''', '["som","vars","vilken"]', 0, 'Som = who/which/that. Used for all nouns regardless of gender.', 1),
  ('relative-clauses', 'Choose: ''Flickan, ___ cykel stals, grät.''', '["som","vars","vilket"]', 1, 'Vars = whose. Flickan vars cykel stals = The girl whose bike was stolen.', 2),
  ('relative-clauses', 'Fill in: ''Han klarade provet, ___ förvånade alla.''', '["som","vars","vilket"]', 2, 'Vilket refers back to a whole clause/situation: vilket förvånade alla = which surprised everyone.', 3),
  ('relative-clauses', 'Which is correct?', '["Det är filmen som jag pratade om.","Det är filmen jag pratade om.","Both are correct"]', 2, 'Both are correct! Unlike ''which/that'' in English, ''som'' can be omitted when it''s the object of a preposition in relative clauses.', 4),
  ('double-definiteness', 'Which is correct? ''the big house''', '["ett stort hus","det stora huset","den stora hus"]', 1, 'Definite: det (ett-word) + stora (adj with -a) + huset (noun with -et). All three needed.', 0),
  ('double-definiteness', 'Choose: ''the red car''', '["en röd bil","den röda bilen","den röd bil"]', 1, 'Double definiteness: den + röda + bilen. Both article and noun suffix required.', 1),
  ('double-definiteness', 'Which is correct? ''the old woman''', '["den gamla kvinnan","den gammal kvinna","den gamla kvinna"]', 0, 'den + gamla (adj -a) + kvinnan (noun + -n). All three required.', 2),
  ('double-definiteness', 'Does ''min bil'' need double definiteness?', '["Yes: min bilen","No: min bil is already definite","Yes: den min bilen"]', 1, 'With possessives (min/din/hans etc.), NO double definiteness: just min bil (not min bilen).', 3),
  ('double-definiteness', 'Choose: ''the blue books''', '["de blå böckerna","de blå böcker","de blåa böckerna"]', 0, 'Plural definite: de + blå (adj, no change for colour adjectives) + böckerna (-na suffix). De blå böckerna.', 4);