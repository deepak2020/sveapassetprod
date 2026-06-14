import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, CheckCircle2, ChevronLeft, ChevronRight, RefreshCw, Lock, Volume2 } from "lucide-react";
import { playAudio } from "@/lib/speech";
import { base44 } from "@/api/base44Client";

const QUESTION_POOL = [
  // --- Civics & institutions ---
  { q: "Vilket år antog Sverige sin nuvarande grundlag?", a: "1974", choices: ["1809", "1974", "1921", "1953"], en: "What year did Sweden adopt its current constitution?" },
  { q: "Vilket organ stiftar lagar i Sverige?", a: "Riksdagen", choices: ["Regeringen", "Riksdagen", "Domstolarna", "Kommunerna"], en: "Which body enacts laws in Sweden?" },
  { q: "Vad är Försäkringskassan?", a: "Socialförsäkringsmyndigheten", choices: ["Skattemyndigheten", "Polismyndigheten", "Socialförsäkringsmyndigheten", "Migrationsverket"], en: "What is Försäkringskassan?" },
  { q: "Vad är Migrationsverket?", a: "Myndigheten för migration och asyl", choices: ["Sjukvårdsmyndigheten", "Myndigheten för migration och asyl", "Utbildningsmyndigheten", "Trafikverket"], en: "What is Migrationsverket?" },
  { q: "Vad är Systembolaget?", a: "Statligt alkoholmonopol", choices: ["En mataffär", "En bank", "Statligt alkoholmonopol", "En resebyrå"], en: "What is Systembolaget?" },
  { q: "Vad heter myndigheten som hanterar skatter?", a: "Skatteverket", choices: ["Arbetsförmedlingen", "Skatteverket", "Kronofogden", "Bolagsverket"], en: "What is the agency that handles taxes?" },
  { q: "Vad gör Arbetsförmedlingen?", a: "Hjälper arbetssökande att hitta jobb", choices: ["Betalar ut pension", "Hjälper arbetssökande att hitta jobb", "Utfärdar pass", "Hanterar bostadsbidrag"], en: "What does Arbetsförmedlingen do?" },
  { q: "Vad heter Sveriges statsminister 2025?", a: "Ulf Kristersson", choices: ["Stefan Löfven", "Ulf Kristersson", "Fredrik Reinfeldt", "Magdalena Andersson"], en: "Who is Sweden's Prime Minister in 2025?" },
  { q: "Hur ofta hålls val till riksdagen i Sverige?", a: "Vart fjärde år", choices: ["Vart tredje år", "Vart fjärde år", "Vart femte år", "Vart sjätte år"], en: "How often are elections held to the Riksdag in Sweden?" },
  { q: "Vilken är Sveriges nationaldag?", a: "6 juni", choices: ["1 maj", "6 juni", "24 december", "13 mars"], en: "What is Sweden's national day?" },
  { q: "Vad heter polisen i Sverige?", a: "Polisen", choices: ["Ordningsvakterna", "Polisen", "Gendarmerie", "Säpo"], en: "What is the Swedish police called?" },
  { q: "Vad innebär 'allemansrätten'?", a: "Rätt att vistas i naturen", choices: ["Rösträtt för alla", "Rätt att vistas i naturen", "Rätt till gratis utbildning", "Rätt till sjukvård"], en: "What does 'allemansrätten' mean?" },

  // --- Geography ---
  { q: "Vilken stad är Sveriges huvudstad?", a: "Stockholm", choices: ["Göteborg", "Malmö", "Stockholm", "Uppsala"], en: "Which city is Sweden's capital?" },
  { q: "Vilket av dessa är ett nordiskt land?", a: "Norge", choices: ["Polen", "Nederländerna", "Norge", "Belgien"], en: "Which of these is a Nordic country?" },
  { q: "I vilket land uppfanns IKEA?", a: "Sverige", choices: ["Danmark", "Norge", "Finland", "Sverige"], en: "In which country was IKEA founded?" },
  { q: "Vilken är Sveriges näst största stad?", a: "Göteborg", choices: ["Malmö", "Göteborg", "Uppsala", "Västerås"], en: "What is Sweden's second largest city?" },
  { q: "Vad heter havet öster om Sverige?", a: "Östersjön", choices: ["Nordsjön", "Östersjön", "Atlanten", "Medelhavet"], en: "What is the sea east of Sweden called?" },
  { q: "Vilket land ligger norr om Sverige?", a: "Norge", choices: ["Finland", "Danmark", "Norge", "Ryssland"], en: "Which country is north of Sweden?" },
  { q: "Vad heter den längsta floden i Sverige?", a: "Klarälven", choices: ["Dalälven", "Klarälven", "Göta älv", "Indalsälven"], en: "What is the longest river in Sweden?" },

  // --- Currency & numbers ---
  { q: "Vilken valuta används i Sverige?", a: "Svenska kronor", choices: ["Euro", "Svenska kronor", "Danska kronor", "Norska kronor"], en: "What currency is used in Sweden?" },
  { q: "Hur många månader har ett år?", a: "12", choices: ["10", "11", "12", "13"], en: "How many months does a year have?" },
  { q: "Hur många veckor har ett år?", a: "52", choices: ["48", "50", "52", "54"], en: "How many weeks does a year have?" },
  { q: "Hur många dagar har en vecka?", a: "7", choices: ["5", "6", "7", "8"], en: "How many days does a week have?" },
  { q: "Hur skriver man siffran 5 som text på svenska?", a: "Fem", choices: ["Fyra", "Sex", "Fem", "Sju"], en: "How do you write the number 5 as text in Swedish?" },
  { q: "Hur skriver man siffran 10 som text på svenska?", a: "Tio", choices: ["Nio", "Tio", "Elva", "Åtta"], en: "How do you write 10 in Swedish?" },
  { q: "Hur skriver man siffran 20 som text på svenska?", a: "Tjugo", choices: ["Tjugo", "Trettio", "Femton", "Sexton"], en: "How do you write 20 in Swedish?" },
  { q: "Hur skriver man 100 på svenska?", a: "Hundra", choices: ["Tusen", "Hundra", "Nio", "Femtio"], en: "How do you write 100 in Swedish?" },

  // --- Greetings & phrases ---
  { q: "Hur säger man 'good morning' på svenska?", a: "God morgon", choices: ["God kväll", "God natt", "God morgon", "God eftermiddag"], en: "How do you say 'good morning' in Swedish?" },
  { q: "Hur skriver man 'thank you' på svenska?", a: "Tack", choices: ["Tack", "Hej", "Förlåt", "Varsågod"], en: "How do you write 'thank you' in Swedish?" },
  { q: "Hur säger man 'goodbye' på svenska?", a: "Hej då", choices: ["Hej", "Hej då", "Tack", "Förlåt"], en: "How do you say 'goodbye' in Swedish?" },
  { q: "Hur säger man 'please' på svenska?", a: "Snälla / Varsågod", choices: ["Tack", "Förlåt", "Snälla / Varsågod", "Ursäkta"], en: "How do you say 'please' in Swedish?" },
  { q: "Hur säger man 'I don't understand' på svenska?", a: "Jag förstår inte", choices: ["Jag vet inte", "Jag förstår inte", "Jag pratar inte svenska", "Kan du hjälpa mig?"], en: "How do you say 'I don't understand' in Swedish?" },
  { q: "Hur säger man 'I am hungry' på svenska?", a: "Jag är hungrig", choices: ["Jag är trött", "Jag är hungrig", "Jag är glad", "Jag är ledsen"], en: "How do you say 'I am hungry' in Swedish?" },
  { q: "Hur säger man 'good evening' på svenska?", a: "God kväll", choices: ["God morgon", "God natt", "God kväll", "God eftermiddag"], en: "How do you say 'good evening' in Swedish?" },
  { q: "Hur säger man 'excuse me' på svenska?", a: "Ursäkta", choices: ["Tack", "Förlåt", "Ursäkta", "Varsågod"], en: "How do you say 'excuse me' in Swedish?" },
  { q: "Hur säger man 'I love you' på svenska?", a: "Jag älskar dig", choices: ["Jag gillar dig", "Jag älskar dig", "Jag saknar dig", "Jag hatar dig"], en: "How do you say 'I love you' in Swedish?" },
  { q: "Hur säger man 'how are you' på svenska?", a: "Hur mår du?", choices: ["Vad heter du?", "Hur gammal är du?", "Hur mår du?", "Var bor du?"], en: "How do you say 'how are you' in Swedish?" },
  { q: "Hur säger man 'my name is' på svenska?", a: "Jag heter", choices: ["Jag är", "Jag heter", "Mitt namn är du", "Jag kallas"], en: "How do you say 'my name is' in Swedish?" },
  { q: "Hur säger man 'help' på svenska?", a: "Hjälp", choices: ["Stopp", "Hjälp", "Kör", "Brand"], en: "How do you say 'help' in Swedish?" },

  // --- Vocabulary ---
  { q: "Vad heter 'water' på svenska?", a: "Vatten", choices: ["Mjölk", "Juice", "Vatten", "Saft"], en: "What is 'water' in Swedish?" },
  { q: "Vad heter 'house' på svenska?", a: "Hus", choices: ["Hus", "Hem", "Bostad", "Villa"], en: "What is 'house' in Swedish?" },
  { q: "Vad heter 'school' på svenska?", a: "Skola", choices: ["Kontor", "Skola", "Butik", "Sjukhus"], en: "What is 'school' in Swedish?" },
  { q: "Vad heter 'work' på svenska?", a: "Arbete", choices: ["Arbete", "Skola", "Fritid", "Semester"], en: "What is 'work' in Swedish?" },
  { q: "Vad heter 'friend' på svenska?", a: "Vän", choices: ["Vän", "Fiende", "Granne", "Kollega"], en: "What is 'friend' in Swedish?" },
  { q: "Vad heter 'hospital' på svenska?", a: "Sjukhus", choices: ["Apotek", "Sjukhus", "Klinik", "Vårdcentral"], en: "What is 'hospital' in Swedish?" },
  { q: "Vad heter 'family' på svenska?", a: "Familj", choices: ["Vänner", "Familj", "Grannarna", "Kollegorna"], en: "What is 'family' in Swedish?" },
  { q: "Vad heter 'city' på svenska?", a: "Stad", choices: ["By", "Stad", "Land", "Ö"], en: "What is 'city' in Swedish?" },
  { q: "Vad heter 'food' på svenska?", a: "Mat", choices: ["Dryck", "Mat", "Kläder", "Möbler"], en: "What is 'food' in Swedish?" },
  { q: "Vad heter 'book' på svenska?", a: "Bok", choices: ["Tidning", "Bok", "Brev", "Häfte"], en: "What is 'book' in Swedish?" },
  { q: "Vad heter 'car' på svenska?", a: "Bil", choices: ["Buss", "Bil", "Tåg", "Cykel"], en: "What is 'car' in Swedish?" },
  { q: "Vad heter 'bus' på svenska?", a: "Buss", choices: ["Buss", "Tåg", "Bil", "Flyg"], en: "What is 'bus' in Swedish?" },
  { q: "Vad heter 'money' på svenska?", a: "Pengar", choices: ["Pengar", "Mynt", "Sedlar", "Plånbok"], en: "What is 'money' in Swedish?" },
  { q: "Vad heter 'sun' på svenska?", a: "Sol", choices: ["Måne", "Sol", "Stjärna", "Moln"], en: "What is 'sun' in Swedish?" },
  { q: "Vad heter 'child' på svenska?", a: "Barn", choices: ["Barn", "Vuxen", "Ung", "Gammal"], en: "What is 'child' in Swedish?" },
  { q: "Vad heter 'door' på svenska?", a: "Dörr", choices: ["Fönster", "Dörr", "Vägg", "Tak"], en: "What is 'door' in Swedish?" },
  { q: "Vad heter 'window' på svenska?", a: "Fönster", choices: ["Dörr", "Fönster", "Golv", "Vägg"], en: "What is 'window' in Swedish?" },
  { q: "Vad heter 'table' på svenska?", a: "Bord", choices: ["Stol", "Bord", "Soffa", "Säng"], en: "What is 'table' in Swedish?" },
  { q: "Vad heter 'chair' på svenska?", a: "Stol", choices: ["Bord", "Stol", "Soffa", "Skrivbord"], en: "What is 'chair' in Swedish?" },
  { q: "Vad heter 'bread' på svenska?", a: "Bröd", choices: ["Bröd", "Mjölk", "Smör", "Ost"], en: "What is 'bread' in Swedish?" },
  { q: "Vad heter 'milk' på svenska?", a: "Mjölk", choices: ["Vatten", "Juice", "Mjölk", "Saft"], en: "What is 'milk' in Swedish?" },
  { q: "Vad heter 'apple' på svenska?", a: "Äpple", choices: ["Päron", "Äpple", "Banan", "Apelsin"], en: "What is 'apple' in Swedish?" },

  // --- Colors ---
  { q: "Vad heter 'red' på svenska?", a: "Röd", choices: ["Blå", "Grön", "Röd", "Gul"], en: "What is 'red' in Swedish?" },
  { q: "Vad heter 'blue' på svenska?", a: "Blå", choices: ["Röd", "Blå", "Grön", "Gul"], en: "What is 'blue' in Swedish?" },
  { q: "Vad heter 'green' på svenska?", a: "Grön", choices: ["Blå", "Grön", "Röd", "Vit"], en: "What is 'green' in Swedish?" },
  { q: "Vad heter 'yellow' på svenska?", a: "Gul", choices: ["Röd", "Blå", "Gul", "Svart"], en: "What is 'yellow' in Swedish?" },
  { q: "Vad heter 'white' på svenska?", a: "Vit", choices: ["Svart", "Vit", "Grå", "Brun"], en: "What is 'white' in Swedish?" },
  { q: "Vad heter 'black' på svenska?", a: "Svart", choices: ["Vit", "Svart", "Grå", "Brun"], en: "What is 'black' in Swedish?" },

  // --- Days of week ---
  { q: "Vad heter måndag på engelska?", a: "Monday", choices: ["Sunday", "Monday", "Tuesday", "Wednesday"], en: "What is 'måndag' in English?" },
  { q: "Vilken dag kommer efter onsdag?", a: "Torsdag", choices: ["Tisdag", "Onsdag", "Torsdag", "Fredag"], en: "Which day comes after Wednesday?" },
  { q: "Vilken dag är den sista i veckan?", a: "Söndag", choices: ["Fredag", "Lördag", "Söndag", "Måndag"], en: "Which is the last day of the week?" },
  { q: "Vad heter 'weekend' på svenska?", a: "Helg", choices: ["Vecka", "Helg", "Vardag", "Semester"], en: "What is 'weekend' in Swedish?" },

  // --- Months & seasons ---
  { q: "Vilken månad är den tredje på året?", a: "Mars", choices: ["Februari", "Mars", "April", "Januari"], en: "Which month is the third of the year?" },
  { q: "Vad heter sommarens tre månader?", a: "Juni, juli, augusti", choices: ["Maj, juni, juli", "Juni, juli, augusti", "Juli, aug, sept", "April, maj, juni"], en: "What are the three summer months?" },
  { q: "Vad heter 'winter' på svenska?", a: "Vinter", choices: ["Sommar", "Höst", "Vinter", "Vår"], en: "What is 'winter' in Swedish?" },
  { q: "Vad heter 'spring' på svenska?", a: "Vår", choices: ["Sommar", "Höst", "Vinter", "Vår"], en: "What is 'spring' in Swedish?" },

  // --- Grammar ---
  { q: "Vilket av dessa är ett verb?", a: "Springa", choices: ["Snabb", "Springa", "Röd", "Bok"], en: "Which of these is a verb?" },
  { q: "Vilket av dessa är ett adjektiv?", a: "Stor", choices: ["Springa", "Bok", "Stor", "Och"], en: "Which of these is an adjective?" },
  { q: "Vad är ett substantiv?", a: "Ett ord som betecknar sak eller person", choices: ["Ett ord som betecknar handling", "Ett ord som betecknar egenskap", "Ett ord som betecknar sak eller person", "Ett bindeord"], en: "What is a noun?" },
  { q: "Vilket pronomen är tredje person singular i svenska?", a: "Han/Hon/Den/Det", choices: ["Jag", "Du", "Vi", "Han/Hon/Den/Det"], en: "Which pronoun is third person singular in Swedish?" },
  { q: "Vad är artikeln för ett hus?", a: "Ett hus", choices: ["En hus", "Ett hus", "De hus", "Den hus"], en: "What is the article for 'house' in Swedish?" },
  { q: "Hur bildas plural av 'bil' på svenska?", a: "Bilar", choices: ["Bils", "Bilen", "Bilar", "Bilarna"], en: "How do you form the plural of 'car' in Swedish?" },
  { q: "Vad är böjningen av 'vara' i presens?", a: "Är", choices: ["Var", "Vore", "Är", "Varit"], en: "What is the present tense of 'vara' (to be)?" },
  { q: "Vad är ordföljden i en vanlig svensk påståendemening?", a: "Subjekt – verb – objekt", choices: ["Verb – subjekt – objekt", "Subjekt – verb – objekt", "Objekt – subjekt – verb", "Verb – objekt – subjekt"], en: "What is the word order in a typical Swedish statement?" },

  // --- Culture & traditions ---
  { q: "Vad heter midsommar på engelska?", a: "Midsummer", choices: ["Midsummer", "Midwinter", "Harvest", "Easter"], en: "What is 'midsommar' called in English?" },
  { q: "Vad firas på lucia?", a: "Den 13 december", choices: ["Den 13 november", "Den 13 december", "Den 24 december", "Den 6 januari"], en: "When is Lucia celebrated?" },
  { q: "Vad innebär 'lagom'?", a: "Inte för mycket, inte för lite", choices: ["Väldigt bra", "Inte för mycket, inte för lite", "Alldeles för litet", "Extremt stort"], en: "What does 'lagom' mean?" },
  { q: "Vad är en 'fika'?", a: "En kaffepaus med fikabröd", choices: ["En middag", "En kaffepaus med fikabröd", "En promenad", "En fest"], en: "What is a 'fika'?" },
  { q: "Vad heter den svenska semesterlagen som ger rätt till 25 dagars semester?", a: "Semesterlagen", choices: ["Arbetstidslagen", "Semesterlagen", "Anställningsskyddslagen", "Diskrimineringslagen"], en: "What is the Swedish holiday law giving 25 days of vacation?" },
  { q: "Vilket är det vanligaste svenska julpyntet?", a: "Julstjärna", choices: ["Tomte", "Julstjärna", "Julkransen", "Adventsljuslykta"], en: "What is the most common Swedish Christmas decoration?" },

  // --- SFI & Identity ---
  { q: "Vad är SFI?", a: "Svenska för invandrare", choices: ["Statens finansinspektionen", "Svenska för invandrare", "Stockholms fria idrottssällskap", "Statens fastighetsinstitut"], en: "What is SFI?" },
  { q: "Vilket språk talas i Sverige?", a: "Svenska", choices: ["Norska", "Danska", "Finska", "Svenska"], en: "Which language is spoken in Sweden?" },
  { q: "Vad är en personnummer?", a: "Identifikationsnummer för personer", choices: ["Telefonnummer", "Kontonummer", "Identifikationsnummer för personer", "Postnummer"], en: "What is a 'personnummer'?" },
  { q: "Vad heter Sveriges riksdag på engelska?", a: "The Riksdag", choices: ["The Parliament", "The Riksdag", "The Senate", "The Stortinget"], en: "What is Sweden's parliament called in English?" },

  // --- Health & daily life ---
  { q: "Vad heter en läkare på engelska?", a: "Doctor", choices: ["Nurse", "Doctor", "Teacher", "Dentist"], en: "What is a 'läkare' in English?" },
  { q: "Var ringer man om det är en nödsituation i Sverige?", a: "112", choices: ["911", "999", "112", "110"], en: "What number do you call in an emergency in Sweden?" },
  { q: "Vad heter 'pharmacy' på svenska?", a: "Apotek", choices: ["Sjukhus", "Apotek", "Klinik", "Läkarmottagning"], en: "What is 'pharmacy' in Swedish?" },
  { q: "Vad heter 'dentist' på svenska?", a: "Tandläkare", choices: ["Läkare", "Sjuksköterska", "Tandläkare", "Optiker"], en: "What is 'dentist' in Swedish?" },
  { q: "Vad heter 'apartment' på svenska?", a: "Lägenhet", choices: ["Hus", "Lägenhet", "Villa", "Stuga"], en: "What is 'apartment' in Swedish?" },
  { q: "Vad heter 'supermarket' på svenska?", a: "Mataffär / Livsmedelsbutik", choices: ["Varuhus", "Mataffär / Livsmedelsbutik", "Kiosk", "Torg"], en: "What is 'supermarket' in Swedish?" },
  { q: "Vad heter 'library' på svenska?", a: "Bibliotek", choices: ["Museum", "Bibliotek", "Galleria", "Teater"], en: "What is 'library' in Swedish?" },
  { q: "Vad heter 'bank' på svenska?", a: "Bank", choices: ["Post", "Bank", "Kassa", "Kontor"], en: "What is 'bank' in Swedish?" },

  // --- Transport ---
  { q: "Vad heter 'train' på svenska?", a: "Tåg", choices: ["Buss", "Tåg", "Spårvagn", "Tunnelbana"], en: "What is 'train' in Swedish?" },
  { q: "Vad heter 'airport' på svenska?", a: "Flygplats", choices: ["Hamn", "Flygplats", "Station", "Terminal"], en: "What is 'airport' in Swedish?" },
  { q: "Vad heter 'bicycle' på svenska?", a: "Cykel", choices: ["Moped", "Cykel", "Sparkcykel", "Skateboard"], en: "What is 'bicycle' in Swedish?" },
  { q: "Vad heter 'ticket' på svenska?", a: "Biljett", choices: ["Pass", "Biljett", "Körkort", "Kort"], en: "What is 'ticket' in Swedish?" },

  // --- Nature ---
  { q: "Vad heter 'tree' på svenska?", a: "Träd", choices: ["Blomma", "Träd", "Gräs", "Buske"], en: "What is 'tree' in Swedish?" },
  { q: "Vad heter 'rain' på svenska?", a: "Regn", choices: ["Sol", "Snö", "Regn", "Vind"], en: "What is 'rain' in Swedish?" },
  { q: "Vad heter 'snow' på svenska?", a: "Snö", choices: ["Is", "Regn", "Snö", "Dimma"], en: "What is 'snow' in Swedish?" },
  { q: "Vad heter 'mountain' på svenska?", a: "Berg", choices: ["Dal", "Berg", "Skog", "Sjö"], en: "What is 'mountain' in Swedish?" },
  { q: "Vad heter 'forest' på svenska?", a: "Skog", choices: ["Park", "Skog", "Äng", "Trädgård"], en: "What is 'forest' in Swedish?" },
  { q: "Vad heter 'lake' på svenska?", a: "Sjö", choices: ["Hav", "Sjö", "Å", "Damm"], en: "What is 'lake' in Swedish?" },

  // --- Directions ---
  { q: "Vad heter 'north' på svenska?", a: "Norr", choices: ["Söder", "Öster", "Väster", "Norr"], en: "What is 'north' in Swedish?" },
  { q: "Vad heter 'left' på svenska?", a: "Vänster", choices: ["Höger", "Vänster", "Rakt fram", "Bakåt"], en: "What is 'left' in Swedish?" },
  { q: "Hur säger man 'straight ahead' på svenska?", a: "Rakt fram", choices: ["Till höger", "Till vänster", "Rakt fram", "Bakåt"], en: "How do you say 'straight ahead' in Swedish?" },

  // --- Body ---
  { q: "Vad heter 'hand' på svenska?", a: "Hand", choices: ["Arm", "Hand", "Fot", "Ben"], en: "What is 'hand' in Swedish?" },
  { q: "Vad heter 'eye' på svenska?", a: "Öga", choices: ["Öra", "Öga", "Näsa", "Mun"], en: "What is 'eye' in Swedish?" },
  { q: "Vad heter 'head' på svenska?", a: "Huvud", choices: ["Hals", "Huvud", "Axel", "Bröst"], en: "What is 'head' in Swedish?" },

  // --- Time ---
  { q: "Hur säger man 'now' på svenska?", a: "Nu", choices: ["Sedan", "Nu", "Snart", "Aldrig"], en: "How do you say 'now' in Swedish?" },
  { q: "Hur säger man 'yesterday' på svenska?", a: "Igår", choices: ["Idag", "Igår", "Imorgon", "Förra veckan"], en: "How do you say 'yesterday' in Swedish?" },
  { q: "Hur säger man 'tomorrow' på svenska?", a: "Imorgon", choices: ["Igår", "Idag", "Imorgon", "Om en vecka"], en: "How do you say 'tomorrow' in Swedish?" },
  { q: "Hur säger man 'always' på svenska?", a: "Alltid", choices: ["Aldrig", "Ibland", "Alltid", "Ofta"], en: "How do you say 'always' in Swedish?" },
  { q: "Hur säger man 'never' på svenska?", a: "Aldrig", choices: ["Alltid", "Aldrig", "Ofta", "Sällan"], en: "How do you say 'never' in Swedish?" },
];

