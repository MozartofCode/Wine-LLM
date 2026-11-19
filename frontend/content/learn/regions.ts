import type { Lesson } from "./types"

export const REGION_LESSONS: Lesson[] = [
  {
    slug: "france",
    track: "regions",
    title: "France",
    minutes: 5,
    level: "Beginner",
    emoji: "🇫🇷",
    summary: "The benchmark for half the world's grapes: Bordeaux, Burgundy, Champagne, the Rhône and the Loire.",
    mapCountries: ["France"],
    sections: [
      {
        body: [
          "France doesn't just make great wine; it wrote the rulebook. Its system of controlled place names (AOC), created in 1935, became the model for wine laws across Europe.",
        ],
      },
      {
        heading: "The big five",
        body: [],
        points: [
          { label: "Bordeaux", text: "Cabernet Sauvignon and Merlot blends, plus sweet Sauternes" },
          { label: "Burgundy", text: "Pinot Noir and Chardonnay from tiny, mapped plots" },
          { label: "Champagne", text: "Sparkling wine from Chardonnay, Pinot Noir and Meunier" },
          { label: "Rhône", text: "Peppery Syrah in the north, Grenache blends in the south" },
          { label: "Loire", text: "Crisp Sauvignon Blanc, Chenin Blanc and Cabernet Franc" },
        ],
      },
      {
        heading: "Reading French labels",
        body: [
          "French labels name the place, not the grape. Learn which grapes each region grows and the labels suddenly make sense.",
        ],
        tip: "Great value: Côtes du Rhône, Crémant (sparkling made the Champagne way) and Loire reds.",
      },
    ],
    quiz: [
      {
        q: "Red Burgundy is made from which grape?",
        options: ["Merlot", "Pinot Noir", "Syrah", "Cabernet Sauvignon"],
        answer: 1,
        why: "Burgundy's reds are Pinot Noir; its whites are Chardonnay.",
      },
      {
        q: "Which region is known for peppery Syrah?",
        options: ["Northern Rhône", "Champagne", "Loire", "Alsace"],
        answer: 0,
        why: "Hermitage and Côte-Rôtie in the northern Rhône are Syrah's classic home.",
      },
      {
        q: "French wine labels usually name…",
        options: ["The grape", "The place", "The winemaker's first name", "The alcohol level only"],
        answer: 1,
        why: "The place implies the grape under AOC rules.",
      },
    ],
    tasteIt: { country: "France", label: "Top-rated French wines" },
    findNear: { type: "shop", label: "Explore the French aisle near you" },
    ask: "I want to explore French wine on a budget. Suggest one bottle each from three different French regions.",
  },
  {
    slug: "italy",
    track: "regions",
    title: "Italy",
    minutes: 5,
    level: "Beginner",
    emoji: "🇮🇹",
    summary: "Hundreds of native grapes, from Piedmont's Nebbiolo to Tuscany's Sangiovese and Sicily's volcanic reds.",
    mapCountries: ["Italy"],
    sections: [
      {
        body: [
          "Italy grows wine in every one of its 20 regions and has hundreds of native grape varieties. Italian wines are built for food: high acidity, savory flavors, often a bitter twist on the finish.",
        ],
      },
      {
        heading: "Where to start",
        body: [],
        points: [
          { label: "Piedmont", text: "Nebbiolo (Barolo, Barbaresco), plus everyday Barbera and Dolcetto" },
          { label: "Tuscany", text: "Sangiovese (Chianti Classico, Brunello) and \"Super Tuscan\" blends" },
          { label: "Veneto", text: "Prosecco, Amarone and Soave" },
          { label: "Sicily", text: "Nero d'Avola and the volcanic wines of Mount Etna" },
        ],
        tip: "On labels, DOCG is Italy's highest quality category, but plenty of great wines sit outside it.",
      },
    ],
    quiz: [
      {
        q: "Barolo is made from which grape?",
        options: ["Sangiovese", "Nebbiolo", "Barbera", "Montepulciano"],
        answer: 1,
        why: "Barolo is 100% Nebbiolo, from Piedmont.",
      },
      {
        q: "Chianti comes from which region?",
        options: ["Piedmont", "Tuscany", "Veneto", "Sicily"],
        answer: 1,
        why: "Chianti is Tuscany's most famous wine, based on Sangiovese.",
      },
      {
        q: "Prosecco is a sparkling wine from…",
        options: ["Northeast Italy", "Sicily", "Tuscany", "Spain"],
        answer: 0,
        why: "Prosecco comes from the Veneto and Friuli in northeast Italy.",
      },
    ],
    tasteIt: { country: "Italy", label: "Top-rated Italian wines" },
    findNear: { type: "restaurant", label: "Find an Italian wine list near you" },
    ask: "Recommend an Italian red for pizza night and an Italian white for seafood pasta.",
  },
  {
    slug: "spain",
    track: "regions",
    title: "Spain",
    minutes: 4,
    level: "Beginner",
    emoji: "🇪🇸",
    summary: "Rioja, Ribera del Duero, Priorat, Cava and Sherry: big flavor and some of the best value in wine.",
    mapCountries: ["Spain"],
    sections: [
      {
        body: [
          "Spain has more land under vine than almost any other country. For decades it was underrated, which is good news: Spanish wine is still some of the best value around.",
        ],
      },
      {
        heading: "Key regions",
        body: [],
        points: [
          { label: "Rioja & Ribera", text: "Tempranillo, often oak-aged" },
          { label: "Priorat", text: "Intense Garnacha from steep slate slopes" },
          { label: "Rías Baixas", text: "Zesty Albariño, made for seafood" },
          { label: "Cava", text: "Champagne-method sparkling, mostly from Catalonia" },
          { label: "Jerez", text: "Sherry, from bone-dry Fino to sweet Pedro Ximénez" },
        ],
        tip: "Crianza, Reserva and Gran Reserva tell you how long a Rioja aged before release.",
      },
    ],
    quiz: [
      {
        q: "Rioja's main grape is…",
        options: ["Garnacha", "Tempranillo", "Albariño", "Monastrell"],
        answer: 1,
        why: "Tempranillo is the backbone of Rioja and Ribera del Duero.",
      },
      {
        q: "Cava is…",
        options: ["A sweet dessert wine", "A Spanish sparkling wine", "A type of Sherry", "A grape"],
        answer: 1,
        why: "Cava is made the same way as Champagne.",
      },
      {
        q: "Albariño from Rías Baixas pairs best with…",
        options: ["Seafood", "Steak", "Chocolate", "Barbecue ribs"],
        answer: 0,
        why: "It's a crisp, salty-edged white from Spain's Atlantic coast.",
      },
    ],
    tasteIt: { country: "Spain", label: "Top-rated Spanish wines" },
    findNear: { type: "bar", label: "Find a tapas or wine bar near you" },
    ask: "Suggest a Spanish wine to go with a tapas spread.",
  },
  {
    slug: "usa",
    track: "regions",
    title: "United States",
    minutes: 4,
    level: "Beginner",
    emoji: "🇺🇸",
    summary: "California's sunshine, Oregon's Pinot Noir and Washington's bold reds. Wine is made in all 50 states.",
    mapCountries: ["US"],
    sections: [
      {
        body: [
          "Wine is made in all 50 states, but California makes most of it. American wine shot to fame in 1976, when California wines beat famous French ones in a blind tasting in Paris.",
        ],
      },
      {
        heading: "Key regions",
        body: [],
        points: [
          { label: "Napa Valley", text: "World-class Cabernet Sauvignon" },
          { label: "Sonoma", text: "Cool-climate Pinot Noir and Chardonnay, old-vine Zinfandel" },
          { label: "Willamette, Oregon", text: "Elegant Pinot Noir" },
          { label: "Washington State", text: "Cabernet, Merlot and Syrah" },
          { label: "Finger Lakes, NY", text: "Crisp Riesling" },
        ],
        tip: "AVA on a US label means American Viticultural Area, a defined growing region.",
      },
    ],
    quiz: [
      {
        q: "Oregon's Willamette Valley is best known for…",
        options: ["Zinfandel", "Pinot Noir", "Malbec", "Sherry"],
        answer: 1,
        why: "Its cool climate is ideal for Pinot Noir.",
      },
      {
        q: "Napa Valley is most famous for…",
        options: ["Cabernet Sauvignon", "Riesling", "Gamay", "Tempranillo"],
        answer: 0,
        why: "Napa Cabernet is one of the world's benchmark reds.",
      },
      {
        q: "What happened at the 1976 Judgment of Paris?",
        options: ["France banned US wine", "California wines beat French wines in a blind tasting", "Napa was founded", "Prohibition ended"],
        answer: 1,
        why: "It put American wine on the world map.",
      },
    ],
    tasteIt: { country: "US", label: "Top-rated American wines" },
    findNear: { type: "winery", label: "Find wineries near you" },
    ask: "Recommend an Oregon Pinot Noir and a Washington red that are good value.",
  },
  {
    slug: "australia-nz",
    track: "regions",
    title: "Australia and New Zealand",
    minutes: 4,
    level: "Beginner",
    emoji: "🦘",
    summary: "Barossa Shiraz, Clare Valley Riesling and Marlborough Sauvignon Blanc.",
    mapCountries: ["Australia", "New Zealand"],
    sections: [
      {
        heading: "Australia",
        body: [
          "Australia is known for rich Barossa Valley Shiraz, but it's far more varied: Clare and Eden Valley Riesling, Hunter Valley Sémillon, Margaret River Cabernet and Chardonnay, and cool Yarra Valley Pinot Noir. Some of the world's oldest Shiraz and Grenache vines grow here.",
        ],
      },
      {
        heading: "New Zealand",
        body: [
          "New Zealand burst onto the scene in the 1980s with Marlborough Sauvignon Blanc: intense passion fruit, grapefruit and fresh-cut grass. Central Otago, the world's southernmost major wine region, makes excellent Pinot Noir.",
        ],
        tip: "Most wine from both countries uses screw caps, which keep it fresh.",
      },
    ],
    quiz: [
      {
        q: "Marlborough is famous for…",
        options: ["Sauvignon Blanc", "Malbec", "Nebbiolo", "Port"],
        answer: 0,
        why: "Marlborough Sauvignon Blanc made New Zealand famous.",
      },
      {
        q: "Barossa Valley is best known for…",
        options: ["Pinot Grigio", "Shiraz", "Riesling", "Chenin Blanc"],
        answer: 1,
        why: "Rich, ripe Shiraz, often from very old vines.",
      },
      {
        q: "Central Otago is known for…",
        options: ["Pinot Noir", "Zinfandel", "Tempranillo", "Sherry"],
        answer: 0,
        why: "Its cool, dry climate suits Pinot Noir.",
      },
    ],
    tasteIt: { country: "Australia", label: "Top-rated Australian wines" },
    findNear: { type: "shop", label: "Find a wine shop near you" },
    ask: "Recommend a Barossa Shiraz and a Marlborough Sauvignon Blanc.",
  },
  {
    slug: "south-america",
    track: "regions",
    title: "Argentina and Chile",
    minutes: 4,
    level: "Beginner",
    emoji: "🏔️",
    summary: "High-altitude Malbec, Chilean Cabernet and Carménère, and great value from both sides of the Andes.",
    mapCountries: ["Argentina", "Chile"],
    sections: [
      {
        heading: "Argentina",
        body: [
          "Mendoza's vineyards sit high in the foothills of the Andes, some above 1,000 meters. Intense sun and cold nights give Malbec its dark fruit and fresh acidity. Look out too for floral Torrontés, a white from Salta.",
        ],
      },
      {
        heading: "Chile",
        body: [
          "Chile is a long, narrow strip between the Andes and the Pacific. Maipo Valley makes classic Cabernet Sauvignon, cooler Casablanca makes crisp whites, and Carménère, a grape almost lost in Bordeaux, has become a Chilean specialty.",
        ],
        tip: "Chile was never hit by phylloxera, so many of its vines grow on their own roots.",
      },
    ],
    quiz: [
      {
        q: "Argentina's signature red grape is…",
        options: ["Malbec", "Pinot Noir", "Sangiovese", "Gamay"],
        answer: 0,
        why: "Mendoza Malbec is Argentina's calling card.",
      },
      {
        q: "Which grape, nearly lost in Bordeaux, became a Chilean specialty?",
        options: ["Carménère", "Riesling", "Nebbiolo", "Tempranillo"],
        answer: 0,
        why: "For years Chileans thought their Carménère vines were Merlot.",
      },
      {
        q: "Why are Mendoza's vineyards special?",
        options: ["They're below sea level", "They're at high altitude", "They're on an island", "They're underground"],
        answer: 1,
        why: "Altitude gives cool nights that keep the wines fresh.",
      },
    ],
    tasteIt: { country: "Argentina", label: "Top-rated Argentine wines" },
    findNear: { type: "restaurant", label: "Find a steakhouse wine list near you" },
    ask: "Suggest an Argentine Malbec and a Chilean red for a barbecue.",
  },
  {
    slug: "germany-austria",
    track: "regions",
    title: "Germany and Austria",
    minutes: 4,
    level: "Intermediate",
    emoji: "🇩🇪",
    summary: "Riesling from steep river slopes, Austria's Grüner Veltliner, and how to decode German ripeness terms.",
    mapCountries: ["Germany", "Austria"],
    sections: [
      {
        heading: "Germany",
        body: [
          "Germany's best vineyards cling to steep slopes along rivers like the Mosel and Rhine, where the water and slate soils help grapes ripen this far north. Riesling is king, from bone dry (look for \"trocken\") to lusciously sweet.",
          "Kabinett, Spätlese and Auslese describe how ripe the grapes were at harvest, not necessarily how sweet the wine is.",
        ],
      },
      {
        heading: "Austria",
        body: [
          "Austria's signature is Grüner Veltliner: crisp, peppery and great with food. The Wachau's terraces along the Danube also make outstanding Riesling. For reds, try Blaufränkisch and Zweigelt.",
        ],
        tip: "German Spätburgunder is Pinot Noir, and some excellent ones are coming from Germany now.",
      },
    ],
    quiz: [
      {
        q: "Austria's signature white grape is…",
        options: ["Grüner Veltliner", "Chardonnay", "Viognier", "Albariño"],
        answer: 0,
        why: "Grüner Veltliner is Austria's most planted grape.",
      },
      {
        q: "On a German label, \"trocken\" means…",
        options: ["Sweet", "Dry", "Sparkling", "Old vines"],
        answer: 1,
        why: "Trocken is German for dry.",
      },
      {
        q: "Spätburgunder is the German name for…",
        options: ["Riesling", "Pinot Noir", "Merlot", "Syrah"],
        answer: 1,
        why: "Burgunder refers to Burgundy grapes; Spät means late (ripening).",
      },
    ],
    tasteIt: { country: "Germany", label: "Top-rated German wines" },
    findNear: { type: "shop", label: "Find a wine shop near you" },
    ask: "Recommend a dry German Riesling and an Austrian Grüner Veltliner.",
  },
  {
    slug: "portugal",
    track: "regions",
    title: "Portugal",
    minutes: 4,
    level: "Beginner",
    emoji: "🇵🇹",
    summary: "Port, Madeira, Vinho Verde and powerful Douro reds made from grapes you won't find elsewhere.",
    mapCountries: ["Portugal"],
    sections: [
      {
        body: [
          "Portugal has around 250 native grape varieties and has largely stuck with them. That makes its wines distinctive, and often bargains.",
        ],
      },
      {
        heading: "Key styles",
        body: [],
        points: [
          { label: "Port", text: "Sweet and strong: grape spirit is added mid-fermentation" },
          { label: "Douro reds", text: "Excellent dry reds from Touriga Nacional and Tinta Roriz" },
          { label: "Vinho Verde", text: "Light, zippy, often slightly fizzy whites" },
          { label: "Madeira", text: "Fortified and heated as it ages, so it's nearly indestructible" },
        ],
        tip: "\"Portuguese Red\" is one of the best-value categories in the catalog. Try one.",
      },
    ],
    quiz: [
      {
        q: "Port comes from which valley?",
        options: ["Douro", "Loire", "Napa", "Mosel"],
        answer: 0,
        why: "Port is made from grapes grown in the Douro Valley.",
      },
      {
        q: "Why is Port sweet?",
        options: ["Sugar is added at bottling", "Grape spirit stops fermentation early", "It's made from raisins", "It's aged in honey barrels"],
        answer: 1,
        why: "The spirit kills the yeast before all the sugar is used up.",
      },
      {
        q: "Vinho Verde is usually…",
        options: ["Light and zippy", "Heavy and oaky", "Very sweet", "A red dessert wine"],
        answer: 0,
        why: "Vinho Verde is fresh, low in alcohol and often slightly sparkling.",
      },
    ],
    tasteIt: { country: "Portugal", label: "Top-rated Portuguese wines" },
    findNear: { type: "shop", label: "Find a wine shop near you" },
    ask: "Recommend a dry red from the Douro and explain how it differs from Port.",
  },
]
