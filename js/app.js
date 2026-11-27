'use strict';
/* Se uma imagem não carregar, mostra um aviso com o nome do arquivo esperado */
function fb(img){img.style.display='none';if(img.nextElementSibling)img.nextElementSibling.style.display='grid'}
window.fb=fb;

(function(){
const $=id=>document.getElementById(id);
const $$=(s,r)=>[...(r||document).querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const rand=(a,b)=>a+Math.random()*(b-a);
function whenVisible(el,cb,opts){if(!el)return;new IntersectionObserver(es=>cb(es[0].isIntersecting),opts||{threshold:.15}).observe(el)}

/* ================= aparecer ao rolar ================= */
if(document.documentElement.classList.contains('rvon')){
  const targets=$$('.panel:not(#s0) .tile, .panel .cd, .panel .stats, .panel .lab, .panel .hl, .panel .split .lead, .panel > .lead');
  const cnt=new Map();
  targets.forEach(el=>{const p=el.parentElement,n=cnt.get(p)||0;cnt.set(p,n+1);el.style.setProperty('--d',Math.min(n*.09,.45)+'s');el.classList.add('rv')});
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1,rootMargin:'0px 0px -5% 0px'});
  targets.forEach(el=>io.observe(el));
}

/* ================= pontos numerados sobre as imagens ================= */
$$('.hsw').forEach(w=>{
  const cap=w.querySelector('.hscap'),btns=$$('.hs',w);
  if(!btns.length)return;
  let idx=-1,user=false,vis=true;
  const show=i=>{
    const b=btns[i];idx=i;
    btns.forEach((x,k)=>x.classList.toggle('on',k===i));
    if(cap)cap.innerHTML='<b>'+b.dataset.n+'</b><span>'+b.dataset.d+'</span>'+(b.dataset.go?'<a class="po sm" href="#s'+b.dataset.go+'">Ver seção →</a>':'');
  };
  btns.forEach((b,i)=>{
    const pick=()=>{user=true;show(i)};
    b.addEventListener('click',pick);b.addEventListener('mouseenter',pick);b.addEventListener('focus',pick);
  });
  if(w.hasAttribute('data-auto')&&!RM){
    whenVisible(w,v=>{vis=v});
    setInterval(()=>{if(user||!vis||document.hidden)return;show((idx+1)%btns.length)},3800);
  }
});

/* ================= TELA ================= */
const TELA=[
 '<b>Vidro protetor.</b> Aluminossilicato reforçado por troca iônica: íons de potássio, maiores, entram no lugar dos de sódio e comprimem a superfície. Uma trinca precisa vencer essa compressão para crescer. Por cima ainda há uma película que repele gordura.',
 '<b>Camada de toque.</b> Uma grade transparente de eletrodos cria um campo elétrico sobre o vidro. O dedo conduz eletricidade e altera a capacitância no cruzamento mais próximo. O chip controlador acha o centro dessa mancha e calcula a posição, centenas de vezes por segundo.',
 '<b>Painel OLED.</b> Camadas orgânicas emitem luz própria quando atravessadas por corrente (eletroluminescência). Cada subpixel vermelho, verde ou azul é controlado por um transistor fino (TFT) logo atrás. Sem luz de fundo, o preto é pixel apagado.',
 '<b>Cabo flex.</b> Película de poliimida, a cor laranja, com trilhas de cobre. Leva imagem e toque até a placa principal e dobra sem quebrar. Em muitos celulares ele se dobra por trás da tela para economizar espaço.'
];
(function(){
  const svg=$('stack');if(!svg)return;
  const names=['Vidro','Toque','OLED','Flex'],cx=215,hw=120,hh=28,th=7,ys=[10,54,98,142];
  let h='';
  for(let i=3;i>=0;i--){const y=ys[i];
    h+='<g class="ly" data-i="'+i+'">'
      +'<polygon class="sd" points="'+(cx-hw)+','+(y+hh)+' '+cx+','+(y+2*hh)+' '+(cx+hw)+','+(y+hh)+' '+(cx+hw)+','+(y+hh+th)+' '+cx+','+(y+2*hh+th)+' '+(cx-hw)+','+(y+hh+th)+'"/>'
      +'<polygon class="tp" points="'+(cx-hw)+','+(y+hh)+' '+cx+','+y+' '+(cx+hw)+','+(y+hh)+' '+cx+','+(y+2*hh)+'"/>'
      +'<line class="ld" x1="'+(cx-hw-6)+'" y1="'+(y+hh)+'" x2="'+(cx-hw-34)+'" y2="'+(y+hh)+'"/>'
      +'<text x="'+(cx-hw-40)+'" y="'+(y+hh+4)+'" text-anchor="end">'+names[i]+'</text></g>';
  }
  svg.innerHTML=h;
  const box=$('boxTela'),btns=$$('#segTela button'),lys=$$('.ly',svg);
  let user=false,vis=false,cur=0;
  function tab(i,auto){
    if(!auto)user=true;cur=i;
    btns.forEach((b,k)=>b.classList.toggle('on',k===i));
    lys.forEach(l=>l.classList.toggle('on',+l.dataset.i===i));
    box.innerHTML=TELA[i];box.style.animation='none';void box.offsetHeight;box.style.animation='';
  }
  btns.forEach((b,i)=>b.onclick=()=>tab(i));
  lys.forEach(l=>l.addEventListener('click',()=>tab(+l.dataset.i)));
  tab(0,true);
  whenVisible(svg,v=>{vis=v});
  if(!RM)setInterval(()=>{if(user||!vis)return;tab((cur+1)%4,true)},4200);
})();

/* grade de toque */
(function(){
  const g=$('tg');if(!g)return;
  const C=12,R=8,cells=[];
  for(let j=0;j<R;j++)for(let i=0;i<C;i++){const c=document.createElement('i');g.appendChild(c);cells.push(c)}
  const fg=document.createElement('div');fg.className='fg';g.appendChild(fg);
  const out=$('tgOut');let last=-9999,vis=false;
  function set(x,y){
    let best=0,bi=0,bj=0;
    for(let j=0;j<R;j++)for(let i=0;i<C;i++){
      const v=Math.max(0,1-Math.hypot(i+.5-x,j+.5-y)/2.4);
      cells[j*C+i].style.setProperty('--v',v.toFixed(3));
      if(v>best){best=v;bi=i;bj=j}
    }
    fg.style.left=(x/C*100)+'%';fg.style.top=(y/R*100)+'%';
    out.textContent='Cruzamento mais afetado: coluna '+(bi+1)+', linha '+(bj+1)+' · capacitância −'+Math.round(best*42)+'%';
  }
  function ev(e){
    const r=g.getBoundingClientRect();
    last=performance.now();g.classList.add('act');
    set(clamp((e.clientX-r.left)/r.width*C,0,C),clamp((e.clientY-r.top)/r.height*R,0,R));
  }
  g.addEventListener('pointermove',ev);g.addEventListener('pointerdown',ev);
  g.addEventListener('pointerleave',()=>{last=performance.now()});
  whenVisible(g,v=>{vis=v});
  (function loop(t){
    requestAnimationFrame(loop);
    if(!vis||RM||t-last<2500)return;
    const s=t/1000;g.classList.add('act');
    set(C/2+Math.sin(s*.9)*C*.38,R/2+Math.sin(s*1.7+1)*R*.32);
  })(0);
})();

/* misturador de cores */
(function(){
  const r=$('rR'),g=$('rG'),b=$('rB');if(!r)return;
  const sw=$('sw'),px=$('px'),hint=$('rgbHint');
  for(let i=0;i<8;i++){const c=document.createElement('b');c.innerHTML='<i></i><i></i><i></i>';px.appendChild(c)}
  function msg(R,G,B){
    const mx=Math.max(R,G,B),mn=Math.min(R,G,B);
    if(mx<18)return 'Preto: os três subpixels apagados. No OLED isso gasta quase 0 W.';
    if(mn>235)return 'Branco: os três subpixels no máximo. É quando o OLED mais gasta energia.';
    if(R>200&&G>170&&B<90)return 'Amarelo = vermelho + verde. Não existe subpixel amarelo: seus olhos misturam os dois.';
    if(G>150&&B>150&&R<80)return 'Ciano = verde + azul. Também não há subpixel ciano.';
    if(mx-mn<25)return 'Cinza: os três subpixels acesos com a mesma intensidade, só que mais fracos.';
    return 'Os subpixels são pequenos demais para ver separados. Seus olhos misturam as três luzes vizinhas e percebem uma cor só.';
  }
  function upd(){
    const R=+r.value,G=+g.value,B=+b.value;
    sw.style.background='rgb('+R+','+G+','+B+')';
    px.style.setProperty('--r',R);px.style.setProperty('--g',G);px.style.setProperty('--b',B);
    $('vR').textContent=R;$('vG').textContent=G;$('vB').textContent=B;
    hint.textContent=msg(R,G,B);
  }
  [r,g,b].forEach(x=>x.addEventListener('input',upd));
  $$('#rgbPre button').forEach(bt=>bt.onclick=()=>{const c=bt.dataset.c.split(',');r.value=c[0];g.value=c[1];b.value=c[2];upd()});
  upd();
})();

/* taxa de atualização */
(function(){
  const box=$('rf'),ball=$('rfb'),out=$('hzOut');if(!box)return;
  if(RM){out.textContent='Animação desativada pela preferência de movimento reduzido do sistema.';return}
  let hz=60,p=0,dir=1,lastU=0,vis=false,cnt=0,t0=performance.now();
  out.textContent='Atualizando 60 vezes por segundo';
  whenVisible(box,v=>{vis=v});
  $$('#segHz button').forEach(b=>b.onclick=()=>{$$('#segHz button').forEach(x=>x.classList.remove('on'));b.classList.add('on');hz=+b.dataset.h});
  (function loop(t){
    requestAnimationFrame(loop);
    if(!vis)return;
    if(t-lastU>=1000/hz-2){
      const dt=Math.min(t-lastU,100);lastU=t;cnt++;
      p+=dir*dt/1500;
      if(p>=1){p=1;dir=-1}else if(p<=0){p=0;dir=1}
      ball.style.left=(p*(box.clientWidth-30))+'px';
    }
    if(t-t0>=1000){out.textContent='Atualizando '+hz+' vezes por segundo (medido aqui: '+cnt+')';cnt=0;t0=t}
  })(0);
})();

/* ================= CÂMERA ================= */
(function(){ /* balde de luz */
  const s=$('lux');if(!s)return;
  const rain=$('rain'),fill=$('bkf'),bk=$('bk'),out=$('luxOut'),N=18;
  for(let i=0;i<N;i++){const d=document.createElement('i');d.style.left=(4+i*(142/N))+'px';d.style.animationDelay='-'+rand(0,1.2).toFixed(2)+'s';d.style.animationDuration=rand(.9,1.5).toFixed(2)+'s';rain.appendChild(d)}
  function upd(){
    const v=+s.value,n=Math.round(v/100*N);
    [...rain.children].forEach((d,k)=>{d.style.visibility=k<n?'visible':'hidden'});
    fill.style.height=v+'%';bk.classList.toggle('sat',v>=98);
    const e=Math.round(v/100*500)*10,adc=Math.round(v/100*1023);
    out.textContent=v>=98?'Estourou! Pixel saturado: branco puro (1023).':v<=3?'Quase escuro: sobra só o ruído do sensor ('+adc+').':'≈ '+e.toLocaleString('pt-BR')+' elétrons guardados → número '+adc+' de 1023';
  }
  s.addEventListener('input',upd);upd();
})();

(function(){ /* mosaico Bayer e demosaico */
  const cF=$('cvF'),cM=$('cvM');if(!cF)return;
  const W=32,H=24;
  function scene(x,y){
    const hill=16.4+Math.sin(x*.45)*1.5+Math.sin(x*.17+1)*1.3;
    let r,g,b;
    if(y>hill){const k=y-hill;r=20+k*2.2;g=34+k*3;b=44+k*2}
    else{
      const t=clamp(y/hill,0,1);r=35+220*t*t;g=55+95*t;b=140-70*t;
      const d=Math.hypot(x-22,y-13.2);
      if(d<4.4){const m=clamp(1-(d-3)/1.4,0,1);r+=(255-r)*m;g+=(236-g)*m;b+=(170-b)*m}
    }
    return [r,g,b].map(v=>clamp(Math.round(v),0,255));
  }
  const ch=(x,y)=>(y%2===0)?(x%2===0?0:1):(x%2===0?1:2);
  const S=[];for(let y=0;y<H;y++){S[y]=[];for(let x=0;x<W;x++)S[y][x]=scene(x,y)[ch(x,y)]}
  const mo=cM.getContext('2d').createImageData(W,H),fi=cF.getContext('2d').createImageData(W,H);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const c=ch(x,y),k=(y*W+x)*4;
    mo.data[k]=mo.data[k+1]=mo.data[k+2]=0;mo.data[k+c]=S[y][x];mo.data[k+3]=255;
    for(let q=0;q<3;q++){
      let v;
      if(q===c)v=S[y][x];
      else{let sum=0,n=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=W||yy>=H)continue;if(ch(xx,yy)===q){sum+=S[yy][xx];n++}}v=n?sum/n:0}
      fi.data[k+q]=v;
    }
    fi.data[k+3]=255;
  }
  cM.getContext('2d').putImageData(mo,0,0);cF.getContext('2d').putImageData(fi,0,0);
  const out=$('bayOut'),btns=$$('#segBay button');let user=false,done=false;
  function set(m){
    cM.classList.toggle('off',m==='f');
    btns.forEach(b=>b.classList.toggle('on',b.dataset.m===m));
    out.textContent=m==='f'?'O processador estimou as 2 cores que faltavam em cada pixel e a foto voltou ao normal.':'Cada quadradinho mede só uma cor: é um mosaico de vermelho, verde e azul.';
  }
  btns.forEach(b=>b.onclick=()=>{user=true;set(b.dataset.m)});
  set('m');
  whenVisible(cF,v=>{if(v&&!done&&!user){done=true;setTimeout(()=>{if(!user)set('f')},2400)}},{threshold:.5});
})();