const TIME_SLOTS = [
  { key: "morning",   emoji: "🌅", label: "Morgon",      sublabel: "Morning",   color: "amber",  unlocksAt: 6  },
  { key: "afternoon", emoji: "☀️",  label: "Eftermiddag", sublabel: "Afternoon", color: "sky",    unlocksAt: 12 },
  { key: "evening",   emoji: "🌆", label: "Kväll",       sublabel: "Evening",   color: "violet", unlocksAt: 18 },
  { key: "night",     emoji: "🌙", label: "Natt",        sublabel: "Night",     color: "indigo", unlocksAt: 22 },
];

const SLOT_COLORS = {
  amber:  { tab: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300", active: "ring-amber-400", border: "border-amber-300/50 dark:border-amber-700/40", bg: "bg-amber-50/40 dark:bg-amber-950/20", btn: "bg-amber-500 hover:bg-amber-600", hover: "hover:border-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-950/20" },
  sky:    { tab: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",         active: "ring-sky-400",   border: "border-sky-300/50 dark:border-sky-700/40",     bg: "bg-sky-50/40 dark:bg-sky-950/20",     btn: "bg-sky-500 hover:bg-sky-600",     hover: "hover:border-sky-400 hover:bg-sky-50/50 dark:hover:bg-sky-950/20" },
  violet: { tab: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300", active: "ring-violet-400", border: "border-violet-300/50 dark:border-violet-700/40", bg: "bg-violet-50/40 dark:bg-violet-950/20", btn: "bg-violet-500 hover:bg-violet-600", hover: "hover:border-violet-400 hover:bg-violet-50/50 dark:hover:bg-violet-950/20" },
  indigo: { tab: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300", active: "ring-indigo-400", border: "border-indigo-300/50 dark:border-indigo-700/40", bg: "bg-indigo-50/40 dark:bg-indigo-950/20", btn: "bg-indigo-500 hover:bg-indigo-600", hover: "hover:border-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20" },
};

const STORAGE_KEY_PREFIX = "svenska:daily_challenge_v2:";
const QUESTIONS_PER_SLOT = 5;

function getTodayKey() {
  return new Date().toISOString().split("T")[0];
}

// Pick QUESTIONS_PER_SLOT unique questions for a given slot, seeded by date + slot index
function getSlotQuestions(slotIndex, pool) {
  if (!pool || pool.length === 0) return [];
  const today = getTodayKey();
  // Mix date digits with slot to get a varied seed each day per slot
  const dateParts = today.replace(/-/g, "");
  const base = (parseInt(dateParts, 10) + slotIndex * 997) >>> 0;
  const seed = (base ^ (slotIndex * 0x9e3779b9)) >>> 0;
  const indices = [];
  let n = seed >>> 0;
  const need = Math.min(QUESTIONS_PER_SLOT, pool.length);
  while (indices.length < need) {
    n = ((n * 1664525 + 1013904223) >>> 0);
    const idx = n % pool.length;
    if (!indices.includes(idx)) indices.push(idx);
  }
  return indices.map((i) => pool[i]);
}

function loadSlotState(slotKey) {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${getTodayKey()}:${slotKey}`);
    return raw ? JSON.parse(raw) : { answers: Array(QUESTIONS_PER_SLOT).fill(null), xpAwarded: false };
  } catch {
    return { answers: Array(QUESTIONS_PER_SLOT).fill(null), xpAwarded: false };
  }
}

function saveSlotState(slotKey, state) {
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${getTodayKey()}:${slotKey}`, JSON.stringify(state));
}

function getActiveSlotKey() {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return "morning";
  if (h >= 12 && h < 18) return "afternoon";
  if (h >= 18 && h < 22) return "evening";
  return "night";
}

function isSlotUnlocked(slot) {
  const h = new Date().getHours();
  if (slot.key === "night") return h >= 22 || h < 6;
  return h >= slot.unlocksAt;
}

function isSlotDone(answers) {
  return answers.every((a) => a !== null);
}

function TTSButtons({ text }) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <button
        onClick={() => playAudio(text, "sv-SE", 1)}
        title="Listen at normal speed"
        aria-label="Listen to question"
        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
      >
        <Volume2 className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => playAudio(text, "sv-SE", 0.6)}
        title="Listen slowly"
        aria-label="Listen to question slowly"
        className="px-1.5 py-1 rounded-lg text-[10px] font-semibold text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors leading-none"
      >
        slow
      </button>
    </div>
  );
}

