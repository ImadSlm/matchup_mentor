export default function Loader() {
  return (
    <div className="bg-white bg-opacity-10 rounded-xl p-8">
      <div className="flex flex-col items-center justify-center">
        {/* Animation simple */}
        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>

        {/* Texte */}
        <div className="text-center">
          <h3 className="text-white text-xl font-semibold mb-2">
            🧠 Analyse en cours...
          </h3>
          <p className="text-blue-200 text-sm">
            Notre IA étudie le matchup pour vous
          </p>
        </div>
      </div>
    </div>
  )
}
