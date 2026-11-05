# Livro do Jogo — Rumo ao Cume

Jogo de plataforma 3D (estilo Mario) com o ninja **Kuro**. É um único arquivo HTML que roda no navegador do celular e do PC.

- **Jogo publicado (sempre a versão mais nova):** https://claude.ai/code/artifact/eb530067-b35e-4087-9a84-8ab3ee2b95fd
- Depois de cada mudança, mandar também a cópia para baixar `rumo-ao-cume.html`.
- A conversa com o dono do jogo é em **português (BR)**.

**Toda conversa nova sobre o jogo deve ler este livro primeiro.**

---

## 1. Regras do dono do jogo (não quebrar)

1. **Explicar antes de mexer quando ele pedir.** Se ele disser "antes de editar me fala" ou "fala comigo", primeiro explicar o plano e esperar o "sim".
2. **O celular tem que ficar leve.** Ele joga num Realme C63. As qualidades Baixa e Média precisam rodar bem lá. Ele também joga no PC.
3. **Referências servem só de inspiração.** As imagens que ele manda (muitas são de jogos reais) são só para dar a ideia. Sempre criar uma versão original, "do nosso jeitinho", sem copiar.
4. **Todas as fases ficam liberadas** (`TESTE_LIBERADO=true`) até ele pedir para bloquear de novo, quando o jogo estiver pronto.
5. **Fases que ele declarou perfeitas não mudam:**
   - **Vila Ninja (Mundo 8):** "fase perfeita, não vamos modificar nada".
   - **Vulcão (Mundo 10):** "não tira nada do que já tem". Só acrescentar ou trocar o que ele pedir.
6. **Inimigos que não alcançam o Kuro desistem**, em vez de ficar travados tentando.
7. **A Raposinha Foguete** não entra na água (Recife) nem no Castelo. No Vulcão ela **pode** entrar: ela começa na paisagem de fora e acompanha o Kuro para dentro.

## 2. Os mundos

| # | Nome | Tema | Tempo | Destaques |
|---|------|------|-------|-----------|
| 1 | Vale Verde | valley | 5:00 | Canos, sala secreta, plantas |
| 2 | Caverna de Cristal | cave | 7:00 | Pêndulos, gotas, saída a céu aberto |
| 3 | Floresta Esmeralda | forest | 6:00 | Pêndulos, sala de cano |
| 4 | Recife Submerso | reef | 6:00 | Água, ar, correntes, bolhas (sem raposa) |
| 5 | Castelo do Medo | castle | 8:00 | Começa do lado de fora, porta do trono, chefe Rei Besouro (sem raposa) |
| 6 | Montanha Gelada | peaks | 3:40 | Fase alta, bolas que rolam |
| 7 | Deserto das Ruínas | ruins | 4:00 | Maré de areia, areia movediça, ventania |
| 8 | Vila Ninja | village | 5:00 | Noite, varais, polias, portas de correr, biombos para se esconder dos guardas |
| 9 | Torre Verde | heights | 5:30 | Fase vertical, elevadores, correntes de ar, cachoeiras ao fundo |
| 10 | Vulcão | volcano | 4:00 | Paisagem de fora com o vulcão gigante, lava, pedras que afundam, correntes, chuva de pedras de fogo com abrigos, torre de plataformas finas, jatos de fogo, fuga da parede de fogo com bolas de fogo |
| 12 | Floresta Ancestral (Terra Nova) | trail | 9:00 | **Em construção, parte por parte** (ideia do dono): 0. abertura na praia (barquinho chega com Kuro e a raposinha), 1. Trilha Verde (raízes em arco, flores grandes que abrem quando o Kuro passa, tronco oco de atravessar, torre de vigia com lanternas, cercas), 2. Rio Cristalino (pronto: pedras, algumas balançam; troncos que descem a correnteza para a direita; ponte suspensa que afunda embaixo do Kuro; peixinhos pulando; cair na água tira 1 coração e a correnteza devolve o Kuro à última pedra), 3. Jardim dos Cogumelos (pronto: cogumelos gigantes que jogam o Kuro para cima — vermelho alto, azul mais alto, dourado altíssimo; pedras redondas de grama que dá para atravessar por baixo; plantas gigantes em espiral), 4. Caminho das Copas (pronto: cipó de subir, tábuas presas nos troncos com arvorezinhas, plataforma de tábuas pendurada que anda, elevador de cipó, cipó de pendurar, galhos finos e o topo das copas; a raposinha espera embaixo; a câmera sobe junto), 5. Cachoeira Secreta (pronta: descida por pedras, mata azulada com névoa e raios de luz; a cachoeira empurra o Kuro para fora e para de vez em quando; parada, deixa passar e revela a gruta com cristais brilhando e o 3º cristal da fase), 6. Mirante da Floresta (pronto: ponte suspensa que balança no vento, árvore gigante com casinhas de telhado colorido e lanternas em zigue-zague, balões, ilha flutuante e o mirante; tocar no Cristal Ancestral solta um feixe de luz e termina a fase, sem chefe). **Mundo 12 completo.** |
| 13 | Escalada dos Blocos Celestes (Terra Nova) | sky | 12:00 | Fase vertical **longa e difícil**, sem chefe, 6 andares até a torre com sino (altura 137). **Cubos sólidos** (bate a cabeça embaixo, as tartarugas batem e viram) que **crescem multiplicando** (ideia do dono): azul ↔ cresce para o lado formando ponte, verde ↕ cresce para cima formando coluna (levanta o Kuro); **esticam de forma contínua** (sem som), seguram cheios, encolhem suave e repetem; pontes alternam o lado (uma para a direita, a próxima para a esquerda). Ao esticar, empurram o Kuro e as tartarugas para fora — ninguém fica preso dentro. Também: fileiras roxas que somem, cubos dourados aceleradores, blocos "?" com cogumelo/pena. ~20 tartarugas voadoras (verde 1 pulo, vermelha perseguidora que desiste, cinza casco duro 2 pulos). Cair volta à bandeirinha sem perder coração. Paisagem: ilhas flutuantes com cachoeiras e céu escurecendo. |
| 11 | O Cume | summit | 7:00 | Final da primeira ilha, ao amanhecer, em 3 partes. **1. Encosta do vento:** rajadas avisadas pelas bandeirinhas, pedras de abrigo, cabritos e corvos da neve, vão que só se pula com vento a favor. **2. Acima das nuvens:** ilhas flutuantes, portais vermelhos, ponte de corda, pipas gigantes e nuvens que somem. **3. Santuário:** revanche do Rei Besouro com armadura (6 golpes, 3 fases: investidas, ondas de choque, voo e mergulho com o teto desmoronando). Vencer abre o caminho até o pico; a bandeira mostra a cena final (bandeira do Kuro, nascer do sol, raposinha e a terra nova no horizonte) e o cartão "Fim da primeira ilha". |

**Visual do Cume (aprovado pelo dono):** encosta ao amanhecer com agulhas de pedra listradas ao fundo, encosta de cascalho com muita grama seca (poucas falhas, também nas ribanceiras das plataformas), pedras de granito com musgo, plantinhas e neve no topo, paredão em camadas, trilha pisada e beirada de neve com pingentes. A parte das nuvens é **de dia** (segue a referência de montanhas verdes sobre mar de nuvens): céu azul com nuvens, serras azuis, montanhas verdes com grama e afloramentos de rocha, ilhas com paredão em camadas, raízes e cipós, floresta de pinheiros lá embaixo quase toda coberta, e as nuvens correndo rápido com o vento. O dono decidiu manter a cena final com o nascer do sol. **Clipe final:** Kuro crava o mastro com as duas mãos, ergue a katana para o céu e depois se vira de costas olhando a terra nova; a raposinha dá uma volta em torno dele e senta ao lado, os dois olhando o horizonte.

## 3. Poderes e transformações

- **Cogumelo:** Kuro fica grande.
- **Flor de fogo:** atira bolas de fogo. Ao pegar, há uma transformação com coluna de chamas. Enquanto tiver o poder, o corpo brilha num laranja quente e tem uma aura em volta.
- **Regra do bloco da peninha (dono):** todo bloco de pena é **verde com a pena desenhada** e sempre dá a pena (Kuro pequeno fica grande e com capa de uma vez). Cada um tem uma **tartaruga guerreira voadora** (casco roxo, elmo dourado, lança) de guarda: voa em volta do bloco, ataca o Kuro só dentro do seu território e **arremessa a lança** nele (ergue a lança antes, como aviso; a lança volta depois; o giro da capa rebate); 1º pulo tira as asas e ela cai e anda no chão, 2º pulo derrota. Não é obrigatório derrotá-la para pegar a pena.
- **Pena dourada → capa:** voa, plana e dá um giro que derrota inimigos. Ao pegar, Kuro gira e a capa se desenrola. O inimigo atingido pelo giro sai voando para trás e depois quebra em pedaços.
- **Raposinha Foguete:** montaria com botão de impulso. Na primeira montada de cada raposa, Kuro dá um mortal até a sela, com som de galope.
- **Fruta:** escudo mágico, protege de um golpe.
- **Corações:** sem limite. A tela mostra no máximo 5 coraçõezinhos e o que passar aparece como "+N". Os corações passam de uma fase para a outra (nunca começa com menos de 3); se perder tudo, volta para 3.
- **Luta na arena (Castelo e Cume):** postura de luta (joelhos dobrados, katana com as duas mãos, de lado para o chefe) e Kuro mais rápido. Golpes: corte normal (combo), **segurar e soltar a Katana** = golpe carregado giratório (quebra a guarda do chefe ou dá dano dobrado se ele estiver tonto), **Cima + Katana** = corte para cima, botão **Shuriken** (tecla L/C) = estrela de longe (mata filhotes, só fere o chefe tonto).

## 4. Como o código está organizado

O jogo é **um HTML só**, mas dentro dele há marcadores (`/*@@parte:nome*/`) que dividem o código em partes:

| Parte | O que tem |
|-------|-----------|
| 00_inicio.html | HTML, estilos (CSS) e telas |
| 01_motor.js | Renderizador, texturas, modelo do Kuro, partículas, som e música, pós-processamento |
| 10_mundos_dados.js | **Dados das fases** (`LEVELS`): plataformas, inimigos, moedas, blocos e os ajustes de cada mundo |
| 11_construcao.js | Construção do mundo, inimigos e objetos |
| 20_vila_ninja.js · 21_torre_verde.js · 22_vulcao.js · 25_cume.js · 26_trilha.js | Cenário e mecânicas de cada mundo (25_cume.js também tem a revanche do Rei Besouro e a cena final) |
| 23_castelo_fora.js | Chegada do castelo, mais ajudantes gerais como `mergeG` e `xf` |
| 24_caverna.js | Cristais e saída da caverna |
| 30_cenario.js · 31_moedas.js | Cenário caprichado (Alto, Ultra e Máximo) e distribuição de 100 moedas por fase |
| 40_estado.js · 41_raposa.js · 42_blocos.js | Estado do jogo, Raposinha Foguete, blocos, cipó e canos |
| 50_fisica.js · 51_ruinas.js · 52_castelo.js · 53_agua.js | Física, Ruínas, castelo e chefe, água |
| 60_animacao.js | Animação do Kuro, transformações e brilho |
| 70_entrada.js · 71_laco_e_mapa.js | Controles, laço principal e mapa da ilha |
| 99_fim.html | Final do arquivo |

**Ferramentas** (texto completo no documento "Ferramentas e testes"):
- `separar.py jogo.html partes/` separa o HTML nas partes.
- `montar.py partes/ jogo.html` junta tudo de novo, **byte por byte igual**.
- `testa.sh` monta o jogo e roda o teste completo.

## 5. Jeito seguro de mudar o jogo

1. Mexer só na parte certa (um mundo novo = uma parte nova, por exemplo `25_cume.js`, mais os dados em `10_mundos_dados.js`).
2. Rodar `./testa.sh` (também há `testes/foto.js` para tirar fotos de tela: `node testes/foto.js <fase> <preset> x,y,nome`). Todos os testes precisam passar (hoje são 28):
   1. Todas as fases abrem no celular (modo Baixo) e no PC (Alto).
   2. A raposinha sai do bloco e monta, em todos os mundos que têm o bloco.
   3. Vulcão: os pulos do trecho das pedras de fogo dão para fazer.
   4. Vulcão: a fuga da parede de fogo (parado morre; andando e correndo chega à bandeira).
   5. Vulcão: as pedras de fogo não acertam embaixo dos abrigos e acertam no aberto.
   6. Vulcão: o relógio só corre depois de entrar.
   7. As transformações da capa, da flor e da raposa terminam e liberam o Kuro.
   8. O giro da capa arremessa o inimigo e ele quebra em pedaços.
   9. O chefe do castelo é derrotado e a fase termina.
   10. Cume: o caminho da encosta dá para passar.
   11. Cume: a pedra protege da rajada, e o vão longo só se pula com vento a favor.
   12. Cume: as ilhas e as nuvens dão para passar.
   13. Cume: as pipas levam o Kuro até a ilha certa, e as nuvens somem e voltam.
   14. Cume: a revanche do Rei Besouro passa pelas 3 fases e ele é derrotado.
   15. Cume: a vitória abre o pico e mostra o final da ilha.
   16. Arena: shuriken, golpe carregado e corte para cima.
   17. Mundo 12: o barquinho chega, a Trilha Verde e o Rio Cristalino e o Jardim dos Cogumelos dão para passar (troncos, correnteza e cada cogumelo).
   18. Mapa com as duas ilhas: o Kuro vai de barco até a Terra Nova e volta.
   19. Mundo 12: o Caminho das Copas dá para subir (robô faz a subida inteira).
   20. Mundo 12: Cachoeira Secreta (a água empurra, parada deixa passar, cristal na gruta).
   21. Mundo 12: Mirante da Floresta e o Cristal Ancestral terminam a fase.
   22. Mundo 13: blocos celestes, tartarugas e queda sem perder coração.
   23. Mundo 13: robô sobe os 6 andares, cubo por cubo, até a torre.
   24. Mundo 13: nenhum apoio tem teto baixo em cima (folga para pular).
   25. Corações: sem limite, passam de fase, 5 na tela + N, voltam a 3.
   26. Peninha: bloco verde, sempre dá pena, guerreira de guarda (2 pulos).
   27. Não aparece nenhum erro de JavaScript.
