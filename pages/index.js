import { useEffect, useState } from "react"
import axios from "axios"
import ChampionSelect from "../components/ChampionSelect"
import ResultDisplay from "../components/ResultDisplay"
import Loader from "../components/Loader"
import TeamMatchupAnalyzer from "../components/TeamMatchupAnalyzer"

export default function Home() {
  const [champions, setChampions] = useState([])
  const [patch, setPatch] = useState("")
  const [champ1, setChamp1] = useState("")
  const [champ2, setChamp2] = useState("")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("1v1")

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
    <div className="min-h-screen bg-bg">
      <div className="border-b border-border relative">
        <a
          href="https://github.com/Imadslm"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className="absolute top-4 right-6 text-ink-muted hover:text-ink transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6">
            <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.79-.25.79-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
          </svg>
        </a>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-ink mb-2">
              Matchup Mentor
            </h1>
            <p className="text-ink-muted text-base">
              Analysez vos matchups en amont et dominez votre lane
            </p>
            {patch && (
              <div className="mt-4 inline-flex items-center gap-2 bg-surface border border-border rounded-full px-3 py-1 border-blue-400 text-blue-400">
                <span className="text-ink-muted text-xs font-medium">
                  Patch {patch}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Container principal */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Onglets de navigation */}
        <div className="flex gap-2 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab("1v1")}
            className={`px-5 py-3 text-sm font-semibold transition-colors ${
              activeTab === "1v1"
                ? "text-accent border-b-2 border-accent"
                : "text-ink-muted hover:text-ink"
            }`}>
            1v1 Matchup
          </button>
          <button
            onClick={() => setActiveTab("team")}
            className={`px-5 py-3 text-sm font-semibold transition-colors ${
              activeTab === "team"
                ? "text-accent border-b-2 border-accent"
                : "text-ink-muted hover:text-ink"
            }`}>
            Équipe Complète
          </button>
        </div>

        {/* Contenu onglet 1v1 */}
        {activeTab === "1v1" && (
          <>
            {/* Section de sélection des champions */}
            <div className="bg-surface rounded-xl border border-border p-8 mb-8">
              <h2 className="text-lg font-semibold text-ink mb-6 text-center">
                Sélectionnez vos champions
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
                <div className="flex items-center justify-center md:mt-7">
                  <span className="text-ink-muted text-sm font-semibold">
                    VS
                  </span>
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
                  className="bg-accent-strong hover:bg-accent disabled:bg-surface-2 disabled:text-ink-muted text-accent-ink font-semibold py-3 px-8 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed">
                  {loading ? (
                    <span className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-accent-ink/30 border-t-accent-ink rounded-full animate-spin"></div>
                      Analyse en cours...
                    </span>
                  ) : (
                    "Analyser le matchup"
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
          </>
        )}

        {/* Contenu onglet équipe */}
        {activeTab === "team" && (
          <TeamMatchupAnalyzer patch={patch} champions={champions} />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border h-12 flex items-center">
        <div className="max-w-4xl mx-auto px-6 w-full">
          <p className="text-center text-ink-muted text-sm">
            Imadslm - {new Date().getFullYear()} - Matchup Mentor.
          </p>
        </div>
      </footer>
    </div>
  )
}
