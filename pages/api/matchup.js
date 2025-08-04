import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

export default async function handler(req, res) {
  const { champ1, champ2, patch } = req.body

  // Mode simulation temporaire (remplacez par l'appel Gemini une fois la clé configurée)
  // Active la simulation si pas de clé API ou si forcé
  const useSimulation = !process.env.GEMINI_API_KEY || false
  if (useSimulation) {
    // Mode simulation activé automatiquement

    // Générer une réponse variée basée sur les champions
    const generateSimulatedResponse = (champ1, champ2, patch) => {
      const strategies = [
        "jouer défensif en early game",
        "rechercher les trades courts",
        "prioriser le farm et la vision",
        "jouer agressif niveau 2-3",
        "éviter les fights prolongés",
      ]

      const phases = [
        "early game critique",
        "mid-game décisif",
        "late game avantageux",
        "phase de lane difficile",
        "teamfights favorables",
      ]

      const items = [
        "build défensif",
        "items de sustain",
        "build burst",
        "items de mobilité",
        "build anti-heal",
      ]

      const randomStrategy =
        strategies[Math.floor(Math.random() * strategies.length)]
      const randomPhase = phases[Math.floor(Math.random() * phases.length)]
      const randomItem = items[Math.floor(Math.random() * items.length)]

      return `**TL;DR - ${champ1} vs ${champ2} (Patch ${patch})**

• ${
        randomStrategy.charAt(0).toUpperCase() + randomStrategy.slice(1)
      } pour maximiser vos chances
• Surveillez les pics de puissance de ${champ2} - moments critiques
• Priorité aux wards dans les zones clés pour éviter les ganks
• ${randomPhase.charAt(0).toUpperCase() + randomPhase.slice(1)} pour ${champ1}
• ${randomItem.charAt(0).toUpperCase() + randomItem.slice(1)} recommandé

**Analyse détaillée :**

Ce matchup demande une approche stratégique adaptée. ${champ2} présente des défis spécifiques qu'il faut anticiper dès la phase de draft. Pour ${champ1}, l'objectif est de maximiser les fenêtres d'opportunité tout en minimisant les risques.

**Conseils pratiques :**
- Gérez vos cooldowns avec précision
- Punissez chaque erreur de positioning adverse  
- Adaptez votre build selon l'évolution de la partie
- Coordonnez avec votre jungle pour les objectifs clés

La clé du succès réside dans la patience et l'exécution. Chaque décision compte dans ce matchup !

*⚡ Analyse générée en mode démonstration - Connectez une clé API Gemini pour des analyses personnalisées*`
    }

    const simulatedResponse = generateSimulatedResponse(champ1, champ2, patch)

    return res.status(200).json({ result: simulatedResponse })
  }

  try {
    const prompt = `Tu es un coach challenger de League of Legends qui explique les matchups.

Explique de manière concise le matchup entre ${champ1} et ${champ2} sur le patch ${patch}.

Commence par un résumé clair avec des bullet points pratiques (5 max), puis donne une explication détaillée en dessous. Ne dépasse pas 300 mots. Utilise un ton accessible et stratégique.`

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
