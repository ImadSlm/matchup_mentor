import Anthropic from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export default async function handler(req, res) {
  const { myChamp, enemyTeam, patch } = req.body

  // Validation
  if (!myChamp || !enemyTeam || enemyTeam.length !== 5) {
    return res.status(400).json({
      error: "Veuillez fournir votre champion et 5 champions adverses",
    })
  }

  const useSimulation = !process.env.ANTHROPIC_API_KEY || false

  if (useSimulation) {
    // Mode simulation
    const generateSimulatedTeamResponse = (myChamp, enemyTeam, patch) => {
      const teamRoles = ["Top", "Jungle", "Mid", "ADC", "Support"]
      const difficultyLevels = [
        "facile",
        "moyen",
        "difficile",
        "très difficile",
        "extrêmement difficile",
      ]
      const strategies = [
        "focus sur les teamfights groupés",
        "exploiter les picks solitaires",
        "contrôler la map",
        "farm en sécurité",
        "chercher les pickoffs",
      ]

      let teamAnalysis = `**ANALYSE COMPLÈTE - ${myChamp} vs Équipe adverse (Patch ${patch})**\n\n`
      teamAnalysis += `**Tableau de Matchups :**\n\n`

      enemyTeam.forEach((champ, index) => {
        const difficulty =
          difficultyLevels[Math.floor(Math.random() * difficultyLevels.length)]
        teamAnalysis += `${teamRoles[index]}: ${champ} - Matchup ${difficulty}\n`
      })

      teamAnalysis += `\n**Stratégie Générale :**\n`
      const randomStrategy =
        strategies[Math.floor(Math.random() * strategies.length)]
      teamAnalysis += `• ${randomStrategy}\n`
      teamAnalysis += `• Évitez les combats contre ${enemyTeam[Math.floor(Math.random() * 5)]}\n`
      teamAnalysis += `• Profitez des faiblesses de ${enemyTeam[Math.floor(Math.random() * 5)]}\n`
      teamAnalysis += `• Coordination cruciale avec votre équipe pour contrer les synergies ennemies\n`

      teamAnalysis += `\n**Compositions de Build recommandées :**\n`
      teamAnalysis += `• Build offensif si vous pouvez kiter leur équipe\n`
      teamAnalysis += `• Build défensif contre les burst damage\n`
      teamAnalysis += `• Items anti-heal si nécessaire\n`

      teamAnalysis += `\n**Points Clés :**\n`
      teamAnalysis += `- Gérez votre positioning en team fights\n`
      teamAnalysis += `- Anticipez les cooldowns ennemis\n`
      teamAnalysis += `- Communiquez avec votre jungle pour les ganks prioritaires\n`
      teamAnalysis += `- Contrôlez la vision des zones clés\n`

      teamAnalysis += `\n*⚡ Analyse générée en mode démonstration - Connectez une clé API Anthropic pour des analyses personnalisées*`

      return teamAnalysis
    }

    const simulatedResponse = generateSimulatedTeamResponse(
      myChamp,
      enemyTeam,
      patch,
    )
    return res.status(200).json({ result: simulatedResponse })
  }

  try {
    const enemyTeamStr = enemyTeam.join(", ")

    const prompt = `Tu es un coach challenger de League of Legends spécialisé dans l'analyse de team fights et de compositions.

Je joue ${myChamp} et je suis face à une équipe composée de: ${enemyTeamStr} (Patch ${patch}).

Fournis une analyse stratégique complète, structurée avec des titres ## et des listes à puces (pas de tableau markdown):
1. La difficulté de chaque matchup, en liste à puces (une puce par champion adverse)
2. Les points forts et faibles de l'équipe adverse
3. Les synergies dangereuses à éviter
4. Une stratégie générale pour gagner les teamfights
5. Recommandations de build et items clés
6. Les moments clés de la partie où tu es fort/faible

Sois concis mais détaillé. Utilise un ton accessible et pratique.`

    const message = await anthropic.messages.create({
      model: "claude-opus-4-1",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    })

    const text =
      message.content[0].type === "text" ? message.content[0].text : ""

    res.status(200).json({ result: text })
  } catch (err) {
    console.error("Erreur Anthropic:", err)

    // Fallback vers simulation
    const simulatedResponse = `**ANALYSE COMPLÈTE - ${myChamp} vs Équipe adverse (Patch ${patch})**

Vous êtes face à une composition équilibrée. Voici votre stratégie:

**Matchups Critiques:**
- Soyez particulièrement attentif aux picks ayant une bonne mobilité
- Cherchez à isoler les cibles vulnérables
- Timing des teamfights crucial

**Stratégie de Victoire:**
- Contrôlez la map en early game
- Évitez les combats groupés si désavantageux
- Focus sur les pickoffs et les rotations
- Échelonnez votre build pour rester relevant

**Points d'Attention:**
- Les cooldowns ennemis sont vos fenêtres d'opportunité
- La vision est votre meilleur allié
- Communiquez constamment avec votre équipe`

    res.status(200).json({ result: simulatedResponse })
  }
}
