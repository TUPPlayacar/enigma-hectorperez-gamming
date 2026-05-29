/* ================================================================
   TICCAD Quest — script.js
   ================================================================ */

const CONCEPTS = [
  { id: 1, level: 1, category: "definicion", text: "Conjunto de herramientas digitales que median y potencian los procesos de enseñanza-aprendizaje en contextos universitarios.", hint: "Piensa: ¿qué SON fundamentalmente las TICCAD?" },
  { id: 2, level: 1, category: "definicion", text: "Marco conceptual que integra tecnología, comunicación y conocimiento para la transformación digital de la educación superior.", hint: "Define la base estructural de este ecosistema." },
  { id: 4, level: 1, category: "caracteristica", text: "Fomenta la interactividad dinámica y bidireccional entre docentes y estudiantes, tanto en modalidad sincrónica como asincrónica.", hint: "Apunta al modo de operar o cualidad intrínseca." },
  { id: 7, level: 1, category: "beneficio", text: "Reduce significativamente las barreras geográficas y temporales en el acceso a una educación superior de calidad.", hint: "Analiza el impacto positivo externo o ventaja obtenida." },
  { id: 3, level: 2, category: "definicion", text: "Infraestructura pedagógico-digital que articula lo tecnológico, lo comunicativo y lo formativo en entornos virtuales de aprendizaje.", hint: "Es el concepto nuclear del aula del siglo XXI." },
  { id: 5, level: 2, category: "caracteristica", text: "Permite el acceso ubicuo a materiales y recursos educativos digitales desde cualquier dispositivo y en cualquier lugar.", hint: "Se refiere a la propiedad de estar disponible siempre." },
  { id: 6, level: 2, category: "caracteristica", text: "Se adapta de manera flexible a los distintos estilos, ritmos e inteligencias múltiples de los estudiantes.", hint: "Es un rasgo adaptativo propio de la arquitectura digital." },
  { id: 8, level: 2, category: "beneficio", text: "Incrementa la motivación y el compromiso académico del estudiante a través de experiencias de aprendizaje interactivas y gamificadas.", hint: "Es la consecuencia positiva en el rendimiento humano." },
  { id: 9, level: 3, category: "beneficio", text: "Facilita la evaluación formativa continua y el seguimiento personalizado del proceso de aprendizaje de cada estudiante.", hint: "Una gran ventaja metodológica que aporta al docente." },
  { id: 10, level: 3, category: "caracteristica", text: "Integra recursos multimedia de forma coherente: texto, audio, video, animaciones e infografías interactivas en un solo entorno.", hint: "¿Es un rasgo físico y compositivo o una consecuencia directa?" },
  { id: 11, level: 3, category: "caracteristica", text: "Promueve la colaboración sincrónica y asincrónica entre estudiantes y docentes de distintas regiones y zonas horarias.", hint: "Elemento funcional nativo del trabajo en red." },
  { id: 12, level: 3, category: "beneficio", text: "Mejora la retención del conocimiento a largo plazo al fomentar el aprendizaje activo, reflexivo y situado.", hint: "Efecto benéfico directo sobre la memoria y cognición." },
  { id: 13, level: 4, category: "definicion", text: "Herramienta estratégica para la transformación digital integral de los procesos educativos en instituciones de educación superior.", hint: "Define la visión macro y global de las TICCAD." },
  { id: 14, level: 4, category: "beneficio", text: "Posibilita la personalización del itinerario formativo de cada estudiante, adaptando contenidos a su perfil, ritmo y objetivos.", hint: "La ventaja fundamental de flexibilizar la enseñanza." },
  { id: 15, level: 4, category: "caracteristica", text: "Garantiza la trazabilidad completa del proceso de aprendizaje mediante sistemas de analítica educativa avanzada y aprendizaje automático.", hint: "Propiedad tecnológica de recolección métrica." },
  { id: 16, level: 5, category: "definicion", text: "Ecosistema de aprendizaje digital que sincroniza pedagogía, tecnología y evaluación continua en tiempo real.", hint: "Define el corazón del nuevo paradigma educativo." },
  { id: 17, level: 5, category: "beneficio", text: "Empodera al estudiante como gestor autónomo de su propio conocimiento mediante rutas de aprendizaje adaptativas.", hint: "Impacto positivo en la autonomía del alumno." },
  { id: 18, level: 5, category: "caracteristica", text: "Utiliza inteligencia artificial para predecir dificultades de aprendizaje y recomendar recursos personalizados.", hint: "Rasgo avanzado de los sistemas TICCAD actuales." }
];

