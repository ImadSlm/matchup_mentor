import { useState } from "react"
import axios from "axios"
import Loader from "./Loader"
import ResultDisplay from "./ResultDisplay"
import ChampionSelect from "./ChampionSelect"

export default function TeamMatchupAnalyzer({
  patch = "14.8",
  champions = [],
}) {
  const [myChamp, setMyChamp] = useState("")
  const [enemyTeam, setEnemyTeam] = useState(["", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState("")

  const handleEnemyChampChange = (index, value) => {
    const newTeam = [...enemyTeam]
    newTeam[index] = value
    setEnemyTeam(newTeam)
  }

  const handleAnalyze = async (e) => {
    e.preventDefault()
    setError("")

    if (!myChamp.trim()) {
      setError("Veuillez entrer votre champion")
      return
    }

    if (enemyTeam.some((champ) => !champ.trim())) {
      setError("Veuillez remplir tous les champions adverses")
      return
    }

    setLoading(true)

    try {
      const response = await axios.post("/api/teamMatchup", {
        myChamp: myChamp.trim(),
        enemyTeam: enemyTeam.map((c) => c.trim()),
        patch: patch,
      })

      setResult(response.data.result)
    } catch (err) {
      setError(
        err.response?.data?.error || "Erreur lors de l'analyse de l'équipe",
      )
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const teamRoles = ["Top", "Jungle", "Mid", "ADC", "Support"]

  return (
    <div className="bg-surface rounded-xl border border-border p-8">
      <h2 className="text-lg font-semibold text-ink mb-6 text-center">
        Analyse Équipe Complète
      </h2>

      <form onSubmit={handleAnalyze} className="space-y-5">
        {/* Mon champion */}
        <ChampionSelect
          champions={champions}
          value={myChamp}
          onChange={setMyChamp}
          label="Votre Champion"
          patch={patch}
        />

        {/* Équipe adverse */}
        <div>
          <label className="block font-semibold text-sm text-ink mb-3">
            Équipe Adverse
          </label>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {enemyTeam.map((champ, index) => (
              <ChampionSelect
                key={index}
                champions={champions}
                value={champ}
                onChange={(value) => handleEnemyChampChange(index, value)}
                label={teamRoles[index]}
                patch={patch}
              />
            ))}
          </div>
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="p-3 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm">
            {error}
          </div>
        )}

        {/* Bouton d'analyse */}
        <button
          type="submit"
          disabled={loading || !myChamp || enemyTeam.some((champ) => !champ)}
          className="w-full bg-accent-strong hover:bg-accent disabled:bg-surface-2 disabled:text-ink-muted text-accent-ink font-semibold py-3 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed">
          {loading ? "Analyse en cours..." : "Analyser l'Équipe"}
        </button>
      </form>

      {loading && <Loader />}
      {result && (
        <ResultDisplay champ1={myChamp} champ2="Équipe adverse" result={result} />
      )}
    </div>
  )
}
