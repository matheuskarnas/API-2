import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { Home } from './pages/Home';
import { EmpresaPage } from './pages/EmpresaPage';
import { ErrorPage } from './pages/ErrorPage';
import { Analytics } from '@vercel/analytics/react';
import { CadastroPage } from './pages/CadastroPage';
import { CadastroEmpresas } from './pages/CadastroEmpresas';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/empresa/:empresaUrl" element={<EmpresaPage />} />
        <Route path="/usuario/cadastro" element={<CadastroPage/>} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/empresa/cadastro" element={<CadastroEmpresas/>} />
      </Routes>
      <Analytics />
    </Router>
  );
}

export default App;