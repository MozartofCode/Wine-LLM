import type { QuizQuestion } from "./types"

export interface MakingStep {
  id: string
  emoji: string
  title: string
  season: string
  body: string
  decision: string
}

export const MAKING_STEPS: MakingStep[] = [
  {
    id: "vineyard",
    emoji: "🌱",
    title: "In the vineyard",
    season: "All year",
    body: "Great wine starts outside. Growers prune in winter, protect buds from spring frost and thin leaves and bunches in summer. Fewer bunches per vine usually means more concentrated grapes.",
    decision: "Grow more grapes for volume, or fewer for concentration?",
  },
  {
    id: "harvest",
    emoji: "✂️",
    title: "Harvest",
    season: "Late summer to autumn",
    body: "Picking day is the biggest decision of the year. Pick early and the wine is fresher, lower in alcohol and higher in acidity. Pick late and it's riper, richer and stronger. Sparkling wine grapes are picked earliest of all.",
    decision: "Early for freshness, or late for ripeness?",
  },
  {
    id: "crush",
    emoji: "🦶",
    title: "Crush and press",
    season: "Harvest day",
    body: "Grapes are destemmed and gently crushed to release the juice. For white wine the juice is pressed off the skins straight away. For red wine the skins stay in, because that's where the color and tannin come from. For rosé, the skins stay just a few hours.",
    decision: "How long should the juice touch the skins?",
  },
  {
    id: "ferment",
    emoji: "🫧",
    title: "Fermentation",
    season: "1 to 4 weeks",
    body: "Yeast eats the grape sugar and turns it into alcohol and carbon dioxide. Cool fermentation keeps fruity aromas in whites; warmer fermentation extracts color and tannin from red skins. Stop the yeast early and some sugar remains, making the wine sweet.",
    decision: "Wild yeast or cultured? Ferment until dry, or leave some sweetness?",
  },
  {
    id: "age",
    emoji: "🛢️",
    title: "Aging",
    season: "Months to years",
    body: "Stainless steel keeps wine fresh and fruity. Oak barrels let in tiny amounts of oxygen and add flavors of vanilla, toast and spice, especially new barrels. Some wines also rest on their spent yeast (lees) for extra creaminess.",
    decision: "Steel or oak? New barrels or old?",
  },
  {
    id: "bottle",
    emoji: "🍾",
    title: "Blending and bottling",
    season: "When it's ready",
    body: "The winemaker tastes barrels and tanks and blends them into the final wine. It may be filtered for clarity, then bottled under cork or screw cap. Some wines are ready right away; others need years in the bottle.",
    decision: "Drink now, or cellar for later?",
  },
]

export const MAKING_QUIZ: QuizQuestion[] = [
  {
    q: "Where does red wine get its color?",
    options: ["Red juice", "Grape skins", "Oak barrels", "Added coloring"],
    answer: 1,
    why: "Almost all grape juice is clear. Color comes from soaking with the skins.",
  },
  {
    q: "During fermentation, yeast turns sugar into…",
    options: ["Acid and water", "Alcohol and carbon dioxide", "Tannin", "Vinegar"],
    answer: 1,
    why: "That CO2 is also what makes bubbles in sparkling wine.",
  },
  {
    q: "Harvesting grapes earlier usually gives a wine that is…",
    options: ["Fresher and lower in alcohol", "Sweeter and stronger", "Darker", "More tannic"],
    answer: 0,
    why: "Less ripe grapes have more acid and less sugar to turn into alcohol.",
  },
]

/** Options for the "Make your own wine" simulator. */
export const SIM_GRAPES = [
  { id: "Pinot Noir", color: "red", base: { body: 2, acidity: 4, tannin: 2, fruit: "red cherry and raspberry" } },
  { id: "Cabernet Sauvignon", color: "red", base: { body: 4, acidity: 3, tannin: 5, fruit: "black currant and cedar" } },
  { id: "Syrah", color: "red", base: { body: 4, acidity: 3, tannin: 4, fruit: "blackberry and black pepper" } },
  { id: "Sangiovese", color: "red", base: { body: 3, acidity: 5, tannin: 4, fruit: "sour cherry and dried herbs" } },
  { id: "Chardonnay", color: "white", base: { body: 3, acidity: 3, tannin: 1, fruit: "apple and lemon" } },
  { id: "Sauvignon Blanc", color: "white", base: { body: 2, acidity: 5, tannin: 1, fruit: "grapefruit and fresh-cut grass" } },
  { id: "Riesling", color: "white", base: { body: 2, acidity: 5, tannin: 1, fruit: "lime and white peach" } },
] as const

export const SIM_CLIMATES = [
  { id: "cool", label: "Cool", hint: "Like Burgundy or Oregon", body: -1, acidity: 1, words: "crisp, cool-climate" },
  { id: "moderate", label: "Moderate", hint: "Like Bordeaux or Tuscany", body: 0, acidity: 0, words: "balanced" },
  { id: "warm", label: "Warm", hint: "Like Napa or Barossa", body: 1, acidity: -1, words: "ripe, sun-drenched" },
] as const

export const SIM_HARVEST = [
  { id: "early", label: "Early", body: -1, acidity: 1, sweetness: 0, words: "fresh and zesty" },
  { id: "normal", label: "On time", body: 0, acidity: 0, sweetness: 0, words: "ripe" },
  { id: "late", label: "Late", body: 1, acidity: -1, sweetness: 1, words: "rich and concentrated" },
] as const

export const SIM_SKIN = [
  { id: "none", label: "None", hint: "Pressed right away", tannin: -2, words: "" },
  { id: "short", label: "Short", hint: "A few hours to days", tannin: -1, words: "" },
  { id: "long", label: "Long", hint: "Weeks on the skins", tannin: 1, words: "structured, firm tannins" },
] as const

export const SIM_OAK = [
  { id: "steel", label: "Steel tank", body: 0, words: "unoaked, pure fruit" },
  { id: "old", label: "Old oak", body: 0, words: "subtle spice from older barrels" },
  { id: "new", label: "New oak", body: 1, words: "vanilla, toast and baking spice from new oak" },
] as const

export const SIM_AGING = [
  { id: "young", label: "Release young", words: "youthful and vibrant" },
  { id: "some", label: "A couple of years", words: "developing some savory complexity" },
  { id: "long", label: "Many years", words: "aged notes of leather, dried fruit and earth" },
] as const