3. Olhar fotos de tela da mudança, também no modo do celular.
4. Salvar a versão no histórico (git), publicar no link do jogo e mandar o HTML.
5. Quando criar uma mecânica nova, **criar também um teste para ela** no `roda.js`.

## 6. Se a área de trabalho sumir

A área de trabalho do Claude é temporária. Para recomeçar:

1. Ler o jogo publicado (Artifact, ação "read" no link acima) e salvar como `jogo.html`. Ele já vem com os marcadores das partes.
2. Recriar as ferramentas e os testes a partir do documento "Ferramentas e testes" deste projeto.
3. Rodar `separar.py` e depois `./testa.sh` para confirmar que tudo está bem.
4. O teste precisa do three.js 0.147 local em `testes/node_modules/three` (`npm install three@0.147.0`).

## 7. Próximos passos combinados

- **Robô gerador de fases.** O dono do jogo se preocupa que as fases fiquem parecidas. Plano:
  - trechos curtos de desafio feitos à mão, que o robô costura de jeitos diferentes;
  - variação de hora do dia e de clima;
  - mistura de mecânicas de mundos diferentes;
  - formatos variados de fase: para a direita, torre, descida, fuga, chave e porta;
  - o testador de pulos garante que toda fase gerada dá para passar.

  Ainda não foi decidido se vira um Modo Infinito, uma Fábrica de Fases com código, ou os dois.
- **Mundo 11, o Cume:** pronto (final da primeira ilha).
- **Segunda ilha — Terra Nova (aprovado pelo dono, 11 mundos feitos à mão, do 12 ao 22).** História: a luz da terra nova vem da **Árvore Mãe**; o **Corvo Sombrio** (mestre ninja de penas pretas, chefe do Rei Besouro) roubou as **Sementes de Luz**. Em cada mundo Kuro recupera uma semente.

  | # | Mundo | Hora/clima | Mecânica principal | Inimigos / chefe |
  |---|---|---|---|---|
  | 12 | Praia da Chegada | manhã, sol | conchas-trampolim, ondas que empurram | caranguejos de lado, gaivotas |
  | 13 | Bosque dos Cogumelos Gigantes | entardecer | cogumelos que quicam, esporos que fazem flutuar | lesmas, besourinhos de esporo |
  | 14 | Torre dos Vaga-lumes (aprovado) | noite | subida vertical como a 13: engrenagens que só giram com a luz dos vaga-lumes, plataformas de luz, alavancas, pêndulos; final = tocar o sino | sapos, mariposas, robôs de corda (sem chefe) |
  | 15 | Mina dos Trilhos | subterrâneo | corrida de carrinho de mina, desvios e alavancas | chefe Toupeira Gigante |
  | 16 | Cidade das Engrenagens | tarde | engrenagens que giram plataformas, botão que congela o tempo 3 s | robôs de corda |
  | 17 | Lago da Aurora | noite gelada | gelo escorregadio, patinação, gelo que trinca | pinguins, foca |
  | 18 | Templo dos Espelhos | dentro do templo | girar espelhos para o raio de luz abrir portas | guardas de pedra |
  | 19 | Navio Voador na Tempestade | chuva e raios | convés que balança, raios avisados, canhões | chefe Capitão Corvo-Pirata |
  | 20 | Cânion Invertido | pôr do sol | setas que viram a gravidade | morcegos, pedras que caem para cima |
  | 21 | Raízes da Árvore Mãe | escuro, brilho verde | raízes que crescem e viram ponte, cipós que se mexem | chefe Aranha das Raízes |
  | 22 | Copa da Árvore Mãe | amanhecer dourado | subida final misturando tudo | chefe final Corvo Sombrio |

  **Regra do dono (23/10):** os chefes do 15 (Toupeira Gigante), 19 (Capitão Corvo-Pirata) e 21 (Aranha das Raízes) ficam. Os outros mundos não têm chefe. O chefe final do Mundo 22 será **a Bruxa** (a do Castelo do Medo, versão chefão).
  Regras: cada mundo com mecânica só dele e hora/clima diferentes, sem repetir as da primeira ilha. Poder novo opcional: **Gancho Ninja** (mundo 13). Construir um mundo por vez, numa parte própria, com testes.
- **Mapa:** as duas ilhas ficam no mesmo mapa; a Terra Nova fica ao norte, do outro lado do mar. Ao escolher um mundo da outra ilha, o Kuro e a raposinha atravessam de barquinho (pedido do dono). Depois do Cume, o botão do final leva direto para lá.
- **Bloquear as fases de novo** só quando o dono pedir.

### Espaço das guerreiras da pena
- Território das tartarugas guerreiras ficou igual; os blocos é que saíram do caminho.
- Mundo 1: a plataforma flutuante perto da pena passou de 123–127 para 121,8–125,8.
- Mundo 13: a coluna inicial (x 16,5) subiu um pouco (base 6,6); a fileira de tijolos com "?" saiu de cima da pena e foi para o lado esquerdo: x 1–3, altura 6,5 (o "?" em 2 / 10,5). (Antes tinha ido para x 20,5–22,5 / 14, mas o "?" ficou enterrado na ilha — corrigido.)
- Teste 29 (testes/roda.js) e testes/guarda.js conferem em todas as fases que nada fica no espaço de voo em volta de cada bloco da pena.
- Teste 30: nenhum bloco pode ficar enterrado/encostado em terra ou plataforma, em todas as fases.

### Mundo 13 — quedas limitadas (regra do dono)
- Cada bandeirinha dá 3 voltas: nas quedas 1, 2 e 3 o Kuro volta para ela (aviso "chances: 2", "chances: 1", "Última volta!").
- Na 4ª queda ele cai de verdade até achar onde pisar (cubo, ilha, fileira) ou o chão.
- Queda nunca tira coração — coração só se perde para inimigo.
- Bandeirinha nova = 3 chances novas. Sem chances, se ele subir de volta até a mesma bandeirinha, ganha as 3 de novo.
- Teste 31 confere tudo isso.

### Mundo 13 — cubos que alternam (pedido do dono)
- Os cubos grandes que esticam agora alternam: uma volta para cima (coluna), a outra para o lado (ponte), sempre a partir do mesmo cubo do pé.
- Cor própria: verde-água com setas para os 4 lados. Antes de trocar de direção o cubo do pé pisca e pulsa.
- O jogo escolhe sozinho o lado da ponte (para onde há espaço) e, se não couber inteiro, usa um pouco menos de cubos (mínimo 3). Não pode encostar em ilha, bloco, outro cubo nem no espaço da guerreira da pena, e sempre deixa folga para pular em cima e passar embaixo.
- 20 dos 25 cubos grandes alternam; 5 não têm espaço livre e ficam como antes. Ajudantes lentos, fileiras roxas e aceleradores não mudam.
- Código: skAltPlan / skAltOn / skBox em partes/27_ceu.js; testes/alt13.js lista quem alterna. Robô da subida (rota13) espera até 2 voltas.

### Mundo 14 — Torre dos Vaga-lumes (em construção: 1º e 2º andares prontos)
- Parte própria: partes/28_torre.js (tema 13 'tower', música 13, MATS 13). Dados em LEVELS[13] (10_mundos_dados.js).
- Engrenagens (LV.gears {x,y,r,n,w,on,off,ph}): rodas de bronze com tábuas que ficam sempre retas (tipo roda-gigante). Só giram com o vaga-lume no eixo; sem luz param devagar. on/off = segundos com/sem luz (sem on = sempre acesa). As tábuas são de um lado só (dá para pular por baixo) e levam o Kuro junto.
- Vigas de madeira = um lado só; o chão é firme. Sino (LV.bell): tocar = fim da fase (por enquanto o sino de teste fica no alto do 1º andar).
- Quedas: mesma regra do Mundo 13 (3 voltas por bandeirinha, 4ª de verdade, sem perder coração).
- Cenário: parede de pedra com janelas em arco (lua, estrelas e árvores do pântano lá fora), engrenagens grandes e pêndulos girando no fundo, vaga-lumes piscando, água escura do pântano com vitórias-régias e juncos. Paredes, juncos e folhas juntos em poucas malhas (leve no celular).
- Sem blocos de coração automáticos nessa fase (noHeartFit).
- Teste 32 + testes/rota14.js: anda na tábua uma volta inteira e o robô sobe até o sino.
- 2º andar: 6 rodas pequenas (raio 1,8–2) mais rápidas e com menos tempo de luz; 3 sapos nas vigas (o sapo de sempre, preso na sua viga: tw = faixa da viga, porque as tábuas se mexem). Bandeirinhas no começo do 2º andar e na viga da direita. Sino de teste no alto do 2º andar.
- Tábuas das rodas agora são FIRMES (pedido do dono): bate a cabeça por baixo, não atravessa pelos lados; se a tábua se mexer e encostar no Kuro, ele é empurrado para fora (em cima = sobe junto). As vigas também são firmes (pedido do dono: no jogo inteiro nada deixa atravessar por baixo; o jogador acharia que é bug).
- Regra do dono: uma peninha (bloco verde + tartaruga guerreira) em cada andar. Andar 1: x 21,5 / 3. Andar 2: x 22,5 / 36,2.
- Regra do dono: tartarugas voadoras a partir do 3º andar.
- Rodas bem separadas (pedido do dono): o teste 32 gira todas as rodas em todos os ângulos e confere que uma tábua (com o Kuro em cima, 1,9 de altura) nunca encosta em outra roda nem em viga, e que nenhuma tábua entra no espaço de quem está em pé numa viga. Validador também em scratchpad/val/v14.py. Layout novo: andar 1 com 4 rodas, andar 2 com 4 rodas; vigas [20,24,13], [0,4,4,5,25,5], [19,5,24,33], [0,4,5,44]; sino em x 2,5 / 44.
- 3º andar (escuro): SEM peninha (pedido do dono) — no lugar, cogumelo em x 22,5 / 59. Plataformas de luz (LV.lights [x0,x1,y]) acesas pelos vaga-lumes que vão e voltam (LV.lflies {pts,sp}); firme só com o vaga-lume a menos de 2,8; depois que ele sai, pisca 0,45 s e some (Kuro cai). Ao acender, só volta firme se não tiver ninguém dentro. 2 rodas (x 19 / 51 e x 11 / 66). 2 tartarugas voadoras verdes. LV.dark=[44,69] escurece a luz da torre. Sino de teste no alto do 3º andar (x 21,5 / 69).
- 4º andar (alavancas e mariposas): 5 rodas; alavancas (LV.levers {x,y,g:[rodas]}) — pular em cima vira as rodas listadas (o Kuro quica); as rodas são cópias dos dados (alavanca e sino não mexem em LEVELS). Mariposa (inimigo 'moth', route = lista de rodas): voa de roda em roda, pousa no eixo 2,2 s e apaga a roda por 3,5 s; derrotada (pulo ou katana) a luz volta na hora. Tartaruga verde + tartaruga vermelha (perseguidora). Peninha em x 23 / 92,2. Sino de teste no alto do 4º andar (x 2,5 / 102).
- Andares 5 e 6 (pedido do dono: não sobe mais — paisagem de dia, sol forte, muitos obstáculos e inimigos): no alto do 4º andar a viga [13,30,102] leva até a PORTA na parede direita (x 24,5). Lá fora a câmera segue para a direita (LV.outside {x,y,camMax,xMax}), o dia nasce aos poucos (twDay: céu, névoa, sol, luz e brilho vão da noite para o dia; lua/estrelas somem, sol/nuvens/morros aparecem). Cair na água lá fora = queda normal (perde coração); a regra das 3 voltas vale só dentro da torre.
  - 5º, Pântano ao Sol (x 27–110): ilhas de terra ('terra'), passarelas ('tabua'), vitórias-régias que afundam com o Kuro em cima (LV.pads), troncos boiando que vão e voltam (LV.logs), roda d'água (gear mill). Inimigos: sapos, libélulas (dfly, zigue-zague) e tartaruga verde. Peninha em x 67,5.
  - 6º, Colina do Relógio (x 110–200): engrenagens enterradas (gear nofly), ponte de corda que afunda e balança (LV.bridges), pedras rolando morro abaixo (LV.rocks: nascem no alto, rolam para a esquerda, machucam, caem nos buracos), cata-ventos, flores. Inimigos: robôs de corda (wrob: 1º pulo desliga a corda 3,5 s, 2º derrota), tartaruga verde, vermelha e libélula. Peninha em x 185. Sino de verdade numa torrezinha de pedra no alto da colina (x 196 / 108,5).
  - Troncos usam relógio próprio (não o tm do desenho) para o teste e o jogo baterem.
- Próximos andares (antigo plano): 3 andar escuro e plataformas de luz; 4 alavancas e mariposas; 5 pêndulos e robôs de corda; 6 o sino.

### Mundo 13 — blocos sem amontoado (pedido do dono)
- Tijolos em 120 estavam em cima de uma fileira roxa: a fileira roxa (19,5 / 120) saiu. O "?" de moeda (20 / 124) estava colado embaixo da coluna ajudante: a coluna foi para x 22,5.
- Tijolos em 72 e em 103 encostavam em cubos ajudantes: foram meio a um passo para a direita (72: x 21–23, "?" em 22 / 76; 103: x 21–23, "?" em 22 / 107).
- Teste 33: nenhum tijolo ou "?" pode encostar (ou ficar colado em cima/embaixo) em cubo, cubo alternado ou fileira roxa.

### Clipe de abertura (pedido do dono)
- partes/29_abertura.js. Passa na 1ª vez que o jogador entra no Mundo 1 (save.seenOpen) e pelo botão "Abertura" do menu. "Pular" (botão) ou Espaço/Enter/Esc pulam.
- Cena (~21 s): manhã na Vila das Folhas (5 casinhas, árvores, praça de pedra, lanternas, pétalas) montada à esquerda do começo do Mundo 1; o Kuro treina katana com a raposinha olhando → céu escurece, vento, sombra → o Rei Besouro (mesmo modelo do chefe, com coroa e asas) desce e bate no chão, o Kuro pula para trás → arranca o Coração de Cristal do altar, ergue e ri; a vila perde a cor → foge voando para o Vale Verde → o Kuro aperta a faixa, ergue a katana, título "Rumo ao Cume" → sai correndo com a raposinha → escurece e abre o cartão do Mundo 1.
- Tarjas pretas de cinema; HUD e controles escondidos; capim alto escondido durante a cena. Testes usam window.__noOpen (o teste 34 liga e confere).
- Ajustes (dono): a katana agora aparece na mão do Kuro no treino e no final (a cena controla katana.visible); durante o clipe ficam escondidos os cristais, moedas e inimigos da fase (o cristal azul do Mundo 1 parecia o Coração no meio do caminho); o Rei Besouro leva o Coração agarrado na frente dele o tempo todo da fuga.
- Ajuste (dono): na corrida do fim do clipe o Kuro e a raposinha pulam por cima da mola do começo do Mundo 1 (opnHop) em vez de atravessar.

