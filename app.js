/* Fagundes é História — jogos locais, sem conta ou coleta de dados pessoais. */
'use strict';
const stage = document.querySelector('#gameStage');
const tabs = document.querySelectorAll('.game-tab');
const nav = document.querySelector('#navigation');
const menuToggle = document.querySelector('#menuToggle');
document.querySelector('#copyrightYear').textContent = new Date().getFullYear();
menuToggle.addEventListener('click', () => { const open = nav.classList.toggle('open'); menuToggle.setAttribute('aria-expanded', String(open)); menuToggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu'); });
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');}));

const questions = [
 {q:'Em que estado brasileiro fica o município de Fagundes?',a:['Pernambuco','Paraíba','Rio Grande do Norte','Ceará'],c:1,why:'Fagundes é um município do estado da Paraíba.'},
 {q:'Qual grupo indígena integra a história mais antiga da região de Fagundes?',a:['Cariris','Astecas','Incas','Maias'],c:0,why:'Fontes locais e o IBGE registram a presença indígena Cariri no território.'},
 {q:'Que serra está ligada à paisagem e à história de Fagundes?',a:['Serra da Mantiqueira','Serra do Mar','Serra do Bodopitá','Serra Gaúcha'],c:2,why:'A Serra do Bodopitá é uma referência natural e histórica da região.'},
 {q:'Em qual ano ocorreu a emancipação política definitiva de Fagundes?',a:['1500','1874','1961','2004'],c:2,why:'A Lei Estadual nº 2.661, de 22 de dezembro de 1961, criou o município atual.'},
 {q:'De qual município Fagundes foi desmembrado em 1961?',a:['Areia','Campina Grande','João Pessoa','Patos'],c:1,why:'O histórico do IBGE registra o desmembramento de Campina Grande.'},
 {q:'Qual destas mobilizações populares é ligada à história de Fagundes?',a:['Revolta da Vacina','Quebra-Quilos','Revolta da Chibata','Inconfidência Mineira'],c:1,why:'O Quebra-Quilos ocorreu no século XIX e marcou a história local e regional.'},
 {q:'O que a lenda conta sobre a imagem de Santo Antônio?',a:['Que foi encontrada no mar','Que sempre ficou na praça','Que reapareceu junto à pedra','Que veio de outro país por avião'],c:2,why:'Na tradição oral, a imagem foi retirada das rochas, mas teria voltado ao local.'},
 {q:'Qual destes é um papel da Câmara Municipal?',a:['Criar leis municipais e fiscalizar','Realizar censos nacionais','Emitir passaportes','Comandar o Exército'],c:0,why:'A Câmara exerce o Poder Legislativo do município.'},
 {q:'Qual é o gentílico de quem nasce em Fagundes?',a:['Fagundense','Fagundista','Fagundiano','Fagundês'],c:0,why:'O IBGE informa que o gentílico é fagundense.'},
 {q:'Qual destes movimentos ocorreu, segundo fonte municipal, em 1983?',a:['Quebra-Canos','Revolução Farroupilha','Guerra de Canudos','Revolta do Contestado'],c:0,why:'O Quebra-Canos é lembrado em conflitos relacionados à distribuição de água.'},
 {q:'Por que é importante distinguir uma lenda de um documento histórico?',a:['Porque toda lenda é mentira','Porque são formas diferentes de preservar e interpretar memórias','Porque documentos não têm valor','Porque só fotos contam histórias'],c:1,why:'A tradição oral é patrimônio cultural; fatos históricos precisam ser examinados e contextualizados por fontes.'},
 {q:'Em qual data foi oficialmente instalado o município de Fagundes?',a:['31 de dezembro de 1961','1º de janeiro de 1500','13 de junho de 1852','22 de abril de 1888'],c:0,why:'A instalação oficial ocorreu em 31 de dezembro de 1961, conforme o IBGE.'}
];
const memPairs = [
 {key:'pedra',icon:'🪨',label:'Pedra de Santo Antônio',detail:'A Pedra de Santo Antônio une paisagem, turismo e tradição oral.'},
 {key:'cariri',icon:'🌿',label:'Cariris',detail:'Os povos Cariris fazem parte da história mais antiga da região.'},
 {key:'serra',icon:'⛰️',label:'Bodopitá',detail:'A Serra do Bodopitá é referência geográfica do município.'},
 {key:'1961',icon:'📜',label:'1961',detail:'Ano da emancipação política definitiva de Fagundes.'},
 {key:'feira',icon:'🧺',label:'Feira',detail:'O comércio e as feiras integram a vida econômica e social.'},
 {key:'camara',icon:'🏛️',label:'Câmara',detail:'A Câmara Municipal integra o Poder Legislativo local.'}
];
const shuffle = arr => { const out=[...arr];for(let i=out.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[out[i],out[j]]=[out[j],out[i]];}return out; };
const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const head = (k,title,desc,pill='GRÁTIS • SEM LOGIN') => `<div class="game-head"><div><span class="game-kicker">${k}</span><h3>${title}</h3><p>${desc}</p></div><span class="game-pill">${pill}</span></div>`;
let currentGame='quiz';let quiz={};let memory={};let stone={};let santoCount=0;let santoBusy=false;let fenda={};let wordsearch={};let puzzle={};
function switchGame(game){currentGame=game;tabs.forEach(t=>{const active=t.dataset.game===game;t.classList.toggle('active',active);t.setAttribute('aria-selected',String(active));});const views={quiz:renderQuiz,memoria:renderMemory,pedra:renderStone,santo:renderSanto,fenda:renderFenda,palavras:renderWords,puzzle:renderPuzzle};views[game]();}
tabs.forEach(t=>t.addEventListener('click',()=>switchGame(t.dataset.game)));
function progress(done,total){return `<div class="game-progress" role="progressbar" aria-valuenow="${done}" aria-valuemin="0" aria-valuemax="${total}"><i style="width:${100*done/total}%"></i></div>`;}
function scoresHTML(state){return `<div class="team-scores">${state.scores.map((v,i)=>`<div class="team-score ${state.index%state.scores.length===i?'active':''}">Equipe ${i+1}<strong>${v} ponto${v!==1?'s':''}</strong></div>`).join('')}</div>`;}
function setupBlock(game,label,button){return `<div class="game-config"><label for="teamCount">Participantes</label><select class="game-select" id="teamCount"><option value="1">Individual</option><option value="2">Dupla (2 equipes)</option><option value="3">Trio (3 equipes)</option></select><button class="game-btn" data-action="${game}">${button}</button></div><p class="game-hint">No modo dupla/trio, cada equipe responde na sua vez, no mesmo aparelho. Não há conexão entre dispositivos.</p>`;}
function startQuiz(){const n=Math.min(3,Math.max(1,Number(document.querySelector('#teamCount')?.value||1)));quiz={started:true,items:shuffle(questions),index:0,scores:Array(n).fill(0),locked:false,choice:null};renderQuiz();}
function renderQuiz(){if(!quiz.started){stage.innerHTML=head('DESAFIO 01','Quiz: você conhece Fagundes?','Perguntas sobre a cidade e sua história. Escolha a modalidade e veja quantas acerta.')+setupBlock('startQuiz','Participantes','Começar o quiz');return;}const q=quiz.items[quiz.index];if(!q){const order=quiz.scores.map((n,i)=>({n,i})).sort((a,b)=>b.n-a.n);stage.innerHTML=head('DESAFIO 01','Quiz concluído!','Parabéns por explorar a história de Fagundes.')+`<div class="victory-card"><div style="font-size:48px">🏆</div><h3>${quiz.scores.length>1?'Placar final':'Você chegou ao final!'}</h3>${quiz.scores.map((v,i)=>`<p><strong>Equipe ${i+1}:</strong> ${v} resposta${v!==1?'s':''} correta${v!==1?'s':''}</p>`).join('')}<p>${quiz.scores.length>1?'Equipe com mais pontos: '+(order.filter(x=>x.n===order[0].n).map(x=>'Equipe '+(x.i+1)).join(' e ')):'Continue explorando os outros jogos.'}</p><button class="game-btn" data-action="resetQuiz">Jogar novamente</button></div>`;return;}stage.innerHTML=head('DESAFIO 01','Quiz: você conhece Fagundes?','Leia a pergunta e escolha uma resposta.',`QUESTÃO ${quiz.index+1} DE ${quiz.items.length}`)+scoresHTML(quiz)+progress(quiz.index,quiz.items.length)+`<p class="question-title">${esc(q.q)}</p><div class="game-options">${q.a.map((a,i)=>`<button class="game-option ${quiz.locked?(i===q.c?'correct':i===quiz.choice?'wrong':''):''}" data-answer="${i}" ${quiz.locked?'disabled':''}>${String.fromCharCode(65+i)}. ${esc(a)}</button>`).join('')}</div>${quiz.locked?`<div class="game-feedback ${quiz.choice===q.c?'':'bad'}"><strong>${quiz.choice===q.c?'Resposta correta!':'Vamos aprender mais!'}</strong> ${esc(q.why)}</div><div class="game-actions"><button class="game-btn" data-action="nextQuiz">${quiz.index===quiz.items.length-1?'Ver resultado':'Próxima pergunta →'}</button></div>`:''}`;}
function answerQuiz(i){if(quiz.locked)return;const q=quiz.items[quiz.index];quiz.locked=true;quiz.choice=i;if(i===q.c)quiz.scores[quiz.index%quiz.scores.length]++;renderQuiz();}
function startMemory(){const cards=shuffle(memPairs.flatMap(p=>[{...p,id:p.key+'a'},{...p,id:p.key+'b'}]));memory={started:true,cards,flipped:[],found:[],moves:0,locked:false,notice:''};renderMemory();}
function renderMemory(){if(!memory.started){stage.innerHTML=head('DESAFIO 02','Jogo da memória','Encontre pares de símbolos da história local. Cada combinação revela um pequeno aprendizado.')+`<div class="game-actions"><button class="game-btn" data-action="startMemory">Embaralhar e jogar</button></div>`;return;}const finished=memory.found.length===memPairs.length;stage.innerHTML=head('DESAFIO 02','Jogo da memória','Vire duas cartas e tente encontrar os pares.',`${memory.moves} tentativa${memory.moves===1?'':'s'}`)+(finished?`<div class="victory-card"><div style="font-size:44px">🎉</div><h3>Você encontrou todos os pares!</h3><p>Concluiu em ${memory.moves} tentativas.</p><button class="game-btn" data-action="startMemory">Jogar de novo</button></div>`:`<div class="memory-board">${memory.cards.map((c,i)=>{const show=memory.flipped.includes(i)||memory.found.includes(c.key);return `<button class="memory-tile ${memory.found.includes(c.key)?'matched':show?'flipped':''}" ${memory.found.includes(c.key)?'disabled':''} data-memory="${i}" aria-label="${show?esc(c.label):'Carta oculta '+(i+1)}"><span class="symbol">${show?c.icon:'✦'}</span>${show?`<span class="memory-label">${esc(c.label)}</span>`:''}</button>`;}).join('')}</div><p class="game-hint">${memory.notice||'Escolha duas cartas para revelar os símbolos.'}</p>`)+`<div class="game-actions"><button class="game-btn secondary" data-action="startMemory">Reiniciar</button></div>`;}
function flipMemory(i){if(memory.locked||memory.found.includes(memory.cards[i]?.key)||memory.flipped.includes(i)||memory.flipped.length>=2)return;memory.flipped.push(i);if(memory.flipped.length===2){memory.moves++;const [a,b]=memory.flipped;const matched=memory.cards[a].key===memory.cards[b].key;if(matched){const pair=memPairs.find(x=>x.key===memory.cards[a].key);memory.found.push(memory.cards[a].key);memory.notice='Par encontrado! '+pair.detail;memory.flipped=[];renderMemory();}else{memory.notice='Não combinam. Tente memorizar onde estão.';memory.locked=true;renderMemory();setTimeout(()=>{{memory.flipped=[];memory.locked=false;if(currentGame==='memoria')renderMemory();}},900);}}else renderMemory();}
function startStone(){const n=Math.min(3,Math.max(1,Number(document.querySelector('#teamCount')?.value||1)));stone={started:true,index:0,items:shuffle(questions).slice(0,8),scores:Array(n).fill(0),correct:0,locked:false,choice:null};renderStone();}
function renderStone(){if(!stone.started){stage.innerHTML=head('DESAFIO 03','A pedra está baixando!','Desafio cooperativo para solo, dupla ou trio: cada acerto aproxima a pedra do chão — somente na animação do jogo.')+setupBlock('startStone','Participantes','Iniciar desafio');return;}const q=stone.items[stone.index];const finished=!q;const visual=`<div class="stone-canvas"><span class="stone-tag">ANIMAÇÃO SIMBÓLICA</span><div class="stone-falling" style="transform:translateY(${Math.min(stone.correct*16,120)}px)"></div><div class="stone-cliff"></div><span class="stone-person" aria-hidden="true">🌿</span></div><div class="stone-status">${stone.correct} acerto${stone.correct===1?'':'s'} • ${Math.round(stone.correct/stone.items.length*100)}% do desafio</div>`;stage.innerHTML=head('DESAFIO 03','A pedra está baixando!','As respostas certas fazem a pedra ilustrada descer. Em equipes, cada grupo responde uma vez.')+`<div class="stone-area"><div>${visual}</div><div>${scoresHTML(stone)}${progress(stone.index,stone.items.length)}${finished?`<div class="victory-card"><h3>Desafio encerrado!</h3><p>${stone.correct} respostas corretas em ${stone.items.length} perguntas. A pedra desceu apenas no nosso jogo!</p><button class="game-btn" data-action="resetStone">Jogar novamente</button></div>`:`<p class="question-title">${esc(q.q)}</p><div class="game-options">${q.a.map((a,i)=>`<button class="game-option ${stone.locked?(i===q.c?'correct':i===stone.choice?'wrong':''):''}" data-stone-answer="${i}" ${stone.locked?'disabled':''}>${String.fromCharCode(65+i)}. ${esc(a)}</button>`).join('')}</div>${stone.locked?`<div class="game-feedback ${stone.choice===q.c?'':'bad'}"><strong>${stone.choice===q.c?'A pedra desceu um pouco!':'A pedra ficou onde estava!'}</strong> ${esc(q.why)}</div><div class="game-actions"><button class="game-btn" data-action="nextStone">${stone.index===stone.items.length-1?'Ver resultado':'Próxima equipe →'}</button></div>`:''}`}</div></div>`;}
function answerStone(i){if(stone.locked)return;const q=stone.items[stone.index];stone.locked=true;stone.choice=i;if(i===q.c){stone.scores[stone.index%stone.scores.length]++;stone.correct++;}renderStone();}
function renderSanto(){stage.innerHTML=head('DESAFIO 04','O santo sempre volta!','Uma brincadeira inspirada na lenda: leve a figura da pedra até a capela e veja o que acontece.','LENDA • INTERATIVO')+`<div class="santo-scene"><div class="santo-path" aria-hidden="true"></div><span class="santo-rock" aria-hidden="true">🪨</span><img class="santo-figurine ${santoBusy?'travel':''}" id="santoFigurine" src="assets/santo-ilustracao.svg" alt="" aria-hidden="true"><span class="santo-chapel" aria-hidden="true">⛪</span></div><p class="game-hint" id="santoMessage">Segundo a tradição, a imagem reaparecia junto à pedra. Vamos representar a história?</p><div class="game-actions"><button class="game-btn amber" data-action="moveSanto" ${santoBusy?'disabled':''}>Levar a imagem à capela →</button><span class="game-pill">${santoCount} tentativa${santoCount!==1?'s':''}</span></div><p class="game-hint">Este jogo conta uma lenda local, não afirma um fato histórico comprovado.</p>`;}
function moveSanto(){if(santoBusy)return;santoBusy=true;santoCount++;renderSanto();const msg=document.querySelector('#santoMessage');if(msg)msg.textContent='A imagem chegou à capela...';setTimeout(()=>{if(currentGame==='santo'){const fig=document.querySelector('#santoFigurine');fig?.classList.remove('travel');const m=document.querySelector('#santoMessage');if(m)m.innerHTML='<strong>Surpresa!</strong> Como na lenda, a imagem voltou à Pedra de Santo Antônio!';}santoBusy=false;const b=document.querySelector('[data-action="moveSanto"]');if(b)b.disabled=false;},1450);}
const fendaQs=[
 {q:'A Pedra de Santo Antônio fica em qual cidade?',a:['Fagundes','Cabaceiras','Recife'],c:0},
 {q:'A narrativa sobre a imagem que retorna à pedra é uma...',a:['Lei municipal','Lenda popular','Previsão científica'],c:1},
 {q:'Como preservar um lugar de memória?',a:['Danificando as pedras','Respeitando o patrimônio','Deixando lixo'],c:1}
];
function startFenda(){fenda={step:0,locked:false,error:'',moving:false};renderFenda();}
function renderFenda(){if(!Object.hasOwn(fenda,'step'))startFenda();else {let q=fendaQs[fenda.step];stage.innerHTML=head('DESAFIO 05','Passagem virtual pela fenda','Responda corretamente para completar três passagens digitais. O desafio é uma simulação, não um convite para passar por uma fenda real.',`${fenda.step} DE 3 PASSAGENS`)+`<div class="fenda-scene"><div class="fenda-left"></div><div class="fenda-right"></div><span id="fendaPlayer" class="fenda-player ${fenda.moving?'go':''}" aria-label="Explorador virtual">🚶</span></div>${progress(fenda.step,3)}${q?`<p class="question-title">${esc(q.q)}</p><div class="game-options">${q.a.map((a,i)=>`<button class="game-option" data-fenda-answer="${i}" ${fenda.locked?'disabled':''}>${esc(a)}</button>`).join('')}</div>${fenda.error?`<p class="game-feedback bad">${esc(fenda.error)}</p>`:''}`:`<div class="victory-card"><h3>As três passagens foram concluídas!</h3><p>Você superou o desafio virtual e aprendeu sobre nosso patrimônio.</p><button class="game-btn" data-action="startFenda">Jogar novamente</button></div>`}`;}}
function answerFenda(i){if(fenda.locked||!fendaQs[fenda.step])return;if(i!==fendaQs[fenda.step].c){fenda.error='Essa não é a resposta. Leia a pergunta e tente novamente!';renderFenda();return;}fenda.locked=true;fenda.error='';fenda.moving=true;renderFenda();setTimeout(()=>{{fenda.step++;fenda.locked=false;fenda.moving=false;if(currentGame==='fenda')renderFenda();}},850);}

function rng(seed){let s=seed;return ()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
const wordLevels={
  facil:{title:'Fácil',size:9,words:['FAGUNDES','PEDRA','SERRA','FEIRA','CARIRI'],directions:[[0,1],[1,0]],hint:'Palavras da esquerda para a direita (→) ou de cima para baixo (↓).'},
  intermediario:{title:'Intermediário',size:12,words:['FAGUNDES','CARIRIS','PEDRA','SERRA','CULTURA','MEMORIA','CAPELA'],directions:[[0,1],[1,0],[-1,0],[1,1],[-1,1]],hint:'Além da horizontal (→), procure na vertical (↓ ↑) e na diagonal (↘ ↗).'},
  dificil:{title:'Difícil',size:15,words:['FAGUNDES','CARIRIS','PEDRA','SERRA','CULTURA','MEMORIA','CAPELA','HISTORIA','TURISMO','TRADICAO'],directions:[[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]],hint:'Todas as oito direções estão valendo, inclusive palavras invertidas (← ↑ ↖ ↙).'}
};
let wordLevel='facil';
let wordRound=0;
function makeWords(level=wordLevel){
  const cfg=wordLevels[level]||wordLevels.facil;
  const size=cfg.size;
  const rand=rng(1961+wordRound*97+(level==='facil'?11:level==='intermediario'?37:73));
  const grid=Array.from({length:size},()=>Array(size).fill(''));
  const placements={};
  const words=cfg.words.slice().sort((a,b)=>b.length-a.length);
  const inside=(r,c)=>r>=0&&c>=0&&r<size&&c<size;
  for(const word of words){
    const candidates=[];
    for(const [dr,dc] of cfg.directions){
      for(let r=0;r<size;r++)for(let c=0;c<size;c++){
        if(!inside(r+dr*(word.length-1),c+dc*(word.length-1)))continue;
        let fit=true,overlap=0;
        const path=[];
        for(let i=0;i<word.length;i++){
          const rr=r+dr*i,cc=c+dc*i;
          if(grid[rr][cc]&&grid[rr][cc]!==word[i]){fit=false;break;}
          if(grid[rr][cc]===word[i])overlap++;
          path.push(rr+','+cc);
        }
        if(fit)candidates.push({path,overlap,random:rand()});
      }
    }
    if(!candidates.length)throw Error('Não foi possível montar o caça-palavras: '+word);
    candidates.sort((a,b)=>(b.overlap*0.15+b.random)-(a.overlap*0.15+a.random));
    const picked=candidates[0];
    picked.path.forEach((key,i)=>{const [r,c]=key.split(',').map(Number);grid[r][c]=word[i];});
    placements[word]=picked.path;
  }
  const letters='ABCEFGHILMNOPRSTUV';
  grid.forEach(row=>row.forEach((ch,i)=>{if(!ch)row[i]=letters[Math.floor(rand()*letters.length)];}));
  return {level,grid,words:cfg.words,placements,found:[],foundCells:[],first:null,notice:'Toque na primeira letra e depois na última para marcar a palavra.'};
}
function renderWords(){
  if(!wordsearch.grid)wordsearch=makeWords();
  const w=wordsearch,cfg=wordLevels[w.level];
  const selector='<div class="word-levels" role="group" aria-label="Nível do caça-palavras">'+Object.entries(wordLevels).map(([id,item])=>'<button type="button" class="word-level '+(w.level===id?'active':'')+'" data-word-level="'+id+'" aria-pressed="'+(w.level===id)+'">'+item.title+'</button>').join('')+'</div>';
  const grid='<div class="word-grid" style="grid-template-columns:repeat('+cfg.size+',minmax(0,1fr))" role="group" aria-label="Grade de '+cfg.size+' por '+cfg.size+' letras">'+w.grid.flatMap((row,r)=>row.map((letter,c)=>{const k=r+','+c;return '<button type="button" data-cell="'+k+'" class="word-cell '+(w.first===k?'selected ':'')+(w.foundCells.includes(k)?'found':'')+'" aria-label="Linha '+(r+1)+', coluna '+(c+1)+', letra '+letter+'">'+letter+'</button>';})).join('')+'</div>';
  const list='<div class="word-list"><h4>Encontre:</h4>'+w.words.map(x=>'<p class="'+(w.found.includes(x)?'done':'')+'">'+x+(w.found.includes(x)?' ✓':'')+'</p>').join('')+(w.found.length===w.words.length?'<p>🎉 Parabéns! Você completou o nível '+cfg.title+'!</p>':'')+'<div class="game-actions"><button class="game-btn secondary" data-action="resetWords">Nova partida</button></div></div>';
  stage.innerHTML=head('DESAFIO 06','Caça-palavras de Fagundes','Escolha uma dificuldade. Encontre as palavras ligadas à história e à cultura local.',w.found.length+' DE '+w.words.length)+selector+'<p class="word-level-hint"><strong>'+cfg.title+':</strong> '+cfg.hint+'</p><div class="wordsearch-wrap"><div class="word-board">'+grid+'<p class="game-hint" aria-live="polite">'+esc(w.notice)+'</p></div>'+list+'</div>';
}
function chooseWord(cell){
  const w=wordsearch;if(w.found.length===w.words.length)return;
  if(!w.first){w.first=cell;w.notice='Agora toque na última letra da palavra.';renderWords();return;}
  const first=w.first;
  w.first=null;
  const word=w.words.find(x=>!w.found.includes(x)&&((w.placements[x][0]===first&&w.placements[x][w.placements[x].length-1]===cell)||(w.placements[x][0]===cell&&w.placements[x][w.placements[x].length-1]===first)));
  if(word){
    w.found.push(word);
    for(const cellKey of w.placements[word])if(!w.foundCells.includes(cellKey))w.foundCells.push(cellKey);
    w.notice=w.found.length===w.words.length?'Excelente! Você concluiu o nível '+wordLevels[w.level].title+'!':'Muito bem! Você encontrou '+word+'.';
  }else w.notice='Ainda não! Tente novamente ou escolha outra letra inicial.';
  renderWords();
}
function makePuzzle(){let cells=[1,2,3,4,5,6,7,8,0];let previous=-1;for(let n=0;n<70;n++){const blank=cells.indexOf(0);const neighbors=getNeighbors(blank).filter(x=>x!==previous);const dest=neighbors[Math.floor(Math.random()*neighbors.length)];[cells[blank],cells[dest]]=[cells[dest],cells[blank]];previous=blank;}return {cells,moves:0,solved:false};}
function getNeighbors(i){const row=Math.floor(i/3),col=i%3;return [[row-1,col],[row+1,col],[row,col-1],[row,col+1]].filter(([r,c])=>r>=0&&r<3&&c>=0&&c<3).map(([r,c])=>r*3+c);}
function renderPuzzle(){if(!puzzle.cells)puzzle=makePuzzle();stage.innerHTML=head('DESAFIO 07','Quebra-cabeça da pedra','Organize as peças deslizando os quadrados vizinhos do espaço vazio até reconstruir a ilustração.',`${puzzle.moves} movimento${puzzle.moves===1?'':'s'}`)+`<div class="puzzle-layout"><div class="puzzle-board">${puzzle.cells.map((v,i)=>`<button class="puzzle-tile ${v===0?'empty':''}" data-puzzle="${i}" ${v===0?'disabled':''} ${v===0?'aria-label="Espaço vazio"':`aria-label="Peça ${v}" data-number="${v}" style="background-position:${((v-1)%3)*50}% ${Math.floor((v-1)/3)*50}%"`}></button>`).join('')}</div><div><p class="game-kicker">IMAGEM DE REFERÊNCIA</p><img class="puzzle-preview" src="assets/pedra-ilustracao.svg" alt="Desenho completo dos rochedos e da capela"><p class="game-hint">Selecione uma peça ao lado do espaço vazio. O quebra-cabeça é embaralhado com movimentos válidos e sempre pode ser resolvido.</p>${puzzle.solved?'<div class="game-feedback">🎉 Parabéns! Você reconstruiu a imagem!</div>':''}<div class="game-actions"><button class="game-btn secondary" data-action="resetPuzzle">Embaralhar de novo</button></div></div></div>`;}
function movePuzzle(i){const blank=puzzle.cells.indexOf(0);if(!getNeighbors(blank).includes(i))return;[puzzle.cells[blank],puzzle.cells[i]]=[puzzle.cells[i],puzzle.cells[blank]];puzzle.moves++;puzzle.solved=puzzle.cells.every((x,i)=>x===(i===8?0:i+1));renderPuzzle();}
function handleAction(action){switch(action){case'startQuiz':startQuiz();break;case'resetQuiz':quiz={};renderQuiz();break;case'nextQuiz':quiz.index++;quiz.locked=false;quiz.choice=null;renderQuiz();break;case'startMemory':startMemory();break;case'startStone':startStone();break;case'resetStone':stone={};renderStone();break;case'nextStone':stone.index++;stone.locked=false;stone.choice=null;renderStone();break;case'moveSanto':moveSanto();break;case'startFenda':startFenda();break;case'resetWords':wordRound++;wordsearch=makeWords();renderWords();break;case'resetPuzzle':puzzle=makePuzzle();renderPuzzle();break;}}
stage.addEventListener('click',event=>{const target=event.target.closest('button');if(!target)return;if(target.dataset.wordLevel){wordLevel=target.dataset.wordLevel;wordRound=0;wordsearch=makeWords(wordLevel);renderWords();}else if(target.dataset.action)handleAction(target.dataset.action);else if(target.dataset.answer!==undefined)answerQuiz(Number(target.dataset.answer));else if(target.dataset.stoneAnswer!==undefined)answerStone(Number(target.dataset.stoneAnswer));else if(target.dataset.memory!==undefined)flipMemory(Number(target.dataset.memory));else if(target.dataset.fendaAnswer!==undefined)answerFenda(Number(target.dataset.fendaAnswer));else if(target.dataset.cell!==undefined)chooseWord(target.dataset.cell);else if(target.dataset.puzzle!==undefined)movePuzzle(Number(target.dataset.puzzle));});
switchGame('quiz');