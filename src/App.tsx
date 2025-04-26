import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { Home } from './pages/Home';
import { EmpresaPage } from './pages/EmpresaPage';
import { ErrorPage } from './pages/ErrorPage';
import { Analytics } from '@vercel/analytics/react';
import { CadastroUsuario } from './pages/CadastroUsuario';
import { CadastroEmpresas } from './pages/CadastroEmpresas';
import { Patrocinio } from './pages/Patrocinio';
import { PatrociniosDisponiveis } from "./pages/PatrociniosDisponiveis";
import { UsuarioPlanos } from "./pages/UsuarioPlanos";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/empresa/:empresaUrl" element={<EmpresaPage />} />
        <Route path="/empresa/planos" element={<ErrorPage />} /> // criar página de planos para empresas
        <Route path="/empresa/cadastro" element={<CadastroEmpresas/>} />
        <Route path="/empresa/patrocinio" element={<Patrocinio/>} />
        <Route path="/usuario/planos" element={<UsuarioPlanos/>} /> // criar página de planos para usuários
        <Route path="/usuario/cadastro" element={<CadastroUsuario/>} />
        <Route path="/usuario/patrocinios-disponiveis" element={<PatrociniosDisponiveis/>} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <Analytics />
    </Router>
  );
}

export default App;