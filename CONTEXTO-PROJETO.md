# Contexto do Projeto — Totem Paróquia Nossa Senhora do Rosário

> Este arquivo existe para dar continuidade ao desenvolvimento em uma sessão nova
> (Claude Code local, rodando direto nesta pasta). Ele resume tudo que já foi
> combinado e construído até agora numa sessão anterior (Cowork), para que o
> trabalho continue no mesmo padrão sem precisar redescobrir as convenções.
>
> É importado automaticamente pelo `CLAUDE.md` (`@CONTEXTO-PROJETO.md`), então
> toda sessão do Claude Code aberta nesta pasta já lê isso no início.

## O que é o projeto

Site/totem com tela sensível ao toque para a **Paróquia Nossa Senhora do
Rosário** (Vila Velha). É um totem físico (tela grande, vertical, 1080x1920)
instalado na igreja, onde os visitantes navegam por um menu tocando na tela:
horário de missas, confissões, sobre a paróquia, fraternidade franciscana, etc.

- **Stack**: Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + Sanity CMS
  (`next-sanity`), hospedado no Vercel. Node 22.
- **Sanity Studio** embutido em `/studio` (`app/studio/[[...tool]]/page.tsx`).
- O conteúdo editável (fotos, horários, textos que mudam) fica no Sanity; o
  layout e os textos fixos ficam direto no código.
- Regra de negócio: a pessoa que vai manter o conteúdo (uma secretária da
  paróquia, não-técnica) edita **só pelo Sanity Studio**. Por isso os schemas
  são pensados para serem fáceis de editar (arrays de string para horários,
  campos de imagem com nome claro, etc.), nunca exigindo mexer em código.

## Como o trabalho é feito (tela por tela)

O desenvolvimento segue sempre o mesmo fluxo, uma tela do totem de cada vez:

1. O usuário manda uma imagem do design (mockup) daquela tela específica.
2. O usuário já deixa os assets recortados (PNGs reais: ícones, formas
   decorativas, texturas) numa pasta própria em `public/<nome-da-pagina>/`.
   **Nunca inventar/recriar esses assets** — sempre usar os arquivos reais que
   ele forneceu. Se a pasta não existir ou estiver vazia quando ele disser que
   os assets já estão lá, isso é bloqueio: avisar e perguntar, não aproximar
   com CSS.
3. Reproduzir o design **pixel a pixel** usando esses assets reais.
4. Quando a tela tem uma foto que pode ser trocada no futuro (foto de uma
   pessoa, foto do santuário, etc.), essa foto vira um campo de imagem num
   **schema novo e dedicado no Sanity**, um schema por página (ver padrão
   abaixo). Quando o usuário diz explicitamente que uma imagem "não deve
   mudar tão cedo", ela fica estática no código, sem Sanity.
5. Se a tela tiver informação que muda com frequência (ex: horário de missa),
   isso também vira campo editável no Sanity — estruturado para ser fácil de
   editar (arrays de horário, não texto livre).
6. **Verificação visual antes de considerar pronto**: montar uma prévia
   HTML+CSS isolada (fora do projeto Next, numa pasta temporária) usando os
   assets reais e as fontes reais, renderizar com Playwright num viewport
   1080x1920, comparar lado a lado com o design original, ajustar até bater
   bem (posições, proporções, tamanhos de fonte via `clamp()`), **só depois
   portar os valores já validados para os arquivos reais** do projeto
   (`.tsx` do schema/página). Depois disso, rodar `npx tsc --noEmit` e
   `npx eslint <arquivos>` para garantir build limpo, e mandar a prévia
   renderizada para o usuário conferir.
   - Esse fluxo de prévia usa Playwright, que **não é dependência do
     projeto** (não polua o `package.json` do totem com isso). Se for
     repetir esse processo aqui, instale o Playwright à parte, numa pasta
     de trabalho temporária fora do repositório, só para gerar a prévia.
   - Alternativa mais simples se não quiser configurar Playwright: rodar
     `npm run dev` e comparar visualmente no navegador em 1080x1920 (DevTools
     → responsive mode) antes de finalizar.

## Padrão de schema por página (Sanity)

Cada página com conteúdo editável tem seu próprio *document type* do tipo
"singleton" (documento único, não uma lista). Convenção de nomes:

- Schema: `sanity/schemaTypes/pagina<Nome>.ts` — `defineType({ name: 'pagina<Nome>', type: 'document', ... })`.
- Fetch helper: `sanity/lib/getPagina<Nome>.ts` — export `getPagina<Nome>()`
  que roda uma GROQ query com `*[_type == "pagina<Nome>"][0] { ... }` e
  resolve `imagem.asset->url` direto na query (a página React só usa a URL
  pronta, não lida com `urlFor`).
- Registrar o schema em **dois lugares**:
  1. `sanity/schemaTypes/index.ts` — importar e adicionar no array `types`.
  2. `sanity/structure.ts` — adicionar `{ id: 'pagina<Nome>', titulo: '<Nome bonito>' }`
     no array `PAGINAS_UNICAS`, para aparecer como item único no Studio (abre
     direto no formulário de edição, sem precisar criar/listar documentos).
     Se em vez de documento único for uma **lista** (a secretaria cadastra/
     remove vários itens, tipo `pastoral`/`evento`/`aviso`), adicionar no array
     `LISTAS` do mesmo arquivo — ele já monta o item do Studio com botão de
     criar novo e ordenação por `ordem`.
- Campo de imagem: sempre `type: 'image'`, `options: { hotspot: true }`,
  `validation: (Rule) => Rule.required()`, com `title`/`description` em
  português explicando claramente onde aquela foto aparece na tela (a pessoa
  que edita não vê o código).
- Quando há horários/listas que podem mudar: usar `type: 'array', of: [{type:'string'}]`
  (não texto livre único), para dar pra adicionar/remover itens facilmente.
  Ver `paginaMissas.ts` para o padrão completo (grupos de horário com título,
  array de horários e observação opcional).
- Página React (`app/<rota>/page.tsx`): `export const revalidate = 60;`,
  busca os dados com `await getPagina<Nome>()`, sempre com fallback visual
  (placeholder cinza com texto avisando "Cadastre a foto no Sanity") quando o
  campo ainda não foi preenchido — a página nunca pode quebrar por falta de
  conteúdo no Sanity.

