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
      setResult("Erreur lors de l'appel à l'IA.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-6">
      {/* Test simple pour vérifier Tailwind */}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            ⚔️ Matchup Mentor
          </h1>
          <p className="text-blue-200">
            Maîtrisez vos matchups League of Legends
          </p>
          <div className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded-full">
            Patch {patch}
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4 text-center">
            Sélectionnez vos champions
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <ChampionSelect
              champions={champions}
              value={champ1}
              onChange={setChamp1}
              label="Premier Champion"
              patch={patch}
            />
            <ChampionSelect
              champions={champions}
              value={champ2}
              onChange={setChamp2}
              label="Champion Adverse"
              patch={patch}
            />
          </div>

          <div className="text-center">
            <button
              onClick={handleSubmit}
              disabled={!champ1 || !champ2 || loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              {loading ? "Analyse en cours..." : "Analyser le matchup"}
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
