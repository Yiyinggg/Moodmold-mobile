/* ── LOG SCREEN ── */
const LOG_TYPE_META = {
  behavior:{ label:'行为', icon:'🐾', color:'#7B6EF6', bg:'#f3f0ff', textColor:'#5040c0' },
  feeding: { label:'饮食', icon:'🍽️', color:'#F07830', bg:'#fff4ec', textColor:'#b85010' },
  health:  { label:'健康', icon:'💊', color:'#3DC87A', bg:'#e8fff2', textColor:'#1a7a44' },
  mood:    { label:'情绪', icon:'😊', color:'#e879c0', bg:'#fff0f8', textColor:'#a03080' },
  play:    { label:'玩耍', icon:'🎾', color:'#8A8FD4', bg:'#f0f0ff', textColor:'#4048a0' },
  other:   { label:'其他', icon:'✏️', color:'#999',    bg:'#f5f5f5', textColor:'#555' }
};
const LOG_AI_TAGS = {
  behavior:['狗狗社交','主动探索','嗅闻行为','服从指令','追逐玩耍','分离焦虑','领地意识'],
  feeding: ['食欲正常','进食顺利','偏爱零食','饮水充足','消化良好','挑食了','吃得少'],
  health:  ['精神饱满','睡眠充足','四肢灵活','体重正常','需要关注','轻微异常','活力十足'],
  mood:    ['情绪稳定','活泼开朗','略显焦虑','依恋主人','好奇探索','有些紧张','非常开心'],
  play:    ['运动积极','玩具互动','户外探索','体力充沛','需要休息','玩耍投入','捡球达人'],
  other:   ['日常记录','特殊情况','需要跟进','值得纪念','行为异常','好消息']
};

let curLogType = 'behavior';
let logVoiceRecording = false;
let logVoiceInterval = null;
let logVoiceSecs = 0;
let logVoiceHasSaved = false;
let logPhotos = [];
let logFiles = [];

const LOG_RECORDS = [
  { id:1, type:'behavior', date:'昨天 09:15',
    text:'早上散步遇到了另一只腊肠犬，两只狗玩得非常开心，互相追逐了很久，归来时还是满身泥。',
    tags:['社交积极','运动充足','户外探索'], photoSrc:'assets/dogtoy.png' },
  { id:2, type:'feeding',  date:'昨天 18:32',
    text:'今天巴纳比吃了整整两份零食，食欲非常好！加了一点点胡萝卜丁，他也乖乖吃完了。',
    tags:['进食顺利','食欲旺盛','饮水充足'] },
  { id:3, type:'health',   date:'2天前',
    text:'今天睡眠时间比平时长了约两小时，可能是昨天运动量太大的缘故。精神状态正常，无异常表现。',
    tags:['睡眠偏多','精神正常','需要关注'], hasVoice:true, voiceDur:'00:32' },
  { id:4, type:'mood',     date:'3天前',
    text:'打雷声响了一次，巴纳比躲在沙发底下不肯出来，陪伴了约20分钟后情绪平稳下来。',
    tags:['略显焦虑','依恋主人','情绪平稳'] }
];

function initLogScreen(){
  const nameEl = document.getElementById('homePetName');
  const n = nameEl ? nameEl.textContent.trim() : '巴纳比';
  const el = document.getElementById('logPetName2');
  if(el) el.textContent = n;
  const now = new Date();
  const days = ['日','一','二','三','四','五','六'];
  const dateEl = document.getElementById('logDateStr');
  if(dateEl) dateEl.textContent = `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 周${days[now.getDay()]}`;
  renderLogTimeline();
}

function selectLogType(type, el){
  curLogType = type;
  document.querySelectorAll('#sc-log .log-type-chip').forEach(c=>c.classList.remove('on'));
  el.classList.add('on');
  const sug = document.getElementById('logAISuggest');
  if(sug && sug.style.display!=='none') buildAIChips();
}

function openLogPhoto(){
  const inp = document.getElementById('logPhotoInput');
  if(inp) inp.click();
}
function openLogFile(){
  const inp = document.getElementById('logFileInput');
  if(inp) inp.click();
}

