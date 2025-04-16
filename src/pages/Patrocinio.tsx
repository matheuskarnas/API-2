import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import Header from "../components/Header"

const schema = yup.object({
  estados: yup.array().min(1, "Selecione pelo menos um estado"),
  faixasEtarias: yup.array().min(1, "Selecione pelo menos uma faixa etária"),
  escolaridade: yup.array().min(1, "Selecione pelo menos uma escolaridade"),
  rendaFamiliar: yup.array().min(1, "Selecione pelo menos uma faixa de renda"),
}).required()

export function Patrocinio() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data: any) => {
    console.log(data)
  }

  const checkboxGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '15px',
  }
  

  const sectionStyle = { marginBottom: '25px', color: '#000' }

  return (
    <>
      <Header />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', marginBottom: '40px' }}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            backgroundColor: '#eee',
            borderRadius: '12px',
            padding: '30px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h3 style={{ textAlign: 'center', marginBottom: '25px', color: 'black' }}>Perfil para patrocínio</h3>

          {/* Estados */}
          <div style={sectionStyle}>
            <label>Estados que deseja patrocinar:</label>
            <div style={checkboxGroupStyle}>
              {['SP', 'RJ', 'MG', 'CE', 'BA'].map((estado) => (
                <label key={estado}>
                  <input type="checkbox" value={estado} {...register("estados")} />
                  {' '}{estado}
                </label>
              ))}
            </div>
            <p style={{ color: 'red' }}>{errors.estados?.message}</p>
          </div>

          {/* Faixas Etárias */}
          <div style={sectionStyle}>
            <label>Faixas etárias:</label>
            <div style={checkboxGroupStyle}>
              {['18 a 24', '25 a 34', '35 a 44', '45 a 54', '55 a 64', '65+'].map((faixa, index) => (
                <label key={index}>
                  <input type="checkbox" value={faixa} {...register("faixasEtarias")} />
                  {' '}{faixa}
                </label>
              ))}
            </div>
            <p style={{ color: 'red' }}>{errors.faixasEtarias?.message}</p>
          </div>

          {/* Escolaridade */}
          <div style={sectionStyle}>
            <label>Escolaridade:</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {[
                "Ensino Fundamental Incompleto",
                "Ensino Fundamental",
                "Ensino Médio Incompleto",
                "Ensino Médio Completo",
                "Ensino Superior Incompleto",
                "Ensino Superior Completo",
                "Pós-graduação (Especialização) +"
              ].map((item, index) => (
                <label key={index}>
                  <input type="checkbox" value={item} {...register("escolaridade")} />
                  {' '}{item}
                </label>
              ))}
            </div>
            <p style={{ color: 'red' }}>{errors.escolaridade?.message}</p>
          </div>

          {/* Renda Familiar */}
          <div style={sectionStyle}>
            <label>Renda familiar:</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {[
                "Classe E - Até R$ 2.824",
                "Classe D - R$ 2.824 a R$ 5.648",
                "Classe C - R$ 5.648 a R$ 14.120",
                "Classe B - R$ 14.120 a R$ 28.240",
                "Classe A - Acima de R$ 28.240",
              ].map((classe, index) => (
                <label key={index}>
                  <input type="checkbox" value={classe} {...register("rendaFamiliar")} />
                  {' '}{classe}
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
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
