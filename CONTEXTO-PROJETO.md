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
