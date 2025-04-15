import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { Home } from './pages/Home';
import { EmpresaPage } from './pages/EmpresaPage';
import { ErrorPage } from './pages/ErrorPage';
import { Analytics } from '@vercel/analytics/react';
import { CadastroPage } from './pages/CadastroPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/empresa/:empresaUrl" element={<EmpresaPage />} />
        <Route path="/cadastro" element={<CadastroPage/>} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Analytics />
    </Router>
  );
}

export default App;