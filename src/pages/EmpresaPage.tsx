import { useNavigate, useParams } from "react-router-dom";
import { EmpresaInfos } from "../components/EmpresaInfos";
import Header from "../components/Header";
import Maps from "../components/Maps";
import { Stats } from "../components/Stats";
import { useEffect } from "react";
import { supabase } from "../services/supabaseClient";

export function EmpresaPage() {
  const { empresaUrl } = useParams(); // Corrigido para usar empresaUrl
  const navigate = useNavigate();

  useEffect(() => {
    const verificarEmpresa = async () => {
      if (!empresaUrl) {
        navigate("/error");
        return;
      }

      // Verifica no Supabase se a empresa existe
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
    <>
      <Header />
      <EmpresaInfos />
      <Stats />
      <Maps />
    </>
  );
}