### Roupa nova do Kuro na Terra Nova (pedido do dono, referência só como inspiração)
- rig.setOutfit(0|1) em partes/01_motor.js. Roupa 1: capuz vermelho (com a ponta caindo para trás), cachecol grosso no pescoço, roupa preta, mangas vermelhas com ombreira e duas faixas, cinto vermelho com fivela prateada, abas vermelhas (2 na frente, 1 atrás), luvas pretas, botas pretas com tiras prateadas; faixa da cabeça e rabinhos ficam escondidos pelo capuz. O rosto do Kuro continua aparecendo dentro do capuz (opção 2 escolhida pelo dono).
- buildLevel: mundos 1–11 usam a roupa antiga; do Mundo 12 em diante, a nova.
- A troca acontece no clipe final do Cume: com a katana erguida, um feixe de luz desce no Kuro e a roupa muda (brilho e faíscas).
- Teste 35.
- Raposinha também (pedido do dono, referência só como inspiração): makeFoxVis(skin) — visual 1 (Mundo 12 em diante): pelo PRETO (o verde sumia na floresta — pedido do dono), topete laranja, faixa laranja no rabo e nas patas, ponta do rabo e peito brancos, patas pretas, olhos verdes, lenço laranja, rolinho laranja com tiras de couro, sela marrom com argolas douradas. Troca junto com o Kuro no final do Cume (faíscas nela também). Sem skin, usa a roupa do Kuro (rig.outfit).
- Poder novo da raposinha na Terra Nova (opção 4 escolhida pelo dono): Bolha de Ponte — no Impulso (Mundo 12 em diante) o inimigo atingido fica preso numa bolha laranja, sobe ~1,1 e flutua parado 5 s; a bolha é firme por cima (degrau para o Kuro), pisca no último segundo, estoura e o inimigo volta para onde estava. Na primeira ilha o Impulso continua derrubando. Código: foxBubble/bubUpd/bubPop (41_raposa.js). Teste 36.
- Ajuste (dono): na Terra Nova o Impulso não é mais cabeçada — a raposinha CUSPE a bolha (foxSpit/updSpit): a bolha voa reto para frente (~9 de alcance), prende o primeiro inimigo que encostar; se bater em parede ou acabar o alcance, estoura. O Kuro fica parado montado; recarga 0,75 s; a cabeça dela dá um tranco ao cuspir.

### Mundo 12 — Cristal Ancestral aparecendo (dono)
- O cristal no pedestal do mirante sumia: era azul-claríssimo e brilhante, ficava da cor do céu claro atrás, e as copas da frente ainda cobriam. Agora: azul forte com contorno escuro, núcleo claro, anel dourado em volta, maior; e as copas perto do cristal (±9) ficam mais para trás e mais altas.

### Torre Verde (Mundo 9) — cachoeira da esquerda (dono)
- A cachoeira grande da esquerda caía do nada. Agora ela desce por um paredão de pedra com musgo (pedras e tufos de grama nas bordas) e nasce numa laje de pedra com grama lá no alto (y ~62), com espuma onde a água sai. Vila Ninja e o resto da fase não mudaram.

### Torre dos Vaga-lumes — bandeirinhas (dono)
- A 2ª bandeirinha acendia antes do Kuro chegar (a regra das fases que sobem acendia com o Kuro até 3 de altura abaixo, ainda na roda). Agora a fase usa cpStrict: só acende com o Kuro pisando na viga da bandeirinha, a menos de 2 dela. As bandeirinhas das vigas foram para perto de onde o Kuro chega/sai: 3 / 25,5; 3,5 / 44; 17,5 / 69; 4 / 76; 20,2 / 89 (alavancas em 2,2 / 76 e 22 / 89). As outras fases continuam com a regra antiga (Vila Ninja intocada).

### Desempenho: travada ao aparecer a raposinha e a pena (dono)
- Medido (PC, modo leve): criar a raposinha levava ~31–68 ms e o 1º quadro com ela ~35 ms; o 1º quadro com a pena ~40 ms (preparar o desenho/"shader" na hora).
- Correções: (1) a raposinha é montada uma vez por visual e reaproveitada (foxGeoCache) → 2 ms; (2) warmShaders() no fim do buildLevel prepara antes a raposinha, pena, cogumelo, flor, fruta, cristal, coração, núcleo e bolha → pena 4 ms, raposinha 14 ms no 1º quadro; (3) raposinha mais leve: tufos de 1 segmento sem tampa e, no modo leve, esferas com menos faces → 63 mil → 32 mil pontos (visual igual no tamanho do jogo).

### Desempenho sem perder imagem (dono pediu as ideias)
- splitBig (11_construcao): blocos grandes do cenário (mais de 60 de largura e 2 mil pontos) viram pedaços de 24 de largura que reaproveitam os mesmos dados; o celular pula os pedaços fora da tela (também na sombra). Vila Ninja fica de fora.
- splitInst: os "carimbos" (instanced) que cobrem a fase inteira — principalmente o capim do "Cenário detalhado" — viram um por pedaço, cada um com o seu tamanho para ser escondido certo. Os soltos na fase só são divididos depois de 45 quadros se não se mexerem (moedas, cubos etc. ficam inteiros).
- Medido (triângulos desenhados por quadro, qualidade Alta): Mundo 1 392 mil → 216 mil; Mundo 4 130 → 97 mil; Mundo 6 103 → 84 mil; Cume 728 → 650 mil; Floresta Ancestral 1045 → 967 mil.
- Conferência: fotos com e sem a divisão em 14 lugares de várias fases — a diferença ficou igual ao "ruído" normal de duas fotos iguais (nada mudou na imagem). testes/splitdiff.js.
- Sombra no modo leve: refeita a cada 3 quadros (era 2); o cenário não muda, só quem anda espera 2 quadros.
- Pausado: desenha só 2 vezes e para (com as configurações abertas continua, por causa da prévia). Menu e cartões: o fundo é desenhado em metade dos quadros.
- Vaga-lumes do fundo da torre e ilhas do céu do Mundo 13: animam a cada 2 quadros.
- Já feito antes: raposinha reaproveitada/mais leve e materiais preparados ao carregar a fase (warmShaders).

### Desempenho no celular, cor dos modos e Automático novo (dono: Realme C63 dava Baixo 60 / Médio 40 / Alto 20 / Ultra 10 / Máximo 5)
- Achado principal: a maioria dos "carimbos" do cenário (função inst() deixa frustumCulled=false) não era dividida em pedaços, e o capim da Trilha e das Alturas pulava a divisão. Agora são divididos (se ficam parados; com balanço no shader a folga do tamanho é maior). Celular, Floresta Ancestral: Baixo 327 mil → 31 mil triângulos; Alto 699 → 108 mil. Mundo 1 Baixo 74 → 52 mil. Fotos com e sem divisão: diferença igual ao ruído (nada muda na imagem).
- Celular: Ultra e Máximo não passam mais da resolução da tela (res 1, teto 1,6/1,75; sombra 1536/2048). Médio com sombra 768. Sombra PCF comum no celular (metade das leituras do PCF suave). Capim do fundo (z < -8) mais ralo e 35% mais largo no celular.
- Resolução dinâmica (todos os modos): mede o FPS real a cada segundo; abaixo de 80% da meta desce um degrau (1 → 0,9 → 0,8 → 0,7 → 0,6); folgado por 3 s, sobe de volta. Só mexe no tamanho da imagem (prApply), sem refazer o resto. Sem aviso na tela.
- Automático: 1º ajusta a resolução; se não bastar (ou se cair abaixo de 55%) desce a qualidade; só sobe depois de ~8 s folgado e com resolução cheia; depois de subir fica 5 s "em teste" — se cair, volta e não tenta de novo naquele mundo nesta sessão (failW). Guarda a qualidade que deu certo em cada mundo (cfg.autoW) e a última (cfg.autoLvl); ao entrar num mundo começa nela. Espera ~1,5 s depois de montar a fase antes de medir. Teste de desempenho zera o que foi aprendido.
- Limite de quadros conta certo em telas de 90/120 Hz (antes 60 numa tela de 90 virava 45).
- Cor dos modos: no modo leve (Baixo/Médio/Automático do celular e Baixo do PC) havia um filtro CSS saturate(.82) por cima da tela — deixava mais apagado e escuro que o Alto e custava uma passada extra. Agora a mesma correção de cor do Alto é feita dentro do desenho (GRADE no tonemapping: saturação 1, contraste .06, exposição ×1,22). Medido (saturação média / brilho), Mundo 1: Baixo antes .45/.47, agora .54/.48; Alto .50/.52. O filtro CSS só aparece se o jogador mexer na barra de saturação.
- Teste 37: Automático e resolução dinâmica.
- PC com vídeo fraco (dono testou no notebook: Baixo 60 / Médio 60 / Alto 38 / Ultra 15; jogando no Alto a resolução dinâmica levou de 38 para 48–50 FPS): o jogo lê o nome da placa (WEBGL_debug_renderer_info). Intel integrada (não Arc), Radeon integrada, SwiftShader/llvmpipe = weakG. Com weakG (ou celular), Ultra e Máximo ficam na resolução da tela e com sombra 2048. ?weakg=0/1 força.

### Teclado/controle nos menus e no mapa (dono mapeou o teclado no controle)
- Menus (cartão inicial, cartões das fases, Configurações e Pausa): setas ou WASD movem um destaque branco/dourado; Enter/Espaço/J apertam; ←/→ numa barra (resolução, saturação, brilho, volumes) mudam 5%; Esc fecha as configurações (na pausa, Esc continua o jogo). ↑/↓ andam por item (e por fileira dentro de um item com 2 fileiras), ←/→ dentro do item. O 1º toque numa seta só acende o destaque (no botão amarelo; nas configurações no topo; na pausa no Continuar). Mouse/toque apaga o destaque. Sem foco do navegador, para o Enter não apertar duas vezes.
- Mapa das ilhas: ←/→ (ou A/D, ↑/↓) leva o Kuro à fase anterior/próxima liberada (segurar repete), Enter/Espaço/J joga, Esc/Backspace volta ao menu, Q/E (ou -/+) zoom. A dica do mapa no PC mostra isso.
- Teste 38.

### Fogo vira moeda (dono)
- Em todo o jogo: inimigo derrotado pela bola de fogo some e vira uma moeda que dá um pulinho, cai no chão e fica lá girando até o Kuro passar por ela (dono pediu no chão). Se cair num buraco, some. Conta como moeda extra no fim da fase. dropCoin()/updDropCoins() em 42_blocos.js. Casco duro da tartaruga continua rebatendo o fogo; chefes continuam imunes. fireCoin() em 40_estado.js.

### Pulo giratório (dono)
- Tecla K (antes era igual ao J): pulo giratório, um pouco mais baixo que o normal (12,8). Sem poder: só gira (pisar derrota o mesmo que o pulo normal — decidido por mim, dono não respondeu se devia ser mais forte). Com capa: gira com a capa (spin(), acerta em volta e bate nos blocos). Com a flor: uma bola de fogo para cada lado por pulo. Montado: salta de cima da raposinha (ela fica, como no agachar+pular, que continua valendo). Na luta de katana o K continua sendo golpe. Na água/cipó não faz nada.
- Celular: arrastar o botão Pular para cima (28 px) = giratório. Como o Pular já saiu ao encostar, até 0,25 s depois do pulo o giratório "converte" o pulo no ar (P.jT).
- spinJump()/sjGo() em 40_estado.js; física em 53_agua.js (P.sjbuf, P.sj, P.sjA); giro do boneco em 60_animacao.js. Teste 40. PDF do mapa do teclado atualizado.

### Pulo normal faz dormir, giratório derrota (dono)
- Inimigo de chão pisado com pulo normal: dorme 5 s (achatado, solta "zzz", treme no último segundo), não machuca enquanto dorme; pisar de novo renova o sono. Voador (morcego/corvo/pássaro, libélula, mariposa, tartaruga voadora e a perseguidora, bruxa) pisado: cai até o chão, dorme 4 s e sobe de volta até onde estava; se cair num buraco, some. Pulo giratório (P.sj ao pisar → killE 'sjump') derrota. Fogo, giro da capa, pena e raposinha: sem mudança.
- Especiais mantidos: guardiã perde as asas no 1º pulo (depois dorme); besouro voador perde as asas; casco duro e robô de corda: pulo normal encolhe/desliga (renova), giratório derrota; esqueleto: pulo normal desmonta, giratório derrota de vez. Mariposa derrubada devolve a luz da roda.
- Aviso na 1ª vez: "Dormindo!/Derrubado! Use o pulo giratório (K / arraste o Pular para cima)". sleepE/sleepUpd em 52_castelo.js; FLYERS lista os voadores. Testes 25, 28, 32 ajustados e 41 novo.
- Som do pulo giratório: dono ouviu 3 opções (fiu-fiu, lâmina ninja, pião) e escolheu a 3 — whirlSfx() em 01_motor.js: onda quadrada 220→880 Hz com tremido 18→30 vezes por segundo e filtro abrindo, 0,5 s ("brrriiiu" de pião de brinquedo). Com a capa, o vuuush do giro dela toca junto. Página de comparação: scratchpad sons-do-giro.html.

