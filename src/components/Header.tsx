import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { SocialIcon } from './SocialIcon';

interface EmpresaData {
  nome: string;
  facebook?: string;
  instagram?: string;
  kawai?: string;
  linkedin?: string;
  site_web?: string;
  tiktok?: string;
  whatsapp?: string;
  twitter?: string;
}

export function Header() {
  const { empresaUrl } = useParams();
  const [empresa, setEmpresa] = useState<EmpresaData | null>(null);
  const [loading, setLoading] = useState(true);

  // Dados de fallback visual
  const fallbackData: EmpresaData = {
    nome: 'SHIP',
    facebook: '#',
    instagram: '#',
    linkedin: '#'
  };

  useEffect(() => {
    if (!empresaUrl) {
      setEmpresa(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('patrocinadores')
          .select('*')
          .eq('url_exclusiva', empresaUrl)
          .single();

        if (!error && data) {
          setEmpresa(data);
        } else {
          setEmpresa(fallbackData);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setEmpresa(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [empresaUrl]);

  if (loading) {
    return (
      <nav className="w-full bg-blue-900 p-3 flex justify-between items-center min-h-[72px]">
        <div className="animate-pulse bg-blue-800 rounded h-8 w-32"></div>
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-blue-800 rounded-full h-6 w-6"></div>
          ))}
        </div>
      </nav>
    );
  }

  if (!empresa) {
    return (
      <nav className="w-full bg-blue-900 p-3 flex justify-between items-center">
        <h1 className="text-white text-4xl font-bold ml-4">Helpnei</h1>
      </nav>
    );
  }

  return (
    <nav className="w-full bg-blue-900 p-3 flex justify-between items-center">
      <h1 className="text-white text-4xl font-bold ml-4">{empresa.nome}</h1>

      <div className="flex gap-2 mr-3">
        {empresa?.facebook && (
          <SocialIcon alt="facebook" img="facebook.png" ref={empresa.facebook} />
        )}
        {empresa?.instagram && (
          <SocialIcon alt="instagram" img="instagram.webp" ref={empresa.instagram} />
        )}
        {empresa?.kawai && (
          <SocialIcon alt="kawai" img="kawai.avif" ref={empresa.kawai} />
        )}
        {empresa?.linkedin && (
          <SocialIcon alt="linkedin" img="linkedin.png" ref={empresa.linkedin} />
        )}
        {empresa?.site_web && (
          <SocialIcon alt="site" img="web.png" ref={empresa.site_web} />
        )}
        {empresa?.tiktok && (
          <SocialIcon alt="tiktok" img="tiktok.webp" ref={empresa.tiktok} />
        )}
        {empresa?.whatsapp && (
          <SocialIcon alt="whatsapp" img="whatsapp.png" ref={empresa.whatsapp} />
        )}
        {empresa?.twitter && (
          <SocialIcon alt="twitter" img="x.png" ref={empresa.twitter} />
        )}
      </div>
    </nav>
  );
}

export default Header;
