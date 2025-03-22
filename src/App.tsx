import './App.css'
import { EmpresaInfos } from './components/EmpresaInfos.tsx'
import Header from './components/Header.tsx'
import Maps from './components/Maps.tsx'
import { Stats } from './components/Stats.tsx'

function App() {
  return (
    <>
      <Header/>
      <EmpresaInfos/>
      <Stats/>
      <Maps/>
    </>
  )
}

export default App