### App instalável (PWA) (dono)
- ferramentas/pwa.py monta pwa/ e rumo-ao-cume-app.zip: index.html (jogo com o three.js local em lib/), manifest.webmanifest (tela cheia, deitado, ícones 192/512 + maskable), sw.js (guarda tudo no aparelho: abre sem internet; a versão do cache muda sozinha quando o jogo muda) e ícones (montanha com a bandeirinha dourada e a faixa vermelha). Testado: o service worker registra, 13 arquivos no cache, o jogo abre offline.
- Para instalar precisa estar num endereço https (GitHub Pages, Netlify etc.). No Chrome do celular: ⋮ → Instalar app. Rodar `python3 ferramentas/pwa.py` depois de cada mudança.
- Publicado: https://neyn56-ops.github.io/rumo-ao-cume/ (repositório neyn56-ops/rumo-ao-cume, GitHub Pages pela branch main, raiz). Conferido no PC do dono: abre, service worker ativo, manifesto ok, cache rumo-20946dcc. A cada versão nova: `python3 ferramentas/pwa.py`, copiar pwa/ para o clone /home/claude/rumo-ao-cume, commit e push (o app no celular se atualiza sozinho na próxima vez que abrir com internet). O repositório ofertashub do dono é outro site — não mexer.
- Correção: o jogo tem um <head> curto no começo e o <title> fica no <body>; o link do manifesto tinha ido junto e o Chrome do celular ignorava ("Não é possível instalar", ícone "G"). Agora pwa.py põe o manifesto antes do 1º </head>, e a versão do cache vem do conteúdo final. Dono instalou no celular com sucesso (2026-10-24).
- Tela cheia (dono): no app instalado (display-mode fullscreen/standalone) o botão "Tela cheia" não aparece; forçar a tela cheia completa escondia a barra da operadora mas o Chrome mostra o aviso "Para sair da tela cheia…" toda vez — dono primeiro escolheu não forçar (B) e depois pediu a tela cheia de volta "com uma única permissão": no app, o 1º toque de cada abertura pede a tela cheia completa uma vez (o aviso do Chrome aparece só ali); se a pessoa sair deslizando, não insiste até reabrir o app. Abrir com a logo do Google = foi instalado como atalho do Chrome (Xiaomi/Poco bloqueia o app completo); solução definitiva seria a Play Store (fica para o estudo de ganhar dinheiro). No navegador do celular, o 1º toque na tela já entra em tela cheia sozinho (o navegador exige um toque); o botão só volta se a pessoa sair da tela cheia. 99_fim.html.
- Correção (dono): pisado no ar, inimigo de chão (sapo no meio do pulo etc.) ficava dormindo parado no ar. Agora todos caem até o que houver embaixo (pode ser bloco/viga — dono aprovou) e só então dormem; se o apoio andar ou sumir, caem de novo; de chão acordam onde caíram (sapo volta ao chão, fg=true). Teste 41 ganhou o caso do sapo.
- (dono) Montado na raposinha, pisar num inimigo derrota na hora (conta como giratório). Pulo giratório mais alto: 14,2 (era 12,8; o normal é 14,5) e saindo da raposinha 14,8 (era 13,5). Teste 42.
- Correção (dono): o Kuro ficava quicando sem parar em cima do inimigo dormindo (cada pisão renovava o sono e quicava de novo). Agora, dormindo (ou voador voltando a subir), o pulo normal não quica: o Kuro passa e para no chão. Giratório e raposinha continuam derrotando. Teste 41 ganhou o caso.
- (dono) No PC o giratório saía mais baixo que no celular: no celular o dedo segue segurando o Pular (sem o "corte" do pulo), no PC o K não contava como segurar. Agora segurar o K vale como segurar o pulo durante o giro (keys.sjHold). Medido: PC 3,20 = celular 3,20 = pulo normal 3,20 de altura.
- App: quando há versão nova, recarrega sozinho ao abrir (controllerchange nos primeiros 20 s; não recarrega na 1ª visita).
- (dono) Inimigo dormindo vira um degrau baixinho: o Kuro cai e fica em pé em cima dele (sem quicar) e, andando, sobe por cima em vez de atravessar. Giratório/raposinha continuam derrotando. Teste 41 ampliado.
- (dono) Mesma lógica montado na raposinha: andando, sobe e passa por cima do inimigo dormindo; só derrota se cair de verdade por cima (P.vy<-1). Teste 41 ganhou o caso montado.

### Ideias para ganhar dinheiro (estudar quando os mundos estiverem prontos)
- Dono quer: grátis para baixar na Play Store e ganhar dentro do jogo.
- Sugestões conversadas: visual (roupas do Kuro, cores da raposinha, rastros/efeitos do giro, katanas); anúncio que o jogador escolhe ver (+1 coração, dobrar moedas); compra única para tirar anúncios; pacote de mundos novos (mexe na regra "todas as fases liberadas" — decisão do dono). Evitar anúncio forçado entre fases e vender poder.
- Cuidados: compra de item digital no app da Play passa pelo pagamento do Google (Stripe/Mercado Pago só no site); se for classificado como jogo infantil, regras de anúncio/compra mais rígidas. Conferir regras e taxas atualizadas na hora.
- Outros caminhos: sites de jogos de navegador (CrazyGames/Poki, divisão de anúncios), itch.io, apoio dos fãs. Supabase (conector) para progresso na nuvem, ranking e contas; conectores de pagamento para venda pelo site.

### Controle (gamepad) direto no jogo (dono: Fire TV Stick tratava o controle como mouse)
- gpPoll() em 70_entrada.js, lido todo quadro (até pausado/mapa): transforma botões em teclas por dentro, então vale em tudo. Analógico/direcional = setas (analógico no fim = correr), A = pular/confirmar, B = giratório (em menus/mapa = voltar), X = ação, Y = estrela, RB/RT = correr, Start = pausa (nos cartões confirma), Back = voltar. Aviso "Controle conectado!". Teste 43 (controle falso).
- Ressalva: alguns navegadores de TV (Silk do Fire TV) podem seguir usando o controle como mouse; nesse caso, outro navegador.
- Setinha do mouse some depois de 2,5 s parada (volta ao mexer; some ao apertar tecla/controle). No Fire TV a "bolinha" é o cursor do próprio navegador Silk — pode não sumir; a saída definitiva seria o app Android (.apk pelo Downloader), oferecido ao dono.

### App Android para Fire TV / TV box (dono)
- ferramentas/apk.sh monta rumo-ao-cume.apk sem Android SDK: apktool 2.9.3 (npm @postar/apktool-node, traz aapt2 e apksigner) + modelo ferramentas/apk-modelo (MainActivity em smali: WebView em tela cheia imersiva, tela sempre acesa, JS/armazenamento/arquivos ligados, abre file:///android_asset/index.html; botão Voltar do controle = Esc no jogo; ícone, banner da TV, LEANBACK_LAUNCHER, deitado). Assinado com chave-android.jks (fica só aqui, não vai pro GitHub; senha rumoaocume) — sem a mesma chave o app não atualiza por cima, teria que desinstalar.
- Publicado em https://neyn56-ops.github.io/rumo-ao-cume/rumo-ao-cume.apk e no atalho curto .../rumo-ao-cume/tv.apk (copiar os dois a cada versão) — instalar na TV pelo app Downloader (digitar o endereço). Não testado em aparelho real ainda.
- Jogo: GPU mali/powervr/adreno/videocore sem tela de toque (TV) conta como vídeo fraco (weakG) e o Automático começa no Baixo.
- (Atualização 25/10) Depois de reiniciar o PC o controle genérico passou a funcionar sem o AntiMicroX, mas X não fazia ação e o RT pausava: era a ordem de botões do modo antigo. Agora, sem mapeamento padrão e com 12+ botões, o jogo usa a ordem do Android (0 A, 1 B, 3 X, 4 Y, 6 LB, 7 RB, 8 LT, 9 RT, 10 Select, 11 Start) e lê o direcional pelo eixo 9. Teste 43 ampliado. Dono confirmou: todos os botões certos (analógico no fim = correr). "Configurar controle" só se aparecer outro controle com ordem diferente.
- (antigo) controle genérico do dono ("Unknown Gamepad (Vendor: 1949 Product: 0402)", marca VERDE, só funciona na 3ª luz) aparece no navegador com mapping "" (modo antigo/DirectInput): 16 botões, 10 eixos; analógico em 0/1, direcional como eixo 9 (valor 3,29 = solto). Plano aprovado em ideia, não feito: ler o direcional pelo eixo 9 e criar "Configurar controle" (pede pular, giratório, ação, estrela, correr, pausa; guarda por controle no aparelho). Enquanto isso o dono usa o AntiMicroX mapeando botões para teclas.

### Plano do Mundo 15 — Mina dos Trilhos (apresentado ao dono em 25/10, aguardando 2 respostas)
- Clima: mina com lampiões e veios de cristal brilhando, água pingando, riachos (sem lava, sem o claro/escuro da Torre).
- Etapas: 1) entrada com vagonetes em trilhos (plataformas) e alavancas de desvio; 2) 1ª corrida de carrinho (anda sozinho; pular, abaixar em túnel baixo; placas de desvio escolhem trilho de cima/baixo); 3) galeria dos cristais: baldes em correntes (elevadores), estalactites que caem, toupeirinhas que saem do chão; 4) caminhos secretos: blocos-raposa e lugares altos alcançados com a Bolha de Ponte (cristais escondidos); 5) corrida final fugindo do desmoronamento; 6) chefe Toupeira Gigante: arena de trilhos, cava e joga pedras, fica tonta ao bater na viga → pulo giratório na cabeça, 3 acertos.
- Inimigos: toupeirinhas, morcegos de mina, besourinhos de carvão; regra da pena com guardiã.
- Perguntas pendentes: (1) no carrinho só pular/abaixar ou também frear/acelerar? (2) chefe: tonta + giratório, ou outro jeito (ex.: jogar vagonete nela)?
- APK (dono): tela cheia de verdade — imersivo agora na janela inteira (decorView) e usando a área do entalhe da câmera (Android 9+); o app abre index.html?apk=1 e o jogo esconde o botão "Tela cheia" (também em file:).

### Câmera cinemática (dono, 26/10)
- Configurações → Câmera: Clássica (padrão) / Cinemática. Cinemática: gira ~6° (era 11°; dono pediu menos) para o lado em que o Kuro está virado (troca devagar), fica ~12% mais perto e mais baixa, "respira" parada (balanço leve) e recua até 14% ao correr/cair; transições suaves. Não vale no clipe de abertura, final do Cume, prévia das configurações, luta do Cume e Vila Ninja. updateCamera em 60_animacao.js (cam.ck/cam.rk/cam.yw).
- APK atualiza sozinho (dono, 26/10): o app agora abre o jogo do site (https://neyn56-ops.github.io/rumo-ao-cume/?apk=1) dentro da WebView, com o service worker guardando tudo para jogar sem internet; se não conseguir abrir (sem internet na 1ª vez), usa a cópia que vem dentro do app (Cliente.smali, onReceivedError). Instalar o APK de novo só se mudar a parte Android (tela cheia, ícone etc.). O progresso do APK antigo (file://) não passa para o novo (origem diferente).

### Mundo 15 — Mina dos Trilhos (feito pelo dono em OUTRA conversa, 29/10; sincronizado aqui)
- A outra conversa publicou direto no site (GitHub, commits 856191c…ef0c2e2) mas não atualizou este livro. Aqui as partes foram trazidas do index.html publicado (sem os acréscimos do app): parte nova partes/29_mina.js + ganchos em 01_motor (temas 14 'mine' e 15 'valley' seco), 10_mundos_dados, 11_construcao (LV.pre / prePast, buildMinePre, buildPlatformsMine), 23, 24, 30, 31, 40, 42, 51, 52, 53, 60 (moleVis, mnBossVis), 71 (ilha da mina no mapa).
- Fase em 2 partes: 1) superfície (região mineradora seca, x 0–114, fenda com vagonete, cano no fim); 2) dentro da mina (x até 330): vagonetes que andam sozinhos nos trilhos (rampa voa, trilho quebrado cai), elevador de gaiola, vigas baixas (abaixar), toupeiras mineiras, 3 cristais, 6 bandeirinhas; chefe Toupeirão (cava e aparece debaixo do Kuro, avança com garras de broca, derruba pedras do teto). mineFall() leva moedas, tempo, corações e poderes da superfície para a mina.
- Cuidado: trabalhar no jogo em duas conversas ao mesmo tempo faz uma apagar a outra. Antes de mexer aqui, puxar o site (git pull no clone) e conferir se mudou.
- Ajustes (dono aprovou os 3, 29/10): (1) superfície seca: os tufos pontudos viraram moitinhas baixas e redondas, mais escuras e em menor número na frente (não parecem mais espinhos). (2) mina com cor por trecho (mnZone/mnTint/mgC, cor por pedaço no merge): 1º terço rocha quente, 2º veio de carvão (cinza, manchas pretas na parede), 3º galeria de cristais (azulada, ~30 cristais a mais), arena do Toupeirão marrom-avermelhada (sem parecer lava). (3) peninha na mina: bloco verde em x 172 / 8,8 (a guardiã nasce sozinha), em cima do trilho do 2º vagonete.
- Trem a vapor no fundo da superfície (dono escolheu "só cenário", 29/10): mpTrain()/mpTrainUpd() em 29_mina.js. Aterro com trilho em z -19 (altura 1,6) ao longo da paisagem; locomotiva verde-escura com friso vermelho e chaminé dourada + 5 vagões de minério com ouro. Passa da esquerda para a direita a 6,5/s, espera 14–24 s entre passagens, fumaça (6/12 nuvens) e apito baixinho ao aparecer. Trem em cima para jogar fica para um mundo próprio (sugestão).
- (dono) Mina mais clara: tema 'mine' com exposição 1,5 (era 1,16), luz ambiente 1,3 (era 0,9), sol 1,7, névoa mais rala; cores dos trechos mais claras. Medido: brilho médio da tela subiu ~60% (ex. trecho do carvão 0,12 → 0,22).
- (dono) Perdeu todos os corações no Mundo 15: volta para o começo da fase (superfície) — lose() zera prePast. Cair e voltar numa bandeirinha continua dentro da mina. Teste 44.
- (dono) Batentes do fim dos trilhos (os "blocos de tijolo" de madeira escura) agora são firmes e ficam 0,9 depois de onde o vagonete para (o vagonete para a 0,9 antes do fim; testado: anda até o fim, para, o Kuro sai pulando). Ao descer do cano o Kuro cai no chão em x 1,6 (LV.pipeIn), ao lado do 1º vagonete, e não mais dentro dele.
- (dono) Bloco que não dava para pegar: era o coração automático (fitHearts) em x 101 / 2, em cima do fim do trilho 1, onde o Kuro dentro do vagonete não ficava embaixo dele. Mina agora com noHeartFit e corações à mão: x 105,5 / 2,6 (chão depois da ponte) e x 297 / 5,6 (antes do chefe).