function NextSlotHint({ currentSlot, allSlotsDone }) {
  const currentIndex = TIME_SLOTS.findIndex((s) => s.key === currentSlot.key);
  const nextSlot = TIME_SLOTS[currentIndex + 1] ?? null;
  const now = new Date().getHours();

  if (allSlotsDone) {
    return (
      <p className="text-xs text-muted-foreground italic text-center pt-0.5">
        🎉 Alla utmaningar klara! · All done! New challenges at midnight.
      </p>
    );
  }

  if (!nextSlot) return null;

  const alreadyUnlocked = now >= nextSlot.unlocksAt;
  const msg = alreadyUnlocked
    ? `${nextSlot.emoji} ${nextSlot.label} · ${nextSlot.sublabel} is ready now!`
    : `${nextSlot.emoji} Kom tillbaka kl ${nextSlot.unlocksAt}:00 för ${nextSlot.label} · Come back at ${nextSlot.unlocksAt}:00 for ${nextSlot.sublabel}`;

  return (
    <p className="text-xs text-muted-foreground italic text-center pt-0.5">{msg}</p>
  );
}

export default function DailyChallenge() {
  // Load the 1000+ question pool from the database; fall back to built-in pool while loading.
  const { data: dbPool } = useQuery({
    queryKey: ["challenge-questions"],
    queryFn: () => base44.entities.ChallengeQuestion.list("-created_date", 2000),
    staleTime: 24 * 60 * 60 * 1000,
  });
  const pool = dbPool && dbPool.length > 0 ? dbPool : QUESTION_POOL;
  const allQuestions = useMemo(() => TIME_SLOTS.map((_, i) => getSlotQuestions(i, pool)), [pool]);

  const [activeSlot, setActiveSlot] = useState(() => getActiveSlotKey());
  const [slotStates, setSlotStates] = useState(() =>
    Object.fromEntries(TIME_SLOTS.map((s) => [s.key, loadSlotState(s.key)]))
  );
  const [currentQ, setCurrentQ] = useState(0);
  const [pendingChoice, setPendingChoice] = useState(null);

  const slotIndex = TIME_SLOTS.findIndex((s) => s.key === activeSlot);
  const slot = TIME_SLOTS[slotIndex];
  const colors = SLOT_COLORS[slot.color];
  const questions = allQuestions[slotIndex];
  const state = slotStates[activeSlot];
  const answers = state.answers;

  const currentAnswer = answers[currentQ];
  const isAnswered = currentAnswer !== null;
  const isWrong = isAnswered && !currentAnswer.correct;

  const slotDone = isSlotDone(answers);
  const correctCount = answers.filter((a) => a?.correct).length;

  const updateState = (newAnswers, xpAwarded) => {
    const newState = { answers: newAnswers, xpAwarded };
    const updated = { ...slotStates, [activeSlot]: newState };
    setSlotStates(updated);
    saveSlotState(activeSlot, newState);
  };

  const handleAnswer = (choice) => {
    if (pendingChoice !== null || isAnswered) return;
    const q = questions[currentQ];
    const correct = choice === q.a;
    setPendingChoice(choice);

    setTimeout(() => {
      const newAnswers = [...answers];
      newAnswers[currentQ] = { choice, correct };

      const nowDone = newAnswers.every((a) => a !== null);
      const alreadyAwardedXP = state.xpAwarded;
      let newXpAwarded = alreadyAwardedXP;

      if (nowDone && !alreadyAwardedXP) {
        const correctTotal = newAnswers.filter((a) => a?.correct).length;
        window.dispatchEvent(new CustomEvent("xp-awarded", {
          detail: { amount: correctTotal * 5, label: `${slot.emoji} ${slot.label}` },
        }));
        newXpAwarded = true;
      }

      updateState(newAnswers, newXpAwarded);
      setPendingChoice(null);
    }, 700);
  };

  const handleRedo = () => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = null;
    updateState(newAnswers, state.xpAwarded);
    setPendingChoice(null);
  };

  const canGoPrev = currentQ > 0;
  const canGoNext = currentQ < QUESTIONS_PER_SLOT - 1 && (isAnswered || answers[currentQ + 1] !== null);

  const changeSlot = (key) => {
    setActiveSlot(key);
    const newSlotIndex = TIME_SLOTS.findIndex((s) => s.key === key);
    const newAnswers = slotStates[key].answers;
    const firstUnanswered = newAnswers.findIndex((a) => a === null);
    setCurrentQ(firstUnanswered === -1 ? QUESTIONS_PER_SLOT - 1 : firstUnanswered);
    setPendingChoice(null);
  };

  const slotUnlocked = isSlotUnlocked(slot);
  const q = questions[currentQ];
  const showResult = isAnswered || pendingChoice !== null;
  const activeChoice = isAnswered ? currentAnswer.choice : pendingChoice;

  const getSlotStatus = (key) => {
    const a = slotStates[key].answers;
    if (isSlotDone(a)) return "done";
    if (a.some((x) => x !== null)) return "partial";
    return "new";
  };

  return (
    <Card className={`${colors.border} ${colors.bg}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <CalendarCheck className="w-4 h-4 text-muted-foreground" />
          Dagens utmaningar
          <span className="text-xs font-normal text-muted-foreground/60 italic">· Daily challenges</span>
        </CardTitle>

        {/* Slot tabs */}
        <div className="grid grid-cols-4 gap-1.5 mt-1">
          {TIME_SLOTS.map((s) => {
            const status = getSlotStatus(s.key);
            const isActive = s.key === activeSlot;
            const unlocked = isSlotUnlocked(s);
            const c = SLOT_COLORS[s.color];
            return (
              <button
                key={s.key}
                onClick={() => changeSlot(s.key)}
                className={`relative flex flex-col items-center gap-0.5 py-1.5 px-1 rounded-lg text-xs font-medium transition-all border-2 ${
                  isActive
                    ? unlocked ? `${c.tab} border-current` : "bg-muted/60 border-border/50 text-muted-foreground"
                    : "border-transparent text-muted-foreground hover:bg-muted/50"
                } ${!unlocked ? "opacity-50" : ""}`}
              >
                <span className={`text-base leading-none ${!unlocked ? "grayscale" : ""}`}>{s.emoji}</span>
                <span className="hidden sm:block">{s.label}</span>
                {unlocked && status === "done" && (
                  <CheckCircle2 className="absolute -top-1 -right-1 w-3.5 h-3.5 text-emerald-500 bg-card rounded-full" />
                )}
                {unlocked && status === "partial" && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border border-card" />
                )}
                {!unlocked && (
                  <Lock className="absolute -top-1 -right-1 w-3 h-3 text-muted-foreground" />
                )}
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Lock screen */}
        {!slotUnlocked && (
          <motion.div
            key={`locked-${activeSlot}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-6 gap-3 text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
              <Lock className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm">{slot.emoji} {slot.label} · {slot.sublabel}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Låses upp kl {slot.unlocksAt}:00 · Unlocks at {slot.unlocksAt}:00
              </p>
            </div>
            <div className="flex gap-1">
              {Array(QUESTIONS_PER_SLOT).fill(null).map((_, i) => (
                <span key={i} className="w-3 h-1.5 rounded-full bg-muted-foreground/20" />
              ))}
            </div>
          </motion.div>
        )}

        {/* Progress dots */}
        {slotUnlocked && (
          <div className="flex items-center gap-1.5">
            {answers.map((a, i) => (
              <button
                key={i}
                onClick={() => { setCurrentQ(i); setPendingChoice(null); }}
                className={`h-1.5 rounded-full transition-all ${
                  i === currentQ ? "w-6 bg-foreground" :
                  a?.correct ? "w-3 bg-emerald-500" :
                  a && !a.correct ? "w-3 bg-destructive" :
                  "w-3 bg-muted-foreground/30"
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-auto">{currentQ + 1} / {QUESTIONS_PER_SLOT}</span>
          </div>
        )}

        {/* Question area */}
        {slotUnlocked && <AnimatePresence mode="wait">
          <motion.div
            key={`${activeSlot}-${currentQ}`}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.18 }}
          >
            {/* Question with TTS */}
            <div className="flex items-start justify-between gap-2 mb-0.5">
              <p className="text-sm font-medium leading-snug">{q.q}</p>
              <TTSButtons text={q.q} />
            </div>
            <p className="text-xs text-muted-foreground italic mb-3">{q.en}</p>

            <div className="grid grid-cols-2 gap-2">
              {q.choices.map((c) => {
                const isSelected = activeChoice === c;
                const isCorrect = c === q.a;
                let cls = "text-left p-2.5 rounded-lg border text-sm transition-all ";
                if (showResult && isCorrect)
                  cls += "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 font-semibold text-emerald-700 dark:text-emerald-400";
                else if (showResult && isSelected && !isCorrect)
                  cls += "border-destructive bg-destructive/10 text-destructive";
                else if (!showResult)
                  cls += `border-border/60 bg-card ${colors.hover} cursor-pointer`;
                else
                  cls += "border-border/40 bg-muted/30 text-muted-foreground";
                return (
                  <button key={c} className={cls} onClick={() => handleAnswer(c)} disabled={showResult}>
                    {c}
                  </button>
                );
              })}
            </div>

            {/* Answer TTS — hear the correct answer after answering */}
            {isAnswered && (
              <div className="flex items-center justify-between mt-3 gap-2">
                <div className="flex items-center gap-2">
                  {isWrong && (
                    <Button size="sm" variant="outline" className="gap-1.5 text-xs h-8" onClick={handleRedo}>
                      <RefreshCw className="w-3 h-3" /> Försök igen · Redo
                    </Button>
                  )}
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>Svar:</span>
                    <button
                      onClick={() => playAudio(q.a, "sv-SE", 1)}
                      title="Hear the answer"
                      aria-label="Hear the correct answer"
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded-md hover:bg-muted transition-colors font-medium text-foreground"
                    >
                      {q.a} <Volume2 className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    disabled={!canGoPrev}
                    onClick={() => { setCurrentQ(q => q - 1); setPendingChoice(null); }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    disabled={!canGoNext}
                    onClick={() => { setCurrentQ(q => q + 1); setPendingChoice(null); }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>}

        {/* Slot completion summary */}
        {slotUnlocked && slotDone && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-2 border-t border-border/40 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {slot.label} klar! · {slot.sublabel} done!
                </span>
              </div>
              <span className="text-xs font-bold">{correctCount}/{QUESTIONS_PER_SLOT}</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${correctCount === QUESTIONS_PER_SLOT ? "bg-emerald-500" : correctCount >= 3 ? "bg-amber-400" : "bg-destructive"}`}
                style={{ width: `${(correctCount / QUESTIONS_PER_SLOT) * 100}%` }}
              />
            </div>
            <NextSlotHint currentSlot={slot} allSlotsDone={TIME_SLOTS.every((s) => isSlotDone(slotStates[s.key].answers))} />
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}