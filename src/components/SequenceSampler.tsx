import { useState } from 'react'
import { useSimulation } from '../state/SimulationContext'

const BLAST_URL = 'https://blast.ncbi.nlm.nih.gov/blast/Blast.cgi?PROGRAM=blastn&PAGE_TYPE=BlastSearch&LINK_LOC=blasthome'

const CATEGORY_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  commensal: { label: 'Host Commensal Bacteria', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  ser109: { label: 'SER-109 / Vowst Therapeutic Bacteria', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  cdiff: { label: 'Clostridioides difficile', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
}

export default function SequenceSampler() {
  const { state, dispatch } = useSimulation()
  const [copied, setCopied] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const sample = state.lastSample

  function handleTakeSample() {
    setShowAnswer(false)
    setCopied(false)
    dispatch({ type: 'TAKE_SAMPLE' })
  }

  function handleCopy() {
    if (!sample) return
    navigator.clipboard.writeText(sample.fastaSequence).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-700">Gut Sample — DNA Sequencing</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Take a stool sample and sequence it to identify which bacteria are present.
          </p>
        </div>
        <button
          onClick={handleTakeSample}
          disabled={state.simulation.outcome !== null}
          className="px-3 py-2 text-sm font-semibold rounded-lg border-2 border-purple-300 bg-purple-50 hover:bg-purple-100 disabled:opacity-40 disabled:cursor-not-allowed text-purple-800 transition-colors whitespace-nowrap"
        >
          Take Sample
        </button>
      </div>

      {sample ? (
        <div className="space-y-3">
          {/* Sample metadata */}
          <div className="text-xs text-gray-500">
            Sample collected on Day {sample.tick} · 16S rRNA gene · {sample.sequenceEnd - sample.sequenceStart} bp partial sequence
          </div>

          {/* FASTA sequence display */}
          <div className="relative">
            <pre className="bg-gray-900 text-green-400 rounded-lg p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">
              {sample.fastaSequence}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-gray-700 hover:bg-gray-600 text-gray-200 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* BLAST instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 space-y-1">
            <div className="font-semibold">How to identify this sequence:</div>
            <ol className="list-decimal list-inside space-y-1 pl-1">
              <li>Copy the FASTA sequence above</li>
              <li>
                Go to{' '}
                <a
                  href={BLAST_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-semibold hover:text-blue-600"
                >
                  NCBI BLAST (blastn)
                </a>
              </li>
              <li>Paste the sequence and click "BLAST"</li>
              <li>Look at the top hits — what organism does this match?</li>
              <li>Is it a gut commensal, a SER-109 therapeutic bacteria, or <em>C. diff</em>?</li>
            </ol>
            <p className="mt-2 italic text-blue-600">{sample.blastHint}</p>
          </div>

          {/* Reveal answer toggle */}
          <div>
            <button
              onClick={() => setShowAnswer(!showAnswer)}
              className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
            >
              {showAnswer ? 'Hide answer' : 'Reveal answer (educators only)'}
            </button>
            {showAnswer && (
              <div
                className={`mt-2 rounded-lg border p-3 text-xs ${CATEGORY_LABELS[sample.category]?.bg ?? 'bg-gray-50 border-gray-200'}`}
              >
                <div className={`font-bold ${CATEGORY_LABELS[sample.category]?.color ?? 'text-gray-700'}`}>
                  {CATEGORY_LABELS[sample.category]?.label ?? sample.category}
                </div>
                <div className="font-semibold mt-1">
                  {sample.displayName}
                </div>
                <div className="text-gray-600 mt-0.5">
                  Sequence position: {sample.sequenceStart}–{sample.sequenceEnd} bp within 16S rRNA gene
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-gray-400 text-sm">
          <div className="text-2xl mb-2">🔬</div>
          <div>No sample taken yet. Click "Take Sample" to collect a specimen.</div>
          <div className="text-xs mt-1">
            The sequence returned depends on which bacteria are most abundant right now.
          </div>
        </div>
      )}
    </div>
  )
}
