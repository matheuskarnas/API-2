type SocialIconProps = {
    ref: string,
    img: string,
    alt: string,
 };


export function SocialIcon({ref, img, alt}: SocialIconProps) {
  return (
    <a href={ref} target="_blank" rel="noopener noreferrer">
      <img
        src={`/public/assets/${img}`}
        alt={alt}
        className="w-6 h-6"
      />
    </a>
  );
}
