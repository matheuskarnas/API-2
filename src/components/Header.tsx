
import {empresa} from '../../public/data/empresa.ts'
import { SocialIcon } from './SocialIcon.tsx';

function Header() {
  return (
    <nav className="w-full bg-blue-900 p-3 flex justify-between items-center">
      <h1 className="text-white text-lg font-bold ml-4">SHIP</h1>
      <div className="flex gap-2 mr-3">
        {empresa.facebook && (
          <SocialIcon alt='facebook' img='facebook.png' ref={empresa.facebook}/>
        )}
        {empresa.instagram && (
          <SocialIcon alt='instagram' img='instagram.webp' ref={empresa.instagram}/>
        )}
        {empresa.kawai && (
         <SocialIcon alt='kawai' img='kawai.avif' ref={empresa.kawai}/>
        )}
        {empresa.linkedin && (
          <SocialIcon alt='linkedin' img='linkedin.png' ref={empresa.linkedin}/>
        )}
        {empresa.site_web && (
         <SocialIcon alt='site_web' img='web.png' ref={empresa.site_web}/>
        )}
        {empresa.tiktok && (
          <SocialIcon alt='tiktok' img='tiktok.webp' ref={empresa.tiktok}/>
        )}
        {empresa.whatsapp && (
          <SocialIcon alt='whatsapp' img='whatsapp.png' ref={empresa.whatsapp}/>
        )}
        {empresa.x && (
          <SocialIcon alt='x' img='x.png' ref={empresa.x}/>
        )}
      </div>
    </nav>
  );
}

export default Header;
