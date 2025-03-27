import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import { EmpresaPage } from './pages/EmpresaPage.tsx'
import { Home } from './pages/Home.tsx'
import { ErrorPage } from './pages/ErrorPage.tsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/empresa/:empresaId" element={<EmpresaPage />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </Router>
  )
}

export default App
