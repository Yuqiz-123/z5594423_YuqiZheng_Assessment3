
const views = document.querySelectorAll('.view');
const routeBtns = document.querySelectorAll('.nav .nav-btn, .cta.enter, .spotlight .cta, .back-btn');
function show(route){
  views.forEach(v => v.classList.toggle('active', v.id === route));
  document.querySelectorAll('.nav .nav-btn').forEach(b => b.setAttribute('aria-current', b.dataset.route === route ? 'page' : 'false'));
  window.scrollTo({top:0, behavior:'smooth'});
}
routeBtns.forEach(btn => btn.addEventListener('click', () => show(btn.dataset.route || 'feed')));


const themeBtn = document.getElementById('themeToggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('myEvokeTheme') || 'light';
if (savedTheme === 'dark') root.classList.add('dark');
themeBtn.textContent = root.classList.contains('dark') ? 'Light' : 'Dark';
themeBtn.addEventListener('click', () => {
  root.classList.toggle('dark');
  const dark = root.classList.contains('dark');
  themeBtn.textContent = dark ? 'Light' : 'Dark';
  localStorage.setItem('myEvokeTheme', dark ? 'dark' : 'light');
});

/* ===== Music ===== */
const musicBtn = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
musicBtn.addEventListener('click', async (e) => {
  e.stopPropagation();
  const pressed = musicBtn.getAttribute('aria-pressed') === 'true';
  if (pressed) { bgMusic.pause(); musicBtn.textContent = '▶ Play Music'; }
  else { try { bgMusic.loop = true; await bgMusic.play(); musicBtn.textContent = '⏸ Stop Music'; } catch{} }
  musicBtn.setAttribute('aria-pressed', String(!pressed));
});



/* ===== Watch image resolve + hover cycle ===== */
const watchImg = document.getElementById('watchImg');
const watchCandidates = ['images/watch one.jpg','images/watch one.jpeg','images/watch1.jpg','images/watch1.jpeg','images/Watch1.jpg','images/Watch1.jpeg'];
(function resolveImage(el, sources){ let i=0; const tryNext=()=>{ if(i<sources.length){ el.src=sources[i++]; el.onerror=tryNext; } }; tryNext(); })(watchImg, watchCandidates);

let baseWatchSrc = '';
watchImg.addEventListener('load', () => { baseWatchSrc = watchImg.src; }, {once:true});
let hoverTimer=null, idx=0;
const hoverImgs = ['images/smell.jpg','images/temp.jpg','images/sound.jpg','images/heart.jpg'];
watchImg.addEventListener('mouseenter', () => {
  idx = 0;
  hoverTimer = setInterval(() => { watchImg.src = hoverImgs[idx % hoverImgs.length]; idx++; }, 700);
});
watchImg.addEventListener('mouseleave', () => {
  clearInterval(hoverTimer); hoverTimer=null;
  if (baseWatchSrc) watchImg.src = baseWatchSrc;
});

/* ===== Home wall: rectangular grid + linking ===== */
const wall = document.getElementById('imageWall');
const allWallImgs = Array.from({length:42}, (_,i) => `images/${i+1}.jpg`);
const divisors42 = [42,21,14,7,6,3,2,1];
function computeCols(){
  const minTile = 120;
  const w = wall.clientWidth || window.innerWidth;
  const maxCols = Math.max(1, Math.min(42, Math.floor(w / minTile)));
  for (const d of divisors42){ if (d <= maxCols) return d; }
  return 1;
}
function buildWall(){
  wall.innerHTML = '';
  const cols = computeCols();
  wall.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  allWallImgs.forEach((src, i) => {
    const tile = document.createElement('div'); tile.className = 'tile';
    const card = document.createElement('div'); card.className = 'card';
    const front = document.createElement('div'); front.className = 'side front';
    const back = document.createElement('div'); back.className = 'side back';
    const fImg = document.createElement('img'); fImg.src = src; fImg.alt = 'Memory (blurred)';
    const bImg = document.createElement('img'); bImg.src = src; bImg.alt = 'Memory';
    front.appendChild(fImg); back.appendChild(bImg);
    card.appendChild(front); card.appendChild(back); tile.appendChild(card);

    const n = i+1;
    tile.addEventListener('click', () => {
      if ([10,11,12].includes(n)) { show('story-day'); return; }
      const fileName = `${n}.jpg`;
      const p = mapByImage[fileName];
      if (p) openGenericStory(p); else show('feed');
    });

    wall.appendChild(tile);
  });
}
buildWall();
window.addEventListener('resize', buildWall);

/* ===== Feed data ===== */
const posts = [
  {
    id: 'luka-echo',
    title: "LUKA — My Old Friend",
    user: 'henry_28',
    tags: ['dogs','grief','loopmode'],
    score: 128,
    thumb: 'images/lukaphoto.jpg',
    excerpt: 'A tender archive of Henry and Luka — love, loss, and the fragile line between remembering and reliving.',
    body: `Selected Memory of the Month on MyEvoke. Open to experience the full narrative and Sensory Lab.`
  }
];

const seeds = [
  ['4.jpg',  'Roller-skating down the country road'],
  ['6.jpg',  'Visiting friend on a rainy day'],
  ['7.jpg',  'Basketball at Alex’s place'],
  ['8.jpg',  'I love the city buildings'],
  ['9.jpg',  'Party time'],
  ['13.jpg', 'First time bouldering'],
  ['14.jpg', 'Sunset at Camden'],
  ['15.jpg', 'Visiting the Wedding Cake Rock with Tom'],
  ['16.jpg', 'I brought my camera to the hike'],
  ['17.jpg', 'Ronald lives in a high building'],
  ['18.jpg', 'Old Trains Vol2'],
  ['19.jpg', 'Old Trains'],
  ['20.jpg', 'Gold Mining Experience'],
  ['21.jpg', 'Gold Mining Experience is So Cool'],
  ['22.jpg', 'Night Clouds'],
  ['23.jpg', 'Ocean View'],
  ['24.jpg', 'Tree Top Experience'],
  ['25.jpg', 'I\'m at the Great Ocean Road'],
  ['26.jpg', 'I love the smell of forest'],
  ['27.jpg', 'Perfect weather, perfect view'],
  ['28.jpg', 'Kangaroos'],
  ['29.jpg', 'Great views'],
  ['30.jpg', 'A light house'],
  ['31.jpg', 'Lego Star Wars exhibition'],
  ['32.jpg', 'Old Train Rails'],
  ['33.jpg', 'Old Government Office'],
  ['34.jpg', 'Friends\' wedding at the Harbour'],
  ['35.jpg', 'Fishing is my hobby'],
  ['36.jpg', 'filming in a green screen room'],
  ['37.jpg', 'an old chinese temple'],
  ['38.jpg', 'Skiing in winter'],
  ['39.jpg', 'A lake in China'],
  ['40.jpg', 'A camel standing tall'],
  ['41.jpg', 'Rock stacks as a ritual sign for good luck in china'],
  ['42.jpg', 'Snowing mountains'],
];

function makeBriefAndFull(title){
  // Senses
  const lower = title.toLowerCase();
  let smell='fresh air', sound='ambient chatter', temp='mild', emotion='content';
  if (lower.includes('rain')) { smell='petrichor + wet leaves'; sound='soft rain + tyres on water'; temp='cool'; }
  if (lower.includes('basketball')) { smell='rubber + sweat'; sound='ball bounces + rim clanks'; temp='warm'; }
  if (lower.includes('city')) { smell='coffee + street food'; sound='traffic + footsteps'; temp='mild'; }
  if (lower.includes('party')) { smell='smoke + pizza + frosting'; sound='bass + laughter'; temp='warm night'; }
  if (lower.includes('bouldering')) { smell='chalk + rubber'; sound='clacks + cheers'; temp='indoor warm'; }
  if (lower.includes('sunset')) { smell='dry grass'; sound='crickets + distant cars'; temp='golden warm'; }
  if (lower.includes('wedding cake rock') || lower.includes('ocean')) { smell='sea salt'; sound='waves + wind'; temp='breezy'; }
  if (lower.includes('camera')) { smell='dust + sunscreen'; sound='shutter clicks'; temp='sunny'; }
  if (lower.includes('building')) { smell='elevator steel'; sound='wind at height'; temp='cool up high'; }
  if (lower.includes('train')) { smell='oil + metal'; sound='wheels + horns'; temp='chilly shade'; }
  if (lower.includes('gold')) { smell='dry dust'; sound='gravel crunch'; temp='hot sun'; }
  if (lower.includes('cloud')) { smell='cool air'; sound='quiet wind'; temp='cool night'; }
  if (lower.includes('tree') || lower.includes('forest')) { smell='eucalyptus + pine'; sound='leaves + birds'; temp='cool shade'; }
  if (lower.includes('great ocean road')) { smell='salt + wet rock'; sound='surf'; temp='windy'; }
  if (lower.includes('kangaroo')) { smell='dry grass'; sound='hops + birds'; temp='sunny'; }
  if (lower.includes('light house') || lower.includes('lighthouse')) { smell='salt + rust'; sound='gulls + wind'; temp='windy'; }
  if (lower.includes('lego')) { smell='plastic + popcorn'; sound='kids + camera clicks'; temp='aircon'; }
  if (lower.includes('office')) { smell='polish + paper'; sound='footsteps echo'; temp='cool indoors'; }
  if (lower.includes('wedding')) { smell='perfume + sea breeze'; sound='clinks + cheers'; temp='mild evening'; }
  if (lower.includes('fishing')) { smell='bait + sea'; sound='small waves + reel'; temp='morning chill'; }
  if (lower.includes('green screen')) { smell='paint + cables'; sound='light hum'; temp='warm lights'; }
  if (lower.includes('temple')) { smell='incense + old wood'; sound='quiet bells'; temp='still air'; }
  if (lower.includes('ski')) { smell='cold metal + wool'; sound='edges on ice'; temp='freezing'; }
  if (lower.includes('lake')) { smell='algae + wet stones'; sound='soft water'; temp='cool'; }
  if (lower.includes('camel')) { smell='dust + hay'; sound='grunt + wind'; temp='dry heat'; }
  if (lower.includes('rock stacks')) { smell='incense + dust'; sound='soft talk + wind'; temp='mild'; }
  if (lower.includes('snow')) { smell='ice air'; sound='crunch snow'; temp='cold'; }

  const brief = `${title}.`;
  // Removed the repetitive intro; keep it short & casual
  const full = `Smelled like ${smell}, sounded like ${sound}, ${temp} on the skin. Saved it so I wouldn’t forget the vibe.`;
  return {brief, full, senses:{smell, sound, temp, emotion}};
}

const mapByImage = {};
seeds.forEach(([img, title]) => {
  const {brief, full, senses} = makeBriefAndFull(title);
  const post = {
    id: `mem-${img}`,
    title,
    user: 'myevoker',
    tags: ['memory'],
    score: Math.floor(20 + Math.random()*80),
    thumb: `images/${img}`,
    excerpt: brief,
    body: full,
    senses,
    imageFile: img
  };
  posts.push(post);
  mapByImage[img] = post;
});

/* ===== Render feed ===== */
const list = document.getElementById('postList');
const tpl = document.getElementById('postTemplate');
function renderFeed(items = posts){
  list.innerHTML = '';
  items.forEach(p => {
    const node = tpl.content.cloneNode(true);
    node.querySelector('.title').textContent = p.title;
    node.querySelector('.user').textContent = `u/${p.user}`;
    node.querySelector('.tags').textContent = p.tags.map(t => `#${t}`).join(' ');
    node.querySelector('.excerpt').textContent = p.excerpt;
    node.querySelector('.thumb').src = p.thumb;
    node.querySelector('.thumb').alt = `${p.title} thumbnail`;
    node.querySelector('.score').textContent = p.score;

    node.querySelector('.expand').addEventListener('click', () => {
      if (p.id === 'luka-echo') show('story-month');
      else if (p.id.startsWith('mem-')) openGenericStory(p);
      else openPost(p);
    });

    const voteBtn = node.querySelector('.vote');
    const scoreEl = node.querySelector('.score');
    voteBtn.addEventListener('click', () => {
      const pressed = voteBtn.getAttribute('aria-pressed') === 'true';
      voteBtn.setAttribute('aria-pressed', String(!pressed));
      p.score += pressed ? -1 : 1;
      scoreEl.textContent = p.score;
    });

    list.appendChild(node);
  });
}
renderFeed();

/* ===== Search ===== */
document.getElementById('search').addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase();
  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.user.toLowerCase().includes(q) ||
    p.tags.join(' ').toLowerCase().includes(q)
  );
  renderFeed(filtered);
});

