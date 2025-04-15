import { useNavigate, useParams } from "react-router-dom";
import { EmpresaInfos } from "../components/EmpresaInfos";
import Header from "../components/Header";
import Maps from "../components/Maps";
import { Stats } from "../components/Stats";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import Modal from "../components/Modal";

export function EmpresaPage() {
  const { empresaUrl } = useParams();
  const navigate = useNavigate();
  const [modalInfo, setModalInfo] = useState<{title: string; value: number} | null>(null);

  useEffect(() => {
    const verificarEmpresa = async () => {
      if (!empresaUrl) {
        navigate("/error");
        return;
      }

      const { data, error } = await supabase
        .from("patrocinadores")
        .select("id")
        .eq("url_exclusiva", empresaUrl)
        .single();

      if (error || !data) {
        navigate("/error");
      }
    };

    verificarEmpresa();
  }, [empresaUrl, navigate]);

  const handleCardClick = (title: string, value: number) => {
    setModalInfo({ title, value });
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      {/* Header - altura adaptável */}
      <div className="flex-none bg-blue-900 min-[500px]:px-2">
        <Header />
      </div>

      {/* Conteúdo principal - ocupa o espaço restante sem scroll */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* EmpresaInfos - se adapta ao conteúdo */}
        <div className="flex-none pt-4 sm:p-4">
          <EmpresaInfos />
        </div>

        {/* Stats - altura fixa proporcional */}
        <div className="flex-none p-4">
          <Stats onCardClick={handleCardClick}/>
        </div>

        {/* Maps - ocupa o restante do espaço */}
        <div className="flex-1 min-h-[200px] p-4 pt-0">
          <Maps />
        </div>
      </div>
      {/* Modal */}
      {modalInfo && (
        <Modal
          title={modalInfo.title}
          onClose={() => setModalInfo(null)}
        >
          <p className="text-lg font-semibold">{modalInfo.value}</p>
        </Modal>
      )}
    </div>
  );
}