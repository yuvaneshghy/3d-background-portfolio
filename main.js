/* ============================================================
   Yuvanesh 3D Portfolio — 3D animated background only
   (page itself scrolls normally; background is 3D)
   ============================================================ */

/* ---------- Three.js 3D Background ---------- */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05060a, 0.05);

  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 18;

  /* Floating particle field */
  const count = 700;
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 60;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    speeds[i] = Math.random() * 0.02 + 0.005;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pMat = new THREE.PointsMaterial({
    size: 0.12, color: document.body.classList.contains('light') ? 0x6c5ce7 : 0x00d2ff,
    transparent: true, opacity: document.body.classList.contains('light') ? 0.55 : 0.5,
    blending: document.body.classList.contains('light') ? THREE.NormalBlending : THREE.AdditiveBlending,
    depthWrite: false
  });
  const points = new THREE.Points(pGeo, pMat);
  scene.add(points);

  const ringGeo = new THREE.IcosahedronGeometry(6.5, 1);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x6c5ce7, wireframe: true, transparent: true, opacity: 0.12 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  scene.add(ring);

  const ringGeo2 = new THREE.IcosahedronGeometry(4.2, 0);
  const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x00d2ff, wireframe: true, transparent: true, opacity: 0.2 });
  const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
  scene.add(ring2);

  /* Mouse parallax */
  let mx = 0, my = 0;
  window.addEventListener('mousemove', (e) => {
    mx = (e.clientX / window.innerWidth - 0.5);
    my = (e.clientY / window.innerHeight - 0.5);
  });

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    ring.rotation.x = t * 0.12;
    ring.rotation.y = t * 0.18;
    ring2.rotation.x = -t * 0.22;
    ring2.rotation.y = -t * 0.15;

    const pos = pGeo.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += speeds[i];
      if (pos[i * 3 + 1] > 20) pos[i * 3 + 1] = -20;
    }
    pGeo.attributes.position.needsUpdate = true;

    camera.position.x += (mx * 4 - camera.position.x) * 0.04;
    camera.position.y += (-my * 4 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

/* ---------- Loader ---------- */
window.addEventListener('load', () => {
  setTimeout(() => document.getElementById('loader').classList.add('done'), 600);
});

/* ---------- Typed role text ---------- */
(function () {
  const el = document.querySelector('.typed');
  if (!el) return;
  const roles = ['Creative Developer', 'Graphics Designer', 'Software Engineer', 'Video Editor'];
  let r = 0, c = 0, deleting = false;
  function type() {
    const word = roles[r];
    el.textContent = deleting ? word.slice(0, c--) : word.slice(0, c++);
    if (!deleting && c > word.length) { deleting = true; setTimeout(type, 1400); return; }
    if (deleting && c < 0) { deleting = false; r = (r + 1) % roles.length; c = 0; }
    setTimeout(type, deleting ? 50 : 90);
  }
  type();
})();

/* ---------- Scroll reveal + nav active + stats + bars ---------- */
(function () {
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        if (e.target.querySelector('.bar i')) {
          e.target.querySelectorAll('.bar i').forEach((b) => { b.style.width = b.style.getPropertyValue('--w'); });
        }
        if (e.target.querySelector('.stat-num')) {
          e.target.querySelectorAll('.stat-num').forEach((s) => countUp(s));
        }
        const items = e.target.querySelectorAll('.tl-item');
        if (items.length) items.forEach((it) => it.classList.add('visible'));
      }
    });
  }, { threshold: 0.2 });
  reveals.forEach((r) => io.observe(r));

  function countUp(el) {
    const target = +el.dataset.target;
    let cur = 0;
    const step = target / 50;
    const id = setInterval(() => {
      cur += step;
      if (cur >= target) { cur = target; clearInterval(id); }
      el.textContent = Math.floor(cur);
    }, 25);
  }

  const sections = document.querySelectorAll('section');
  const links = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach((s) => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
    links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
  });

  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-links');
  toggle.addEventListener('click', () => menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => menu.classList.remove('open')));
})();

/* ---------- Card glow follow cursor ---------- */
document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    card.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
});

