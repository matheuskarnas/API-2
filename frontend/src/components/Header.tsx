import { Link, useNavigate } from 'react-router-dom';
import { SocialIcon } from './SocialIcon';

interface EmpresaData {
  nome: string;
  url_exclusiva: string;
  facebook?: string;
  instagram?: string;
  kawai?: string;
  linkedin?: string;
  url_site?: string;
  tiktok?: string;
  whatsapp?: string;
  twitter?: string;
}

interface HeaderProps {
  empresa: EmpresaData | null;
  loading: boolean;
}

export function Header({ empresa, loading }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-[#16254D] p-2 flex justify-between items-center h-[94px] md:h-[115px]">
      {loading ? (
        <div className="animate-pulse bg-[#16254D] rounded h-8 w-32"></div>
      ) : empresa?.url_exclusiva ? (
        <Link
          to={"/"}
          className="text-white text-[20px] md:text-[40px] font-bold whitespace-nowrap"
        >
          {empresa?.nome || `Helpnei`}
        </Link>
      ) : (
        <button
          onClick={() => navigate(-1)}
          className="text-white text-[20px] md:text-[40px] font-bold whitespace-nowrap"
        >
          {empresa?.nome || "Helpnei"}
        </button>
      )}

      <div className="flex gap-[5px] sm:gap-[15px] flex-wrap justify-end">
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
            {empresa?.url_site && (
              <SocialIcon 
                alt="Site Oficial" 
                img="web.png" 
                ref={empresa.url_site} 
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