/* ===== Likes ===== */
function bindLike(btn, countEl){
  let count = 0;
  btn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const pressed = btn.getAttribute('aria-pressed') === 'true';
    btn.setAttribute('aria-pressed', String(!pressed));
    count += pressed ? -1 : 1;
    countEl.textContent = count;
  });
}
bindLike(document.getElementById('somLike'), document.getElementById('somLikeCount'));
bindLike(document.getElementById('sowLike'), document.getElementById('sowLikeCount'));
bindLike(document.getElementById('sodLike'), document.getElementById('sodLikeCount'));
bindLike(document.getElementById('detailLikeMonth'), document.getElementById('detailLikeCountMonth'));
bindLike(document.getElementById('detailLikeWeek'), document.getElementById('detailLikeCountWeek'));
bindLike(document.getElementById('detailLikeDay'), document.getElementById('detailLikeCountDay'));
bindLike(document.getElementById('detailLikeGeneric'), document.getElementById('detailLikeCountGeneric'));

/* ===== Comments ===== */
function bindComments(formId, inputId, listId){
  const form = document.getElementById(formId);
  const input = document.getElementById(inputId);
  const list = document.getElementById(listId);
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    const li = document.createElement('li');
    li.className = 'comment-item';
    li.textContent = text;
    list.prepend(li);
    input.value = '';
  });
}
bindComments('commentFormMonth','commentInputMonth','commentListMonth');
bindComments('commentFormWeek','commentInputWeek','commentListWeek');
bindComments('commentFormDay','commentInputDay','commentListDay');
bindComments('commentFormGeneric','commentInputGeneric','commentListGeneric');

