<!-- <div align="center">
    <img src="/public/assets/debuggersLogo.png"/>
</div> -->

# Objetivo do Projeto

A aplicação tem como objetivo fornecer uma plataforma digital intuitiva e acessível para divulgar as empresas patrocinadoras do programa da Helpnei, destacando o impacto positivo de seus investimentos no empreendedorismo local. Através de uma interface clara e objetiva, a aplicação exibe dados essenciais sobre o alcance do patrocínio, incluindo o número de lojas criadas, usuários impactados, cidades atendidas e comunidades beneficiadas.

Além de promover transparência e valorização dos patrocinadores, o projeto também serve como um canal de propaganda para as empresas envolvidas. O design prioriza a simplicidade e a usabilidade, garantindo que as informações sejam apresentadas de forma clara e direta. Para reforçar o impacto visual, a aplicação conta com um mapa interativo que destaca geograficamente as comunidades alcançadas pelo programa.

###  Entregas de Sprints

| Sprint |          Data           | Status       |                                               Histórico                                               |
| :----: | :---------------------: | :----------- | :---------------------------------------------------------------------------------------------------: |
|   01   | 10/03/2025 a 30/03/2025 | ✔️ Concluída | [ver relatório](https://github.com/matheuskarnas/API-2-documentation/blob/main/README.md) |
|   02   | 07/04/2025 a 27/04/2025 | Em breve     |                                                                                                       |
|   03   | 05/05/2025 a 25/05/2025 | Em breve     |                                                                                                       |

# 🛠️ Tecnologias

As seguintes ferramentas, linguagens, bibliotecas e tecnologias foram usadas na construção do projeto:

<img src="https://img.shields.io/badge/Figma-CED4DA?style=for-the-badge&logo=figma&logoColor=DC143C" alt="Figma" /> 
<img src="https://img.shields.io/badge/TypeScript-CED4DA?style=for-the-badge&logo=typescript&logoColor=007ACC" alt="Typescript" />
<img src="https://img.shields.io/badge/HTML5-CED4DA?style=for-the-badge&logo=html5&logoColor=E34F26" alt="HTML" /> 
<img src="https://img.shields.io/badge/CSS3-CED4DA?style=for-the-badge&logo=css3&logoColor=1572B6" alt="CSS" /> 	
<img src="https://img.shields.io/badge/React-CED4DA?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /> 
<img src="https://img.shields.io/badge/GitHub-CED4DA?style=for-the-badge&logo=github&logoColor=20232A" alt="GitHub" /> 
<img src="https://img.shields.io/badge/Google%20Maps-CED4DA?style=for-the-badge&logo=google-maps&logoColor=0D96F6" alt="Google Docs" />
<img src="https://img.shields.io/badge/supabase-CED4DA?style=for-the-badge&logo=supabase" alt="Supabase" />
<img src="https://img.shields.io/badge/vite-CED4DA?style=for-the-badge&logo=vite" alt="vite" />
<img src="https://img.shields.io/badge/tailwindcss-CED4DA?style=for-the-badge&logo=tailwindcss" alt="tailwindcss" />
<img src="https://img.shields.io/badge/vercel-CED4DA?style=for-the-badge&logo=vercel&logoColor=000" alt="vercel" />



# Como baixar e rodar um projeto React com Vite localmente

## 📥 Pré-requisitos

Antes de começar, certifique-se de ter instalado:
- [Node.js](https://nodejs.org/) (Recomendado: versão LTS)
- [Git](https://git-scm.com/)

Verifique se estão instalados corretamente rodando:
```sh
node -v   # Verifica a versão do Node.js
yarn -v   # Se estiver usando Yarn (opcional)
npm -v    # Se estiver usando npm
git --version  # Verifica a versão do Git
```

## 🚀 Passos para baixar e rodar o projeto

### 1️⃣ Clonar o repositório
Abra o terminal e execute:
```sh
git clone https://github.com/matheuskarnas/API-2.git
```

### 2️⃣ Acessar a pasta do projeto
```sh
cd API-2
```

### 3️⃣ Instalar as dependências
Se estiver usando npm:
```sh
npm install
```
Se estiver usando Yarn:
```sh
yarn install
```
Se estiver usando pnpm:
```sh
pnpm install
```

### 4️⃣ Rodar o projeto localmente
Se estiver usando npm:
```sh
npm run dev
```
Se estiver usando Yarn:
```sh
yarn dev
```
Se estiver usando pnpm:
```sh
pnpm dev
```

O terminal mostrará um link como este:
```
  Local: http://localhost:5173/
```
Acesse no navegador para visualizar o projeto.

## 🛠️ Comandos úteis

Rodar o servidor local:
```sh
npm run dev
```
Gerar a versão de produção:
```sh
npm run build
```
Executar a versão de produção localmente:
```
npm run preview
```


# Requisitos 

<table style="width: 100%; border-collapse: collapse;">
    <thead>
        <tr>
            <th style="border: 1px solid #ddd;">ID</th>
            <th style="border: 1px solid #ddd;">Requisito</th>          
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="border: 1px solid #ddd;">RF1</td>            
            <td style="border: 1px solid #ddd;">Link das redes da empresa patrocinadora.</td>            
        </tr>
        <tr>
            <td style="border: 1px solid #ddd;">RF2</td>
            <td style="border: 1px solid #ddd;">Visualizar o número de lojas impactadas.</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd;">RF3</td>
            <td style="border: 1px solid #ddd;">Visualizar número de usuários impactados.</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd;">RF4</td>
            <td style="border: 1px solid #ddd;">Visualizar as cidades impactadas.</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd;">RF5</td>
            <td style="border: 1px solid #ddd;">Visualizar o número comunidades impactadas.</td>
        </tr>
         <tr>
            <td style="border: 1px solid #ddd;">RF6</td>
            <td style="border: 1px solid #ddd;">Um dashboard para ter dados sobre o patrocínio.</td>
        </tr>
         <tr>
            <td style="border: 1px solid #ddd;">RNF1</td>
            <td style="border: 1px solid #ddd;">Usar ReactJS e TypeScript.</td>
         <tr>
            <td style="border: 1px solid #ddd;">RNF2</td>
            <td style="border: 1px solid #ddd;">Usar banco de dados relacional.</td>
        </tr>
           <tr>
            <td style="border: 1px solid #ddd;">RNF3</td>
            <td style="border: 1px solid #ddd;">Ser responsivo.</td>
        </tr> 
        </tr>
           <tr>
            <td style="border: 1px solid #ddd;">RNF4</td>
            <td style="border: 1px solid #ddd;">Documentação.</td>
        </tr> 
    </tbody>
</table>

# Backlog do Produto

<table style="width: 100%; border-collapse: collapse;">
    <thead>
        <tr>
            <th style="border: 1px solid #ddd;">Requisito</th>
            <th style="border: 1px solid #ddd;">User Story</th>
            <th style="border: 1px solid #ddd;">Prioridade</th>
            <th style="border: 1px solid #ddd;">Estimativa</th>
            <th style="border: 1px solid #ddd;">Sprint</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style="border: 1px solid #ddd;">RF1</td>
            <td style="border: 1px solid #ddd;">Eu como empresa patrocinadora gostaria que o visitante da pagina tivesse acesso as minhas redes sócias.</td>
            <td style="border: 1px solid #ddd;">Média</td>
            <td style="border: 1px solid #ddd;">8</td>
            <td style="border: 1px solid #ddd;">1</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd;">RNF4</td>
            <td style="border: 1px solid #ddd;">Eu como usuário comum gostaria que a pagina fosse responsiva para todas as telas.</td>
            <td style="border: 1px solid #ddd;">Média</td>
            <td style="border: 1px solid #ddd;">8</td>
            <td style="border: 1px solid #ddd;">1</td>
        </tr> 
        <tr>
            <td style="border: 1px solid #ddd;">RF2</td>
            <td style="border: 1px solid #ddd;">Eu como empresa patrocinadora gostaria de ver o número de lojas criadas com o meu patrocínio.</td>
            <td style="border: 1px solid #ddd;">Alta</td>
            <td style="border: 1px solid #ddd;">8</td>
            <td style="border: 1px solid #ddd;">2</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd;">RF3</td>
            <td style="border: 1px solid #ddd;">Eu como empresa patrocinadora gostaria de ver o número de usuários impactados.</td>
            <td style="border: 1px solid #ddd;">Alta</td>
            <td style="border: 1px solid #ddd;">8</td>
            <td style="border: 1px solid #ddd;">2</td>
        </tr>
        <tr>
            <td style="border: 1px solid #ddd;">RF4</td>
            <td style="border: 1px solid #ddd;">Eu como empresa patrocinadora gostaria de ver a distribuição geográfica do meu impacto.</td>
            <td style="border: 1px solid #ddd;">Alta</td>
            <td style="border: 1px solid #ddd;">21</td>
            <td style="border: 1px solid #ddd;">2</td>
        </tr>
         <tr>
            <td style="border: 1px solid #ddd;">RF6</td>
            <td style="border: 1px solid #ddd;">Eu como empresa patrocinadora quero ter um dashboard que me permita acompanhar o crescimento do projeto e me forneça dados relevantes de uma forma clara.</td>
            <td style="border: 1px solid #ddd;">Alta</td>
            <td style="border: 1px solid #ddd;">13</td>
            <td style="border: 1px solid #ddd;">3</td>
        </tr>
         <tr>
            <td style="border: 1px solid #ddd;">RF5</td>
            <td style="border: 1px solid #ddd;">Eu como empresa patrocinadora gostaria de ver o número de comunidades impactadas.</td>
            <td style="border: 1px solid #ddd;">Alta</td>
            <td style="border: 1px solid #ddd;">8</td>
            <td style="border: 1px solid #ddd;">2</td>
        </tr>
    </tbody>
</table>

# Autores

|                              Foto                              |    Função     | Nome           |                                                                                                                                                   LinkedIn & GitHub                                                                                                                                                    |
| :------------------------------------------------------------: | :-----------: | :------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|  <img src="https://avatars.githubusercontent.com/PedHr" width=50px>  |  Scrum Master   | Pedro Rosa     |                                [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)]() [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/PedHr)                                 |
| <img src="https://avatars.githubusercontent.com/matheuskarnas" width=50px> |  Product Owner | Matheus Karnas |       [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/matheuskarnas/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/matheuskarnas)        |                       |
| <img src="https://avatars.githubusercontent.com/LucasMSCarmo" width=50px>  | Scrum Team | Lucas Martins  |                             [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)]() [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/LucasMSCarmo)                             |
| <img src="https://avatars.githubusercontent.com/LucasAraujo1016" width=50px>  |  Scrum Team   | Lucas Araujo   |  [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/lucas-araujo-448115329/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/LucasAraujo1016)  |
| <img src="https://avatars.githubusercontent.com/LittleRob120" width=50px> |  Scrum Team   | Gabriel Robert |                             [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)]() [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/LittleRob120)                             |
| <img src="https://avatars.githubusercontent.com/ThOMaZMe11o" width=50px>  |  Scrum Team   | Thomaz Feitosa |                                [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)]() [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/ThOMaZMe11o)                                 |
| <img src="https://avatars.githubusercontent.com/lucasguerra12" width=50px>  |  Scrum Team   | Lucas Guerra |                                [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)]() [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/lucasguerra12)                                 |
| <img src="https://avatars.githubusercontent.com/ViniciusLimaCabraleSouza" width=50px>  |  Scrum Team   | Vinicius Lima |                                [![Linkedin Badge](https://img.shields.io/badge/Linkedin-blue?style=flat-square&logo=Linkedin&logoColor=white)](https://www.linkedin.com/in/vinicius-lima-cabral-e-souza-7794b3287/) [![GitHub Badge](https://img.shields.io/badge/GitHub-111217?style=flat-square&logo=github&logoColor=white)](https://github.com/ViniciusLimaCabraleSouza)                                 |

