import type { Lesson } from "./types"

export const TASTE_LESSONS: Lesson[] = [
  {
    slug: "how-to-taste",
    track: "taste",
    title: "How to taste wine (without feeling silly)",
    minutes: 4,
    level: "Beginner",
    emoji: "👃",
    summary: "The five S's: see, swirl, sniff, sip, savor. A simple routine that doubles what you notice in any glass.",
    sections: [
      {
        heading: "Why bother with a routine?",
        body: [
          "Most of what we call taste is really smell. Your tongue only senses sweet, sour, salty, bitter and savory. Cherry, leather, violets and smoke all come from your nose.",
          "A tasting routine isn't about being fancy. It just slows you down enough to notice what's in the glass instead of gulping it.",
        ],
      },
      {
        heading: "1. See",
        body: [
          "Tilt the glass over something white. Red wines go from pale ruby (Pinot Noir, young Gamay) to almost-black purple (Syrah, Malbec). Reds turn brick-orange at the rim as they age; whites go from water-pale to deep gold.",
        ],
      },
      {
        heading: "2. Swirl",
        body: [
          "Keep the base on the table and draw small circles. Swirling pulls in air and lifts aromas out of the wine so there's more to smell.",
        ],
        tip: "Fill the glass only a third full. Leave room to swirl without a splash.",
      },
      {
        heading: "3. Sniff",
        body: [
          "Put your nose right in the glass. Take one short sniff, then a longer one. Ask yourself three easy questions: fruity or earthy? Fresh fruit or cooked fruit? Any wood, spice or flowers?",
          "Don't worry about the \"right\" answer. If it reminds you of your grandmother's kitchen, that counts.",
        ],
      },
      {
        heading: "4. Sip",
        body: [
          "Take a slightly larger sip than usual and let it coat your whole mouth. Notice sweetness on the tip of your tongue, acidity making your mouth water, and tannin drying your gums.",
        ],
      },
      {
        heading: "5. Savor",
        body: [
          "After you swallow, count how long the flavor lingers. That's the finish. A few seconds is normal; a finish of 20 seconds or more is a sign of a serious wine.",
        ],
      },
    ],
    quiz: [
      {
        q: "Where does most of what we call a wine's \"taste\" actually come from?",
        options: ["Your tongue", "Your nose", "The color", "The temperature"],
        answer: 1,
        why: "Your tongue picks up only five basic tastes. Fruit, spice, flowers and earth are all aromas.",
      },
      {
        q: "Why do people swirl their wine?",
        options: ["To cool it down", "To make bubbles", "To release aromas", "To check for cork"],
        answer: 2,
        why: "Swirling adds air and lifts aromatic compounds out of the wine.",
      },
      {
        q: "What is the \"finish\"?",
        options: ["The last glass in the bottle", "How long flavor lingers after swallowing", "The wine's color at the rim", "The final step of winemaking"],
        answer: 1,
        why: "A long finish is one of the most reliable signs of quality.",
      },
    ],
    findNear: { type: "bar", label: "Practice at a wine bar" },
    ask: "I'm new to wine tasting. Recommend two very different wines I could taste side by side to practice the five S's.",
  },
  {
    slug: "aromas",
    track: "taste",
    title: "Naming what you smell",
    minutes: 4,
    level: "Beginner",
    emoji: "🍒",
    summary: "Primary, secondary and tertiary aromas: where wine smells come from and how to put words to them.",
    sections: [
      {
        heading: "Three families of aromas",
        body: [
          "Primary aromas come from the grape itself: fruit, flowers, herbs. Think lime in Riesling, black currant in Cabernet, pepper in Syrah.",
          "Secondary aromas come from winemaking: butter from malolactic fermentation, bread and brioche from aging on yeast (lees), vanilla and toast from oak barrels.",
          "Tertiary aromas come from age: leather, dried fruit, mushroom, tobacco, honey. They're why some people pay a fortune for old bottles.",
        ],
      },
      {
        heading: "Go from broad to specific",
        body: [
          "Start broad: is it fruit? Then narrow it: red fruit or black fruit? Then narrow again: fresh strawberry, or strawberry jam?",
          "Whites usually sit on a scale from citrus (lemon, lime) through orchard fruit (apple, pear) and stone fruit (peach, apricot) to tropical (pineapple, mango). Warmer climates push wines towards the riper end.",
        ],
        tip: "Build an aroma memory: smell the fruit bowl and spice rack at home before you taste.",
      },
    ],
    quiz: [
      {
        q: "Vanilla and toast notes in a wine usually come from…",
        options: ["The grape variety", "Oak barrels", "The soil", "Very old age"],
        answer: 1,
        why: "These are secondary aromas from aging in oak, especially new barrels.",
      },
      {
        q: "Leather, mushroom and dried fruit are typical of…",
        options: ["Very young wines", "Sparkling wines", "Aged wines", "Rosé"],
        answer: 2,
        why: "These tertiary aromas develop as wine ages in bottle.",
      },
      {
        q: "A white wine smelling of pineapple and mango most likely comes from…",
        options: ["A warm climate", "A cold climate", "A cellar", "A screw-cap bottle"],
        answer: 0,
        why: "Riper, tropical fruit flavors are a classic sign of warmer growing conditions.",
      },
    ],
    ask: "Suggest a red wine with strong earthy, aged aromas and a white wine with tropical fruit aromas, so I can compare them.",
  },
  {
    slug: "structure",
    track: "taste",
    title: "Acidity, tannin and body",
    minutes: 5,
    level: "Beginner",
    emoji: "⚖️",
    summary: "The three things that make wine feel the way it does, and why they matter more than flavor for food pairing.",
    sections: [
      {
        heading: "Acidity: the mouthwatering part",
        body: [
          "Acidity makes your mouth water, like biting into a green apple. High-acid wines feel fresh and zippy: Sauvignon Blanc, Riesling, Champagne, Barbera.",
          "Low acidity feels round and soft, sometimes flabby. Cool climates keep acidity high; hot climates let it fall.",
        ],
      },
      {
        heading: "Tannin: the drying part",
        body: [
          "Tannin is what makes your gums and cheeks feel dry and grippy after a sip of strong black tea. It comes from grape skins, seeds and oak, so it's mostly found in red wine.",
          "Nebbiolo and Cabernet Sauvignon are famously tannic. Pinot Noir and Gamay are gentle.",
        ],
      },
      {
        heading: "Body: the weight",
        body: [
          "Body is how heavy the wine feels: skim milk, whole milk or cream. More alcohol, sugar and extract means fuller body.",
        ],
        points: [
          { label: "Light", text: "Pinot Grigio, Gamay" },
          { label: "Medium", text: "Merlot, Sangiovese" },
          { label: "Full", text: "Cabernet, Syrah, oaked Chardonnay" },
        ],
        tip: "Rinse a sip of water around your mouth, then a sip of wine. The difference in weight is body.",
      },
    ],
    quiz: [
      {
        q: "Which feeling is caused by tannin?",
        options: ["Your mouth watering", "A drying, grippy feeling", "A warm burn", "Sweetness"],
        answer: 1,
        why: "Tannins bind to proteins in your saliva, which feels drying.",
      },
      {
        q: "Which of these is typically light-bodied?",
        options: ["Syrah", "Cabernet Sauvignon", "Gamay", "Oaked Chardonnay"],
        answer: 2,
        why: "Gamay (the Beaujolais grape) is light, juicy and low in tannin.",
      },
      {
        q: "Cool climates tend to make wines with…",
        options: ["Higher acidity", "Lower acidity", "More sugar", "More tannin"],
        answer: 0,
        why: "Grapes keep more acid when they ripen slowly in cooler weather.",
      },
    ],
    ask: "Recommend one high-acid white, one very tannic red and one soft, low-tannin red so I can feel the difference.",
  },
  {
    slug: "reading-labels",
    track: "taste",
    title: "How to read a wine label",
    minutes: 4,
    level: "Beginner",
    emoji: "🏷️",
    summary: "Producer, place, vintage. Decode Old World and New World labels in a few seconds.",
    sections: [
      {
        heading: "The three things every label tells you",
        body: [
          "Who made it (the producer), where the grapes grew (the place) and when they were picked (the vintage). Everything else is extra detail or marketing.",
        ],
      },
      {
        heading: "Place vs grape",
        body: [
          "European labels usually name the place, and the place implies the grape. New World labels (US, Australia, Chile) usually name the grape.",
        ],
        points: [
          { label: "Chablis", text: "Chardonnay" },
          { label: "Sancerre", text: "Sauvignon Blanc" },
          { label: "Barolo", text: "Nebbiolo" },
          { label: "Rioja", text: "Mostly Tempranillo" },
        ],
      },
      {
        heading: "Useful words",
        body: [],
        points: [
          { label: "Reserva / Riserva", text: "Aged longer before release (rules vary by region)" },
          { label: "Grand Cru / Premier Cru", text: "Top-ranked vineyards, e.g. in Burgundy" },
          { label: "Brut", text: "Dry sparkling wine" },
          { label: "Old vines", text: "Older, often more concentrated vines (no legal definition)" },
        ],
        tip: "\"Reserve\" on an American label has no legal meaning. It's whatever the winery wants it to mean.",
      },
    ],
    quiz: [
      {
        q: "A bottle labeled \"Chablis\" is made from which grape?",
        options: ["Sauvignon Blanc", "Chardonnay", "Riesling", "Pinot Grigio"],
        answer: 1,
        why: "Chablis is a region in northern Burgundy that grows only Chardonnay.",
      },
      {
        q: "What does the vintage tell you?",
        options: ["The bottling year", "The year the grapes were harvested", "The winery's founding year", "The best year to drink it"],
        answer: 1,
        why: "The vintage is the harvest year.",
      },
      {
        q: "\"Brut\" on a sparkling wine means…",
        options: ["Very sweet", "Dry", "Red", "Aged in oak"],
        answer: 1,
        why: "Brut is a dry style with very little added sugar.",
      },
    ],
    tasteIt: { variety: "Chardonnay", country: "France", label: "French Chardonnay, as named on European labels" },
    findNear: { type: "shop", label: "Practice reading labels at a wine shop" },
    ask: "Explain how to read the label of a bottle of Barolo, and recommend one to try.",
  },
  {
    slug: "serving",
    track: "taste",
    title: "Serving temperature and glasses",
    minutes: 3,
    level: "Beginner",
    emoji: "🌡️",
    summary: "Most reds are served too warm and most whites too cold. Here's the easy fix, and the only glass you need.",
    sections: [
      {
        heading: "Temperature cheat sheet",
        body: ["Too warm and a red tastes boozy and soupy. Too cold and a white tastes of nothing."],
        points: [
          { label: "Sparkling", text: "6–10°C (43–50°F)" },
          { label: "Crisp whites & rosé", text: "8–12°C (46–54°F)" },
          { label: "Rich whites", text: "10–13°C (50–55°F)" },
          { label: "Light reds", text: "12–15°C (54–59°F)" },
          { label: "Full reds", text: "15–18°C (59–65°F)" },
        ],
        tip: "The 20/20 rule: whites out of the fridge 20 minutes before serving, reds in the fridge for 20 minutes.",
      },
      {
        heading: "Glasses",
        body: [
          "Shape matters more than price. A bowl that narrows towards the rim traps aromas. One good all-purpose glass will serve almost every wine well, sparkling included.",
        ],
      },
    ],
    quiz: [
      {
        q: "A full-bodied red is best served at about…",
        options: ["4–6°C", "8–10°C", "15–18°C", "22–25°C"],
        answer: 2,
        why: "Slightly below room temperature keeps big reds fresh and focused.",
      },
      {
        q: "What happens if a white wine is served too cold?",
        options: ["It tastes sweeter", "Its aromas are muted", "It becomes more alcoholic", "It goes flat"],
        answer: 1,
        why: "Cold suppresses aroma, so you smell and taste less.",
      },
      {
        q: "Which glass shape traps aromas best?",
        options: ["A straight tumbler", "A bowl that narrows at the rim", "A wide, shallow coupe", "A mug"],
        answer: 1,
        why: "A tapered bowl concentrates aromas towards your nose.",
      },
    ],
    ask: "What's a light red wine that's great served slightly chilled in summer?",
  },
  {
    slug: "storing",
    track: "taste",
    title: "Storing wine and open bottles",
    minutes: 3,
    level: "Beginner",
    emoji: "🍾",
    summary: "Where to keep bottles, how long open wine lasts, and which wines are actually worth aging.",
    sections: [
      {
        heading: "Unopened bottles",
        body: [
          "Wine hates heat, light and big temperature swings. A dark closet beats the top of the fridge or a kitchen rack by the oven. Store cork-sealed bottles on their side so the cork stays moist.",
          "Most wine is made to drink within a few years. Only a small share (top Bordeaux, Barolo, Riesling, vintage Port and the like) really improves with long aging.",
        ],
      },
      {
        heading: "Open bottles",
        body: [
          "Recork it and put it in the fridge, reds included. Most still wines stay good for 2 to 4 days. Sparkling lasts a day or two with a proper stopper. Fortified wines like Port and Sherry (except the delicate Fino and Manzanilla styles) last for weeks.",
        ],
        tip: "Leftover wine that's past its best is still great for cooking.",
      },
    ],
    quiz: [
      {
        q: "Why store cork-sealed bottles on their side?",
        options: ["To save space", "To keep the cork moist", "To mix the sediment", "To age it faster"],
        answer: 1,
        why: "A dried-out cork can shrink and let air in.",
      },
      {
        q: "How long does an opened still wine usually last in the fridge?",
        options: ["A few hours", "2–4 days", "Two weeks", "Two months"],
        answer: 1,
        why: "Oxygen slowly flattens the wine after a few days.",
      },
      {
        q: "Should you refrigerate an open bottle of red?",
        options: ["Yes", "No, never", "Only if it's cheap", "Only if it's sparkling"],
        answer: 0,
        why: "The cold slows oxidation. Just take it out 20 minutes before drinking.",
      },
    ],
    ask: "Which affordable wines are worth aging for 5 to 10 years?",
  },
  {
    slug: "ordering",
    track: "taste",
    title: "Ordering wine at a restaurant",
    minutes: 4,
    level: "Beginner",
    emoji: "🍽️",
    summary: "How to read a wine list, talk to the sommelier, and handle the tasting ritual with confidence.",
    sections: [
      {
        heading: "Use the three-part sentence",
        body: [
          "Tell your server: the color, a style word you like (\"juicy\", \"crisp\", \"earthy\", \"bold\") and a price, by pointing at a bottle at that price on the list. \"A juicy red, something around this\" is a perfect request.",
          "Good staff love this. It gives them everything they need without anyone having to say a number out loud.",
        ],
      },
      {
        heading: "Hunting for value",
        body: [
          "Lesser-known regions and grapes are usually the best deals on a list: Portugal, the Loire Valley, Spain's Garnacha, Austrian Grüner Veltliner, South African Chenin Blanc.",
          "Wine by the glass is a great way to try something new without committing to a bottle.",
        ],
      },
      {
        heading: "The tasting ritual",
        body: [
          "When the server pours a small taste, you're only checking that the wine isn't faulty, not whether you love it. Musty, wet-cardboard smells mean it's \"corked\", and it's perfectly fine to ask for another bottle.",
        ],
      },
    ],
    quiz: [
      {
        q: "What is the tasting pour at a restaurant mainly for?",
        options: ["Deciding whether you like it", "Checking the wine isn't faulty", "Checking the temperature only", "Tradition, nothing else"],
        answer: 1,
        why: "You can send back a faulty bottle, but not one you simply don't love.",
      },
      {
        q: "A musty, wet-cardboard smell means the wine is probably…",
        options: ["Corked", "Very old", "Natural", "Oaked"],
        answer: 0,
        why: "That's TCA, a cork-related fault.",
      },
      {
        q: "Where are the best-value bottles usually found on a list?",
        options: ["Famous regions like Burgundy", "Lesser-known regions and grapes", "The most expensive section", "Always the house wine"],
        answer: 1,
        why: "Famous names carry a premium. Underdogs often over-deliver.",
      },
    ],
    findNear: { type: "restaurant", label: "Try it at a restaurant near you" },
    ask: "I'm ordering at an Italian restaurant for a group with mixed dishes. What styles of wine should I look for on the list?",
  },
  {
    slug: "pairing",
    track: "taste",
    title: "Food and wine pairing basics",
    minutes: 5,
    level: "Beginner",
    emoji: "🧀",
    summary: "Four simple rules that work for any meal, from takeout curry to a Sunday roast.",
    sections: [
      {
        heading: "Rule 1: match weight with weight",
        body: [
          "Delicate food (fish, salads) wants delicate wine. Rich food (braises, steak) wants rich wine. This one rule gets you 80% of the way.",
        ],
      },
      {
        heading: "Rule 2: acid loves fat and salt",
        body: [
          "High-acid wines cut through fried food, cheese and creamy sauces like a squeeze of lemon. That's why Champagne and fried chicken is a legendary pairing.",
        ],
      },
      {
        heading: "Rule 3: tannin loves protein",
        body: [
          "Tannic reds soften next to steak and hard cheese because the tannins bind to the protein. Without food, the same wine can feel harsh.",
        ],
      },
      {
        heading: "Rule 4: spice needs sweetness, not alcohol",
        body: [
          "High alcohol makes chili burn hotter. An off-dry, lower-alcohol white like Riesling cools things down.",
        ],
        tip: "When in doubt: what grows together goes together. Pasta with tomato sauce and Chianti, goat cheese and Sancerre, paella and Rioja.",
      },
    ],
    quiz: [
      {
        q: "Which wine best handles a spicy Thai curry?",
        options: ["A 15% Zinfandel", "An off-dry Riesling", "A tannic Barolo", "A dry Sherry"],
        answer: 1,
        why: "A touch of sweetness and low alcohol tame chili heat.",
      },
      {
        q: "Why does steak soften a tannic red?",
        options: ["Salt hides the alcohol", "Tannin binds to protein and fat", "Heat changes the wine", "It doesn't"],
        answer: 1,
        why: "Protein and fat give tannins something to bind to instead of your mouth.",
      },
      {
        q: "Fried food pairs best with wines that are…",
        options: ["High in acidity", "High in tannin", "Very sweet", "Full-bodied and oaky"],
        answer: 0,
        why: "Acidity cuts through grease and refreshes your palate.",
      },
    ],
    ask: "Give me three pairing ideas for a weeknight dinner of roast chicken.",
  },
]
