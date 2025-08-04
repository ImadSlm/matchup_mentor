export default function ResultDisplay({ champ1, champ2, result }) {
  if (!result) return null

  return (
    <div className="bg-white bg-opacity-20 rounded-lg p-6 mt-6">
      <h3 className="text-2xl font-bold text-white mb-4 text-center">
        {champ1} vs {champ2}
      </h3>
      <div className="text-white space-y-2">
        {result.split("\n").map((line, idx) => (
          <p key={idx} className="leading-relaxed">
            {line}
          </p>
        ))}
      </div>
    </div>
  )
}