const LEVEL_NARRATIVES = {
  1: "🚪 Has entrado al Vestíbulo del Conocimiento. Las inscripciones en los muros demandan comprender las Definiciones Base de las TICCAD.",
  2: "⚙️ ¡El piso vibra! Has avanzado a las Cámaras del Mecanismo. Identifica las Características de las herramientas digitales.",
  3: "✨ El aire se vuelve denso. Estás en la Sala de los Espejos del Éxito. Descubre los verdaderos Beneficios formativos.",
  4: "⚡ ¡Peligro! El templo incrementa su velocidad defensiva. Nivel Mixto Avanzado. Filtra minuciosamente rasgos técnicos de impactos directos.",
  5: "💎 ¡La Cámara del Cristal Final! Solo los sabios logran descifrar estos registros de analítica avanzada. ¡Libera tu salida!"
};

const STATE = {
  status:          'start',
  score:           0,
  lives:           3,
  level:           1,
  timeSelected:    90,
  timeLeft:        90,
  correctInLevel:  0,
  correctTotal:    0,
  wrongTotal:      0,
  cardIndex:       0,
  deck:            [],
  timerID:         null,
  cardSelected:    false,
  levelingUp:      false,
  isPaused:        false,
  combo:           0,
  maxCombo:        0,
  powerUpAvailable: false,
  powerUpUsed:     false,
  audioSecondsFlag: 0,
  audioUnlocked:   false // Bandera para registrar la interacción inicial de movimiento/toque
};

const CORRECT_PER_LEVEL = 3;
const PTS_CORRECT = 15;
const PTS_WRONG   = 5;

const SoundSystem = {
  playInicio() { const audio = document.getElementById('sound-inicio'); if (audio) { audio.currentTime = 0; audio.play().catch(e => {}); } },
  stopAndRestartInicio() { const audio = document.getElementById('sound-inicio'); if (audio) { audio.pause(); audio.currentTime = 0; audio.play().catch(e => {}); } },
  playPasarMouse() { const audio = document.getElementById('sound-pasar-mouse'); if (audio) { audio.currentTime = 0; audio.play().catch(e => {}); } },
  playFreez() { const audio = document.getElementById('sound-freez'); if (audio) { audio.currentTime = 0; audio.play().catch(e => {}); } },
  playError() { const audio = document.getElementById('sound-error'); if (audio) { audio.currentTime = 0; audio.play().catch(e => {}); } },
  playPerderVida() { const audio = document.getElementById('sound-perder-vida'); if (audio) { audio.currentTime = 0; audio.play().catch(e => {}); } },
  playCampana() { const audio = document.getElementById('sound-campana'); if (audio) { audio.currentTime = 0; audio.play().catch(e => {}); } },
  playMovResp() { const audio = document.getElementById('sound-mov-resp'); if (audio) { audio.currentTime = 0; audio.play().catch(e => {}); } },
  
  playPerder() { const audio = document.getElementById('sound-perder'); if (audio) { audio.currentTime = 0; audio.play().catch(e => {}); } },
  playSuccess() { const audio = document.getElementById('sound-success'); if (audio) { audio.currentTime = 0; audio.play().catch(e => {}); } },
  playClic() { const audio = document.getElementById('sound-clic'); if (audio) { audio.currentTime = 0; audio.play().catch(e => {}); } },
  playNivel() { const audio = document.getElementById('sound-nivel'); if (audio) { audio.currentTime = 0; audio.play().catch(e => {}); } },
  playSplash() { const audio = document.getElementById('sound-splash'); if (audio) { audio.currentTime = 0; audio.play().catch(e => {}); } },
  playUltimo10() { const audio = document.getElementById('sound-ultimo10'); if (audio) { audio.currentTime = 0; audio.play().catch(e => {}); } },
  playUltimo3() { const audio = document.getElementById('sound-ultimo3'); if (audio) { audio.currentTime = 0; audio.play().catch(e => {}); } }
};

const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

