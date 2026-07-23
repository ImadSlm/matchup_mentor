import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"

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
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  })
  const containerRef = useRef(null)
  const dropdownRef = useRef(null)
  const searchInputRef = useRef(null)
  const buttonRef = useRef(null)

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
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false)
        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Fermer le dropdown avec Echap et rendre le focus au bouton
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false)
        setSearchTerm("")
        buttonRef.current?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  const handleSelect = (champion) => {
    onChange(champion)
    setIsOpen(false)
    setSearchTerm("")
  }

  // Calculer la position du dropdown uniquement lors de l'ouverture
  const calculatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      return {
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width,
      }
    }
    return { top: 0, left: 0, width: 0 }
  }

  const handleToggle = () => {
    if (!isOpen) {
      // Calculer la position immédiatement avant d'ouvrir
      setDropdownPosition(calculatePosition())
    }
    setIsOpen(!isOpen)
    if (!isOpen) {
      setSearchTerm("")
      // Focus immédiat sur l'input lors de l'ouverture
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus()
        }
      }, 0)
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-ink font-semibold text-sm mb-2">{label}</label>

      {/* Bouton principal du dropdown */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="w-full p-3 bg-surface-2 border border-border rounded-lg text-ink text-left hover:border-ink-muted transition-colors duration-150 flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
        {value ? (
          /* Aperçu du champion dans le bouton */
          <div className="flex items-center gap-3">
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${value.replace(
                /\s/g,
                ""
              )}.png`}
              alt={value}
              className="w-10 h-10 rounded-md"
              onError={(e) => {
                e.target.style.display = "none"
              }}
            />
            <div>
              <div className="text-ink font-medium">{value}</div>
              <div className="text-ink-muted text-xs">Champion sélectionné</div>
            </div>
          </div>
        ) : (
          /* Placeholder quand aucun champion n'est sélectionné */
          <span className="text-ink-muted">Sélectionnez un champion</span>
        )}

        <svg
          className={`w-5 h-5 text-ink-muted transition-transform duration-150 ${
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

      {/* Dropdown avec recherche via portail */}
      {isOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed bg-surface-2 border border-border rounded-lg shadow-lg max-h-80 overflow-hidden"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              zIndex: 10000,
            }}>
            {/* Barre de recherche */}
            <div className="p-3 border-b border-border">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ink-muted"
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
                  className="w-full pl-10 pr-4 py-2 bg-bg border border-border rounded-md text-ink placeholder-ink-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>
            </div>

            {/* Liste des champions */}
            <div className="max-h-60 overflow-y-auto">
              {filteredChampions.length > 0 ? (
                filteredChampions.map((champion) => (
                  <button
                    key={champion}
                    type="button"
                    onClick={() => handleSelect(champion)}
                    className="w-full p-3 text-left hover:bg-surface transition-colors duration-150 flex items-center gap-3 text-ink border-b border-border last:border-b-0">
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
                <div className="p-4 text-center text-ink-muted">
                  Aucun champion trouvé pour "{searchTerm}"
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