### Mundo 16 — Vale das Cachoeiras (plano aprovado pelo dono, "Blz", 29/10; sem chefe)
- Ideia do dono: estilo de fase com muitos obstáculos e inimigos, voadores novos e bichos que saem do chão (imagem de referência só como inspiração; nada copiado).
- Plano: meio-dia, céu azul, cachoeiras, rio, ilhas de grama, ponte de madeira, castelo no morro lá longe (só cenário, é o destino). Bichos de chão: Minhocão, Tatu-espinho (só fogo/capa), Brotos-armadilha. Voadores: enxame de abelhas, Coruja-mergulhadora, Peixe-voador. Obstáculos: Pedrão-totem, tronco giratório com espinhos, ponte que cai, troncos descendo a cachoeira, ilhas que afundam, espinhos no fundo dos buracos. Pena com tartaruga guardiã.
- Parte 1 (feita 29/10, mostrada ao dono antes de seguir): parte nova 32_cachoeiras.js. Tema 16 ('valley' com falls:1; monta como o Vale) e MATS[16] (ilhas flutuantes de grama). LEVELS[15], música 11, x 0–172, bandeira em 160 (provisória, até as próximas partes).
  - Cenário: buildFalls() — rio que corre (y -2,4, aparece nos buracos, respingo ao cair), paredões de rocha com grama em cima e cachoeira (LV.falls), morros verdes e o castelo no alto do morro em farG (LV.castleX).
  - Minhocão ('worm', x0/x1 = tocas, hgt, wait, air): espera na toca (terra treme 0,5 s antes), arco até a outra toca. Pulo normal faz dormir (vira degrau); ao acordar cava de volta (killE marca e.zz).
  - Enxame de abelhas ('bee'): 3 abelhas, zigue-zague, chegam perto do Kuro mas ficam no seu pedaço (até 1,5 fora). Está em FLYERS (pulo derruba, giratório derrota).
  - Pedrão-totem (LV.totems {x,y,up}): pedra com cara de coruja pendurada num cipó; Kuro embaixo → treme 0,38 s e despenca; quem estiver embaixo leva dano e é empurrado para o lado; fica 1,1 s no chão e sobe devagar (dá carona; a 2ª gema fica em cima do totem do x 86). fallsReset() no recomeço.
  - Teste 45. Todos os 45 testes passam.
- (dono, 29/10) As abelhas passavam por dentro dos blocos: agora beeBlk() confere blocos e chão; na frente de um bloco o enxame vira, e na altura procura o lugar livre mais perto.
- Parte 2 (feita 29/10): fase vai até x 306, bandeira em 294 (provisória). Ponte de madeira que cai (crumbles com tábuas e cordas no tema falls, x 172–186), Brotos-armadilha ('sprout': brotam do chão, não saem com o Kuro em cima do buraco; pular machuca, fogo/capa derrotam), Tatu-espinho ('armad': enterrado com espinhos; Kuro chega perto → pula e sai rolando a 5/s no seu pedaço por 3,4 s e se enterra de novo; pular machuca, até o giratório; fogo/capa derrotam), Peixe-voador ('jfish': lógica do Minhocão com a toca no rio, respingo ao sair/entrar), tronco giratório com espinhos (LV.logs {x,y,gy,L,speed}; buildLogs/logsUpd), poço raso com espinhos (x 262–266). Flor no bloco x 198 antes do tatu. Teste 46.
- Parte 3 (feita 29/10) — fase completa, x 0–416, bandeira em 402, tall:1 (câmera acompanha o Kuro na altura, para a subida final).
  - Coruja-mergulhadora ('owl', x = poleiro, y = altura): Kuro passa embaixo → mira 0,5 s → mergulha reto a 9,5/s → volta ao poleiro (espera 1,4 s). Em FLYERS (pulo derruba, giratório derrota).
  - Troncos descendo a cachoeira (LV.wlogs {x,top,bot,sp,gap}): plataformas que descem sem parar e voltam lá de cima, com cortina de água atrás (x 310,5 e 315,5).
  - Ilhas que afundam (LV.sinks): com o Kuro em cima afundam até 2,2 e param; sem ninguém sobem; aviso na 1ª vez.
  - Fim: subida em degraus até 10,4, Semente de Luz brilhando no pedestal (x 399,6) e o portão do castelo (LV.gate). Texto final da história fala da Semente de Luz.
  - Teste 47.
- (dono, 29/10) Trecho dos troncos da cachoeira maior e com mais adrenalina: 6 colunas de troncos (x 310–335, velocidades e larguras diferentes), uma Tartaruga-cachoeira em cada coluna (visual novo: casco verde com musgo, pele azul-água, asinhas de água, gota pingando — makeTurtle(kind,moss); física da 'tchase': vê o Kuro, ataca, desiste e volta). Depois, fila de 5 Tartarugas-cachoeira paradas no ar ('turtle' com moss, x 339,5–352,7, de 3,3 em 3,3), que não atacam: o Kuro atravessa quicando nelas (física normal: cada uma cai no rio depois de pisada; segurando o pulo dá para atravessar — teste 48). Dono pediu sem bandeirinha nesse trecho (a do x 287 saiu). O resto da fase andou +38 (bandeira em 440). Dica na tela antes da fila (LV.tTip).
- (dono, 29/10) Correções: (1) troncos passavam por dentro das tartarugas → tartarugas-cachoeira agora ficam nos vãos entre as colunas (x 307,4 / 312,5 / … / 332,5) e, se encostarem num tronco, são empurradas para o lado (wlogsUpd); teste 49. (2) As cachoeiras das colunas nasciam do nada → paredão de pedra com musgo e cipós por cima das colunas (é sólido); a água e os troncos saem de dentro dele (o tronco reaparece escondido na pedra). (3) Castelo lá longe flutuava → farCastle(): morro maior e mais verde, base de pedra com gramado no topo, castelo com muralha e ameias, portão, 4 torres com bandeiras, torre alta com ponta dourada, árvores em volta.
- (dono, 29/10) Troncos em escada: as colunas se alternam (dir -1 desce, +1 sobe; off .5 desencontra os degraus). Na coluna que sobe o tronco sai do rio e entra no paredão; se o Kuro estiver em cima chegando na pedra, é empurrado para o lado (aviso na 1ª vez). Bug corrigido: d.top crescia a cada recomeço (agora usa d.top0). Água batendo nos troncos: cortina de cada coluna com shader próprio que falha embaixo de cada tronco, fiozinhos escorrendo pelas pontas, respingos em cima, tronco molhado (mais escuro e brilhante). Kuro molhado (só visual, dono escolheu): dentro da cachoeira das colunas fica mais escuro/azulado e brilhante com água batendo na cabeça; ao sair pinga e seca em ~5 s (kuroWetUpd, kuroDry ao começar qualquer fase). Gotinhas próprias (flDrop). Teste 50.
- (dono, 29/10) Paredão de pedra das colunas mais alto: oy = topo+4,6 (era +0,6); a pedra fica em ~17,9.
- (dono, 29/10, print do celular) Cachoeiras do fundo com falha: a pedra ondulada passava na frente da água (lasca cinza). Agora o paredão tem um canal liso recuado onde a água desce e a cortina ficou mais à frente (z+0,3).
- (dono, 29/10, opção A) Riachos: em cada cachoeira do fundo com chão na frente, a água vira um riacho que atravessa o caminho e cai pela beirada da frente (buildStreams; chão alto ganha uma calha de pedra saindo do paredão). Kuro pisando no riacho espirra água. Dois peixinhos por riacho (só enfeite) pulam para o chão seco, se debatem deitados e voltam para a água. Teste 51.
- (dono, 29/10, print) Cachoeira ao lado de buraco (x 205 e a do x 378): o riacho corre pelo gramado até o buraco e despenca até o rio (streamPit). Nos outros riachos a queda pela beirada da frente agora desce até o rio, com espuma e respingos onde bate.

### Plano do Mundo 17 — Lago da Aurora (apresentado ao dono 29/10; ele disse "amanhã nós construímos")
- Noite de inverno com aurora boreal (faixas verdes/roxas/azuis ondulando), lago congelado, pinheiros com neve, estrelas, farol de gelo no meio do lago. Sem chefe.
- Mecânicas: patinação (trecho longo deslizando rápido, freia devagar, pular buracos/rachaduras no embalo); gelo que trinca (1ª pisada racha, 2ª quebra e cai na água); pontes de aurora (plataformas de luz que aparecem e somem no ritmo da aurora); blocos de gelo boiando (andam devagar e afundam um pouco); pingentes de gelo que tremem e caem quando o Kuro passa embaixo.
- Bichos: Pinguim-tobogã (desliza de barriga, pulo faz dormir), Foca-bola-de-neve (sai dos buracos e joga bolas de neve em arco), Peixe-gelo (pula dos buracos), Coruja-das-neves (plana em ondas e dá rasantes; pulo derruba). Pena com guardiã.
- Final: subir o farol de gelo por fora em espiral e acender a Luz da Aurora.
- Construir em 3 partes mostrando cada uma: 1) margem + patinação (aurora, pinguins, focas, gelo que trinca); 2) água aberta e grutas (blocos boiando, peixes-gelo, pingentes, coruja); 3) pontes de aurora e farol.
- (dono, 29/10) Altura padrão dos blocos: 2,4 acima do chão em todos os mundos, como no Mundo 1 (blockStd() no fim de 10_mundos_dados.js; fileiras mudam juntas). Antes: M16 2,0; M3/M7 alguns 2,0; M4 2,0 e 2,88; M8 2,5/2,6; M12 2,6; M15 2,6 (um 2,0 e um 2,8). Torres (M13, M14) ficaram como estão (alturas fazem parte da escalada). Conferido: nenhum bloco encosta em plataforma, cano ou espinho.

### Mundo 17 — Labirinto de Tijolos (ideia do dono, 30/10; feito)
- Ordem nova dos mundos: 17 Labirinto de Tijolos, 18 Lago da Aurora (o plano acima continua valendo, só mudou de número). O Templo dos Espelhos (antigo 18): dono decidiu (30/10) que entra mais para a frente — posição exata a combinar quando chegar lá. Chefes continuam nos mundos 15, 19 e 21; o 22 é a Bruxa.
- Parte 33_labirinto.js. O mapa é desenhado com letras em LV.maze.rows (57 x 49): # concreto, B tijolo, K chave, L fechadura, D porta, F bandeira falsa, C bandeirinha, S mola, ^ espinhos, o moeda, g cristal, h coração, P/M/W blocos (pena, cogumelo, flor), e besouro, v morcego, f sapo, u ouriço, m toupeira, t tartaruga perseguidora. mzPrep transforma as letras em inimigos/moedas/etc.; mzBuild monta (tijolos num InstancedMesh só; concreto juntado em retângulos). Tema 17 'maze' (subterrâneo, tochas), MATS[17]=pedra do castelo. Mapa: ilha w17 cor de tijolo.
- 5 poços (A–E) de câmaras de 4 de altura separadas por camadas de 2 tijolos; paredes de concreto com passagens; algumas camadas são de concreto com um "tampão" de tijolo (força cavar no lugar certo).
- Regras: giratório caindo em cima quebra o(s) tijolo(s) embaixo dos pés (mzDown, um por giro); cabeçada por baixo quebra (mesmo pequeno, mzHit); molas embaixo dos tijolos servem para subir quebrando. Chave no poço D (fundo); fechadura na parede do poço B (meio); porta da saída na parede de fora, embaixo à direita (poço E). Sem a chave na fechadura a porta não abre ("Trancada!"). Bandeiras falsas no fundo dos poços A–D: some em fumaça e o Kuro volta ao começo (chave e tijolos quebrados continuam). Morreu: perde a chave (mzReset; perder tudo refaz o labirinto e volta na bandeirinha do meio — keepCp). Uma bandeirinha no meio (poço C). Inimigos e espinhos em todos os poços. Teste 52.
- (dono, 30/10) Dava para passar a fase por cima do telhado do labirinto: agora há um paredão de concreto na direita (LV.maze.walls [[55,57,49,130]]) que nem pulando, nem com pena, nem com capa dá para passar. Teste 52 confere.
- (dono, 30/10) "O Kuro nunca pode ficar preso": análise sala por sala mostrou 26 salas sem jeito de subir. Agora TODA sala tem uma mola embaixo de um tijolo do teto (embaixo do tampão quando a camada é de concreto) — quicando, o Kuro quebra o teto com a cabeça e sobe para a sala de cima, até o telhado. As 40 molas foram testadas uma a uma (teste 53 também confere que nenhuma sala fica sem mola). A pena saiu da sala alta do poço C (a sala voltou a ser duas, com camada de concreto e tampão) e foi para a plataforma do começo, a céu aberto, com a guardiã.
- (dono, 30/10) Giro automático no labirinto: depois de quebrar um tijolo girando, o Kuro continua sozinho (pulinho de 5,4, cai, quebra o próximo) até apertar o pulo normal de novo, cair em algo que não é tijolo ou ser lançado por mola; dá para ir para os lados. P.drill em 33_labirinto.js. Teste 52.
- (dono, 30/10) Labirinto sem espinhos: os 9 grupos de espinhos viraram inimigos (besouros, ouriços, sapos e toupeiras).
- (dono, 30/10) Tirada a bandeira falsa do fundo do poço D (a sala embaixo da chave); ficam as dos poços A, B e C.
- (dono, 30/10) Ideia do dono: cano no lugar das bandeiras falsas. As 3 que sobraram (poços A, B, C) viraram canos verdes: segurando para baixo em cima, o Kuro entra e sai por um cano na entrada do labirinto (x -3, em cima da plataforma do começo). Não há mais bandeira falsa.
- (dono, 30/10) Toda mola fica em cima de concreto (o tijolo embaixo virou concreto; 4 molas mudaram de lugar para não tampar a subida da sala de baixo). Teste 53 confere.
- (dono, 30/10) Labirinto sem ouriços (bolas de espinhos): viraram besouros, sapos e toupeiras.
- (dono, 30/10) Itens presos nos tijolos: no labirinto as 3 salas com bloco de item (cogumelo no poço B, cogumelo no E, flor no D) ficaram 1 mais altas (saiu a fileira de baixo do teto). Achado junto: no Mundo 7 a flor do x 106 (entre duas plataformas) encostava na de cima depois da altura padrão — blockStd agora não mexe em bloco com teto logo acima. Teste 54 confere todos os blocos de item de todos os mundos.
- (dono, 30/10) Design novo da fechadura (espelho dourado com buraco vazado numa moldura de ferro com rebites, pedrinha vermelha que fica verde, chave aparece encaixada e gira ao usar) e da porta (arco de pedra, 3 tábuas com frisos, faixas de ferro com cravos, dobradiças, espelho dourado com fechadura, pedrinha vermelha→verde, placa SAÍDA em cima; a porta sobe por dentro do arco).
- (dono, 30/10) A porta da saída agora fica virada para a sala (de frente para o Kuro que chega andando), não para a câmera; o arco gira junto; a porta ocupa a parede toda. A placa SAÍDA continua virada para a câmera.
- (dono, 30/10) Área de fora do labirinto: "Ruínas de Tijolos" (LEVELS[16].pre, tema 18 'valley' dusk — fim de tarde virando noite, lua nascendo). x 0–134, chão em 4. Treino sem parecer treino: poço de tijolos (x 20–27, giro automático), ressalto de tijolos com mola embaixo (x 44–55), pilares de concreto, caixinha de tijolos com a chave (x 61), pilarzinho com a fechadura (x 66), muro com a porta (x 72, sem placa SAÍDA — noSign), ponte de tijolos sobre buraco (x 88–93: girando nela, cai). Muros de tijolo em ruínas e tochas no fundo; a montanha de tijolos no fim. Bandeirinha em x 76. A pena saiu da entrada do labirinto e veio para cá (x 10) com a guardiã; cogumelo em x 15. Cano no fim (x 122, to:{maze:1}) → mazeEnter() → o Kuro sai pelo cano da entrada do labirinto (lá em cima). Perdeu tudo: volta para fora (prePast). Testes ajustados (startLevel(16) agora começa fora; testes do labirinto chamam mazeEnter). Teste 55.
- (dono, 30/10) Raposinha no começo do Mundo 16: bloco da raposa em x 11 (altura padrão).
- (dono, 30/10) Ruínas: a tocha que ficava em cima do poço de tijolos (x 24) foi para x 17 (ficava flutuando depois de quebrar). Fogo das tochas (Ruínas e labirinto) agora tremula: chama e brilho próprios (mzTorch/mzTorchUpd), animados só perto do Kuro.
- (dono, 30/10) Bolha da raposinha no Minhocão: o desenho seguia o arco do pulo e ficava fora da bolha. Agora, presos na bolha, Minhocão (enrolado), Peixe-voador, Broto (sem o buraco) e Tatu (bola) ficam no meio dela. Teste 56 confere 11 bichos dos Mundos 16 e 17.