const DOM = {
  screenStart: $('screen-start'), screenGame: $('screen-game'), screenEnd: $('screen-end'),
  hudLives: $('hud-lives'), levelNum: $('level-num'), progressFill: $('progress-fill'), progressLabel: $('progress-label'),
  scoreNum: $('score-num'), timerNum: $('timer-num'), hudTimer: $('hud-timer'), gameCard: $('game-card'),
  cardText: $('card-text'), cardTag: $('card-tag'), cardHint: $('card-hint'), zones: $$('.drop-zone'),
  feedbackOverlay: $('feedback-overlay'), levelupBanner: $('levelup-banner'), levelupParticles: $('levelup-particles'),
  newLevelSpan: $('new-level'), escapeNarrative: $('escape-narrative'), endNarrative: $('end-narrative'),
  endTrophy: $('end-trophy'), endTitle: $('end-title'), endScore: $('end-score'), statCorrect: $('stat-correct'),
  statWrong: $('stat-wrong'), statLevel: $('stat-level'), gradeValue: $('grade-value'), btnStart: $('btn-start'),
  btnRestart: $('btn-restart'), btnHint: $('btn-hint'), comboValue: $('combo-value'), powerupBtn: $('powerup-btn'),
  statMaxCombo: $('stat-maxcombo'), highScoresList: $('high-scores-list'),
  btnTime90: $('btn-time-90'), btnTime140: $('btn-time-140'),
  btnPauseToggle: $('btn-pause-toggle'), btnInlineRestart: $('btn-inline-restart'),
  pauseOverlay: $('pause-overlay'), btnResumeGame: $('btn-resume-game'),
  
  customModal: $('custom-modal'), modalIcon: $('modal-icon'), modalTitle: $('modal-title'),
  modalDesc: $('modal-desc'), modalInputContainer: $('modal-input-container'), modalInput: $('modal-input'),
  modalBtnConfirm: $('modal-btn-confirm'), modalBtnCancel: $('modal-btn-cancel'),

  // Variables de precarga y animación secuencial
  preloaderWrapper: $('preloader-wrapper'),
  initLoadingText: $('init-loading-text'),
  loadingPercentage: $('loading-percentage'),
  preloaderBarFill: $('preloader-bar-fill'),
  animatedIntroWrapper: $('animated-intro-wrapper'),
  gameObjectiveBox: $('game-objective-box'),
  typingObjectiveText: $('typing-objective-text'),
  countdownScreenOverlay: $('countdown-screen-overlay'),
  countdownNumberBox: $('countdown-number-box'),
  gameCategoriesPreview: $('game-categories-preview'),
  highScoresContainer: $('high-scores-container'),
  timeSelectorWrapperBox: $('time-selector-wrapper-box')
};

let modalPromiseResolver = null;

function showCustomModal(options) {
  DOM.modalIcon.textContent = options.icon || '🏆';
  DOM.modalTitle.textContent = options.title || '';
  DOM.modalDesc.textContent = options.desc || '';
  
  if (options.showInput) {
    DOM.modalInputContainer.style.display = 'block';
    DOM.modalInput.value = options.inputValue || '';
  } else {
    DOM.modalInputContainer.style.display = 'none';
  }
  
  if (options.showCancel) {
    DOM.modalBtnCancel.style.display = 'inline-block';
  } else {
    DOM.modalBtnCancel.style.display = 'none';
  }
  
  DOM.customModal.classList.add('active');
  if (options.showInput) DOM.modalInput.focus();
  
  return new Promise((resolve) => {
    modalPromiseResolver = resolve;
  });
}

function closeModal(value) {
  DOM.customModal.classList.remove('active');
  if (modalPromiseResolver) {
    modalPromiseResolver(value);
    modalPromiseResolver = null;
  }
}

DOM.modalBtnConfirm.addEventListener('click', () => {
  const inputVal = DOM.modalInput.value.trim();
  closeModal({ confirmed: true, value: inputVal });
});

DOM.modalBtnCancel.addEventListener('click', () => {
  closeModal({ confirmed: false });
});

DOM.modalInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const inputVal = DOM.modalInput.value.trim();
    closeModal({ confirmed: true, value: inputVal });
  }
});

[DOM.modalBtnConfirm, DOM.modalBtnCancel].forEach(btn => {
  if(btn) {
    btn.addEventListener('mouseenter', () => SoundSystem.playPasarMouse());
  }
});

function loadHighScores() {
  let scores = JSON.parse(localStorage.getItem('ticcad_highscores') || '[]');
  scores.sort((a,b)=>b.score - a.score);
  scores = scores.slice(0,5);
  localStorage.setItem('ticcad_highscores', JSON.stringify(scores));
  return scores;
}

async function saveHighScore(score) {
  let scores = loadHighScores();
  let lowest = scores.length<5 ? 0 : scores[scores.length-1].score;
  if(score > lowest || scores.length<5){
    let res = await showCustomModal({
      icon: '🏆',
      title: '¡NUEVO RÉCORD!',
      desc: 'Ingresa tus iniciales (3 letras):',
      showInput: true,
      inputValue: 'EXP',
      showCancel: false
    });
    
    let player = res.value;
    if(!player) player = "???";
    player = player.toUpperCase().slice(0,3);
    scores.push({ name: player, score: score });
    scores.sort((a,b)=>b.score - a.score);
    scores = scores.slice(0,5);
    localStorage.setItem('ticcad_highscores', JSON.stringify(scores));
  }
  updateHighScoresUI();
}

function updateHighScoresUI() {
  if(DOM.highScoresList){
    let scores = loadHighScores();
    if(scores.length===0) DOM.highScoresList.innerHTML = "<span>-- Sin puntajes --</span>";
    else {
      DOM.highScoresList.innerHTML = scores.map(s => `<span>${s.name}: ${s.score}</span>`).join('');
    }
  }
}

