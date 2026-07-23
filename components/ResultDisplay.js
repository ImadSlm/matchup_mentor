// Une ligne compte comme titre de section seulement si c'est un vrai heading
// markdown (## / ###) ou une ligne entièrement en gras (**Titre**), jamais une
// simple phrase qui contient du gras au milieu (sinon chaque puce devient sa
// propre section).
const stripOrdinal = (s) => s.replace(/^\d+[.)]\s*/, '')

const parseHeading = (line) => {
  const heading = line.match(/^#{1,4}\s*(.+)/)
  if (heading) return stripOrdinal(heading[1].replace(/\*\*/g, '')).trim()

  const boldOnly = stripOrdinal(line).match(/^\*\*(.+?)\*\*:?$/)
  if (boldOnly) return boldOnly[1].replace(/:$/, '').trim()

  return null
}

// Ligne de séparation de tableau markdown ("|---|---|"), pure décoration à ignorer.
const isTableRule = (line) => /^\|?[-:\s|]+\|?$/.test(line) && line.includes('-')

// Ligne de tableau ("| a | b |") : les modèles en génèrent parfois malgré le
// prompt. Faute de rendu de tableau, on l'aplatit en une puce lisible.
const flattenTableRow = (line) =>
  line
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((cell) => cell.trim())
    .filter(Boolean)
    .join(' — ')

const parseAnalysis = (text) => {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !isTableRule(l))
  const sections = []
  let current = null

  lines.forEach((rawLine) => {
    const line =
      rawLine.startsWith('|') && rawLine.endsWith('|')
        ? flattenTableRow(rawLine)
        : rawLine

    const heading = parseHeading(line)
    if (heading) {
      if (current) sections.push(current)
      current = { title: heading, content: [] }
    } else if (current) {
      current.content.push(line)
    } else {
      current = { title: 'Analyse Générale', content: [line] }
    }
  })

  if (current) sections.push(current)

  return sections.length > 0 ? sections : [{ title: 'Analyse', content: lines }]
}

// Rendu minimal du gras inline (**texte**) sans injecter du HTML brut.
const renderInline = (text) => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/)
    return bold ? (
      <strong key={i} className="text-ink font-semibold">
        {bold[1]}
      </strong>
    ) : (
      part
    )
  })
}

export default function ResultDisplay({ champ1, champ2, result }) {
  if (!result) return null

  const sections = parseAnalysis(result)

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* En-tête avec les champions */}
      <div className="bg-surface rounded-xl border border-border p-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-ink">{champ1}</div>
            <div className="text-xs text-ink-muted">Votre champion</div>
          </div>

          <div className="text-sm font-semibold text-ink-muted mx-4">VS</div>

          <div className="text-center">
            <div className="text-lg font-semibold text-ink">{champ2}</div>
            <div className="text-xs text-ink-muted">Champion adverse</div>
          </div>
        </div>

        <div className="text-center">
          <span className="inline-block bg-surface-2 border border-border rounded-full px-3 py-1 text-ink-muted text-xs font-medium border-green-400 text-green-400">
            Analyse complétée
          </span>
        </div>
      </div>

      {/* Sections d'analyse */}
      <div className="grid gap-3">
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-surface rounded-lg border border-border p-6"
          >
            <h3 className="text-base font-semibold text-ink mb-3">
              {section.title}
            </h3>

            <div className="space-y-2">
              {section.content.map((paragraph, pIndex) => (
                <div key={pIndex} className="text-ink-muted leading-relaxed text-sm">
                  {/* Traiter les points de liste */}
                  {paragraph.startsWith('-') || paragraph.startsWith('•') ? (
                    <div className="flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span>{renderInline(paragraph.replace(/^[-•]\s*/, ''))}</span>
                    </div>
                  ) : (
                    <p>{renderInline(paragraph)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer avec conseils */}
      <div className="border border-border rounded-lg p-4">
        <p className="text-xs text-ink-muted">
          Ces conseils sont générés par IA et peuvent varier selon le patch et la meta actuelle.
        </p>
      </div>
    </div>
  )
}
