const intro = document.getElementById('intro');
const site = document.getElementById('site');
const enterButton = document.getElementById('enter-button');
const pages = [...document.querySelectorAll('.page')];
const navigationLinks = [...document.querySelectorAll('.navigation a')];
const music = document.getElementById('music');
const musicToggle = document.getElementById('music-toggle');
const musicStatus = document.getElementById('music-status');
const volume = document.getElementById('volume');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function showSection(id, updateHistory = true) {
  const page = pages.find((item) => item.id === id) || pages[0];
  pages.forEach((item) => {
    item.hidden = item !== page;
  });
  navigationLinks.forEach((link) => {
    if (link.dataset.section === page.id) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
  if (updateHistory && window.location.hash !== `#${page.id}`) {
    history.pushState(null, '', `#${page.id}`);
  }
  window.scrollTo(0, 0);
}

enterButton.addEventListener('click', () => {
  enterButton.disabled = true;
  site.hidden = false;
  showSection(window.location.hash.slice(1) || 'home', false);
  intro.classList.add('leaving');
  window.setTimeout(() => {
    intro.hidden = true;
    document.querySelector('.navigation a[aria-current="page"]').focus({ preventScroll: true });
  }, reducedMotion.matches ? 0 : 1000);
});

document.querySelectorAll('[data-section]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    showSection(link.dataset.section);
  });
});

window.addEventListener('popstate', () => {
  showSection(window.location.hash.slice(1) || 'home', false);
});

document.querySelectorAll('.message-card').forEach((card) => {
  card.addEventListener('click', () => {
    card.setAttribute('aria-expanded', String(card.getAttribute('aria-expanded') !== 'true'));
  });
});

document.querySelectorAll('.garden-butterfly').forEach((butterfly) => {
  butterfly.addEventListener('click', () => {
    document.getElementById('garden-message').textContent = butterfly.dataset.message;
  });
});

music.volume = Number(volume.value);
volume.addEventListener('input', () => {
  music.volume = Number(volume.value);
});

function updateMusicState() {
  const playing = !music.paused;
  musicToggle.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
  musicToggle.setAttribute('aria-pressed', String(playing));
  musicToggle.firstElementChild.textContent = playing ? 'Ⅱ' : '▶';
  musicStatus.textContent = playing ? 'now playing' : music.error ? 'music unavailable' : 'music is off';
}

musicToggle.addEventListener('click', async () => {
  if (!music.paused) {
    music.pause();
    return;
  }
  try {
    await music.play();
  } catch {
    updateMusicState();
    musicStatus.textContent = 'music unavailable';
  }
});
music.addEventListener('play', updateMusicState);
music.addEventListener('pause', updateMusicState);
music.addEventListener('error', () => {
  updateMusicState();
  musicStatus.textContent = 'music unavailable';
});