function updateDynamicNarrative(isCorrect, currentCombo) {
  let base = LEVEL_NARRATIVES[STATE.level] || "Avanzando en el Templo...";
  if(!isCorrect) {
    DOM.escapeNarrative.textContent = `❌ ¡Error! ${base} (Las sombras del templo distorsionan tu percepción...)`;
  } else if(currentCombo >= 3) {
    DOM.escapeNarrative.textContent = `🔥 ¡RACHA DE ${currentCombo} aciertos! El templo resuena con energía. ${base}`;
  } else if(currentCombo === 1) {
    DOM.escapeNarrative.textContent = `✅ Acierto. Continúa con la secuencia. ${base}`;
  } else {
    DOM.escapeNarrative.textContent = base;
  }
}

function togglePauseGame() {
  if (STATE.status !== 'playing' || STATE.levelingUp) return;
  
  if (!STATE.isPaused) {
    STATE.isPaused = true;
    clearInterval(STATE.timerID);
    SoundSystem.playFreez();
    DOM.pauseOverlay.classList.add('active');
    DOM.gameCard.style.visibility = 'hidden';
    DOM.btnPauseToggle.textContent = "▶️ REANUDAR TIEMPO";
    DOM.btnPauseToggle.classList.add('paused-state');
  } else {
    STATE.isPaused = false;
    DOM.pauseOverlay.classList.remove('active');
    DOM.gameCard.style.visibility = 'visible';
    DOM.btnPauseToggle.textContent = "⏸️ CONGELAR TIEMPO";
    DOM.btnPauseToggle.classList.remove('paused-state');
    startTimer();
  }
}

function revealCorrectCategory() {
  if(!STATE.powerUpAvailable || STATE.powerUpUsed || STATE.levelingUp || STATE.isPaused) return;
  const concept = STATE.deck[STATE.cardIndex];
  if(!concept) return;
  const correctZone = Array.from(DOM.zones).find(zone => zone.getAttribute('data-category') === concept.category);
  if(correctZone) {
    correctZone.classList.add('reveal-highlight');
    setTimeout(() => correctZone.classList.remove('reveal-highlight'), 2000);
    STATE.powerUpUsed = true;
    STATE.powerUpAvailable = false;
    DOM.powerupBtn.style.display = 'none';
  }
}

function generateAndShuffleDeck() {
  let filtered = CONCEPTS.filter(c => c.level === STATE.level);
  if (filtered.length === 0) filtered = [...CONCEPTS];
  STATE.deck = shuffleArray([...filtered]);
  STATE.cardIndex = 0;
}

function shuffleArray(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }

function startTimer() {
  DOM.hudTimer.classList.remove('critical');
  clearInterval(STATE.timerID);
  STATE.timerID = setInterval(() => {
    STATE.timeLeft--;
    DOM.timerNum.textContent = `${STATE.timeLeft}s`;
    
    if (STATE.timeLeft === 10 && STATE.audioSecondsFlag !== 10) {
      SoundSystem.playUltimo10();
      STATE.audioSecondsFlag = 10;
    } else if (STATE.timeLeft === 3 && STATE.audioSecondsFlag !== 3) {
      SoundSystem.playUltimo3();
      STATE.audioSecondsFlag = 3;
    }
    
    if (STATE.timeLeft <= 20) DOM.hudTimer.classList.add('critical');
    if (STATE.timeLeft <= 0) { clearInterval(STATE.timerID); endGame('timeout'); }
  }, 1000);
}

function renderCard() {
  hideHint();
  if (STATE.cardIndex >= STATE.deck.length) generateAndShuffleDeck();
  const concept = STATE.deck[STATE.cardIndex];
  DOM.cardText.textContent = concept.text;
  DOM.cardHint.textContent = concept.hint;
  DOM.cardTag.textContent = `REGISTRO CRÍTICO EN NIVEL ${STATE.level}`;
  
  if(!STATE.isPaused) {
    DOM.gameCard.style.visibility = "visible";
  }
  
  DOM.gameCard.classList.remove('dragged', 'selected');
  DOM.gameCard.classList.add('spawn-anim');
  setTimeout(() => DOM.gameCard.classList.remove('spawn-anim'), 400);
  STATE.cardSelected = false;
  resetZonesVisuals();
  
  if(STATE.combo >= 3 && !STATE.powerUpUsed && STATE.status === 'playing' && !STATE.levelingUp && !STATE.isPaused){
    STATE.powerUpAvailable = true;
    DOM.powerupBtn.style.display = 'block';
  } else {
    DOM.powerupBtn.style.display = 'none';
  }
}

