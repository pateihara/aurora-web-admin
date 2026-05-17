# Aurora by Flui — Plataforma Web Administrativa · Etapa 2

> Plataforma web funcional desenvolvida para a Etapa 2 do Charge Platform Challenge — parceria FIAP, Flui & Google · 2026.

---

## Sobre o projeto

O **Aurora by Flui** é uma solução voltada à melhoria da experiência de recarga de veículos elétricos e híbridos plug-in no Brasil.

A proposta do produto é funcionar como um guia inteligente de eletropostos, ajudando motoristas a encontrar pontos de recarga com informações mais completas, avaliações por critério, filtros úteis e contexto real de uso.

Nesta etapa, o foco deste repositório é a **plataforma web administrativa da equipe Flui**, responsável pela gestão dos pontos de recarga e pelo acompanhamento das avaliações enviadas pelos motoristas.

---

## Objetivo da Etapa 2

Na Etapa 2, o protótipo visual evoluiu para uma versão funcional da plataforma web.

Conforme o escopo da entrega, esta versão utiliza **dados simulados** e funciona de forma independente do app mobile.

Nesta etapa, ainda não são exigidos:

- Backend com API REST;
- Banco de dados real;
- Autenticação de usuários;
- Integração entre app mobile e plataforma web;
- Vídeo-pitch.

---

## Funcionalidades implementadas

- Dashboard administrativo com métricas simuladas da rede;
- Listagem de pontos de recarga;
- Cadastro de novos pontos;
- Edição de pontos existentes;
- Desativação de pontos;
- Busca por nome, endereço ou cidade;
- Filtro por status do ponto;
- Filtro por tipo de conector;
- Visualização detalhada de cada ponto;
- Exibição de conectores, potência, comodidades e status operacional;
- Visualização de avaliações dos motoristas por ponto;
- Filtro de avaliações por ponto;
- Relatórios simulados de uso da rede;
- Persistência local com `localStorage`;
- Interface responsiva;
- Identidade visual alinhada ao projeto Aurora by Flui.

---

## Telas da plataforma web

| # | Tela | Descrição |
|---|------|-----------|
| 1 | **Dashboard** | Métricas da rede, alerta de ponto offline, mini-mapa, gráfico de recargas e últimas avaliações |
| 2 | **Pontos de recarga** | Tabela de pontos com busca, filtros, status, avaliação, potência e painel lateral de detalhe |
| 3 | **Cadastro / edição de ponto** | Formulário funcional para cadastrar e editar pontos de recarga simulados |
| 4 | **Avaliações** | Visualização de avaliações dos motoristas, nota média, critérios avaliados e ranking dos pontos |
| 5 | **Relatórios** | Métricas mensais simuladas, volume de recargas, distribuição por conector e ranking por uso |

---

## Tecnologias utilizadas

- Next.js
- React
- JavaScript
- CSS Global
- LocalStorage
- Vercel

---

## Estrutura do projeto

```txt
aurora-web-admin/
├── src/
│   └── app/
│       ├── data/
│       │   ├── reviews.js
│       │   └── stations.js
│       ├── globals.css
│       ├── layout.js
│       └── page.js
├── package.json
└── README.md
```

---

## Como rodar localmente

Clone o repositório:

```bash
git clone https://github.com/pateihara/aurora-web-admin.git
```

Acesse a pasta:

```bash
cd aurora-web-admin
```

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm run dev
```

Acesse no navegador:

```txt
http://localhost:3000
```

---

## Build de produção

Para gerar a versão de produção:

```bash
npm run build
```

Para executar a versão de produção localmente:

```bash
npm start
```

---

## Deploy

A plataforma web foi publicada na Vercel.

```txt
https://aurora-web-admin.vercel.app/
```

---

## Dados simulados

Nesta etapa, os dados são simulados e armazenados localmente no navegador com `localStorage`.

Isso permite demonstrar as principais ações administrativas da plataforma, como cadastro, edição, listagem, filtros e desativação de pontos de recarga, sem necessidade de backend ou banco de dados real.

Caso o usuário queira retornar ao estado inicial da demonstração, há uma opção de **resetar dados** no menu lateral.

---

## Identidade visual

A interface mantém a identidade visual criada na Etapa 1 do Aurora by Flui:

| Token | Valor | Uso |
|------|-------|-----|
| `--green` | `#AAFF3E` | Ação primária, status livre e CTAs |
| `--purple` | `#7C3FCC` | Identidade Flui e elementos de apoio |
| `--pl` | `#B87DFF` | Avaliações, estrelas e destaques secundários |
| `--amber` | `#FFB23E` | Status parcial ou atenção |
| `--red` | `#FF5F5F` | Status offline ou erro |
| `--base` | `#0A0A0F` | Fundo principal |
| `--surf` | `#13131A` | Cards e superfícies |

**Tipografia:** Sora para títulos e DM Sans para textos de apoio.

---

## Observação sobre escopo

A plataforma web desta etapa não possui integração com o aplicativo mobile. Cada solução funciona de forma independente, conforme solicitado no enunciado da Etapa 2.

A integração entre app mobile, plataforma web, backend e banco de dados fica prevista para uma etapa futura.

---

## Integrantes

| Nome | RM |
|------|------|
| Natalia Guaita | RM560106 |
| Patricia Eihara | RM559419 |
| Rafael Santos | RM560567 |

---

## Links

- Deploy web: https://aurora-web-admin.vercel.app/
- Repositório GitHub: https://github.com/pateihara/aurora-web-admin