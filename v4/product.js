const tiers={
  75:{price:4},
  150:{price:5},
  250:{price:6}
};

let strength=75;
const productName=document.body.dataset.productName || '69 Product';
const productSlug=document.body.dataset.productSlug || 'product';
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];

function setStrength(value){
  strength=Number(value);
  const tier=tiers[strength];

  $$('[data-strength]').forEach(btn=>{
    btn.classList.toggle('active',Number(btn.dataset.strength)===strength);
  });

  $('#price').textContent=`$${tier.price}`;
  $('#topPrice').textContent=`$${tier.price}`;
  $('#stickyPrice').textContent=`$${tier.price}`;
  $('#stickyStrength').textContent=`${strength} mg`;
  $('#finalPrice').textContent=`$${tier.price}`;
  $('#finalStrength').textContent=`${strength} mg`;
  $('#caffeineAmount').textContent=`${strength} mg`;
}

function toast(message){
  const el=$('#toast');
  el.textContent=message;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer=setTimeout(()=>el.classList.remove('show'),1800);
}

function add(){
  toast(`${productName} · ${strength} mg added`);
}

$$('[data-strength]').forEach(btn=>{
  btn.addEventListener('click',()=>setStrength(btn.dataset.strength));
});
$('#addMain').addEventListener('click',add);
$('#topAdd').addEventListener('click',add);
$('#stickyAdd').addEventListener('click',add);
$('#finalAdd').addEventListener('click',add);

window.addEventListener('scroll',()=>{
  $('#stickyBuy').classList.toggle('show',window.scrollY>620);
});

/* Reveal */
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add('in-view');
  });
},{threshold:.1});
$$('.reveal').forEach(el=>observer.observe(el));

/* 3D viewer */
const viewer=$('#viewer');
const model=$('#tinModel');
let rotationY=0;
let dragging=false;
let startX=0;
let startRotation=0;

function renderRotation(){
  model.style.transform=`rotateX(-8deg) rotateY(${rotationY}deg)`;
  $$('.view-buttons button').forEach(btn=>{
    const target=Number(btn.dataset.view);
    const normalized=((rotationY%360)+360)%360;
    const t=((target%360)+360)%360;
    let diff=Math.abs(normalized-t);
    diff=Math.min(diff,360-diff);
    btn.classList.toggle('active',diff<25);
  });
}

viewer.addEventListener('pointerdown',e=>{
  dragging=true;
  startX=e.clientX;
  startRotation=rotationY;
  viewer.classList.add('dragging');
  viewer.setPointerCapture(e.pointerId);
});
viewer.addEventListener('pointermove',e=>{
  if(!dragging) return;
  rotationY=startRotation+(e.clientX-startX)*.62;
  renderRotation();
});
function endDrag(){
  dragging=false;
  viewer.classList.remove('dragging');
}
viewer.addEventListener('pointerup',endDrag);
viewer.addEventListener('pointercancel',endDrag);

$$('.view-buttons button').forEach(btn=>{
  btn.addEventListener('click',()=>{
    rotationY=Number(btn.dataset.view);
    renderRotation();
  });
});

setStrength(75);
renderRotation();

window.addEventListener('load',()=>{
  const activeFlavor=document.querySelector('.hero-flavor-card.active');
  if(activeFlavor && window.innerWidth<=1080){
    activeFlavor.scrollIntoView({block:'nearest',inline:'center'});
  }
});
