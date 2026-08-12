const flavors = [
  {name:'Berry Blast', slug:'berry-blast', color:'#c95cff', rgb:'201,92,255', desc:'Sweet berry punch with a vivid, juicy finish.'},
  {name:'Watermelon Ice', slug:'watermelon-ice', color:'#6cffaf', rgb:'108,255,175', desc:'Juicy watermelon with a crisp cooling edge.'},
  {name:'Tropical Island', slug:'tropical-island', color:'#ffae42', rgb:'255,174,66', desc:'Mango-forward tropical energy with sunny citrus notes.'},
  {name:'Energy Drink', slug:'energy-drink', color:'#3e72ff', rgb:'62,114,255', desc:'A sharp, classic energy-drink-inspired profile.'},
  {name:'Fresh Mint', slug:'fresh-mint', color:'#5cf59b', rgb:'92,245,155', desc:'Cold, clean mint built around a refreshing finish.'},
  {name:'Cola', slug:'cola', color:'#d64b46', rgb:'214,75,70', desc:'Dark cola character with a sparkling, icy edge.'},
  {name:'Cappuccino', slug:'cappuccino', color:'#d5a162', rgb:'213,161,98', desc:'Creamy coffeehouse character with roasted depth.'}
];
const strengths={
  75:{price:4,caffeine:'75 mg',theanine:'100 mg',alpha:'50 mg',vitd:'5 µg'},
  150:{price:5,caffeine:'150 mg',theanine:'150 mg',alpha:'100 mg',vitd:'5 µg'},
  250:{price:6,caffeine:'250 mg',theanine:'200 mg',alpha:'150 mg',vitd:'10 µg'}
};
let currentFlavor=0,currentStrength=75,cart=[];
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const heroImage=$('#heroImage'),heroFlavor=$('#heroFlavor'),heroPrice=$('#heroPrice'),strengthStamp=$('#strengthStamp');

function setAccent(flavor){
  document.documentElement.style.setProperty('--accent',flavor.color);
  document.documentElement.style.setProperty('--accent-rgb',flavor.rgb);
}
function selectFlavor(index,scroll=false){
  currentFlavor=index; const f=flavors[index]; setAccent(f);
  heroImage.style.opacity='0'; heroImage.style.transform='scale(.94)';
  setTimeout(()=>{heroImage.src=`${f.slug}.webp`;heroImage.alt=`${f.name} 69 caffeine pouch can concept`;heroImage.style.opacity='1';heroImage.style.transform='none'},120);
  heroFlavor.textContent=f.name; $$('.flavor-dot').forEach((d,i)=>d.classList.toggle('active',i===index));
  if(scroll) document.querySelector('.hero').scrollIntoView({behavior:'smooth'});
}
function selectStrength(mg){
  currentStrength=Number(mg); const data=strengths[currentStrength];
  strengthStamp.textContent=`${currentStrength} MG`; heroPrice.textContent=`$${data.price}`;
  $$('.strength-card').forEach(b=>b.classList.toggle('active',Number(b.dataset.strength)===currentStrength));
  $$('#formulaStrengthSelector button').forEach(b=>b.classList.toggle('active',Number(b.dataset.strength)===currentStrength));
  document.querySelector('[data-key=caffeine]').textContent=data.caffeine;
  document.querySelector('[data-key=theanine]').textContent=data.theanine;
  document.querySelector('[data-key=alpha]').textContent=data.alpha;
  document.querySelector('[data-key=vitd]').textContent=data.vitd;
  $$('.strength-mini button').forEach(b=>b.classList.toggle('active',Number(b.dataset.strength)===currentStrength));
}