/* ================= CHIPS ================= */
(function(){ /* bits que mudam */
  const bits=$('bits');if(!bits)return;
  if(!RM)setInterval(()=>{let s='';for(let i=0;i<3;i++){let b='';for(let j=0;j<8;j++)b+=Math.random()>.5?1:0;s+=b+' '}bits.textContent=s},800);
})();

(function(){ /* transistor */
  const svg=$('tr');if(!svg)return;
  const btn=$('gateBtn'),txt=$('trTxt'),out=$('trOut');let on=false,user=false,vis=false;
  function set(v,auto){
    if(!auto)user=true;on=v;svg.classList.toggle('on',on);out.textContent=on?'1':'0';
    btn.setAttribute('aria-pressed',on);btn.textContent=on?'Tirar a tensão da porta':'Aplicar tensão na porta';
    txt.textContent=on?'Porta com tensão: canal aberto, a corrente passa, saída 1.':'Porta sem tensão: circuito aberto, saída 0.';
  }
  btn.onclick=()=>set(!on);svg.addEventListener('click',()=>set(!on));
  whenVisible(svg,v=>{vis=v});
  if(!RM)setInterval(()=>{if(!user&&vis)set(!on,true)},2600);
})();

(function(){ /* somador de 4 bits */
  const bts=$$('.bt[data-r]');if(!bts.length)return;
  const A=[0,0,0,0],B=[0,0,0,0];
  const val=a=>a[0]+a[1]*2+a[2]*4+a[3]*8;
  function upd(){
    const a=val(A),b=val(B),s=a+b;
    bts.forEach(x=>{const v=(x.dataset.r==='a'?A:B)[+x.dataset.k];x.textContent=v;x.classList.toggle('on',!!v)});
    $('decA').textContent=a;$('decB').textContent=b;$('decS').textContent=s;
    for(let k=0;k<5;k++){const e=$('rs'+k),v=(s>>k)&1;e.textContent=v;e.classList.toggle('on',!!v)}
    $('addOut').textContent=a+' + '+b+' = '+s+'  ·  '+a.toString(2).padStart(4,'0')+' + '+b.toString(2).padStart(4,'0')+' = '+s.toString(2).padStart(5,'0');
  }
  bts.forEach(x=>x.onclick=()=>{(x.dataset.r==='a'?A:B)[+x.dataset.k]^=1;upd()});
  $('addRnd').onclick=()=>{for(let k=0;k<4;k++){A[k]=Math.random()<.5?1:0;B[k]=Math.random()<.5?1:0}upd()};
  A[0]=1;A[2]=1;B[0]=1;B[1]=1;upd();
})();

