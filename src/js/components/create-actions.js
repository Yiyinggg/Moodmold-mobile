/* ── CREATE ACTION SHEET ── */
function openCreateSheet(){
  document.getElementById('createActionOverlay').classList.add('open');
}
function closeCreateSheet(e){
  if(e.target===document.getElementById('createActionOverlay'))
    document.getElementById('createActionOverlay').classList.remove('open');
}
function openCreateLog(){
  document.getElementById('createActionOverlay').classList.remove('open');
  initLogScreen();
  goTo('sc-log');
}
function openCreatePet(){
  document.getElementById('createActionOverlay').classList.remove('open');
  goTo('sc-create');
}