/* ===== Generic modal ===== */
const genericModal = document.getElementById('genericModal');
const modalTitle = document.getElementById('modalTitle');
const modalUser = document.getElementById('modalUser');
const modalTags = document.getElementById('modalTags');
const modalBody = document.getElementById('modalBody');
const closeBtn = genericModal.querySelector('.close');
const likeBtn = document.getElementById('likeBtn');
const likeCount = document.getElementById('likeCount');
let modalLikes = 0;

function openPost(p){
  modalTitle.textContent = p.title;
  modalUser.textContent = `u/${p.user}`;
  modalTags.textContent = p.tags.map(t => `#${t}`).join(' ');
  modalBody.textContent = p.body;
  likeBtn.setAttribute('aria-pressed','false'); modalLikes = 0; likeCount.textContent = modalLikes;
  genericModal.showModal();
}
closeBtn.addEventListener('click', () => genericModal.close());
likeBtn.addEventListener('click', () => {
  const pressed = likeBtn.getAttribute('aria-pressed') === 'true';
  likeBtn.setAttribute('aria-pressed', String(!pressed));
  modalLikes += pressed ? -1 : 1;
  likeCount.textContent = modalLikes;
});

/* ===== Sensory popups ===== */
function sensoryOpen(title, body){
  modalTitle.textContent = title;
  modalUser.textContent = 'Sensory Lab';
  modalTags.textContent = '#enhanced #evoke';
  modalBody.textContent = body;
  likeBtn.setAttribute('aria-pressed','false'); modalLikes = 0; likeCount.textContent = modalLikes;
  genericModal.showModal();
}
// Month
document.querySelectorAll('#story-month .chip').forEach(btn => {
  btn.addEventListener('click', () => {
    const s = btn.dataset.sense;
    if (s === 'smell-month') sensoryOpen('Smell — Luka after a day in the sun','Warm fur with a hint of dry grass and sea salt.\nTop: eucalyptus, sun-warmed cotton\nBase: damp sand after the tide');
    if (s === 'sound-month') sensoryOpen('Sound — Home Atmos','A low fireplace crackle, pages turning, and the soft jingle of a leash.');
    if (s === 'temperature-month') sensoryOpen('Temperature — Golden Hour','Skin-warm breeze (approx 24–26°C), cooling shadows near sunset.');
    if (s === 'emotion-month') sensoryOpen('Emotion — Secure Attachment','Baseline calm, peaks of anticipatory joy, bittersweet nostalgia.');
  });
});
// Week
document.querySelectorAll('#story-week .chip').forEach(btn => {
  btn.addEventListener('click', () => {
    const s = btn.dataset.sense;
    if (s === 'smell-week') sensoryOpen('Smell — Pizza Van','Wood-smoke, basil, tomato sauce; citrusy soda fizz and warm boxes.');
    if (s === 'sound-week') sensoryOpen('Sound — Party Lawn','Indie pop, overlapping laughs, hiss of the pizza oven.');
    if (s === 'temperature-week') sensoryOpen('Temperature — Summer Night','Around 23°C, cooler pockets near the van; hands warmed by fresh slices.');
    if (s === 'emotion-week') sensoryOpen('Emotion — Turning Twenty-One','Playful pride and that endless-night buzz.');
  });
});
// Day
document.querySelectorAll('#story-day .chip').forEach(btn => {
  btn.addEventListener('click', () => {
    const s = btn.dataset.sense;
    if (s === 'smell-day') sensoryOpen('Smell — Escarpment Air','Eucalyptus, damp sandstone, and the clean bite of morning mist.');
    if (s === 'sound-day') sensoryOpen('Sound — Ridge Track','Lyrebirds in the scrub, wind across the cliff line, distant waterfall hush.');
    if (s === 'temperature-day') sensoryOpen('Temperature — Crisp Morning','Cool valley air ~12–16°C, warmer pockets in sun-breaks.');
    if (s === 'emotion-day') sensoryOpen('Emotion — Reset','Grounded, small-in-a-good-way, quietly proud of sore calves.');
  });
});

