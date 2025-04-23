import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Header from "../components/Header";
import * as yup from "yup";
import { supabase } from "../services/supabaseClient";
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  nome: yup.string().required("Campo obrigatório"),
  data_nascimento: yup.string().required("Campo obrigatório"),
  sexo: yup.string().required("Campo obrigatório"),
  cpf: yup.string().required("Campo obrigatório"),
  estado: yup.string().required("Campo obrigatório"),
  cidade: yup.string().required("Campo obrigatório"),
  rua: yup.string().required("Campo obrigatório"),
  numero: yup.string().required("Campo obrigatório"),
  complemento: yup.string(),
  celular: yup.string().required("Campo obrigatório"),
  renda_familiar: yup.string().required("Campo obrigatório"),
  escolaridade: yup.string().required("Campo obrigatório"),
}).required()

export function CadastroUsuario() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    
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
        }])

        if (supabaseError) {
          if (supabaseError.code === '23505') {
            if (supabaseError.message.includes('cpf')) {
              throw new Error('CPF já cadastrado no sistema');
            } else if (supabaseError.message.includes('celular')) {
              throw new Error('Celular já cadastrado no sistema');
            }
          }
          throw supabaseError;
        }

      alert('Cadastro realizado com sucesso!');

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

      const idsEmpresasCompatíveis = empresasCompatíveis.map((perfil:any)=> perfil.patrocinador_id)
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
            navigate('/empresa/patrocinios-disponiveis', { state: empresasData });
          }
        } else {
          navigate('/empresa/patrocinios-disponiveis', { state: [] }); 
        }
    }

  } catch (err) {

    console.error('Erro no cadastro:', err);
    if (err instanceof Error) {
      setError(err.message || 'Erro ao cadastrar. Tente novamente.');
    } else {
      setError('Erro ao cadastrar. Tente novamente.');
    }
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
      <Header />
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

          {error && (
            <div style={{ 
              color: 'red', 
              textAlign: 'center', 
              marginBottom: '20px',
              backgroundColor: '#ffeeee',
              padding: '10px',
              borderRadius: '5px'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>Nome:*</label>
            <input style={inputStyle} {...register("nome")} />
            <p style={errorStyle}>{errors.nome?.message}</p>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Data Nascimento:*</label>
              <input type="date" style={inputStyle} {...register("data_nascimento")} />
              <p style={errorStyle}>{errors.data_nascimento?.message}</p>
            </div>
            <div style={{ width: '100px' }}>
              <label style={labelStyle}>Sexo:*</label>
              <select style={inputStyle} {...register("sexo")}>
                <option value="">-</option>
                <option value="M">M</option>
                <option value="F">F</option>
              </select>
              <p style={errorStyle}>{errors.sexo?.message}</p>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>CPF:*</label>
              <input 
                style={inputStyle} 
                {...register("cpf")} 
                placeholder="Somente números"
              />
              <p style={errorStyle}>{errors.cpf?.message}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Estado:*</label>
              <select style={inputStyle} {...register("estado")}>
                <option value="">-</option>
                <option value="SP">SP</option>
                <option value="RJ">RJ</option>
                {/* outros estados... */}
              </select>
              <p style={errorStyle}>{errors.estado?.message}</p>
            </div>
            <div style={{ flex: 2 }}>
              <label style={labelStyle}>Cidade:*</label>
              <select style={inputStyle} {...register("cidade")}>
                <option value="">-</option>
                <option value="São Paulo">São Paulo</option>
                <option value="Rio de Janeiro">Rio de Janeiro</option>
                <option value="Taubaté">Taubaté</option>
                <option value="Pindamonhangaba">Pindamonhangaba</option>
                <option value="Guaratingueta">Guaratingueta</option>
                <option value="Campos de jordão">Campos de jordão</option>
                <option value="Jacareí">Jacareí</option>
                <option value="Campinas">Campinas</option>
                {/* outras cidades... */}
              </select>
              <p style={errorStyle}>{errors.cidade?.message}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 3 }}>
              <label style={labelStyle}>Rua:*</label>
              <input style={inputStyle} {...register("rua")} />
              <p style={errorStyle}>{errors.rua?.message}</p>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Nº:*</label>
              <input style={inputStyle} {...register("numero")} />
              <p style={errorStyle}>{errors.numero?.message}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Complemento:</label>
              <input style={inputStyle} {...register("complemento")} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Celular:*</label>
              <input style={inputStyle} {...register("celular")} />
              <p style={errorStyle}>{errors.celular?.message}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Renda Familiar:*</label>
              <select style={inputStyle} {...register("renda_familiar")}>
                <option value="">-</option>
                <option value="E">Até 1 salário</option>
                <option value="D">1-3 salários</option>
                <option value="C">Mais de 3</option>
              </select>
              <p style={errorStyle}>{errors.renda_familiar?.message}</p>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Escolaridade:*</label>
              <select style={inputStyle} {...register("escolaridade")}>
                <option value="">-</option>
                <option value="EFI">Ensino Fundamental Incompleto</option>
                <option value="EFC">Ensino Fundamental Completo</option>
                <option value="EMI">Ensino Medio Incompleto</option>
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