### Mundo 17 — chave na mão e fechadura de lado (pedido do dono)
- Moedas das Ruínas mais espaçadas (menos moedas por fileira).
- A fechadura fica de lado, virada para o lado aberto por onde o Kuro chega (como a porta), não para a câmera.
- Depois de pegar, o Kuro leva a chave na mão. Perto da fechadura, a chave voa até o buraco, entra e gira (clac, ~0,7 s); só então a porta destranca. Se o Kuro morrer antes, a chave volta para o lugar dela.
- Correção: o jogo completava sozinho as 50 moedas da área de fora e enchia os vãos das fileiras. Agora `coinGap:1.8` nas Ruínas impede o enchimento, e as moedas foram espalhadas em 11 fileiras, todas a 2 de distância.
- Correção: a chave fica presa de verdade na mão do Kuro (a mão do lado da câmera), segura pela argola, e sai da mão quando vai para o buraco.
- Labirinto: paredão de concreto no lado esquerdo da plataforma de entrada (`walls` [-14,-12,-14,130]); antes havia só uma barreira invisível.
- Correção: pedaços de inimigo derrotado (ou de tijolo) que estavam parados em cima de um tijolo voltam a cair quando o tijolo é quebrado (antes ficavam flutuando).
- Correção: as pedrinhas de enfeite do cenário não são mais postas em cima de tijolos que quebram (no poço das Ruínas uma ficava flutuando depois de quebrar os tijolos).

### Abertura do jogo direto no mapa (pedido do dono)
- O jogo abre no mapa, no último mundo jogado. O botão do mapa virou "← Início" e leva ao título (Jogar, Abertura, Configurações).
- Engrenagem ⚙ no canto do mapa abre as configurações; ao fechar, volta para o mapa.
- Na pausa, o botão "Menu" virou "Mapa" e volta para o mapa.
- Quem nunca viu o clipe de abertura vê ele ao entrar no Mundo 1 (como já era).

### Mundo 18 — Lago da Aurora: parte 1 feita (30/10)
- Arquivo novo `partes/34_aurora.js`. Tema 19 (`name:'peaks', aurora:1`, noite), MATS[19]=neve, música 15 (calma, de sino de vidro).
- Céu: estrelas, lua fininha e 3 faixas de aurora (verde/roxo, verde-água/rosa, verde/azul) ondulando (shader, seguem a câmera).
- Lago: `LV.lake=[24,186,-.75]` — água escura embaixo; o terreno do fundo fica baixo dentro do lago (mY próprio) e uma superfície de gelo liso cobre o lago atrás do caminho; pinheiros com neve nas margens, na ilha e numa fileira do outro lado. As pedras do cenário não vão para cima do lago.
- Chão do lago: solids `[x0,x1,0,-.6,1]` (placa de gelo boiando, escorrega). Com `LV.skate` o Kuro patina 30% mais rápido no gelo.
- Gelo que trinca (`LV.cracks`): 1ª pisada racha (aviso na tela), 2ª quebra e cai na água; volta tudo ao morrer. Não escorrega (gelo novo). Pedras trincadas de 3,5 com vãos de 2.
- Bichos novos: Pinguim-tobogã (`peng`: anda gingando, depois desliza de barriga rápido, vira para o Kuro se ele estiver perto; pulo faz dormir) e Foca (`seal`: mora num buraco no gelo, sobe e joga bola de neve em arco; pisada faz dormir). Lobo e morcego de gelo reaproveitados.
- Caminho: margem (−14–24) → gelo 24–58 → água → gelo 61–79 (foca) → ponte de gelo trincado 79–88 → gelo 88–112 (bandeira 92) → ilha de neve 115–128 (pena com guardiã) → pedras trincadas 131–145 → gelo 145–160 (bandeira 146) → água → gelo 163–182 (foca) → margem 185,5 com bandeira de fim provisória em 206.
- Teste 57: patinação, gelo que trinca, foca acerta, pinguim desliza, todos os buracos pulando.
- Falta: parte 2 (água aberta e grutas: blocos boiando, peixes-gelo, pingentes, coruja), parte 3 (pontes de aurora e o farol) e a vila de pescadores (área de fora, dono aprovou).

### Mundo 18 — Vila dos Pescadores suspensa + estilo de gelo (dono, 31/10)
- Estilo novo do mundo todo (inspirado numa imagem do dono, sem copiar nada): pilares/blocos de gelo azul translúcido com veios, tampa de neve e "gotas" de neve escorrendo pela frente (`auSolid`); placas de gelo boiando (`auFloe`); pilares de gelo com neve e pinheirinhos lá no fundo e uma cachoeira congelada (`auBack`). O chão liso do lago (solids com 5º número) continua placa de gelo sem neve.
- Parte 1 com alturas variadas: degrau na margem (12–24 a 1,2), pilar de gelo no meio do gelo (40–44 a 2,4), ilha em dois degraus (115–121 a 1,2; 121–128 a 2,6), margem final com degrau (196+ a 1,2).
- Bicho novo: Pássaro-da-neve (`sbird`): voa em onda; quando o Kuro passa embaixo, dá um rasante e volta (espera 2,4 s antes de outro); pisada derruba. Está na vila e no lago.
- Área de fora `LEVELS[17].pre` (auPre, vila): 3 andares sobre o lago — embaixo placas boiando, no meio passarelas de tábua com estacas e pontes de corda (balançam), em cima telhados e torres. 3 escadas (sobem como o cipó; no topo pula para a direita), 2 cestos-elevador no guincho (46,2: 4→10; 102,3: 7→13), 7 casinhas (janela acesa, chaminé com fumaça, peixes pendurados), lanternas. Bandeiras em 39 e 64. Pena com guardiã em 31.
- Fim da vila: tobogã de gelo na torre (x 113, y 13) — o Kuro desce deslizando e chega ao começo do lago patinando (`auEnter`, como o cano do Mundo 17).
- Teste 58: escada, cesto, tobogã e pássaro.
- (31/10) Luz de fim de tarde no Mundo 18 (vila e lago): céu azul-escuro → lilás → laranja/pêssego, sol baixo alaranjado (disco no horizonte no lugar da lua), névoa rosada; aurora e estrelas mais fracas (começando a aparecer).
- Correção (31/10): o bloco de coração automático (fitHearts) caía no caminho do cesto-elevador da vila. Agora ele não usa cesto (so.lift), gelo que trinca (so.crk) nem fica a menos de 1,4 de escada/cipó.
- Correção (31/10): o Kuro descia por fora do tobogã. Agora o tubo desce para a direita na frente da cena (z 0), mais transparente, o Kuro vai dentro dele e a câmera é liberada durante a descida.
- (31/10) Tobogã virou calha aberta (U de gelo), com bordas de neve e estacas de madeira até a água; o Kuro desce sentado, de pernas para a frente.

### Mundo 18 — parte 2 feita (31/10, imagem de inspiração do dono)
- Depois da margem (208): água aberta com 4 blocos de gelo que andam (movers com `auFloeMesh`; afundam 0,2 quando o Kuro pisa e balançam) e peixes-gelo (jfish, `riverY` = água do lago) saltando entre eles; pilar de gelo 242–256 (pássaro-da-neve, flor); gruta de gelo 262–300 (teto 4,4–9) com 7 pingentes (`LV.icicles`: tremem 0,55 s quando o Kuro passa embaixo, caem, machucam, voltam 4 s depois) e pinguim; ilhota 304–318 com coruja-das-neves (owl branca no tema aurora); 4 blocos de gelo flutuando no ar com neve escorrendo (floats acima de 0,9 → `auAirBlock`) e 2 peixes; margem 345–385 com o fim em 374.
- Enfeites: cristais de gelo brilhando (`LV.crystals`), placas de madeira com seta vermelha (`LV.signs`), montanhas do fundo em gelo azul (tema aurora).
- Bandeiras novas em 208, 264 e 306. Tempo 600. Teste 59.
- Falta: parte 3 (pontes de aurora e o farol).
- Correções (31/10): (1) bloco de coração automático agora fica a 2,4 do chão em todos os mundos (estava a 2,0 nos mundos com liftK 1 — 6 a 18); espaço acima conferido até 4,6. (2) Foca: não sai do buraco com o Kuro em cima (espera embaixo) e só joga bola de neve se estiver na tela, no mesmo andar e a menos de 8,5 (antes jogava de fora da tela e do andar de baixo da vila). (3) Pingentes mais azuis e brilhantes, para serem vistos antes de cair.

### Mundo 18 — parte 3 feita: pontes de aurora e o farol (31/10, imagem de inspiração do dono) — MUNDO 18 COMPLETO
- Chegada do tobogã corrigida: no lago há uma calha de chegada (`LV.slideIn=[-11,6.5,3]`); a tela clareia em 0,35 s enquanto o Kuro ainda desce sentado a calha e entra na cena (`AU.sin`). Calha agora é a função `auChute(cv)`.
- Pontes de aurora (`LV.abridges`): ponte de corda (postes com neve, cordas) com tábuas de luz colorida (verde, verde-água, azul, roxo, rosa). Ciclo de 4,2 s: 2,6 s firme, 0,6 s piscando, 1 s apagada (quem estiver em cima cai na água). A 2ª ponte tem ritmo defasado. Aviso na tela na 1ª vez.
- Caminho: margem 345–385 → pilar 388–393 (3,2) → ponte 393–405 → pilar 405–410 → ponte 410–422 → pilar 422–428 (4,4) → 2 blocos de gelo no ar → penhasco do farol 441–472 (8) com casinha.
- Farol (`LV.lighthouse`, x 458): torre listrada vermelha e branca com janelas, galeria com grade, lanterna e teto vermelho com neve. 4 degraus de pedra com neve em zigue-zague (10,4 / 12,6 / 14,8 / 17) e a galeria (19,2) — chega-se nela pelo lado direito. Ao chegar, a Luz da Aurora acende (feixe girando, brilho, música) e a fase termina (goal 455,4 / 19,2).
- Bichos: pássaros-da-neve e peixes-gelo nas pontes, pinguim e coruja-das-neves no penhasco. Bandeiras em 372 e 443. Tempo 720. Teste 60 (chegada, ponte, atravessar, subir o farol e terminar).
- `auHouse(h,r)` virou função (casinhas também fora da vila, `LV.houses`).
- Correção (31/10): o tobogã não escurece mais a tela. Na vila, a câmera para no meio da descida e o Kuro sai deslizando pela direita; a cena troca direto (sem tela preta) e no lago ele entra descendo a calha de chegada.
- (31/10, dono: "sem corte") Vila e lago viraram UMA fase só: a vila foi deslocada 138 para a esquerda (x −152 a −24) e a calha do tobogã termina na margem do começo do lago (x ~4). Não existe mais `LEVELS[17].pre` nem troca de cena; a calha de chegada (`slideIn`) saiu. Começo da fase: x −138. 100 moedas na fase (`coinN`), tempo 900. `auEnter()` agora só serve para testes/fotos (leva o Kuro ao começo do lago). Aviso das pontes só aparece perto delas.
- (31/10, dono) Subir de volta pelo tobogã: a calha virou chão escorregadio (solid móvel AU.chSo seguindo a curva); a ladeira puxa o Kuro para baixo e, subindo, ele escorrega de tempos em tempos (P.stun curto, desliza um pouco para trás; aviso na 1ª vez). Leva ~10 s para subir. Lá em cima não dispara a descida enquanto ele estiver vindo de baixo (AU.climb).
- Correção (31/10): o Mundo 18 não tem mais bandeira (ela flutuava na frente do farol, e pular perto do farol terminava a fase antes de chegar lá em cima). Agora (crystalGoal) a fase termina só quando o Kuro fica em pé na galeria: o farol acende, o feixe gira ~2 s e aí vem a tela de fim.

