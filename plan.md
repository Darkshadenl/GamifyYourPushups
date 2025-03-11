# Push-up Journey App

## Doel
Een gebruiksvriendelijke mobiele webapplicatie voor het bijhouden van een progressief push-up schema met tracking, gamification en data-beheer functionaliteiten, met een modern design.

## Requirements

1. **Workout Schema**
   1.1. Implementeer een progressief push-up schema met dagelijkse doelen
   1.2. Toon slechts één dag tegelijk beschikbaar voor de gebruiker
   1.3. Bied een invoerveld voor het registreren van het dagelijkse aantal push-ups

2. **Tracking Functionaliteit**
   2.1. Toon een duidelijke visualisatie van de huidige dag en voortgang
   2.2. Implementeer een checkbox om aan te geven of het dagdoel is behaald
   2.3. Update automatisch de counter naar het doelgetal bij aanvinken van de checkbox
   2.4. Als de waarde onder het doel daalt, moet het vinkje automatisch uitschakelen
   2.5. Integreer een "joker"-systeem (één per dag) met de volgende functionaliteit:
      - Schakelbaar tussen ❌ (niet gebruikt) en ⭕ (gebruikt)
      - ❌ kan terug naar ⭕ worden veranderd
      - ⭕ schakelt de checkbox uit en zet de dagelijkse counter op 0
   2.6. Visualiseer dag- en levelprogressie in grafieken

3. **Gamification**
   3.1. Implementeer een streak-systeem voor het bijhouden van consecutieve behaalde doelen
   3.2. Creëer een level-systeem met vijf niveaus: Beginner, Amateur, Intermediate, Advanced, Master
   3.3. Ontwikkel achievement badges voor specifieke mijlpalen
   3.4. Highlight badges bij het behalen van doelen
   3.5. Reset de progressiebalk naar 0% na het behalen van een level

4. **Navigatie**
   4.1. Sta gebruikers toe om voltooide dagen te bekijken
   4.2. Blokkeer toegang tot toekomstige dagen

5. **Data Management**
   5.1. Bied functionaliteit voor het exporteren van data als JSON-bestand
   5.2. Implementeer een import-functie voor eerder geëxporteerde data

6. **User Interface**
   6.1. Ontwerp een header met het format: "Push-up Journey 🔥 [streak] days" en "Level [nummer] - [naam]"
   6.2. Optimaliseer de layout voor mobiele apparaten
   6.3. Zorg voor een intuïtieve uitlijning van het dagtekst en invoerveld

7. **Gedrag**
   7.1. Zorg dat het gebruik van de emergency-out (joker) de progressie niet beïnvloedt
   7.2. Garandeer optimale functionaliteit op mobiele apparaten
