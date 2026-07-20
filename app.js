
(function(){
  var credits=+(localStorage.getItem('idol-card_cr')||10);
  var root=document.getElementById('app');
  function save(){localStorage.setItem('idol-card_cr',credits);}
  function render(){
    root.innerHTML='<div class="card" style="border-color:#f472b6"><b>18+</b> Fictional entertainment · 실관계/결제 아님</div>'
      +'<div class="card">크레딧 <b style="color:var(--gold)">'+credits+'</b> (가상)<div class="row" style="margin-top:10px"><button id="use">1 사용 · 체험</button><button class="sec" id="get">무료 +3 (쿨다운 로컬)</button></div><div id="log" class="sub" style="margin-top:10px"></div></div>';
    document.getElementById('use').onclick=function(){
      if(credits<=0){document.getElementById('log').textContent='크레딧 없음 · 무료 충전 또는 후원 문의';return;}
      credits--;save();var rar=['N','R','SR','SSR'][Math.random()<0.05?3:Math.random()<0.15?2:Math.random()<0.4?1:0];
      document.getElementById('log').textContent='카드 '+rar+' · ' + new Date().toLocaleTimeString() + ' · 확률 고지 가상 N50 R35 SR12 SSR3';
      render();try{legionTrack('activate',{credits:credits})}catch(e){}
    };
    document.getElementById('get').onclick=function(){
      var k='idol-card_cd_'+new Date().toDateString();
      if(localStorage.getItem(k)){document.getElementById('log').textContent='오늘 무료 충전 완료';return;}
      credits+=3;localStorage.setItem(k,'1');save();render();try{legionTrack('activate',{free:1})}catch(e){}
    };
  }
  try{legionTrack('session_start',{app:'idol-card'})}catch(e){}
  render();
})();
