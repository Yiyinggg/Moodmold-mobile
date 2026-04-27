const HOME_SCENES = {
  home: { label: '家庭环境' },
  park: { label: '公园绿地' },
  street: { label: '城市街道' },
  playground: { label: '欢乐游乐场' }
};
function setHomeScene(id){
  if (!HOME_SCENES[id]) return;
  const hero = document.querySelector('#sc-home .home-hero');
  hero.classList.remove('scene-park','scene-street','scene-playground');
  if (id !== 'home') hero.classList.add('scene-' + id);
  document.querySelectorAll('#sc-home .scene-chip').forEach(btn=>{
    const on = btn.getAttribute('data-scene') === id;
    btn.classList.toggle('on', on);
    btn.setAttribute('aria-selected', on ? 'true' : 'false');
  });
  document.getElementById('homeLocationText').textContent = HOME_SCENES[id].label;
}

const HOME_PET_REF_SCALE = 3.51;
const HOME_PET_CAT_SUSU_SCALE = (2.48 / 3) * 1.5;
const HOME_PETS = [
  { name: '巴纳比', img: 'assets/homedog.png', scale: HOME_PET_REF_SCALE },
  { name: '露露', img: 'assets/homecat.png', scale: HOME_PET_CAT_SUSU_SCALE },
  { name: '糯糯', img: 'assets/homecat2.png', scale: HOME_PET_CAT_SUSU_SCALE },
  { name: '波波', img: 'assets/homesusu.png', scale: HOME_PET_CAT_SUSU_SCALE }
];
let homePetIndex = 0;
let petRotY = 0;
let pet3dSuppressTap = false;
let pet3dDragging = false;
let pet3dLastX = null;

function applyHomePetUI(){
  const p = HOME_PETS[homePetIndex];
  const nameEl = document.getElementById('homePetName');
  const img = document.getElementById('homePetImg');
  if (!nameEl || !img) return;
  nameEl.textContent = p.name;
  img.src = p.img;
  img.style.filter = 'drop-shadow(0 8px 20px rgba(0,0,0,0.18))';
  var sc = typeof p.scale === 'number' ? p.scale : HOME_PET_REF_SCALE;
  img.style.transform = 'scale(' + sc + ')';
  var spin = document.getElementById('homePetSpin');
  if (spin) spin.style.transform = 'rotateY(' + petRotY + 'deg)';
  document.querySelectorAll('#petSwDots .pet-sw-dot').forEach(function(d, i){
    d.classList.toggle('on', i === homePetIndex);
    d.setAttribute('aria-selected', i === homePetIndex ? 'true' : 'false');
    d.setAttribute('aria-label', '宠物：' + HOME_PETS[i].name);
  });
}

function setHomePet(delta){
  const n = HOME_PETS.length;
  const prev = homePetIndex;
  homePetIndex = (homePetIndex + delta + n * 10) % n;
  if (prev !== homePetIndex) petRotY = 0;
  applyHomePetUI();
}

function initHomePetSwitcher(){
  const dots = document.getElementById('petSwDots');
  if (!dots) return;
  dots.innerHTML = '';
  HOME_PETS.forEach(function(_, i){
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pet-sw-dot';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', '宠物：' + HOME_PETS[i].name);
    b.setAttribute('aria-selected', i === homePetIndex ? 'true' : 'false');
    b.addEventListener('click', function(){
      homePetIndex = i;
      petRotY = 0;
      applyHomePetUI();
    });
    dots.appendChild(b);
  });
  applyHomePetUI();
  initHomePet3DRotate();
}

function initHomePet3DRotate(){
  const stage = document.getElementById('homePet3DStage');
  const spin = document.getElementById('homePetSpin');
  if (!stage || !spin) return;
  function endDrag(e){
    pet3dDragging = false;
    pet3dLastX = null;
    try { stage.releasePointerCapture(e.pointerId); } catch (err) {}
    if (pet3dSuppressTap) setTimeout(function(){ pet3dSuppressTap = false; }, 380);
  }
  stage.addEventListener('pointerdown', function(e){
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    pet3dDragging = true;
    pet3dLastX = e.clientX;
    pet3dSuppressTap = false;
    try { stage.setPointerCapture(e.pointerId); } catch (err) {}
  });
  stage.addEventListener('pointermove', function(e){
    if (!pet3dDragging || pet3dLastX === null) return;
    var dx = e.clientX - pet3dLastX;
    pet3dLastX = e.clientX;
    if (Math.abs(dx) > 6) pet3dSuppressTap = true;
    petRotY += dx * 0.5;
    spin.style.transform = 'rotateY(' + petRotY + 'deg)';
  });
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
}

function tapPet(ctx){
  if (ctx === 'home' && pet3dSuppressTap) return;
  if(ctx==='ar'){
    spawnArSparkles(document.getElementById('arViewport'));
    setStat('love', Math.min(100, parseInt(document.getElementById('ar-love').textContent)+2));
    syncStats();
  }
  if (ctx === 'home'){
    spawnHomePetSparkles();
    const cur = parseInt(document.getElementById('ar-mood').textContent, 10);
    const base = isNaN(cur) ? 88 : cur;
    setStat('mood2', Math.min(100, base + 1));
    syncStats();
    const disp = document.getElementById('homePetDisplay');
    if (disp){
      disp.classList.add('pet-tap-fx');
      setTimeout(function(){ disp.classList.remove('pet-tap-fx'); }, 460);
    }
  }
  const nm = document.getElementById('homePetName') && document.getElementById('homePetName').textContent;
  if (ctx === 'home'){
    showToast('😊 心情 +1！' + (nm || '宠物') + ' 好开心！');
  } else {
    showToast('🐾 ' + (nm || '宠物') + ' 摇了摇尾巴！');
  }
}

function addLove(){
  setStat('love', Math.min(100, parseInt(document.getElementById('h-love').textContent)+3));
  const nm = document.getElementById('homePetName') && document.getElementById('homePetName').textContent;
  showToast('❤️ ' + (nm || '宠物') + ' 感受到你的爱！');
}
