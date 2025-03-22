import './App.css'
import { EmpresaInfos } from './components/EmpresaInfos.tsx'
import Header from './components/Header.tsx'
import { Stats } from './components/Stats.tsx'

function App() {
  return (
    <>
      <Header/>
      <EmpresaInfos/>
      <Stats/>
    </>
  )
}

export default App