### Interpolação do desenho (dono, 31/10) — Kuro borrado ao correr
- Causa: física a 90 Hz (STEP 1/90) e tela a 60/120 Hz sem interpolação → a cada quadro o Kuro andava 1 ou 2 passos (correndo a 60 Hz: 0,173 / 0,087 / 0,173…), um tremido que o olho vê como borrão. Pior na corrida.
- Correção (71_laco_e_mapa.js, frame): guarda P.ix/P.iy antes de cada step; na hora de desenhar coloca o Kuro em ix + (x−ix)·(acc/STEP), roda animate (Kuro e câmera) e volta P à posição da física. Pula em teleporte (>1,5), warp, hitStop e fora do 'play'. Física, pulos e testes não mudam.
- Medido: correndo a 60 Hz agora 0,130 por quadro sempre (Kuro e câmera); a 120 Hz 0,065 sempre.
- Ainda sem interpolação: inimigos e plataformas que se movem (dá para fazer depois se aparecer tremido neles).
- (31/10, dono, imagem de mar como inspiração) Água do Mundo 18 com ondas: plano em y −0,3 com normal map de ondas feito no canvas (auWaveTex, repete sem emenda), 2 camadas andando em direções diferentes; azul-acinzentado como mar calmo. O gelo congelado de fundo ficou só no trecho da parte 1 (LV.frozen, padrão 24–200, borda irregular); vila, parte 2 e parte 3 têm água aberta com ondas.
- Correção (31/10, dono): escadas da vila encostadas na parede dos blocos de gelo (x 8,3 / 27,7 / 93,7 relativos à vila; visual em z 0,9) e as passarelas terminam antes delas. Agora dá para DESCER: em pé perto da escada, apertar para baixo agarra e desce; embaixo, apertar para cima sobe (antes só agarrava pulando). Vale para escadas (vines com ladder:1).
- Correções (31/10, dono): (1) Escada atrás do Kuro (z −0,35; ele sobe de costas). (2) Na escada, o joystick inclinado (baixo/cima com um pouco de lado) não solta mais o Kuro (antes ele caía); o joystick também sobe/desce em escadas e cipós. (3) Postes das pontes de corda descem até a água. (4) Lanternas só em passarela de tábua ou bloco (as das pontes de corda ficavam flutuando).
- Correções (31/10, dono): (1) Focas da vila estavam dentro de pilares de gelo (x 29 e 86) → movidas para 25,6 e 89,6 (conferido: nenhum bicho dentro de bloco). (2) No Mundo 18 não há mais paredão de terra (cliff) nem chão de vale atrás do caminho (apareciam como faixa marrom e ao cair nos buracos); água agora tem os dois lados e há fundo azul-escuro debaixo d'água.
- Correção (31/10, dono): água do Mundo 18 parecia flutuar (a borda do plano aparecia no meio do terreno do fundo). Agora a água vai até a margem lá do fundo (90 de fundo, 200 a mais de largura), o terreno do fundo começa antes da vila (não termina mais no meio da tela) e os pilares de gelo do fundo nascem dentro d'água.
- Correções (31/10, dono): (1) Bandeira de volta, agora em cima da galeria do farol (goalFlag: só enfeite; a fase continua terminando ao acender a luz). (2) Lobo do começo do lago passava por dentro do tobogã → foi para o degrau 12–24 (anda de 12,5 a 23,5).
- (31/10) Bandeira do farol mais para dentro da galeria (goal.z −1,7, x 456,4; novo campo goal.z para a profundidade do mastro).
- (31/10) Na galeria do farol o Kuro é desenhado 1,3 mais para dentro (z −1,3, suave), dentro da grade; antes ficava na beirada.
- Correções (31/10, dono): (1) Vila: as placas de gelo de baixo entravam nos pilares e deixavam um cantinho entre dois pilares altos onde o Kuro ficava preso → placas agora [8,2–22], [24–28], [86–94] (relativos à vila), moedas de baixo ajustadas (nenhuma moeda dentro de bloco). (2) Farol: a grade passou para o raio 3,0 e o Kuro anda em volta da lanterna, sempre dentro da grade (z segue um círculo); a galeria agora tem 5 de largura (F.x ±2,5).

### Mundo 19 — O Naufrágio: parte 1 feita (31/10, ideia e imagem do dono)
- Ideia: navio pirata partido ao meio — proa encalhada na praia, popa boiando no mar, destroços levados pelas ondas, tempestade ao longo da fase. Chefe: Capitão Corvo-Pirata (no fim). Praia e mar numa fase só (sem corte).
- Arquivo `partes/35_naufragio.js`. Tema 20 (`name:'wreck'`), MATS[20] areia molhada, música 16 (tempestade).
- Praia (x −14 a 94, `LV.shore`): areia, pedras, algas, conchas, madeira, barris e caixotes; o terreno desce para o mar lá atrás; depois da praia o mar vem também para a frente.
- Metade encalhada (`LV.ship`, `wkShip`): casco de tábuas com limo, castelo da proa (5,6) e convés (4,2), amurada atrás e só postinhos na frente, gurupés, mastro com vela rasgada, cesto da gávea (plataforma 10,4) com escada de corda (sobe e desce como as escadas do M18), toco do 2º mastro com vela pendurada, canhões, barris, cordame, âncora na areia com corrente até a proa; ponta quebrada com costelas e lascas, e tábuas caídas formando degraus (2,8 e 1,4) até a areia. Caixotes na areia (1,4 e 2,8) para subir na proa. Solids com 6º valor: 'ship' (invisível, o casco desenha), 'crate', 'plank'.
- Mar com ondas de verdade (vértices sobem e descem) + textura de ondas; espuma na beira; destroços boiando ao longe; a popa lá longe no mar.
- Tempestade: chuva inclinada pelo vento, raios em zigue-zague no fundo com clarão e trovão atrasado; intensidade vai e volta (mais raios quando aperta).
- Bichos: caranguejo (o "beetle" no tema, anda de lado de frente para a câmera) e gaivota (o "bat"). Pena com guardiã no convés.
- Conferido: sobe ao cesto pela escada, sobe na proa pelos caixotes, volta da areia ao convés pelas tábuas; nenhuma moeda dentro de bloco. Fim provisório em 88.
- Falta: parte 2 (destroços que as ondas carregam, barris que giram, vento, raios com aviso, onda gigante) e parte 3 (a popa boiando: porões, mastro, castelo da popa e o chefe).
- Correções (31/10, dono): proa encostando na areia (o casco da frente ficava suspenso); bandeira do meio saiu do convés (ficava entre as cordas, perto da escada) e foi para a areia em x 79; diamante que ficava debaixo das tábuas caídas (não dava para alcançar) foi para cima delas (71,4 / 5,2). Conferido: os 3 diamantes dá para pegar.
- Correções (31/10, dono): (1) Gurupés (mastro da ponta) agora sai de dentro da proa, com argola de ferro e duas cordas segurando a ponta (antes parecia um pau solto no ar). (2) A vela do mastro ficou menor e na frente do mastro, deslocada para a direita: não encosta mais na escada de corda; ela só estufa com o vento (gira em x), sem atravessar as cordas.
- Correção (31/10, dono): a chuva e os raios do Mundo 19 e o céu da aurora (estrelas, faixas, lua) do Mundo 18 eram adicionados direto na cena (scene.add) e continuavam aparecendo nas outras fases depois de passar por esses mundos. Agora ficam presos à fase (add → W), que é desmontada ao trocar de mundo. Conferido: M1 e M16 sem chuva nem aurora depois de jogar M18 e M19.
- Correção (31/10, dono): escada de corda do mastro presa — as cordas sobem até a borda do cesto e são amarradas (nós), com uma viga de madeira ligando o topo da escada ao cesto; embaixo, argolas de ferro no convés.

### Mundo 19 — parte 2 feita: mar aberto (31/10; dono: "sem praia, maior que a primeira")
- x 94 → 240 (146, a parte 1 tem 108). Sem areia: só mar e destroços.
- Destroços que boiam (movers com `kind`, `WK_DEB` em 10_mundos_dados.js): tábuas amarradas, caixotes, portas e barris. Todos andam juntos na corrente (mesma velocidade e alcance → os vãos não mudam), sobem e descem com as ondas (`wkWaveY`), afundam 0,15 com o peso do Kuro. Barril escorrega e rola sob os pés.
- 6 pedaços grandes do casco saindo da água, parados (`LV.hullp`, `wkHullPiece`): descanso, bandeiras (125, 169, 198) e o último (220–240) é o fim provisório (236), onde vai começar a parte 3.
- Ventania: setas de vento aparecem 1,3 s antes; depois 2,6 s empurrando o Kuro para trás (WK.push somado depois de updSandSys, que zera P.wpush). Aviso na 1ª vez.
- Raio com aviso: um círculo brilhando e um feixe fino marcam o destroço ~3 à frente do Kuro; 1,1 s depois cai o raio (clarão, faíscas) — machuca quem estiver em cima.
- Onda gigante a cada 22–32 s: todos os destroços sobem até 1,5 por 5 s (aviso na tela).
- Caiu no mar: respingo e volta à bandeira. Bichos: caranguejos nos cascos, gaivotas, peixes saltando.
- Teste 61: os 27 pulos da parte 2 (jogador mirando o próximo destroço), raio, vento e onda.
- (31/10, dono, foto de mar como inspiração) Mar do Mundo 19 refeito: altura por 4 ondas cruzadas (swell + marolas, wkSeaH) com normais calculadas e cor por altura (vertex color: azul-escuro no vale, azul no meio, azul-claro na crista, espuma clara nas cristas inclinadas; cores convertidas para linear). Destroços agora boiam NA água: altura = mar + quanto fica de fora (WK_FB: tábua .1, porta .08, caixote .42, barril .3) e inclinam com a onda. Onda gigante virou uma onda que atravessa a tela da direita para a esquerda, levantando a água e os destroços por onde passa.
- Desempenho (31/10, dono: FPS caiu no M19): as ondas eram calculadas no processador, vértice por vértice, 90 vezes por segundo (dentro da física). Agora a altura, a inclinação e a cor da água são calculadas na placa de vídeo (onBeforeCompile no material do mar, uniforms uT/uA/uBc/uBh; wkSeaH no JS só para os destroços). As partes só visuais do wkUpd (chuva, destroços ao longe, vela, raios) rodam uma vez por quadro desenhado. Medido: M19 0,63 ms/quadro de CPU (M16 0,58; M18 0,39).

### Mundo 19 — parte 3 feita: a popa, o Capitão Corvo-Pirata e a ilha (31/10) — MUNDO 19 COMPLETO
- Mais destroços (240–264) até a popa. Popa (`LV.stern`, `wkStern`, x 264–327): porão alagado com a frente aberta (lanternas, caixas, barris, buracos no casco, crabs), escada de madeira em 292,5 subindo pelo alçapão (289–293) até o convés (5); parede interna em 297 separa o porão; tombadilho 319–327 (7,6) com degrau, mastro quebrado com vela, janelas acesas, canhão.
- Chefe Capitão Corvo-Pirata (criação própria: corvo de casaca vermelha, chapéu de três pontas com pena, tapa-olho, sabre). Luta diferente das outras: ele fica no tombadilho e não dá para pular nele; joga barris que rolam pelo convés — o Kuro PULA EM CIMA do barril e ele volta voando no capitão (3 acertos). Tonto 2,4 s (dá para pular na cabeça também). Ataques: barris, tiro de canhão (marca vermelha no convés antes), e a partir do 2º acerto PEIXES saltam por cima do convés (2, depois 3). O convés inclina com o balanço (empurra o Kuro e os barris), mais forte a cada fase. Paredes fecham o convés durante a luta; câmera afasta e fica parada (WK.camLock, zoom 1,55). Perder → reseta a luta. Ao vencer, ele cai no mar e a parede da direita abre.
- Depois do navio: 5 pedras na água com peixes saltando entre elas (330–357) e a ilha (`LV.island`, 360–425): palmeiras com cocos (só atrás do caminho), poças (chão alagado), 2 árvores caídas que são obstáculo (374–379,5 e 394–400) e 2 de enfeite, pedras; sapos e caranguejo; fim em 418. A tempestade acalma perto da ilha (ondas menores, sem chuva, sem raios).
- Bandeiras em 236, 294 (porão) e 362 (ilha). Tempo 900. Cristais: cesto da gávea, porão, ilha. wormAI usa LV.riverY para a água dos peixes. Teste 62 (pulos, escada, luta completa chutando barris, sair do navio, chegar ao fim).
- Correção (31/10, dono: 'luta sem física'): o desenho da popa girava (balanço) em volta do x=0 do mundo; a 300 de distância isso deslocava o navio vários metros para baixo e o Kuro/barris pareciam flutuar fora do convés. Agora o desenho não gira (só balança 0,02 para cima/baixo); o empurrão do balanço continua. Teste 62 confere que o convés desenhado fica no lugar do chão de verdade durante a luta.
- Correções (31/10, dono): corrente da âncora refeita — sai da argola da âncora, fica deitada na areia e sobe até uma argola com buraco na frente da proa (elos de 0,2 alternando, seguindo a direção da corrente). Ilha: o terreno do fundo continua a ilha (chão firme até z≈−11, depois desce no mar) e as palmeiras/pedras usam a altura do chão (antes algumas ficavam no ar sobre a água).
- Correção (31/10, dono): a âncora virou obstáculo de verdade (solid com o tamanho dela, topo ~0,6): o Kuro precisa pular, pode ficar em pé em cima; o caranguejo bate nela e volta (não atravessa).
- (31/10, dono) Âncora virou um degrau baixinho (0,45), como bicho derrubado: o Kuro sobe andando nela, sem precisar pular; o caranguejo continua batendo e voltando.
- (01/11, dono) Escada do mastro reta e encostada no cesto (x 50,3), as cordas passam por cima da borda com ganchos (sem as cordas inclinadas e a viga); bandeira pirata preta (caveira e ossos, desenho próprio) no topo do mastro, balançando com o vento.
- (01/11, dono) Mastro: a verga com a vela branca foi para o topo do mastro (a vela acaba acima do cesto); bandeira pirata removida (entendi errado), pomo de madeira no topo. Escada (x 51,2) sobe reta do convés até o fundo do cesto, passa pelo buraco do cesto (cesto é 'up': dá para passar por baixo e pisar em cima) e fica presa por duas braçadeiras de ferro; argolas no convés. Nada solto.
- (01/11, dono) Raio nos destroços: zigue-zague com galhos do céu até o destroço (wkStrikeBolt), clarão piscando, trovão forte na hora, tremor de tela; o destroço atingido se despedaça (wkShatter: 10 lascas voando que caem na água, fumaça; o solid some — quem estava em cima cai) e volta a boiar 4,5 s depois crescendo. Kuro fica molhado na chuva (kuroWetUpd com modo chuva: molha aos poucos, escurece e brilha, pinga); seca no porão coberto e perto da ilha.
- (01/11, dono) Gotinhas do Kuro molhado refeitas: forma de lágrima, menores, transparentes e brilhantes (clearcoat); primeiro escorrem grudadas no corpo do Kuro, depois caem esticando com a velocidade e somem aos poucos. Bem menos gotas (chuva 0,1/quadro, cachoeira 0,2). As gotas agora são da fase (add), não ficam na cena.
- Correção (01/11, dono): o alçapão da popa era uma caixa preta por cima do convés; agora o convés tem o buraco aberto de verdade (dois pedaços + bordas de frente e de trás) com moldura de madeira — dá para ver o porão lá embaixo.
- Correção (01/11, dono): depois de vencer o capitão, morrer no caminho da ilha deixava o Kuro preso (voltava ao porão e a parede da esquerda do convés continuava fechada). Agora ao vencer abrem as duas paredes e, se ele morrer depois, o capitão continua derrotado e o caminho aberto. Teste 62 confere.

