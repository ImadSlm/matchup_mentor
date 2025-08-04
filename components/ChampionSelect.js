import { useState, useEffect, useRef } from "react"

export default function ChampionSelect({
  champions,
  value,
  onChange,
  label,
  patch,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredChampions, setFilteredChampions] = useState(champions)
  const dropdownRef = useRef(null)
  const searchInputRef = useRef(null)

  // Filtrer les champions basé sur le terme de recherche
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredChampions(champions)
    } else {
      setFilteredChampions(
        champions.filter((champion) =>
          champion.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }
  }, [searchTerm, champions])

  // Fermer le dropdown si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Focus sur l'input de recherche quand le dropdown s'ouvre
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  const handleSelect = (champion) => {
    onChange(champion)
    setIsOpen(false)
    setSearchTerm("")
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setSearchTerm("")
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-white font-bold mb-3">{label}</label>

      {/* Bouton principal du dropdown */}
      <button
        type="button"
        onClick={handleToggle}
        className="w-full p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white text-left hover:bg-white/15 transition-all duration-200 flex items-center justify-between group">
        <span className={value ? "text-white" : "text-gray-300"}>
          {value || "Sélectionnez un champion"}
        </span>
        <svg
          className={`w-5 h-5 text-gray-300 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown avec recherche */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-gray-800/95 backdrop-blur-lg border border-white/20 rounded-xl shadow-2xl max-h-80 overflow-hidden">
          {/* Barre de recherche */}
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un champion..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Liste des champions */}
          <div className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {filteredChampions.length > 0 ? (
              filteredChampions.map((champion) => (
                <button
                  key={champion}
                  type="button"
                  onClick={() => handleSelect(champion)}
                  className="w-full p-3 text-left hover:bg-white/10 transition-colors duration-150 flex items-center gap-3 text-white border-b border-white/5 last:border-b-0">
                  <img
                    src={`https://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${champion.replace(
                      /\s/g,
                      ""
                    )}.png`}
                    alt={champion}
                    className="w-8 h-8 rounded"
                    onError={(e) => {
                      e.target.style.display = "none"
                    }}
                  />
                  <span>{champion}</span>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-gray-400">
                Aucun champion trouvé pour "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Aperçu du champion sélectionné */}
      {value && (
        <div className="mt-4 p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
          <div className="flex items-center gap-4">
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${value.replace(
                /\s/g,
                ""
              )}.png`}
              alt={value}
              className="w-16 h-16 rounded-lg shadow-lg"
              onError={(e) => {
                e.target.style.display = "none"
              }}
            />
            <div>
              <h3 className="text-white font-semibold text-lg">{value}</h3>
              <p className="text-blue-300 text-sm">Champion sélectionné</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