/* ---------- Contact form -> WhatsApp ---------- */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const WHATSAPP_NUMBER = '9361089987';
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.elements['name'].value.trim();
    const phone = form.elements['phone'].value.trim();
    const email = form.elements['email'].value.trim();
    const comments = form.elements['comments'].value.trim();
    const message =
      `*New Contact Submission*\n\n` +
      `*Name:* ${name}\n` +
      `*Phone:* ${phone}\n` +
      `*Email:* ${email}\n` +
      `*Comments:* ${comments}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  });
})();

/* ---------- Year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Work category filter ---------- */
(function () {
  const bar = document.getElementById('work-filters');
  const subBar = document.getElementById('work-subfilters');
  const grid = document.getElementById('work-grid');
  if (!bar || !grid) return;
  const cards = grid.querySelectorAll('.card');
  let activeType = 'graphic';
  let activeSub = 'all';

  function defaultSub(type) {
    return type === 'video' ? 'reels' : 'idc';
  }

  function apply() {
    let i = 0;
    cards.forEach((card) => {
      const typeOk = card.dataset.type === activeType;
      const subOk = activeSub === 'all' || card.dataset.category === activeSub;
      const show = typeOk && subOk;
      card.classList.toggle('hide', !show);
      if (show) {
        card.classList.remove('animate-in');
        void card.offsetWidth;
        card.style.animationDelay = (i * 0.06) + 's';
        card.classList.add('animate-in');
        i++;
      }
    });
  }

  function syncSubs() {
    if (!subBar) return;
    subBar.classList.add('open');
    const def = defaultSub(activeType);
    let i = 0;
    subBar.querySelectorAll('.filter-btn').forEach((b) => {
      const match = b.dataset.type === activeType;
      b.classList.toggle('hide', !match);
      b.classList.toggle('active', match && b.dataset.filter === def);
      if (match) {
        b.style.animationDelay = (i * 0.06) + 's';
        i++;
      }
    });
    activeSub = def;
  }

  syncSubs();
  apply();

  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    activeType = btn.dataset.type;
    bar.querySelectorAll('.filter-btn').forEach((b) => b.classList.toggle('active', b === btn));
    subBar.classList.remove('open');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        syncSubs();
        apply();
      });
    });
  });

  if (subBar) {
    subBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      activeSub = btn.dataset.filter;
      subBar.querySelectorAll('.filter-btn').forEach((b) => {
        if (b.dataset.type === activeType) b.classList.toggle('active', b === btn);
      });
      apply();
    });
  }

  apply();
})();

/* ---------- Project category filter ---------- */
(function () {
  const bar = document.getElementById('project-filters');
  const grid = document.getElementById('projects-grid');
  if (!bar || !grid) return;
  const cards = grid.querySelectorAll('.card');
  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    const filter = btn.dataset.filter;
    bar.querySelectorAll('.filter-btn').forEach((b) => b.classList.toggle('active', b === btn));
    cards.forEach((card) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hide', !show);
    });
  });
})();

/* ---------- Theme toggle (light / dark) ---------- */
(function () {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  const saved = localStorage.getItem('theme');
  if (saved === 'light') document.body.classList.add('light');
  btn.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const light = document.body.classList.contains('light');
    localStorage.setItem('theme', light ? 'light' : 'dark');
    if (typeof pMat !== 'undefined') {
      pMat.color.setHex(light ? 0x6c5ce7 : 0x00d2ff);
      pMat.opacity = light ? 0.55 : 0.5;
      pMat.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
      pMat.needsUpdate = true;
    }
  });
})();

/* ---------- 3D rolling pentagon loader ---------- */
(function () {
  const cv = document.getElementById('loader-canvas');
  if (!cv || !window.THREE) return;
  try {
    const r = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
    r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    r.setSize(160, 160, false);
    const sc = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    cam.position.set(0, 0, 7);

    const group = new THREE.Group();
    const S = 2.4;
    const geo = new THREE.BoxGeometry(S, S, S);
    geo.center();
    const mat = new THREE.MeshBasicMaterial({ color: 0x6c5ce7, wireframe: true, wireframeLinewidth: 2 });
    const pent = new THREE.Mesh(geo, mat);
    group.add(pent);
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0x00d2ff, linewidth: 2 }));
    group.add(edges);
    sc.add(group);

    const clock = new THREE.Clock();
    function loop() {
      requestAnimationFrame(loop);
      const t = clock.getElapsedTime();
      group.rotation.x = t * 9;
      group.rotation.y = t * 7;
      group.rotation.z = t * 5;
      r.render(sc, cam);
    }
    loop();
  } catch (e) { console.warn('loader 3d failed', e); }
})();
