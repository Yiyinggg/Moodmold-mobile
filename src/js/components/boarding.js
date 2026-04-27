function buildBoardingText(){
  const phone = (document.getElementById('boarding-phone').value.trim()) || '138-XXXX-XXXX';
  const dates = (document.getElementById('boarding-dates').value.trim()) || '（未填写）';
  const note  = (document.getElementById('boarding-note').value.trim())  || '无';
  return [
    '🐾 ━━━━━ 宠物寄养信息卡 ━━━━━',
    '',
    '【基本信息】',
    '姓名：巴纳比　品种：腊肠犬　性别：公',
    '年龄：3 岁　体重：6.2 kg　性格：ENFP 活力使者',
    '',
    '【喂食 · 每天 2 次】',
    '早 7:30 / 晚 18:00，每次 80g 成犬粮',
    '可加少量胡萝卜或鸡肉丝作为零食',
    '',
    '【饮水】',
    '保持清水随时可喝，每天换水，日饮约 200ml',
    '',
    '【遛狗 · 每天 2 次】',
    '早晚各约 20 分钟，勿让其跳高（脊椎敏感）',
    '',
    '【饮食禁忌 ⚠️】',
    '❌ 葡萄 / 葡萄干　❌ 巧克力　❌ 洋葱',
    '',
    '【用药】',
    '每月 1 次体外驱虫滴剂，下次：5月15日',
    '无长期用药',
    '',
    '【生活习惯】',
    '睡前需陪伴约 10 分钟，喜抱小鸭玩具入睡',
    '独处超过 3 小时易焦虑；对雷声敏感，打雷时请陪伴安抚',
    '',
    '【紧急联系】',
    '主人：' + phone,
    '兽医：阳光宠物医院 010-XXXX-XXXX',
    '',
    '【寄养时间】' + dates,
    '',
    '【特别叮嘱】',
    note,
    '',
    '━━━━━━━━━━━━━━━━━━━━',
    '由 Moodmold 宠物档案生成 🐶'
  ].join('\n');
}

let _lastBoardingText = '';

function copyBoardingText(){
  if (!_lastBoardingText) return;
  if (navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(_lastBoardingText).then(function(){
      showToast('📋 已复制！');
    }).catch(function(){
      fallbackCopy(_lastBoardingText);
    });
  } else {
    fallbackCopy(_lastBoardingText);
  }
}

function fallbackCopy(text){
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;';
  document.body.appendChild(ta);
  ta.focus(); ta.select();
  try { document.execCommand('copy'); showToast('📋 已复制！'); }
  catch(e){ showToast('请手动长按复制'); }
  document.body.removeChild(ta);
}

function doShareBoarding(mode){
  const text = buildBoardingText();
  _lastBoardingText = text;
  const overlay = document.getElementById('boardingShareOverlay');
  const iconEl  = document.getElementById('boardingShareIcon');
  const titleEl = document.getElementById('boardingShareTitle');
  const subEl   = document.getElementById('boardingShareSub');
  const textEl  = document.getElementById('boardingShareText');
  textEl.textContent = text;

  if (mode === 'copy' || mode === 'main'){
    iconEl.textContent  = '📋';
    titleEl.textContent = '寄养信息已就绪';
    subEl.textContent   = '点击下方按钮复制，粘贴发送给寄养人';
    overlay.classList.add('open');
    copyBoardingText();
  } else if (mode === 'wechat'){
    iconEl.textContent  = '💬';
    titleEl.textContent = '微信发送';
    subEl.textContent   = '复制后，打开微信粘贴发送给寄养人';
    overlay.classList.add('open');
    copyBoardingText();
  } else if (mode === 'sms'){
    iconEl.textContent  = '📱';
    titleEl.textContent = '短信发送';
    subEl.textContent   = '内容已复制，打开短信粘贴发送';
    overlay.classList.add('open');
    copyBoardingText();
  } else if (mode === 'qr'){
    iconEl.textContent  = '🔗';
    titleEl.textContent = '分享链接';
    subEl.textContent   = '内容已复制，可粘贴至任意聊天';
    overlay.classList.add('open');
    copyBoardingText();
    showToast('🔗 链接已生成并复制！');
  }
}

function closeBoardingSheet(e){
  if (e.target === document.getElementById('boardingShareOverlay')){
    document.getElementById('boardingShareOverlay').classList.remove('open');
  }
}
