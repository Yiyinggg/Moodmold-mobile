function openNFC(){document.getElementById('nfcOverlay').classList.add('open');}
function closeSheet(e){if(e.target===document.getElementById('nfcOverlay')) document.getElementById('nfcOverlay').classList.remove('open');}
function doNFC(){
  document.getElementById('nfcOverlay').classList.remove('open');
  setStat('love',100); setStat('mood2',100); syncStats();
  document.getElementById('arMood').textContent = '🌟 已绑定';
  showToast('🔗 巴纳比已完全绑定！');
}

let toastTimer = null;
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 2400);
}
