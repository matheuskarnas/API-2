import { useNavigate, useParams } from "react-router-dom";
import { EmpresaInfos } from "../components/EmpresaInfos";
import Header from "../components/Header";
import Maps from "../components/Maps";
import { Stats } from "../components/Stats";
import { useEffect} from "react";
import { supabase } from "../services/supabaseClient";

export function EmpresaPage() {
  const { empresaUrl } = useParams();
  const navigate = useNavigate();

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

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <div className="flex-none bg-[#16254D] min-[500px]:px-2 sticky top-0 z-10">
        <Header />
      </div>

      <div className="flex-1 flex flex-col justify-evenly gap-8 md:gap-28 overflow-hidden pt-8 pb-10">
        <div className="flex-none">
          <EmpresaInfos />
        </div>

        <div className="flex-none">
          <Stats />
        </div>

        <div className="flex ">
          <Maps />
        </div>
      </div>
    </div>
  );
}