/* ===== Generic memory page ===== */
const genericTitle = document.getElementById('story-generic-title');
const genericImage = document.getElementById('genericImage');
const genericText = document.getElementById('genericText');
const sensSmell = document.getElementById('sensSmell');
const sensSound = document.getElementById('sensSound');
const sensTemp  = document.getElementById('sensTemp');
const sensEmotion = document.getElementById('sensEmotion');

function openGenericStory(p){
  genericTitle.textContent = p.title;
  genericImage.src = p.thumb;
  genericImage.alt = `${p.title} image`;
  genericText.textContent = p.body;
  sensSmell.onclick = () => sensoryOpen('Smell', p.senses.smell);
  sensSound.onclick = () => sensoryOpen('Sound', p.senses.sound);
  sensTemp.onclick  = () => sensoryOpen('Temperature', p.senses.temp);
  sensEmotion.onclick = () => sensoryOpen('Emotion', p.senses.emotion || 'content');
  show('story-generic');
}

/* ===== Videos: hover play + zoom modal ===== */
const zoomDialog = document.getElementById('videoModal');
const zoomVideo = document.getElementById('zoomVideo');
function bindVideoBehaviors(scopeSelector){
  document.querySelectorAll(`${scopeSelector} .video-wrap`).forEach(wrap => {
    const vid = wrap.querySelector('video');
    wrap.addEventListener('mouseenter', () => { try { vid.play(); } catch{} });
    wrap.addEventListener('mouseleave', () => { vid.pause(); });
    wrap.querySelector('.zoom').addEventListener('click', (e) => {
      e.stopPropagation();
      zoomVideo.src = '';
      const src = vid.querySelector('source').src;
      zoomVideo.src = src;
      zoomVideo.muted = false;
      zoomVideo.autoplay = true;
      zoomDialog.showModal();
      zoomVideo.play().catch(()=>{});
    });
  });
}
['#story-month','#story-week','#story-day'].forEach(bindVideoBehaviors);
zoomDialog.querySelector('.close').addEventListener('click', () => { zoomVideo.pause(); zoomDialog.close(); });

