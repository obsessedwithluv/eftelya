const intro = document.getElementById('intro');
const experience = document.getElementById('experience');
const main = document.getElementById('main-content');
const music = document.getElementById('music');
const musicButton = document.getElementById('music-button');
const musicStatus = document.getElementById('music-status');
const musicIcon = musicButton.querySelector('.music-icon');
const volume = document.getElementById('volume');
const pages = [...document.querySelectorAll('.page')];
const navItems = [...document.querySelectorAll('.nav-item')];

function showSection(id, moveFocus = true) {
  const target = document.getElementById(id);
  if (!target || !target.classList.contains('page')) return;

  pages.forEach(page => {
    const selected = page === target;
    page.hidden = !selected;
    page.classList.toggle('active', selected);
  });
  navItems.forEach(item => {
    const selected = item.dataset.section === id;
    item.classList.toggle('active', selected);
    if (selected) item.setAttribute('aria-current', 'page');
    else item.removeAttribute('aria-current');
  });
  window.scrollTo({ top: 0, behavior: 'auto' });
  if (moveFocus) main.focus({ preventScroll: true });
}

document.getElementById('enter-button').addEventListener('click', () => {
  experience.hidden = false;
  intro.classList.add('leaving');
  intro.setAttribute('inert', '');
  showSection(location.hash.slice(1) || 'home');
  window.setTimeout(() => { intro.hidden = true; }, 1100);
});

document.querySelectorAll('[data-section]').forEach(control => {
  control.addEventListener('click', event => {
    event.preventDefault();
    showSection(control.dataset.section, control.tagName === 'A');
  });
});

document.querySelectorAll('.message-card').forEach(card => {
  card.addEventListener('click', () => {
    const revealed = card.classList.toggle('revealed');
    card.setAttribute('aria-expanded', String(revealed));
    card.querySelector('.card-action').firstChild.textContent = revealed ? 'TAP TO CLOSE ' : 'TAP TO REVEAL ';
  });
});

document.querySelectorAll('.garden-butterfly').forEach(butterfly => {
  butterfly.addEventListener('click', () => {
    document.querySelector('.garden-message').textContent = butterfly.dataset.message;
  });
});

music.volume = Number(volume.value);
volume.addEventListener('input', () => { music.volume = Number(volume.value); });

function updateMusic() {
  const playing = !music.paused;
  musicIcon.textContent = playing ? 'Ⅱ' : '▶';
  musicButton.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
  musicStatus.textContent = playing ? 'now playing' : 'music is off';
}

musicButton.addEventListener('click', async () => {
  if (!music.paused) {
    music.pause();
    return;
  }
  try {
    await music.play();
  } catch {
    musicStatus.textContent = 'music unavailable';
    musicButton.setAttribute('aria-label', 'Music unavailable');
  }
});
music.addEventListener('play', updateMusic);
music.addEventListener('pause', updateMusic);
music.addEventListener('error', () => {
  musicStatus.textContent = 'music unavailable';
  musicButton.setAttribute('aria-label', 'Music unavailable');
});