### Mundo 20 — Cânion Invertido: parte 1 feita (05/11; plano aprovado pelo dono: manhã, câmera no padrão do jogo — não gira; sem chefe)
- Parte nova `36_canion.js`. Tema 21 ('valley' com dry:1 e canyon:1: manhã, céu azul → pêssego, poeira dourada no ar, sem árvores, cactos), MATS[21] (terra e pedra vermelhas), música 17 (nova, manhã com jeito de faroeste; a do mapa continua sendo a última). LEVELS[19], x 0–152, bandeira em 146 (provisória), tempo 10:00.
- **Setas de gravidade** (`LV.canyon.arrows` [x,y,'up'|'down']): placa de pedra com seta brilhando — azul vira a gravidade para o teto, laranja traz de volta. Só a seta do lado contrário funciona (a outra fica menor). Ao virar: som, brilho, morcegos pendurados por perto acordam; a raposinha desmonta. Aviso na tela na 1ª vez.
- **Física espelhada:** com a gravidade virada, o passo do Kuro (`step`, do comando até as molas) roda num mundo espelhado em volta da linha `LV.canyon.A` (cnIn/cnOut trocam `solids` por cópias de cabeça para baixo e espelham P.y/P.vy; a poeira também). Assim pulo, pulo duplo, capa, quinas e blocos funcionam iguais no teto. O pisão em inimigo e o empurrão de quando se machuca também viram.
- Teto: blocos com 6º valor 'roof' (parte de baixo em y 8, A=4). Buracos do teto dão para o céu: cair por eles (y > 2A+9) é queda. Renascer (spawn/resetState) volta a gravidade ao normal.
- Desenho: o Kuro gira de cabeça para baixo em volta dos pés (cnPose, rig.root.rotation.x); a câmera não gira, mas no cânion ela fica no meio entre chão e teto (zoom 1,3), para mostrar os dois juntos.
- Cenário: paredão do fundo em colunas listradas com espaço para o céu, mesas de pedra lá longe, pedras de cabeça para baixo penduradas no céu, pedras flutuando, pontinhas de pedra embaixo do teto (lá atrás, fora do caminho).
- **Morcego pendurado** (`hang:1` no inimigo 'bat'): dorme de cabeça para baixo no teto, acorda com o Kuro perto ou quando a gravidade vira; com o Kuro no teto ele vem por baixo. Pulo vindo de baixo derruba (regra dos voadores).
- Caminho: chão → seta azul (x 12) → teto com buraco → laranja (31) → buraco no chão → azul (58) → teto por cima de um buraco grande do chão, cristal no teto (70) → laranja (72) → azul (91) → teto → laranja (113) → final no chão. Bandeirinhas em 47, 69 e 114.
- Teste novo (Mundo 20): o robô passa a parte 1 andando e correndo (6 viradas), fica em pé no teto, cair no buraco do teto é queda, renasce com a gravidade normal, morcego pendurado acorda e o pulo de baixo derruba sem machucar.
- Próximas partes (combinado no plano): parte 2 — gargantas com pedras que caem para cima e setas que trocam de lado sozinhas; parte 3 — subida final alternando a gravidade até o arco de pedra com a Semente de Luz.

### Mundo 20 — parte 2 feita: as gargantas (05/11)
- Fase vai até x 300 (camMax 300), bandeira em 297 (provisória), tempo 12:00. Bandeirinhas novas em 153, 194 e 247. 2º cristal no teto em 229 (só para quem fica no teto na seta que troca do x 226).
- **Setas que trocam sozinhas** (`canyon.arrows` com 4º valor = segundos, 5º = atraso): ficam azul/laranja alternando; anel amarelo e um arco girando; o arco pisca 0,5 s antes de trocar. Na 156 (1,6 s) e na 210 (1,3 s) é preciso esperar a azul para atravessar o buraco do chão pelo teto; a 226 (no teto) divide o caminho: azul continua no teto (cristal), laranja derruba no chão (aí tem a seta azul fixa do 236).
- **Pedras que caem para cima** (`canyon.rocks` [x,largura]; cnRocks): o Kuro chega perto (até 1,8 da beirada) → treme 0,45 s → sobe rápido e bate no teto (tremor de tela, poeira) → fica grudada 1,6 s → desce devagar; depois de 1,2 s pode subir de novo. É um bloco sólido (dá para ficar em cima e no teto vira degrau). Em cima dela com a gravidade normal o Kuro sobe junto e é espremido no teto (machuca e sai para o lado); no caminho dela machuca e empurra para o lado. Rachaduras azuis (a cor da seta do teto).
- Pedras em 136, 150 (chão, ensinam), 178 e 182 (embaixo do teto: passar correndo), 205, 228, e a fileira 276/280/284 no fim.
- Teste 63 (parte 2): robô passa as partes 1 e 2 andando e correndo (espera as setas que trocam, 14 viradas), pedra pega quem fica parado no teto, correndo passa, em cima sobe junto e é espremido, volta ao chão, seta troca no tempo certo.

### Mundo 20 — parte 3 feita: a subida até o arco (05/11) — MUNDO 20 COMPLETO
- Fase x 0–392 (camMax 392), tempo 15:00. Bandeirinhas novas em 302 e 350 (em cima da pedra larga). 3º cristal embaixo da pedra do x 363–370 (366,5).
- Depois do chão (até 316), não tem mais teto nem chão: **pedras soltas no ar** (6º valor 'slab': dá para andar em cima e embaixo; crosta e pontinhas embaixo, terra em cima), abismo embaixo e céu em cima. Seta azul no x 315 → o Kuro anda de cabeça para baixo embaixo das pedras e vai subindo (sair de uma pedra = cair para cima na próxima, mais alta).
- Seta que troca sozinha no meio do pulo (340,5; 1,4 s): pegar laranja derruba no abismo — esperar a azul. Laranja fixa no 347 → cai em cima da pedra larga (348,5–355, topo 2) com a gravidade normal; azul no 353,5 → sobe de novo. Morcegos voando e um pendurado embaixo da pedra do 355–362.
- **Arco de pedra** (6º valor 'arch', x 371–391, parte de baixo em 12; pernas descendo para o abismo lá atrás). **Semente de Luz** pendurada embaixo do arco (`canyon.seed` [381, 11,2]; cnSeedBuild/cnSeedUpd): tocar nela → brilho, som mágico, aviso, o Kuro para e 1,6 s depois termina a fase (crystalGoal, sem bandeira).
- Câmera: a partir de `canyon.free` (312) a câmera passa a acompanhar o Kuro na altura (mistura em 6 de distância), porque ali não tem mais chão e teto fixos.
- Setas que trocam têm um 6º valor `go` ('up'/'down'): o lado em que é certo passar (usado pelo robô do teste).
- Teste 63: o robô passa a fase inteira andando e correndo (17 viradas) e termina na Semente de Luz.
- Obs. (05/11): o arquivo `claude/como-trabalhar.md` citado pelo dono não existe no repositório.
- Obs. testes (05/11): nesta área de trabalho a bateria completa trava no teste 32 (Mundo 14) com "Target crashed" — acontece igual na versão de antes do Mundo 20 (página acumula memória depois de ~30 testes). Rodando do teste 32 em diante numa página nova, todos passam.

### Mundo 20 — acabamento (05/11, de volta na conversa principal)
- Setas viraram **placas de pedra entalhadas** (antes pareciam botões do celular): apoiadas no chão, penduradas no teto ou pedra solta no ar; seta brilhando e facho de luz para onde ela manda (só na seta que funciona). Brilho mais fraco (antes estourava em branco).
- Paredão do fundo bem mais longe (z −26 a −34) e mais claro: não parece mais estar no caminho.
- **Arco de pedra de verdade** (cnArch): passarela reta na frente (onde o Kuro anda por baixo) e arco curvo atrás, pernas entrando no abismo, pedrinhas de luz dourada pela curva de dentro.
- Teto não faz sombra no chão (o chão das gargantas ficava escuro).
- Mundo 19: corrigido travamento na luta do Capitão (lista de barris esvaziava no meio da conta quando o Kuro caía).

### Tela de carregamento (05/11)
- Parte nova `65_carregando.js` + HTML/CSS `#ld` em 00_inicio.html. Inspirada numa imagem do dono (só inspiração): o Kuro (o mesmo modelo do jogo) e a raposinha na beira de um penhasco de grama, placa de madeira com montanha, cogumelo, moitas; ao fundo o Cume nevado com estrela dourada brilhando, ilhas flutuantes com castelinhos, casinha, árvores e cachoeiras, ponte de corda, nuvens passando e mar de nuvens. Câmera chega perto devagar.
- Por cima (HTML): placa de pedra com "RUMO AO CUME" dourado e "Explore • Pule • Conquiste", "Grandes aventuras te esperam!", "Carregando..." com barra amarela e % real, dicas verdadeiras do jogo trocando a cada 3,2 s.
- O jogo agora se monta em etapas (`ldBoot` no fim de 71_laco_e_mapa.js: gráficos → fase → estado → mapa → shaders); a cena anda entre elas. Mínimo de 2,6 s na tela; no fim o Kuro e a raposinha pulam, clarão e abre o mapa. Durante o carregamento o resto da interface fica escondido (body.ldg).
- Leve: cenário parado em 1 malha só (cores por vértice), sem sombras. Antes do 3D aparecer, o fundo já é o céu em degradê (não mais preto); a cor da abertura do app (manifest) também virou azul-céu.
- Testes: `window.__noLoad` (copia_teste.py) monta direto, sem a tela. Fotos da tela: `node testes/ldf.js '["LD.t=0"]'` (window.__ldHold segura a tela).
- Obs. testes: a bateria completa às vezes derruba a página no teste 62 por falta de memória (acumula ~60 testes na mesma página); rodando `node testes/so.js 62 63` passam.
- (05/11, 2ª versão) Tela fica no mínimo 6 s. Cenário mais realista: texturas do jogo (pedra, grama, madeira, tijolo), pedras e ilhas irregulares (ldRough: ruído por posição), montanhas com sulcos e neve descendo pelas ranhuras (ldMountain, cores por ponto), nuvens macias (imagem com bolhas suaves em sprites) no lugar das bolas de polígono. window.__ldMs = quanto tempo a tela ficou.

### Mundo 20 REFEITO — Cânion do Sol (05/11, pedido do dono: fase no sentido normal + obstáculos perigosos) — MUNDO 20 COMPLETO
- Nome novo "Cânion do Sol" (antes "Cânion Invertido"). A fase não vira mais a gravidade; o código das setas/espelho continua em 36_canion.js, sem uso (guardado para o futuro). LEVELS[19], x 0–393, manhã, sem chefe, 110 moedas, 3 cristais, Semente de Luz no fim (crystalGoal).
- Câmera: segue o Kuro na altura desde o começo (canyon.free −20), um pouco mais alta (canyon.camUp 2,1) para mostrar os pilões; zoom 1,15.
- Inimigos: os do deserto (des7 também no cânion): besouro → escorpião, morcego → abutre.
- **Parte 1 (0–160), fundo do cânion:** barrancos que desmoronam (crumbles no tema do cânion = coluna de pedra até o fundo que cai inteira); pedras rolando (canyon.boulders [de x, até x, segundos, atraso]: saem de uma fenda do paredão, rolam contra o Kuro, se despedaçam no fim; pular por cima); gêiser de areia (mola com cratera e jato de areia) no x 112 até o 1º cristal; bloco da raposinha no 142. Blocos tirados de cima do caminho das pedras (bater a cabeça impedia o pulo).
- **Parte 2 (160–306), a garganta:** paredões altos perto (cnGorge). Pilões de pedra (canyon.crushers [x,largura,altura parado,segundos parado,atraso,aviso]): tremem e soltam poeira → caem → ficam → sobem devagar; sólidos (dá para subir, sobe junto); esmagado = dano e empurrado para fora (nunca preso). Corredor de 3 pilões (170/176/182); teto que desce (o pilão largo de 10 com pontas no 215, cai mais devagar) — no lugar das paredes que fecham (de lado, a parede da frente esconderia o Kuro); troncos balançando em cordas (canyon.logs [x pino,y pino,comprimento,abertura,velocidade,fase]) sobre o buraco do 226 e no chão do 246; pilão do 271,5 leva o Kuro até a mesa (274–282, altura 5,5) com o 2º cristal.
- **Parte 3 (306–393), a subida:** saliências presas no paredão (6º valor 'ledge'), degraus encostados (sem vão) onde o pulo correndo passava do ponto; ponte de corda que arrebenta (12 tábuas = crumbles com 4º valor 'plank'; canyon.bridge desenha cordas e postes) com o 3º cristal no alto (pular da ponte); rajadas de areia no platô 343–357; abutres; arco de pedra no fim com a Semente de Luz em cima (canyon.seed [389,14,3]).
- Teste 63: robô passa as 3 partes andando e correndo; pedra machuca, barranco cai, gêiser joga alto, pilão esmaga e empurra, tronco bate, pilão leva à mesa (cristal), tábua da ponte cai.
