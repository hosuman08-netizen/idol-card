
(function(){
  var credits=+(localStorage.getItem('idol-card_cr')||10);
  var root=document.getElementById('app');
  var SHARE_BASE='https://hosuman08-netizen.github.io/idol-card/';
  var lastRar='';
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
  function render(){
    var st=JSON.parse(localStorage.getItem('idol_streak')||'{}');
    var sc=st.count||0;
    var ready=!st.shieldLast||((new Date(dayKey(0))-new Date(st.shieldLast))/86400000)>=7;
    root.innerHTML='<div class="card" style="border-color:#f472b6"><b>18+</b> Fictional entertainment · 실관계/결제 아님</div>'
      +'<div class="card">크레딧 <b style="color:var(--gold)">'+credits+'</b> (가상)'
      +'<div style="margin-top:6px"><span class="chip">🔥 '+sc+'일'+(sc>=3&&ready?' · 🛡️':'')+'</span> <span class="chip">창 '+fomoLeft()+'</span></div>'
      +'<div class="sub" style="margin-top:8px">확률 고지: N 50% · R 35% · SR 12% · SSR 3% (가상)</div>'
      +'<div class="row" style="margin-top:10px"><button id="use">1 사용 · 체험</button><button class="sec" id="get">무료 +3 (쿨다운 로컬)</button></div>'
      +'<div id="log" class="sub" style="margin-top:10px">'+(lastRar?'마지막: '+lastRar:'첫 카드를 뽑아보세요')+'</div>'
      +'<div id="sharePeak" style="display:none;margin-top:12px;padding:10px;border:1px solid #f472b644;border-radius:12px">'
      +'<p style="margin:0 0 6px;font-size:13px">✨ 뽑은 직후 — 공유</p>'
      +'<button class="sec" id="shareBtn">📤 결과 공유</button></div>'
      +'<div id="moneyPipe" style="margin-top:12px;padding:10px;border:1px solid #c5a46e44;border-radius:12px;background:#16121c;text-align:center;font-size:12px">'
      +'<div style="color:#e0b552;font-weight:700;margin-bottom:4px">💎 크레딧 · 후원 (엔터 18+)</div>'
      +'<a style="color:#ece8f1;margin:0 6px" href="mailto:hoyashi95@gmail.com?subject=%5BIdolCard%5D%20support">☕ 후원 문의</a>'
      +'<a style="color:#ece8f1;margin:0 6px" href="https://hosuman08-netizen.github.io/ai-companion/?utm_source=idol&utm_medium=pipe">💋 Companion</a>'
      +'<a style="color:#e0b552;margin:0 6px" href="https://hosuman08-netizen.github.io/legion-hub/?utm_source=idol&utm_medium=pipe">🎮 Arcade</a>'
      +'</div></div>';
    document.getElementById('use').onclick=function(){
      if(credits<=0){document.getElementById('log').textContent='크레딧 없음 · 무료 충전 또는 후원 문의';try{legionTrack('money_pipe_shown',{app:'idol',empty:1})}catch(e){}return;}
      credits--;save();
      var rar=['N','R','SR','SSR'][Math.random()<0.05?3:Math.random()<0.15?2:Math.random()<0.4?1:0];
      lastRar=rar;
      bumpStreak();
      render();
      document.getElementById('log').textContent='카드 '+rar+' · '+new Date().toLocaleTimeString()+' · 확률 N50 R35 SR12 SSR3';
      var peak=document.getElementById('sharePeak'); if(peak) peak.style.display='block';
      try{legionTrack('activate',{credits:credits,rar:rar})}catch(e){}
      try{legionTrack('share_peak_shown',{rar:rar})}catch(e){}
      try{legionTrack('money_pipe_shown',{app:'idol'})}catch(e){}
    };
    document.getElementById('get').onclick=function(){
      var k='idol-card_cd_'+new Date().toDateString();
      if(localStorage.getItem(k)){document.getElementById('log').textContent='오늘 무료 충전 완료';return;}
      credits+=3;localStorage.setItem(k,'1');save();render();try{legionTrack('activate',{free:1})}catch(e){}
    };
    var sb=document.getElementById('shareBtn');
    if(sb) sb.onclick=function(){
      var text='Idol Card '+lastRar+' (fictional 18+) · rates N50/R35/SR12/SSR3\n'+shareUrl();
      if(navigator.share) navigator.share({text:text,url:shareUrl()}).catch(function(){});
      else if(navigator.clipboard) navigator.clipboard.writeText(text);
      try{legionTrack('share_peak',{rar:lastRar})}catch(e){}
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
