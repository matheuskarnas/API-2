import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Header from "../components/Header";
import * as yup from "yup";
import { supabase } from "../services/supabaseClient";
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer, ToastPosition } from 'react-toastify';

const schema = yup.object({
  nome: yup.string().required("Campo obrigatório"),
  data_nascimento: yup.string().required("Campo obrigatório"),
  sexo: yup.string().required("Campo obrigatório"),
  cpf: yup
    .string()
    .required("Campo obrigatório")
    .test("valid-cpf", "CPF inválido", (value) => {
      if (!value) return false;
      const cpf = value.replace(/\D/g, '');
      if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

      let soma = 0;
      for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
      let resto = (soma * 10) % 11;
      if (resto >= 10) resto = 0;
      if (resto !== parseInt(cpf.charAt(9))) return false;

      soma = 0;
      for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
      resto = (soma * 10) % 11;
      if (resto >= 10) resto = 0;
      return resto === parseInt(cpf.charAt(10));
    }),
  estado: yup.string().required("Campo obrigatório"),
  cidade: yup.string().required("Campo obrigatório"),
  rua: yup.string().required("Campo obrigatório"),
  numero: yup.string().required("Campo obrigatório"),
  complemento: yup.string(),
  celular: yup
    .string()
    .required("Campo obrigatório")
    .test("valid-celular", "Celular inválido", (value) => {
      if (!value) return false;
      const celular = value.replace(/\D/g, '');
      return /^\d{2}9\d{8}$/.test(celular);
    }),
  renda_familiar: yup.string().required("Campo obrigatório"),
  escolaridade: yup.string().required("Campo obrigatório"),
}).required();

