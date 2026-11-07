/* Trilha Histórica de Fagundes — jogo infantil local, 2 a 6 jogadores. */
'use strict';
const trailEnd = 35;
const trailPalette = ['#e65d49','#2d7dbf','#7b59b1','#26986f','#d88924','#c04882'];
const trailCells = [
  ['🏁','PARTIDA','A aventura começa!','origens','start'],
  ['🌿','CARIRIS','Povos originários da região','origens','question'],
  ['❓','DESAFIO','O que você sabe de Fagundes?','origens','question'],
  ['🚀','AVANCE 2','Você encontrou um bom caminho!','origens','forward',2],
  ['🌳','NATUREZA','Paisagens da Serra do Bodopitá','origens','info'],
  ['❓','DESAFIO','Vamos descobrir mais um fato?','origens','question'],
  ['🌾','CANAS BRAVAS','Antiga referência ao território','povoamento','info'],
  ['📜','SESMARIAS','Terras concedidas na época colonial','povoamento','question'],
  ['🏡','PRIMEIRAS CASAS','Formação dos povoamentos','povoamento','question'],
  ['🧭','TEODÓSIO','Expansão colonial para o interior','povoamento','question'],
  ['❓','DESAFIO','Uma pergunta sobre o passado','povoamento','question'],
  ['✨','AVANCE 1','Boa descoberta!','povoamento','forward',1],
  ['🏘️','POVOADO','A comunidade foi crescendo','povoamento','info'],
  ['🔄','RECOMECE','Ops! Uma volta inesperada no caminho','povoamento','reset'],
  ['🐝','RONCO DA ABELHA','Movimento popular de 1852','revoltas','question'],
  ['📜','VOLTE 2','Decreto imperial: volte 2 casas','revoltas','back',2],
  ['❓','DESAFIO','Uma pergunta sobre o Ronco da Abelha','revoltas','question'],
  ['⭐','AVANCE 2','A turma ajudou você!','revoltas','forward',2],
  ['⏳','PASSE A VEZ','Descanse uma rodada','revoltas','skip'],
  ['🧺','FEIRA','Memórias de comércio e circulação','revoltas','info'],
  ['⚖️','QUEBRA-QUILOS','Revolta popular de 1874','revoltas','question'],
  ['❓','DESAFIO','Pesos, medidas e história','revoltas','question'],
  ['↩️','VOLTE 2','O caminho ficou mais longo!','revoltas','back',2],
  ['🎲','JOGUE DE NOVO','Você ganhou outra rodada!','revoltas','again'],
  ['📚','NOSSA HISTÓRIA','A memória da comunidade continua','cidade','question'],
  ['⛰️','BODOPITÁ','Serra e paisagens de Fagundes','cidade','question'],
  ['❓','DESAFIO','Você conhece sua cidade?','cidade','question'],
  ['✨','AVANCE 2','Um atalho entre as paisagens','cidade','forward',2],
  ['🪨','A PEDRA','Pedra de Santo Antônio','pedra','question'],
  ['⛪','A CAPELA','Religiosidade e tradição oral','pedra','question'],
  ['❓','DESAFIO','Lendas e patrimônios','pedra','question'],
  ['🌟','AVANCE 1','A pedra está mais perto!','pedra','forward',1],
  ['📖','LENDA OU FATO?','Vamos distinguir história e tradição','pedra','question'],
  ['❓','ÚLTIMO DESAFIO','O destino está próximo!','pedra','question'],
  ['↩️','VOLTE 7','A surpresa da Pedra: volte 7!','pedra','back',7],
  ['🏆','CHEGADA','Você chegou à Pedra de Santo Antônio!','pedra','finish']
].map((x,i)=>({number:i,icon:x[0],name:x[1],story:x[2],era:x[3],kind:x[4],amount:x[5]||0}));
const trailEraNames={origens:'Povos originários',povoamento:'Povoamento',revoltas:'Movimentos populares',cidade:'Nossa cidade',pedra:'Pedra de Santo Antônio'};
const trailQuestions={
origens:[
 {q:'Qual povo originário faz parte da história de Fagundes?',a:['Cariris','Guaranis','Potiguares'],c:0,tip:'Os Cariris fazem parte dos registros históricos da região.'},
 {q:'Fagundes fica em qual estado?',a:['Pernambuco','Paraíba','Rio Grande do Norte'],c:1,tip:'Fagundes é um município da Paraíba.'},
 {q:'O que já existia na região antes da colonização?',a:['A população indígena','O município emancipado','A Câmara Municipal'],c:0,tip:'Os povos indígenas habitavam a região antes da ocupação colonial.'},
 {q:'Qual destas serras está ligada a Fagundes?',a:['Serra da Ibiapaba','Serra do Bodopitá','Serra do Mar'],c:1,tip:'A Serra do Bodopitá faz parte da paisagem e da memória local.'}
],
povoamento:[
 {q:'Como o lugar era também conhecido em registros antigos?',a:['Canas Bravas','Pedras Vermelhas','Rio das Pedras'],c:0,tip:'O nome Canas Bravas aparece em narrativas históricas sobre o território.'},
 {q:'Teodósio de Oliveira Ledo aparece na história da região ligado a quê?',a:['Expansão colonial para o interior','Emancipação de 1961','Movimento Quebra-Quilos'],c:0,tip:'Ele aparece em documentos da ocupação colonial. A história também deve reconhecer a presença indígena anterior.'},
 {q:'O que são povoados?',a:['Comunidades com moradias','Terrenos sem moradores','Bairros de cidades grandes'],c:0,tip:'Com moradias e relações sociais, comunidades se formaram ao longo do tempo.'},
 {q:'Qual destes registros ajuda a estudar a formação de um lugar?',a:['Documentos e relatos','Somente fotografias','Apenas nomes de ruas'],c:0,tip:'Documentos e relatos, analisados com cuidado, ajudam a investigar o passado.'}
],
revoltas:[
 {q:'Qual movimento popular ocorreu na região em 1852?',a:['Ronco da Abelha','Quebra-Quilos','Quebra-Canos'],c:0,tip:'O Ronco da Abelha ocorreu em 1852, segundo o histórico municipal.'},
 {q:'Qual movimento ficou conhecido em 1874?',a:['Quebra-Canos','Quebra-Quilos','Ronco da Abelha'],c:1,tip:'O Quebra-Quilos teve destaque no interior paraibano em 1874.'},
 {q:'O Quebra-Quilos envolveu discussões sobre...',a:['Pesos e medidas','Registros de nascimento','Eleições municipais'],c:0,tip:'Mudanças no sistema de pesos e medidas ajudaram a provocar a revolta.'},
 {q:'No Ronco da Abelha, houve contestação a...',a:['Decretos de registro civil','Mudanças nos pesos e medidas','Organização de feiras'],c:0,tip:'Decretos imperiais sobre registros civis contribuíram para o protesto.'},
 {q:'O Ronco da Abelha aconteceu antes ou depois do Quebra-Quilos?',a:['Depois','Antes','No mesmo ano'],c:1,tip:'O Ronco da Abelha ocorreu em 1852; o Quebra-Quilos, em 1874.'}
],
cidade:[
 {q:'Em que ano ocorreu a emancipação política definitiva de Fagundes?',a:['1961','1874','1983'],c:0,tip:'A emancipação definitiva foi concedida em 22 de dezembro de 1961.'},
 {q:'Fagundes foi desmembrado de qual município?',a:['Campina Grande','Patos','Areia'],c:0,tip:'A emancipação de 1961 ocorreu por desmembramento de Campina Grande.'},
 {q:'Como é chamada a pessoa que nasce em Fagundes?',a:['Fagundense','Fagundino','Fagundiano'],c:0,tip:'O gentílico registrado pelo IBGE é fagundense.'},
 {q:'Qual destas formações naturais é conhecida em Fagundes?',a:['Serra do Bodopitá','Chapada dos Veadeiros','Serra da Mantiqueira'],c:0,tip:'A Serra do Bodopitá é parte importante da paisagem local.'}
],
pedra:[
 {q:'Qual é o nome da pedra ligada à tradição local?',a:['Pedra de Santo Antônio','Pedra do Ingá','Pedra da Boca'],c:0,tip:'A Pedra de Santo Antônio é um dos marcos de Fagundes.'},
 {q:'Na tradição oral, o que acontecia com a imagem de Santo Antônio?',a:['Voltava para a pedra','Ficava definitivamente na capela','Era enviada a outra cidade'],c:0,tip:'A narrativa popular diz que a imagem reaparecia junto à pedra. É uma lenda, não um fato comprovado.'},
 {q:'A história da imagem que volta para a pedra é apresentada como...',a:['Tradição oral','Lei municipal','Dado do censo'],c:0,tip:'Lendas e histórias orais também fazem parte da memória cultural.'},
 {q:'Onde podemos aprender sobre o patrimônio da cidade?',a:['Fotos, relatos e documentos','Somente cartões-postais','Apenas mapas'],c:0,tip:'Fontes diversas ajudam a conhecer e preservar a memória local.'},
 {q:'Qual espaço é ligado à devoção popular na Pedra de Santo Antônio?',a:['Uma capela','Uma escola','Uma prefeitura'],c:0,tip:'O lugar é associado à capela e a tradições religiosas populares.'}
]};
let trail={started:false,players:[],turn:0,phase:'setup',dice:1,notice:'',question:null,answer:null,winner:null,turnCount:1};
let trailCountDraft=3;
let trailNameDraft=[];
let trailToken=0;
const trailSleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const trailEsc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&quot;'}[c]));
function trailSetupHTML(){
 const names=Array.from({length:trailCountDraft},(_,i)=>`<label class="trail-name-label">Jogador ${i+1}<input class="trail-input" data-trilha-name="${i}" type="text" maxlength="18" autocomplete="off" placeholder="Jogador ${i+1}" value="${trailEsc(trailNameDraft[i]||'')}"></label>`).join('');
 return `<div class="trail-setup"><div class="trail-cover"><span class="trail-cover-mark">🪨</span><strong>Uma aventura pela história!</strong><p>Viaje dos povos originários até a Pedra de Santo Antônio. Responda perguntas, lance o dado e divirta-se com as surpresas.</p><img src="assets/pedra-ilustracao.svg" alt="Ilustração da Pedra de Santo Antônio"></div><div class="trail-setup-fields"><label for="trilhaPlayers">Quantos vão jogar?</label><select class="trail-input" id="trilhaPlayers" data-trilha-count>${[2,3,4,5,6].map(n=>`<option value="${n}" ${n===trailCountDraft?'selected':''}>${n} jogadores</option>`).join('')}</select><div class="trail-names">${names}</div><button class="trail-primary" type="button" data-trilha-start>🎲 Começar a aventura!</button><p class="trail-mini">👫 Cada participante tem um pino colorido e joga na sua vez, no mesmo celular, tablet ou computador. Sem cadastro.</p></div></div>`;
}
function trailBoardHTML(){
 const idx=Array.from({length:36},(_,i)=>{const row=Math.floor(i/6),col=i%6;return row%2?row*6+5-col:i;});
 return idx.map(n=>{
  const x=trailCells[n];const tokens=trail.players.map((p,i)=>p.pos===n?`<span class="trail-token" style="--token:${trailPalette[i]}" title="${trailEsc(p.name)}" aria-label="${trailEsc(p.name)} aqui">${i+1}</span>`:'').join('');
  return `<div class="trail-cell ${x.kind==='question'?'trail-question':''} ${x.kind==='finish'?'trail-finish':''}" data-era="${x.era}" data-kind="${x.kind}" title="Casa ${n}: ${trailEsc(x.name)} — ${trailEsc(x.story)}"><span class="trail-number">${n===0?'INÍCIO':n===35?'FIM':n}</span><span class="trail-emoji" aria-hidden="true">${x.icon}</span><span class="trail-cell-label">${trailEsc(x.name)}</span><span class="trail-tokens">${tokens}</span></div>`;
 }).join('');
}
function trailPlayersHTML(){
 return `<div class="trail-players" aria-label="Posição dos participantes">${trail.players.map((p,i)=>`<div class="trail-player ${trail.turn===i&&trail.phase!=='ended'?'is-turn':''}"><span class="trail-token" style="--token:${trailPalette[i]}">${i+1}</span><span class="trail-player-meta"><strong>${trailEsc(p.name)}</strong><small>Casa ${p.pos} · ⭐ ${p.stars}${p.skip?' · pausa 1 vez':''}</small></span></div>`).join('')}</div>`;
}
function trailQuestionHTML(){const q=trail.question;const chosen=trail.answer;return `<div class="trail-panel trail-quiz"><span class="trail-panel-label">❓ DESAFIO HISTÓRICO · ${trailEraNames[trail.questionEra||trailCells[trail.players[trail.turn].pos].era]}</span><h4>${trailEsc(q.q)}</h4><div class="trail-answers">${q.a.map((a,i)=>`<button type="button" data-trilha-answer="${i}" class="trail-answer ${chosen!==null?(i===q.c?'correct':i===chosen?'wrong':''):''}" ${chosen!==null?'disabled':''}><span>${'ABC'[i]}</span>${trailEsc(a)}</button>`).join('')}</div>${chosen!==null?`<div class="trail-feedback ${chosen===q.c?'good':'retry'}">${chosen===q.c?'🌟 Muito bem! Você ganhou uma estrela.':'💛 Boa tentativa! Você voltará uma casa.'}<p>${trailEsc(q.tip)}</p></div><button class="trail-primary" data-trilha-next type="button">Continuar a trilha →</button>`:''}</div>`;}
function trailPanelHTML(){
 if(trail.phase==='question')return trailQuestionHTML();
 if(trail.phase==='ended'){const winner=trail.players[trail.winner];return `<div class="trail-panel trail-win"><div class="trail-confetti" aria-hidden="true">🎉 🎉 🎉</div><span class="trail-medal">🏆</span><h4>${trailEsc(winner.name)} chegou à Pedra!</h4><p>Parabéns! Todo mundo percorreu um pouco da história de Fagundes. Que tal uma revanche?</p><button class="trail-primary" data-trilha-reset type="button">🔄 Jogar novamente</button></div>`;}
 const p=trail.players[trail.turn];
 if(trail.phase==='rolling')return `<div class="trail-panel"><span class="trail-panel-label">🎲 ${trailEsc(p.name)}</span><div class="trail-roll-effect"><span class="trail-big-dice">${trail.dice||'🎲'}</span><strong>Seu pino está andando!</strong></div><p class="trail-mini">Acompanhe o caminho das casas...</p></div>`;
 if(trail.phase==='event')return `<div class="trail-panel"><span class="trail-panel-label">✨ CASA SURPRESA</span><h4>${trailEsc(trail.notice)}</h4><p>Agora é hora de seguir a aventura.</p><button class="trail-primary" data-trilha-next type="button">Continuar →</button></div>`;
 return `<div class="trail-panel"><span class="trail-panel-label">É A VEZ DE...</span><div class="trail-turn"><span class="trail-token trail-token-big" style="--token:${trailPalette[trail.turn]}">${trail.turn+1}</span><div><h4>${trailEsc(p.name)}!</h4><p>Lance o dado e veja onde você vai parar.</p></div></div><div class="trail-dice-zone"><div class="trail-big-dice" aria-label="Último dado: ${trail.dice}">${['','⚀','⚁','⚂','⚃','⚄','⚅'][trail.dice]||'🎲'}</div><button class="trail-primary" data-trilha-roll type="button">🎲 Jogar dado</button></div><p class="trail-mini">Caia no ❓ para responder. A/B/C são as três opções, sem pegadinhas!</p></div>`;
}
function renderTrilha(){
 if(currentGame!=='trilha')return;
 if(!trail.started){stage.innerHTML=head('DESAFIO 08','Trilha Histórica de Fagundes','Um jogo de tabuleiro com perguntas e pinos que caminham pela história da cidade.','2 A 6 JOGADORES')+trailSetupHTML();return;}
 stage.innerHTML=head('DESAFIO 08','Trilha Histórica de Fagundes','Das primeiras comunidades à Pedra de Santo Antônio. O primeiro a chegar vence!','36 CASAS · SEM LOGIN')+trailPlayersHTML()+`<div class="trail-layout"><div class="trail-board-wrap"><div class="trail-board-header"><strong>🧭 O caminho da nossa história</strong><span>Início → Pedra</span></div><div class="trail-board" role="img" aria-label="Tabuleiro de 36 casas em trilha sinuosa, com os pinos coloridos dos jogadores" id="trilhaBoard">${trailBoardHTML()}</div><div class="trail-scene"><img src="assets/pedra-ilustracao.svg" alt="Representação artística da Pedra de Santo Antônio, um marco de Fagundes"><span>🏁 Meta: Pedra de Santo Antônio<br><small>Ilustração educativa do patrimônio de Fagundes</small></span></div><div class="trail-eras"><span>🌿 Povos originários</span><span>🏡 Povoamento</span><span>🐝 Revoltas</span><span>⛰️ Cidade</span><span>🪨 Pedra</span></div><p class="trail-mini">O caminho e as casas de sorte são uma brincadeira. Os acontecimentos seguem a sequência histórica local.</p></div><div class="trail-aside">${trailPanelHTML()}<div class="trail-rules"><strong>Como jogar</strong><p>🎲 Na sua vez, lance o dado. Em ❓, responda A, B ou C. Acertou? Ganhe ⭐! Errou? Volte 1 casa. Nas casas-surpresa, siga o comando. Os efeitos não se acumulam.</p><button class="trail-reset-link" type="button" data-trilha-reset>↻ Reiniciar partida</button></div></div></div>`;
}
function trailRefreshBoard(){if(currentGame!=='trilha')return;const board=stage.querySelector('#trilhaBoard');if(board)board.innerHTML=trailBoardHTML();const players=stage.querySelector('.trail-players');if(players)players.outerHTML=trailPlayersHTML();}
function trailStart(){
 const names=Array.from(stage.querySelectorAll('[data-trilha-name]')).map((input,i)=>String(input.value||'').trim().slice(0,18)||'Jogador '+(i+1));
 trail={started:true,players:names.map(name=>({name,pos:0,stars:0,skip:false})),turn:0,phase:'ready',dice:1,notice:'',question:null,answer:null,winner:null,turnCount:1,seen:{}};
 trailToken++;
 renderTrilha();
}
function trailReset(){trail={started:false,players:[],turn:0,phase:'setup',dice:1,notice:'',question:null,answer:null,winner:null,turnCount:1};trailToken++;renderTrilha();}
function trailNextPlayer(){
 for(let i=0;i<trail.players.length;i++){
  trail.turn=(trail.turn+1)%trail.players.length;
  const p=trail.players[trail.turn];
  if(p.skip){p.skip=false;continue;}
  trail.phase='ready';trail.notice='';trail.question=null;trail.answer=null;renderTrilha();return;
 }
 trail.phase='ready';renderTrilha();
}
function trailChooseQuestion(era){
 const list=trailQuestions[era];if(!trail.seen)trail.seen={};
 const unseen=list.map((x,i)=>i).filter(i=>!(trail.seen[era]||[]).includes(i));
 if(!unseen.length)trail.seen[era]=[];
 const pool=unseen.length?unseen:list.map((_,i)=>i);
 const pick=pool[Math.floor(Math.random()*pool.length)];
 (trail.seen[era] ||= []).push(pick);
 return list[pick];
}
function trailLanded(){
 const player=trail.players[trail.turn];const x=trailCells[player.pos];
 if(player.pos>=trailEnd){trail.phase='ended';trail.winner=trail.turn;renderTrilha();return;}
 if(x.kind==='question'){trail.phase='question';trail.questionEra=x.era;trail.question=trailChooseQuestion(x.era);trail.answer=null;renderTrilha();return;}
 trail.phase='event';
 if(x.kind==='forward'){player.pos=Math.min(trailEnd,player.pos+x.amount);trail.notice=x.story+' Você avançou '+x.amount+' casa'+(x.amount===1?'':'s')+'.';}
 else if(x.kind==='back'){player.pos=Math.max(0,player.pos-x.amount);trail.notice=x.story;}
 else if(x.kind==='reset'){player.pos=0;trail.notice='Seu pino voltou para a largada! Você poderá tentar novamente.';}
 else if(x.kind==='skip'){player.skip=true;trail.notice='Você vai descansar na próxima rodada.';}
 else if(x.kind==='again'){trail.notice='Sorte! Depois de continuar, você jogará mais uma vez.';trail.again=true;}
 else {trail.notice=x.story+' Vamos para a próxima vez!';}
 if(player.pos===trailEnd){trail.phase='ended';trail.winner=trail.turn;}
 renderTrilha();
}
async function trailRoll(){
 if(!trail.started||trail.phase!=='ready')return;
 const token=++trailToken;const p=trail.players[trail.turn];const result=Math.floor(Math.random()*6)+1;
 trail.phase='rolling';trail.dice=result;renderTrilha();
 await trailSleep(470);if(token!==trailToken)return;
 for(let i=0;i<result&&p.pos<trailEnd;i++){
  p.pos++;
  trailRefreshBoard();
  await trailSleep(170);
  if(token!==trailToken)return;
 }
 trailLanded();
}
function trailAnswer(i){
 if(trail.phase!=='question'||trail.answer!==null||![0,1,2].includes(i))return;
 trail.answer=i;const p=trail.players[trail.turn];
 if(i===trail.question.c)p.stars++;else p.pos=Math.max(0,p.pos-1);
 renderTrilha();
}
function trailContinue(){
 if(trail.phase==='question'&&trail.answer===null)return;
 if(!['question','event'].includes(trail.phase))return;
 if(trail.again){trail.again=false;trail.phase='ready';trail.notice='';trail.question=null;trail.answer=null;renderTrilha();return;}
 trailNextPlayer();
}
function trailSaveNames(){stage.querySelectorAll('[data-trilha-name]').forEach((input,i)=>{trailNameDraft[i]=input.value;});}
stage.addEventListener('change',ev=>{if(currentGame!=='trilha')return;if(ev.target.matches('[data-trilha-count]')){trailSaveNames();trailCountDraft=Math.min(6,Math.max(2,Number(ev.target.value)||3));renderTrilha();}});
stage.addEventListener('input',ev=>{if(currentGame!=='trilha')return;if(ev.target.matches('[data-trilha-name]'))trailNameDraft[Number(ev.target.dataset.trilhaName)]=ev.target.value;});
stage.addEventListener('click',ev=>{
 if(currentGame!=='trilha')return;
 const btn=ev.target.closest('button');if(!btn)return;
 if(btn.hasAttribute('data-trilha-start'))trailStart();
 else if(btn.hasAttribute('data-trilha-roll'))trailRoll();
 else if(btn.hasAttribute('data-trilha-answer'))trailAnswer(Number(btn.dataset.trilhaAnswer));
 else if(btn.hasAttribute('data-trilha-next'))trailContinue();
 else if(btn.hasAttribute('data-trilha-reset'))trailReset();
});