function buildDots(){
  const wrap=$('#flavorDots'); flavors.forEach((f,i)=>{const b=document.createElement('button');b.className='flavor-dot'+(i===0?' active':'');b.style.background=f.color;b.setAttribute('aria-label',f.name);b.onclick=()=>selectFlavor(i);wrap.appendChild(b)});
}
function buildFlavorGrid(){
  const grid=$('#flavorGrid'); flavors.forEach((f,i)=>{
    const card=document.createElement('article'); card.className='flavor-card reveal'+(i===6?' wide-layout':'');card.style.setProperty('--local',f.color);
    card.innerHTML=`<div class="flavor-card-head"><span>0${i+1} / FLAVOR</span><span>69</span></div>
      <div class="flavor-visual"><img src="${f.slug}.webp" loading="lazy" alt="${f.name} 69 caffeine pouch concept"></div>
      <div class="flavor-card-bottom"><div><h3>${f.name}</h3><p>${f.desc}</p><div class="strength-mini">${[75,150,250].map(s=>`<button type="button" data-strength="${s}" class="${s===currentStrength?'active':''}">${s} MG</button>`).join('')}</div></div><button class="add-button" type="button" aria-label="Add ${f.name} to cart">+</button></div>`;
    card.querySelector('.flavor-visual').onclick=()=>selectFlavor(i,true);
    card.querySelectorAll('.strength-mini button').forEach(b=>b.onclick=(e)=>{e.stopPropagation();selectStrength(b.dataset.strength)});
    card.querySelector('.add-button').onclick=()=>addToCart(i);
    grid.appendChild(card)
  })
}
function addToCart(index){
  const item={id:Date.now()+Math.random(),flavor:index,strength:currentStrength,price:strengths[currentStrength].price};cart.push(item);renderCart();showToast(`${flavors[index].name} · ${currentStrength} mg added`)
}
function renderCart(){
  $('#cartCount').textContent=cart.length;const list=$('#cartItems'); list.innerHTML='';
  $('#cartEmpty').style.display=cart.length?'none':'flex';
  cart.forEach(item=>{const f=flavors[item.flavor];const el=document.createElement('div');el.className='cart-item';el.innerHTML=`<img src="${f.slug}.webp" alt=""><div><strong>${f.name}</strong><small>${item.strength} mg · $${item.price}</small></div><button type="button" aria-label="Remove">×</button>`;el.querySelector('button').onclick=()=>{cart=cart.filter(x=>x.id!==item.id);renderCart()};list.appendChild(el)});
  $('#cartTotal').textContent=`$${cart.reduce((s,x)=>s+x.price,0)}`
}
function openCart(v=true){$('#cartDrawer').classList.toggle('open',v);$('#cartDrawer').setAttribute('aria-hidden',String(!v));document.body.style.overflow=v?'hidden':''}
function showToast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove('show'),1800)}

buildDots();buildFlavorGrid();selectStrength(75);setAccent(flavors[0]);
$$('.strength-card').forEach(b=>b.onclick=()=>selectStrength(b.dataset.strength));
$$('#formulaStrengthSelector button').forEach(b=>b.onclick=()=>selectStrength(b.dataset.strength));
$('#cartButton').onclick=()=>openCart(true);$('#cartClose').onclick=()=>openCart(false);$('#cartBackdrop').onclick=()=>openCart(false);$('#checkoutDemo').onclick=()=>showToast('Demo only — checkout not connected yet');

document.addEventListener('keydown',e=>{if(e.key==='Escape')openCart(false)});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in-view')}),{threshold:.12});$$('.reveal').forEach(el=>observer.observe(el));

document.addEventListener('mousemove',e=>{
  const glow=$('.cursor-glow');glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px';
  const stage=$('#canStage');if(!stage)return;const r=stage.getBoundingClientRect();if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom){
    const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;$('#heroCan').style.transform=`rotateX(${56-y*10}deg) rotateZ(${-13+x*9}deg) translateY(${y*8}px)`
  }
});$('#canStage').addEventListener('mouseleave',()=>$('#heroCan').style.transform='rotateX(56deg) rotateZ(-13deg)');

let auto=0;setInterval(()=>{if(document.visibilityState==='visible'){auto=(auto+1)%flavors.length;selectFlavor(auto)}},6500);
