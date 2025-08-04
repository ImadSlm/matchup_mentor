export default function ResultDisplay({ champ1, champ2, result }) {
  if (!result) return null

  // Fonction pour parser et structurer le contenu de l'IA
  const parseAnalysis = (text) => {
    const lines = text.split('\n').filter(line => line.trim() !== '')
    const sections = []
    let currentSection = null

    lines.forEach(line => {
      const trimmed = line.trim()
      
      // Détecter les titres de sections (avec des mots-clés)
      if (trimmed.includes('**') || 
          trimmed.toLowerCase().includes('avantage') ||
          trimmed.toLowerCase().includes('conseil') ||
          trimmed.toLowerCase().includes('stratégie') ||
          trimmed.toLowerCase().includes('build') ||
          trimmed.toLowerCase().includes('items') ||
          trimmed.toLowerCase().includes('runes') ||
          trimmed.toLowerCase().includes('phase') ||
          trimmed.toLowerCase().includes('teamfight') ||
          trimmed.toLowerCase().includes('early') ||
          trimmed.toLowerCase().includes('late') ||
          trimmed.toLowerCase().includes('mid game')) {
        
        if (currentSection) {
          sections.push(currentSection)
        }
        currentSection = {
          title: trimmed.replace(/\*\*/g, ''),
          content: []
        }
      } else if (currentSection && trimmed.length > 0) {
        currentSection.content.push(trimmed)
      } else if (!currentSection && trimmed.length > 0) {
        // Première ligne sans section = introduction
        sections.push({
          title: 'Analyse Générale',
          content: [trimmed]
        })
      }
    })

    if (currentSection) {
      sections.push(currentSection)
    }

    return sections.length > 0 ? sections : [{
      title: 'Analyse',
      content: lines
    }]
  }

  const sections = parseAnalysis(result)

  // Fonction pour obtenir l'icône selon le titre
  const getSectionIcon = (title) => {
    const titleLower = title.toLowerCase()
    if (titleLower.includes('avantage') || titleLower.includes('force')) return '💪'
    if (titleLower.includes('conseil') || titleLower.includes('tip')) return '💡'
    if (titleLower.includes('stratégie')) return '🎯'
    if (titleLower.includes('build') || titleLower.includes('items')) return '⚔️'
    if (titleLower.includes('runes')) return '🔮'
    if (titleLower.includes('early') || titleLower.includes('phase')) return '🌅'
    if (titleLower.includes('teamfight')) return '👥'
    if (titleLower.includes('late')) return '🌙'
    return '📝'
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec les champions */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-6">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-300">{champ1}</div>
            <div className="text-sm text-blue-200">Votre champion</div>
          </div>
          
          <div className="text-4xl font-bold text-red-400 mx-6 animate-pulse">
            VS
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-red-300">{champ2}</div>
            <div className="text-sm text-blue-200">Champion adverse</div>
          </div>
        </div>
        
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-full px-4 py-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300 text-sm font-medium">
              Analyse complétée
            </span>
          </div>
        </div>
      </div>

      {/* Sections d'analyse */}
      <div className="grid gap-4">
        {sections.map((section, index) => (
          <div 
            key={index}
            className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-lg p-6 hover:bg-white/15 transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{getSectionIcon(section.title)}</span>
              <h3 className="text-xl font-semibold text-white">
                {section.title}
              </h3>
            </div>
            
            <div className="space-y-3">
              {section.content.map((paragraph, pIndex) => (
                <div key={pIndex} className="text-blue-100 leading-relaxed">
                  {/* Traiter les points de liste */}
                  {paragraph.startsWith('-') || paragraph.startsWith('•') ? (
                    <div className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">•</span>
                      <span>{paragraph.replace(/^[-•]\s*/, '')}</span>
                    </div>
                  ) : (
                    <p>{paragraph}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer avec conseils */}
      <div className="bg-gradient-to-r from-blue-800/30 to-purple-800/30 backdrop-blur-lg rounded-xl border border-white/20 p-4">
        <div className="flex items-center gap-2 text-blue-200">
          <span className="text-lg">💡</span>
          <span className="text-sm">
            Ces conseils sont générés par IA et peuvent varier selon le patch et le meta actuel.
          </span>
        </div>
      </div>
    </div>
  )
}
