import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

export default async function handler(req, res) {
  const { champ1, champ2, patch } = req.body

  // Mode simulation temporaire (remplacez par l'appel Gemini une fois la clé configurée)
  if (false) {
    // Changez en true pour activer la simulation
    const simulatedResponse = `**TL;DR - ${champ1} vs ${champ2} (Patch ${patch})**

• Surveillez le niveau 2-3 de ${champ2} - pic de puissance critique
• ${champ1} doit jouer défensif en early game
• Priorité aux wards dans les bushes pour éviter les ganks
• Objectif : scale en mid/late game où ${champ1} devient plus fort
• Build défensif recommandé en premier item

**Analyse détaillée :**

Ce matchup demande patience et discipline. ${champ2} a un avantage naturel en phase de lane grâce à son kit de base. Concentrez-vous sur le farm, évitez les trades inutiles et attendez votre window de puissance. La gestion des cooldowns est cruciale - punissez chaque erreur de positioning adverse. En mid-game, ${champ1} commence à briller avec ses items core.`

    return res.status(200).json({ result: simulatedResponse })
  }

  try {
    const prompt = `Tu es un coach challenger de League of Legends qui explique les matchups.

Explique de manière concise le matchup entre ${champ1} et ${champ2} sur le patch ${patch}.

Commence par un TL;DR clair avec des bullet points pratiques (5 max), puis donne une explication détaillée en dessous. Ne dépasse pas 300 mots. Utilise un ton accessible et stratégique.`

    // Essayer avec différents modèles
    let result
    try {
      result = await model.generateContent(prompt)
    } catch (modelError) {
      console.log("Erreur avec gemini-1.5-flash, tentative avec gemini-1.5-pro")
      const fallbackModel = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
      })
      result = await fallbackModel.generateContent(prompt)
    }

    const response = await result.response
    const text = response.text()

    res.status(200).json({ result: text })
  } catch (err) {
    console.error("Erreur Gemini:", err)

    // Fallback vers simulation en cas d'erreur
    const simulatedResponse = `**TL;DR - ${champ1} vs ${champ2} (Patch ${patch})**

• Surveillez le niveau 2-3 de ${champ2} - pic de puissance critique
• ${champ1} doit jouer défensif en early game
• Priorité aux wards dans les bushes pour éviter les ganks
• Objectif : scale en mid/late game où ${champ1} devient plus fort
• Build défensif recommandé en premier item

**Analyse détaillée :**

Ce matchup demande patience et discipline. ${champ2} a un avantage naturel en phase de lane grâce à son kit de base. Concentrez-vous sur le farm, évitez les trades inutiles et attendez votre window de puissance. La gestion des cooldowns est cruciale - punissez chaque erreur de positioning adverse. En mid-game, ${champ1} commence à briller avec ses items core.`

    console.log("Utilisation du fallback de simulation")
    res.status(200).json({ result: simulatedResponse })
  }
}
