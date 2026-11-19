import type { QuizQuestion } from "./types"

export interface Era {
  id: string
  year: number
  label: string
  title: string
  emoji: string
  story: string
  /** Explorer link for "drink this era". */
  drink: { label: string; variety?: string; country?: string }
}

export const ERAS: Era[] = [
  {
    id: "georgia",
    year: -6000,
    label: "c. 6000 BC",
    title: "The first wine",
    emoji: "🏺",
    story: "Chemical traces in pottery from Georgia, in the South Caucasus, show people making grape wine around 8,000 years ago. Georgians still ferment wine in big clay jars called qvevri buried in the ground, a tradition recognized by UNESCO.",
    drink: { label: "Wines from Georgia", country: "Georgia" },
  },
  {
    id: "armenia",
    year: -4000,
    label: "c. 4000 BC",
    title: "The oldest winery",
    emoji: "⛰️",
    story: "In the Areni-1 cave in Armenia, archaeologists found a grape press, fermentation jars and drinking cups about 6,000 years old: the oldest known winery.",
    drink: { label: "Wines from Armenia", country: "Armenia" },
  },
  {
    id: "egypt",
    year: -3000,
    label: "c. 3000 BC",
    title: "Wine for the pharaohs",
    emoji: "🏛️",
    story: "Egyptian wine was a drink for the elite and for the gods. Jars were labeled with the vineyard, the year and the winemaker, much like a modern label, and Tutankhamun was buried with jars of wine.",
    drink: { label: "Wines from the eastern Mediterranean", country: "Lebanon" },
  },
  {
    id: "greece",
    year: -500,
    label: "c. 500 BC",
    title: "Greeks and the symposium",
    emoji: "🍶",
    story: "Ancient Greeks mixed wine with water in a large bowl called a krater; drinking it neat was considered barbaric. Their symposia were part drinking party, part philosophy seminar. Greek traders carried vines across the Mediterranean.",
    drink: { label: "Greek wines", country: "Greece" },
  },
  {
    id: "rome",
    year: 100,
    label: "c. AD 100",
    title: "Rome plants Europe",
    emoji: "🛡️",
    story: "Romans spread vineyards across their empire, into what are now France, Spain, Germany and Portugal. Many of today's great regions, including Bordeaux, the Rhône and the Mosel, began as Roman vineyards.",
    drink: { label: "Italian wines", country: "Italy" },
  },
  {
    id: "monks",
    year: 1100,
    label: "1100s",
    title: "Monks map Burgundy",
    emoji: "⛪",
    story: "Through the Middle Ages, monasteries kept winemaking alive. Cistercian monks in Burgundy spent centuries noting which plots made the best wine, the origin of Burgundy's famous vineyard map.",
    drink: { label: "Burgundy's Pinot Noir", variety: "Pinot Noir", country: "France" },
  },
  {
    id: "champagne",
    year: 1700,
    label: "1700s",
    title: "Bubbles take off",
    emoji: "🥂",
    story: "Fizzy wine was once considered a fault. Stronger English glass bottles helped it survive the pressure, and the Champagne houses turned it into a luxury. Dom Pérignon didn't invent Champagne, but he was a brilliant blender.",
    drink: { label: "Sparkling wines", variety: "Champagne Blend" },
  },
  {
    id: "classification",
    year: 1855,
    label: "1855",
    title: "Bordeaux gets ranked",
    emoji: "📜",
    story: "For the Paris Exposition, Bordeaux's brokers ranked the top red wines into five \"growths\" by price and reputation. The list has barely changed since.",
    drink: { label: "Bordeaux-style reds", variety: "Bordeaux-style Red Blend" },
  },
  {
    id: "phylloxera",
    year: 1863,
    label: "1860s",
    title: "Phylloxera",
    emoji: "🐛",
    story: "A tiny insect from North America began killing vines in France. Over the next decades it devastated most of Europe's vineyards. The rescue: grafting European vines onto resistant American rootstock, still standard practice today.",
    drink: { label: "Chilean wines (never hit by phylloxera)", country: "Chile" },
  },
  {
    id: "prohibition",
    year: 1920,
    label: "1920–1933",
    title: "Prohibition",
    emoji: "🚫",
    story: "The United States banned alcohol for 13 years. Some wineries survived by making sacramental wine or selling grape juice concentrate. It took the American wine industry decades to recover.",
    drink: { label: "Zinfandel, a survivor", variety: "Zinfandel", country: "US" },
  },
  {
    id: "paris",
    year: 1976,
    label: "1976",
    title: "The Judgment of Paris",
    emoji: "⚖️",
    story: "In a blind tasting, French judges preferred a California Chardonnay and a California Cabernet over top French wines. The New World had arrived.",
    drink: { label: "Napa Cabernet", variety: "Cabernet Sauvignon", country: "US" },
  },
  {
    id: "today",
    year: 2000,
    label: "2000s to today",
    title: "Wine goes global",
    emoji: "🌍",
    story: "Screw caps, natural wine, English sparkling wine, Chinese vineyards and climate change reshaping where grapes can grow: wine is changing faster now than at any point in its history.",
    drink: { label: "English sparkling", country: "England" },
  },
]

export const HISTORY_QUIZ: QuizQuestion[] = [
  {
    q: "Where does the oldest evidence of grape wine come from?",
    options: ["France", "Georgia", "Italy", "Egypt"],
    answer: 1,
    why: "Pottery from Georgia shows winemaking around 6000 BC.",
  },
  {
    q: "What saved Europe's vineyards from phylloxera?",
    options: ["Pesticides", "Grafting onto American rootstock", "Moving vineyards north", "Planting only white grapes"],
    answer: 1,
    why: "American vine roots are resistant to the insect.",
  },
  {
    q: "What did the 1976 Judgment of Paris show?",
    options: ["French wine was unbeatable", "California wines could beat top French wines", "Wine should be served cold", "Champagne was invented"],
    answer: 1,
    why: "It launched the reputation of New World wine.",
  },
]