function handleAnswer(selectedCategory) {
  if (STATE.levelingUp || STATE.status !== 'playing' || STATE.isPaused) return;
  const concept = STATE.deck[STATE.cardIndex];
  const isCorrect = (concept.category === selectedCategory);
  
  if (isCorrect) {
    STATE.combo++;
    if(STATE.combo > STATE.maxCombo) STATE.maxCombo = STATE.combo;
    let bonusPoints = Math.min(STATE.combo * 2, 10);
    let totalPoints = PTS_CORRECT + bonusPoints;
    STATE.score += totalPoints;
    STATE.correctInLevel++;
    STATE.correctTotal++;
    triggerFlash('correct');
    updateDynamicNarrative(true, STATE.combo);
    
    if (STATE.correctInLevel >= CORRECT_PER_LEVEL) {
      SoundSystem.playNivel();
      levelUp();
    } else {
      STATE.cardIndex++;
      updateProgressBar();
      refreshHUD();
      renderCard();
    }
  } else {
    STATE.score = Math.max(0, STATE.score - PTS_WRONG);
    STATE.wrongTotal++;
    STATE.lives--;
    STATE.combo = 0;
    STATE.powerUpAvailable = false;
    STATE.powerUpUsed = false;
    DOM.powerupBtn.style.display = 'none';
    
    SoundSystem.playError();
    SoundSystem.playPerderVida();
    
    triggerFlash('wrong');
    renderHearts(true); 
    refreshHUD();
    updateDynamicNarrative(false, 0);
    if (STATE.lives <= 0) endGame('lives');
    else { STATE.cardIndex++; renderCard(); }
  }
  refreshHUD();
}

function levelUp() {
  if (STATE.level >= 5) { endGame('victory'); return; }
  STATE.levelingUp = true;
  STATE.level++;
  STATE.correctInLevel = 0;
  STATE.timeLeft += 10;
  DOM.timerNum.textContent = `${STATE.timeLeft}s`;
  STATE.combo = 0;
  STATE.powerUpAvailable = false;
  STATE.powerUpUsed = false;
  DOM.powerupBtn.style.display = 'none';
  STATE.audioSecondsFlag = 0;
  
  clearInterval(STATE.timerID);
  DOM.newLevelSpan.textContent = STATE.level;
  
  SoundSystem.playSplash();
  
  DOM.levelupBanner.classList.add('active');
  createParticles();
  setTimeout(() => {
    DOM.levelupBanner.classList.remove('active');
    STATE.levelingUp = false;
    generateAndShuffleDeck();
    updateProgressBar();
    refreshHUD();
    updateNarrative();
    renderCard();
    if(!STATE.isPaused) startTimer();
  }, 3500);
}

function updateNarrative() { DOM.escapeNarrative.textContent = LEVEL_NARRATIVES[STATE.level] || "Avanzando en el Templo..."; }

function triggerEndConfetti() {
  for (let i = 0; i < 120; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'end-confetti-particle';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = ['#00e5ff','#bf5fff','#3dff40','#ff2d78','#ffb830'][Math.floor(Math.random()*5)];
    confetti.style.transform = `scale(${Math.random() * 0.8 + 0.4})`;
    confetti.style.setProperty('--drift', (Math.random() * 300 - 150) + 'px');
    confetti.style.animationDelay = (Math.random() * 2) + 's';
    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 5000);
  }
}

function endGame(reason) {
  clearInterval(STATE.timerID);
  DOM.gameCard.style.visibility = "hidden";
  DOM.pauseOverlay.classList.remove('active');
  
  let trophy = '💎'; 
  let title = '¡Misión Concluida!'; 
  let grade = 'Nivel Básico Obligatorio'; 
  let narrativeText = "";
  
  if (reason === 'victory') {
    trophy = '👑'; 
    title = '¡Gran Académico Liberado!'; 
    grade = 'Excelente — 100/100';
    narrativeText = "👑 ¡Increíble! Has descifrado las 5 bóvedas de las TICCAD. El Templo ha reconocido tu maestría digital y liberado el Cristal de Energía Primigenia.";
    SoundSystem.playCampana();
    triggerEndConfetti();
  } else if (reason === 'lives') { 
    trophy = '💀'; 
    title = 'Esferas Agotadas'; 
    narrativeText = "❌ Las esferas de energía vivificadora colapsaron de forma anticipada. El templo bloqueó sus compuertas."; 
    SoundSystem.playPerder();
  } else { 
    trophy = '⏱️'; 
    title = 'Tiempo Agotado'; 
    narrativeText = "⏳ El reloj cuántico del templo llegó a cero antes de poder clasificar los pilares del saber."; 
    SoundSystem.playPerder(); 
  }
  
  if (reason !== 'victory') { 
    if (STATE.score >= 90) { trophy = '🥇'; grade = 'Destacado — Enfoque Profesional'; }
    else if (STATE.score >= 60) { trophy = '🥈'; grade = 'Aprobado Avanzado'; }
    else if (STATE.score >= 30) { trophy = '🥉'; grade = 'Aprobado Regular'; }
    else { grade = 'Insuficiente Académico'; }
  }
  
  DOM.endTrophy.textContent = trophy;
  DOM.endTitle.textContent = title;
  DOM.endScore.textContent = STATE.score;
  DOM.statCorrect.textContent = STATE.correctTotal;
  DOM.statWrong.textContent = STATE.wrongTotal;
  DOM.statLevel.textContent = STATE.level;
  DOM.statMaxCombo.textContent = STATE.maxCombo;
  DOM.gradeValue.textContent = grade;
  DOM.endNarrative.innerHTML = `<p>${narrativeText}</p>`;
  showScreen('end');
  saveHighScore(STATE.score);
}

