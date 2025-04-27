import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import Header from "../components/Header"
import { useEffect, useState } from "react"
import { supabase } from "../services/supabaseClient";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';

const schema = yup.object({
  estados: yup.array().min(1, "Selecione pelo menos um estado"),
  faixasEtarias: yup.array().min(1, "Selecione pelo menos uma faixa etária"),
  escolaridade: yup.array().min(1, "Selecione pelo menos uma escolaridade"),
  rendaFamiliar: yup.array().min(1, "Selecione pelo menos uma faixa de renda"),
}).required()

export function Patrocinio() {
  const [loading, setLoading] = useState(false);
  const [estados, setEstados] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const empresaData = location.state?.data;

  const notify = (mensagem: String) => {
    return new Promise<void>((resolve) => {
      toast.success(mensagem, {
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
    const fetchData = async () => {
      if (!empresaData) {
        await notify("Os dados da empresa não foram recebidos. Redirecionando para o cadastro de empresas.");
        navigate("/empresa/cadastro");
      }
      const checkUrlExists = async () => {
        try {
          const { data } = await supabase
            .from("patrocinadores")
            .select("url_exclusiva")
            .eq("url_exclusiva", empresaData.url)
            .single();

          if (data) {
            await notify('O Url já está em uso por outra empresa. Redirecionando para o cadastro de empresas!');
            navigate("/empresa/cadastro");
          }

        } catch (err) {
          console.error("Erro ao verificar URL:", err);
        }
      };

      await checkUrlExists();
    };

    fetchData();
  }, [empresaData, navigate]);

  useEffect(() => {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((res) => res.json())
      .then((data) => setEstados(data.sort((a: { nome: string }, b: { nome: string }) => a.nome.localeCompare(b.nome))));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      estados: [],
      faixasEtarias: [],
      escolaridade: [],
      rendaFamiliar: [],
    },
  });

  const checkboxGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '15px',
  }

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      const { data: patrocinadoresData, error: patrocinadoresError } = await supabase
        .from("patrocinadores")
        .insert([
          {
            nome: empresaData.nome,
            url_exclusiva: empresaData.url,
            url_logo: empresaData.logo,
            descricao: empresaData.apresentacao,
            twitter: empresaData.twitter,
            whatsapp: empresaData.whatsapp,
            url_site: empresaData.site,
            tiktok: empresaData.tiktok,
            linkedin: empresaData.linkedin,
            instagram: empresaData.instagram,
            facebook: empresaData.facebook,
            kawai: empresaData.kawai,
          },
        ])
        .select("id")
        .single();

      if (patrocinadoresError) {
        console.log("Erro ao inserir patrocinadores:", patrocinadoresError);
        setError(`Erro ao inserir patrocinadores: ${patrocinadoresError.message}`);
        throw patrocinadoresError;
      }

      const id = patrocinadoresData.id;

      const { error: perfisError } = await supabase
        .from('perfis_patrocinio')
        .insert([{
          patrocinador_id: id,
          estados: data.estados,
          faixas_etarias: data.faixasEtarias,
          escolaridades: data.escolaridade,
          rendas_familiares: data.rendaFamiliar,
        }]);

      if (perfisError) {
        console.log('Erro ao inserir perfis de patrocínio:', perfisError);
        setError(`Erro ao inserir perfis de patrocínio: ${perfisError.message}`);
        throw perfisError;
      }

      await notify('Cadastro finalizado!');
      navigate(`/empresa/${empresaData.url}`);

    } catch (err) {
      console.error("Erro no cadastro:", err);
      if (err instanceof Error) {
        setError(`Erro: ${err.message}`);
      } else if (typeof err === "object" && err !== null && "message" in err) {
        setError(`Erro: ${(err as any).message}`);
      } else {
        setError("Erro desconhecido ao cadastrar. Verifique o console para mais detalhes.");
      }
    } finally {
      setLoading(false);
    }
  };

  const sectionStyle = { marginBottom: '25px', color: '#000' }

  return (
    <>
      <Header />
      <ToastContainer />
      {empresaData ? (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "40px", flexDirection: "column", alignItems: "center" }}>
          <div style={{
            width: '90%',
            maxWidth: '600px',
            marginTop: '20px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              marginBottom: '8px',
              fontSize: '14px',
              color: '#555',
              position: 'relative',
            }}>
              <span style={{
                fontWeight: 'bold',
                color: '#999',
                zIndex: 2,
                backgroundColor: 'white',
                padding: '0 5px'
              }}>1</span>
              <span style={{
                fontWeight: 'bold',
                color: '#0080ff',
                zIndex: 2,
                backgroundColor: 'white',
                padding: '0 5px'
              }}>2</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              height: '6px',
              position: 'relative',
            }}>
              <div style={{
                width: '50%',
                height: '100%',
                backgroundColor: '#0080ff',
                clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)',
              }}></div>
              <div style={{
                width: '50%',
                height: '100%',
                backgroundColor: '#0080ff',
                clipPath: 'polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)',
              }}></div>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-around',
              marginTop: '8px',
              width: '100%',
            }}>
              <span style={{
                visibility: 'hidden',
                pointerEvents: 'none',
              }}>
                Perfil dos usuários
              </span>
              <span style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#0080ff',
                backgroundColor: 'white',
              }}>
                Perfil dos usuários
              </span>
            </div>
            <p style={{
              textAlign: 'center',
              marginTop: '8px',
              fontSize: '13px',
              color: '#666',
            }}>
              Escolha as características dos usuários que deseja patrocinar
            </p>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              backgroundColor: "#eee",
              borderRadius: "12px",
              padding: "30px",
              width: "100%",
              marginTop: "40px",
              maxWidth: "500px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 style={{ textAlign: "center", marginBottom: "25px", color: "black" }}>Perfil para patrocínio</h3>

            <div style={sectionStyle}>
              <div style={{ marginBottom: '10px' }}>
                <label>Estados que deseja patrocinar:</label>
                <button
                  type="button"
                  onClick={() => {
                    const allEstados = estados.map((estado: { sigla: string; }) => estado.sigla);
                    const currentValues = watch("estados") || [];
                    if (currentValues.length === allEstados.length) {
                      setValue("estados", [], { shouldValidate: true });
                    } else {
                      setValue("estados", allEstados, { shouldValidate: true });
                    }
                  }}
                  style={{
                    backgroundColor: '#1692FF',
                    color: '#333',
                    border: '1px solid #ccc',
                    padding: '3px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    marginLeft: '10px',
                    transition: 'background-color 0.3s, color 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#16AAFF';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1692FF';
                    e.currentTarget.style.color = '#333';
                  }}
                >
                  {watch("estados")?.length === 27 ? 'Desmarcar Todos' : 'Selecionar Todos'}
                </button>
              </div>
              <div style={checkboxGroupStyle}>
                {estados.map((estado: { sigla: string; nome: string }) => (
                  <label key={estado.nome}>
                    <input type="checkbox" value={estado.sigla} {...register("estados")} />
                    {' '}{estado.sigla}
                  </label>
                ))}
              </div>
              <p style={{ color: 'red' }}>{errors.estados?.message}</p>
            </div>

            <div style={sectionStyle}>
              <div style={{ marginBottom: '10px' }}>
                <label>Faixas etárias:</label>
                <button
                  type="button"
                  onClick={() => {
                    const allFaixas = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
                    const currentValues = watch("faixasEtarias") || [];
                    if (currentValues.length === allFaixas.length) {
                      setValue("faixasEtarias", [], { shouldValidate: true });
                    } else {
                      setValue("faixasEtarias", allFaixas, { shouldValidate: true });
                    }
                  }}
                  style={{
                    backgroundColor: '#1692FF',
                    color: '#333',
                    border: '1px solid #ccc',
                    padding: '3px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    marginLeft: '10px',
                    transition: 'background-color 0.3s, color 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#16AAFF';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1692FF';
                    e.currentTarget.style.color = '#333';
                  }}
                >
                  {watch("faixasEtarias")?.length === 6 ? 'Desmarcar Todos' : 'Selecionar Todos'}
                </button>
              </div>
              <div style={checkboxGroupStyle}>
                {[
                  { label: '18 a 24', value: '18-24' },
                  { label: '25 a 34', value: '25-34' },
                  { label: '35 a 44', value: '35-44' },
                  { label: '45 a 54', value: '45-54' },
                  { label: '55 a 64', value: '55-64' },
                  { label: '65+', value: '65+' }
                ].map((faixa, index) => (
                  <label key={index}>
                  <input type="checkbox" value={faixa.value} {...register("faixasEtarias")} />
                  {' '}{faixa.label}
                  </label>
                ))}
              </div>
              <p style={{ color: 'red' }}>{errors.faixasEtarias?.message}</p>
            </div>

            <div style={sectionStyle}>
              <div style={{ marginBottom: '10px' }}>
                <label>Escolaridade:</label>
                <button
                  type="button"
                  onClick={() => {
                    const allEscolaridade = ['EFI', 'EFC', 'EMI', 'EMC', 'ESI', 'ESC', 'POS'];
                    const currentValues = watch("escolaridade") || [];
                    if (currentValues.length === allEscolaridade.length) {
                      setValue("escolaridade", [], { shouldValidate: true });
                    } else {
                      setValue("escolaridade", allEscolaridade, { shouldValidate: true });
                    }
                  }}
                  style={{
                    backgroundColor: '#1692FF',
                    color: '#333',
                    border: '1px solid #ccc',
                    padding: '3px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    marginLeft: '10px',
                    transition: 'background-color 0.3s, color 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#16AAFF';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1692FF';
                    e.currentTarget.style.color = '#333';
                  }}
                >
                  {watch("escolaridade")?.length === 7 ? 'Desmarcar Todos' : 'Selecionar Todos'}
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {[
                  ["Ensino Fundamental Incompleto", "EFI"],
                  ["Ensino Fundamental Completo", "EFC"],
                  ["Ensino Médio Incompleto", "EMI"],
                  ["Ensino Médio Completo", "EMC"],
                  ["Ensino Superior Incompleto", "ESI"],
                  ["Ensino Superior Completo", "ESC"],
                  ["Pós-graduação (Especialização) +", "POS"]
                ].map((item, index) => (
                  <label key={index}>
                    <input type="checkbox" value={item[1]} {...register("escolaridade")} />
                    {' '}{item[0]}
                  </label>
                ))}
              </div>
              <p style={{ color: 'red' }}>{errors.escolaridade?.message}</p>
            </div>

            <div style={sectionStyle}>
              <div style={{ marginBottom: '10px' }}>
                <label>Renda Familiar:</label>
                <button
                  type="button"
                  onClick={() => {
                    const allRendas = ['A', 'B', 'C', 'D', 'E'];
                    const currentValues = watch("rendaFamiliar") || [];
                    if (currentValues.length === allRendas.length) {
                      setValue("rendaFamiliar", [], { shouldValidate: true });
                    } else {
                      setValue("rendaFamiliar", allRendas, { shouldValidate: true });
                    }
                  }}
                  style={{
                    backgroundColor: '#1692FF',
                    color: '#333',
                    border: '1px solid #ccc',
                    padding: '3px',
                    borderRadius: '6px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    marginLeft: '10px',
                    transition: 'background-color 0.3s, color 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#16AAFF';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1692FF';
                    e.currentTarget.style.color = '#333';
                  }}
                >
                  {watch("rendaFamiliar")?.length === 5 ? 'Desmarcar Todos' : 'Selecionar Todos'}
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {[
                  ["E", "Até R$1.045,00"],
                  ["D", "De R$1.045,01 a R$2.089,60"],
                  ["C", "De R$2.089,61 a R$3.134,40"],
                  ["B", "De R$3.134,41 a R$6.101,26"],
                  ["A", "Acima de R$6.101,26"]
                ].map((classe, index) => (
                  <label key={index}>
                    <input type="checkbox" value={classe[0]} {...register("rendaFamiliar")} />
                    {' '}Classe {classe[0]} - {classe[1]}
                  </label>
                ))}
              </div>
              <p style={{ color: 'red' }}>{errors.rendaFamiliar?.message}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="submit"
                style={{
                  backgroundColor: '#0080ff',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 30px',
                  borderRadius: '8px',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                {loading ? 'Enviando...' : 'Cadastrar'}
              </button>
            </div>

            {error && <p style={{ color: 'red', textAlign: 'center', marginTop: '15px' }}>{error}</p>}
          </form>
        </div>
      ) : (
        <p style={{ textAlign: "center", color: "red", marginTop: "20px" }}>
          Redirecionando para o cadastro de empresas...
        </p>
      )}
    </>
  );
}