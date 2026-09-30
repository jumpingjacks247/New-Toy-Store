(() => {
  const tasks = [
    'Make a snack and rate it out of 10.',
    'Put on one song and have a tiny dance party.',
    'Go outside for five minutes and find something cool.',
    'Draw the first silly thing that comes to mind.',
    'Text someone a meme they would love.',
    'Build, make, or try something with your hands.',
    'Pick a movie or show and press play — no scrolling.',
    'Tidy one small spot, then celebrate your progress.',
    'Take a dramatic water break. Hydration is a quest.',
    'Do the thing you have been putting off for ten minutes.'
  ];
  const $ = id => document.getElementById(id);
  const welcomeModal = $('welcome-modal');
  const gameModal = $('game-modal');
  const stage = $('game-stage');
  const resultNote = $('result-note');
  const resultText = $('result-text');
  let activeGame = null;
  let moleTimer = null;
  let soundOn = true;

  function randomTask() { return tasks[Math.floor(Math.random() * tasks.length)]; }
  function showToast(message) { const toast = $('toast'); toast.textContent = message; toast.classList.add('show'); clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200); }
  function closeWelcome() { welcomeModal.classList.remove('is-open'); }
  function openGame(game) {
    activeGame = game;
    clearInterval(moleTimer);
    resultNote.hidden = true;
    gameModal.classList.add('is-open');
    gameModal.setAttribute('aria-hidden', 'false');
    const copy = {
      wheel: ['✦', 'CHANCE / SPIN', 'Spin the Wheel'],
      claw: ['★', 'SKILL / GRAB', 'Claw Machine'],
      mole: ['●', 'REFLEX / TAP', 'Whack-a-Mole']
    }[game];
    $('modal-game-icon').textContent = copy[0]; $('modal-game-kicker').textContent = copy[1]; $('game-modal-title').textContent = copy[2];
    if (game === 'wheel') renderWheel();
    if (game === 'claw') renderClaw();
    if (game === 'mole') renderMole();
  }
  function closeGame() { gameModal.classList.remove('is-open'); gameModal.setAttribute('aria-hidden', 'true'); clearInterval(moleTimer); }
  function revealTask() { resultText.textContent = randomTask(); resultNote.hidden = false; if (soundOn) showToast('Prize unlocked ✦'); }
  function renderWheel() {
    stage.innerHTML = '<div class="wheel-stage-wrap"><span class="wheel-pointer" aria-hidden="true"></span><div class="stage-wheel" id="stage-wheel">SPIN</div></div><button class="stage-button" id="action-button" type="button">SPIN THE WHEEL</button>';
    $('action-button').onclick = () => { const wheel = $('stage-wheel'); wheel.classList.remove('spinning'); void wheel.offsetWidth; wheel.classList.add('spinning'); $('action-button').disabled = true; $('action-button').textContent = 'SPINNING...'; setTimeout(() => { $('action-button').disabled = false; $('action-button').textContent = 'SPIN AGAIN'; revealTask(); }, 2900); };
  }
  function renderClaw() {
    stage.innerHTML = '<div class="claw-stage"><span class="stage-claw-arm" id="claw-arm"></span><span class="claw-prize-stage" id="claw-prize">★</span></div><button class="stage-button" id="action-button" type="button">DROP THE CLAW</button>';
    $('action-button').onclick = () => { const arm = $('claw-arm'); const prize = $('claw-prize'); const left = 45 + Math.floor(Math.random() * 135); arm.style.left = `${left}px`; prize.style.left = `${Math.max(20, left - 9)}px`; $('action-button').disabled = true; $('action-button').textContent = 'GRABBING...'; setTimeout(() => { arm.style.height = '118px'; prize.style.bottom = '22px'; }, 900); setTimeout(() => { arm.style.height = '75px'; $('action-button').disabled = false; $('action-button').textContent = 'GRAB AGAIN'; revealTask(); }, 1850); };
  }
  function renderMole() {
    stage.innerHTML = '<div class="stage-mole-grid">' + Array.from({length: 9}, (_, i) => `<div class="hole" data-hole="${i}"></div>`).join('') + '</div><p class="mole-instructions">Tap the golden mole!</p>';
    const pop = () => { document.querySelectorAll('.mole-pop').forEach(node => node.remove()); const holes = document.querySelectorAll('.hole'); const hole = holes[Math.floor(Math.random() * holes.length)]; const button = document.createElement('button'); button.className = 'mole-pop'; button.type = 'button'; button.setAttribute('aria-label', 'Whack the golden mole'); button.textContent = 'WHACK'; button.onclick = () => { clearInterval(moleTimer); button.remove(); revealTask(); }; hole.appendChild(button); };
    pop(); moleTimer = setInterval(pop, 1050);
  }
  $('start-button').onclick = () => { closeWelcome(); $('games').scrollIntoView({behavior:'smooth'}); };
  $('modal-start').onclick = () => { closeWelcome(); $('games').scrollIntoView({behavior:'smooth'}); };
  $('welcome-close').onclick = closeWelcome;
  $('game-close').onclick = closeGame;
  $('play-again').onclick = () => openGame(activeGame);
  document.querySelectorAll('[data-game]').forEach(button => button.addEventListener('click', () => openGame(button.dataset.game)));
  $('sound-toggle').onclick = () => { soundOn = !soundOn; $('sound-toggle').textContent = soundOn ? '♪ SOUND ON' : '♪ SOUND OFF'; $('sound-toggle').setAttribute('aria-pressed', String(soundOn)); showToast(soundOn ? 'Sound effects on' : 'Sound effects off'); };
  welcomeModal.addEventListener('click', e => { if (e.target === welcomeModal) closeWelcome(); });
  gameModal.addEventListener('click', e => { if (e.target === gameModal) closeGame(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeWelcome(); closeGame(); } });
})();