## Componentes reutilizáveis

Ficam em `app/sobre-nos/_components/` (usados também por páginas fora de
`/sobre-nos`, como `/missas` e `/confissoes` — o caminho de import é relativo,
tipo `../sobre-nos/_components/NavVoltarInicio`):

- **`NavVoltarInicio`** — a barra com os botões "Voltar" (seta, vai para
  `hrefVoltar`) e "Início" (vai para `/?ativo=true`). Usa os recortes reais
  de `public/global/` (`Retangulo da setinha.png`, `seta.png`,
  `Retangulo da casa.png`, `casa.png`). Recebe `hrefVoltar` e `className`
  (controla posição — normal no fluxo, ou `absolute ... z-20` sobreposto a
  uma foto).
- **`CabecalhoComFundo`** — topo arredondado com foto de fundo + título em
  branco (Asah), usado nas páginas internas de "Sobre Nós".
- **`BotaoDourado`** — botão dourado comprido usado em listas de menu (ex:
  lista de frades, lista de opções do Sobre Nós).

Todos os tamanhos usam `clamp(min, vw, max)` em vez de rem/px fixos, porque a
tela é grande (totem, não celular) — rem fixo fica minúsculo nela.

## Tela física do totem e a regra do "nunca rolar"

A TV que dá vida ao totem é uma **LG 60UA8550PSA** — 60", painel 4K
(3840x2160), montada em pé. Em pé isso vira **9:16**, exatamente a proporção
do design (1080x1920), então nenhuma tela precisa ser reproporcionada.

Regra: **nenhuma tela pode rolar**. O visitante só toca em botão. A única
exceção são listas que a secretaria alimenta (Pastorais, Avisos, Eventos,
Fraternidade) — se um dia entrarem itens demais, **só a caixa da lista rola,
nunca a página**.

Como isso é garantido no código:

- A página usa `h-screen ... overflow-hidden flex flex-col` (não
  `min-h-screen`): a altura é a da tela e ponto.
- Cabeçalho e barra Voltar/Início são `shrink-0` (já embutido em
  `CabecalhoComFundo` e `NavVoltarInicio`).
- O miolo é `flex-1 min-h-0`. Quando a quantidade de itens é fixa, ele usa
  `justify-evenly` e o respiro entre os botões se ajusta sozinho à tela; quando
  a lista vem do Sanity, ele usa `justify-start` + `overflow-y-auto` (com
  `justify-evenly` numa caixa que rola, o topo da lista ficaria fora do alcance
  do dedo).

### Barra de rolagem: escondida no projeto inteiro (22/09/2026)

Na TV instalada apareceu a barra cinza do navegador no lado direito do Menu
Inicial (o único miolo com `overflow-y-auto` fora das listas). Numa tela de
toque ela não serve para nada e ainda come largura do layout.

A regra fica num lugar só, no fim do `app/globals.css`, e vale para todo
elemento da página (`scrollbar-width: none` + `::-webkit-scrollbar { display:
none }`). **Rolar com o dedo continua funcionando** — some só a barra, que é
justamente o que as listas alimentadas pela secretaria precisam.

Duas coisas importantes:

- **Não repetir isso nas páginas.** `/avisos`, `/eventos` e `/pastorais`
  carregavam `[scrollbar-width:none] [&::-webkit-scrollbar]:hidden` inline;
  foi removido, porque agora a regra global já cobre.
- **O Studio é exceção.** `/studio` é usado no computador, com mouse, e sem
  barra fica ruim de editar. O seletor global é
  `html:not(:has(.studio-sanity)) *`, e o `app/studio/[[...tool]]/page.tsx`
  envolve o `<NextStudio>` numa `div.studio-sanity`. A exclusão é pelo
  documento inteiro, e não só por dentro da marca, porque o Studio abre modais
  em portal, fora da árvore do componente. Verificado: na `/studio` uma caixa
  de teste ganha barra de 15px; em qualquer rota do totem ela sai com 0px.

**Atenção — a barra era sintoma, não a doença.** Ela só aparecia porque o
navegador na TV não está em tela cheia (barra do Windows + barra do navegador
comem altura). Escondê-la resolve o visual, mas o conteúdo continua sendo
cortado sem aviso nenhum: medido em 1080x1650, o Menu Inicial transborda 136px
e a última fileira de ícones ("Redes Sociais" e "Onde Estamos") perde a segunda
linha do rótulo. O conserto de verdade é o modo quiosque / tela cheia (ver
"Configuração recomendada do aparelho" acima).

Medido em 19/09/2026, viewport 1080x1920: **todas as 15 rotas ficaram em 0px de
rolagem**. `/sobre-nos` (estourava 49px) e `/sobre-nos/fraternidade` (118px)
foram corrigidas nessa data — eram as duas únicas que vazavam.

`/sobre-nos` é a tela mais apertada do projeto: cabeçalho (39vh) + 6 pílulas
douradas + barra de navegação somam ~1816px dos 1920, sobrando só ~104px para
todo o respiro. Ou seja, **não há folga ali**: qualquer elemento novo nessa
tela exige tirar altura de outro.

### Página de diagnóstico (`/diagnostico`)

Ferramenta de instalação, **fora do menu** e fora do protetor de tela. Aberta
na própria TV, mostra em letra grande o tamanho que aquele navegador realmente
reporta, a proporção, o DPR e se a tipografia está travando no limite dos
`clamp()` — com um veredito ("Encaixe perfeito" ou o que precisa ajustar).
Serve para decidir a configuração sem chutar. Validada em 1080x1920 (perfeito),
1080x1800 (acusa proporção errada) e 2160x3840 (acusa tipografia travada).

**Configuração recomendada do aparelho** (o totem vai ser tocado por um mini PC
/ notebook na HDMI): TV em **3840x2160 com escala de 200%**, girada para
retrato. Assim o navegador enxerga 1080x1920 — exatamente o design — e ainda
renderiza o texto em resolução dobrada (DPR 2), que é o resultado mais nítido
possível. A alternativa 1920x1080 a 100% também dá 1080x1920, mas sem o ganho
de nitidez. O que **não** serve sem ajuste no código é 4K a 100%: aí o
navegador enxerga 2160x3840 e todos os `clamp()` travam no limite.