function refreshHUD() {
  DOM.scoreNum.textContent = String(STATE.score).padStart(4, '0');
  DOM.levelNum.textContent = STATE.level;
  DOM.comboValue.textContent = `x${STATE.combo}`;
  if(STATE.combo >= 3) DOM.comboValue.style.color = '#ffb830';
  else DOM.comboValue.style.color = 'white';
}

function renderHearts(shouldExplodeLast = false) {
  DOM.hudLives.innerHTML = '';
  for(let i = 0; i < 3; i++) {
    const starSpan = document.createElement('span');
    starSpan.className = 'heart';
    
    if (i < STATE.lives) {
      starSpan.classList.add('active');
      starSpan.textContent = '⭐';
    } else {
      starSpan.classList.add('spent');
      if (shouldExplodeLast && i === STATE.lives) {
        starSpan.classList.add('exploding-star');
        starSpan.textContent = '💥';
      } else {
        starSpan.textContent = '💀';
      }
    }
    DOM.hudLives.appendChild(starSpan);
  }
}

function updateProgressBar() { const pct = (STATE.correctInLevel / CORRECT_PER_LEVEL)*100; DOM.progressFill.style.width = `${pct}%`; DOM.progressLabel.textContent = `${STATE.correctInLevel}/${CORRECT_PER_LEVEL}`; }
function triggerFlash(type) { DOM.feedbackOverlay.className = `feedback-overlay flash-${type}`; setTimeout(() => DOM.feedbackOverlay.className = 'feedback-overlay', 300); }
function createParticles() { DOM.levelupParticles.innerHTML = ''; for(let i=0;i<20;i++){ const p=document.createElement('div'); p.className='particle'; p.style.left=`${Math.random()*100}%`; p.style.top=`${Math.random()*100}%`; p.style.animationDelay=`${Math.random()*0.6}s`; DOM.levelupParticles.appendChild(p); } }
function toggleHint() { if(DOM.cardHint.classList.contains('active')) hideHint(); else showHint(); }
function showHint() { if(!STATE.isPaused) DOM.cardHint.classList.add('active'); }
function hideHint() { DOM.cardHint.classList.remove('active'); }
function resetZonesVisuals() { DOM.zones.forEach(z => z.classList.remove('drag-over', 'selected', 'reveal-highlight')); }

// 1. Nueva Función: Barra de Precarga de la Pantalla Inicial simulada en pocos segundos
function startInitialPreloader() {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 12) + 5; // Avance aleatorio orgánico
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      // Al llegar al 100%, se desvanece suavemente la barra y se revela el botón grande al centro
      setTimeout(() => {
        DOM.preloaderWrapper.style.opacity = '0';
        setTimeout(() => {
          DOM.preloaderWrapper.style.display = 'none';
          DOM.btnStart.style.display = 'inline-block';
          // Pequeño timeout para activar transición de opacidad
          setTimeout(() => {
            DOM.btnStart.style.opacity = '1';
          }, 50);
        }, 400);
      }, 300);
    }
    DOM.loadingPercentage.textContent = `${progress}%`;
    DOM.preloaderBarFill.style.width = `${progress}%`;
  }, 180);
}

