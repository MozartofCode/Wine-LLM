import type { Lesson, PlaceType, QuizQuestion } from "./types"

interface Grape {
  slug: string
  name: string
  /** Dataset variety name for the Explorer / "Taste it" strip. */
  variety: string
  color: "red" | "white"
  emoji: string
  profile: NonNullable<Lesson["profile"]>
  aromas: string[]
  signature: string
  homeRegion: string
  places: string
  mapCountries: string[]
  food: string
  intro: string
  story: string
  funFact: string
  findNear: PlaceType
}

const GRAPES: Grape[] = [
  {
    slug: "cabernet-sauvignon",
    name: "Cabernet Sauvignon",
    variety: "Cabernet Sauvignon",
    color: "red",
    emoji: "🍇",
    profile: { body: 5, acidity: 3, tannin: 5, sweetness: 1, alcohol: 4 },
    aromas: ["black currant", "black cherry", "cedar", "graphite", "mint"],
    signature: "Black currant and cedar",
    homeRegion: "Bordeaux",
    places: "Bordeaux's Left Bank, Napa Valley, Coonawarra, Maipo Valley",
    mapCountries: ["France", "US", "Australia", "Chile"],
    food: "Steak, lamb chops, aged cheddar",
    intro: "The world's most widely planted red grape: deep, structured and built to age.",
    story: "Cabernet Sauvignon is a natural cross of Cabernet Franc and Sauvignon Blanc that happened in 17th-century France. Its thick skins give it dark color and firm tannins, which is why it's often softened with Merlot or aged in oak.",
    funFact: "DNA testing in the 1990s revealed Cabernet's parents, Cabernet Franc and Sauvignon Blanc.",
    findNear: "restaurant",
  },
  {
    slug: "merlot",
    name: "Merlot",
    variety: "Merlot",
    color: "red",
    emoji: "🍇",
    profile: { body: 4, acidity: 3, tannin: 3, sweetness: 1, alcohol: 4 },
    aromas: ["plum", "black cherry", "chocolate", "bay leaf", "vanilla"],
    signature: "Plum and chocolate",
    homeRegion: "Pomerol",
    places: "Bordeaux's Right Bank (Pomerol, Saint-Émilion), Washington State, Tuscany",
    mapCountries: ["France", "US", "Italy"],
    food: "Roast chicken, pork, mushroom dishes",
    intro: "Plush, round and generous: Cabernet's softer, friendlier partner.",
    story: "Merlot ripens earlier than Cabernet and has softer tannins, so it rounds out Bordeaux blends. On the Right Bank it's the star, behind some of the world's most expensive wines.",
    funFact: "Merlot's sales dipped in the US after the 2004 film Sideways mocked it, even though one of the most famous Bordeaux, Pétrus, is almost all Merlot.",
    findNear: "shop",
  },
  {
    slug: "pinot-noir",
    name: "Pinot Noir",
    variety: "Pinot Noir",
    color: "red",
    emoji: "🍒",
    profile: { body: 2, acidity: 4, tannin: 2, sweetness: 1, alcohol: 3 },
    aromas: ["red cherry", "raspberry", "mushroom", "forest floor", "rose"],
    signature: "Red cherry and forest floor",
    homeRegion: "Burgundy",
    places: "Burgundy, Oregon's Willamette Valley, Sonoma Coast, Central Otago, Champagne",
    mapCountries: ["France", "US", "New Zealand", "Germany"],
    food: "Salmon, duck, roast mushrooms",
    intro: "Light, silky and thin-skinned, and maddeningly expressive of where it grows.",
    story: "Pinot Noir is fussy: it needs a cool climate and a careful grower. In return it can be the most haunting, perfumed red wine on earth. It's also one of the main grapes in Champagne.",
    funFact: "Pinot Noir is so genetically unstable that it has spawned mutations like Pinot Gris and Pinot Blanc.",
    findNear: "bar",
  },
  {
    slug: "syrah",
    name: "Syrah / Shiraz",
    variety: "Syrah",
    color: "red",
    emoji: "🫐",
    profile: { body: 5, acidity: 3, tannin: 4, sweetness: 1, alcohol: 4 },
    aromas: ["blackberry", "black pepper", "smoked meat", "olive", "violet"],
    signature: "Blackberry and black pepper",
    homeRegion: "Northern Rhône",
    places: "Northern Rhône (Hermitage, Côte-Rôtie), Barossa Valley, Washington State",
    mapCountries: ["France", "Australia", "US"],
    food: "Barbecue, lamb, peppered steak",
    intro: "Dark and savory in France, lush and ripe as Australian Shiraz. Same grape, two personalities.",
    story: "In the cool northern Rhône, Syrah is peppery, meaty and floral. In sunny South Australia, where it's called Shiraz, it turns into rich blackberry jam with chocolate.",
    funFact: "The peppery aroma comes from a compound called rotundone, the same one found in black peppercorns.",
    findNear: "shop",
  },
  {
    slug: "grenache",
    name: "Grenache / Garnacha",
    variety: "Grenache",
    color: "red",
    emoji: "🍓",
    profile: { body: 3, acidity: 2, tannin: 2, sweetness: 1, alcohol: 5 },
    aromas: ["strawberry", "raspberry", "dried herbs", "white pepper", "orange peel"],
    signature: "Ripe strawberry and dried herbs",
    homeRegion: "Châteauneuf-du-Pape",
    places: "Southern Rhône, Spain (Priorat, Campo de Borja), Sardinia, McLaren Vale",
    mapCountries: ["France", "Spain", "Italy", "Australia"],
    food: "Grilled sausages, roast vegetables, paella",
    intro: "Juicy, warm and generous: the heart of many southern French and Spanish reds.",
    story: "Grenache loves heat and wind and makes high-alcohol, low-tannin wines full of red fruit. It's the main grape in Châteauneuf-du-Pape and in many great-value Spanish Garnachas.",
    funFact: "Grenache is the backbone of many Provence rosés.",
    findNear: "shop",
  },
  {
    slug: "tempranillo",
    name: "Tempranillo",
    variety: "Tempranillo",
    color: "red",
    emoji: "🍷",
    profile: { body: 4, acidity: 3, tannin: 4, sweetness: 1, alcohol: 4 },
    aromas: ["cherry", "dried fig", "leather", "tobacco", "dill"],
    signature: "Cherry, leather and tobacco",
    homeRegion: "Rioja",
    places: "Rioja, Ribera del Duero, Toro, Portugal's Douro (as Tinta Roriz)",
    mapCountries: ["Spain", "Portugal"],
    food: "Tapas, roast lamb, chorizo",
    intro: "Spain's great red grape, at its best after a few years in oak.",
    story: "The name comes from temprano, \"early\", because it ripens early. In Rioja it's often aged in American oak, which adds the classic vanilla and dill notes. Labels such as Crianza, Reserva and Gran Reserva tell you how long it aged.",
    funFact: "In Portugal, Tempranillo is called Tinta Roriz and is one of the grapes used for Port.",
    findNear: "restaurant",
  },
  {
    slug: "sangiovese",
    name: "Sangiovese",
    variety: "Sangiovese",
    color: "red",
    emoji: "🍅",
    profile: { body: 3, acidity: 5, tannin: 4, sweetness: 1, alcohol: 3 },
    aromas: ["sour cherry", "tomato leaf", "dried herbs", "leather", "balsamic"],
    signature: "Sour cherry and tomato leaf",
    homeRegion: "Chianti",
    places: "Tuscany (Chianti, Brunello di Montalcino, Vino Nobile di Montepulciano)",
    mapCountries: ["Italy"],
    food: "Pizza, pasta with tomato sauce, bistecca",
    intro: "Italy's most planted grape: tangy, savory and made for the dinner table.",
    story: "Sangiovese has bright acidity and firm tannin, a perfect match for tomato-based dishes. Chianti Classico and Brunello di Montalcino are its two most famous expressions.",
    funFact: "The name is often said to come from sanguis Jovis, Latin for \"blood of Jupiter\".",
    findNear: "restaurant",
  },
  {
    slug: "nebbiolo",
    name: "Nebbiolo",
    variety: "Nebbiolo",
    color: "red",
    emoji: "🌹",
    profile: { body: 4, acidity: 5, tannin: 5, sweetness: 1, alcohol: 4 },
    aromas: ["rose", "tar", "cherry", "licorice", "truffle"],
    signature: "Tar and roses",
    homeRegion: "Barolo",
    places: "Piedmont (Barolo, Barbaresco, Langhe)",
    mapCountries: ["Italy"],
    food: "Truffle pasta, braised beef, aged cheese",
    intro: "Pale in the glass, ferocious on the palate: the grape behind Barolo and Barbaresco.",
    story: "Nebbiolo looks light but has huge tannin and acidity, which is why top Barolo needs years to soften. Its aroma of \"tar and roses\" is one of the most famous descriptions in wine.",
    funFact: "The name probably comes from nebbia, Italian for fog, which settles over Piedmont's hills at harvest time.",
    findNear: "shop",
  },
  {
    slug: "malbec",
    name: "Malbec",
    variety: "Malbec",
    color: "red",
    emoji: "🏔️",
    profile: { body: 5, acidity: 3, tannin: 4, sweetness: 1, alcohol: 4 },
    aromas: ["blackberry", "plum", "violet", "cocoa", "sweet tobacco"],
    signature: "Plum and violet",
    homeRegion: "Mendoza",
    places: "Mendoza, Cahors in southwest France",
    mapCountries: ["Argentina", "France"],
    food: "Grilled steak, empanadas, chimichurri",
    intro: "Inky, plush and velvety, and Argentina's calling card.",
    story: "Malbec was once a Bordeaux blending grape, and it's still the main grape of France's \"black wine\" of Cahors. It found its true home in the high-altitude vineyards of Mendoza, where intense sun and cool nights make it lush yet fresh.",
    funFact: "Argentina celebrates Malbec World Day every April 17.",
    findNear: "restaurant",
  },
  {
    slug: "zinfandel",
    name: "Zinfandel",
    variety: "Zinfandel",
    color: "red",
    emoji: "🫐",
    profile: { body: 4, acidity: 3, tannin: 3, sweetness: 2, alcohol: 5 },
    aromas: ["blackberry jam", "raspberry", "black pepper", "cinnamon", "smoke"],
    signature: "Jammy blackberry and spice",
    homeRegion: "Sonoma",
    places: "California (Sonoma, Lodi, Paso Robles), Puglia (as Primitivo)",
    mapCountries: ["US", "Italy"],
    food: "Barbecue ribs, burgers, pizza",
    intro: "California's heritage grape: jammy, spicy and often boldly alcoholic.",
    story: "Zinfandel ripens unevenly, so a single bunch can hold raisins and green berries side by side. Some California vineyards have vines more than a century old. It's genetically the same as Italy's Primitivo, with roots in Croatia.",
    funFact: "\"White Zinfandel\", the pink, sweet style, was once among the best-selling wines in America.",
    findNear: "shop",
  },
  {
    slug: "chardonnay",
    name: "Chardonnay",
    variety: "Chardonnay",
    color: "white",
    emoji: "🍋",
    profile: { body: 4, acidity: 3, tannin: 1, sweetness: 1, alcohol: 4 },
    aromas: ["yellow apple", "lemon", "butter", "vanilla", "toasted nuts"],
    signature: "Apple, butter and toast",
    homeRegion: "Burgundy",
    places: "Burgundy (Chablis, Meursault), Champagne, California, Australia",
    mapCountries: ["France", "US", "Australia"],
    food: "Roast chicken, lobster, creamy pasta",
    intro: "The chameleon: lean and mineral in Chablis, rich and buttery in California.",
    story: "Chardonnay doesn't have a strong flavor of its own, so it shows off its climate and winemaking. Oak and malolactic fermentation add butter and vanilla; unoaked versions taste of crisp apple and lemon.",
    funFact: "Blanc de Blancs Champagne is usually 100% Chardonnay.",
    findNear: "shop",
  },
  {
    slug: "sauvignon-blanc",
    name: "Sauvignon Blanc",
    variety: "Sauvignon Blanc",
    color: "white",
    emoji: "🌱",
    profile: { body: 2, acidity: 5, tannin: 1, sweetness: 1, alcohol: 3 },
    aromas: ["grapefruit", "passion fruit", "cut grass", "gooseberry", "flint"],
    signature: "Grapefruit and cut grass",
    homeRegion: "Marlborough",
    places: "Loire Valley (Sancerre, Pouilly-Fumé), Marlborough, Bordeaux",
    mapCountries: ["France", "New Zealand", "Chile", "South Africa"],
    food: "Goat cheese, oysters, green salads",
    intro: "Zesty, herbal and aromatic: the crisp white that made New Zealand famous.",
    story: "In the Loire it's flinty and restrained; in Marlborough it bursts with passion fruit and grapefruit. In Bordeaux it's blended with Sémillon, including in the sweet wines of Sauternes.",
    funFact: "The grassy aroma comes from compounds called pyrazines, also found in green bell peppers.",
    findNear: "bar",
  },
  {
    slug: "riesling",
    name: "Riesling",
    variety: "Riesling",
    color: "white",
    emoji: "🍏",
    profile: { body: 2, acidity: 5, tannin: 1, sweetness: 3, alcohol: 2 },
    aromas: ["lime", "green apple", "white peach", "honey", "petrol"],
    signature: "Lime, peach and (with age) petrol",
    homeRegion: "Mosel",
    places: "Germany (Mosel, Rheingau), Alsace, Austria, Clare and Eden Valleys",
    mapCountries: ["Germany", "France", "Austria", "Australia"],
    food: "Thai and Indian food, pork, smoked fish",
    intro: "Electric acidity, from bone dry to lusciously sweet, and it ages beautifully.",
    story: "Riesling ranges from razor-dry to dessert-sweet, but always has high acidity that keeps it fresh. In Germany, words like Kabinett, Spätlese and Auslese tell you how ripe the grapes were at harvest.",
    funFact: "Aged Riesling can develop a distinctive \"petrol\" aroma, which many fans love.",
    findNear: "shop",
  },
  {
    slug: "pinot-gris",
    name: "Pinot Gris / Grigio",
    variety: "Pinot Gris",
    color: "white",
    emoji: "🍐",
    profile: { body: 2, acidity: 3, tannin: 1, sweetness: 2, alcohol: 3 },
    aromas: ["pear", "green apple", "lemon", "almond", "honeysuckle"],
    signature: "Pear and lemon",
    homeRegion: "Alsace",
    places: "Northeast Italy (as Pinot Grigio), Alsace, Oregon",
    mapCountries: ["Italy", "France", "US"],
    food: "Light seafood, risotto, antipasti",
    intro: "One grape, two styles: crisp Italian Pinot Grigio or rich, spicy Alsace Pinot Gris.",
    story: "Pinot Gris is a pink-skinned mutation of Pinot Noir. Italian Pinot Grigio is light and refreshing; Alsace Pinot Gris is fuller, honeyed and sometimes slightly sweet.",
    funFact: "Leave the juice on the grape's pinkish skins and you get a coppery \"ramato\" wine, a tradition in Friuli.",
    findNear: "bar",
  },
  {
    slug: "chenin-blanc",
    name: "Chenin Blanc",
    variety: "Chenin Blanc",
    color: "white",
    emoji: "🍯",
    profile: { body: 3, acidity: 5, tannin: 1, sweetness: 2, alcohol: 3 },
    aromas: ["quince", "baked apple", "honey", "chamomile", "wet wool"],
    signature: "Quince, apple and honey",
    homeRegion: "Vouvray",
    places: "Loire Valley (Vouvray, Savennières), South Africa",
    mapCountries: ["France", "South Africa"],
    food: "Pork with apples, Thanksgiving dinner, spicy Asian dishes",
    intro: "The Loire's versatile genius: sparkling, dry, off-dry or sweet, always with bright acidity.",
    story: "Chenin Blanc is made in every style, from bubbly to luscious dessert wine. South Africa has more Chenin than anywhere else, often called Steen there, and makes some of the best-value whites in the world.",
    funFact: "Top sweet Chenin Blancs from the Loire can age for decades.",
    findNear: "shop",
  },
]

