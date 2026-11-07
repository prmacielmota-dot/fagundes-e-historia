# Fagundes é História

Portal educativo gratuito dedicado à história local de Fagundes, Paraíba, com acesso público e jogos interativos executados diretamente no navegador.

## O que contém
- Seções: história e cronologia, turismo, economia, religiosidade, política e cidadania, prédios públicos, personalidades, tradição oral e referências.
- 7 jogos: quiz, memória, pedra baixando, a imagem de Santo Antônio voltando à pedra, passagem virtual, caça-palavras e quebra-cabeça deslizante.
- Quiz e desafio da pedra com modo individual, dupla ou trio, com turnos no mesmo aparelho (não é multiplayer remoto).
- Layout responsivo para celular e computador, ilustração SVG própria, sem login, sem banco de dados e sem necessidade de instalar dependências.

## Rodar localmente
Abra o arquivo `index.html` no navegador. Para servir com HTTP, dentro da pasta execute `python3 -m http.server 8080` e abra `http://localhost:8080`.

## Publicar na Vercel
1. Crie um repositório GitHub com os arquivos da pasta (a pasta raiz deve conter `index.html`, `styles.css`, `app.js`, `assets/`).
2. Na Vercel, clique em `Add New > Project`, selecione o repositório e use o framework `Other` / sem framework, mantendo a pasta raiz como `./`.
3. Faça o deploy. Não é necessário build command nem output directory para este site estático.
4. Em Settings > Deployment Protection, confirme que produção é pública se quiser acesso sem login.

## Curadoria
- Prefeitura: https://fagundes.pb.gov.br/a-cidade/historia
- IBGE histórico: https://www.ibge.gov.br/biblioteca/visualizacao/dtb/paraiba/fagundes.pdf
- IBGE municípios: https://www.ibge.gov.br/cidades-e-estados/pb/fagundes.html
- Paraíba Criativa: https://paraibacriativa.com.br/artista/pedra-de-santo-antonio/
- Câmara: https://camarafagundes.pb.gov.br/

Os jogos simulam elementos do patrimônio cultural. Histórias tradicionais são identificadas como lendas e não tratadas como fatos comprovados. A seção de patrimônio e personalidades é inicial e deve ser enriquecida com dados verificados, documentação e autorização das fontes.