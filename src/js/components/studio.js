var studioState = {
  mode: 'video',
  duration: 15,
  postCount: 2,
  status: 'idle',
  outputs: []
};

function initStudioScreen(){
  var d15 = document.getElementById('studioDuration15');
  var d30 = document.getElementById('studioDuration30');
  if (d15) d15.classList.add('on');
  if (d30) d30.classList.remove('on');
  renderStudioHint();
  renderStudioOutputs();
  renderCommunityMineOutputs();
  setStudioMode('video');
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

function getStudioHintForCompleteness(completeness){
  if (completeness >= 50) return '';
  return '补全2项设定可提升动画质量';
}

function renderStudioHint(){
  var hint = document.getElementById('studioHintText');
  if (!hint) return;
  var pct = typeof getIpCompleteness === 'function' ? getIpCompleteness() : 0;
  hint.textContent = getStudioHintForCompleteness(pct);
}

function startAnimationGenerationFromUI(){
  setStudioMode('video');
  startStudioGeneration();
}

function startPostGenerationFromUI(){
  setStudioMode('post');
  startStudioGeneration();
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

function getStudioPromptText(){
  var el = document.getElementById('studioPromptInput');
  if (!el) return '';
  var txt = el.value.trim();
  if (!txt) return '';
  if (txt.length <= 24) return txt;
  return txt.slice(0, 24) + '...';
}

function renderStudioOutputs(){
  var result = document.getElementById('studioResultCard');
  if (!result) return;
  result.classList.remove('studio-result--loading');
  if (!studioState.outputs.length){
    result.innerHTML = '<div class="studio-result-title">还没有生成内容</div><div class="studio-result-sub">试试模板：日常撒娇 15s 或 今日治愈图文</div>';
    renderCommunityMineOutputs();
    return;
  }
  var top = studioState.outputs[0];
  result.innerHTML = '<div class="studio-result-title">最新作品</div><div class="studio-result-sub">' + top.title + '</div>';
  renderCommunityMineOutputs();
}

function renderCommunityMineOutputs(){
  var list = document.getElementById('communityMineList');
  if (!list) return;
  if (!studioState.outputs.length){
    list.innerHTML = '<div class="profile-menu-item"><div class="profile-menu-icon" style="background:#f3f0ff;">📭</div><div class="profile-menu-text"><div class="profile-menu-name">还没有创作内容</div><div class="profile-menu-sub">去内容工坊生成第一条图文或视频</div></div></div>';
    return;
  }
  list.innerHTML = studioState.outputs.slice(0, 3).map(function(item){
    var icon = item.type === 'post' ? '📝' : '🎬';
    var iconBg = item.type === 'post' ? '#fff4ec' : '#f3f0ff';
    var subtitle = item.type === 'post' ? '图文内容 · 刚刚生成' : '视频内容 · 刚刚生成';
    return '<div class="profile-menu-item"><div class="profile-menu-icon" style="background:' + iconBg + ';">' + icon + '</div><div class="profile-menu-text"><div class="profile-menu-name">' + item.title + '</div><div class="profile-menu-sub">' + subtitle + '</div></div><span class="profile-menu-arrow">›</span></div>';
  }).join('');
}

function saveStudioOutput(){
  if (!studioState.outputs.length) {
    showToast('📭 先生成一个宠物动画');
    return;
  }
  showToast('💾 已保存到作品库');
}

function publishStudioOutput(){
  if (!studioState.outputs.length) {
    showToast('📭 先生成一个宠物动画');
    return;
  }
  showToast('🚀 已发布到内容流');
}

function reuseStudioTemplate(){
  if (!studioState.outputs.length) {
    showToast('📭 先生成一个宠物动画');
    return;
  }
  showToast('🧩 模板已复用');
}