const REGION_DECOYS: Record<string, [string, string, string]> = {
  "cabernet-sauvignon": ["Mosel", "Chablis", "Vouvray"],
  merlot: ["Mosel", "Marlborough", "Rioja"],
  "pinot-noir": ["Barossa Valley", "Mendoza", "Rioja"],
  syrah: ["Mosel", "Chablis", "Marlborough"],
  grenache: ["Mosel", "Marlborough", "Chablis"],
  tempranillo: ["Mosel", "Marlborough", "Burgundy"],
  sangiovese: ["Mosel", "Mendoza", "Marlborough"],
  nebbiolo: ["Mendoza", "Marlborough", "Rioja"],
  malbec: ["Mosel", "Chianti", "Marlborough"],
  zinfandel: ["Mosel", "Burgundy", "Marlborough"],
  chardonnay: ["Mosel", "Rioja", "Barolo"],
  "sauvignon-blanc": ["Barolo", "Rioja", "Mosel"],
  riesling: ["Barolo", "Rioja", "Mendoza"],
  "pinot-gris": ["Barolo", "Rioja", "Mendoza"],
  "chenin-blanc": ["Barolo", "Mendoza", "Rioja"],
}

function level(n: number): string {
  return n <= 2 ? "Low" : n === 3 ? "Medium" : "High"
}

