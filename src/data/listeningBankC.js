// Hörförståelse practice bank — course C, modeled on the national SFI test.
// Items are grouped per category (samtal, telefonsamtal, röstmeddelande,
// utrop, berättelse, nyheter, matchning). All content is original.
//
// audioUrl: pre-generated audio file. When null, the app falls back to
// reading the transcript with the browser's speech synthesis.

import { shuffle } from "@/lib/shuffle";

export const LISTENING_CATEGORIES_C = [
  {
    type: "dialogue",
    label: "Samtal",
    emoji: "💬",
    description: "Vardagliga samtal mellan två personer",
    items: [
      {
        id: "c-dia-001",
        intro: "Två vänner, Lina och Omar, pratar om helgen.",
        audioUrl: null,
        transcript: [
          { speaker: "Lina", text: "Hej Omar! Vad ska du göra i helgen?" },
          { speaker: "Omar", text: "Hej Lina! Jag är inte säker än. På lördag måste jag jobba till klockan tre, men sedan är jag ledig." },
          { speaker: "Lina", text: "Perfekt! Vi tänkte grilla i parken på lördag kväll. Kan du komma efter jobbet?" },
          { speaker: "Omar", text: "Ja, gärna! Ska jag ta med något?" },
          { speaker: "Lina", text: "Kan du köpa dricka? Vi har redan kött och sallad." },
          { speaker: "Omar", text: "Absolut. Hur dags börjar ni?" },
          { speaker: "Lina", text: "Vi ses vid den stora grillplatsen klockan fem. Om det regnar är vi hemma hos mig i stället." },
          { speaker: "Omar", text: "Toppen! Då ses vi på lördag." },
        ],
        questions: [
          { q: "När slutar Omar att jobba på lördag?", options: ["Klockan tolv", "Klockan tre", "Klockan fem", "Han jobbar inte på lördag"], correctIndex: 1 },
          { q: "Vad ska Omar ta med till grillkvällen?", options: ["Kött", "Sallad", "Dricka", "Ingenting"], correctIndex: 2 },
          { q: "Vad gör de om det regnar?", options: ["De ställer in grillkvällen", "De grillar i parken ändå", "De träffas hemma hos Lina", "De går på restaurang"], correctIndex: 2 },
        ],
      },
    ],
  },
  {
    type: "phone",
    label: "Telefonsamtal",
    emoji: "📞",
    description: "Telefonsamtal till vården, skolan, företag och myndigheter",
    items: [
      {
        id: "c-tel-001",
        intro: "Amir ringer till vårdcentralen.",
        audioUrl: null,
        transcript: [
          { speaker: "Karin", text: "Vårdcentralen Söder, du talar med Karin." },
          { speaker: "Amir", text: "Hej, jag heter Amir Hassan. Jag skulle vilja boka en tid hos läkare. Jag har haft ont i halsen och feber i tre dagar." },
          { speaker: "Karin", text: "Okej. Har du varit hos oss tidigare?" },
          { speaker: "Amir", text: "Ja, jag är listad hos er." },
          { speaker: "Karin", text: "Då ska vi se. Vi har en tid i morgon klockan kvart över tio hos doktor Lindberg. Passar det?" },
          { speaker: "Amir", text: "I morgon förmiddag är det svårt. Jag måste lämna barnen på förskolan och sedan har jag ett möte. Finns det något på eftermiddagen?" },
          { speaker: "Karin", text: "Klockan halv tre i morgon eftermiddag, går det bra?" },
          { speaker: "Amir", text: "Ja, det passar perfekt." },
          { speaker: "Karin", text: "Bra. Ta med legitimation och kom tio minuter innan. Besöket kostar tvåhundra kronor, eller är gratis om du har frikort." },
          { speaker: "Amir", text: "Tack så mycket! Hej då." },
        ],
        questions: [
          { q: "Varför ringer Amir till vårdcentralen?", options: ["Han vill beställa medicin", "Han vill boka en läkartid", "Han vill avboka en tid", "Han vill fråga om öppettider"], correctIndex: 1 },
          { q: "När får Amir en tid hos läkaren?", options: ["I dag klockan kvart över tio", "I morgon klockan kvart över tio", "I morgon klockan halv tre", "På fredag klockan halv tre"], correctIndex: 2 },
          { type: "open", q: "Hur mycket kostar besöket om man inte har frikort? Skriv ditt svar.", accept: ["200 kronor", "200 kr", "200", "tvåhundra kronor", "tvåhundra"] },
        ],
      },
      {
        id: "c-tel-002",
        intro: "Sara ringer till tandläkaren.",
        audioUrl: null,
        transcript: [
          { speaker: "Receptionist", text: "Tandvården City, god morgon!" },
          { speaker: "Sara", text: "God morgon! Jag heter Sara Lindqvist. Jag har tappat en bit av en tand och behöver en tid så snart som möjligt." },
          { speaker: "Receptionist", text: "Oj då. Har du ont?" },
          { speaker: "Sara", text: "Lite grann när jag äter något kallt." },
          { speaker: "Receptionist", text: "Vi har faktiskt en återbudstid i dag klockan kvart i fyra. Annars blir det först nästa onsdag." },
          { speaker: "Sara", text: "Jag tar tiden i dag, tack. Vad kostar ett besök?" },
          { speaker: "Receptionist", text: "Undersökningen kostar åttahundrafemtio kronor. Om tanden behöver lagas tillkommer det en kostnad, men tandläkaren berättar mer på plats." },
          { speaker: "Sara", text: "Okej, tack. Då kommer jag klockan kvart i fyra." },
        ],
        questions: [
          { q: "Varför ringer Sara till tandläkaren?", options: ["Hon har tandvärk på natten", "Hon har tappat en bit av en tand", "Hon vill bleka tänderna", "Hon vill avboka en tid"], correctIndex: 1 },
          { q: "När får Sara en tid?", options: ["I dag klockan kvart i fyra", "I morgon klockan fyra", "På onsdag nästa vecka", "Nästa fredag"], correctIndex: 0 },
          { q: "Vad kostar undersökningen?", options: ["Fyrahundrafemtio kronor", "Åttahundrafemtio kronor", "Femhundra kronor", "Det är gratis"], correctIndex: 1 },
        ],
      },
      {
        id: "c-tel-003",
        intro: "Hassan ringer till sitt barns skola.",
        audioUrl: null,
        transcript: [
          { speaker: "Skolpersonal", text: "Solgårdsskolan, det är Anna." },
          { speaker: "Hassan", text: "Hej Anna, det är Hassan, pappa till Yusuf i klass 3B. Jag ringer för att sjukanmäla honom. Han har fått feber i natt." },
          { speaker: "Skolpersonal", text: "Tack för att du ringer. Jag meddelar hans lärare. Hur länge tror du att han blir hemma?" },
          { speaker: "Hassan", text: "Förmodligen i två eller tre dagar. Jag ringer igen om det blir längre." },
          { speaker: "Skolpersonal", text: "Det låter bra. Kom ihåg att du också kan sjukanmäla via appen, så slipper du ringa varje morgon." },
          { speaker: "Hassan", text: "Ah, det visste jag inte. Tack för tipset!" },
          { speaker: "Skolpersonal", text: "Ingen orsak. Krya på Yusuf!" },
        ],
        questions: [
          { q: "Varför ringer Hassan till skolan?", options: ["Yusuf har glömt sin väska", "Han vill prata med läraren", "Han vill sjukanmäla sitt barn", "Han vill boka ett möte"], correctIndex: 2 },
          { q: "Hur länge tror Hassan att Yusuf blir hemma?", options: ["En dag", "Två eller tre dagar", "En vecka", "Han vet inte alls"], correctIndex: 1 },
          { q: "Vilket tips får Hassan?", options: ["Att ringa tidigare på morgonen", "Att sjukanmäla via appen", "Att kontakta rektorn", "Att hämta läxor på skolan"], correctIndex: 1 },
        ],
      },
      {
        id: "c-tel-004",
        intro: "Elena ringer till sin hyresvärd.",
        audioUrl: null,
        transcript: [
          { speaker: "Hyresvärd", text: "Bergmans Fastigheter, Peter här." },
          { speaker: "Elena", text: "Hej, det är Elena Popescu på Storgatan tolv. Min diskmaskin har slutat fungera. Det står vatten kvar i botten efter varje disk." },
          { speaker: "Hyresvärd", text: "Okej. Har du provat att rengöra filtret? Det sitter längst ner i maskinen." },
          { speaker: "Elena", text: "Ja, jag rengjorde det i går, men det hjälpte inte." },
          { speaker: "Hyresvärd", text: "Då skickar jag vår reparatör. Han kan komma på torsdag mellan klockan åtta och tolv. Är någon hemma då?" },
          { speaker: "Elena", text: "Jag jobbar, men min man är hemma på torsdag förmiddag." },
          { speaker: "Hyresvärd", text: "Perfekt. Reparatören ringer ungefär en halvtimme innan han kommer." },
          { speaker: "Elena", text: "Tack så mycket, Peter. Hej då!" },
        ],
        questions: [
          { q: "Vad är problemet med diskmaskinen?", options: ["Den låter konstigt", "Det står vatten kvar i botten", "Den startar inte alls", "Den läcker på golvet"], correctIndex: 1 },
          { q: "Vad har Elena redan provat?", options: ["Att starta om maskinen", "Att rengöra filtret", "Att ringa en reparatör själv", "Att diska för hand"], correctIndex: 1 },
          { q: "När kommer reparatören?", options: ["I dag på eftermiddagen", "På torsdag mellan åtta och tolv", "På fredag morgon", "Nästa vecka"], correctIndex: 1 },
        ],
      },
      {
        id: "c-tel-005",
        intro: "Ali ringer till banken.",
        audioUrl: null,
        transcript: [
          { speaker: "Banktjänsteman", text: "Välkommen till banken, du talar med Maria." },
          { speaker: "Ali", text: "Hej! Jag behöver spärra mitt bankkort. Jag tror att jag tappade det på bussen i morse." },
          { speaker: "Banktjänsteman", text: "Det ordnar vi direkt. Kan du verifiera dig med BankID?" },
          { speaker: "Ali", text: "Ja, ett ögonblick. Så, klart." },
          { speaker: "Banktjänsteman", text: "Tack. Nu är kortet spärrat. Ingen kan använda det längre. Vill du att vi skickar ett nytt kort?" },
          { speaker: "Ali", text: "Ja tack. Hur lång tid tar det?" },
          { speaker: "Banktjänsteman", text: "Det nya kortet kommer med posten inom fem arbetsdagar. Under tiden kan du betala med mobilen som vanligt." },
          { speaker: "Ali", text: "Vad bra. Tack för hjälpen!" },
        ],
        questions: [
          { q: "Varför ringer Ali till banken?", options: ["Han vill öppna ett konto", "Han vill spärra sitt kort", "Han vill låna pengar", "Hans kort har gått sönder"], correctIndex: 1 },
          { q: "Var tror Ali att han tappade kortet?", options: ["I affären", "På jobbet", "På bussen", "Hemma"], correctIndex: 2 },
          { q: "Hur lång tid tar det innan det nya kortet kommer?", options: ["Två arbetsdagar", "Fem arbetsdagar", "En dag", "Två veckor"], correctIndex: 1 },
        ],
      },
      {
        id: "c-tel-006",
        intro: "Fatou ringer till en restaurang.",
        audioUrl: null,
        transcript: [
          { speaker: "Servitör", text: "Restaurang Havet, god kväll!" },
          { speaker: "Fatou", text: "God kväll! Jag skulle vilja boka ett bord för sex personer på lördag kväll. Vi firar min mammas födelsedag." },
          { speaker: "Servitör", text: "Vad trevligt! Klockan sex eller klockan nio har vi lediga bord för sex personer." },
          { speaker: "Fatou", text: "Klockan sex passar bättre, vi har barn med oss." },
          { speaker: "Servitör", text: "Då bokar jag klockan sex. Finns det några allergier i sällskapet?" },
          { speaker: "Fatou", text: "Ja, min son är allergisk mot nötter." },
          { speaker: "Servitör", text: "Tack för informationen, jag skriver det i bokningen. Vilket namn bokar jag på?" },
          { speaker: "Fatou", text: "Fatou Diallo. Tack så mycket!" },
        ],
        questions: [
          { q: "Varför ringer Fatou till restaurangen?", options: ["Hon vill beställa mat för avhämtning", "Hon vill boka ett bord", "Hon vill avboka ett bord", "Hon vill fråga om menyn"], correctIndex: 1 },
          { q: "Vilken tid väljer Fatou?", options: ["Klockan fem", "Klockan sex", "Klockan nio", "Klockan sju"], correctIndex: 1 },
          { q: "Vad är Fatous son allergisk mot?", options: ["Mjölk", "Gluten", "Nötter", "Fisk"], correctIndex: 2 },
        ],
      },
      {
        id: "c-tel-007",
        intro: "Marek sjukanmäler sig till jobbet.",
        audioUrl: null,
        transcript: [
          { speaker: "Chef", text: "Det är Eva." },
          { speaker: "Marek", text: "Hej Eva, det är Marek. Jag måste tyvärr sjukanmäla mig i dag. Jag har varit magsjuk hela natten." },
          { speaker: "Chef", text: "Oj då, stackars dig. Stanna hemma och vila. Hinner du skicka över rapporten, eller ska jag be Jonas ta den?" },
          { speaker: "Marek", text: "Det är nog bäst att Jonas tar den. Jag orkar inte titta på skärmen just nu." },
          { speaker: "Chef", text: "Självklart. Kom ihåg att om du är sjuk mer än sju dagar behöver vi ett läkarintyg." },
          { speaker: "Marek", text: "Jag vet, men jag hoppas vara tillbaka på onsdag." },
          { speaker: "Chef", text: "Bra. Krya på dig, och hör av dig i morgon!" },
        ],
        questions: [
          { q: "Varför ringer Marek till sin chef?", options: ["Han vill byta arbetspass", "Han är sjuk och stannar hemma", "Han kommer för sent", "Han vill ta semester"], correctIndex: 1 },
          { q: "Vem ska ta hand om rapporten?", options: ["Marek själv", "Eva", "Jonas", "Ingen"], correctIndex: 2 },
          { q: "När behövs ett läkarintyg?", options: ["Efter tre dagar", "Efter sju dagar", "Direkt första dagen", "Efter två veckor"], correctIndex: 1 },
        ],
      },
      {
        id: "c-tel-008",
        intro: "Leila ringer till apoteket.",
        audioUrl: null,
        transcript: [
          { speaker: "Farmaceut", text: "Apoteket Hjärtat, du talar med Sofia." },
          { speaker: "Leila", text: "Hej! Min läkare har skickat ett recept till er. Jag undrar om medicinen finns inne." },
          { speaker: "Farmaceut", text: "Vad heter du och vad är det för medicin?" },
          { speaker: "Leila", text: "Leila Ahmadi. Det är en allergimedicin, jag minns inte namnet." },
          { speaker: "Farmaceut", text: "Ett ögonblick. Jo, jag ser receptet här. Tyvärr är medicinen slut just nu, men vi får leverans i morgon förmiddag." },
          { speaker: "Leila", text: "Okej. Kan ni lägga undan den åt mig?" },
          { speaker: "Farmaceut", text: "Absolut, vi reserverar den. Du kan hämta den efter klockan elva i morgon. Glöm inte legitimation." },
          { speaker: "Leila", text: "Tack snälla! Hej då." },
        ],
        questions: [
          { q: "Varför ringer Leila till apoteket?", options: ["Hon vill förnya sitt recept", "Hon undrar om hennes medicin finns inne", "Hon har fått fel medicin", "Hon vill fråga om biverkningar"], correctIndex: 1 },
          { q: "När kan Leila hämta medicinen?", options: ["I dag före stängning", "I morgon efter klockan elva", "På fredag morgon", "Om en vecka"], correctIndex: 1 },
          { q: "Vad ska Leila ta med sig?", options: ["Receptet på papper", "Sitt bankkort", "Legitimation", "Sin gamla medicinförpackning"], correctIndex: 2 },
        ],
      },
      {
        id: "c-tel-009",
        intro: "Viktor ringer till en bilverkstad.",
        audioUrl: null,
        transcript: [
          { speaker: "Mekaniker", text: "Bilverkstan, det är Tommy." },
          { speaker: "Viktor", text: "Hej Tommy! Min bil låter konstigt när jag bromsar. Det piper och gnisslar. Kan ni ta en titt?" },
          { speaker: "Mekaniker", text: "Det låter som bromsbeläggen. Hur snart kan du komma in med bilen?" },
          { speaker: "Viktor", text: "Jag kan komma på fredag morgon om det går." },
          { speaker: "Mekaniker", text: "Fredag klockan åtta funkar. Räkna med att bilen är hos oss hela dagen." },
          { speaker: "Viktor", text: "Okej. Vad kommer det att kosta ungefär?" },
          { speaker: "Mekaniker", text: "Om det bara är bromsbeläggen fram ligger det på runt tvåtusen kronor inklusive arbete. Vi ringer dig innan vi gör något som kostar mer." },
          { speaker: "Viktor", text: "Låter bra. Vi ses på fredag!" },
        ],
        questions: [
          { q: "Vad är problemet med Viktors bil?", options: ["Motorn startar inte", "Den låter konstigt när han bromsar", "Däcken är slitna", "Lamporna fungerar inte"], correctIndex: 1 },
          { q: "Vad tror mekanikern att problemet är?", options: ["Motorn", "Batteriet", "Bromsbeläggen", "Växellådan"], correctIndex: 2 },
          { q: "Vad gör verkstaden innan de utför dyrare arbeten?", options: ["Skickar en faktura", "Ringer Viktor", "Skickar ett sms", "Ingenting"], correctIndex: 1 },
        ],
      },
      {
        id: "c-tel-010",
        intro: "Amina ringer till kommunen om förskoleplats.",
        audioUrl: null,
        transcript: [
          { speaker: "Handläggare", text: "Kommunens kontaktcenter, du talar med Lars." },
          { speaker: "Amina", text: "Hej! Jag har ansökt om förskoleplats för min dotter och undrar hur länge jag behöver vänta." },
          { speaker: "Handläggare", text: "Vilket datum lämnade du in ansökan?" },
          { speaker: "Amina", text: "I början av mars, för ungefär två månader sedan." },
          { speaker: "Handläggare", text: "Då ska du ha besked snart. Kommunen ska erbjuda en plats inom fyra månader från ansökan, så senast i början av juli." },
          { speaker: "Amina", text: "Kan jag önska en särskild förskola?" },
          { speaker: "Handläggare", text: "Du har redan angett tre önskemål i ansökan. Vi försöker erbjuda ett av dem, men det beror på hur många platser som är lediga." },
          { speaker: "Amina", text: "Jag förstår. Tack för informationen!" },
        ],
        questions: [
          { q: "Vad undrar Amina?", options: ["Hur man ansöker om förskoleplats", "Hur länge hon behöver vänta på besked", "Vad förskolan kostar", "Vilka förskolor som finns"], correctIndex: 1 },
          { q: "Inom vilken tid ska kommunen erbjuda en plats?", options: ["En månad", "Två månader", "Fyra månader", "Sex månader"], correctIndex: 2 },
          { q: "Hur många önskemål har Amina angett i ansökan?", options: ["Ett", "Två", "Tre", "Fem"], correctIndex: 2 },
        ],
      },
      {
        id: "c-tel-011",
        intro: "Pavel ringer till biblioteket.",
        audioUrl: null,
        transcript: [
          { speaker: "Bibliotekarie", text: "Stadsbiblioteket, god dag!" },
          { speaker: "Pavel", text: "God dag! Jag har lånat en bok som jag inte hinner läsa klart. Kan jag låna om den?" },
          { speaker: "Bibliotekarie", text: "Oftast går det bra. Har du ditt lånekortsnummer?" },
          { speaker: "Pavel", text: "Ja, det är fyra-sju-två-ett-nio." },
          { speaker: "Bibliotekarie", text: "Tack. Jag ser boken här. Tyvärr kan du inte låna om den — en annan låntagare står i kö på den. Du behöver lämna tillbaka den senast på måndag." },
          { speaker: "Pavel", text: "Åh, vad synd. Vad händer om jag lämnar den för sent?" },
          { speaker: "Bibliotekarie", text: "Då blir det en förseningsavgift på tio kronor per dag. Men du kan ställa dig i kö igen och låna den senare." },
          { speaker: "Pavel", text: "Okej, jag lämnar den på måndag. Tack!" },
        ],
        questions: [
          { q: "Vad vill Pavel göra?", options: ["Låna en ny bok", "Låna om en bok", "Lämna tillbaka en bok", "Skaffa ett lånekort"], correctIndex: 1 },
          { q: "Varför kan Pavel inte låna om boken?", options: ["Boken är för gammal", "Han har en obetald avgift", "En annan låntagare står i kö", "Hans lånekort har gått ut"], correctIndex: 2 },
          { type: "open", q: "Hur stor är förseningsavgiften per dag? Skriv ditt svar.", accept: ["10 kronor", "tio kronor", "10 kr", "10", "tio"] },
        ],
      },
      {
        id: "c-tel-012",
        intro: "Yuki ringer till elbolaget inför en flytt.",
        audioUrl: null,
        transcript: [
          { speaker: "Kundtjänst", text: "Elbolaget kundservice, mitt namn är Johan." },
          { speaker: "Yuki", text: "Hej! Jag ska flytta till en ny lägenhet den första september och behöver flytta mitt elavtal." },
          { speaker: "Kundtjänst", text: "Det hjälper jag dig med. Vad är den nya adressen?" },
          { speaker: "Yuki", text: "Björkvägen åtta i Sundbyberg, lägenhet tolv-noll-tre." },
          { speaker: "Kundtjänst", text: "Tack. Då avslutar vi avtalet på din gamla adress den sista augusti och startar det nya den första september. Du behöver inte göra något mer." },
          { speaker: "Yuki", text: "Vad smidigt! Kostar det något att flytta avtalet?" },
          { speaker: "Kundtjänst", text: "Nej, flytten är helt gratis. Du får en bekräftelse via mejl inom en timme." },
          { speaker: "Yuki", text: "Perfekt, tack för hjälpen!" },
        ],
        questions: [
          { q: "Varför ringer Yuki till elbolaget?", options: ["Hennes el har slutat fungera", "Hon vill flytta sitt elavtal", "Räkningen är fel", "Hon vill byta elbolag"], correctIndex: 1 },
          { q: "När startar avtalet på den nya adressen?", options: ["Den sista augusti", "Den första september", "Den femtonde september", "Den första oktober"], correctIndex: 1 },
          { q: "Vad kostar det att flytta avtalet?", options: ["Hundra kronor", "Femtio kronor", "Det är gratis", "En månadsavgift"], correctIndex: 2 },
        ],
      },
      {
        id: "c-tel-013",
        intro: "Carlos ringer om en soffa som säljs på nätet.",
        audioUrl: null,
        transcript: [
          { speaker: "Säljare", text: "Hallå, det är Gunilla." },
          { speaker: "Carlos", text: "Hej! Jag ringer om soffan du har lagt ut på Blocket. Är den kvar?" },
          { speaker: "Säljare", text: "Ja, den är kvar. Flera har hört av sig, men ingen har bestämt sig än." },
          { speaker: "Carlos", text: "Vad bra. Annonsen säger tvåtusen kronor. Kan du tänka dig femtonhundra?" },
          { speaker: "Säljare", text: "Hm, vi kan mötas på halva vägen — sjuttonhundrafemtio, om du hämtar den i helgen." },
          { speaker: "Carlos", text: "Det låter rimligt. Jag kan komma på söndag förmiddag med en hyrbil." },
          { speaker: "Säljare", text: "Perfekt. Jag bor på Ekgatan fem, tredje våningen. Det finns tyvärr ingen hiss." },
          { speaker: "Carlos", text: "Ingen fara, jag tar med en kompis. Vi ses på söndag!" },
        ],
        questions: [
          { q: "Varför ringer Carlos?", options: ["Han vill sälja en soffa", "Han är intresserad av en soffa på Blocket", "Han vill reklamera en soffa", "Han har hittat en soffa på gatan"], correctIndex: 1 },
          { q: "Vilket pris kommer de överens om?", options: ["Tvåtusen kronor", "Femtonhundra kronor", "Sjuttonhundrafemtio kronor", "Tusen kronor"], correctIndex: 2 },
          { q: "Varför tar Carlos med en kompis?", options: ["Kompisen ska betala", "Det finns ingen hiss", "Kompisen vill se soffan", "Han har ingen bil"], correctIndex: 1 },
        ],
      },
      {
        id: "c-tel-014",
        intro: "Nadia ringer till optikern.",
        audioUrl: null,
        transcript: [
          { speaker: "Optiker", text: "Synsam på Storgatan, välkommen!" },
          { speaker: "Nadia", text: "Hej! Jag skulle vilja boka en synundersökning. Jag har fått huvudvärk när jag jobbar vid datorn." },
          { speaker: "Optiker", text: "Det kan absolut bero på synen. Vi har tider på tisdag klockan tio eller torsdag klockan sjutton." },
          { speaker: "Nadia", text: "Torsdag klockan sjutton, tack. Hur lång tid tar undersökningen?" },
          { speaker: "Optiker", text: "Räkna med ungefär trettio minuter. Den kostar trehundranittiofem kronor, men är gratis om du sedan köper glasögon hos oss." },
          { speaker: "Nadia", text: "Bra att veta. Ska jag ta med något?" },
          { speaker: "Optiker", text: "Om du har gamla glasögon eller linser, ta gärna med dem. Vi ses på torsdag!" },
        ],
        questions: [
          { q: "Varför vill Nadia boka en synundersökning?", options: ["Hennes glasögon har gått sönder", "Hon får huvudvärk vid datorn", "Hon ser dåligt på långt håll", "Hon behöver nya linser"], correctIndex: 1 },
          { q: "Vilken tid bokar Nadia?", options: ["Tisdag klockan tio", "Torsdag klockan tio", "Torsdag klockan sjutton", "Tisdag klockan sjutton"], correctIndex: 2 },
          { q: "När är undersökningen gratis?", options: ["Om man är under 20 år", "Om man köper glasögon hos dem", "Om man har remiss", "Den är alltid gratis"], correctIndex: 1 },
        ],
      },
      {
        id: "c-tel-015",
        intro: "Ibrahim ringer till en flyttfirma.",
        audioUrl: null,
        transcript: [
          { speaker: "Flyttfirma", text: "Flytt och Transport AB, det är Kenneth." },
          { speaker: "Ibrahim", text: "Hej! Jag ska flytta från en trea i Huddinge till Solna i slutet av månaden och vill ha en offert." },
          { speaker: "Kenneth", text: "Visst! Hur stor är lägenheten, och finns det hiss i båda husen?" },
          { speaker: "Ibrahim", text: "Den är sjuttiofem kvadratmeter. Hiss finns i det nya huset men inte i det gamla — vi bor på andra våningen." },
          { speaker: "Kenneth", text: "Okej. För en sådan flytt brukar det landa på mellan åtta och tio tusen kronor, beroende på hur mycket möbler ni har. Och kom ihåg att du kan använda rut-avdraget, då betalar du bara halva arbetskostnaden." },
          { speaker: "Ibrahim", text: "Just det, rut-avdraget! Kan ni komma och titta innan ni ger ett fast pris?" },
          { speaker: "Kenneth", text: "Absolut, jag kan komma på onsdag kväll och göra en gratis besiktning." },
          { speaker: "Ibrahim", text: "Toppen, då ses vi på onsdag!" },
        ],
        questions: [
          { q: "Vad vill Ibrahim ha?", options: ["Hjälp att packa", "En offert för en flytt", "Flyttkartonger", "Städhjälp"], correctIndex: 1 },
          { q: "Vad gör rut-avdraget?", options: ["Flytten blir gratis", "Man betalar halva arbetskostnaden", "Man får pengar tillbaka på skatten efter ett år", "Försäkringen ingår"], correctIndex: 1 },
          { q: "Vad händer på onsdag?", options: ["Flytten genomförs", "Ibrahim skriver kontrakt", "Kenneth kommer och gör en besiktning", "Ibrahim hämtar kartonger"], correctIndex: 2 },
        ],
      },
      {
        id: "c-tel-016",
        intro: "Sofia ringer till Försäkringskassan.",
        audioUrl: null,
        transcript: [
          { speaker: "Handläggare", text: "Försäkringskassan, du talar med Erik." },
          { speaker: "Sofia", text: "Hej! Jag ska vara hemma med mitt sjuka barn i dag och undrar hur jag ansöker om vab." },
          { speaker: "Handläggare", text: "Det enklaste är att anmäla det i vår app eller på webben samma dag som du stannar hemma. Sedan ansöker du om ersättning i efterhand." },
          { speaker: "Sofia", text: "Hur mycket pengar får man?" },
          { speaker: "Handläggare", text: "Knappt åttio procent av din vanliga inkomst, upp till ett tak. Pengarna betalas oftast ut inom en vecka efter ansökan." },
          { speaker: "Sofia", text: "Behöver jag något intyg från förskolan?" },
          { speaker: "Handläggare", text: "Nej, inte de första sju dagarna. Om barnet är sjukt längre än en vecka behöver du ett intyg från sjuksköterska eller läkare." },
          { speaker: "Sofia", text: "Tack, nu vet jag. Hej då!" },
        ],
        questions: [
          { q: "Vad vill Sofia veta?", options: ["Hur man ansöker om föräldrapenning", "Hur man ansöker om vab", "Hur man sjukanmäler sig själv", "Hur man byter förskola"], correctIndex: 1 },
          { q: "Hur mycket ersättning får man vid vab?", options: ["Hela sin lön", "Knappt åttio procent av inkomsten", "Hälften av lönen", "En fast summa per dag"], correctIndex: 1 },
          { q: "När behövs ett intyg?", options: ["Från första dagen", "Efter tre dagar", "Om barnet är sjukt längre än sju dagar", "Aldrig"], correctIndex: 2 },
        ],
      },
      {
        id: "c-tel-017",
        intro: "Dmitri ringer till frisören för att avboka.",
        audioUrl: null,
        transcript: [
          { speaker: "Frisör", text: "Salong Saxen, hej!" },
          { speaker: "Dmitri", text: "Hej! Jag har en tid för klippning i morgon klockan femton, men jag måste tyvärr avboka. Jag har fått ett viktigt möte på jobbet." },
          { speaker: "Frisör", text: "Tack för att du ringer i god tid. Vill du boka en ny tid direkt?" },
          { speaker: "Dmitri", text: "Ja gärna. Har ni något på lördag?" },
          { speaker: "Frisör", text: "Lördag är nästan fullbokat, men jag har en lucka klockan nio på morgonen." },
          { speaker: "Dmitri", text: "Den tar jag. Det är samma frisör som vanligt, Petra?" },
          { speaker: "Frisör", text: "Ja, Petra jobbar på lördag. Då säger vi lördag klockan nio. Kom ihåg att avbokning samma dag kostar halva priset." },
          { speaker: "Dmitri", text: "Jag förstår. Tack och hej då!" },
        ],
        questions: [
          { q: "Varför avbokar Dmitri sin tid?", options: ["Han är sjuk", "Han har fått ett möte på jobbet", "Han ska resa bort", "Han har inte råd"], correctIndex: 1 },
          { q: "Vilken ny tid bokar Dmitri?", options: ["Fredag klockan femton", "Lördag klockan nio", "Lördag klockan femton", "Söndag klockan nio"], correctIndex: 1 },
          { q: "Vad kostar en avbokning samma dag?", options: ["Ingenting", "Halva priset", "Hela priset", "Hundra kronor"], correctIndex: 1 },
        ],
      },
      {
        id: "c-tel-018",
        intro: "Mei ringer till sitt försäkringsbolag.",
        audioUrl: null,
        transcript: [
          { speaker: "Försäkringsbolag", text: "Trygg Försäkring, du talar med Anders." },
          { speaker: "Mei", text: "Hej! Min cykel blev stulen i natt, utanför min port. Den var låst. Jag vill anmäla det till försäkringen." },
          { speaker: "Anders", text: "Tråkigt att höra. Har du polisanmält stölden?" },
          { speaker: "Mei", text: "Ja, jag gjorde det i morse på polisens hemsida. Jag har ett ärendenummer." },
          { speaker: "Anders", text: "Bra, det behöver vi. Hur gammal är cykeln, och vad kostade den ny?" },
          { speaker: "Mei", text: "Den är två år gammal och kostade sextusen kronor." },
          { speaker: "Anders", text: "Okej. Med åldersavdrag och självrisk på femtonhundra kronor får du ut ungefär tretusen kronor. Ersättningen betalas ut inom tio dagar efter att vi fått alla papper." },
          { speaker: "Mei", text: "Jag förstår. Jag skickar in allt i dag. Tack!" },
        ],
        questions: [
          { q: "Varför ringer Mei?", options: ["Hennes cykel är trasig", "Hennes cykel blev stulen", "Hon vill köpa en försäkring", "Hon krockade med cykeln"], correctIndex: 1 },
          { q: "Vad har Mei redan gjort?", options: ["Köpt en ny cykel", "Polisanmält stölden", "Pratat med grannarna", "Hittat cykeln"], correctIndex: 1 },
          { q: "Hur mycket får Mei ungefär i ersättning?", options: ["Sextusen kronor", "Tretusen kronor", "Femtonhundra kronor", "Ingenting"], correctIndex: 1 },
        ],
      },
      {
        id: "c-tel-019",
        intro: "Juan ringer till SFI-skolan.",
        audioUrl: null,
        transcript: [
          { speaker: "Administratör", text: "Vuxenutbildningen, det är Birgitta." },
          { speaker: "Juan", text: "Hej! Jag läser SFI kurs C på dagtid, men jag har fått ett jobb och kan inte längre gå på lektionerna. Finns det kvällskurser?" },
          { speaker: "Birgitta", text: "Grattis till jobbet! Ja, vi har kvällskurser två gånger i veckan, måndagar och onsdagar klockan sjutton trettio till tjugo." },
          { speaker: "Juan", text: "Det skulle passa perfekt. Hur byter jag grupp?" },
          { speaker: "Birgitta", text: "Du fyller i en blankett om byte av studietid. Prata med din lärare först, så skriver hon en rekommendation." },
          { speaker: "Juan", text: "När kan jag börja på kvällskursen?" },
          { speaker: "Birgitta", text: "Nästa grupp startar den femtonde, om två veckor. Till dess fortsätter du i din vanliga grupp så gott du kan." },
          { speaker: "Juan", text: "Tack så mycket för hjälpen!" },
        ],
        questions: [
          { q: "Varför vill Juan byta till kvällskurs?", options: ["Han tycker inte om sin lärare", "Han har fått ett jobb", "Han vill läsa snabbare", "Han har flyttat"], correctIndex: 1 },
          { q: "Vilka dagar är kvällskurserna?", options: ["Tisdagar och torsdagar", "Måndagar och onsdagar", "Lördagar och söndagar", "Varje vardag"], correctIndex: 1 },
          { q: "Vad ska Juan göra först?", options: ["Sluta på sin nuvarande kurs", "Prata med sin lärare", "Betala en avgift", "Göra ett nytt test"], correctIndex: 1 },
        ],
      },
      {
        id: "c-tel-020",
        intro: "Olga ringer till veterinären.",
        audioUrl: null,
        transcript: [
          { speaker: "Veterinär", text: "Djurkliniken, god morgon!" },
          { speaker: "Olga", text: "God morgon! Min katt har inte ätit på två dagar och verkar väldigt trött. Jag är orolig." },
          { speaker: "Veterinär", text: "Det låter som att vi bör titta på honom. Dricker han vatten?" },
          { speaker: "Olga", text: "Lite grann, men mycket mindre än vanligt." },
          { speaker: "Veterinär", text: "Då vill jag att ni kommer in i dag. Vi har en akuttid klockan halv tolv. Går det?" },
          { speaker: "Olga", text: "Ja, det går. Vad kostar ett akutbesök?" },
          { speaker: "Veterinär", text: "Grundavgiften är sjuhundrafemtio kronor, sedan tillkommer eventuella prover och behandling. Har du försäkring på katten kan du få tillbaka en del." },
          { speaker: "Olga", text: "Han är försäkrad. Vi kommer klockan halv tolv. Tack!" },
        ],
        questions: [
          { q: "Varför ringer Olga till veterinären?", options: ["Katten har skadat benet", "Katten har inte ätit på två dagar", "Katten ska vaccineras", "Katten har sprungit bort"], correctIndex: 1 },
          { q: "När ska Olga komma med katten?", options: ["I morgon förmiddag", "I dag klockan halv tolv", "På fredag", "Nästa vecka"], correctIndex: 1 },
          { q: "Vad är grundavgiften för ett akutbesök?", options: ["Femhundra kronor", "Sjuhundrafemtio kronor", "Tusen kronor", "Det är gratis"], correctIndex: 1 },
        ],
      },
    ],
  },
  {
    type: "voicemail",
    label: "Röstmeddelande",
    emoji: "📱",
    description: "Meddelanden på telefonsvarare från skola, vård och företag",
    items: [
      {
        id: "c-rost-001",
        intro: "Ett röstmeddelande från en lärare till Saras föräldrar.",
        audioUrl: null,
        transcript: [
          { speaker: "Eva", text: "Hej! Det här är ett meddelande till Sara Ahmeds föräldrar, från Björkskolan. Jag heter Eva Lundgren och är Saras klasslärare. Jag ringer för att påminna om utvecklingssamtalet på torsdag den fjortonde, klockan halv fem. Vi ses i klassrum B tolv på andra våningen. Om tiden inte passar kan ni ringa mig senast på onsdag. Observera också att eleverna slutar tidigare på fredag, redan klockan tolv, eftersom lärarna har planeringsdag. Tack och hej då!" },
        ],
        questions: [
          { q: "Varför ringer läraren?", options: ["Sara är sjuk och måste hämtas", "Hon vill påminna om ett möte", "Skolan ska stängas på torsdag", "Sara har glömt sina böcker"], correctIndex: 1 },
          { q: "Var ska utvecklingssamtalet vara?", options: ["I matsalen", "I klassrum B tolv", "På lärarens kontor", "I aulan på första våningen"], correctIndex: 1 },
          { type: "open", q: "Vilken dag är utvecklingssamtalet? Skriv ditt svar.", accept: ["torsdag", "på torsdag", "torsdagen", "torsdag den fjortonde", "den fjortonde"] },
        ],
      },
    ],
  },
  {
    type: "announcement",
    label: "Utrop",
    emoji: "📢",
    description: "Högtalarutrop på stationer, i butiker och på flygplatser",
    items: [
      {
        id: "c-utrop-001",
        intro: "Ett utrop på en tågstation.",
        audioUrl: null,
        transcript: [
          { speaker: "Utropare", text: "Här är ett viktigt meddelande till resande mot Uppsala. Tåget med avgång sexton och fyrtiotvå är försenat med ungefär tjugo minuter på grund av ett signalfel. Tåget avgår dessutom från spår sju i stället för spår tre. Vi beklagar förseningen. Resenärer kan också ta pendeltåget mot Märsta och byta där." },
        ],
        questions: [
          { q: "Varför är tåget försenat?", options: ["Det har hänt en olycka", "Det är ett signalfel", "Det är dåligt väder", "Det saknas personal"], correctIndex: 1 },
          { q: "Från vilket spår avgår tåget?", options: ["Spår tre", "Spår sju", "Spår sexton", "Spår tjugo"], correctIndex: 1 },
        ],
      },
    ],
  },
  {
    type: "monologue",
    label: "Berättelse",
    emoji: "🎙️",
    description: "Personer berättar om sitt liv, arbete och vardag",
    items: [
      {
        id: "c-ber-001",
        intro: "Fatima berättar om sitt arbete.",
        audioUrl: null,
        transcript: [
          { speaker: "Fatima", text: "Jag heter Fatima och jag arbetar som undersköterska på ett äldreboende i Malmö. Jag har jobbat där i fem år. Jag arbetar ofta tidiga morgnar, mitt pass börjar klockan sju, men ibland jobbar jag också kvällar och helger. Det bästa med mitt jobb är kontakten med de äldre. Vi pratar, spelar kort och ibland sjunger vi tillsammans. Det svåraste är att vi ofta har för lite personal, så det blir stressigt. Nästa år vill jag vidareutbilda mig till sjuksköterska. Därför läser jag svenska på kvällarna, för att klara antagningen till högskolan." },
        ],
        questions: [
          { q: "Var arbetar Fatima?", options: ["På ett sjukhus", "På en förskola", "På ett äldreboende", "På en vårdcentral"], correctIndex: 2 },
          { q: "Vad tycker Fatima är svårast med jobbet?", options: ["De tidiga morgnarna", "Att det ofta är för lite personal", "Kontakten med de äldre", "Att jobba på helger"], correctIndex: 1 },
          { q: "Varför läser Fatima svenska på kvällarna?", options: ["Hon vill byta jobb till en skola", "Hon vill klara antagningen till högskolan", "Hon vill hjälpa sina barn med läxor", "Hennes chef kräver det"], correctIndex: 1 },
        ],
      },
    ],
  },
  {
    type: "news",
    label: "Nyhetsinslag",
    emoji: "📻",
    description: "Korta nyheter från radio om trafik, väder och lokala händelser",
    items: [
      {
        id: "c-nyh-001",
        intro: "Ett kort nyhetsinslag på radion.",
        audioUrl: null,
        transcript: [
          { speaker: "Nyhetsuppläsare", text: "Och så lite lokala nyheter. Från och med på måndag stängs Storgatan i centrum för biltrafik på grund av ett stort vägarbete. Arbetet beräknas pågå i sex veckor. Bussarna på linje fyra och linje nio får under tiden andra hållplatser. Resenärer hänvisas till hållplatsen vid stadsbiblioteket. Kommunen räknar med att gatan öppnar igen i mitten av augusti. Gående och cyklister kan passera som vanligt under hela perioden." },
        ],
        questions: [
          { q: "Varför stängs Storgatan?", options: ["Det har hänt en olycka", "Det är ett vägarbete", "Det är en festival", "Gatan är översvämmad"], correctIndex: 1 },
          { q: "Hur länge beräknas arbetet pågå?", options: ["Sex dagar", "Sex veckor", "Sex månader", "Till nästa år"], correctIndex: 1 },
          { type: "open", q: "Vid vilken hållplats ska bussresenärerna gå på under vägarbetet? Skriv ditt svar.", accept: ["stadsbiblioteket", "vid stadsbiblioteket", "hållplatsen vid stadsbiblioteket", "biblioteket", "vid biblioteket"] },
        ],
      },
    ],
  },
  {
    type: "matching",
    label: "Matchning",
    emoji: "🔗",
    description: "Lyssna på flera korta klipp och matcha person med rätt alternativ",
    items: [
      {
        id: "c-match-001",
        intro: "Fyra personer berättar vad de ska göra i helgen. Matcha varje person med rätt aktivitet. Två alternativ blir över.",
        audioUrl: null,
        transcript: [
          { speaker: "Maria", text: "I helgen ska jag äntligen ta det lugnt. Jag ska stanna hemma, laga god mat och titta på en film med min familj." },
          { speaker: "Johan", text: "På lördag fyller min brorsdotter fem år, så vi ska på kalas hos min bror i Göteborg. Vi åker tåg dit på morgonen." },
          { speaker: "Aisha", text: "Jag har precis börjat träna inför ett lopp, så i helgen blir det en långpromenad på lördag och löpning på söndag." },
          { speaker: "Erik", text: "Min lägenhet är ett kaos just nu. Hela helgen ska jag måla om sovrummet och bygga ihop nya möbler." },
        ],
        questions: [
          { q: "Vad ska Maria göra i helgen?", options: ["Träna", "Gå på födelsedagskalas", "Renovera hemma", "Ta det lugnt hemma", "Jobba extra", "Resa utomlands"], correctIndex: 3 },
          { q: "Vad ska Johan göra i helgen?", options: ["Träna", "Gå på födelsedagskalas", "Renovera hemma", "Ta det lugnt hemma", "Jobba extra", "Resa utomlands"], correctIndex: 1 },
          { q: "Vad ska Aisha göra i helgen?", options: ["Träna", "Gå på födelsedagskalas", "Renovera hemma", "Ta det lugnt hemma", "Jobba extra", "Resa utomlands"], correctIndex: 0 },
          { q: "Vad ska Erik göra i helgen?", options: ["Träna", "Gå på födelsedagskalas", "Renovera hemma", "Ta det lugnt hemma", "Jobba extra", "Resa utomlands"], correctIndex: 2 },
        ],
      },
    ],
  },
];

