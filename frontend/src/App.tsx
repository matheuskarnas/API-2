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
import { EmpresaPlanos } from './pages/EmpresaPlanos';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function App() {
  return (
    <Router>
      <Elements stripe={stripePromise}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/empresa/:empresaUrl" element={<EmpresaPage />} />
          <Route path="/empresa/planos" element={<EmpresaPlanos />} />
          <Route path="/empresa/cadastro" element={<CadastroEmpresas/>} />
          <Route path="/empresa/patrocinio" element={<Patrocinio/>} />
          <Route path="/usuario/cadastro" element={<CadastroUsuario/>} />
          <Route path="/usuario/patrocinios-disponiveis" element={<PatrociniosDisponiveis/>} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Elements>
      <Analytics />
    </Router>
  );
}

export default App;