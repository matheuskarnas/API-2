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
          w-4 h-4 
          min-[500px]:w-6 min-[500px]:h-6
          xl:w-8 xl:h-8  
          ${className || ""}
        `}
      />
    </a>
  );
}