function buildQuiz(g: Grape): QuizQuestion[] {
  // Distractors come from grapes of the other color, so they're clearly wrong.
  const others = GRAPES.filter((o) => o.color !== g.color)
  const pick = (n: number, salt: number) =>
    Array.from({ length: n }, (_, i) => others[(g.slug.length * 7 + salt + i * 3) % others.length])

  const aromaOptions = [g.signature, ...pick(3, 1).map((o) => o.signature)]
  // Hand-picked wrong answers: places clearly not known for this grape.
  const regionOptions = [g.homeRegion, ...REGION_DECOYS[g.slug]]
  const structureKey = g.color === "red" ? "tannin" : "acidity"
  const structureValue = level(g.profile[structureKey])

  const rotate = <T,>(arr: T[], by: number) => [...arr.slice(by % arr.length), ...arr.slice(0, by % arr.length)]
  const r1 = g.slug.length % 4
  const r2 = (g.slug.length + 1) % 4
  const aroma = rotate(Array.from(new Set(aromaOptions)), r1)
  const region = rotate(Array.from(new Set(regionOptions)), r2)

  return [
    {
      q: `Which description best fits ${g.name}?`,
      options: aroma,
      answer: aroma.indexOf(g.signature),
      why: `${g.name} is known for ${g.aromas.slice(0, 3).join(", ")}.`,
    },
    {
      q: `Which place is especially famous for ${g.name}?`,
      options: region,
      answer: region.indexOf(g.homeRegion),
      why: `Classic ${g.name} comes from ${g.places}.`,
    },
    {
      q: `How much ${structureKey} does ${g.name} usually have?`,
      options: ["Low", "Medium", "High"],
      answer: ["Low", "Medium", "High"].indexOf(structureValue),
      why: `${g.name} typically has ${structureValue.toLowerCase()} ${structureKey}.`,
    },
  ]
}

