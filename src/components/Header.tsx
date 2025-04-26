import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
  const navigate = useNavigate();

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

  return (
    <nav className="w-full bg-[#16254D] p-2 flex justify-between items-center min-h-[115px]">
      {loading ? (
        <div className="animate-pulse bg-[#16254D] rounded h-8 w-32"></div>
      ) : empresaUrl ? (
        <Link
          to={"/"}
          className="text-white text-[20px] sm:text-[40px] font-bold whitespace-nowrap"
        >
          {empresa?.nome || "Helpnei"}
        </Link>
      ) : (
        <button
          onClick={() => navigate(-1)}
          className="text-white text-[20px] sm:text-[40px] font-bold whitespace-nowrap"
        >
          {empresa?.nome || "Helpnei"}
        </button>
      )}

      {/* Redes Sociais com alts específicos */}
      <div className="flex gap-[5px] sm:gap-[30px] flex-wrap justify-end">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-blue-800 rounded-full h-6 w-6"></div>
          ))
        ) : (
          <>
            {empresa?.facebook && (
              <SocialIcon 
                alt="Facebook" 
                img="facebook.png" 
                ref={empresa.facebook} 
              />
            )}
            {empresa?.instagram && (
              <SocialIcon 
                alt="Instagram" 
                img="instagram.webp" 
                ref={empresa.instagram} 
              />
            )}
            {empresa?.kawai && (
              <SocialIcon 
                alt="Kawai" 
                img="kawai.avif" 
                ref={empresa.kawai} 
              />
            )}
            {empresa?.linkedin && (
              <SocialIcon 
                alt="LinkedIn" 
                img="linkedin.png" 
                ref={empresa.linkedin} 
              />
            )}
            {empresa?.site_web && (
              <SocialIcon 
                alt="Site Oficial" 
                img="web.png" 
                ref={empresa.site_web} 
              />
            )}
            {empresa?.tiktok && (
              <SocialIcon 
                alt="TikTok" 
                img="tiktok.webp" 
                ref={empresa.tiktok} 
              />
            )}
            {empresa?.whatsapp && (
              <SocialIcon 
                alt="WhatsApp" 
                img="whatsapp.png" 
                ref={empresa.whatsapp} 
              />
            )}
            {empresa?.twitter && (
              <SocialIcon 
                alt="Twitter (X)" 
                img="x.png" 
                ref={empresa.twitter} 
              />
            )}
          </>
        )}
      </div>
    </nav>
  );
}

export default Header;
