import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { Home } from './pages/Home';
import { EmpresaPage } from './pages/EmpresaPage';
import { ErrorPage } from './pages/ErrorPage';
import { Analytics } from '@vercel/analytics/react';
import { CadastroUsuario } from './pages/CadastroUsuario';
import { CadastroEmpresas } from './pages/CadastroEmpresas';
import { Patrocinio } from './pages/Patrocinio';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/empresa/:empresaUrl" element={<EmpresaPage />} />
        <Route path="/usuario/cadastro" element={<CadastroUsuario/>} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/empresa/cadastro" element={<CadastroEmpresas/>} />
        <Route path="/patrocinio" element={<Patrocinio/>} />
      </Routes>
      <Analytics />
    </Router>
  );
}

export default App;