(function initLogInputs(){
  document.addEventListener('DOMContentLoaded', setupLogInputs);
  if(document.readyState!=='loading') setupLogInputs();
  function setupLogInputs(){
    const photoInp = document.getElementById('logPhotoInput');
    if(photoInp) photoInp.addEventListener('change', function(){
      const files = Array.from(this.files||[]);
      files.forEach(f=>{
        if(!f.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = e=>{
          logPhotos.push(e.target.result);
          renderLogPhotos();
        };
        reader.readAsDataURL(f);
      });
      this.value='';
    });
    const fileInp = document.getElementById('logFileInput');
    if(fileInp) fileInp.addEventListener('change', function(){
      Array.from(this.files||[]).forEach(f=>{
        logFiles.push({name:f.name, size:f.size});
        renderLogFiles();
      });
      this.value='';
    });
  }
})();

function renderLogPhotos(){
  const row = document.getElementById('logPhotoRow');
  if(!row) return;
  if(logPhotos.length===0){ row.style.display='none'; row.innerHTML=''; return; }
  row.style.display='flex';
  row.innerHTML = logPhotos.map((src,i)=>`
    <div class="log-photo-thumb">
      <img src="${src}" style="width:100%;height:100%;object-fit:cover;border-radius:10px;display:block;" alt=""/>
      <button class="log-photo-remove" onclick="removeLogPhoto(${i})">✕</button>
    </div>`).join('');
}
function removeLogPhoto(i){ logPhotos.splice(i,1); renderLogPhotos(); }

function renderLogFiles(){
  const row = document.getElementById('logFileRow');
  if(!row) return;
  if(logFiles.length===0){ row.style.display='none'; row.innerHTML=''; return; }
  row.style.display='flex';
  row.innerHTML = logFiles.map((f,i)=>{
    const kb = f.size<1024 ? f.size+'B' : f.size<1048576 ? (f.size/1024).toFixed(1)+'KB' : (f.size/1048576).toFixed(1)+'MB';
    return `<div class="log-file-thumb">📄 <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${f.name}</span><span style="color:var(--muted);font-size:9px;flex-shrink:0;">${kb}</span><span class="log-file-remove" onclick="removeLogFile(${i})">✕</span></div>`;
  }).join('');
}
function removeLogFile(i){ logFiles.splice(i,1); renderLogFiles(); }

function buildWaveBars(){
  const c = document.getElementById('logWaveBars');
  if(!c) return;
  const heights = [8,18,12,24,10,20,16,22,9,18,14,10];
  const durs = [.5,.7,.55,.65,.8,.6,.75,.5,.7,.6,.55,.8];
  c.innerHTML = heights.map((h,i)=>`<div class="log-wave-bar" style="--bh:${h}px;--bd:${durs[i]}s;--dl:${(i*0.06).toFixed(2)}s;"></div>`).join('');
}
function startVoiceRecord(){
  if(logVoiceHasSaved){ showToast('已有一段录音，请先删除'); return; }
  if(logVoiceRecording) return;
  logVoiceRecording = true; logVoiceSecs = 0;
  buildWaveBars();
  const card = document.getElementById('logVoiceCard');
  const saved = document.getElementById('logVoiceSaved');
  const btn = document.getElementById('logVoiceBtn');
  if(card){ card.style.display='flex'; }
  if(saved) saved.style.display='none';
  document.querySelectorAll('#logWaveBars .log-wave-bar').forEach(b=>b.classList.add('live'));
  const timerEl = document.getElementById('logVoiceTimer');
  logVoiceInterval = setInterval(()=>{
    logVoiceSecs++;
    const m = String(Math.floor(logVoiceSecs/60)).padStart(2,'0');
    const s = String(logVoiceSecs%60).padStart(2,'0');
    if(timerEl) timerEl.textContent = m+':'+s;
    if(logVoiceSecs>=120) stopVoiceRecord();
  },1000);
  if(btn){ btn.querySelector('.log-media-icon').textContent='🔴'; btn.querySelector('.log-media-lbl').textContent='录音中'; }
}
function stopVoiceRecord(){
  if(!logVoiceRecording) return;
  logVoiceRecording = false;
  clearInterval(logVoiceInterval);
  const card = document.getElementById('logVoiceCard');
  const saved = document.getElementById('logVoiceSaved');
  const btn = document.getElementById('logVoiceBtn');
  const dur = document.getElementById('logVoiceDur');
  const m = String(Math.floor(logVoiceSecs/60)).padStart(2,'0');
  const s = String(logVoiceSecs%60).padStart(2,'0');
  if(dur) dur.textContent = m+':'+s;
  if(card) card.style.display='none';
  if(saved){ saved.style.display='block'; logVoiceHasSaved=true; }
  if(btn){ btn.querySelector('.log-media-icon').textContent='🎙️'; btn.querySelector('.log-media-lbl').textContent='语音'; }
  showToast('🎙️ 录音已保存 '+m+':'+s);
}
function deleteLogVoice(){
  logVoiceHasSaved=false; logVoiceSecs=0;
  const saved=document.getElementById('logVoiceSaved');
  if(saved) saved.style.display='none';
  showToast('🗑 录音已删除');
}

function triggerAISuggest(){
  const sug = document.getElementById('logAISuggest');
  const loading = document.getElementById('logAILoading');
  const chips = document.getElementById('logAIChips');
  if(!sug) return;
  sug.style.display='block';
  if(chips) chips.innerHTML='';
  if(loading){ loading.style.display='inline'; }
  setTimeout(()=>{
    if(loading) loading.style.display='none';
    buildAIChips();
  }, 900);
}
function buildAIChips(){
  const chips = document.getElementById('logAIChips');
  if(!chips) return;
  const pool = LOG_AI_TAGS[curLogType] || LOG_AI_TAGS.other;
  const pick = pool.slice().sort(()=>Math.random()-.5).slice(0,5);
  chips.innerHTML = pick.map(t=>`<button type="button" class="log-ai-chip" onclick="this.classList.toggle('on')">${t}</button>`).join('');
}

function saveLogEntry(){
  const text = (document.getElementById('logTextarea').value||'').trim();
  if(!text && logPhotos.length===0 && !logVoiceHasSaved && logFiles.length===0){
    showToast('📝 请先输入内容或添加附件');
    return;
  }
  const selectedTags = Array.from(document.querySelectorAll('#logAIChips .log-ai-chip.on')).map(c=>c.textContent);
  const meta = LOG_TYPE_META[curLogType];
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const newEntry = {
    id: Date.now(), type: curLogType, date:'刚刚 '+timeStr,
    text: text || '（附件记录）',
    tags: selectedTags,
    photoSrc: logPhotos.length>0 ? logPhotos[0] : null,
    hasVoice: logVoiceHasSaved,
    voiceDur: logVoiceHasSaved ? document.getElementById('logVoiceDur').textContent : null,
    hasFile: logFiles.length>0, fileName: logFiles.length>0 ? logFiles[0].name : null
  };
  LOG_RECORDS.unshift(newEntry);
  document.getElementById('logTextarea').value='';
  logPhotos=[]; logFiles=[]; logVoiceHasSaved=false; logVoiceSecs=0;
  renderLogPhotos(); renderLogFiles();
  const saved=document.getElementById('logVoiceSaved');
  if(saved) saved.style.display='none';
  const sug=document.getElementById('logAISuggest');
  if(sug) sug.style.display='none';
  renderLogTimeline();
  showToast('✅ 记录已保存！');
}

function renderLogTimeline(){
  const tl = document.getElementById('logTimeline');
  if(!tl) return;
  if(LOG_RECORDS.length===0){ tl.innerHTML='<div style="text-align:center;padding:20px;font-size:12px;color:var(--muted);">暂无记录，快去记录今天的故事吧～</div>'; return; }
  tl.innerHTML = LOG_RECORDS.map(r=>{
    const m = LOG_TYPE_META[r.type]||LOG_TYPE_META.other;
    const photoHtml = r.photoSrc ? `<img class="log-tl-photo" src="${r.photoSrc}" alt="" loading="lazy"/>` : '';
    const fileHtml = r.hasFile && r.fileName ? `<div class="log-file-thumb" style="margin-top:7px;">📄 <span style="font-size:10px;">${r.fileName}</span></div>` : '';
    const voiceHtml = r.hasVoice ? `<div class="log-tl-voice-row"><button class="log-tl-voice-play" onclick="showToast('▶ 播放语音')">▶</button><div class="log-tl-voice-bar"></div><span class="log-tl-voice-dur">${r.voiceDur||'00:32'}</span></div>` : '';
    const tagsHtml = r.tags && r.tags.length ? `<div class="log-tl-tags">${r.tags.map(t=>`<span class="log-tl-tag" style="background:${m.bg};color:${m.textColor};">${t}</span>`).join('')}</div>` : '';
    return `
      <div class="log-tl-item">
        <div class="log-tl-left">
          <div class="log-tl-dot" style="background:${m.bg};">${m.icon}</div>
          <div class="log-tl-line"></div>
        </div>
        <div class="log-tl-card">
          <div class="log-tl-head">
            <span class="log-tl-type" style="background:${m.bg};color:${m.textColor};">${m.label}</span>
            <span class="log-tl-date">${r.date}</span>
          </div>
          <div class="log-tl-text">${r.text}</div>
          ${photoHtml}${fileHtml}${voiceHtml}${tagsHtml}
        </div>
      </div>`;
  }).join('');
}
