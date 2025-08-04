import { useEffect, useState } from "react"
import axios from "axios"
import ChampionSelect from "../components/ChampionSelect"
import ResultDisplay from "../components/ResultDisplay"
import Loader from "../components/Loader"

export default function Home() {
  const [champions, setChampions] = useState([])
  const [patch, setPatch] = useState("")
  const [champ1, setChamp1] = useState("")
  const [champ2, setChamp2] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchChamps = async () => {
      const res = await axios.get("/api/champions")
      setChampions(res.data.champions)
      setPatch(res.data.version)
    }
    fetchChamps()
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    setResult("")
    try {
      const res = await axios.post("/api/matchup", { champ1, champ2, patch })
      setResult(res.data.result)
    } catch (err) {
      setResult("Erreur lors de l’appel à l’IA.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header avec effet glass */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              ⚔️ Matchup Mentor
            </h1>
            <p className="text-blue-200 text-lg">
              Analysez vos matchups en amont et dominez votre lane !
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-green-500/20 border border-green-400/30 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-sm font-medium">
                Patch {patch}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Container principal */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Section de sélection des champions */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            🎯 Sélectionnez vos champions
          </h2>

          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div className="flex-1 w-full">
              <ChampionSelect
                champions={champions}
                value={champ1}
                onChange={setChamp1}
                label="Votre Champion"
                patch={patch}
              />
            </div>

            {/* VS indicator au centre */}
            <div className="flex items-center justify-center md:mt-8">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-full font-bold text-xl shadow-lg animate-pulse">
                VS
              </div>
            </div>

            <div className="flex-1 w-full">
              <ChampionSelect
                champions={champions}
                value={champ2}
                onChange={setChamp2}
                label="Champion Adverse"
                patch={patch}
              />
            </div>
          </div>

          {/* Bouton d'analyse */}
          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={!champ1 || !champ2 || loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 rounded-xl transform transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:opacity-50 shadow-lg">
              {loading ? (
                <span className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Analyse en cours...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  🔍 Analyser le matchup
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Résultats */}
        {loading ? (
          <Loader />
        ) : (
          <ResultDisplay champ1={champ1} champ2={champ2} result={result} />
        )}
      </div>
    </div>
  )
}