/* ===== Download & Upload from Evoke → connect modal ===== */
const connectModal = document.getElementById('connectModal');
document.querySelectorAll('[data-download], [data-upload-evoke]').forEach(btn => {
  btn.addEventListener('click', () => {
    const bgEl = connectModal.querySelector('.connect-wrap');
    const options = ['images/Watch1.jpg','images/watch1.jpg','images/Watch1.jpeg','images/watch1.jpeg'];
    const img = new Image();
    img.onload = () => { bgEl.style.backgroundImage = `url(${img.src})`; };
    img.onerror = () => { bgEl.style.backgroundImage = `url(${options[1]})`; };
    img.src = options[0];
    connectModal.showModal();
  });
});
connectModal.querySelector('.return-btn').addEventListener('click', () => connectModal.close());

/* ===== Share (preview only) ===== */
const shareForm = document.getElementById('shareForm');
const sharePreview = document.getElementById('sharePreview');
shareForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('shareTitle').value.trim();
  const desc = document.getElementById('shareDesc').value.trim();
  sharePreview.hidden = false;
  sharePreview.textContent = `Thanks! "${title}" — ${desc.substring(0, 160)}… (preview only)`;
});

/* ===== Memory of the Month text (from your PDF) ===== */
const monthIntro = document.getElementById('monthIntro');
const readMoreMonthTop = document.getElementById('readMoreMonthTop');
const fullStoryModal = document.getElementById('fullStoryModal');
const fullStoryContent = document.getElementById('fullStoryContent');

