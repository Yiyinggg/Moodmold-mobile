let selectedFood = null;
function pickFood(el, emoji, name, pts){
  document.querySelectorAll('.food-item').forEach(f=>f.classList.remove('sel'));
  el.classList.add('sel');
  selectedFood = {emoji, name, pts};
}
function doFeed(){
  if(!selectedFood){showToast('🍽 请先选择零食！');return;}
  const v = Math.min(100, parseInt(document.getElementById('hungerPct').textContent)+selectedFood.pts);
  document.getElementById('hungerPct').textContent = v+'%';
  document.getElementById('hungerFill').style.width = v+'%';
  setStat('energy', Math.min(100, parseInt(document.getElementById('ar-energy').textContent)+selectedFood.pts));
  syncStats();
  showToast(selectedFood.emoji+' 巴纳比很喜欢「'+selectedFood.name+'」！');
  document.querySelectorAll('.food-item').forEach(f=>f.classList.remove('sel'));
  selectedFood = null;
}

function pickAct(type, icon, lbl, mood, dl, de, dm){
  ['pet','feed','play','talk'].forEach(a=>{document.getElementById('act-'+a).classList.remove('on');});
  document.getElementById('act-'+type).classList.add('on');
  document.getElementById('arMood').textContent = mood;
  setStat('love', Math.min(100, Math.max(0, parseInt(document.getElementById('ar-love').textContent)+dl)));
  setStat('energy', Math.min(100, Math.max(0, parseInt(document.getElementById('ar-energy').textContent)+de)));
  setStat('mood2', Math.min(100, Math.max(0, parseInt(document.getElementById('ar-mood').textContent)+dm)));
  syncStats();
  showToast(icon+' 巴纳比想'+lbl+'！');
}

function setStat(k, v){
  if(k==='mood2'){
    document.getElementById('ar-mood').textContent = v;
    document.getElementById('arf-mood').style.width = v+'%';
    return;
  }
  document.getElementById('ar-'+k).textContent = v;
  document.getElementById('arf-'+k).style.width = v+'%';
}
function syncStats(){
  ['love','energy'].forEach(k=>{
    const v = document.getElementById('ar-'+k).textContent;
    document.getElementById('h-'+k).textContent = v;
    document.getElementById('hf-'+k).style.width = v+'%';
  });
  const mv = document.getElementById('ar-mood').textContent;
  document.getElementById('h-mood').textContent = mv;
  document.getElementById('hf-mood').style.width = mv+'%';
  document.getElementById('bubble-love').textContent = document.getElementById('h-love').textContent;
  document.getElementById('bubble-energy').textContent = document.getElementById('h-energy').textContent;
  document.getElementById('bubble-mood').textContent = mv;
}

function wearOutfit(el, emoji, look){
  document.querySelectorAll('.outfit-card').forEach(c=>c.classList.remove('wearing'));
  el.classList.add('wearing');
  document.getElementById('accessoryText').textContent = emoji;
  document.getElementById('outfitName').textContent = look;
  showToast('👗 巴纳比换上了：'+look+'！');
}

function spawnArSparkles(vp){
  for(let i=0;i<6;i++){
    const s = document.createElement('div');
    s.textContent = '✦';
    s.style.cssText = 'position:absolute;color:#FFD700;font-size:'+(9+Math.random()*10)+'px;left:'+(10+Math.random()*80)+'%;top:'+(10+Math.random()*80)+'%;pointer-events:none;transition:all .5s;';
    vp.appendChild(s);
    setTimeout(()=>{s.style.opacity='0';s.style.transform='translateY(-18px)';}, 50);
    setTimeout(()=>s.remove(), 600);
  }
}

function spawnHomePetSparkles(){
  const disp = document.getElementById('homePetDisplay');
  if (!disp) return;
  const icons = ['💖','✨','💫','⭐','🌟'];
  for (let i = 0; i < 7; i++){
    const el = document.createElement('div');
    el.textContent = icons[Math.floor(Math.random() * icons.length)];
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText = 'position:absolute;pointer-events:none;z-index:8;left:'+(12+Math.random()*76)+'%;top:'+(18+Math.random()*58)+'%;font-size:'+(12+Math.random()*11)+'px;opacity:0.95;transition:opacity .35s ease, transform .65s ease;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.2));';
    disp.appendChild(el);
    requestAnimationFrame(function(){
      el.style.opacity = '0';
      el.style.transform = 'translateY(-40px) scale(1.15)';
    });
    setTimeout(function(){ if (el.parentNode) el.remove(); }, 720);
  }
}
