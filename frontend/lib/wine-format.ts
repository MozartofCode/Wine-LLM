/**
 * Wine titles in this dataset follow "Winery Vintage Name (Appellation)", and
 * the appellation is already shown separately as the region. Stripping it
 * keeps card titles short enough to avoid getting cut off mid-word.
 */
export function shortWineTitle(title: string): string {
  return title.replace(/\s*\([^()]*(?:\([^()]*\)[^()]*)*\)\s*$/, "").trim() || title
}
