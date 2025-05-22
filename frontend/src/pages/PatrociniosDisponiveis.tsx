import { useState, useEffect } from "react";
import Header from "../components/Header";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { toast, ToastContainer } from 'react-toastify';

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

const handlePegarPatrocinio = async (patrocinadorId: number, patrocinadorUrl: string, navigate: (path: string) => void) => {
  try {
    const { data: ultimoUsuario, error: usuarioError } = await supabase
      .from("usuarios")
      .select("id")
      .order("id", { ascending: false })
      .limit(1)
      .single();

    if (usuarioError || !ultimoUsuario) {
      console.error("Erro ao buscar o último usuário:", usuarioError);
      return;
    }

    const usuarioId = ultimoUsuario.id;

    const { error: insercaoError } = await supabase
      .from("patrocinadores_usuarios")
      .insert([
        {
          usuario_id: usuarioId,
          patrocinador_id: patrocinadorId,
        },
      ]);

    if (insercaoError) {
      console.error("Erro ao inserir na tabela patrocinadores_usuarios:", insercaoError);
      return;
    }

    toast.success("Patrocínio registrado com sucesso!");

    navigate(`/empresa/${patrocinadorUrl}`);
  } catch (error) {
    console.error("Erro ao processar o patrocínio:", error);
    toast.error("Erro ao processar o patrocínio.");
  }
};

export function PatrociniosDisponiveis() {
  const location = useLocation();
  const planoId = location.state?.id || null;
  const [empresas, setEmpresas] = useState<EmpresaComStats[]>(
    location.state?.empresasData || []
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingStats, setLoadingStats] = useState(true);
  const navigate = useNavigate();

  const notify = (mensagem: String) => {
    return new Promise<void>((resolve) => {
      toast.error(mensagem, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        onClose: () => resolve(),
      });
    });
  };

  useEffect(() => {
    const chackId = async () => {
      if (!planoId) {
        await notify('Você não possui um plano. Redirecinando para a página de planos...');
        navigate('/usuario/planos');
      }
    }
    chackId();
  }, [planoId, navigate]);

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
        <Header empresa={ null } loading={ loadingStats }/>
        <ToastContainer />
        <main style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
          <h1 style={{ fontSize: "24px", marginBottom: "20px", textAlign: "center" }}>
            Patrocínios Disponíveis
          </h1>
          <p style={{ textAlign: "center", color: "#666" }}>Carregando informações...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header empresa={ null } loading={ loadingStats }/>
      <ToastContainer />
      <main style={{ fontFamily: "Arial, sans-serif" }}>
        <h1 style={{ fontSize: "24px", marginTop: "40px", textAlign: "center", color: "black" }}>
          Patrocínios Disponíveis
        </h1>
        <div className="flex justify-center mt-[30px]  W-full  ">
          <input
            type="text"
            placeholder="Pesquisar"
            className="p-2 border-none rounded-lg w-[200px] sm:w-[250px] md:w-[350px] h-[42px] md bg-gray-200 text-black text-base shadow-md pl-4"

            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {empresasFiltradas.length === 0 ? (
          <p style={{ textAlign: "center", marginTop: "30px", color: "#666" }}>
            Nenhuma empresa compatível encontrada.
          </p>
        ) : (
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center", marginTop: "30px" }}>
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
                <div style={{ display: "flex", gap: "20px", paddingBottom: "15px", paddingTop: "5px" }}>
                  <div style={{ display: "flex", gap: "3px" }}>
                    <img src="/assets/cidades.png" alt="cidades" style={{ width: '26px', height: '26px' }} />
                    <h1 style={{ color: "black", paddingTop: "5px" }}>{empresa.cidadesImpactadas !== undefined ? empresa.cidadesImpactadas : '0'}</h1>
                  </div>
                  <div style={{ display: "flex", gap: "3px" }}>
                    <img src="/assets/lojas.png" alt="lojas" style={{ width: '26px', height: '26px' }} />
                    <h1 style={{ color: "black", paddingTop: "5px" }}>{empresa.lojasCriadas !== undefined ? empresa.lojasCriadas : '0'}</h1>
                  </div>
                </div>
                <button
                  style={{
                    textDecoration: "none",
                    color: "white",
                    backgroundColor: "#007BFF",
                    padding: "10px 15px",
                    borderRadius: "4px",
                    marginTop: "auto",
                    width: "100%",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={async () => {
                    await handlePegarPatrocinio(empresa.id, empresa.url_exclusiva, navigate);
                  }}
                >
                  Pegar Patrocinio
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}