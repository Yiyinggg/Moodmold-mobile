var studioState = {
  mode: 'video',
  duration: 15,
  postCount: 2,
  status: 'idle',
  outputs: []
};

function getIpCompleteness(){
  return 100;
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
  var quickNav = document.getElementById('communityMineQuickNav');
  if (btnOthers) btnOthers.classList.toggle('on', mode === 'others');
  if (btnMine) btnMine.classList.toggle('on', mode === 'mine');
  if (panelOthers) panelOthers.style.display = mode === 'others' ? 'flex' : 'none';
  if (panelMine) panelMine.style.display = mode === 'mine' ? 'flex' : 'none';
  if (quickNav) quickNav.style.display = 'block';
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

function quickShareToSocial(){
  showToast('📣 已一键发送到社交媒体');
}

function getStudioHintForCompleteness(completeness){
  if (completeness >= 50) return '';
  return '补全2项设定可提升动画质量';
}

function renderStudioHint(){
  var hint = document.getElementById('studioHintText');
  if (!hint) return;
  hint.textContent = getStudioHintForCompleteness(getIpCompleteness());
}

function setStudioMode(mode){
  studioState.mode = mode === 'post' ? 'post' : 'video';
  var modeVideo = document.getElementById('studioModeVideo');
  var modePost = document.getElementById('studioModePost');
  if (modeVideo) modeVideo.classList.toggle('on', studioState.mode === 'video');
  if (modePost) modePost.classList.toggle('on', studioState.mode === 'post');
  var title = document.getElementById('studioMainTitle');
  if (title) title.textContent = studioState.mode === 'post' ? '生成 IP 图文' : '生成宠物动画';
  var d15 = document.getElementById('studioDuration15');
  var d30 = document.getElementById('studioDuration30');
  if (studioState.mode === 'post') {
    if (d15) d15.textContent = '2张图';
    if (d30) d30.textContent = '4张图';
    if (d15) d15.classList.toggle('on', studioState.postCount === 2);
    if (d30) d30.classList.toggle('on', studioState.postCount === 4);
  } else {
    if (d15) d15.textContent = '15s';
    if (d30) d30.textContent = '30s';
    if (d15) d15.classList.toggle('on', studioState.duration === 15);
    if (d30) d30.classList.toggle('on', studioState.duration === 30);
  }
}

function pickStudioDuration(seconds){
  if (studioState.mode === 'post') {
    studioState.postCount = seconds === 30 ? 4 : 2;
  } else {
    studioState.duration = seconds;
  }
  var d15 = document.getElementById('studioDuration15');
  var d30 = document.getElementById('studioDuration30');
  if (studioState.mode === 'post') {
    if (d15) d15.classList.toggle('on', studioState.postCount === 2);
    if (d30) d30.classList.toggle('on', studioState.postCount === 4);
  } else {
    if (d15) d15.classList.toggle('on', seconds === 15);
    if (d30) d30.classList.toggle('on', seconds === 30);
  }
}

function renderCommunityMineOutputs(){
  var list = document.getElementById('communityMineList');
  if (!list) return;
  if (!studioState.outputs.length){
    list.innerHTML = '<div style="background:#fff;border:1px solid rgba(0,0,0,0.06);border-radius:14px;padding:8px;"><img src="assets/腊肠犬晚上奔跑动画风格照片.png" alt="巴纳比视频缩略图-夜跑冲刺" loading="lazy" decoding="async" style="width:100%;height:168px;border-radius:10px;object-fit:cover;display:block;"/><div style="padding:8px 4px 2px;"><div class="profile-menu-name">巴纳比 · 夜跑冲刺</div><div class="profile-menu-sub">视频 · 30s · 刚刚生成</div></div><div style="display:flex;justify-content:flex-end;"><span class="profile-menu-badge" style="background:#f0f0ff;color:var(--blue2);">视频</span></div></div><div style="background:#fff;border:1px solid rgba(0,0,0,0.06);border-radius:14px;padding:8px;"><img src="assets/腊肠犬撒娇照片.png" alt="巴纳比图文缩略图-撒娇时刻" loading="lazy" decoding="async" style="width:100%;height:168px;border-radius:10px;object-fit:cover;display:block;"/><div style="padding:8px 4px 2px;"><div class="profile-menu-name">巴纳比 · 今天的撒娇日记</div><div class="profile-menu-sub">图文 · 4 张图 · 刚刚生成</div></div><div style="display:flex;justify-content:flex-end;"><span class="profile-menu-badge" style="background:#fff4ec;color:var(--orange);">图文</span></div></div><div style="background:#fff;border:1px solid rgba(0,0,0,0.06);border-radius:14px;padding:8px;"><img src="assets/腊肠犬玩具挑战赛照片.png" alt="巴纳比视频缩略图-玩具挑战赛" loading="lazy" decoding="async" style="width:100%;height:168px;border-radius:10px;object-fit:cover;display:block;"/><div style="padding:8px 4px 2px;"><div class="profile-menu-name">巴纳比 · 玩具挑战赛</div><div class="profile-menu-sub">视频 · 15s · 2 小时前</div></div><div style="display:flex;justify-content:flex-end;"><span class="profile-menu-badge" style="background:#f0f0ff;color:var(--blue2);">视频</span></div></div><div style="background:#fff;border:1px solid rgba(0,0,0,0.06);border-radius:14px;padding:8px;"><img src="assets/腊肠犬午后治愈.png" alt="巴纳比图文缩略图-治愈午后" loading="lazy" decoding="async" style="width:100%;height:168px;border-radius:10px;object-fit:cover;display:block;"/><div style="padding:8px 4px 2px;"><div class="profile-menu-name">巴纳比 · 治愈午后图文</div><div class="profile-menu-sub">图文 · 2 张图 · 今天 16:20</div></div><div style="display:flex;justify-content:flex-end;"><span class="profile-menu-badge" style="background:#fff4ec;color:var(--orange);">图文</span></div></div><div style="background:#fff;border:1px solid rgba(0,0,0,0.06);border-radius:14px;padding:8px;"><img src="assets/腊肠犬回家第一秒.png" alt="巴纳比视频缩略图-回家第一秒" loading="lazy" decoding="async" style="width:100%;height:168px;border-radius:10px;object-fit:cover;display:block;"/><div style="padding:8px 4px 2px;"><div class="profile-menu-name">巴纳比 · 回家第一秒</div><div class="profile-menu-sub">视频 · 30s · 昨天 21:08</div></div><div style="display:flex;justify-content:flex-end;"><span class="profile-menu-badge" style="background:#f0f0ff;color:var(--blue2);">视频</span></div></div><div style="background:#fff;border:1px solid rgba(0,0,0,0.06);border-radius:14px;padding:8px;"><img src="assets/腊肠犬雨天陪伴.png" alt="巴纳比图文缩略图-雨天陪伴" loading="lazy" decoding="async" style="width:100%;height:168px;border-radius:10px;object-fit:cover;display:block;"/><div style="padding:8px 4px 2px;"><div class="profile-menu-name">巴纳比 · 雨天陪伴手账</div><div class="profile-menu-sub">图文 · 4 张图 · 昨天 18:42</div></div><div style="display:flex;justify-content:flex-end;"><span class="profile-menu-badge" style="background:#fff4ec;color:var(--orange);">图文</span></div></div>';
    return;
  }
  list.innerHTML = studioState.outputs.slice(0, 6).map(function(item){
    var preview = item.type === 'post' ? 'assets/homedog.png' : 'assets/dogphoto.png';
    var subtitle = item.type === 'post' ? '图文内容 · 刚刚生成' : '视频内容 · 刚刚生成';
    var badgeBg = item.type === 'post' ? '#fff4ec' : '#f0f0ff';
    var badgeColor = item.type === 'post' ? 'var(--orange)' : 'var(--blue2)';
    var badgeText = item.type === 'post' ? '图文' : '视频';
    return '<div style="background:#fff;border:1px solid rgba(0,0,0,0.06);border-radius:14px;padding:8px;"><img src="' + preview + '" alt="我的创作缩略图" loading="lazy" decoding="async" style="width:100%;height:168px;border-radius:10px;object-fit:cover;display:block;"/><div style="padding:8px 4px 2px;"><div class="profile-menu-name">' + item.title + '</div><div class="profile-menu-sub">' + subtitle + '</div></div><div style="display:flex;justify-content:flex-end;"><span class="profile-menu-badge" style="background:' + badgeBg + ';color:' + badgeColor + ';">' + badgeText + '</span></div></div>';
  }).join('');
}

function renderStudioOutputs(){
  var result = document.getElementById('studioResultCard');
  var previewMedia = document.getElementById('studioPreviewMedia');
  var previewMeta = document.getElementById('studioPreviewMeta');
  if (!result) return;
  result.classList.remove('studio-result--loading');
  if (!studioState.outputs.length){
    result.innerHTML = '<div class="studio-result-title">还没有生成内容</div><div class="studio-result-sub">试试模板：宠物短视频 15s 或 图文 2张图</div>';
    if (previewMedia) previewMedia.innerHTML = '暂无可预览结果';
    if (previewMeta) previewMeta.textContent = '先点击 AI一键生成 或选择模式生成内容';
    renderCommunityMineOutputs();
    return;
  }
  var top = studioState.outputs[0];
  result.innerHTML = '<div class="studio-result-title">最新作品</div><div class="studio-result-sub">' + top.title + '</div>';
  if (previewMedia) {
    if (top.type === 'post') {
      previewMedia.innerHTML = '<img src="assets/homedog.png" alt="图文生成结果预览" loading="lazy" decoding="async" style="width:100%;height:100%;border-radius:10px;object-fit:cover;display:block;"/>';
    } else {
      previewMedia.innerHTML = '<div style="position:relative;width:100%;height:100%;"><img src="assets/dogphoto.png" alt="视频生成结果预览" loading="lazy" decoding="async" style="width:100%;height:100%;border-radius:10px;object-fit:cover;display:block;"/><span style="position:absolute;right:10px;bottom:10px;background:rgba(0,0,0,0.55);color:#fff;font-size:10px;font-weight:800;padding:3px 7px;border-radius:10px;">▶ ' + (studioState.duration || 15) + 's</span></div>';
    }
  }
  if (previewMeta) previewMeta.textContent = top.type === 'post' ? '图文预览 · 可发布到社群与外部平台' : '视频预览 · 可保存至本地或发布';
  renderCommunityMineOutputs();
}

function startStudioGeneration(){
  var prompt = getStudioPromptText();
  var status = document.getElementById('studioStatusPill');
  var result = document.getElementById('studioResultCard');
  renderStudioHint();
  studioState.status = 'generating';
  if (status) status.textContent = '生成中';
  if (result) {
    result.classList.add('studio-result--loading');
    if (studioState.mode === 'post') {
      result.innerHTML = '<div class="studio-result-title">正在生成 IP 图文...</div><div class="studio-result-sub">请稍候，正在根据你的文字描述编排文案与配图</div>';
    } else {
      result.innerHTML = '<div class="studio-result-title">正在生成宠物动画...</div><div class="studio-result-sub">请稍候，正在根据你的文字描述合成 ' + studioState.duration + ' 秒视频</div>';
    }
  }
  var previewMedia = document.getElementById('studioPreviewMedia');
  var previewMeta = document.getElementById('studioPreviewMeta');
  if (previewMedia) previewMedia.innerHTML = '<div style="font-size:12px;color:var(--muted);font-weight:700;">正在生成预览…</div>';
  if (previewMeta) previewMeta.textContent = studioState.mode === 'post' ? '图文内容生成中，请稍候' : '视频内容生成中，请稍候';
  setTimeout(function(){
    studioState.status = 'done';
    var promptBrief = prompt ? (' · ' + prompt) : '';
    var output = {
      id: Date.now(),
      type: studioState.mode,
      title: studioState.mode === 'post'
        ? ('图文 · ' + studioState.postCount + '张图' + promptBrief)
        : ('视频 · ' + studioState.duration + 's' + promptBrief)
    };
    studioState.outputs.unshift(output);
    if (status) status.textContent = '已完成';
    renderStudioOutputs();
    showToast(studioState.mode === 'post' ? '📝 图文已生成，可立即发布' : '🎬 动画已生成，可立即保存或发布');
  }, 1200);
}

function startAnimationGenerationFromUI(){
  setStudioMode('video');
  startStudioGeneration();
}

function startPostGenerationFromUI(){
  setStudioMode('post');
  startStudioGeneration();
}

function startAIOneClickGeneration(){
  startStudioGeneration();
}

function getStudioPromptText(){
  var el = document.getElementById('studioPromptInput');
  if (!el) return '';
  var txt = el.value.trim();
  if (!txt) return '';
  if (txt.length <= 24) return txt;
  return txt.slice(0, 24) + '...';
}

function saveStudioOutput(){
  if (!studioState.outputs.length) {
    showToast('📭 先生成一个内容');
    return;
  }
  showToast('💾 已保存到作品库');
}

function publishStudioOutput(){
  if (!studioState.outputs.length) {
    showToast('📭 先生成一个内容');
    return;
  }
  showToast('🚀 已发布到内容流');
}

function publishToPlatform(platform){
  if (!studioState.outputs.length) {
    showToast('📭 先生成一个内容再发布到' + platform);
    return;
  }
  showToast('🚀 已发布到' + platform);
}
