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
└── README.md# aurora-web-admin
# aurora-web-admin
# aurora-web-admin