// 2. Nueva Función: Flujo interactivo al pulsar Iniciar Desafío
function triggerRecommendedIntroFlow() {
  SoundSystem.playClic();
  DOM.btnStart.style.display = 'none';

  // Despliega contenedor de instrucciones animadas (Sube lentamente)
  DOM.animatedIntroWrapper.classList.add('intro-visible-flow');

  // Detona el Objetivo letra por letra
  setTimeout(() => {
    DOM.gameObjectiveBox.style.display = 'flex';
    const objectiveText = "Fortalecer la práctica educativa digital mediante la clasificación analítica de los fundamentos conceptuales de las TICCAD en ambientes de educación superior.";
    let charIndex = 0;
    DOM.typingObjectiveText.textContent = "";

    function typeLetter() {
      if (charIndex < objectiveText.length) {
        DOM.typingObjectiveText.textContent += objectiveText.charAt(charIndex);
        charIndex++;
        setTimeout(typeLetter, 20);
      } else {
        // Al finalizar las letras del objetivo, se desencadena la caída secuencial de tarjetas
        setTimeout(triggerCardsFallingSequence, 600);
      }
    }
    typeLetter();
  }, 850);
}

// 3. Nueva Función: Caída de tarjetas una a una ("Caer" desde arriba) y paneles restantes
function triggerCardsFallingSequence() {
  const cards = document.querySelectorAll('#game-instructions-grid .info-card');
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('instruction-fall-anim');
    }, index * 250); // Desfase entre cada una de las 6 tarjetas
  });

  // Mostrar los bloques inferiores después de que caigan todas las tarjetas de instrucciones
  setTimeout(() => {
    DOM.gameCategoriesPreview.style.opacity = '1';
    DOM.gameCategoriesPreview.style.transform = 'translateY(0)';
    
    DOM.highScoresContainer.style.opacity = '1';
    DOM.highScoresContainer.style.transform = 'translateY(0)';
    
    DOM.timeSelectorWrapperBox.style.opacity = '1';
    DOM.timeSelectorWrapperBox.style.transform = 'translateY(0)';
  }, cards.length * 250 + 200);
}

// 4. Nueva Función: Ejecución cinemática de la Cuenta Regresiva 3, 2, 1
function triggerCountdownSequence() {
  DOM.countdownScreenOverlay.classList.add('active');
  let currentCount = 3;
  
  function executeStep() {
    if (currentCount > 0) {
      DOM.countdownNumberBox.textContent = currentCount;
      SoundSystem.playUltimo3(); // Pitido por número
      
      DOM.countdownNumberBox.classList.remove('count-pulse-anim');
      void DOM.countdownNumberBox.offsetWidth; 
      DOM.countdownNumberBox.classList.add('count-pulse-anim');
      
      currentCount--;
      setTimeout(executeStep, 1000);
    } else {
      DOM.countdownNumberBox.textContent = "¡Comenzamos!";
      SoundSystem.playSplash();
      
      DOM.countdownNumberBox.classList.remove('count-pulse-anim');
      void DOM.countdownNumberBox.offsetWidth;
      DOM.countdownNumberBox.classList.add('count-pulse-anim');

      setTimeout(() => {
        DOM.countdownScreenOverlay.classList.remove('active');
        
        // Limpieza y reseteo preventivo del flujo inicial por si acaso
        DOM.animatedIntroWrapper.classList.remove('intro-visible-flow');
        DOM.gameObjectiveBox.style.display = 'none';
        DOM.typingObjectiveText.textContent = "";
        const cards = document.querySelectorAll('#game-instructions-grid .info-card');
        cards.forEach(c => c.classList.remove('instruction-fall-anim'));
        DOM.gameCategoriesPreview.style.opacity = '0';
        DOM.highScoresContainer.style.opacity = '0';
        DOM.timeSelectorWrapperBox.style.opacity = '0';
        
        DOM.preloaderWrapper.style.display = 'block';
        DOM.preloaderWrapper.style.opacity = '1';
        
        // Inicia la partida formalmente
        initGame();
      }, 1000);
    }
  }
  executeStep();
}

function initGame() {
  STATE.score = 0; 
  STATE.lives = 3; 
  STATE.level = 1; 
  STATE.timeLeft = STATE.timeSelected;
  STATE.correctInLevel = 0;
  STATE.correctTotal = 0; 
  STATE.wrongTotal = 0; 
  STATE.combo = 0; 
  STATE.maxCombo = 0;
  STATE.powerUpAvailable = false; 
  STATE.powerUpUsed = false; 
  STATE.levelingUp = false;
  STATE.isPaused = false;
  STATE.audioSecondsFlag = 0;

  DOM.pauseOverlay.classList.remove('active');
  DOM.btnPauseToggle.textContent = "⏸️ CONGELAR TIEMPO";
  DOM.btnPauseToggle.classList.remove('paused-state');

  SoundSystem.stopAndRestartInicio();

  generateAndShuffleDeck();
  clearInterval(STATE.timerID);
  refreshHUD(); 
  renderHearts(false); 
  updateProgressBar(); 
  updateNarrative(); 
  renderCard();
  startTimer();
  showScreen('game');
}