export const GRAPE_LESSONS: Lesson[] = GRAPES.map((g) => ({
  slug: g.slug,
  track: "grapes",
  title: g.name,
  minutes: 3,
  level: "Beginner",
  emoji: g.emoji,
  summary: g.intro,
  profile: g.profile,
  mapCountries: g.mapCountries,
  sections: [
    {
      heading: "At a glance",
      body: [],
      points: [
        { label: "Tastes like", text: g.aromas.join(", ") },
        { label: "Grows in", text: g.places },
        { label: "Eat it with", text: g.food },
      ],
    },
    { heading: "The story", body: [g.story], tip: g.funFact },
  ],
  quiz: buildQuiz(g),
  tasteIt: { variety: g.variety, label: `Top-rated ${g.name.split(" /")[0]} from the catalog` },
  findNear: { type: g.findNear, label: `Find ${g.name.split(" /")[0]} near you` },
  ask: `Recommend a great-value ${g.name.split(" /")[0]} and tell me what makes it a good example of the grape.`,
}))

/** Map from dataset variety name to grape lesson slug (for cross-links). */
export const VARIETY_TO_GRAPE_SLUG: Record<string, string> = Object.fromEntries(
  GRAPES.flatMap((g) => {
    const extra: [string, string][] = []
    if (g.slug === "syrah") extra.push(["Shiraz", g.slug])
    if (g.slug === "pinot-gris") extra.push(["Pinot Grigio", g.slug])
    if (g.slug === "grenache") extra.push(["Garnacha", g.slug])
    return [[g.variety, g.slug] as [string, string], ...extra]
  }),
)
