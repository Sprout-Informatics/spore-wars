import { useEffect, useRef } from 'react'
import { useSimulation } from '../state/SimulationContext'

const TYPE_STYLES = {
  info: 'text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-300 dark:bg-blue-950 dark:border-blue-800',
  warning: 'text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-300 dark:bg-amber-950 dark:border-amber-800',
  critical: 'text-red-700 bg-red-50 border-red-200 dark:text-red-300 dark:bg-red-950 dark:border-red-800',
  success: 'text-green-700 bg-green-50 border-green-200 dark:text-green-300 dark:bg-green-950 dark:border-green-800',
} as const

const TYPE_ICONS = {
  info: 'i',
  warning: '!',
  critical: '!!',
  success: '\u2713',
} as const

export default function EventLog() {
  const { state } = useSimulation()
  const events = state.simulation.events
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [events.length])

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Event Log</h3>
      <div ref={scrollRef} className="max-h-48 overflow-y-auto space-y-1">
        {events.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 italic">No events yet.</p>
        ) : (
          [...events].reverse().map((event, i) => (
            <div
              key={`${event.tick}-${i}`}
              className={`text-xs px-3 py-2 rounded border ${TYPE_STYLES[event.type]}`}
            >
              <span className="font-mono font-bold mr-2">[{TYPE_ICONS[event.type]}]</span>
              <span className="font-medium mr-2">Day {event.tick}:</span>
              {event.message}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
