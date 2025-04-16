import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import twitterIcon from "../../public/assets/x.png";
import whatsappIcon from "../../public/assets/whatsapp.png";
import globeIcon from "../../public/assets/web.png";
import tiktokIcon from "../../public/assets/tiktok.webp";
import linkedinIcon from "../../public/assets/linkedin.png";
import instagramIcon from "../../public/assets/instagram.webp";
import facebookIcon from "../../public/assets/facebook.png";
import kwaiIcon from "../../public/assets/kawai.avif";
import Header from "../components/Header";

const schema = Yup.object().shape({
  nome: Yup.string().required(),
  url: Yup.string().required(),
  logo: Yup.string().required(),
  apresentacao: Yup.string().required(),

  twitter: Yup.string().url().notRequired(),
  whatsapp: Yup.string().url().notRequired(),
  site: Yup.string().url().notRequired(),
  tiktok: Yup.string().url().notRequired(),
  linkedin: Yup.string().url().notRequired(),
  instagram: Yup.string().url().notRequired(),
  facebook: Yup.string().url().notRequired(),
  kwai: Yup.string().url().notRequired(),
});

type SocialField =
  | "twitter"
  | "whatsapp"
  | "site"
  | "tiktok"
  | "linkedin"
  | "instagram"
  | "facebook"
  | "kwai";

const socialFields: { icon: string; name: SocialField }[] = [
  { icon: twitterIcon, name: "twitter" },
  { icon: whatsappIcon, name: "whatsapp" },
  { icon: globeIcon, name: "site" },
  { icon: tiktokIcon, name: "tiktok" },
  { icon: linkedinIcon, name: "linkedin" },
  { icon: instagramIcon, name: "instagram" },
  { icon: facebookIcon, name: "facebook" },
  { icon: kwaiIcon, name: "kwai" },
];

export function CadastroEmpresas() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
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

        <div>
          <label style={labelStyle}>Nome da Empresa: <span style={{ color: 'red' }}>*</span></label>
          <input style={inputStyle} {...register("nome")} />
          <p style={errorStyle}>{errors.nome?.message}</p>
        </div>

        <div className="grid grid-cols-2 gap-4" style={{ marginBottom: '15px' }}>
          <div>
            <label style={labelStyle}>Url personalizada: <span style={{ color: 'red' }}>*</span></label>
            <input style={inputStyle} {...register("url")} />
            <p style={errorStyle}>{errors.url?.message}</p>
          </div>
          <div>
            <label style={labelStyle}>Logo: <span style={{ color: 'red' }}>*</span></label>
            <input style={inputStyle} {...register("logo")} />
            <p style={errorStyle}>{errors.logo?.message}</p>
          </div>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Apresentação: <span style={{ color: 'red' }}>*</span></label>
          <textarea style={inputStyle} {...register("apresentacao")} rows={3} />
          <p style={errorStyle}>{errors.apresentacao?.message}</p>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginBottom: '15px'}}>
        {socialFields.map((item, index) => (
          <div key={index} style={{display: 'flex', alignItems: 'center', gap: '10px'}} >
            <img src={item.icon} alt={item.name} style={{ width: '24px', height: '24px' }} />
            <input {...register(item.name)} style={inputStyle} placeholder={`Link do ${item.name}`} />
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
            }}
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
}
