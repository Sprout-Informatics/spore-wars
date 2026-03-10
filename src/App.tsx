import { useState, useEffect } from 'react'
import { SimulationProvider } from './state/SimulationContext'
import { ThemeProvider } from './context/ThemeContext'
import PatientDashboard from './components/PatientDashboard'
import LandingPage from './components/LandingPage'

function App() {
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const handlePopState = () => {
      setStarted(false)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleStart = () => {
    window.history.pushState({ page: 'simulation' }, '')
    setStarted(true)
  }

  const handleBack = () => {
    window.history.back()
  }

  return (
    <ThemeProvider>
      {!started ? (
        <LandingPage onStart={handleStart} />
      ) : (
        <SimulationProvider>
          <PatientDashboard onBack={handleBack} />
        </SimulationProvider>
      )}
    </ThemeProvider>
  )
}

export default App
