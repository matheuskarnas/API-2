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
          w-[25px] h-[25px] 
          sm:w-[50px] sm:h-[50px]
          ${className || ""}
        `}
      />
    </a>
  );
}