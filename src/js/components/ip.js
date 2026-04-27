function getIpCompleteness(){
  return 100;
}

function initIpScreen(){
  var homeName = document.getElementById('homePetName');
  var ipName = document.getElementById('ipVirtualName');
  if (homeName && ipName) ipName.textContent = homeName.textContent.trim() || '巴纳比';
}

function openStudioWithMode(mode){
  goTo('sc-studio');
  if (typeof setStudioMode === 'function') setStudioMode(mode);
}

function quickShareToSocial(){
  showToast('📣 已一键发送到社交媒体');
}

function openIpCommunity(){
  goTo('sc-community');
  setCommunityTab('others');
}

function setCommunityTab(tab){
  var mode = tab === 'mine' ? 'mine' : 'others';
  var btnOthers = document.getElementById('communityTabOthers');
  var btnMine = document.getElementById('communityTabMine');
  var panelOthers = document.getElementById('communityPanelOthers');
  var panelMine = document.getElementById('communityPanelMine');
  if (btnOthers) btnOthers.classList.toggle('on', mode === 'others');
  if (btnMine) btnMine.classList.toggle('on', mode === 'mine');
  if (panelOthers) panelOthers.style.display = mode === 'others' ? 'flex' : 'none';
  if (panelMine) panelMine.style.display = mode === 'mine' ? 'flex' : 'none';
}

function toggleCommunityLike(btn){
  toggleCommunityCount(btn, '点赞');
}

function toggleCommunityFav(btn){
  toggleCommunityCount(btn, '收藏');
}

function toggleCommunityCount(btn, label){
  if (!btn) return;
  var countEl = btn.querySelector('span');
  if (!countEl) return;
  var cur = parseInt(countEl.textContent, 10);
  if (isNaN(cur)) cur = 0;
  var active = btn.classList.toggle('on');
  countEl.textContent = String(Math.max(0, cur + (active ? 1 : -1)));
  showToast((active ? '✅ 已' : '↩️ 取消') + label);
}