const FULL_STORY_MONTH = `
I had never known a day without Luka. From the moment my parents brought home that clumsy little red heeler pup — paws too big for his body, eyes full of mischief — he was just… there. A part of me. We grew up together, speaking this unspoken language of tail wags, glances, and quiet moments.

I can still see his copper coat, speckled with pale spots that caught the sunlight. His eyes always followed me, ready for the next walk, the next game, or just to sit beside me in silence. He was sturdy, built to run alongside my bike for hours or trot with me across paddocks without a single complaint.

Some memories feel sharper than others. The winter night by the fireplace — I was reading, and he was curled at my feet, his fur glowing in the firelight. Every so often, he'd glance up at me, thump his tail, like he was saying, “I'm here.” That's enough.

Or that cold morning when I was fixing my old white Falcon. Luka stood nearby, ears pricked, watching like he understood. His tail swayed in a slow rhythm, just happy to be with me.

And then… the golden afternoon in the park. The sun was low, the grass warm, and I was crouched with a tennis ball in my hand. Luka sat so still, eyes locked on the ball, muscles ready to spring. The second I moved, he shot forward, pure joy in motion.

But he grew old. Walks got shorter. His run turned into careful steps. Soft white fur crept around his muzzle. And one quiet afternoon at the vet's, he lay in my lap, breathing slower and slower as I whispered, “Good boy… good boy…” until that was the only sound left.

The apartment was too quiet after that. His leash still hung by the door. The bowl stayed in the corner. What scared me most wasn't the silence — it was forgetting. The smell of his fur after a day outside. The sound of his bark across the yard. The way he leaned against me.

That's when I turned to my EVOKE watch. I'd worn it for years, not realising it had been recording so many moments with him. The first playback was like a punch to the chest — I was back in the park, the air warm, the scent of earth in the breeze, Luka's low growl rumbling through my palm as I held the ball.

I got lost in those recordings. Luka by the fire. Luka in the driveway. Luka running in the park. Every detail was there — the light, the sound, even the way the grass felt under my hand. But the more I played them, the more the real world faded. Food had no taste. People's voices felt thin. Why live in a world without Luka when I could step into one where he still existed?

That was the moment I realised how deeply technology can change the way we deal with loss. EVOKE wasn't just a watch. It was a doorway. A way to bend time and bring the past into the present with frightening precision. At first, it felt like a gift — a way to keep Luka close. But I started to see how easily it could become a trap.

The problem is, memory in real life is imperfect. It fades, blurs, and distorts over time. That's part of what makes it human. Forgetting, as painful as it is, forces us to move forward.

EVOKE removed that barrier. It gave me a perfect version of Luka — untouched by age or death — and once I had that, reality felt inadequate.

I think this is where the danger lies: when a memory becomes more vivid than the present, it's hard to come back. The brain doesn't separate “then” from “now” when the sensory details are exact. The scent of the grass, the sound of his paws hitting the ground, the weight of him leaning against me — it wasn't just remembering, it was being there. And once you've been there again, it's hard to accept that you can't stay.

But I also wonder — is this really any different from what humans have always done? We've always looked for ways to hold on. First it was stories. Then photographs. Then videos. Each step brought us closer to reliving the past. EVOKE just happens to be the step where we can actually step back inside it.

And maybe that's the real shift: the line between remembering and living is no longer clear. The question isn't just “should we look back” — it's “how much time should we spend there?” I'm still figuring out my answer.

Because the truth is, part of me knows I can't stay in those moments forever. But another part… the part that still hears Luka's bark in my sleep… doesn't want to leave at all.
`.trim();