Dois pontos que dependem de como o totem é ligado (ver "Itens em aberto"):

1. **Precisa rodar em tela cheia / modo quiosque.** Uma barra de navegador
   comendo 120px já espreme `/sobre-nos` a ponto dos botões se encostarem
   (medido em 1080x1800: não rola, mas o respiro cai para 1px).
2. **Se o navegador reportar 4K real (2160x3840 CSS)**, nada rola, mas tudo
   encolhe pela metade em proporção: os `clamp(min, Xvw, max)` batem no `max`
   e o título de Missas, por exemplo, sai com 5.4vw em vez dos 10.1vw do
   design. Auditoria de 19/09/2026: dos 74 `clamp()` com `vw`, **70 têm o
   `max` inerte em 1080px** (só travam acima disso), então levantar esses
   limites conserta o 4K sem mexer em nada do design atual; só 4 precisam de
   análise caso a caso.

## Protetor de tela / inatividade (30s)

Depois de **30 segundos sem toque** o totem sai da tela atual e passa o
**carrossel de avisos** cadastrado no Sanity (`configTotem` → "Carrossel de
Inatividade", até 8 imagens, 6s cada). Isso vale **em todas as telas**, não só
no menu inicial. Quem cuida disso:

- `app/_components/CarrosselInatividade.tsx` — o carrossel em si (fade de 1s
  entre as imagens) e as duas constantes: `TEMPO_INATIVIDADE_MS` (30s) e
  `DURACAO_SLIDE_MS` (6s). Mexer no tempo é mexer aqui, num lugar só.
- `app/_components/ProtetorDeTela.tsx` — montado no `app/layout.tsx`, ou seja,
  vale para o projeto inteiro. Nas páginas internas (Missas, Avisos, Sobre
  Nós...) ele conta os 30s e sobrepõe o carrossel em `fixed inset-0 z-[100]`;
  o toque seguinte manda o totem de volta para `/` ("Toque para Iniciar"),
  pronto para a próxima pessoa. Se **não houver imagem cadastrada** no
  carrossel, ele volta direto para `/` sem passar pelo carrossel.
- `app/TotemClient.tsx` — o menu inicial continua com a máquina de estados
  própria (`menu -> carrossel -> repouso -> menu`), porque lá o carrossel
  convive com a tela de "Toque para Iniciar". Por isso o `ProtetorDeTela`
  **se desliga em `/`** (dois donos do mesmo timer brigariam) e também em
  `/studio` (ninguém quer o carrossel cobrindo o formulário no meio de um
  cadastro).

Como o carrossel vem do Sanity e o layout é quem busca, **toda página precisa
de `export const revalidate = 60`** — inclusive as que não usam Sanity para
nada (`/padroeiro` e `/sobre-nos/historia` ganharam o `revalidate` só por
causa disso; sem ele a lista de slides ficaria congelada no build).

## Paleta e fontes (usar sempre estas, não inventar novas)

- Fontes (variáveis CSS setadas em `app/layout.tsx`, arquivos em `app/fonts/`):
  - `var(--font-asah)` — fonte decorativa serifada (Asah.ttf), usada em
    **todos os títulos** de página (`<h1>`), sempre uppercase.
  - `var(--font-bold)` — Poppins Bold, usada em textos em destaque, CTAs,
    horários, nomes de botão.
  - `var(--font-regular)` — Poppins Regular, usada em parágrafos de corpo.
  - `var(--font-light)` / `var(--font-medium)` — existem mas raramente usadas.
- Cores principais (hex usados direto em `text-[#...]` do Tailwind):
  - `#8B1E31` — maroon, títulos (Asah) e textos/CTAs em destaque.
  - `#491F14` — marrom escuro, corpo de texto sobre fundo claro.
  - `#241C14` — marrom quase preto, usado nos horários de "Confissões"
    (mais escuro que o `#491F14` padrão).
  - `#7A5B4B` — marrom claro, observações/subtítulos secundários.
  - `#5A3B2B` / `#C79C45` — usados no menu inicial (`TotemClient.tsx`), fora
    do padrão das páginas internas.
  - `#F7F5EB` — **fundo padrão de TODAS as telas** (cream). Esta é a cor real
    exportada pelo designer: os `fundo.png` de `public/dizimo/`,
    `public/secretaria/` e `public/redessociais/` são todos `#F7F5EB`, e o
    `public/nossahistoria/fundo.png` é `#F8F5EB` (mesma cor, 1 ponto de
    diferença). Antes havia seis creams diferentes espalhados (`#FDFBF7`,
    `#F2F0E9`, `#F8F5EB`, `#FFF8E1`, `#FBF6EE`) — nenhum deles vinha de asset
    nenhum. Foram todos unificados em `#F7F5EB` em 15/09/2026. **Não introduzir
    cream novo**: se precisar de fundo, use `#F7F5EB`. Atenção a degradês que
    dissolvem foto no fundo — eles repetem a cor em `rgba(247,245,235,...)` e
    precisam acompanhar.
- Botões maroon (Voltar/Início, botão dourado): vêm dos assets reais em
  `public/global/`, não são `background-color` no CSS.

## Estrutura de pastas

```
app/
  page.tsx                     → Menu inicial (busca menuTotem no Sanity)
  TotemClient.tsx               → Client component do menu inicial
  missas/page.tsx               → Horário de Missas (rota /missas)
  confissoes/page.tsx           → Confissões (rota /confissoes)
  padroeiro/page.tsx            → Padroeiro do Santuário (rota /padroeiro) — SEM Sanity
  pastorais/page.tsx            → Programações das Pastorais (rota /pastorais)
  eventos/page.tsx              → Calendário de Eventos (rota /eventos)
  avisos/page.tsx               → Avisos (rota /avisos)
  dizimo/page.tsx               → Seja um dizimista (rota /dizimo)
  secretaria/page.tsx           → Secretaria (rota /secretaria)
  redesocial/page.tsx           → Redes Sociais (rota /redesocial, sem hífen — é o que o menu aponta)
  sobre-nos/
    page.tsx                    → Menu "Sobre Nós" (lista de botões dourados)
    primeira-vez/page.tsx
    quem-somos/page.tsx
    historia/page.tsx           → SEM Sanity (imagem estática, não deve mudar)
    carisma/page.tsx
    sao-francisco/page.tsx
    fraternidade/page.tsx       → lista de frades
    fraternidade/[id]/page.tsx  → detalhe de um frade
    _components/                → NavVoltarInicio, CabecalhoComFundo, BotaoDourado, PaginaInternaPadrao (órfão, ver pendências)
  studio/[[...tool]]/page.tsx   → Sanity Studio embutido
  _components/                  → globais do totem (ProtetorDeTela, CarrosselInatividade)

sanity/
  schemaTypes/                  → um pagina<Nome>.ts por página com conteúdo editável, + menuTotem, frade, configTotem
  lib/                          → um getPagina<Nome>.ts por schema, + client.ts, image.ts
  structure.ts                  → define quais schemas aparecem como singleton no Studio

public/
  global/                       → assets compartilhados (botões Voltar/Início)
  <nome-da-pagina>/              → assets recortados específicos de cada página
```

## Inventário — o que já está pronto

Todas as páginas abaixo seguem o fluxo descrito acima (design pixel-a-perfeito
+ verificação via prévia) e passaram em `tsc`/`eslint` limpos:

| Página | Rota | Sanity? | Observação |
|---|---|---|---|
| Menu inicial | `/` | `menuTotem` (lista), `configTotem` | botões do menu vêm do Sanity, ordenados por `ordem` |
| Repouso / "Toque para Iniciar" | `/` (estado `repouso` do `TotemClient`) | **não** | Tela de descanso (o "looping"). Reconstruída a partir do mockup com os recortes de `public/looping/`: raios+pomba (`espirito santo.png`) atrás e a igreja (`santuario logo.png`) na frente, sobrepostas; marca escrita em 3 recortes empilhados. Os blocos são posicionados por `top` em vh (não por fluxo/margens), na mesma proporção do design. O círculo dourado do toque **não tinha recorte** — é CSS (`border` + `background` no `#C49334`). Reaproveita `public/avisos/vetor divino espirito.png` (fundo) e `public/dizimo/TAU.png`. Não usa mais `marcaDagua`/`logoSantuario` do Sanity (esses continuam valendo no menu) |
| Sobre Nós (menu) | `/sobre-nos` | `configTotem` | lista de botões dourados, estático no código |
| Primeira Vez Aqui | `/sobre-nos/primeira-vez` | `paginaPrimeiraVez` | |
| Quem Somos | `/sobre-nos/quem-somos` | `paginaQuemSomos` | |
| Nossa História | `/sobre-nos/historia` | **não** | imagem estática, usuário pediu para não usar Sanity aqui |
| Carisma | `/sobre-nos/carisma` | `paginaCarisma` | 1 campo de imagem |
| São Francisco | `/sobre-nos/sao-francisco` | `paginaSaoFrancisco` | foto full-bleed + degradê |
| Fraternidade (lista) | `/sobre-nos/fraternidade` | `paginaFraternidade` (capa) + `frade` (lista) | usa assets reais de `public/fraternidade` (sunburst, tau, divisor) |
| Frade (detalhe) | `/sobre-nos/fraternidade/[id]` | `frade` | schema já existia antes desta fase do projeto |
| Horário de Missas | `/missas` | `paginaMissas` | foto + 4 grupos de horário editáveis (Terça-Sexta, Sábado, Domingo, 1ª Quinta do Mês), cada um com array de horários + observação opcional. Usa `public/missas/vetor.png` (rosácea decorativa) |
| Confissões | `/confissoes` | `paginaConfissoes` | 2 fotos editáveis (fundo esmaecido no topo + foto principal embaixo). Horários fixos no código (usuário só pediu Sanity pras fotos) |
| Padroeiro do Santuário | `/padroeiro` | **não** | Ilustração da pomba (`public/padroeiro/santuario.png`) + véu degradê (`degrade branco.png`) que a dissolve no fundo, barra dourada (`retangulo separação.png`). Sem foto e sem texto variável, então não tem schema |
| Programações das Pastorais e Movimentos | `/pastorais` | `pastoral` (lista) | Cards dourados (`public/pastorais/retangulo amarelo.png`) montados a partir da lista do Sanity, ordenados por `ordem`. Cada card = título + dia + horário + local (opcional). A lista rola sozinha se tiver mais cards do que cabe na tela; se ninguém cadastrou nada ainda, mostra o placeholder "Cadastre as pastorais no Sanity" (mesmo padrão das páginas de foto) |
| Calendário de Eventos | `/eventos` | `evento` (lista) + `paginaEventos` (foto) | Lista de eventos (data + nome + horário), cada um um documento ordenado por `ordem`. A foto do rodapé (arco/cúpula, feita com `border-radius` elíptico `50% 50% 0 0 / 31% 31% 0 0`) é editável separadamente. Usa `public/eventos/evento vetor desenho.png` (igreja em traço claro atrás da lista) |
| Avisos | `/avisos` | `aviso` (lista) | Cartões bege (`public/avisos/Retângulo bege.png`) montados da lista do Sanity. O cartão **cresce conforme o texto** (min-height + padding, retângulo esticado com `object-fill`), então avisos longos não são cortados. Cada aviso tem um campo de **imagem opcional** (pensado para QR Code de inscrição): quando preenchido, o cartão vira duas colunas — texto alinhado à esquerda (`flex-1`) + o anexo num quadrado branco de 26% da largura (o branco garante a leitura do QR mesmo se a imagem não tiver margem); sem imagem, o texto continua centralizado como antes. Usa `Icon Avisos.png` e `vetor divino espirito.png` (fundo em traço claro) |
| Dízimo | `/dizimo` | `paginaDizimo` (QR Code) | "Seja um dizimista". Coração, TAU, título e frase do rodapé são fixos no código. Só o QR Code é editável — e é **opcional**: enquanto o campo estiver vazio vale o `public/dizimo/qr code.png`. A moldura vermelha/bege vem do próprio recorte; o QR do Sanity é sobreposto na área branca interna, então a secretaria envia só o quadrado do código |
| Secretaria | `/secretaria` | `paginaSecretaria` | Horários (array de objetos dias+horario), telefones (array de string) e WhatsApp (texto + número) todos editáveis. A foto é **opcional** — vazia, vale `public/secretaria/foto.png`. A foto fica à direita, dissolvida no fundo com `mask-image` (gradiente pela esquerda + por baixo, `mask-composite: intersect`). Fundo desta tela e da de Dízimo é `#F7F5EB`, não o `#FDFBF7` das outras |
| Redes Sociais | `/redesocial` | `paginaRedesSociais` (3 QR Codes) | **Atenção: a rota é `redesocial`, sem hífen** — é assim que está no `menuTotem`. Faixa vermelha (`#8B1E31`) de ponta a ponta com 3 colunas (ícone + QR), montada em `grid-cols-3` para ícone e QR ficarem no mesmo eixo. A moldura branca do QR é CSS (`border` + `border-radius`), não asset — por isso a secretaria envia só o quadrado do código. Os 3 campos são **opcionais**: vazios, valem os QR Codes de `public/redessociais/`. Reaproveita `public/avisos/vetor divino espirito.png` (fundo) e `public/dizimo/TAU.png` |

## Rodada de ajustes visuais (19/09/2026)

Pedidos do usuário, tela por tela, cada um verificado com captura em 1080x1920
(Chrome headless — ver "Fluxo de prévia"):

- **Looping** — os raios (`espirito santo.png`) subiram de 26.1vh para 19.9vh e
  **voltaram para 26.1vh em 20/09/2026**. Subir era a correção errada: os
  26.1vh são exatamente a posição do mockup (a pomba abre em 26% da altura, a
  torre em 35.8%, a marca escrita em 57.3% — todos os outros blocos desta tela
  já batiam com o mockup, só os raios estavam fora). O que de fato quebrava o
  brasão é que **`santuario logo.png` é só o traço da igreja: 68% do arquivo é
  transparente** (medido: 32% de alfa médio), então os feixes apareciam
  atravessando o prédio e os dois recortes não liam como uma peça só. A
  correção é uma `mask-image` nos raios
  (`linear-gradient(to bottom, black 66%, transparent 74%)`), que os dissolve
  na altura em que a nave começa a se alargar (49% da altura da igreja) — é
  onde o mockup também os corta: eles abrem entre as torres e somem antes do
  corpo do prédio (hoje `black 71%, transparent 78%`). Faltava ainda o
  **encaixe** entre os dois recortes. O envelope do brasão já batia com o
  mockup (583px de altura por 481 de largura, proporção 0.825, contra 576x475
  do mockup) — o que estava fora era a proporção **interna**: no mockup a
  igreja começa a 32.9% da altura do brasão e ocupa 67.1% dele; no código
  começava a 37.6% e ocupava 62.4%. Ou seja, a igreja precisava ser ~7.5%
  maior e subir ~27px para as torres entrarem mais fundo nos raios. Ficou
  `w-[42.2%]` (era 39.3%) em `top-[36.1vh]` (era 37.5vh), e os três números do
  mockup batem na medição. **É essa proporção interna que dá a sensação de
  "encaixado"** — mexer só na posição vertical dos raios não resolve. Subir os
  raios também tinha encostado o "Seja bem-vindo(a)
  ao" na auréola da pomba (folga de 38px); com eles de volta em 26.1vh a folga
  é de 123px. O par TAU→título (90px) sempre bateu com o mockup (~89px).
  Atenção ao investigar: `espirito santo.png` tem um recorte vazado no formato
  de uma igreja, mas ele é **vestigial** — é uma silhueta simplificada, de
  outra versão da logo, e não corresponde ao `santuario logo.png` atual (o vão
  tem 346px de largura num arquivo de 924, e a igreja é desenhada com 424px de
  816 equivalentes). Não dá para usar esse vão para alinhar os dois.
- **Menu Inicial** — foto do santuário de 45vh para 39vh (o menu sobe até a
  grade da foto), ícones de `sm:w-40` (160px fixos) para `sm:w-[17.5vw]`
  (189px no totem, e proporcionais em qualquer tela) e rótulos no dobro do
  tamanho (`text-base` → `clamp(0.625rem, 2.96vw, 4rem)`). A logo do Santuário
  (canto **superior direito** da foto, não inferior esquerdo) saiu de `h-20`
  (80px fixos) para `clamp(3rem, 13.5vw, 18rem)` — 146px no totem — e o glow
  branco atrás dela cresceu junto (`sm:w-72` → `sm:w-[40vw]`, offset
  `-top-24` → `-top-[13vw]`), senão a logo maior passaria da borda da luz.
- **Missas** — a foto do frei era `object-cover scale(1.35)` ancorada no rodapé,
  saindo cortada e escondida atrás dos botões. Primeiro virou um quadro pequeno
  acima da barra Voltar/Início, mas o mockup mostra o contrário: o frei grande,
  **encostando no rodapé da tela, com os botões por cima dele**. Ficou
  `object-contain object-bottom` numa caixa `bottom-0 h-[52vh]`, **fora** da
  caixa da rosácea (que tem `overflow-hidden` e cortaria a foto). O corte reto
  do recorte (na altura do livro vermelho, y=895 de 1217) agora cai exatamente
  na borda da tela, então lê como enquadramento e o degradê que dissolvia essa
  borda saiu. O respiro antes do CTA caiu de 6.5vh para 4vh.
- **Confissões** — as duas fotos do Sanity **já trazem o esmaecido embutido no
  próprio alfa** (a de fundo, 1080x1706, começa em ~0.85 de opacidade e chega a
  0 por volta de 76% da altura dela; a principal, 1080x1244, começa
  transparente e fica opaca lá pelo meio). O código repetia esse esmaecido por
  cima — um degradê de creme de 55%→93% na de cima e uma `mask-image` na de
  baixo — e o resultado era a foto do topo aparecendo a ~38%: os dois senhores
  viravam fantasma. Os dois efeitos saíram e as duas fotos passaram a ser
  desenhadas **em tamanho natural** (largura cheia, 1:1 com o design): a de
  fundo ancorada no topo, a principal ancorada no rodapé, com os botões por
  cima. Confirmado no navegador: 1080x1706 em `top: 0` e 1080x1244 terminando
  em 1920. **Regra geral: antes de somar degradê numa foto do Sanity, conferir
  se o arquivo já não traz o esmaecido no alfa** (`magick arquivo.png -crop
  1x1+x+y +repage -format "%[pixel:p{0,0}]" info:`).
- **Padroeiro** — bloco de texto subiu (`pt-7.2vh` → `pt-4.5vh`), corpo do texto
  de 3.68vw para 4.05vw e a pomba subiu de `bottom-[-3.4vh]` para `bottom-[1.5vh]`.
  Depois disso a última linha do parágrafo encostava na auréola dourada. A causa
  era a **quebra de linha**: com `px-[19%]` o texto virava 7 linhas, e o mockup
  tem 6. Coluna alargada para `px-[15%]` (70% da tela, as mesmas quebras do
  mockup) e entrelinha de 1.62 para 1.46 (a do mockup, ~64px por linha). O
  parágrafo perdeu 43px de altura e a folga até a ilustração foi de 24px para
  77px — os ~78px do mockup. A pomba **não** mexeu.
- **Eventos** — a marca d'água da igreja é um recorte cortado rente à torre da
  direita; com 75% de largura essa borda reta caía dentro da tela. Em largura
  cheia ela sai pelas duas bordas e o desenho fica simétrico.
- **Nossa História** — ilustração com `translateY(-5.2vh)` (a ponta da torre
  encosta no topo; o arquivo deixa ~103px de creme acima dela), título de
  20.3vh para 13vh, cartão de texto de `object-cover` para `object-fill`
  terminando em `bottom-[12.5vh]` — assim os quatro cantos arredondados do
  recorte aparecem — e corpo de 2.55vw para 2.95vw.
  **Revertido em 22/09/2026** (ver "Nossa História: calibragem pelas torres"
  abaixo): os `-5.2vh` cortavam a torre na borda de cima e o título a 13vh
  ficava abaixo do mockup.
- **Carisma** — a foto era tela cheia e o terceiro parágrafo caía em cima dela.
  Virou faixa de 43vh no rodapé, com `object-position: center 72%` (corta o teto
  escuro e quase todo o tapete vermelho) e máscara de degradê nos 45% de cima.
  O `Degrade branco.png` do design saiu de cena junto — a máscara faz o papel.
- **Fraternidade / cabeçalho compartilhado** — a faixa cinza que quebrava a
  curva **não era sombra de CSS**: as fotos de capa cadastradas no Sanity já vêm
  com os cantos de baixo arredondados (pixels transparentes), e o degradê
  escuro do `CabecalhoComFundo` pintava preto 70% sobre o creme naquele pedaço.
  Agora o degradê usa a própria foto como `mask-image`, então ele só existe onde
  a foto existe — funciona com qualquer arredondamento de arquivo. O `shadow-xl`
  do cabeçalho também saiu.

Todas as 15 rotas continuam em 0px de rolagem depois desses ajustes.

### Fluxo de prévia (atualizado)

O Playwright continua fora do projeto, mas nem é mais necessário: o Chrome
instalado na máquina dá conta sozinho, sem instalar nada.

```bash
google-chrome-stable --headless=new --disable-gpu --hide-scrollbars \
  --user-data-dir=/tmp/chrome-shot --force-device-scale-factor=1 \
  --window-size=1080,1920 --virtual-time-budget=6000 \
  --screenshot=/tmp/tela.png http://localhost:3000/missas
```

Para comparar antes/depois e inspecionar detalhe (o ImageMagick também já está
na máquina): `magick antes.png depois.png +append -resize 700x comp.png` e
`magick tela.png -crop 320x180+0+640 +repage -resize 640x zoom.png`.

## Nossa História: calibragem pelas torres (22/09/2026)

O usuário fotografou o totem instalado ao lado do mockup: a ilustração do
santuário estava cortada na borda de cima e o título "Nossa História" mais
baixo do que no design.

**A régua.** `public/nossahistoria/fundo.png` (1080x1920, 1:1 com a tela) tem
duas torres com pontas em alturas diferentes: a da esquerda (x 542..765) em
y=47 (**2,45%** da tela) e a da direita (x 817..1007) em y=171 (**8,91%**). A
distância entre elas é fixa, então dá para achar as duas no mockup e resolver
o deslocamento sem chutar posição absoluta — foi assim que os números abaixo
saíram, e as duas torres deram o mesmo resultado.

- Ilustração: `translateY(-5.2vh)` → **`translateY(4.2vh)`**. Com -5.2vh a
  ponta caía em y=-53 (cortada); agora cai em y=128, **6,65%** da tela, que é
  onde o mockup a coloca, com creme acima.
- Título: `top-[13vh]` → **`top-[8.4vh]`**, que é o valor original de antes da
  rodada de 15/09 — aquela rodada desceu o título para 20.3vh "junto" com a
  ilustração, e isso é que estava errado.

Medido depois: título em 8,6%→16,9%, ilustração começando em 4,2%, cartão
36%→87,5%, 0px de rolagem.

**Recalibragem do resto da tela** (mesmo dia, a pedido do usuário: "a ideia é
ficar igual mesmo"). O que faltava vinha todo junto — margem, tamanho do
título, coluna de texto e posição do cartão se puxam. Valores finais, com a
medição do mockup ao lado:

| | mockup | ficou |
|---|---|---|
| margem lateral | ~7% | 7% (era 9%) |
| título (x) | 7,3%..47,6% | 7,0%..47,6% |
| título (y) | ~8,3%..20,7% | 8,4%..20,2% |
| cartão (x) | 6,8%..93,4% | 7,0%..93,0% |
| cartão (y) | ~42,4%..89,2% | 42,4%..89,2% |
| coluna de texto | ~72% da largura | 72,0% |
| linhas por parágrafo | 5 / 5 / 6 | 5 / 5 / 6 |
| botões (y) | ~90,2%..97,3% | 90,3%..97,3% |

Como o título foi medido sem depender da escala da imagem: **largura do título
dividida pela largura do cartão** (0,466 no mockup contra 0,407 no código).
Com o cartão já em 86% de largura, isso dá 8.3vw → **10vw** — e esse mesmo
número faz a altura do bloco (2 linhas) bater com o mockup, o que serve de
segunda confirmação.

**A pegadinha da coluna de texto:** o `<p>` tem `max-w-[26em]`, e `em` escala
junto com a fonte — então aumentar o corpo do texto **não muda a quebra de
linha**. Para chegar nas 16 linhas do mockup o que muda é o `max-w`
(26em → **24em**); a fonte foi de 2.95vw para 3vw só para casar a largura
da coluna com os 72% do mockup.

Ajustes finos que sobraram: `paddingTop` do texto 3.1vh → 2.3vh (a 3.7vh o
texto encostava no fundo do cartão, 7px de sobra; agora são 44px em cima e
34px embaixo, a mesma proporção do mockup, que tem mais respiro em cima que
embaixo), espaço entre parágrafos 3vh → 2.2vh (no mockup é ~1 linha) e a barra
Voltar/Início de `bottom-[5vh]` para `bottom-[2.7vh]` — a 5vh ela invadia 1,2%
do cartão; agora sobram 21px entre os dois, como no mockup.

**Uma diferença que ficou de fora de propósito:** o botão "Início" do mockup
vai até ~93,7% da largura e o do código para em 91%. Isso é geometria interna
do `NavVoltarInicio`, que é compartilhado por 15 telas — mexer ali mudaria
todas. Só a posição vertical (que é prop da página) foi ajustada.

## Carisma: foto reenquadrada pelo conteúdo do arquivo (22/09/2026)

No totem instalado os botões Voltar/Início caíam **em cima dos frades**. O
usuário pediu para subir a foto, "mesmo que apareça o tapete vermelho", e
deixar igual ao mockup.

**Como o `object-position` foi calculado.** A foto do Sanity tem 1080x1872 e a
faixa é mais baixa que o arquivo, então o `object-cover` **não amplia nada** —
o `object-position` só escolhe qual pedaço aparece. Perfilando o arquivo por
linha (proporção de vermelho / escuro / claro):

| trecho do arquivo | o que é |
|---|---|
| 0% – 57,5% | teto escuro do ginásio |
| 57,5% – 68% | banner branco da Festa da Penha |
| 66% – 85% | os frades |
| 85,6% – 100% | tapete vermelho puro |

Com os 72% antigos a janela ia de 40,2% a **84,3%** do arquivo: parava
exatamente onde o tapete começa, então os frades chegavam à borda de baixo da
tela e os botões pousavam neles. Com **94%** a janela vai de 44,7% a 97,1% —
os frades terminam em 88,2% da tela e sobram ~40px de tapete para os botões.

Os outros números, medidos contra o mockup:

| | mockup | ficou |
|---|---|---|
| faixa da foto começa | ~48,9% | 49,0% (`h-[43vh]` → `h-[51vh]`) |
| foto fica opaca | ~60,6% | ~61,8% (máscara `black 45%` → `black 22%`) |
| texto termina | ~52,3% | 51,2% |
| linhas por parágrafo | 4 / 5 / 3 | 4 / 5 / 3 |
| botões | ~91,3%..98,5% | 90,3%..97,3% |

O texto encolheu de 3.5vw para **3.2vw** e o espaço entre parágrafos de 3.4vh
para 2.5vh. Detalhe útil: **3.4vw já era suficiente** para o terceiro parágrafo
cair de 4 para 3 linhas (a quebra do mockup) — o resto da redução foi para a
altura do bloco bater. Os botões foram para `bottom-[2.7vh]`, a mesma altura de
Nossa História.

**O título ficou onde estava** (6,7vh). O mockup o mostra um pouco mais baixo
(~9,6vh), mas o pedido foi "subir um pouco tudo" e a diferença está dentro da
margem de erro da medição do mockup — não faria sentido descer o único
elemento que o usuário não reclamou.

Conferido de passagem: esta foto **não** tem o esmaecido embutido no alfa (o
topo do arquivo é escuro opaco, não transparente), então a máscara CSS não
está duplicando degradê nenhum — diferente do que acontecia em Confissões.

## Pendências / próximos passos

1. **Outras opções do menu principal ainda sem página.** A lista real do
   `menuTotem` no Sanity (consultada em 14/09) é, em ordem: Sobre Nós
   (`/sobre-nos`), Missas (`missas`), Confissões (`confissoes`), Padroeiro
   (`padroeiro`), Pastorais (`pastorais`), Eventos (`eventos`), Avisos
   (`avisos`), Dizimo (`dizimo`), Secretaria (`secretaria`), Redes Sociais
   (`redesocial`) e Onde Estamos (`ondeestamos`). As **seis últimas ainda não
   têm rota implementada** — são as próximas telas a fazer, seguindo o mesmo
   fluxo (design + assets reais em `public/<nome-da-pagina>/` + prévia
   validada antes de portar).
   - Atenção: no Sanity as rotas estão cadastradas **sem barra inicial**
     (`missas`, e não `/missas`). Funciona porque o menu fica em `/` e o link
     resolve relativo, mas é bom saber ao criar rotas novas.
   - **Antes de criar a pasta da rota, conferir o valor exato de `rota` no
     `menuTotem`** — nem todos seguem o nome "bonito" da tela. Redes Sociais,
     por exemplo, está cadastrado como `redesocial` (sem hífen), então a pasta
     teve que ser `app/redesocial/`. Consultar com:
     `*[_type=="menuTotem"]|order(ordem asc){ordem,titulo,rota}`

2. **Fluxo de prévia (Playwright).** O projeto não tem Playwright como
   dependência e não deve ter. Para repetir a verificação visual, instale-o
   numa pasta temporária fora do repositório, sirva uma prévia HTML estática
   com os assets/fontes reais e renderize em 1080x1920 — foi assim que
   Padroeiro e Pastorais foram validados antes de virar `.tsx`.

## Cadastrar conteúdo no Sanity pela linha de comando

Não existe token de escrita no `.env.local` (só as duas chaves `NEXT_PUBLIC_*`,
que são de leitura). Mas o **Sanity CLI desta máquina está logado**
(`~/.config/sanity/config.json`), então dá para semear conteúdo sem criar token:

```bash
npx sanity documents create arquivo.ndjson --replace
```

Uma linha por documento, JSON puro. Para singleton, o `_id` tem que ser igual
ao `id` usado em `PAGINAS_UNICAS` no `structure.ts` (ex: `"_id": "paginaSecretaria"`),
senão o Studio abre um formulário vazio em vez do documento criado. Itens de
array que são objetos precisam de `_key` único.

Foi assim que os horários/telefones/WhatsApp da Secretaria foram cadastrados
(dados tirados do mockup). Imagens **não** dá para enviar por aí — precisa ser
pelo Studio ou por um script com token de escrita.

## Auditoria contra os mockups (15/09/2026)

O usuário mandou os mockups de todas as telas. O que foi corrigido:

- **Frade (detalhe)** — o cabeçalho tinha um degradê rosa/vinho que não existe
  em mockup nenhum. O design alterna **dourado (`#C49334`) e vinho (`#8B1E31`)**
  de um frade para outro, com os raios no tom correspondente (creme no dourado,
  escuro no vinho). Virou o campo `corCabecalho` no schema `frade`, e os 5
  frades já cadastrados foram setados conforme os mockups. Nome agora quebra em
  duas linhas (`max-w-[64%]`), TAU maior, corpo mais largo.
- **Missas** — a tela inteira estava com tipografia ~25% menor que o mockup
  (título, linhas de horário, observações e CTA) e a foto do padre pequena
  demais. Tudo reescalado; a foto ganhou `scale(1.35)` com origem embaixo.
- **Primeira Vez Aqui** — "PRIMEIRA VEZ AQUI" estava pequeno demais e
  "Seja bem-vindo(a)!" grande demais.
- **Carisma** — corpo do texto menor que o mockup.
- **Fontes e paleta** — ver as duas seções acima.

- **Quem Somos** — o arco começava em ~23vh e comia metade da foto. O recorte
  `forma branca.png` (1080x1475) em largura cheia sempre cai nessa altura, então
  ele é empurrado 9.8vh para baixo (`bottom: -9.8vh`) — o que sai da tela é só a
  faixa lisa de baixo. Título, texto e a marca d'água do Cristo desceram junto.
- **Nossa História** — a ilustração está 1:1 com o arquivo (`fundo.png` já vem
  em 1080x1920), mas o arquivo posiciona o desenho ~8vh mais alto do que o
  design. Corrigido com `translateY(8vh)` na imagem: em cima sobra creme igual
  ao fundo e embaixo o que sai fica atrás do cartão de texto. Título desceu
  junto (8.4vh → 20.3vh).

Ainda diferente do mockup (não corrigido, precisa de decisão):

- **Frei Clarêncio Neotti** — o mockup dele usa raios **marrom escuro** sobre o
  dourado, enquanto os outros dois dourados (Vanderlei da Silva e Valdemiro)
  usam raios creme. Hoje o código amarra o tom do raio à cor de fundo, então
  ele sai creme. Se for intencional, precisa virar uma segunda opção no Sanity.

## Itens em aberto sem resposta do usuário (não decidir sozinho)

- `public/looping/sublinhado.png` (lente dourada), `pontinhos.png` e
  `vila velha.png` ficaram **sem uso**: a linha "· · · VILA VELHA | ES · · ·"
  já vem pronta e completa em `vila velha espirito santo.png`, e no mockup não
  aparece nenhuma lente dourada. O usuário avisou que não tinha todos os assets
  desta tela, então pode ser que falte peça ou que essas sejam sobras — vale
  confirmar antes de apagar ou de inventar um lugar para elas.

- `public/fraternidade/forma radial.png` — **resolvido em 15/09/2026**: é o
  raio creme (`#F8F5EB`) que aparece meio cortado pela borda no cabeçalho dos
  frades. A página usa hoje a variante de círculo cheio
  (`forma radial inteiro.png`, creme semitransparente) posicionada metade para
  fora da tela, que dá o mesmo efeito; o meio-círculo segue disponível se
  alguém preferir trocar.
- `app/sobre-nos/_components/PaginaInternaPadrao.tsx` — componente órfão,
  ficou sem uso depois que Carisma/São Francisco/Nossa História/Primeira
  Vez/Quem Somos passaram a ter páginas próprias. Foi oferecido para apagar,
  mas isso **nunca deve ser feito sem autorização explícita do usuário**
  (combinado desde o início do projeto: não apagar arquivos sem permissão).

## Armadilha de fonte (já corrigida, mas fácil de repetir)

`app/globals.css` tem `body { font-family: Arial, Helvetica, sans-serif }`.
Ou seja: **todo texto sem `fontFamily: 'var(--font-*)'` explícito cai em Arial**,
sem erro nenhum e sem aviso. Não existe fallback para as fontes do projeto.

Por isso, nunca usar as classes de peso do Tailwind (`font-bold`, `font-serif`,
`font-light`) achando que aplicam a fonte certa — elas só mudam peso/família
genérica. Sempre `style={{ fontFamily: 'var(--font-bold)' }}` e afins.

Em 15/09/2026 isso foi encontrado em: o título "Menu Inicial" (estava em serifa
do sistema em vez de Asah), os rótulos dos botões do menu, o estado vazio da
lista de frades, a tela de "Frade não encontrado" e o fallback do Suspense em
`app/page.tsx`. Ao criar tela nova, conferir com:
`grep -L "var(--font-" $(find app -name "*.tsx")`

## Coisas específicas deste repositório (não é o Next.js "padrão")

O `AGENTS.md` deste projeto (auto-gerado pelo `next dev`) avisa que esta
versão do Next.js pode ter diferenças em relação ao que você já conhece —
antes de mexer em APIs/convenções do framework, vale checar
`node_modules/next/dist/docs/`. Next 16.3.3, React 19.2.8.

Variáveis de ambiente esperadas em `.env.local` (valores não vão neste
arquivo): `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_PROJECT_ID`.