function showScreen(name) {
  ['screenStart','screenGame','screenEnd'].forEach(k => DOM[k].classList.remove('active'));
  DOM[`screen${name.charAt(0).toUpperCase() + name.slice(1)}`].classList.add('active');
  STATE.status = name === 'game' ? 'playing' : name;
}

// 5. Manejadores de los Selectores de Tiempo: Emiten hover, setean y disparan la Cuenta Regresiva de inmediato
DOM.btnTime90.addEventListener('click', () => {
  SoundSystem.playClic();
  STATE.timeSelected = 90;
  DOM.btnTime90.classList.add('active');
  DOM.btnTime140.classList.remove('active');
  
  setTimeout(triggerCountdownSequence, 150);
});

DOM.btnTime140.addEventListener('click', () => {
  SoundSystem.playClic();
  STATE.timeSelected = 140;
  DOM.btnTime140.classList.add('active');
  DOM.btnTime90.classList.remove('active');
  
  setTimeout(triggerCountdownSequence, 150);
});

DOM.btnPauseToggle.addEventListener('click', (e) => { e.stopPropagation(); togglePauseGame(); });
DOM.btnResumeGame.addEventListener('click', (e) => { e.stopPropagation(); togglePauseGame(); });

DOM.btnInlineRestart.addEventListener('click', async () => {
  let res = await showCustomModal({
    icon: '🔄',
    title: 'REINICIAR DESAFÍO',
    desc: '¿Seguro que deseas reiniciar el juego actual desde cero?',
    showInput: false,
    showCancel: true
  });
  if(res.confirmed) {
    initGame();
  }
});

DOM.gameCard.addEventListener('dragstart', (e) => { 
  if(STATE.levelingUp || STATE.isPaused){ e.preventDefault(); return; } 
  DOM.gameCard.classList.add('dragged'); 
  e.dataTransfer.setData('text/plain',''); 
});

DOM.gameCard.addEventListener('dragend', () => DOM.gameCard.classList.remove('dragged'));

DOM.zones.forEach(zone => {
  zone.addEventListener('dragover', (e) => { e.preventDefault(); if(!STATE.isPaused) zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  
  zone.addEventListener('mouseenter', () => {
    if(!STATE.levelingUp && !STATE.isPaused && STATE.status === 'playing') {
      SoundSystem.playMovResp();
    }
  });
  
  zone.addEventListener('drop', (e) => { 
    e.preventDefault(); 
    zone.classList.remove('drag-over'); 
    if(!STATE.isPaused) {
      SoundSystem.playClic(); 
      handleAnswer(zone.getAttribute('data-category')); 
    }
  });
  
  zone.addEventListener('click', () => { 
    if(STATE.levelingUp || STATE.isPaused) return; 
    if(!STATE.cardSelected){ 
      SoundSystem.playClic(); 
      DOM.gameCard.classList.add('selected'); 
      STATE.cardSelected = true; 
      zone.classList.add('selected'); 
      setTimeout(() => handleAnswer(zone.getAttribute('data-category')), 250); 
    } 
  });
});

DOM.btnStart.addEventListener('click', triggerRecommendedIntroFlow);
DOM.btnRestart.addEventListener('click', () => {
  showScreen('start');
  startInitialPreloader();
});
DOM.btnHint.addEventListener('click', (e) => { e.stopPropagation(); toggleHint(); });
DOM.powerupBtn.addEventListener('click', (e) => { e.stopPropagation(); revealCorrectCategory(); });
document.addEventListener('click', () => hideHint());

const targetsWithSound = [DOM.btnStart, DOM.btnRestart, DOM.btnInlineRestart, DOM.btnPauseToggle, DOM.btnTime90, DOM.btnTime140];
targetsWithSound.forEach(btn => {
  if(btn) {
    btn.addEventListener('mouseenter', () => {
      // Solo emite sonido si el sistema de audio ya fue inicializado por interacción previa
      if(STATE.audioUnlocked) {
        SoundSystem.playPasarMouse();
      }
    });
  }
});

// Inicialización de Interacción global al mover el mouse o tocar la pantalla en el Inicio para habilitar audios
window.addEventListener('DOMContentLoaded', () => {
  updateHighScoresUI();
  renderHearts(false);
  
  const unlockAudioContext = () => {
    if (!STATE.audioUnlocked) {
      STATE.audioUnlocked = true;
      SoundSystem.playInicio(); // Inicia música de fondo ambiental
      
      // Remover escuchas para evitar llamadas redundantes
      window.removeEventListener('mousemove', unlockAudioContext);
      window.removeEventListener('touchstart', unlockAudioContext);
    }
  };

  window.addEventListener('mousemove', unlockAudioContext);
  window.addEventListener('touchstart', unlockAudioContext);

  // Ejecuta la barra de precarga automática al cargar la ventana
  startInitialPreloader();
});