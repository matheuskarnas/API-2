import { useState , useEffect} from "react";
import Header from "../components/Header";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

interface Empresa {
  id: number;
  nome: string;
  descricao: string;
  url_exclusiva: string;
  url_logo?: string;
}

interface EmpresaComStats extends Empresa {
  lojasCriadas?: number;
  cidadesImpactadas?: number;
}

const fetchStatsByUrl = async (empresaUrl: string): Promise<{ lojasCriadas: number; cidadesImpactadas: number }> => {
  let lojasCriadas = 0;
  let cidadesImpactadas = 0;

  try {
    const { data: patrocinador } = await supabase
      .from("patrocinadores")
      .select("id")
      .eq("url_exclusiva", empresaUrl)
      .single();

    if (patrocinador?.id) {
      const patrocinadorId = patrocinador.id;

      const { data: usuariosPatrocinados } = await supabase
        .from("patrocinadores_usuarios")
        .select("usuario_id")
        .eq("patrocinador_id", patrocinadorId);

      const usuariosIds = usuariosPatrocinados?.map(u => u.usuario_id) || [];

      if (usuariosIds.length > 0) {
        const { count: lojasCount } = await supabase
          .from("lojas")
          .select("*", { count: "exact", head: true })
          .in("usuario_id", usuariosIds);
        lojasCriadas = lojasCount || 0;

        const { data: lojasData } = await supabase
          .from("lojas")
          .select("localizacao_id")
          .in("usuario_id", usuariosIds);

        const { data: comunidadesUsuarios } = await supabase
          .from("usuarios_comunidades")
          .select("comunidade_id")
          .in("usuario_id", usuariosIds);

        const comunidadesUnicas = [...new Set(
          comunidadesUsuarios?.map(c => c.comunidade_id) || []
        )];

        const { data: comunidadesData } = await supabase
          .from("comunidades")
          .select("localizacao_id")
          .in("id", comunidadesUnicas);

        const localizacoesLojas = lojasData?.map(l => l.localizacao_id) || [];
        const localizacoesComunidades = comunidadesData?.map(c => c.localizacao_id) || [];

        const localizacoesUnicas = [...new Set([
          ...localizacoesLojas,
          ...localizacoesComunidades
        ])];
        cidadesImpactadas = localizacoesUnicas.length;
      }
    }
  } catch (error) {
    console.error("Erro ao buscar estatísticas para", empresaUrl, error);
  }

  return { lojasCriadas, cidadesImpactadas };
};

export function PatrociniosDisponiveis() {
  const location = useLocation();
  console.log ('dados recebidos em PatrociniosDisponiveis:', location.state);
  const [empresas, setEmpresas] = useState<EmpresaComStats[]>(location.state ? location.state : []);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStatsForEmpresas = async () => {
      setLoadingStats(true);
      const empresasComStats = await Promise.all(
        empresas.map(async (empresa) => {
          const stats = await fetchStatsByUrl(empresa.url_exclusiva);
          return { ...empresa, lojasCriadas: stats.lojasCriadas, cidadesImpactadas: stats.cidadesImpactadas };
        })
      );
      setEmpresas(empresasComStats);
      setLoadingStats(false);
    };

    fetchStatsForEmpresas();
  }, []);

  const empresasFiltradas = empresas.filter(empresa =>
    empresa.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loadingStats) {
    return (
      <>
        <Header />
        <main style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", textAlign: "center", color: "black" }}>
            Patrocínios Disponíveis
          </h1>
          <p style={{ textAlign: "center", color: "#666" }}>Carregando informações...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px", textAlign: "center", color: "black" }}>
          Patrocínios Disponíveis
        </h1>
      <div style={{
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: "20px",
          marginLeft: "20px",
          maxWidth: "400px",
          width: "calc(100% - 40px)"
        }}>
          <input
            type="text"
            placeholder="Pesquisar"
            style={{
              padding: "10px",
              border: "none",
              borderRadius: "8px",
              width: "100%",
              backgroundColor: "#f0f0f0",
              color: "black",
              fontSize: "16px",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              paddingLeft: "15px",
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {empresasFiltradas.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666" }}>
            Nenhuma empresa compatível encontrada.
          </p>
        ) : (
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
            {empresasFiltradas.map((empresa) => (
              <div
                key={empresa.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "20px",
                  width: "200px",
                  textAlign: "center",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                {empresa.url_logo && (
                  <img
                    src={empresa.url_logo}
                    alt={`Logo ${empresa.nome}`}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "contain",
                      marginBottom: "15px"
                    }}
                  />
                )}
                <h3 style={{ fontSize: "18px", color: "black", marginBottom: "10px" }}>
                  {empresa.nome}
                </h3>
                <div style={{display: "flex" , gap:"20px", paddingBottom:"15px" , paddingTop: "5px"}}>
                  <div style={{display: "flex" , gap:"3px"}}>
                    <img src="/assets/cidades.png" alt="cidades" style={{width: '26px', height: '26px'}} />
                    <h1 style={{color: "black", paddingTop: "5px"}}>{empresa.cidadesImpactadas !== undefined ? empresa.cidadesImpactadas : '0'}</h1>
                  </div>
                  <div style={{display: "flex" , gap:"3px"}}>
                    <img src="/assets/lojas.png" alt="lojas"  style={{width: '26px', height: '26px'}} />
                    <h1 style={{color: "black", paddingTop: "5px"}}>{empresa.lojasCriadas !== undefined ? empresa.lojasCriadas : '0'}</h1>
                  </div>
                </div>
                <Link
                  to={`/empresa/${empresa.url_exclusiva}`}
                  style={{
                    textDecoration: "none",
                    color: "white",
                    backgroundColor: "#007BFF",
                    padding: "10px 15px",
                    borderRadius: "4px",
                    marginTop: "auto",
                    width: "100%"
                  }}
                >
                  Pegar Patrocinio
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}