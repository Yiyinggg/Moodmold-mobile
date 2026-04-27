let petPhotoDataUrl = null;

function formatBytes(n){
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  return (n / (1024 * 1024)).toFixed(1) + ' MB';
}

function openPetPhotoPicker(){
  document.getElementById('petPhotoInput').click();
}

function setGenOrbPhotoOrEmoji(){
  const orb = document.getElementById('genOrb');
  const sp = document.getElementById('cf-species').value;
  const emojiMap = {dog:'🐶',cat:'🐱',rabbit:'🐰',bird:'🦜'};
  orb.innerHTML = '';
  function addImg(src){
    const im = document.createElement('img');
    im.className = 'gen-orb-img';
    im.src = src;
    im.alt = '';
    im.onerror = function(){
      orb.innerHTML = '';
      orb.textContent = emojiMap[sp] || '🐶';
    };
    orb.appendChild(im);
  }
  if (petPhotoDataUrl){
    addImg(petPhotoDataUrl);
  } else {
    addImg('assets/dogphoto.png');
  }
}

(function initPetPhotoInput(){
  const input = document.getElementById('petPhotoInput');
  const box = document.getElementById('uploadBig');
  const txt = document.getElementById('uploadTxt');
  const sub = document.getElementById('uploadSub');
  const img = document.getElementById('uploadPreviewImg');
  input.addEventListener('change', function(){
    const f = input.files && input.files[0];
    if (!f) return;
    const okType = f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name);
    if (!okType){
      showToast('请选择图片文件');
      input.value = '';
      return;
    }
    const maxBytes = 20 * 1024 * 1024;
    if (f.size > maxBytes){
      showToast('图片请小于 20MB');
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = function(e){
      const dataUrl = e.target.result;
      petPhotoDataUrl = dataUrl;
      let previewDone = false;
      function applyPreview(){
        if (previewDone) return;
        previewDone = true;
        img.onload = null;
        box.classList.add('done','has-preview');
        const name = f.name.length > 24 ? f.name.slice(0,22) + '…' : f.name;
        txt.textContent = name;
        sub.textContent = formatBytes(f.size) + ' · 点击可更换';
        showToast('已读取照片');
      }
      img.onload = applyPreview;
      img.onerror = function(){
        img.onerror = null;
        petPhotoDataUrl = null;
        img.removeAttribute('src');
        box.classList.remove('done','has-preview');
        txt.textContent = '上传宠物照片';
        sub.textContent = '点击选择 · JPG / PNG / HEIC';
        showToast('无法在浏览器中预览此格式，请换用 JPG 或 PNG');
      };
      img.src = dataUrl;
      if (img.complete && img.naturalWidth > 0) applyPreview();
    };
    reader.onerror = function(){
      showToast('读取文件失败');
      input.value = '';
    };
    reader.readAsDataURL(f);
  });
})();

const gSteps = [
  {label:'分析照片中…', pct:20},
  {label:'建模性格中…', pct:40},
  {label:'雕刻 3D 形象中…', pct:65},
  {label:'绑定情绪引擎中…', pct:84},
  {label:'送入 VR 世界！', pct:100}
];
let genInterval = null;

function startGenerate(){
  const name = document.getElementById('cf-name').value.trim() || '巴纳比';
  setGenOrbPhotoOrEmoji();
  document.getElementById('genName').textContent = name;
  document.getElementById('homePetName').textContent = name;
  HOME_PETS[0].name = name;
  goTo('sc-gen');
  let prog = 0;
  clearInterval(genInterval);
  for(let i=0;i<5;i++){
    document.getElementById('gd'+i).className='step-dot s-wait';
    document.getElementById('gt'+i).className='step-txt t-wait';
    document.getElementById('gd'+i).textContent = i+1;
    document.getElementById('gstep'+i).className='step-card step-card--wait';
  }
  genInterval = setInterval(()=>{
    prog += 0.65; if(prog>100) prog=100;
    document.getElementById('genFill').style.width = prog+'%';
    document.getElementById('genPct').textContent = Math.round(prog)+'%';
    const si = gSteps.findIndex(s=>prog<=s.pct);
    const ai = si===-1 ? 4 : si;
    document.getElementById('genLabel').textContent = gSteps[ai].label;
    for(let i=0;i<5;i++){
      const d=document.getElementById('gd'+i), t=document.getElementById('gt'+i);
      const card=document.getElementById('gstep'+i);
      if(i<ai){d.className='step-dot s-done';d.textContent='✓';t.className='step-txt t-done';card.className='step-card step-card--done';}
      else if(i===ai){d.className='step-dot s-active';d.textContent='…';t.className='step-txt t-active';card.className='step-card step-card--active';}
      else{d.className='step-dot s-wait';d.textContent=i+1;t.className='step-txt t-wait';card.className='step-card step-card--wait';}
    }
    if(prog>=100){
      clearInterval(genInterval);
      setTimeout(()=>{goTo('sc-home');showToast('🎉 '+name+' 诞生啦！');}, 700);
    }
  }, 38);
}
