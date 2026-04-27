function goTo(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  var target = document.getElementById(id);
  if (!target) return;
  target.classList.add('active');
  syncBottomNav(id);
}

function syncBottomNav(activeId){
  document.querySelectorAll('.bottom-nav .nav-item[data-target]').forEach(function(btn){
    var isActive = btn.getAttribute('data-target') === activeId;
    btn.classList.toggle('nav-item--current', isActive);
    btn.setAttribute('aria-current', isActive ? 'page' : 'false');
    var icon = btn.querySelector('.nav-icon');
    var label = btn.querySelector('.nav-lbl');
    if (icon) icon.classList.toggle('active', isActive);
    if (label) label.classList.toggle('active', isActive);
  });
}
