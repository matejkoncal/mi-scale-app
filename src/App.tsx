import { Button } from '@mui/material';
import './App.css'
import { useMiScale } from './useMiScale/useMiScale'
import ReactSpeedometer from "react-d3-speedometer"

function App() {
  const { startScan, debouncedWeight } = useMiScale();
  document.onvisibilitychange = () => {
    if (document.visibilityState === 'visible') {
      startScan();
    }
  }

  return (
    <>
      <ReactSpeedometer minValue={0} maxValue={160} segments={1} currentValueText="${value} Kg" value={debouncedWeight} />
      <Button onClick={startScan} variant="contained" color="primary">Scan</Button>
    </>
  )
}

export default App
