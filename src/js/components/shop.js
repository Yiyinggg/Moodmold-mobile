function syncShopFigPetName(){
  const hn = document.getElementById('homePetName');
  const sn = document.getElementById('shopFigPetName');
  if (sn) sn.textContent = (hn && hn.textContent.trim()) ? hn.textContent.trim() : '巴纳比';
}

const SHOP_FIG_MAT = { resin: '树脂', wood: '木头', gold: '镀金' };
let shopFigSel = { size: 'S', mat: 'resin' };

function openShopFigurine(){
  syncShopFigPetName();
  goTo('sc-shop-figurine');
}

function selectShopFig(key, val){
  if (key === 'size') shopFigSel.size = val;
  else shopFigSel.mat = val;
  document.querySelectorAll('#sc-shop-figurine .fig-chip[data-fig="' + key + '"]').forEach(btn=>{
    btn.classList.toggle('on', btn.getAttribute('data-val') === val);
  });
  const sum = document.getElementById('shopFigSummary');
  if (sum) sum.textContent = '当前：' + shopFigSel.size + ' 码 · ' + (SHOP_FIG_MAT[shopFigSel.mat] || shopFigSel.mat);
}

function confirmShopFig(){
  const pet = document.getElementById('shopFigPetName');
  const name = pet ? pet.textContent.trim() : '巴纳比';
  const line = document.getElementById('shopFigPayOrderLine');
  if (line) line.textContent = name + ' · ' + shopFigSel.size + ' 码 · ' + SHOP_FIG_MAT[shopFigSel.mat];
  goTo('sc-shop-fig-pay-success');
}