// first paragraph only on page
const FIRST_PARA = FULL_STORY_MONTH.split('\n\n')[0];
monthIntro.textContent = FIRST_PARA;

// read more button opens full modal
readMoreMonthTop.addEventListener('click', () => {
  // Split the full story into paragraphs and wrap each in <p>
  const paragraphs = FULL_STORY_MONTH.split('\n\n').map(p => `<p>${p.trim()}</p>`).join('');
  fullStoryContent.innerHTML = paragraphs;
  document.getElementById('fullStoryModal').showModal();
});
document.getElementById('fullStoryModal').querySelector('.close')
  .addEventListener('click', () => document.getElementById('fullStoryModal').close());

document.addEventListener('DOMContentLoaded', function() {
  // Home page image wall click-to-week logic
  const imageWall = document.getElementById('imageWall');
  if (imageWall) {
    imageWall.addEventListener('click', function(e) {
      const target = e.target;
      if (target && target.tagName === 'IMG') {
        const src = target.getAttribute('src') || '';
        if (
          src.endsWith('1.jpg') ||
          src.endsWith('2.jpg') ||
          src.endsWith('3.jpg')
        ) {
          // Replace this with your routing logic to show the week memory
          // Example: showView('story-week');
          document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
          document.getElementById('story-week').classList.add('active');
          // Optionally update nav button state if needed
        }
      }
    });
  }
});
