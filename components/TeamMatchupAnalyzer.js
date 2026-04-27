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
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 shadow-xl border border-slate-700">
      <h2 className="text-2xl font-bold text-amber-400 mb-6">
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
          <label className="block font-bold text-white mb-3">
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
          <div className="p-3 bg-red-900/50 border border-red-600 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Bouton d'analyse */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 rounded-lg transition transform hover:scale-105 disabled:hover:scale-100">
          {loading ? "Analyse en cours..." : "Analyser l'Équipe"}
        </button>
      </form>

      {loading && <Loader />}
      {result && <ResultDisplay result={result} />}
    </div>
  )
}
