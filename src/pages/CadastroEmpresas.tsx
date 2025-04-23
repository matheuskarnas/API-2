import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { supabase } from "../services/supabaseClient";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import twitterIcon from "../../public/assets/x.png";
import whatsappIcon from "../../public/assets/whatsapp.png";
import globeIcon from "../../public/assets/web.png";
import tiktokIcon from "../../public/assets/tiktok.webp";
import linkedinIcon from "../../public/assets/linkedin.png";
import instagramIcon from "../../public/assets/instagram.webp";
import facebookIcon from "../../public/assets/facebook.png";
import kawaiIcon from "../../public/assets/kawai.avif";
import Header from "../components/Header";

const schema = Yup.object().shape({
  nome: Yup.string().required("Campo obrigatório"),
  url: Yup.string()
    .required("Campo obrigatório")
    .matches(/^[a-z0-9-]+$/, "A URL deve conter apenas letras minúsculas, números e hífens"),
  logo: Yup.string()
    .required("Campo obrigatório")
    .url("Deve ser uma URL válida"),
  apresentacao: Yup.string()
    .required("Campo obrigatório")
    .min(50, "A apresentação deve ter pelo menos 50 caracteres"),

  twitter: Yup.string().url("URL inválida").notRequired(),
  whatsapp: Yup.string().url("URL inválida").notRequired(),
  site: Yup.string().url("URL inválida").notRequired(),
  tiktok: Yup.string().url("URL inválida").notRequired(),
  linkedin: Yup.string().url("URL inválida").notRequired(),
  instagram: Yup.string().url("URL inválida").notRequired(),
  facebook: Yup.string().url("URL inválida").notRequired(),
  kawai: Yup.string().url("URL inválida").notRequired(),
});

type SocialField =
  | "twitter"
  | "whatsapp"
  | "site"
  | "tiktok"
  | "linkedin"
  | "instagram"
  | "facebook"
  | "kawai";

const socialFields: { icon: string; name: SocialField }[] = [
  { icon: twitterIcon, name: "twitter" },
  { icon: whatsappIcon, name: "whatsapp" },
  { icon: globeIcon, name: "site" },
  { icon: tiktokIcon, name: "tiktok" },
  { icon: linkedinIcon, name: "linkedin" },
  { icon: instagramIcon, name: "instagram" },
  { icon: facebookIcon, name: "facebook" },
  { icon: kawaiIcon, name: "kawai" },
];

export function CadastroEmpresas() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    
    try {
      console.log('Verificando URL existente...');
      const { data: existingCompany } = await supabase
        .from('patrocinadores')
        .select('url_exclusiva')
        .eq('url_exclusiva', data.url)
        .single();
      console.log('Resultado da verificação:', existingCompany);

      if (existingCompany) {
        throw new Error('Esta URL já está em uso por outra empresa');
      }

      const { error: insertError } = await supabase
        .from('patrocinadores')
        .insert([{
          nome: data.nome,
          url_exclusiva: data.url,
          url_logo: data.logo,
          descricao: data.apresentacao,
          twitter: data.twitter || null,
          whatsapp: data.whatsapp || null,
          url_site: data.site || null,
          tiktok: data.tiktok || null,
          linkedin: data.linkedin || null,
          instagram: data.instagram || null,
          facebook: data.facebook || null,
          kawai: data.kawai || null,
        }]);

      if (insertError) {
        throw insertError;
      }

      const { data: maxIdData, error: maxIdError } = await supabase
        .from('patrocinadores')
        .select('id')
        .order('id', { ascending: false })
        .single();

      if (maxIdError) {
        throw maxIdError;
      }

      navigate('/empresa/patrocinio', { state: { success: true, id: maxIdData?.id } });

    } catch (err) {
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
  };

  const labelStyle = {
    fontWeight: 'normal',
    color: '#000',
    fontSize: '14px',
    marginBottom: '5px',
  };

  const errorStyle = {
    color: 'red',
    fontSize: '12px',
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Header />
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          backgroundColor: '#eee',
          borderRadius: '12px',
          padding: '30px',
          width: '90%',
          marginTop: '40px',
          marginBottom: '40px',
          maxWidth: '600px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h3 style={{ textAlign: 'center', marginBottom: '25px', color: 'black' }}>Cadastro</h3>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Nome da Empresa: <span style={{ color: 'red' }}>*</span></label>
          <input style={inputStyle} {...register("nome")} />
          <p style={errorStyle}>{errors.nome?.message}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
          <div>
            <label style={labelStyle}>URL personalizada: <span style={{ color: 'red' }}>*</span></label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input 
                style={{ ...inputStyle, borderRadius: '0 5px 5px 0', width: '100%' }} 
                {...register("url")} 
                placeholder="sua-empresa"
              />
            </div>
            <p style={errorStyle}>{errors.url?.message}</p>
          </div>
          
          <div>
            <label style={labelStyle}>URL da Logo: <span style={{ color: 'red' }}>*</span></label>
            <input 
              style={inputStyle} 
              {...register("logo")} 
              placeholder="https://exemplo.com/logo.png" 
            />
            <p style={errorStyle}>{errors.logo?.message}</p>
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Apresentação: <span style={{ color: 'red' }}>*</span></label>
          <textarea 
            style={inputStyle} 
            {...register("apresentacao")} 
            rows={5} 
            placeholder="Descreva sua empresa em detalhes (mínimo 50 caracteres)"
          />
          <p style={errorStyle}>{errors.apresentacao?.message}</p>
        </div>

        <h4 style={{ marginBottom: '15px', color: '#333' }}>Redes Sociais (opcional)</h4>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '25px'}}>
          {socialFields.map((item, index) => (
            <div key={index} style={{display: 'flex', alignItems: 'center', gap: '10px'}} >
              <img src={item.icon} alt={item.name} style={{ width: '24px', height: '24px' }} />
              <input 
                {...register(item.name)} 
                style={inputStyle} 
                placeholder={`https://${item.name}.com/seu-perfil`} 
              />
            </div>
          ))}
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
  );
}