(function(){ /* pirâmide de memória */
  const mh=$('mh');if(!mh)return;
  let done=false;
  whenVisible(mh,v=>{if(v&&!done){done=true;$$('i',mh).forEach(i=>{i.style.width=i.dataset.w+'%'})}},{threshold:.4});
})();

/* ================= BATERIA ================= */
(function(){
  const bsv=$('bsv'),bwl=$('bwl');if(!bsv)return;
  $$('#segBat button').forEach(b=>b.onclick=()=>{
    $$('#segBat button').forEach(x=>x.classList.remove('on'));b.classList.add('on');
    const c=b.dataset.m==='chg';bsv.classList.toggle('chg',c);
    bwl.textContent=c?'CARREGADOR EMPURRA A CORRENTE':'APARELHO CONSOME A CORRENTE';
  });
  const cap=$('cap'),dr=$('drBar');let W=1.5;
  function fmtH(h){
    if(h>=48)return '≈ '+Math.round(h/24)+' dias';
    const hh=Math.floor(h),mm=Math.round((h-hh)*60);
    return hh>0?hh+' h'+(mm?' '+mm+' min':''):mm+' min';
  }
  function calc(){
    const v=+cap.value,e=v/1000*3.87,h=e/W;
    $('mah').textContent=v+' mAh';
    $('wh').textContent=e.toFixed(2).replace('.',',')+' Wh';
    $('bbar').style.width=((v-2000)/4000*90+10)+'%';
    $('hrs').textContent=fmtH(h)+' · '+String(W).replace('.',',')+' W';
    dr.style.setProperty('--dr',clamp(1.5+Math.log10(h+1)*3.2,1.8,9).toFixed(1)+'s');
  }
  cap.oninput=calc;
  $$('#segUse button').forEach(b=>b.onclick=()=>{$$('#segUse button').forEach(x=>x.classList.remove('on'));b.classList.add('on');W=+b.dataset.w;calc()});
  calc();
})();