// Kurs A category structure (items come from Supabase listening_bank).
// Simpler, beginner-appropriate set; no static fallback items.
export const LISTENING_CATEGORIES_A = [
  { type: "dialogue",     label: "Samtal",        emoji: "💬", description: "Enkla samtal mellan två personer", items: [] },
  { type: "phone",        label: "Telefonsamtal", emoji: "📞", description: "Korta, enkla telefonsamtal", items: [] },
  { type: "announcement", label: "Utrop",         emoji: "📢", description: "Korta meddelanden i affären, på bussen och i skolan", items: [] },
  { type: "monologue",    label: "Berättelse",    emoji: "🎙️", description: "Personer berättar enkelt om sig själva", items: [] },
  { type: "matching",     label: "Matchning",     emoji: "🔗", description: "Lyssna på fyra korta klipp och matcha rätt", items: [] },
];

// Full 7-category structure for Kurs B and D (items come from Supabase).
export const LISTENING_CATEGORIES_FULL = [
  { type: "dialogue",     label: "Samtal",         emoji: "💬", description: "Vardagliga samtal mellan två personer", items: [] },
  { type: "phone",        label: "Telefonsamtal",  emoji: "📞", description: "Telefonsamtal till vården, skolan, företag och myndigheter", items: [] },
  { type: "voicemail",    label: "Röstmeddelande", emoji: "📱", description: "Meddelanden på telefonsvarare", items: [] },
  { type: "announcement", label: "Utrop",          emoji: "📢", description: "Högtalarutrop på stationer, i butiker och på flygplatser", items: [] },
  { type: "monologue",    label: "Berättelse",     emoji: "🎙️", description: "Personer berättar om sitt liv, arbete och vardag", items: [] },
  { type: "news",         label: "Nyhetsinslag",   emoji: "📻", description: "Korta nyheter från radio om lokala händelser", items: [] },
  { type: "matching",     label: "Matchning",      emoji: "🔗", description: "Lyssna på flera korta klipp och matcha rätt person", items: [] },
];

export function getListeningBank(course) {
  const c = course?.toUpperCase();
  if (c === "C") return LISTENING_CATEGORIES_C;
  if (c === "A") return LISTENING_CATEGORIES_A;
  if (c === "B" || c === "D") return LISTENING_CATEGORIES_FULL;
  return null;
}

// Which SFI courses currently have a listening bank (for the course switcher).
export const LISTENING_COURSES = ["A", "B", "C", "D"];

// Build a mock test: one random item from each category, in exam order.
export function buildMockTest(categories) {
  return categories
    .filter((c) => c.items.length > 0)
    .map((c) => {
      const item = c.items[Math.floor(Math.random() * c.items.length)];
      return { ...item, typeLabel: c.label, typeEmoji: c.emoji, type: c.type };
    });
}

// Build a category practice session: up to `count` random items.
export function buildCategorySession(category, count = 5) {
  const shuffled = shuffle(category.items);
  return shuffled.slice(0, count).map((item) => ({
    ...item,
    typeLabel: category.label,
    typeEmoji: category.emoji,
    type: category.type,
  }));
}
