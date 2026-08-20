

/* LEGION_WAVE_31_session_counter */
try{if(!sessionStorage.getItem('lw_p37_idol_car_session_counter')){sessionStorage.setItem('lw_p37_idol_car_session_counter','1');localStorage.setItem('lw_p37_idol_car_session_counter',String((+(localStorage.getItem('lw_p37_idol_car_session_counter')||0))+1));}}catch(e){}
(function(){
  var credits=+(localStorage.getItem('idol-card_cr')||10); var pulls=+(localStorage.getItem('idol_pulls')||0); var pity=+(localStorage.getItem('idol_pity')||0); var bag=JSON.parse(localStorage.getItem('idol_bag')||'{}'); var owned=JSON.parse(localStorage.getItem('idol_own')||'{}'); var bestSSR=+(localStorage.getItem('idol_best_ssr')||0); var shareN=+(localStorage.getItem('idol_share_n')||0);
  var root=document.getElementById('app');
  var SHARE_BASE='https://hosuman08-netizen.github.io/idol-card/';
  var lastRar='';
  var lastCard=null;
  var leadId='';
  try{ leadId=localStorage.getItem('idol_lead')||''; }catch(e){ leadId=''; }
  /* GOLD50 TOP1: SuperStar/Enstars — named card identity. Fictional 12. 실아이돌 IP 0. 컴프/세트완성 보상 0 */
  var ROSTER=[
    {id:'n1',rar:'N',name:'린',e:'🌙'},
    {id:'n2',rar:'N',name:'하율',e:'🍃'},
    {id:'n3',rar:'N',name:'노을',e:'🌅'},
    {id:'n4',rar:'N',name:'진',e:'🪨'},
    {id:'r1',rar:'R',name:'미르',e:'🌊'},
    {id:'r2',rar:'R',name:'솔아',e:'☀️'},
    {id:'r3',rar:'R',name:'카이',e:'⚡'},
    {id:'r4',rar:'R',name:'은',e:'❄️'},
    {id:'sr1',rar:'SR',name:'루나',e:'🦋'},
    {id:'sr2',rar:'SR',name:'에이든',e:'🔥'},
    {id:'ssr1',rar:'SSR',name:'세온',e:'✨'},
    {id:'ssr2',rar:'SSR',name:'리아',e:'💎'}
  ];
  function pickCard(rar){
    var pool=ROSTER.filter(function(c){return c.rar===rar;});
    if(!pool.length) return {id:'?',rar:rar,name:'?',e:'·'};
    return pool[Math.floor(Math.random()*pool.length)];
  }
  function cardLabel(c){return c?(c.e+' '+c.name+' '+c.rar):'';}
  function save(){localStorage.setItem('idol-card_cr',credits);}
  function dayKey(off){
    var d=new Date(); d.setDate(d.getDate()+(off||0));
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }
  function kId(){
    try{
      var id=localStorage.getItem('idol_k_id');
      if(!id){id='i'+Math.random().toString(36).slice(2,8);localStorage.setItem('idol_k_id',id);}
      return id;
    }catch(e){return 'share';}
  }
  function shareUrl(){return SHARE_BASE+'?utm_source=share&utm_medium=app&ref='+encodeURIComponent(kId());}
  function todayPulls(){try{return +(localStorage.getItem('idol_day_'+dayKey(0))||0);}catch(e){return 0;}}
  function bumpToday(){try{var k='idol_day_'+dayKey(0); localStorage.setItem(k,String(todayPulls()+1));}catch(e){}}
  function bestRar(){try{return localStorage.getItem('idol_best')||'';}catch(e){return '';}}
  function setBest(r){
    var rank={N:1,R:2,SR:3,SSR:4};
    var b=bestRar();
    if(!b||(rank[r]||0)>(rank[b]||0)) try{localStorage.setItem('idol_best',r);}catch(e){}
  }
  function weekSSR(){
    try{
      var n=0;
      for(var i=0;i<7;i++){
        var h=JSON.parse(localStorage.getItem('idol_hist_'+dayKey(-i))||'[]');
        h.forEach(function(x){if(x==='SSR')n++;});
      }
      return n;
    }catch(e){return 0;}
  }
  function pushHist(r){
    try{
      var k='idol_hist_'+dayKey(0);
      var h=JSON.parse(localStorage.getItem(k)||'[]');
      h.unshift(r); localStorage.setItem(k,JSON.stringify(h.slice(0,40)));
    }catch(e){}
  }
  function bumpStreak(){
    try{
      var st=JSON.parse(localStorage.getItem('idol_streak')||'{}');
      if(!st||typeof st!=='object')st={last:null,count:0};
      var t=dayKey(0);
      if(st.last===t) return st;
      var y=dayKey(-1),y2=dayKey(-2),froze=false;
      if(st.last && st.last!==y && st.last===y2 && (st.count||0)>=3){
        var ready=!st.shieldLast||((new Date(t)-new Date(st.shieldLast))/86400000)>=7;
        if(ready){st.shieldLast=t;st.last=y;froze=true;try{legionTrack('streak_freeze',{count:st.count})}catch(e){}}
      }
      st.count=(st.last===y)?(st.count||0)+1:1;
      st.last=t;
      localStorage.setItem('idol_streak',JSON.stringify(st));
      try{legionTrack('streak',{count:st.count,froze:froze})}catch(e){}
      return st;
    }catch(e){return {count:0};}
  }
  function fomoLeft(){
    var end=new Date(); end.setHours(24,0,0,0);
    var ms=Math.max(0,end-Date.now());
    return Math.floor(ms/3600000)+'h '+Math.floor((ms%3600000)/60000)+'m';
  }
  /* GOLD50 TOP2: Pocket/HS pack flip ~1s. 희귀도별 duration. 사운드 없음. 컴프 0 */
  function playFlip(card){
    var el=document.getElementById('flipStage');
    if(!el||!card) return;
    var col={N:'#64748b',R:'#67e8f9',SR:'#c4b5fd',SSR:'#fbbf24'}[card.rar]||'#64748b';
    var dur={N:'0.7s',R:'0.85s',SR:'1s',SSR:'1.15s'}[card.rar]||'1s';
    el.style.display='block';
    el.innerHTML='<div class="flip-wrap"><div class="flip-inner" id="flipInner" style="transition-duration:'+dur+'">'
      +'<div class="flip-face flip-back">CARD</div>'
      +'<div class="flip-face flip-front" style="border-color:'+col+';color:'+col+'"><span>'+card.e+' '+card.name+'</span><span class="sub" style="margin:6px 0 0;color:'+col+'">'+card.rar+'</span></div>'
      +'</div></div>';
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        var inn=document.getElementById('flipInner');
        if(inn) inn.classList.add('ok');
      });
    });
  }
  function bagBar(){
    var tot=Math.max(1,(bag.N||0)+(bag.R||0)+(bag.SR||0)+(bag.SSR||0));
    function seg(n,c){var w=Math.max(2,Math.round((n||0)/tot*100)); return '<i style="display:inline-block;width:'+w+'%;height:8px;background:'+c+'"></i>';}
    return '<div style="display:flex;width:100%;border-radius:4px;overflow:hidden;margin-top:6px">'+seg(bag.N,'#64748b')+seg(bag.R,'#67e8f9')+seg(bag.SR,'#c4b5fd')+seg(bag.SSR,'#fbbf24')+'</div>';
  }
  /* GOLD50 TOP3: K-Collect/PokéCardex 보유 격자. 컴프/세트완성 보상 0. "전부 모아" 카피 0 */
  function rosterBoard(){
    return '<p class="sub" style="margin-top:10px">보유 보드 · 세트완성 보상 없음 · 컴프 아님 · 보유 칸 탭=주연</p>'
      +'<div class="col-grid">'+ROSTER.map(function(c){
        var n=owned[c.id]||0;
        return '<div class="col-cell '+(n?'have':'mute')+(leadId===c.id&&n?' lead':'')+'"'+(n?' data-pick="'+c.id+'"':'')+'><div class="e">'+c.e+'</div><div class="n">'+c.name+'</div><div class="sub" style="margin:2px 0 0">'+c.rar+(n?' · '+n:'')+(leadId===c.id&&n?' · 주연':'')+'</div></div>';
      }).join('')+'</div>';
  }
  /* GOLD50 TOP4: SuperStar/Enstars 무대 1턴. 난수 아님 · 보유 티어 가산만 · 세트완성 보너스 0 */
  function ownedByRar(){
    var b={N:0,R:0,SR:0,SSR:0};
    ROSTER.forEach(function(c){ b[c.rar]=(b[c.rar]||0)+(owned[c.id]||0); });
    return b;
  }
  function stageScore(){
    var b=ownedByRar();
    return 10 + b.N*1 + b.R*5 + b.SR*20 + b.SSR*50;
  }
  function loadStageHist(){
    try{
      var h=JSON.parse(localStorage.getItem('idol_stage_hist')||'[]');
      return Array.isArray(h)?h:[];
    }catch(e){ return []; }
  }
  function pushStageHist(sc, lead){
    try{
      var h=loadStageHist();
      h.unshift({s:sc, id:lead&&lead.id||'', rar:lead&&lead.rar||'', n:lead&&lead.name||''});
      localStorage.setItem('idol_stage_hist', JSON.stringify(h.slice(0,7)));
    }catch(e){}
  }
  function delStageHistAt(h, i){
    if(!Array.isArray(h)) return [];
    if(i<0 || i>=h.length) return h.slice();
    return h.slice(0,i).concat(h.slice(i+1));
  }
  function delStageHist(i){
    var h=delStageHistAt(loadStageHist(), i);
    try{ localStorage.setItem('idol_stage_hist', JSON.stringify(h.slice(0,7))); }catch(e){}
    return h;
  }
  function clearStageHistAll(){
    try{ localStorage.setItem('idol_stage_hist','[]'); }catch(e){}
    return [];
  }
  function csvCell(v){
    var s=String(v==null?'':v);
    if(/[",\n]/.test(s)) return '"'+s.replace(/"/g,'""')+'"';
    return s;
  }
  function stageHistCsv(h){
    h=Array.isArray(h)?h:loadStageHist();
    var lines=['score,name,rar,id'];
    h.forEach(function(x){
      if(!x) return;
      lines.push([csvCell(x.s||0),csvCell(x.n||''),csvCell(x.rar||''),csvCell(x.id||'')].join(','));
    });
    return lines.join('\n');
  }
  function stageHistCsvName(day){
    return 'idol-stage-hist-'+(day||dayKey(0))+'.csv';
  }
  function stageHistCsvBtnLabel(day){
    return 'CSV · '+stageHistCsvName(day);
  }
  function stageHistCsvCopyLabel(day){
    return 'CSV 복사 · '+stageHistCsvName(day);
  }
  function copyStageHistCsv(){
    return stageHistCsv();
  }
  function stageHistCsvRowN(csv){
    var lines=String(csv==null?'':csv).split(/\r?\n/).filter(function(x){ return String(x).length; });
    if(!lines.length) return 0;
    return Math.max(0, lines.length-1);
  }
  function stageHistCsvCopyNLine(n){
    return '복사 '+(+n||0)+'행';
  }
  function stageHistCsvNChip(n){
    return (+n||0)+'행';
  }
  function paintHistCsvNChip(n, copied){
    var nEl=document.getElementById('histCsvCopyN');
    if(!nEl) return n;
    nEl.textContent=copied?stageHistCsvCopyNLine(n):stageHistCsvNChip(n);
    nEl.className='chip';
    nEl.setAttribute('data-n', String(+n||0));
    nEl.setAttribute('data-copied', copied?'1':'0');
    nEl.setAttribute('role','button');
    nEl.tabIndex=0;
    nEl.style.cursor='pointer';
    nEl.title='CSV 복사 · '+stageHistCsvNChip(n);
    return n;
  }
  function histCsvCopyOkLine(n, copied){
    if(!copied) return '';
    return '복사 확인 · '+(+n||0)+'행 · 컴프 0 · 확률 불변';
  }
  var HIST_CSV_COPY_OK_HIDE_MS=3000;
  var histCsvCopyOkHideTimer=null;
  function histCsvCopyOkHideMs(){ return HIST_CSV_COPY_OK_HIDE_MS; }
  function hideHistCsvCopyOk(){
    histCsvCopyOkHideTimer=null;
    var el=document.getElementById('histCsvCopyOk');
    if(!el) return false;
    el.textContent='';
    el.setAttribute('data-ok','0');
    el.setAttribute('data-hidden','1');
    el.setAttribute('hidden','');
    holdHistCsvBtnFocus();
    return true;
  }
  /* WAVE205: 숨김 후 CSV버튼 포커스 · 컴프 0 · 확률 불변 */
  function holdHistCsvBtnFocus(){
    var btn=typeof document!=='undefined'?document.getElementById('histCsv'):null;
    if(!btn) return false;
    try{ if(btn.focus) btn.focus(); }catch(e1){}
    if(btn.setAttribute) btn.setAttribute('data-focus-after-hide','1');
    return true;
  }
  /* WAVE207: 포커스 링 재탭=재시작 분리 · 숨김과 분리 · 컴프 0 · 확률 불변 */
  var histCsvRingTok=0;
  function histCsvFocusRingMs(){ return 400; }
  function histCsvFocusRingOn(el){
    el=el||(typeof document!=='undefined'?document.getElementById('histCsv'):null);
    if(!el) return false;
    if(el._ringT) return true;
    if(el.getAttribute&&el.getAttribute('data-focus-ring')==='1') return true;
    return false;
  }
  function clearHistCsvFocusRing(){
    var el=typeof document!=='undefined'?document.getElementById('histCsv'):null;
    if(!el) return;
    el.style.outline='';
    el.style.outlineOffset='';
    el.style.boxShadow='';
    if(el.setAttribute){
      el.setAttribute('data-focus-ring','0');
      el.setAttribute('data-re-ring','0');
    }
    el._ringT=0;
  }
  function armHistCsvFocusRing(){
    var el=typeof document!=='undefined'?document.getElementById('histCsv'):null;
    if(!el) return false;
    var retr=histCsvFocusRingOn(el);
    el.style.outline='2px solid #67e8f9';
    el.style.outlineOffset='2px';
    el.style.boxShadow='0 0 0 4px #67e8f955';
    if(el.setAttribute){
      el.setAttribute('data-focus-ring','1');
      el.setAttribute('data-re-ring', retr?'1':'0');
      el.setAttribute('data-ring-off','0');
    }
    if(el._ringT) try{clearTimeout(el._ringT);}catch(e0){}
    var tok=++histCsvRingTok;
    el._ringT=setTimeout(function(){
      if(tok!==histCsvRingTok) return;
      clearHistCsvFocusRing();
    }, histCsvFocusRingMs());
    return true;
  }
  function restartHistCsvRingFromFocus(){
    var el=typeof document!=='undefined'?document.getElementById('histCsv'):null;
    if(!el||!el.getAttribute||el.getAttribute('data-focus-after-hide')!=='1') return false;
    armHistCsvFocusRing();
    if(el.setAttribute){
      el.setAttribute('data-re-ring','1');
      el.setAttribute('data-re-from-focus','1');
    }
    return true;
  }
  /* WAVE208: 재시작 중 탭=링 끄기 · 재시작과 분리 · 컴프 0 · 확률 불변 */
  function killHistCsvFocusRing(){
    histCsvRingTok++;
    var el=typeof document!=='undefined'?document.getElementById('histCsv'):null;
    if(el && el._ringT) try{clearTimeout(el._ringT);}catch(e0){}
    clearHistCsvFocusRing();
    if(el && el.setAttribute){
      el.setAttribute('data-ring-off','1');
      el.setAttribute('data-ring-tap','1');
    }
    holdHistCsvBtnFocus();
    return true;
  }
  /* WAVE157: 확인줄 탭=즉시숨김 · 컴프 0 · 확률 불변 */
  function bindHistCsvCopyOkTap(){
    var el=typeof document!=='undefined'?document.getElementById('histCsvCopyOk'):null;
    if(!el) return false;
    el.setAttribute('role','button');
    el.tabIndex=0;
    el.style.cursor='pointer';
    el.setAttribute('data-tap-hide','1');
    el.title='탭=확인줄 즉시숨김 · 컴프 0 · 확률 불변';
    el.onclick=function(ev){
      if(ev && ev.stopPropagation) ev.stopPropagation();
      if(!el.textContent) return;
      if(histCsvCopyOkHideTimer){ try{clearTimeout(histCsvCopyOkHideTimer);}catch(e0){} histCsvCopyOkHideTimer=null; }
      hideHistCsvCopyOk();
    };
    el.onkeydown=function(ev){
      var k=ev&&ev.key;
      if(k!=='Enter' && k!==' ') return;
      if(ev.preventDefault) ev.preventDefault();
      el.onclick(ev);
    };
    return true;
  }
  function armHistCsvCopyOkHide(){
    if(histCsvCopyOkHideTimer){ clearTimeout(histCsvCopyOkHideTimer); histCsvCopyOkHideTimer=null; }
    histCsvCopyOkHideTimer=setTimeout(hideHistCsvCopyOk, HIST_CSV_COPY_OK_HIDE_MS);
  }
  function paintHistCsvCopyOk(n, copied){
    var el=document.getElementById('histCsvCopyOk');
    if(!el) return '';
    var line=histCsvCopyOkLine(n, copied);
    el.textContent=line;
    el.setAttribute('data-ok', copied?'1':'0');
    if(line){
      el.removeAttribute('hidden');
      el.setAttribute('data-hidden','0');
      armHistCsvCopyOkHide();
      try{bindHistCsvCopyOkTap();}catch(eB){}
    }else{
      el.setAttribute('hidden','');
      el.setAttribute('data-hidden','1');
      if(histCsvCopyOkHideTimer){ clearTimeout(histCsvCopyOkHideTimer); histCsvCopyOkHideTimer=null; }
    }
    return line;
  }
  function applyStageHistCsvCopy(from){
    var csv=copyStageHistCsv();
    var n=(loadStageHist()||[]).length;
    var rows=stageHistCsvRowN(csv);
    paintHistCsvNChip(rows, true);
    paintHistCsvCopyOk(rows, true);
    var out=document.getElementById('stageOut');
    try{
      if(typeof navigator!=='undefined' && navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(csv);
        if(out) out.textContent='CSV 복사 '+n+'/7 · '+stageHistCsvName()+' · 컴프 0 · 확률 불변';
      }else if(out){
        out.textContent='클립보드 없음 · 다운로드 사용 · 컴프 0';
      }
    }catch(e){
      if(out) out.textContent='복사 실패 · 다운로드 사용 · 컴프 0';
    }
    try{legionTrack('stage_hist_csv_copy',{n:n,rows:rows,from:from||'btn'})}catch(e2){}
    return csv;
  }
  function downloadStageHistCsv(){
    var csv=stageHistCsv();
    var name=stageHistCsvName();
    try{
      if(typeof Blob==='undefined'||typeof document==='undefined') return csv;
      var blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
      var url=(typeof URL!=='undefined'&&URL.createObjectURL)?URL.createObjectURL(blob):'';
      if(!url) return csv;
      var a=document.createElement('a');
      a.href=url; a.download=name;
      if(document.body) document.body.appendChild(a);
      a.click();
      if(a.parentNode) a.parentNode.removeChild(a);
      setTimeout(function(){ try{ URL.revokeObjectURL(url); }catch(e){} },400);
    }catch(e){
      try{ if(navigator&&navigator.clipboard) navigator.clipboard.writeText(csv); }catch(e2){}
    }
    return csv;
  }
  function stageHistLine(){
    var h=loadStageHist();
    var csvBtn=' <button type="button" class="sec" id="histCsv" style="padding:2px 8px;font-size:11px;margin-left:4px" title="'+stageHistCsvName()+'">'+stageHistCsvBtnLabel()+'</button>'
      +' <button type="button" class="sec" id="histCsvCopy" style="padding:2px 8px;font-size:11px;margin-left:4px" title="'+stageHistCsvName()+'">'+stageHistCsvCopyLabel()+'</button>'
      +' <span id="histCsvCopyN" class="chip" role="button" tabindex="0" style="margin-left:4px;cursor:pointer" title="CSV 복사 · '+stageHistCsvNChip(stageHistCsvRowN(stageHistCsv()))+'" data-n="'+stageHistCsvRowN(stageHistCsv())+'" data-copied="0">'+stageHistCsvNChip(stageHistCsvRowN(stageHistCsv()))+'</span>'
      +' <span id="histCsvCopyOk" class="sub" hidden data-ok="0" data-tap-hide="1" role="button" tabindex="0" style="margin-left:4px;cursor:pointer" title="탭=확인줄 즉시숨김 · 컴프 0"></span>';
    if(!h.length) return '<p id="stageHist" class="sub" style="margin:8px 0 0">무대 기록 없음 · 로컬 7'+csvBtn+'</p>';
    return '<div id="stageHist" class="sub" style="margin:8px 0 0">기록 '
      +h.map(function(x,i){
        return '<span class="chip" data-hist="'+i+'" role="button" tabindex="0" style="cursor:pointer">'+(x&&x.s)+' <span data-hist-del="'+i+'" aria-label="기록 지우기" style="opacity:.55;margin-left:2px">×</span></span>';
      }).join('')
      +' <button type="button" class="sec" id="histClear" style="padding:2px 8px;font-size:11px;margin-left:4px">기록 전체 지우기</button>'
      +csvBtn
      +'</div>';
  }
  function paintStageReplay(x){
    var out=document.getElementById('stageOut');
    if(!out||!x) return;
    var who=[x.n||'',x.rar||''].filter(Boolean).join(' ');
    out.innerHTML='<div class="stage-score">'+x.s+'</div>'
      +'<div>기록 재표시'+(who?' · '+who:'')+'</div>'
      +'<div class="sub">로컬 기록 · 난수 0 · 컴프 0 · 확률 불변</div>';
  }
  function refreshStageHistUi(){
    var hist=document.getElementById('stageHist');
    if(hist) hist.outerHTML=stageHistLine();
    var bestEl=document.getElementById('stageBest');
    if(bestEl) bestEl.outerHTML=stageBestChip();
    wireStageHist();
  }
  function wireStageHist(){
    var root=document.getElementById('stageHist');
    if(!root) return;
    var clr=document.getElementById('histClear');
    if(clr) clr.onclick=function(ev){
      if(ev && ev.stopPropagation) ev.stopPropagation();
      if(!confirm('무대 기록 전부 지울까?')) return;
      clearStageHistAll();
      var out=document.getElementById('stageOut');
      if(out) out.textContent='기록 전체 지움 · 로컬 0/7 · 컴프 0 · 확률 불변';
      refreshStageHistUi();
      try{legionTrack('stage_hist_clear',{})}catch(e){}
    };
    var csvBtn=document.getElementById('histCsv');
    if(csvBtn) csvBtn.onclick=function(ev){
      if(ev && ev.stopPropagation) ev.stopPropagation();
      if(histCsvFocusRingOn(csvBtn)){ killHistCsvFocusRing(); return; }
      if(restartHistCsvRingFromFocus()) return;
      var csv=downloadStageHistCsv();
      var n=(loadStageHist()||[]).length;
      var out=document.getElementById('stageOut');
      if(out) out.textContent='CSV 로컬 '+n+'/7 · '+stageHistCsvName()+' · 컴프 0 · 확률 불변';
      try{legionTrack('stage_hist_csv',{n:n})}catch(e){}
      return csv;
    };
    var csvCopy=document.getElementById('histCsvCopy');
    if(csvCopy) csvCopy.onclick=function(ev){
      if(ev && ev.stopPropagation) ev.stopPropagation();
      return applyStageHistCsvCopy('btn');
    };
    try{bindHistCsvCopyOkTap();}catch(eOk){}
    var nChip=document.getElementById('histCsvCopyN');
    if(nChip){
      nChip.onclick=function(ev){
        if(ev && ev.stopPropagation) ev.stopPropagation();
        return applyStageHistCsvCopy('chip');
      };
      nChip.onkeydown=function(ev){
        var k=ev&&ev.key;
        if(k!=='Enter' && k!==' ') return;
        if(ev && ev.preventDefault) ev.preventDefault();
        if(ev && ev.stopPropagation) ev.stopPropagation();
        return applyStageHistCsvCopy('chip');
      };
    };
    root.querySelectorAll('[data-hist-del]').forEach(function(el){
      el.onclick=function(ev){
        if(ev && ev.stopPropagation) ev.stopPropagation();
        var i=+el.getAttribute('data-hist-del');
        var h=delStageHist(i);
        var out=document.getElementById('stageOut');
        if(out) out.textContent='기록 지움 · 로컬 '+((h&&h.length)||0)+'/7 · 컴프 0 · 확률 불변';
        refreshStageHistUi();
        try{legionTrack('stage_hist_del',{i:i})}catch(e){}
      };
    });
    root.querySelectorAll('[data-hist]').forEach(function(el){
      el.onclick=function(ev){
        if(ev && ev.target && ev.target.closest && ev.target.closest('[data-hist-del]')) return;
        var i=+el.getAttribute('data-hist');
        var h=loadStageHist();
        var x=h[i];
        if(!x) return;
        root.querySelectorAll('[data-hist]').forEach(function(c){
          c.style.outline=(c===el)?'1px solid var(--gold)':'none';
        });
        paintStageReplay(x);
        try{legionTrack('stage_replay',{i:i,s:x.s})}catch(e){}
      };
    });
  }
  function stageBest(){
    var m=0;
    loadStageHist().forEach(function(x){
      var s=x&&x.s;
      if(typeof s==='number' && s>m) m=s;
    });
    return m;
  }
  function stageBestChip(){
    var m=stageBest();
    return '<span class="chip" id="stageBest">최고 점수 '+(m||'—')+'</span>';
  }
  function stageLead(){
    if(leadId){
      var chosen=null;
      ROSTER.forEach(function(c){ if(c.id===leadId) chosen=c; });
      if(chosen && (owned[chosen.id]||0)>0) return chosen;
    }
    var rank={N:1,R:2,SR:3,SSR:4};
    var best=null, bestN=0;
    ROSTER.forEach(function(c){
      var n=owned[c.id]||0;
      if(!n) return;
      var better=!best || (rank[c.rar]||0)>(rank[best.rar]||0) || (c.rar===best.rar && n>bestN);
      if(better){ best=c; bestN=n; }
    });
    return best;
  }
  function render(){
    var st=JSON.parse(localStorage.getItem('idol_streak')||'{}');
    var sc=st.count||0;
    var ready=!st.shieldLast||((new Date(dayKey(0))-new Date(st.shieldLast))/86400000)>=7;
    var br=bestRar();
    root.innerHTML='<div class="card" style="border-color:#f472b6"><b>18+</b> Fictional entertainment · 실관계/결제 아님</div>'
      +'<div class="card">크레딧 <b style="color:var(--gold)">'+credits+'</b> · 뽑기 '+pulls+' · soft pity '+pity+'/30 · SSR '+bestSSR+' · 공유 '+shareN+'<br><span class="sub">확률 고지 N50 R35 SR12 SSR3 · soft pity 30=SSR 1회 보정(세트강제 아님) · 가상</span>'
      +'<div style="margin-top:6px"><span class="chip">🔥 '+sc+'일'+(sc>=3&&ready?' · 🛡️':'')+'</span> <span class="chip">오늘 '+todayPulls()+'회</span> <span class="chip">창 '+fomoLeft()+'</span>'
      +(br?' <span class="chip">최고 '+br+'</span>':'')+' <span class="chip">7일 SSR '+weekSSR()+'</span></div>'
      +'<div class="sub" style="margin-top:8px">확률 고지: N 50% · R 35% · SR 12% · SSR 3% · soft pity 30회 SSR 보정(컴프 아님) · 코드=고지 정합 · 가상</div>'
      +'<div style="height:8px;background:#1c1826;border-radius:4px;margin-top:8px;overflow:hidden" title="soft pity '+pity+'/30"><i style="display:block;height:100%;width:'+Math.min(100,Math.round(pity/30*100))+'%;background:linear-gradient(90deg,#c4b5fd,#fbbf24)"></i></div>'
      +bagBar()+"<button class='sec' id='bagClear' style='margin-top:8px;width:100%'>가방 초기화(체험)</button>"
      +'<div class="row" style="margin-top:10px"><button id="use">1 사용</button><button class="sec" id="use10">10연 (×10)</button><button class="sec" id="get">무료 +3</button></div>'
      +'<div class="sub" style="margin-top:8px">픽션 로스터 12 · 세트완성 보상 없음 · 실아이돌 IP 0</div>'
      +rosterBoard()
      +'<div class="card" id="stageCard" style="margin-top:10px">'
      +'<p class="sub" style="margin:0 0 6px">무대 1턴 · 난수 아님 · 보유 티어 가산만 · 세트완성 보너스 0 · 주연은 보유 칸 탭</p>'
      +'<p class="sub" style="margin:0 0 8px">공식 10 + N×1 + R×5 + SR×20 + SSR×50 · 확률 N50/R35/SR12/SSR3 불변 · 컴프 아님</p>'
      +'<button class="sec" id="stageGo" style="width:100%">무대 켜기</button>'
      +'<div style="margin-top:8px">'+stageBestChip()+'</div>'
      +'<div id="stageOut" class="sub" style="margin-top:8px"></div>'
      +stageHistLine()
      +'</div>'
      +'<div id="flipStage" style="display:none"></div>'
      +'<div id="log" class="sub" style="margin-top:10px">'+(lastCard?'마지막: '+cardLabel(lastCard):'첫 카드를 뽑아보세요')+' · bag N'+(bag.N||0)+' R'+(bag.R||0)+' SR'+(bag.SR||0)+' SSR'+(bag.SSR||0)+'</div>'
      +'<div id="sharePeak" style="display:none;margin-top:12px;padding:10px;border:1px solid #f472b644;border-radius:12px">'
      +'<p style="margin:0 0 6px;font-size:13px">✨ 뽑은 직후 — 공유</p>'
      +'<button class="sec" id="shareBtn">📤 결과 공유</button></div>'
      +'<div id="moneyPipe" style="margin-top:12px;padding:10px;border:1px solid #c5a46e44;border-radius:12px;background:#16121c;text-align:center;font-size:12px">'
      +'<div style="color:#e0b552;font-weight:700;margin-bottom:4px">💎 크레딧 · 후원 (엔터 18+)</div>'
      +'<a style="color:#ece8f1;margin:0 6px" href="mailto:hoyashi95@gmail.com?subject=%5BIdolCard%5D%20support">☕ 후원 문의</a>'
      +'<a style="color:#ece8f1;margin:0 6px" href="https://hosuman08-netizen.github.io/ai-companion/?utm_source=idol&utm_medium=pipe">💋 Companion</a>'
      +''
      +'</div></div>';
    function onePull(){
      pulls++; localStorage.setItem('idol_pulls',pulls);
      var roll=Math.random(); var rar; var ssrP=0.03+Math.min(0.02,pity*0.0005);
      if(pity>=30){rar='SSR';} else if(roll<ssrP){rar='SSR';} else if(roll<ssrP+0.12){rar='SR';} else if(roll<ssrP+0.12+0.35){rar='R';} else {rar='N';}
      if(rar==='SSR'){pity=0; bestSSR++; localStorage.setItem('idol_best_ssr',bestSSR);} else {pity++;}
      localStorage.setItem('idol_pity',pity); bag[rar]=(bag[rar]||0)+1; localStorage.setItem('idol_bag',JSON.stringify(bag));
      var card=pickCard(rar);
      lastRar=rar; lastCard=card; setBest(rar); pushHist(rar); bumpToday();
      owned[card.id]=(owned[card.id]||0)+1;
      try{localStorage.setItem('idol_own',JSON.stringify(owned));}catch(e){}
      return card;
    }
    document.getElementById('use').onclick=function(){
      if(credits<=0){document.getElementById('log').textContent='크레딧 없음 · 무료 충전 또는 후원 문의';try{legionTrack('money_pipe_shown',{app:'idol',empty:1})}catch(e){}return;}
      credits--;save();
      var card=onePull();
      bumpStreak();
      render();
      playFlip(card);
      document.getElementById('log').textContent='카드 '+cardLabel(card)+' · '+new Date().toLocaleTimeString()+' · 확률 N50/R35/SR12/SSR3 · soft pity '+pity+'/30';
      var peak=document.getElementById('sharePeak'); if(peak) peak.style.display='block';
      try{legionTrack('activate',{credits:credits,rar:card.rar})}catch(e){}
      try{legionTrack('share_peak_shown',{rar:card.rar})}catch(e){}
      try{legionTrack('money_pipe_shown',{app:'idol'})}catch(e){}
    };
    document.getElementById('use10').onclick=function(){
      if(credits<10){document.getElementById('log').textContent='10연은 크레딧 10 필요 · 현재 '+credits;try{legionTrack('money_pipe_shown',{app:'idol',empty:1})}catch(e){}return;}
      credits-=10;save();
      var got=[]; var last=null; var best=null;
      var rank={N:1,R:2,SR:3,SSR:4};
      for(var k=0;k<10;k++){
        last=onePull(); got.push(cardLabel(last));
        if(!best||(rank[last.rar]||0)>(rank[best.rar]||0)) best=last;
      }
      bumpStreak();
      render();
      playFlip(best||last);
      document.getElementById('log').textContent='10연: '+got.join(' · ')+' · soft pity '+pity+'/30';
      var peak=document.getElementById('sharePeak'); if(peak) peak.style.display='block';
      try{legionTrack('activate',{multi:10,got:got})}catch(e){}
      try{legionTrack('share_peak_shown',{multi:10})}catch(e){}
    };
    var bc=document.getElementById('bagClear'); if(bc) bc.onclick=function(){ if(!confirm('가방 비울까?'))return; bag={}; owned={}; leadId=''; localStorage.setItem('idol_bag','{}'); localStorage.setItem('idol_own','{}'); try{localStorage.removeItem('idol_lead');}catch(e){} render(); try{legionTrack('bag_clear',{})}catch(e){} };
    document.querySelectorAll('[data-pick]').forEach(function(el){
      el.onclick=function(){
        var id=el.getAttribute('data-pick');
        if(!id || !(owned[id]||0)) return;
        leadId=id;
        try{localStorage.setItem('idol_lead',id);}catch(e){}
        render();
        try{legionTrack('stage_lead',{id:id})}catch(e){}
      };
    });
    var sg=document.getElementById('stageGo');
    if(sg) sg.onclick=function(){
      var lead=stageLead();
      var b=ownedByRar();
      var sc=stageScore();
      var out=document.getElementById('stageOut');
      if(!lead){
        if(out) out.textContent='뽑은 카드로 무대 · 컴프/세트완성 아님 · 확률 불변';
        return;
      }
      pushStageHist(sc, lead);
      if(out) out.innerHTML='<div class="stage-score">'+sc+'</div>'
        +'<div>'+lead.e+' '+lead.name+' '+lead.rar+' · 주연'+(leadId===lead.id?'(탭)':'(최고 티어)')+'</div>'
        +'<div class="sub">가산 N'+b.N+' R'+b.R+' SR'+b.SR+' SSR'+b.SSR+' · 난수 0 · 컴프 0 · 확률 불변</div>';
      var hist=document.getElementById('stageHist');
      if(hist) hist.outerHTML=stageHistLine();
      var bestEl=document.getElementById('stageBest');
      if(bestEl) bestEl.outerHTML=stageBestChip();
      wireStageHist();
      try{legionTrack('stage_turn',{score:sc,lead:lead.id})}catch(e){}
    };
    wireStageHist();
    document.getElementById('get').onclick=function(){
      var k='idol-card_cd_'+new Date().toDateString();
      if(localStorage.getItem(k)){document.getElementById('log').textContent='오늘 무료 충전 완료';return;}
      credits+=3;localStorage.setItem(k,'1');save();render();try{legionTrack('activate',{free:1})}catch(e){}
    };
    var sb=document.getElementById('shareBtn');
    if(sb) sb.onclick=function(){
      var text='Idol Card '+(lastCard?cardLabel(lastCard):lastRar)+' (fictional 18+) · rates N50/R35/SR12/SSR3 · 컴프아님\n'+shareUrl();
      if(navigator.share) navigator.share({text:text,url:shareUrl()}).catch(function(){});
      else if(navigator.clipboard) navigator.clipboard.writeText(text);
      try{shareN++;localStorage.setItem('idol_share_n',shareN);}catch(e){} try{legionTrack('share_peak',{rar:lastRar})}catch(e){}
    };
  }
  try{
    var q=new URLSearchParams(location.search||'');
    var ref=q.get('ref');
    if(ref && ref!=='share' && ref!==kId() && !localStorage.getItem('idol_k_from')){
      localStorage.setItem('idol_k_from',ref);
      try{legionTrack('k_link',{from:ref})}catch(e){}
    }
  }catch(e){}
  try{legionTrack('session_start',{app:'idol-card'})}catch(e){}
  render();
})();

/* LEGION_WAVE_76_wave_stamp */ /* ship wave 76 2026-07-21T07:43:52 */
