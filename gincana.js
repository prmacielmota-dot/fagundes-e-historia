/* Gincana Fagundes é História — campeonato educativo local sem cadastro. */
'use strict';
const gStages = [
 {icon:'🌿',title:'Origens de Fagundes',short:'Povos originários',kind:'quiz',end:4},
 {icon:'🏘️',title:'Primeiras moradias',short:'Montando a história',kind:'puzzle',end:8},
 {icon:'📜',title:'Ronco da Abelha',short:'Caça-palavras',kind:'words',end:12},
 {icon:'⚖️',title:'Quebra-Quilos',short:'Jogo da memória',kind:'memory',end:17},
 {icon:'🪨',title:'A pedra está baixando',short:'Desafio de perguntas',kind:'stone',end:22},
 {icon:'⛪',title:'Santo Antônio sempre volta',short:'Tradição oral',kind:'santo',end:26},
 {icon:'🚶',title:'Passagem virtual',short:'Desafio da fenda',kind:'fenda',end:31},
 {icon:'🏆',title:'Chegada à Pedra',short:'Quiz final',kind:'quizfinal',end:35}
];
const gColors=['#c83c32','#236fc5','#7d37b3','#087e51','#a45e02','#ad2763'];
const gQuestions={
 quiz:[
  {q:'Qual povo indígena integra a história mais antiga da região de Fagundes?',a:['Cariris','Incas','Maias'],c:0,e:'Os povos Cariris fazem parte da história regional.'},
  {q:'Em qual estado brasileiro fica Fagundes?',a:['Paraíba','Pernambuco','Alagoas'],c:0,e:'Fagundes fica no estado da Paraíba.'}
 ],
 stone:[
  {q:'Qual formação rochosa atrai visitantes a Fagundes?',a:['Pedra de Santo Antônio','Pão de Açúcar','Pedra da Gávea'],c:0,e:'A Pedra de Santo Antônio é um dos símbolos do turismo local.'},
  {q:'Que serra aparece na história e na paisagem da região?',a:['Serra do Bodopitá','Serra Gaúcha','Serra do Mar'],c:0,e:'A Serra do Bodopitá integra a paisagem da região.'}
 ],
 fenda:[
  {q:'O que é mais seguro ao visitar uma formação rochosa?',a:['Respeitar orientações locais','Entrar em qualquer fenda','Subir sem supervisão'],c:0,e:'A visita presencial deve seguir as orientações de segurança.'},
  {q:'A passagem virtual do jogo representa principalmente...',a:['Uma tradição popular','Uma prova obrigatória','Uma atividade que todos devem fazer'],c:0,e:'É uma representação educativa e virtual de tradições populares.'}
 ],
 santo:[
  {q:'De acordo com a tradição oral, o que acontecia com a imagem de Santo Antônio?',a:['Retornava à pedra','Desaparecia no mar','Virava uma árvore'],c:0,e:'Segundo a lenda, a imagem reaparecia junto à pedra. Uma lenda não é prova de um fato histórico.'}
 ],
 quizfinal:[
  {q:'Qual revolta questionou mudanças em pesos e medidas?',a:['Quebra-Quilos','Revolta da Chibata','Guerra dos Emboabas'],c:0,e:'O Quebra-Quilos é um movimento popular ligado à história da região.'},
  {q:'Qual movimento popular é anterior ao Quebra-Quilos?',a:['Ronco da Abelha','Revolta da Vacina','Diretas Já'],c:0,e:'O Ronco da Abelha ocorreu em 1852, antes do Quebra-Quilos de 1874.'},
  {q:'Em que ano Fagundes conquistou sua emancipação política definitiva?',a:['1961','1889','2001'],c:0,e:'O município foi criado pela Lei Estadual nº 2.661, de 22 de dezembro de 1961.'}
 ]
};
const gIcons=['🌿','🏘️','📜','⚖️','🪨','⛪','🚶','🏆'];
let gState=null;
let gCount=3;
let gDraftSchool='';let gDraftClass='';let gDraftNames={};
function gEsc(v){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function gName(i){return gState.teams[i].name;}
function gStore(){try {if(gState)sessionStorage.setItem('fagundes-gincana-2026',JSON.stringify(gState));else sessionStorage.removeItem('fagundes-gincana-2026');}catch(e){/* navegador pode bloquear armazenamento */}}
function gRestore(){if(gState)return;try{let s=JSON.parse(sessionStorage.getItem('fagundes-gincana-2026')||'null');if(s&&Array.isArray(s.teams)&&s.teams.length>=1&&s.teams.length<=6&&s.phase>=0&&s.phase<=8&&s.version===2)gState=s;}catch(e){}}
function gMakeTask(){const kind=gStages[gState.phase].kind;
 if(['quiz','quizfinal','stone','fenda','santo'].includes(kind))return {i:0,answered:false,choice:-1,correct:0,step:0};
 if(kind==='memory')return {cards:[1,2,3,1,3,2],first:-1,open:[],found:[],tries:0,locked:false};
 if(kind==='puzzle')return {cells:[2,1,4,3,6,5],first:-1,moves:0};
 if(kind==='words')return gCreateWords();
 return {};
}
function gCreateWords(){let size=9,grid=Array.from({length:size},()=>Array(size).fill(''));
 const locations={RONCO:[],CARIRI:[],SERRA:[]};
 const put=(word,r,c,dr,dc)=>{for(let j=0;j<word.length;j++){let rr=r+dr*j,cc=c+dc*j;grid[rr][cc]=word[j];locations[word].push(rr+','+cc);}};
 put('CARIRI',1,1,0,1);put('RONCO',2,8,1,0);put('SERRA',3,0,1,1);
 const letters='ABCEFGHILMNOPRSTUV';let seed=1991;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 grid.forEach(row=>row.forEach((v,j)=>{if(!v)row[j]=letters[Math.floor(rnd()*letters.length)];}));
 return {grid,locations,found:[],first:null,notice:'Toque na primeira e na última letra de cada palavra.'};
}
function gRender(){gRestore();if(!gState){gRenderSetup();return;}if(gState.phase>=gStages.length){gRenderResults();return;}
 const st=gStages[gState.phase],t=gState.teams[gState.teamIndex],task=gState.task;
 const medalTop=`<div class="g-top"><span>🏁 GINCANA DIGITAL DA CIDADE</span><span>FASE ${gState.phase+1} DE ${gStages.length}</span></div>`;
 const chips=gState.teams.map((v,i)=>`<div class="g-team-chip ${i===gState.teamIndex?'current':''}" style="--team:${gColors[i]}"><span class="g-team-dot">${i+1}</span><span>${gEsc(v.name)}</span><strong>${v.points} pts</strong></div>`).join('');
 let inner='';
 if(gState.done)inner=`<div class="g-done"><div class="g-bigicon">🌟</div><h4>${gEsc(t.name)} concluiu a fase!</h4><p>${gEsc(gState.notice)}</p><div class="g-earned">+${gState.lastPoints} pontos</div><button class="game-btn" data-gincana="continue">${gState.teamIndex===gState.teams.length-1?(gState.phase===7?'Ver a classificação 🏆':'Próxima fase →'):'Passar para a próxima equipe →'}</button></div>`;
 else if(['quiz','quizfinal','stone','fenda'].includes(st.kind))inner=gRenderQuiz(st.kind,task);
 else if(st.kind==='memory')inner=gRenderMemory(task);
 else if(st.kind==='puzzle')inner=gRenderPuzzle(task);
 else if(st.kind==='words')inner=gRenderWords(task);
 else if(st.kind==='santo')inner=gRenderSanto(task);
 stage.innerHTML=`${medalTop}<div class="g-scoreboard">${chips}</div><div class="g-heading"><div class="g-heading-icon">${st.icon}</div><div><span>É A VEZ DA EQUIPE</span><h3 style="color:${gColors[gState.teamIndex]}">${gEsc(t.name)}</h3><p>${st.title} — ${st.short}</p></div></div>${gRenderBoard()}<section class="g-challenge"><h4>${st.icon} ${st.title}</h4>${inner}</section><p class="g-privacy">Sem login • Até 6 equipes no mesmo aparelho • Resultados guardados só nesta sessão do navegador.</p><button class="g-textbutton" type="button" data-gincana="restart">Recomeçar toda a gincana</button>`;
}
function gRenderSetup(){
 let names='';for(let i=0;i<gCount;i++)names+=`<label class="g-nameitem"><span style="--team:${gColors[i]}" class="g-nameavatar">${i+1}</span><input data-gincana-name="${i}" maxlength="28" value="${gEsc(gDraftNames[i]||'')}" placeholder="Equipe ${i+1}" aria-label="Nome da equipe ${i+1}" autocomplete="off"></label>`;
 stage.innerHTML=`<div class="g-setup"><span class="g-kicker">🎉 ESCOLA • EQUIPE • AVENTURA</span><h3>Gincana Fagundes é História</h3><p>Uma competição com oito fases que reúne <strong>quiz, trilha, quebra-cabeça, caça-palavras, memória, pedra, Santo Antônio e fenda virtual</strong>. Cada grupo avança pelo caminho e acumula pontos!</p><div class="g-setup-art" aria-hidden="true"><span>🌿</span><b>➜</b><span>🏘️</span><b>➜</b><span>📜</span><b>➜</b><span>🪨</span><b>➜</b><span>🏆</span></div><div class="g-setup-fields"><label class="g-field">Nome da escola (opcional)<input id="gSchool" maxlength="85" value="${gEsc(gDraftSchool)}" placeholder="Ex.: Escola Municipal de Fagundes"></label><label class="g-field">Turma (opcional)<input id="gClass" maxlength="50" value="${gEsc(gDraftClass)}" placeholder="Ex.: 5º ano A"></label><label class="g-field">Quantidade de equipes<select id="gCount"><option value="1" ${gCount===1?'selected':''}>1 — jogo individual</option>${[2,3,4,5,6].map(n=>`<option value="${n}" ${gCount===n?'selected':''}>${n} equipes</option>`).join('')}</select></label></div><div class="g-inputnames">${names}</div><button class="game-btn g-start" data-gincana="start">🚀 Começar a gincana</button><p class="g-small">As equipes usam o mesmo celular, tablet ou computador, passando a vez. No final, cada equipe poderá baixar uma medalha em PDF. Não é necessário cadastro.</p></div>`;
}
function gRenderBoard(){const team=gState.teams[gState.teamIndex];let tiles='';
 for(let i=0;i<36;i++){
  const logicalRow=Math.floor(i/6),col=i%6;const gridCol=logicalRow%2===0?col+1:6-col;
  const gridRow=6-logicalRow;
  const players=gState.teams.map((t,k)=>t.position===i?`<span class="g-pawn ${k===gState.teamIndex?'on-turn':''}" style="--pawn:${gColors[k]}" title="${gEsc(t.name)}">${k+1}</span>`:'').join('');
  const mark=gStages.find(st=>st.end===i); const special=i===0?'🏁':i===35?'🏆':mark?.icon||((i%7===0)?'❓':'');
  const active=i===team.position;
  tiles+=`<div class="g-tile ${mark?'milestone':''} ${active?'is-active':''}" style="grid-column:${gridCol};grid-row:${gridRow}" title="Casa ${i+1}${mark?' — '+gEsc(mark.title):''}"><span class="g-tile-number">${i+1}</span><span class="g-tile-icon">${special}</span><div class="g-pawns">${players}</div></div>`;
 }
 return `<div class="g-boardbox"><div class="g-boardhead"><strong>🗺️ Trilha histórica de Fagundes</strong><span>Casa ${team.position+1} de 36</span></div><div class="g-board"><svg class="g-path" viewBox="0 0 600 600" preserveAspectRatio="none" aria-hidden="true"><path d="M50 550 H550 Q585 550 585 500 Q585 450 550 450 H50 Q15 450 15 400 Q15 350 50 350 H550 Q585 350 585 300 Q585 250 550 250 H50 Q15 250 15 200 Q15 150 50 150 H550 Q585 150 585 100 Q585 50 550 50 H50"/></svg><div class="g-cells">${tiles}</div></div><p class="g-boardhint">Pinos grandes e coloridos mostram onde cada equipe está. A cada desafio concluído, o pino avança para a próxima parte da história!</p></div>`;
}
function gGetQ(kind,task){const q=gQuestions[kind][task.i],shift=(gState.phase*2+gState.teamIndex+task.i)%3;return {...q,a:q.a.map((_,i)=>q.a[(i+shift)%3]),c:(q.c-shift+3)%3};}
function gRenderQuiz(kind,task){const list=gQuestions[kind],q=gGetQ(kind,task);let scene='';
 if(kind==='stone')scene=`<div class="g-stone-scene"><div class="g-rock" style="transform:translateY(${task.correct*34}px)">🪨</div><p>Acertos fazem a pedra baixar!</p></div>`;
 if(kind==='fenda')scene=`<div class="g-fenda-scene"><span>🪨</span><span style="transform:translateX(${task.i*48}px)">🚶</span><span>🪨</span></div><p class="g-small">Passagem apenas virtual, sem desafios físicos.</p>`;
 const options=q.a.map((a,i)=>`<button type="button" class="g-answer ${task.answered?(i===q.c?'correct':task.choice===i?'wrong':''):''}" data-gincana-answer="${i}" ${task.answered?'disabled':''}><b>${['A','B','C'][i]}</b>${gEsc(a)}</button>`).join('');
 return `<div class="g-mini">${scene}<div class="g-quiztop">Pergunta ${task.i+1} de ${list.length} • ${task.correct} acerto(s)</div><p class="g-question">${gEsc(q.q)}</p><div class="g-answers">${options}</div>${task.answered?`<div class="g-feedback">${task.choice===q.c?'✅ Resposta certa!':'💡 Vamos aprender!'} ${gEsc(q.e)}</div><button class="game-btn" data-gincana="next-answer">${task.i===list.length-1?'Concluir desafio 🌟':'Próxima pergunta →'}</button>`:''}</div>`;
}
function gRenderMemory(task){const faces=['🌿','⚖️','🪨'];let cards=task.cards.map((v,i)=>{
 const visible=task.found.includes(i)||task.open.includes(i);return `<button class="g-memory-card ${visible?'revealed':''} ${task.found.includes(i)?'paired':''}" data-gincana-flip="${i}" ${task.found.includes(i)||task.locked?'disabled':''} aria-label="Carta ${i+1}${visible?' revelada':''}">${visible?faces[v-1]:'❔'}</button>`;}).join('');
 return `<div class="g-mini"><p>Encontre os <strong>3 pares de símbolos</strong> da história de Fagundes.</p><div class="g-memorygrid">${cards}</div><p class="g-small">Pares encontrados: ${task.found.length/2} de 3 • Tentativas: ${task.tries}</p></div>`;
}
function gRenderPuzzle(task){const tiles=task.cells.map((v,i)=>`<button type="button" data-gincana-puzzle="${i}" class="g-jigsaw-tile ${task.first===i?'chosen':''}" aria-label="Peça ${v}" style="background-position:${(v-1)%3*50}% ${Math.floor((v-1)/3)*100}%"><span>${v}</span></button>`).join('');
 return `<div class="g-mini"><p>As peças representam uma ilustração da Pedra de Santo Antônio. Toque em <strong>duas peças</strong> para trocar suas posições e reconstruir a imagem.</p><div class="g-jigsaw-wrap"><div class="g-jigsaw">${tiles}</div><div class="g-jigsaw-info"><img src="assets/pedra-ilustracao.svg" alt="Imagem de referência para montar"><p>Imagem de referência</p><strong>${task.moves} movimento(s)</strong><button class="game-btn secondary" data-gincana="puzzle-help">Preciso de ajuda</button></div></div></div>`;
}
function gRenderWords(task){let s=task.grid.length;const cells=task.grid.flatMap((row,r)=>row.map((v,c)=>{let key=r+','+c;let selected=task.first===key?'selected':'';let found=task.found.some(w=>task.locations[w].includes(key))?'found':'';return `<button class="g-letter ${selected} ${found}" data-gincana-letter="${key}" aria-label="Letra ${v}, linha ${r+1} coluna ${c+1}">${v}</button>`;})).join('');
 return `<div class="g-mini"><p>Encontre <strong>CARIRI, RONCO e SERRA</strong>. Toque na primeira e na última letra para marcar.</p><div class="g-word-layout"><div class="g-letter-grid" style="grid-template-columns:repeat(${s},minmax(0,1fr))">${cells}</div><div class="g-word-info">${Object.keys(task.locations).map(w=>`<span class="${task.found.includes(w)?'done':''}">${task.found.includes(w)?'✅':'🔎'} ${w}</span>`).join('')}<p>${gEsc(task.notice)}</p><button class="game-btn secondary" data-gincana="word-help">Mostrar uma dica</button></div></div></div>`;
}
function gRenderSanto(task){let scene=`<div class="g-santo-scene"><div><span>🪨</span><small>Pedra</small></div><div class="g-santo-figure ${task.step===1?'travel':''}"><img src="assets/santo-ilustracao.svg" alt="Ilustração de Santo Antônio"></div><div><span>⛪</span><small>Capela</small></div></div>`;
 if(task.step===0)return `<div class="g-mini"><p>A tradição oral conta que uma imagem de Santo Antônio teria retornado à pedra. Vamos conhecer a lenda brincando?</p>${scene}<button class="game-btn" data-gincana="santo-move">Levar a imagem até a capela →</button></div>`;
 if(task.step===1)return `<div class="g-mini"><p>Na tradição popular, a imagem reaparece junto à pedra!</p>${scene}<button class="game-btn" data-gincana="santo-return">✨ Ver a imagem voltar à pedra</button></div>`;
 if(task.step===2)return `<div class="g-mini"><p>✨ A imagem voltou à pedra! Esta é uma história transmitida pela tradição oral.</p>${scene}<button class="game-btn" data-gincana="santo-question">Responder à pergunta final</button></div>`;
 return gRenderQuiz('santo',task);
}
function gAward(points,notice,correct=0){const t=gState.teams[gState.teamIndex];t.points+=points;t.correct+=correct;t.position=gStages[gState.phase].end;t.completed++;gState.done=true;gState.notice=notice;gState.lastPoints=points;gStore();gRender();}
function gQuizAnswer(i){if(!gState||gState.done)return;const kind=gStages[gState.phase].kind;if(!['quiz','quizfinal','stone','fenda','santo'].includes(kind))return;const task=gState.task;if(task.answered)return;const q=gGetQ(kind,task);task.answered=true;task.choice=i;if(i===q.c)task.correct++;gStore();gRender();}
function gNextAnswer(){let kind=gStages[gState.phase].kind,task=gState.task;if(!task.answered)return;task.i++;task.answered=false;task.choice=-1;const len=gQuestions[kind].length;if(task.i>=len){let pts=10+task.correct*10+(kind==='santo'?5:0);gAward(pts,`Você acertou ${task.correct} de ${len} pergunta(s)!`,task.correct);}else {gStore();gRender();}}
function gMemoryFlip(i){const t=gState.task;if(t.locked||t.found.includes(i)||t.open.includes(i))return;t.open.push(i);
 if(t.open.length===2){t.tries++;let [a,b]=t.open;
  if(t.cards[a]===t.cards[b]){t.found.push(a,b);t.open=[];if(t.found.length===6){gAward(10+Math.max(4,20-Math.max(0,t.tries-3)*3),'Você encontrou os três pares!',3);return;}}
  else {t.locked=true;gStore();gRender();const phase=gState.phase,team=gState.teamIndex;setTimeout(()=>{if(gState&&gState.phase===phase&&gState.teamIndex===team&&!gState.done){t.open=[];t.locked=false;gStore();gRender();}},750);return;}
 }gStore();gRender();}
function gPuzzlePick(i){let t=gState.task;if(t.first<0){t.first=i;gRender();return;}if(t.first===i){t.first=-1;gRender();return;}[t.cells[t.first],t.cells[i]]=[t.cells[i],t.cells[t.first]];t.moves++;t.first=-1;if(t.cells.every((x,j)=>x===j+1)){gAward(10+Math.max(6,20-t.moves*2),'Quebra-cabeça concluído!',1);return;}gStore();gRender();}
function gWordsPick(key){const t=gState.task;if(!t.first){t.first=key;t.notice='Agora toque na última letra da palavra.';gRender();return;}const start=t.first;t.first=null;const word=Object.keys(t.locations).find(w=>!t.found.includes(w)&&((t.locations[w][0]===start&&t.locations[w].at(-1)===key)||(t.locations[w][0]===key&&t.locations[w].at(-1)===start)));if(word){t.found.push(word);t.notice='Muito bem! Você encontrou '+word+'.';if(t.found.length===3){gAward(30,'Você encontrou todas as palavras!',3);return;}}else t.notice='Tente outra vez. Você consegue!';gStore();gRender();}
function gContinue(){if(!gState?.done)return;if(gState.teamIndex<gState.teams.length-1){gState.teamIndex++;}else{gState.teamIndex=0;gState.phase++;}
 if(gState.phase<gStages.length){gState.done=false;gState.task=gMakeTask();}gStore();gRender();}
function gRank(){return gState.teams.map((t,i)=>({...t,index:i})).sort((a,b)=>(b.points-a.points)||(b.correct-a.correct)||(a.index-b.index)).map((t,i,all)=>({...t,rank:all.findIndex(o=>o.points===t.points&&o.correct===t.correct)+1}));}
function gRenderResults(){const sorted=gRank();const podium=sorted.map(t=>`<div class="g-winner ${t.rank<=3?'podium':''}"><span class="g-winner-medal">${t.rank===1?'🥇':t.rank===2?'🥈':t.rank===3?'🥉':'🏅'}</span><div><strong>${gEsc(t.name)}</strong><small>${t.rank}º lugar • ${t.correct} acerto(s) • ${t.completed} fases</small></div><b>${t.points} pts</b><button class="game-btn" data-gincana-medal="${t.index}">Baixar medalha PDF</button></div>`).join('');
 stage.innerHTML=`<div class="g-resultpage"><div class="g-confetti">🏆 🎉 🥇 🎊 🥈 🥉</div><h3>A gincana chegou ao fim!</h3><p>Todos percorreram a Trilha Histórica de Fagundes. Parabéns às equipes e aos participantes!</p><div class="g-winners">${podium}</div><p class="g-small">A classificação considera a pontuação e, em caso de empate, o número de acertos. Empates completos recebem a mesma colocação. Cada equipe pode baixar a própria medalha em PDF, inclusive de participação.</p><button class="game-btn secondary" data-gincana="restart">Nova gincana</button></div>`;
}
function gStart(){const input=document.querySelector('#gCount');const n=Math.min(6,Math.max(1,Number(input?.value||3)));const names=Array.from({length:n},(_,i)=>document.querySelector(`[data-gincana-name="${i}"]`)?.value.trim().slice(0,28)||`Equipe ${i+1}`);const school=document.querySelector('#gSchool')?.value.trim().slice(0,85)||'';const className=document.querySelector('#gClass')?.value.trim().slice(0,50)||'';
 gState={version:2,teams:names.map((name,i)=>({name,points:0,correct:0,position:0,completed:0})),school,className,phase:0,teamIndex:0,done:false,task:null,lastPoints:0,notice:''};gState.task=gMakeTask();gStore();gRender();}
function gRestart(){if(gState&&!confirm('Deseja recomeçar a gincana? Os pontos atuais serão apagados deste aparelho.'))return;gState=null;gStore();gRender();}
function gSetCount(n){gCount=Math.min(6,Math.max(1,n));gRenderSetup();}
function gDrawMedal(teamIndex){const t=gState.teams[teamIndex];const rank=gRank().find(x=>x.index===teamIndex).rank;const type=rank===1?'OURO':rank===2?'PRATA':rank===3?'BRONZE':'PARTICIPAÇÃO';
 const canvas=document.createElement('canvas');canvas.width=1240;canvas.height=1754;const c=canvas.getContext('2d');
 let grad=c.createLinearGradient(0,0,1240,1754);grad.addColorStop(0,'#fffdf4');grad.addColorStop(.7,'#faf3df');grad.addColorStop(1,'#e4eacd');c.fillStyle=grad;c.fillRect(0,0,1240,1754);
 c.strokeStyle='#234b3f';c.lineWidth=20;c.strokeRect(48,48,1144,1658);c.strokeStyle='#c7a76d';c.lineWidth=5;c.strokeRect(76,76,1088,1602);
 c.fillStyle='#264e42';c.textAlign='center';c.font='bold 37px Arial';c.fillText('FAGUNDES É HISTÓRIA',620,218);
 c.font='24px Arial';c.fillText('Gincana Educativa • História e Cultura Local',620,277);
 const palette=rank===1?['#b87918','#ffe2a2']:rank===2?['#7c8c95','#e4eef3']:rank===3?['#92522d','#f5bb87']:['#306a64','#b1e1ce'];
 c.fillStyle=palette[0];c.beginPath();c.moveTo(515,450);c.lineTo(435,800);c.lineTo(560,748);c.lineTo(615,850);c.lineTo(710,748);c.lineTo(800,800);c.lineTo(715,445);c.fill();
 c.beginPath();c.arc(620,560,188,0,2*Math.PI);c.fillStyle=palette[1];c.fill();c.lineWidth=18;c.strokeStyle=palette[0];c.stroke();
 c.fillStyle='#234739';c.font='bold 115px Arial';c.fillText(rank<=3?String(rank):'★',620,580);c.font='bold 35px Arial';c.fillText(rank<=3?'º LUGAR':'PRESENÇA',620,645);
 c.font='bold 45px Arial';c.fillText(rank<=3?'MEDALHA DE '+type:'MEDALHA DE PARTICIPAÇÃO',620,945);
 const size=t.name.length>22?40:t.name.length>14?50:62;c.font=`bold ${size}px Arial`;c.fillText(t.name,620,1047);
 c.font='29px Arial';c.fillText('Por participar da Gincana Fagundes é História',620,1135);
 c.fillText('e percorrer os desafios de nossa cidade.',620,1187);
 c.fillStyle='#b47a36';c.font='bold 38px Arial';c.fillText(`${t.points} PONTOS   •   ${t.correct} ACERTOS`,620,1290);
 c.fillStyle='#234739';c.font='26px Arial';if(gState.school)c.fillText(gState.school,620,1382);if(gState.className)c.fillText('Turma: '+gState.className,620,1425);
 const date=new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'long',year:'numeric'}).format(new Date());c.fillText('Fagundes – PB  •  '+date,620,1532);
 c.fillStyle='#6d776a';c.font='22px Arial';c.fillText('Portal educativo Fagundes é História • Emissão digital',620,1630);
 return canvas;
}
function gCanvasPdf(canvas,filename){const raw=atob(canvas.toDataURL('image/jpeg',0.94).split(',')[1]);const img=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)img[i]=raw.charCodeAt(i);const enc=new TextEncoder();const chunks=[];let length=0;const push=v=>{const bytes=typeof v==='string'?enc.encode(v):v;chunks.push(bytes);length+=bytes.length;};const offs=[0];
 push('%PDF-1.4\n%âãÏÓ\n');const obj=(i,data)=>{offs[i]=length;push(`${i} 0 obj\n`);push(data);push('\nendobj\n');};
 obj(1,'<< /Type /Catalog /Pages 2 0 R >>');obj(2,'<< /Type /Pages /Kids [3 0 R] /Count 1 >>');obj(3,'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im1 4 0 R >> >> /Contents 5 0 R >>');offs[4]=length;push('4 0 obj\n<< /Type /XObject /Subtype /Image /Width 1240 /Height 1754 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length '+img.length+' >>\nstream\n');push(img);push('\nendstream\nendobj\n');const commands='q\n595 0 0 842 0 0 cm\n/Im1 Do\nQ\n';obj(5,'<< /Length '+enc.encode(commands).length+' >>\nstream\n'+commands+'endstream');const xref=length;push('xref\n0 6\n0000000000 65535 f \n');for(let i=1;i<=5;i++)push(String(offs[i]).padStart(10,'0')+' 00000 n \n');push('trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF');
 const blob=new Blob(chunks,{type:'application/pdf'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename;a.style.display='none';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);
}
function gMedal(i){if(!gState||gState.phase<8||!gState.teams[i])return;const name=gState.teams[i].name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^A-Za-z0-9_-]+/g,'-').slice(0,45);gCanvasPdf(gDrawMedal(i),`medalha-gincana-fagundes-${name||i+1}.pdf`);}
function gHandleClick(e){if(currentGame!=='gincana')return;const btn=e.target.closest('button');if(!btn||!stage.contains(btn))return;
 if(btn.dataset.gincanaMedal!==undefined){gMedal(Number(btn.dataset.gincanaMedal));return;}
 if(btn.dataset.gincanaAnswer!==undefined){gQuizAnswer(Number(btn.dataset.gincanaAnswer));return;}
 if(btn.dataset.gincanaFlip!==undefined){gMemoryFlip(Number(btn.dataset.gincanaFlip));return;}
 if(btn.dataset.gincanaPuzzle!==undefined){gPuzzlePick(Number(btn.dataset.gincanaPuzzle));return;}
 if(btn.dataset.gincanaLetter!==undefined){gWordsPick(btn.dataset.gincanaLetter);return;}
 const action=btn.dataset.gincana;switch(action){
  case 'start':gStart();break;
  case 'continue':gContinue();break;
  case 'restart':gRestart();break;
  case 'next-answer':gNextAnswer();break;
  case 'word-help':{let t=gState.task;const word=Object.keys(t.locations).find(x=>!t.found.includes(x));if(word){t.first=null;t.notice='Dica: '+word+' começa na linha '+(Number(t.locations[word][0].split(',')[0])+1)+', coluna '+(Number(t.locations[word][0].split(',')[1])+1)+'.';gRender();}break;}
  case 'puzzle-help':gAward(10,'Você avançou com a ajuda do guia!',0);break;
  case 'santo-move':gState.task.step=1;gStore();gRender();break;
  case 'santo-return':gState.task.step=2;gStore();gRender();break;
  case 'santo-question':gState.task.step=3;gStore();gRender();break;
 }}
stage.addEventListener('click',gHandleClick);
stage.addEventListener('input',e=>{if(currentGame!=='gincana'||gState)return;if(e.target.id==='gSchool')gDraftSchool=e.target.value;if(e.target.id==='gClass')gDraftClass=e.target.value;if(e.target.dataset.gincanaName!==undefined)gDraftNames[Number(e.target.dataset.gincanaName)]=e.target.value;});
stage.addEventListener('change',e=>{if(currentGame==='gincana'&&e.target?.id==='gCount')gSetCount(Number(e.target.value));});
function renderGincana(){gRender();}
// Abre a gincana na primeira visita, preservando os outros jogos no menu.
switchGame('gincana');
