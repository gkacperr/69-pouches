const flavors = [
  {name:'Berry Blast', slug:'berry-blast', color:'#b04fe5', rgb:'176,79,229', desc:'Juicy berry profile with a vivid finish.'},
  {name:'Watermelon Ice', slug:'watermelon-ice', color:'#49c886', rgb:'73,200,134', desc:'Watermelon with a crisp icy edge.'},
  {name:'Tropical Island', slug:'tropical-island', color:'#efa13a', rgb:'239,161,58', desc:'Bright tropical fruit with sunny notes.'},
  {name:'Energy Drink', slug:'energy-drink', color:'#3e71d7', rgb:'62,113,215', desc:'Classic energy-drink inspired profile.'},
  {name:'Fresh Mint', slug:'fresh-mint', color:'#4ebd78', rgb:'78,189,120', desc:'Cold, clean mint with a refreshing finish.'},
  {name:'Cola', slug:'cola', color:'#a34e34', rgb:'163,78,52', desc:'Dark cola character with an icy finish.'},
  {name:'Cappuccino', slug:'cappuccino', color:'#ae8055', rgb:'174,128,85', desc:'Creamy coffeehouse flavor with roasted depth.'}
];

const strengths = {
  75:{price:4},
  150:{price:5},
  250:{price:6}
};

let currentStrength = 75;
let heroFlavorIndex = 0;
let carouselIndex = 0;
let cart = [];

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const imagePath = f => `${f.slug}-clean-v4.png`;

function setAccent(flavor){
  document.documentElement.style.setProperty('--accent', flavor.color);
  document.documentElement.style.setProperty('--accent-rgb', flavor.rgb);
}

function selectStrength(value){
  currentStrength = Number(value);
  const data = strengths[currentStrength];

  $$('[data-strength]').forEach(btn => {
    btn.classList.toggle('active', Number(btn.dataset.strength) === currentStrength);
  });

  $('#heroPrice').textContent = `$${data.price}`;
  $$('.flavor-price').forEach(el => el.textContent = `$${data.price}`);
  $$('.flavor-strength').forEach(el => el.textContent = `${currentStrength} mg`);
}

function selectHeroFlavor(index){
  const flavor = flavors[index];
  setAccent(flavor);
  document.getElementById('heroFlavor').textContent = flavor.name;
}

function buildFlavorCards(){
  const track = $('#flavorTrack');
  track.innerHTML = '';

  flavors.forEach((flavor, index) => {
    const card = document.createElement('article');
    card.className = 'flavor-card';
    card.style.setProperty('--local-rgb', flavor.rgb);

    card.innerHTML = `
      <div class="flavor-visual">
        <img src="${imagePath(flavor)}" alt="${flavor.name} 69 caffeine pouch tin" loading="lazy">
      </div>
      <div class="flavor-info">
        <div class="flavor-info-row">
          <div>
            <h3>${flavor.name}</h3>
            <p>${flavor.desc}</p>
          </div>
          <strong class="flavor-price">$${strengths[currentStrength].price}</strong>
        </div>
        <div class="flavor-actions">
          <span class="flavor-strength">${currentStrength} mg</span>
          <button class="add-button" type="button">Add +</button>
        </div>
      </div>
    `;

    card.querySelector('.add-button').addEventListener('click', () => addToCart(index));
    track.appendChild(card);
  });
}

function cardsVisible(){
  if(window.innerWidth <= 760) return 1;
  if(window.innerWidth <= 1080) return 2;
  return 3;
}

function maxCarouselIndex(){
  return Math.max(0, flavors.length - cardsVisible());
}

function updateCarouselStatus(){
  const visible = cardsVisible();
  const start = carouselIndex + 1;
  const end = Math.min(carouselIndex + visible, flavors.length);
  $('#carouselCounter').textContent = `${String(start).padStart(2,'0')} — ${String(end).padStart(2,'0')}`;

  const max = Math.max(1, maxCarouselIndex());
  const progress = maxCarouselIndex() === 0 ? 100 : 34 + (carouselIndex / max) * 66;
  $('#carouselProgress').style.width = `${progress}%`;
}

function updateCarousel(){
  carouselIndex = Math.min(Math.max(carouselIndex, 0), maxCarouselIndex());

  const cards = $$('.flavor-card');
  if(!cards.length) return;

  const windowWidth = $('.carousel-window').clientWidth;
  const visible = cardsVisible();
  const gap = 18;
  const cardWidth = (windowWidth - gap * (visible - 1)) / visible;

  $('#flavorTrack').style.transform = `translateX(-${carouselIndex * (cardWidth + gap)}px)`;
  updateCarouselStatus();
}

function stepCarousel(direction){
  const max = maxCarouselIndex();
  if(direction > 0){
    carouselIndex = carouselIndex >= max ? 0 : carouselIndex + 1;
  } else {
    carouselIndex = carouselIndex <= 0 ? max : carouselIndex - 1;
  }
  updateCarousel();
}

function addToCart(flavorIndex){
  const flavor = flavors[flavorIndex];
  cart.push({
    id: Date.now() + Math.random(),
    flavorIndex,
    strength: currentStrength,
    price: strengths[currentStrength].price
  });
  renderCart();
  showToast(`${flavor.name} · ${currentStrength} mg added`);
}

function renderCart(){
  $('#cartCount').textContent = cart.length;
  const items = $('#cartItems');
  items.innerHTML = '';
  $('#cartEmpty').style.display = cart.length ? 'none' : 'block';

  cart.forEach(item => {
    const flavor = flavors[item.flavorIndex];
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <img src="${imagePath(flavor)}" alt="">
      <div>
        <strong>${flavor.name}</strong>
        <small>${item.strength} mg · $${item.price}</small>
      </div>
      <button type="button" aria-label="Remove item">×</button>
    `;
    row.querySelector('button').addEventListener('click', () => {
      cart = cart.filter(x => x.id !== item.id);
      renderCart();
    });
    items.appendChild(row);
  });

  $('#cartTotal').textContent = `$${cart.reduce((sum, item) => sum + item.price, 0)}`;
}

function openCart(open = true){
  $('#cartDrawer').classList.toggle('open', open);
  $('#cartDrawer').setAttribute('aria-hidden', String(!open));
  document.body.style.overflow = open ? 'hidden' : '';
}

function showToast(message){
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 1800);
}

buildFlavorCards();
selectStrength(75);
selectHeroFlavor(0);
updateCarousel();

$$('[data-strength]').forEach(btn => {
  btn.addEventListener('click', () => selectStrength(btn.dataset.strength));
});
$('#prevFlavor').addEventListener('click', () => stepCarousel(-1));
$('#nextFlavor').addEventListener('click', () => stepCarousel(1));
$('#cartButton').addEventListener('click', () => openCart(true));
$('#cartClose').addEventListener('click', () => openCart(false));
$('#cartOverlay').addEventListener('click', () => openCart(false));
$('#checkoutButton').addEventListener('click', () => showToast('Demo only — checkout is not connected yet'));
document.addEventListener('keydown', e => { if(e.key === 'Escape') openCart(false); });
window.addEventListener('resize', () => {
  carouselIndex = Math.min(carouselIndex, maxCarouselIndex());
  updateCarousel();
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, {threshold:.10});

$$('.reveal').forEach(el => observer.observe(el));

