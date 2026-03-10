import { useMemo } from 'react'
import {
  AreaChart,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useSimulation } from '../state/SimulationContext'
import { useTheme } from '../context/ThemeContext'

export default function PopulationChart() {
  const { state } = useSimulation()
  const { isDark } = useTheme()
  const history = state.simulation.history

  const axisColor = isDark ? '#9ca3af' : '#374151'
  const tooltipStyle = isDark
    ? { backgroundColor: '#1f2937', border: '1px solid #374151', color: '#f3f4f6' }
    : { backgroundColor: '#ffffff', border: '1px solid #e5e7eb', color: '#111827' }

  // Scale internal 0-1 values to 0-100 for display
  const chartData = useMemo(
    () =>
      history.map((h) => ({
        tick: h.tick,
        commensals: h.totalCommensalAbundance * 100,
        cdiffAbundance: h.cdiffAbundance * 100,
        toxinLevel: h.toxinLevel * 100,
        healthScore: h.healthScore,
      })),
    [history],
  )

  return (
    <div className="space-y-4">
      {/* Population chart */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Population Dynamics</h2>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            stackOffset="none"
          >
            <XAxis
              dataKey="tick"
              label={{ value: 'Day', position: 'insideBottomRight', offset: -5, fill: axisColor }}
              tick={{ fontSize: 12, fill: axisColor }}
              stroke={axisColor}
            />
            <YAxis
              domain={[0, 100]}
              allowDataOverflow={true}
              label={{ value: 'Abundance', angle: -90, position: 'insideLeft', offset: 10, fill: axisColor }}
              tick={{ fontSize: 12, fill: axisColor }}
              stroke={axisColor}
            />
            <Tooltip
              formatter={(value) => Number(value).toFixed(1)}
              labelFormatter={(label) => `Day ${label}`}
              contentStyle={tooltipStyle}
            />
            <Legend />

            <Area
              type="monotone"
              dataKey="commensals"
              name="Commensals"
              stackId="1"
              stroke="#16a34a"
              fill="#22c55e"
              fillOpacity={0.7}
            />
            <Area
              type="monotone"
              dataKey="cdiffAbundance"
              name="C. diff"
              stackId="1"
              stroke="#dc2626"
              fill="#ef4444"
              fillOpacity={0.7}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Health & Toxin chart */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Patient Health & Toxin</h2>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <XAxis
              dataKey="tick"
              label={{ value: 'Day', position: 'insideBottomRight', offset: -5, fill: axisColor }}
              tick={{ fontSize: 12, fill: axisColor }}
              stroke={axisColor}
            />
            <YAxis
              yAxisId="health"
              domain={[0, 100]}
              label={{ value: 'Health', angle: -90, position: 'insideLeft', offset: 10, fill: axisColor }}
              tick={{ fontSize: 12, fill: axisColor }}
              stroke={axisColor}
            />
            <YAxis
              yAxisId="toxin"
              orientation="right"
              domain={[0, 'auto']}
              label={{ value: 'Toxin', angle: 90, position: 'insideRight', offset: 10, fill: axisColor }}
              tick={{ fontSize: 12, fill: axisColor }}
              stroke={axisColor}
            />
            <Tooltip
              formatter={(value) => Number(value).toFixed(1)}
              labelFormatter={(label) => `Day ${label}`}
              contentStyle={tooltipStyle}
            />
            <Legend />

            <Line
              yAxisId="health"
              type="monotone"
              dataKey="healthScore"
              name="Health"
              stroke="#a855f7"
              dot={false}
              strokeWidth={2}
            />
            <Line
              yAxisId="toxin"
              type="monotone"
              dataKey="toxinLevel"
              name="Toxin"
              stroke="#f97316"
              strokeDasharray="5 5"
              dot={false}
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
