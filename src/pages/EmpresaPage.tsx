import { useParams } from "react-router-dom";
import { EmpresaInfos } from "../components/EmpresaInfos";
import Header from "../components/Header";
import Maps from "../components/Maps";
import { Stats } from "../components/Stats";

export function EmpresaPage() {
  const { empresaId } = useParams();

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
