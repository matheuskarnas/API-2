import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import Header from "../components/Header"
import * as yup from "yup"
import { supabase } from "../services/supabaseClient"
import React, { useEffect } from 'react';

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

     useEffect(() => {
    console.log("Erros de validação:", errors);
  }, [errors]);

  const onSubmit = async (data: any) => {
    console.log("Dados recebidos no submit:", data)
    const sexo = data.sexo === "masculino" ? "M" : "F";
    const {error } = await supabase
    .from('usuarios')
    .insert([{
      nome: data.nome,
      data_nascimento: data.data_nascimento,
      sexo: data.sexo,
      cpf: data.cpf,
      estado: data.estado,
      cidade: data.cidade,
      rua: data.rua,
      numero: data.numero,
      complemento: data.complemento,
      celular: data.celular,
      renda_familiar: data.renda_familiar,
      escolaridade: data.escolaridade,
    }])
    if (error) {
      console.error('Erro ao inserir:', error)
      alert('Erro ao enviar o formulário. Tente novamente.')
    } else {
      alert('Formulário enviado com sucesso!')
    }
  }

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
                <option value="masculino">M</option>
                <option value="feminino">F</option>
              </select>
              <p style={errorStyle}>{errors.sexo?.message}</p>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>CPF:*</label>
              <input style={inputStyle} {...register("cpf")} />
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
                <option value="1">Até 1 salário</option>
                <option value="2">1-3 salários</option>
                <option value="3">Mais de 3</option>
              </select>
              <p style={errorStyle}>{errors.renda_familiar?.message}</p>
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Escolaridade:*</label>
              <select style={inputStyle} {...register("escolaridade")}>
                <option value="">-</option>
                <option value="fundamental">Fundamental</option>
                <option value="medio">Médio</option>
                <option value="superior">Superior</option>
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
              }}
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </>
  )
}