export function CadastroUsuario() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [estados, setEstados] = useState([]);
  const [estadoSelecionado, setEstadoSelecionado] = useState("");
  const [cidades, setCidades] = useState([]);

  const notify = (mensagem: string, tipo: 'success' | 'error') => {
    return new Promise<void>((resolve) => {
      const toastConfig = {
        position: "top-center" as ToastPosition,
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        onClose: () => resolve(),
      };

      if (tipo === 'success') {
        toast.success(mensagem, toastConfig);
      } else if (tipo === 'error') {
        toast.error(mensagem, toastConfig);
      }
    });
  };

  useEffect(() => {
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
      .then((res) => res.json())
      .then((data) => setEstados(data.sort((a: { nome: string; }, b: { nome: any; }) => a.nome.localeCompare(b.nome))));
  }, []);

  useEffect(() => {
    if (estadoSelecionado) {
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado}/municipios`)
        .then((res) => res.json())
        .then((data) => setCidades(data.sort((a: { nome: string; }, b: { nome: any; }) => a.nome.localeCompare(b.nome))));
    } else {
      setCidades([]);
    }
  }, [estadoSelecionado]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      const dataNascimento = new Date(data.data_nascimento).toISOString();

      const { error: supabaseError } = await supabase
        .from('usuarios')
        .insert([{
          nome: data.nome,
          data_nascimento: dataNascimento,
          sexo: data.sexo,
          cpf: data.cpf.replace(/\D/g, ''),
          celular: data.celular.replace(/\D/g, ''),
          estado: data.estado,
          cidade: data.cidade,
          rua: data.rua,
          numero: data.numero,
          complemento: data.complemento,
          renda_familiar: data.renda_familiar,
          escolaridade: data.escolaridade,
          plano_id: 'price_1RRdZDGgNYbQYKnfstMCa5Wt',
        }])

      if (supabaseError) {
        if (supabaseError.code === '23505') {
          if (supabaseError.message.includes('cpf')) {
            await notify('CPF já cadastrado no sistema', 'error');
          } else if (supabaseError.message.includes('celular')) {
            await notify('Celular já cadastrado no sistema', 'error');
          }
        }
        throw supabaseError;
      }

      await notify('Cadastro realizado!', 'success');

      const nascimento = new Date(data.data_nascimento);
      const hoje = new Date();
      let idade = hoje.getFullYear() - nascimento.getFullYear();
      const mes = hoje.getMonth() - nascimento.getMonth();
      if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
      }

      function obterFaixaEtaria(idade: number): string | null {
        if (idade >= 18 && idade < 25) return '18-24';
        if (idade >= 25 && idade < 35) return '25-34';
        if (idade >= 36 && idade < 45) return '35-44';
        if (idade >= 46 && idade < 55) return '45-54';
        if (idade >= 55 && idade <= 64) return '55-64';
        if (idade > 64) return '65+';
        return null;
      }

      const faixaEtaria = obterFaixaEtaria(idade);
      console.log('Faixa etária:', faixaEtaria);



      const { data: perfis_patrocinio, error: perfis_patrocinioError } = await supabase
        .from('perfis_patrocinio')
        .select('*, patrocinador_id');

      if (perfis_patrocinioError) {
        console.error('Erro ao buscar perfis de patrocínio:', perfis_patrocinioError.message);
      } else {
        console.log('Perfis de patrocínio encontrados:', perfis_patrocinio);

        const empresasCompatíveis = perfis_patrocinio.filter((perfil: any) => {
          const estadoCompatível = perfil.estados.includes(data.estado);
          const escolaridadeCompatível = perfil.escolaridades.includes(data.escolaridade);
          const rendaCompatível = perfil.rendas_familiares.includes(data.renda_familiar);
          const faixaEtariaCompatível = perfil.faixas_etarias.includes(obterFaixaEtaria(idade));

          return estadoCompatível && escolaridadeCompatível && rendaCompatível && faixaEtariaCompatível;
        });

        const idsEmpresasCompatíveis = empresasCompatíveis.map((perfil: any) => perfil.patrocinador_id)
        console.log('IDs das empresas compatíveis:', idsEmpresasCompatíveis);

        if (idsEmpresasCompatíveis.length > 0) {
          const { data: empresasData, error: empresasError } = await supabase
            .from('patrocinadores')
            .select('*')
            .in('id', idsEmpresasCompatíveis);

          if (empresasError) {
            console.error('Erro ao buscar detalhes das empresas:', empresasError);

          } else if (empresasData) {
            console.log('Dados completos das empresas compatíveis:', empresasData);
            navigate('/usuario/patrocinios-disponiveis', { state: { empresasData, id: 'price_1RRdZDGgNYbQYKnfstMCa5Wt' } });
          }
        } else {
          navigate('/usuario/patrocinios-disponiveis', { state: { empresasData: [], id: 'price_1RRdZDGgNYbQYKnfstMCa5Wt' } });
        }
      }

    } catch (err) {
      console.error('Erro no cadastro:', err);

    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    backgroundColor: 'white',
    borderRadius: '5px',
    border: '1px solid #ccc',
    padding: '10px',
    width: '100%',
    color: 'black',
    fontSize: '14px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  }

  const labelStyle = {
    fontWeight: 'normal',
    color: '#000',
    fontSize: '14px',
    marginBottom: '5px',
  }

  const errorStyle = {
    color: 'red',
    fontSize: '12px',
  }

  return (
    <>
      <Header empresa={null} loading={false} />
      <ToastContainer />
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '40px',
      }}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            backgroundColor: '#eee',
            borderRadius: '12px',
            padding: '30px',
            width: '90%',
            marginBottom: '40px',
            maxWidth: '600px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3 style={{ textAlign: 'center', marginBottom: '25px', color: 'black' }}>Cadastro</h3>

          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>Nome: <span style={{ color: 'red' }}>*</span></label>
            <input style={inputStyle} {...register("nome")} />
            <p style={errorStyle}>{errors.nome?.message}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mb-4 sm:gap-4 sm:mb-6">
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Data Nascimento: <span style={{ color: 'red' }}>*</span></label>
              <input
                type="date"
                style={inputStyle}
                {...register("data_nascimento")}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                  .toISOString()
                  .split("T")[0]}
              />
              <p style={errorStyle}>{errors.data_nascimento?.message}</p>
            </div>
            <div className="w-full sm:w-[100px]">
              <label style={labelStyle}>Sexo: <span style={{ color: 'red' }}>*</span></label>
              <select style={inputStyle} {...register("sexo")}>
                <option value="">-</option>
                <option value="M">M</option>
                <option value="F">F</option>
              </select>
              <p style={errorStyle}>{errors.sexo?.message}</p>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>CPF: <span style={{ color: 'red' }}>*</span></label>
              <input
                style={inputStyle}
                {...register("cpf")}
                placeholder="000.000.000-00"
                onInput={(e) => {
                  let value = e.currentTarget.value.replace(/\D/g, '');
                  if (value.length > 3) value = value.replace(/^(\d{3})/, '$1.');
                  if (value.length > 7) value = value.replace(/^(\d{3})\.(\d{3})/, '$1.$2.');
                  if (value.length > 11) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})/, '$1.$2.$3-');
                  e.currentTarget.value = value.substring(0, 14);
                }}
              />
              <p style={errorStyle}>{errors.cpf?.message}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mb-4 sm:gap-4 sm:mb-6">
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Estado: <span style={{ color: 'red' }}>*</span></label>
              <select
                style={inputStyle}
                value={estadoSelecionado}
                {...register("estado")}
                onChange={(e) => {
                  setEstadoSelecionado(e.target.value);
                }}
              >
                <option value="">-</option>
                {estados.map((estado: { sigla: string; nome: string }) => (
                  <option
                    key={estado.sigla}
                    value={estado.sigla}
                  >
                    {estado.nome}
                  </option>
                ))}
              </select>
              <p style={errorStyle}>{errors.estado?.message}</p>
            </div>
            <div style={{ flex: 2 }}>
              <label style={labelStyle}>Cidade: <span style={{ color: 'red' }}>*</span></label>
              <select style={inputStyle} {...register("cidade")}>
                <option value="">-</option>
                {cidades.map((cidade: { nome: string }) => (
                  <option key={cidade.nome} value={cidade.nome}>
                    {cidade.nome}
                  </option>
                ))}
              </select>
              <p style={errorStyle}>{errors.cidade?.message}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mb-4 sm:gap-4 sm:mb-6">
            <div style={{ flex: 3 }}>
              <label style={labelStyle}>Rua: <span style={{ color: 'red' }}>*</span></label>
              <input style={inputStyle} {...register("rua")} />
              <p style={errorStyle}>{errors.rua?.message}</p>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Nº: <span style={{ color: 'red' }}>*</span></label>
              <input style={inputStyle} {...register("numero")} />
              <p style={errorStyle}>{errors.numero?.message}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mb-4 sm:gap-4 sm:mb-6">
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Complemento:</label>
              <input style={inputStyle} {...register("complemento")} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Celular: <span style={{ color: 'red' }}>*</span></label>
              <input
                style={inputStyle}
                {...register("celular")}
                placeholder="(XX) 9XXXX-XXXX"
                onInput={(e) => {
                  let value = e.currentTarget.value.replace(/\D/g, '');
                  if (value.length > 7) {
                    value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                  } else if (value.length > 2) {
                    value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
                  }
                  e.currentTarget.value = value.substring(0, 15);
                }}
                onKeyDown={(e) => {
                  if (!/[\d]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                maxLength={15}
              />
              <p style={errorStyle}>{errors.celular?.message}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 mb-4 sm:gap-4 sm:mb-6">
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Renda Familiar: <span style={{ color: 'red' }}>*</span></label>
              <select style={inputStyle} {...register("renda_familiar")}>
                <option value="">-</option>
                <option value="E">Até R$1.045,00</option>
                <option value="D">De R$1.045,01 a R$2.089,60</option>
                <option value="C">De R$2.089,61 a R$3.134,40</option>
                <option value="B">De R$3.134,41 a R$6.101,26</option>
                <option value="A">Acima de R$6.101,26</option>
              </select>
              <p style={errorStyle}>{errors.renda_familiar?.message}</p>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Escolaridade: <span style={{ color: 'red' }}>*</span></label>
              <select style={inputStyle} {...register("escolaridade")}>
                <option value="">-</option>
                <option value="EFI">Ensino Fundamental Incompleto</option>
                <option value="EFC">Ensino Fundamental Completo</option>
                <option value="EMI">Ensino Medio Incompleto</option>
                <option value="EMC">Ensino Medio Completo</option>
                <option value="ESI">Ensino Superior Incompleto</option>
                <option value="ESC">Ensino Superior Completo</option>
                <option value="POS">Pós-graduação(Especialização)</option>
              </select>
              <p style={errorStyle}>{errors.escolaridade?.message}</p>
            </div>
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
                opacity: loading ? 0.7 : 1,
              }}
              disabled={loading}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}