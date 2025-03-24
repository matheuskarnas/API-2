interface SocialIconProps {
  alt: string;
  img: string;
  ref: string;
  className?: string;
}

export function SocialIcon({ alt, img, ref, className }: SocialIconProps) {
  return (
    <a href={ref} target="_blank" rel="noopener noreferrer">
      <img
        src={`/assets/${img}`}
        alt={alt}
        className={`
          w-6 h-6 
          md:w-8 md:h-8  
          lg:w-10 lg:h-10 
          xl:w-12 xl:h-12  
          ${className || ""}
        `}
      />
    </a>
  );
}