/* ================= SOM ================= */
(function(){
  const cv=$('osc');if(!cv)return;
  const g2=cv.getContext('2d');
  const fr=$('fr'),vol=$('vol'),frO=$('frO'),volO=$('volO'),tb=$('toneBtn'),mb=$('micBtn'),out=$('sndOut'),lvl=$('lvl'),spk=$('spk'),cap=$('spkCap');
  let ac=null,anT=null,anM=null,osc=null,gn=null,ms=null,msrc=null,mode='idle',vis=false,dpr=1,bufT=null,bufF=null,lastTxt=0;
  const SPK_IDLE=cap.textContent;
  const volGain=()=>(+vol.value/100)*.3;
  function size(){dpr=Math.min(2,devicePixelRatio||1);cv.width=Math.round(cv.clientWidth*dpr);cv.height=Math.round(cv.clientHeight*dpr)}
  size();addEventListener('resize',size);
  function ensure(){
    if(!ac){
      const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;
      ac=new AC();
      anT=ac.createAnalyser();anT.fftSize=2048;anT.connect(ac.destination);
      anM=ac.createAnalyser();anM.fftSize=2048;
      bufT=new Uint8Array(2048);bufF=new Uint8Array(1024);
    }
    if(ac.state==='suspended')ac.resume();
    return true;
  }
  function descr(f){return f+' Hz: '+(f<250?'som grave':f<1000?'faixa da voz humana':f<2000?'médio-agudo':'agudo')+'. A membrana vai e volta a cada '+(1000/f).toFixed(2).replace('.',',')+' ms.'}
  function setT(){spk.style.setProperty('--T',clamp(110/(+fr.value),.07,1.2).toFixed(3)+'s')}
  function stopAll(){
    if(osc){
      const o=osc,g=gn;
      try{g.gain.cancelScheduledValues(ac.currentTime);g.gain.setTargetAtTime(0,ac.currentTime,.02);o.stop(ac.currentTime+.12)}catch(e){}
      setTimeout(()=>{try{o.disconnect();g.disconnect()}catch(e){}},250);
      osc=null;gn=null;
    }
    if(ms){ms.getTracks().forEach(t=>t.stop());ms=null;try{msrc.disconnect()}catch(e){}msrc=null}
    mode='idle';
  }
  function ui(){
    tb.textContent=mode==='tone'?'■ Parar tom':'▶ Tocar tom';
    mb.textContent=mode==='mic'?'■ Parar microfone':'◉ Testar meu microfone';
    spk.classList.toggle('run',mode!=='idle');spk.classList.toggle('mic',mode==='mic');
    if(mode==='idle'){out.textContent='Comece com o volume baixo do aparelho. A onda abaixo é uma prévia do tom escolhido.';cap.textContent=SPK_IDLE;lvl.style.width='0'}
    else if(mode==='tone'){out.textContent=descr(+fr.value);cap.textContent='O sinal elétrico faz a bobina ir e voltar, e a membrana empurra o ar na mesma frequência. Aqui em câmera lenta.'}
    else{out.textContent='Fale, assobie ou bata palmas. Nada é gravado nem enviado.';cap.textContent='O som faz a membrana vibrar e a capacitância mudar. O chip transforma isso em números. Quanto mais forte o som, maior a vibração.'}
    setT();
  }
  function tone(){
    if(!ensure()){out.textContent='Seu navegador não permite gerar som aqui.';return}
    stopAll();
    osc=ac.createOscillator();gn=ac.createGain();osc.type='sine';osc.frequency.value=+fr.value;gn.gain.value=0;
    osc.connect(gn);gn.connect(anT);osc.start();
    gn.gain.setTargetAtTime(volGain(),ac.currentTime,.05);
    mode='tone';ui();
  }
  async function mic(){
    if(!ensure())return;
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){out.textContent='Este navegador ou endereço não libera o microfone. Tente o Chrome ou um endereço https.';return}
    stopAll();
    try{ms=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false}})}
    catch(e){out.textContent=(e&&e.name==='NotAllowedError')?'Permissão do microfone negada. Libere nas configurações do navegador para testar.':'Não encontrei um microfone disponível.';ui();return}
    msrc=ac.createMediaStreamSource(ms);msrc.connect(anM);mode='mic';ui();
  }
  tb.onclick=()=>{if(mode==='tone'){stopAll();ui()}else tone()};
  mb.onclick=()=>{if(mode==='mic'){stopAll();ui()}else mic()};
  fr.oninput=()=>{
    const f=+fr.value;frO.textContent=f+' Hz';
    if(osc)osc.frequency.setTargetAtTime(f,ac.currentTime,.02);
    setT();if(mode!=='mic')out.textContent=mode==='tone'?descr(f):descr(f);
  };
  vol.oninput=()=>{volO.textContent=vol.value+'%';if(gn)gn.gain.setTargetAtTime(volGain(),ac.currentTime,.03)};
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode!=='idle'){stopAll();ui()}});
  whenVisible(cv,v=>{vis=v},{threshold:.01});
  setT();ui();

  function grid(W,H){
    g2.strokeStyle='rgba(255,255,255,.08)';g2.lineWidth=dpr;g2.beginPath();
    for(let i=1;i<8;i++){const x=W*i/8;g2.moveTo(x,0);g2.lineTo(x,H)}
    for(let i=1;i<4;i++){const y=H*i/4;g2.moveTo(0,y);g2.lineTo(W,y)}
    g2.stroke();
  }
  (function draw(){
    requestAnimationFrame(draw);
    if(!vis)return;
    if(cv.width!==Math.round(cv.clientWidth*dpr)||cv.height!==Math.round(cv.clientHeight*dpr))size();
    const W=cv.width,H=cv.height;if(!W||!H)return;
    g2.fillStyle='#0b0c0f';g2.fillRect(0,0,W,H);grid(W,H);
    g2.lineWidth=2*dpr;g2.lineJoin='round';g2.beginPath();
    if(mode==='idle'){
      const per=clamp((+fr.value)/110,1,18),a=(+vol.value/100)*.7+.1;
      g2.strokeStyle='rgba(255,255,255,.45)';g2.setLineDash([6*dpr,6*dpr]);
      for(let x=0;x<=W;x+=2){const y=H/2-Math.sin(x/W*per*Math.PI*2)*a*H/2;x?g2.lineTo(x,y):g2.moveTo(x,y)}
      g2.stroke();g2.setLineDash([]);return;
    }
    const an=mode==='tone'?anT:anM;
    an.getByteTimeDomainData(bufT);
    let s0=0;for(let i=1;i<1024;i++){if(bufT[i-1]<128&&bufT[i]>=128){s0=i;break}}
    let N=mode==='tone'?clamp(Math.round(ac.sampleRate/(+fr.value)*3.5),128,1024):1024;
    N=Math.min(N,2047-s0);
    let peak=0,sq=0;for(let i=0;i<1024;i++){const v=(bufT[i]-128)/128;sq+=v*v;if(Math.abs(v)>peak)peak=Math.abs(v)}
    const rms=Math.sqrt(sq/1024);
    const k=mode==='tone'?1/.3:clamp(.6/Math.max(peak,.02),1,25);
    g2.strokeStyle='#fff';
    for(let i=0;i<N;i++){const x=i/(N-1)*W,y=H/2-clamp((bufT[s0+i]-128)/128*k,-1,1)*H*.45;i?g2.lineTo(x,y):g2.moveTo(x,y)}
    g2.stroke();
    if(mode==='mic'){
      lvl.style.width=clamp(rms*450,0,100)+'%';
      spk.style.setProperty('--amp',clamp(rms*9,.08,1).toFixed(2));
      const now=performance.now();
      if(now-lastTxt>250){
        lastTxt=now;anM.getByteFrequencyData(bufF);
        const bh=ac.sampleRate/2048;let bi=0,bv=0;
        for(let i=Math.ceil(60/bh);i<=Math.floor(4000/bh);i++){if(bufF[i]>bv){bv=bufF[i];bi=i}}
        out.textContent=(rms>.012&&bv>110)?'Frequência dominante ≈ '+Math.round(bi*bh)+' Hz · nível '+Math.round(clamp(rms*450,0,100))+'%':'Silêncio. Fale, assobie ou bata palmas.';
      }
    }
  })();
})();

