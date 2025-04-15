import React, { useEffect } from "react";
import Grafico from "./Grafico";

type ModalProps = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

const Modal = ({ title, onClose }: ModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return  () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-xs"
    onClick={handleClickOutside}
    > 
      <div className="bg-white p-6 rounded-[24px] md:rounded-[37px] shadow-lg w-[90%] h-[80%] md:w-[771px] md:h-[640px]">
        <div className="flex items-center mb-4">
          <h2 className="text-[32px] font-normal text-black text-center w-full leading-[100%] tracking-[0]">{title}</h2>
        </div>
        {/* Conteúdo do modal será substituído pelo gráfico e será adicionado o filtro de data */}
        <Grafico />
      </div>
    </div>
  );
};

export default Modal;
