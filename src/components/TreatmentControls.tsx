import { useSimulation } from '../state/SimulationContext'

export default function TreatmentControls() {
  const { state, dispatch } = useSimulation()
  const sim = state.simulation
  const gameOver = sim.outcome !== null

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Treatment Decisions</h3>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => dispatch({ type: 'PLAYER_ACTION', action: { type: 'ADMINISTER_ANTIBIOTICS' } })}
          disabled={gameOver || sim.antibioticActive}
          className="w-full text-left px-4 py-3 rounded-lg border-2 border-amber-300 bg-amber-50 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950 dark:hover:bg-amber-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span className="font-semibold text-amber-800 dark:text-amber-300">Give Antibiotics</span>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">Kills bacteria broadly — commensals and C. diff alike.</p>
        </button>

        <button
          onClick={() => dispatch({ type: 'PLAYER_ACTION', action: { type: 'ADMINISTER_THERAPEUTIC' } })}
          disabled={gameOver}
          className="w-full text-left px-4 py-3 rounded-lg border-2 border-green-300 bg-green-50 hover:bg-green-100 dark:border-green-700 dark:bg-green-950 dark:hover:bg-green-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span className="font-semibold text-green-800 dark:text-green-300">Give Microbiome Therapy</span>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">Delivers commensal spores to restore competitive exclusion.</p>
        </button>


      </div>
    </div>
  )
}