/* ================= MÚSICA DE FUNDO =================
   1) Se houver arquivos na pasta music/ (musica.mp3, musica2.mp3...), toca os seus, em loop.
   2) Se a pasta estiver vazia, usa uma música calma sintetizada no navegador (reserva). */
const Music=(()=>{
  let ctx=null,master,bus,timer=null,on=false,lv=.16,step=0;const cbs=[];
  const CH=[[130.81,261.63,329.63,392,493.88],[110,220,261.63,329.63,392],[87.31,174.61,220,261.63,329.63],[98,196,246.94,293.66,329.63]];
  const BELL=[523.25,587.33,659.25,783.99,880,1046.5];
  const emit=()=>cbs.forEach(f=>f(on));
  function init(){
    ctx=new(window.AudioContext||window.webkitAudioContext)();
    master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);
    bus=ctx.createBiquadFilter();bus.type='lowpass';bus.frequency.value=1800;
    const dry=ctx.createGain();dry.gain.value=.55;const wet=ctx.createGain();wet.gain.value=.7;
    const conv=ctx.createConvolver();const len=Math.floor(ctx.sampleRate*3.5);const b=ctx.createBuffer(2,len,ctx.sampleRate);
    for(let c=0;c<2;c++){const d=b.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6)}
    conv.buffer=b;bus.connect(dry);bus.connect(conv);conv.connect(wet);dry.connect(master);wet.connect(master);
  }
  function tone(f,t,dur,peak,type,att,rel){
    const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=f;o.detune.value=(Math.random()-.5)*10;
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+att);g.gain.setValueAtTime(peak,t+dur-rel);g.gain.linearRampToValueAtTime(0,t+dur);
    o.connect(g);g.connect(bus);o.start(t);o.stop(t+dur+.1);
  }
  function chord(){
    const t=ctx.currentTime+.05,c=CH[step%CH.length];step++;
    c.forEach((f,i)=>{tone(f,t,10,i===0?.09:.045,i===0?'sine':'triangle',3,4);tone(f*1.003,t,10,.02,'sine',3.5,4)});
    const n=2+Math.floor(Math.random()*2);
    for(let k=0;k<n;k++){
      const bt=t+1.5+Math.random()*5.5,f=BELL[Math.floor(Math.random()*BELL.length)];
      const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=f;
      g.gain.setValueAtTime(0,bt);g.gain.linearRampToValueAtTime(.05,bt+.03);g.gain.exponentialRampToValueAtTime(.0001,bt+3.5);
      o.connect(g);g.connect(bus);o.start(bt);o.stop(bt+3.6);
    }
  }
  /* ---- músicas do usuário (pasta music/) ---- */
  const BASES=['musica','musica2','musica3','musica4','musica5','musica6'],EXTS=['mp3','m4a','ogg','wav','aac','flac'];
  let tracks=[],ti=0,el=null,fade=null,mode='';
  const mapv=v=>Math.min(1,v*2.5);            /* volume do arquivo a partir do nível (.16 leitura, .05 narração) */
  function probe(u){return new Promise(res=>{const a=new Audio();let d=false;
    const end=ok=>{if(d)return;d=true;a.onloadedmetadata=a.onerror=null;a.removeAttribute('src');try{a.load()}catch(e){}res(ok)};
    a.preload='metadata';a.onloadedmetadata=()=>end(true);a.onerror=()=>end(false);setTimeout(()=>end(false),2500);a.src=u})}
  async function scan(){
    for(let i=0;i<BASES.length;i++){let f=null;
      for(const x of EXTS){const u='music/'+BASES[i]+'.'+x;if(await probe(u)){f=u;break}}
      if(f)tracks.push(f);else if(i>0)break;}
  }
  const ready=scan();
  function fadeTo(v,ms){clearInterval(fade);if(!el)return;const from=el.volume,t0=performance.now();
    fade=setInterval(()=>{const k=Math.min(1,(performance.now()-t0)/ms);el.volume=Math.max(0,Math.min(1,from+(v-from)*k));if(k>=1){clearInterval(fade);if(v===0)el.pause()}},50)}
  function fileStart(){
    if(!el){el=new Audio();el.preload='auto';
      el.addEventListener('ended',()=>{if(tracks.length>1){ti=(ti+1)%tracks.length;el.src=tracks[ti];el.play().catch(()=>{})}});
      el.addEventListener('error',()=>{tracks.splice(ti,1);
        if(tracks.length){ti%=tracks.length;el.src=tracks[ti];el.play().catch(()=>{})}
        else if(on){on=false;mode='';if(synthStart())emit()}});
    }
    el.loop=tracks.length===1;
    if(!el.getAttribute('src'))el.src=tracks[ti];
    mode='arquivo';on=true;clearInterval(fade);el.volume=0;
    el.play().then(()=>fadeTo(mapv(lv),1500)).catch(()=>{on=false;mode='';emit()});
  }
  /* ---- música sintetizada (reserva) ---- */
  function synthStart(){
    try{if(!ctx)init();ctx.resume()}catch(e){return false}
    on=true;mode='sintetizada';master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setTargetAtTime(lv,ctx.currentTime,1.2);
    chord();timer=setInterval(chord,8000);return true;
  }
  function start(){if(on)return;if(tracks.length)fileStart();else if(!synthStart())return;emit()}
  function stop(){if(!on)return;on=false;
    if(mode==='arquivo')fadeTo(0,600);
    else{clearInterval(timer);master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setTargetAtTime(0,ctx.currentTime,.6)}
    emit()}
  function level(v){lv=v;if(!on)return;if(mode==='arquivo')fadeTo(mapv(v),500);else master.gain.setTargetAtTime(lv,ctx.currentTime,.5)}
  return{start,stop,level,ready,toggle:()=>on?stop():start(),get on(){return on},get source(){return on?mode:(tracks.length?'arquivo':'sintetizada')},get tracks(){return tracks.slice()},onchange:f=>cbs.push(f)};
})();
window.Music=Music;

