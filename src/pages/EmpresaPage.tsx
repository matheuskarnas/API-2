import { useNavigate, useParams } from "react-router-dom";
import { EmpresaInfos } from "../components/EmpresaInfos";
import Header from "../components/Header";
import Maps from "../components/Maps";
import { Stats } from "../components/Stats";
import { useEffect, useState } from "react";

export function EmpresaPage() {
  const { empresaId } = useParams();
  const navegarError = useNavigate();
  const [empresaExiste, setEmpresaExiste] = useState<boolean>(true);

  useEffect(() => {
    const empresaIdValido = [1, 2, 3, 4, 5]; //Eventualmente será substituído por uma chamada do banco de dados
    if (!empresaIdValido.includes(Number(empresaId))) {
      setEmpresaExiste(false);
      navegarError("/error");
    }
  }, [empresaId, navegarError]);

  if (!empresaExiste) {
    return null;
  }

  console.log('empresaId', empresaId);

  return (
    <>
      <Header />
      <EmpresaInfos />
      <Stats />
      <Maps />
    </>
  );
}
