import { useEffect, useState } from "react";
import Grafico from "./Grafico";

interface CardProps {
    title: string;
    value: number;
    srcImg: string;
    onClick?: () => void;
}
export const Card: React.FC<CardProps> = ({ title, value, srcImg}) => {
  const [isModalOpen, setIsmodalOpen] = useState(false);

  const handleOpenModal = () => setIsmodalOpen(true);
  const handleCloseModal = () => setIsmodalOpen(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleCloseModal();
    }
  };

  return (
    <>
      <div 
        onClick={handleOpenModal}
        className="
        sm:h-[90px]
        flex flex-row
        items-center
        bg-wite p-1 rounded-lg shadow 
        xl:w-[48%]
        border-3 
        border-[#328DD8]
        shadow-md
        shadow-black
        cursor-pointer">
        
        <div className="flex items-center justify-center">
          <img src={srcImg} className="h-[20px] w-[20px] sm:w-[42px] sm:h-[42px] mt-3 sm:ml-[40px]"/>
        </div>

        <div className="flex flex-col justify-center text-center w-full">
          <p className="text-black text-sm sm:text-xl md:text-xl md:text-base whitespace-nowrap">{title}</p>  
          <p className="text-black text-[24px] sm:text-[36px] font-bold">{value}</p>
        </div>
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-xs"
        onClick={handleClickOutside}
        > 
          <div className="bg-white p-6 rounded-[24px] md:rounded-[37px] shadow-lg w-[90%] h-[80%] md:w-[771px] md:h-[640px]">
            <div className="flex items-center mb-4">
              <h2 className="text-[32px] font-normal text-black text-center w-full leading-[100%] tracking-[0]">
                {title}
              </h2>
            </div>
            <Grafico />
          </div>
        </div>
      )}
    </>
  );
}