/* ================= TOUR / NARRAÇÃO ================= */
const Tour=(()=>{
  const S=ROTEIRO,N=S.length;
  const panels=S.map((_,i)=>$('s'+i));
  const pp=$('pp'),ppi=$('ppi'),dstep=$('dstep'),dtitle=$('dtitle'),dcap=$('dcap'),dfill=$('dfill'),dots=$('dots'),dock=$('dock'),spd=$('spd'),spdv=$('spdv');
  const PLAY='<path d="M7 4l13 8-13 8z"/>',PAUSE='<path d="M6 4h4v16H6zM14 4h4v16h-4z"/>';
  const RATES=[0.8,1,1.25,1.5,1.75,2];
  let cur=-1,playing=false,mode=null,prog=0,ri=1,rate=1,token=0,lock=0,cc=true,readMode=false;
  const audio=new Audio();audio.preload='auto';
  let voice=null,sents=[],sidx=0;
  dstep.textContent='Narração guiada · '+N+' partes';

  S.forEach((s,i)=>{const b=document.createElement('button');b.textContent=(i+1)+' · '+s.titulo;b.setAttribute('aria-label','Ir para a parte '+(i+1)+': '+s.titulo);b.onclick=()=>goTo(i,true);dots.appendChild(b)});

  function pickVoice(){const v=speechSynthesis.getVoices();voice=v.find(x=>/pt-BR/i.test(x.lang)&&/google|natural|luciana|francisca|maria/i.test(x.name))||v.find(x=>/pt-BR/i.test(x.lang))||v.find(x=>/^pt/i.test(x.lang))||null}
  if('speechSynthesis' in window){pickVoice();speechSynthesis.onvoiceschanged=pickVoice}

  function ui(){
    ppi.innerHTML=playing?PAUSE:PLAY;pp.setAttribute('aria-label',playing?'Pausar narração':'Reproduzir narração');
    document.body.classList.toggle('tour',playing&&cur>=0);
    panels.forEach((p,i)=>p.classList.toggle('active',i===cur));
    [...dots.children].forEach((d,i)=>d.classList.toggle('on',i===cur));
    if(cur>=0){dstep.textContent='Parte '+(cur+1)+' de '+N;dtitle.textContent=S[cur].titulo}
  }
  function setProg(p){
    prog=Math.max(0,Math.min(1,p));dfill.style.width=(prog*100)+'%';
    if(cur>=0){const b=panels[cur].querySelector('.foot b');if(b)b.style.width=Math.max(90,prog*panels[cur].clientWidth*.9)+'px'}
  }
  function resetBars(){$$('.foot b').forEach(b=>{b.style.width='90px'})}
  function stopSound(){token++;audio.pause();audio.onended=audio.onerror=audio.ontimeupdate=null;try{speechSynthesis.cancel()}catch(e){}}

  function split(t){return t.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g).map(s=>s.trim()).filter(Boolean)}
  function speakFrom(i,from){
    if(!('speechSynthesis' in window)){dcap.textContent='Seu navegador não tem voz sintética. Adicione os arquivos de áudio.';playing=false;ui();return}
    const tok=++token;mode='tts';sents=split(S[i].texto);sidx=from||0;
    const next=()=>{
      if(tok!==token)return;
      if(sidx>=sents.length){finish();return}
      const u=new SpeechSynthesisUtterance(sents[sidx]);u.lang='pt-BR';if(voice)u.voice=voice;u.rate=rate;
      dcap.textContent=cc?sents[sidx]:'';setProg(sidx/sents.length);
      const done=e=>{if(tok!==token)return;if(e&&(e.error==='interrupted'||e.error==='canceled'))return;sidx++;next()};
      u.onend=()=>done();u.onerror=done;speechSynthesis.speak(u);
    };
    speechSynthesis.cancel();next();
  }
  function playFile(i){
    const tok=++token;mode='file';dcap.textContent='';
    audio.onerror=()=>{if(tok===token)speakFrom(i,0)};
    audio.onended=()=>{if(tok===token)finish()};
    audio.ontimeupdate=()=>{if(tok===token&&audio.duration)setProg(audio.currentTime/audio.duration)};
    audio.src=S[i].audio;audio.defaultPlaybackRate=rate;audio.playbackRate=rate;
    audio.play().catch(err=>{if(tok!==token)return;if(err&&err.name==='NotAllowedError'){playing=false;ui()}else speakFrom(i,0)});
  }
  function start(i){readMode=false;Music.level(.05);stopSound();setProg(0);playFile(i)}
  function finish(){
    if(cur===0){playing=false;setProg(1);dcap.textContent='';ui();openModal();return}
    if(cur<N-1){goTo(cur+1,true)}else{playing=false;setProg(1);dcap.textContent='';ui()}
  }
  function goTo(i,auto){
    i=Math.max(0,Math.min(N-1,i));cur=i;lock=0;resetBars();setProg(0);
    if(auto){playing=true;ui();start(i)}
    else{stopSound();playing=false;ui();panels[i].scrollIntoView({behavior:'smooth',block:'start'})}
  }
  function jump(i){
    i=Math.max(0,Math.min(N-1,i));
    if(playing)goTo(i,true);else panels[i].scrollIntoView({behavior:'smooth',block:'start'});
  }
  function toggle(){
    if(cur<0){goTo(readMode?Math.max(1,nearest()):0,true);return}
    if(playing){playing=false;if(mode==='file')audio.pause();else{token++;try{speechSynthesis.cancel()}catch(e){}}ui()}
    else{playing=true;ui();if(mode==='file'&&audio.src&&!audio.ended){audio.play().catch(()=>speakFrom(cur,0))}else if(mode==='tts'){speakFrom(cur,sidx)}else start(cur)}
  }
  pp.onclick=toggle;
  $('prev').onclick=()=>stepBy(-1);
  $('next').onclick=()=>stepBy(1);
  const fmtR=r=>String(r).replace('.',',')+'×';
  spd.onclick=()=>{
    ri=(ri+1)%RATES.length;rate=RATES[ri];spdv.textContent=fmtR(rate);
    audio.defaultPlaybackRate=rate;audio.playbackRate=rate;
    if(playing&&mode==='tts')speakFrom(cur,sidx);
  };
  $('ccb').onclick=e=>{cc=!cc;e.currentTarget.classList.toggle('off',!cc);if(!cc)dcap.textContent=''};

  /* música */
  const mus=$('mus');
  mus.onclick=()=>Music.toggle();
  Music.onchange(on=>{mus.classList.toggle('off',!on);mus.setAttribute('aria-pressed',on)});

  /* pop-up pós-introdução */
  const modal=$('modal'),mGo=$('mGo');
  function openModal(){modal.classList.add('on');setTimeout(()=>mGo.focus(),350)}
  function closeModal(){modal.classList.remove('on')}
  function nearest(){let k=0;for(let i=0;i<N;i++){if(panels[i].getBoundingClientRect().bottom>220){k=i;break}k=i}return k}
  function stepBy(d){
    if(cur<0&&readMode){panels[Math.max(0,Math.min(N-1,nearest()+d))].scrollIntoView({behavior:'smooth',block:'start'});return}
    goTo(cur<0?(d>0?1:0):cur+d,playing||cur<0);
  }
  function readOwn(music){
    closeModal();stopSound();playing=false;readMode=true;cur=-1;lock=0;resetBars();setProg(0);ui();
    dstep.textContent='Modo leitura';dtitle.textContent='Leia no seu ritmo';dcap.textContent='Aperte play para voltar à narração';
    Music.level(.16);if(music)Music.start();else Music.stop();
    panels[1].scrollIntoView({behavior:'smooth',block:'start'});
  }
  mGo.onclick=()=>{closeModal();goTo(1,true)};
  $('mMus').onclick=()=>readOwn(true);
  $('mSil').onclick=()=>readOwn(false);
  addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('on'))readOwn(false)});

  /* links internos (#s2, #s3...) respeitam a narração */
  document.addEventListener('click',e=>{
    const a=e.target.closest&&e.target.closest('a[href^="#s"]');if(!a)return;
    const m=/^#s(\d+)$/.exec(a.getAttribute('href'));if(!m)return;
    e.preventDefault();jump(+m[1]);
  });

  /* rolagem automática acompanhando o áudio */
  ['wheel','touchstart','keydown','mousedown'].forEach(ev=>addEventListener(ev,()=>{lock=Date.now()+5000},{passive:true}));
  function follow(){
    if(playing&&cur>=0&&Date.now()>lock){
      const el=panels[cur],r=el.getBoundingClientRect(),top=r.top+scrollY,vh=innerHeight-dock.offsetHeight-30,extra=r.height-vh;
      const target=extra>0?top-16+extra*prog:top-Math.max(16,(vh-r.height)/2);
      const d=target-scrollY;if(Math.abs(d)>1)scrollTo({top:scrollY+d*.06,behavior:'instant'});
    }
    requestAnimationFrame(follow);
  }
  requestAnimationFrame(follow);
  ui();
  return{goTo,toggle,jump};
})();
window.Tour=Tour;
})();
