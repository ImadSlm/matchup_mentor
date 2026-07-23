export default function Loader() {
  return (
    <div className="bg-surface rounded-xl border border-border p-8">
      <div className="flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>

        <div className="text-center">
          <h3 className="text-ink text-base font-semibold mb-1">
            Analyse en cours...
          </h3>
          <p className="text-ink-muted text-sm">
            Le Mentor étudie le matchup
          </p>
        </div>
      </div>
    </div>
  )
}
