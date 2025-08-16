
(function () {
  "use strict";

  const canvas = document.getElementById("board");
  const ctx = canvas.getContext("2d");
  const nextCanvas = document.getElementById("next");
  const nextCtx = nextCanvas.getContext("2d");

  const scoreEl = document.getElementById("score");
  const levelEl = document.getElementById("level");
  const linesEl = document.getElementById("lines");
  const bestEl = document.getElementById("best");
  const nextLevelEl = document.getElementById("nextLevel");
  const linesToNextEl = document.getElementById("linesToNext");
  const progressFillEl = document.getElementById("progressFill");

  const newGameBtn = document.getElementById("newGame");
  const pauseBtn = document.getElementById("pause");
  const volumeSlider = document.getElementById("volumeSlider");
  const volumeValue = document.getElementById("volumeValue");
  const muteBtn = document.getElementById("muteBtn");

  // Audio Manager
  const audioManager = {
    sounds: {},
    music: null,
    volume: 0.7,
    muted: false,
    
    init() {
      this.createSounds();
      this.createMusic();
      this.loadAudioSettings();
    },
    
    createSounds() {
      // Create high-quality sound effects using Web Audio API
      this.sounds = {
        move: this.createTone(200, 0.1, 'sine'),
        rotate: this.createTone(300, 0.15, 'square'),
        drop: this.createTone(150, 0.2, 'sawtooth'),
        lineClear: this.createTone(800, 0.3, 'triangle'),
        levelUp: this.createTone(600, 0.4, 'sine'),
        gameOver: this.createTone(100, 0.5, 'sawtooth')
      };
    },

    createTone(frequency, duration, type) {
      return {
        frequency,
        duration,
        type,
        play: () => this.playTone(frequency, duration, type)
      };
    },

    playTone(frequency, duration, type) {
      if (this.muted) return;
      
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(this.volume * 0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
        
        // Clean up
        setTimeout(() => {
          audioContext.close();
        }, duration * 1000 + 100);
      } catch (e) {
        console.log('Tone play failed:', e);
      }
    },
    
    createMusic() {
      // Create a more sophisticated chiptune music system
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Tetris-style chiptune melodies
      const melodies = [
        // Main theme (inspired by Tetris theme)
        [
          { note: 330, duration: 400 }, // E4
          { note: 262, duration: 200 }, // C4
          { note: 330, duration: 400 }, // E4
          { note: 262, duration: 200 }, // C4
          { note: 330, duration: 400 }, // E4
          { note: 392, duration: 400 }, // G4
          { note: 523, duration: 800 }, // C5
          { note: 392, duration: 400 }, // G4
        ],
        // Secondary melody
        [
          { note: 262, duration: 300 }, // C4
          { note: 330, duration: 300 }, // E4
          { note: 392, duration: 300 }, // G4
          { note: 523, duration: 600 }, // C5
          { note: 392, duration: 300 }, // G4
          { note: 330, duration: 300 }, // E4
        ]
      ];
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();
      
      oscillator.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'square';
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, audioContext.currentTime);
      filter.Q.setValueAtTime(1, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
      
      return { 
        audioContext, 
        oscillator, 
        gainNode, 
        filter,
        melodies,
        currentMelody: 0,
        isPlaying: false 
      };
    },
    
    createAudio(base64Data) {
      const audio = new Audio();
      audio.src = base64Data;
      audio.volume = this.volume;
      return audio;
    },
    
    createChiptuneMusic() {
      // Create a simple chiptune melody using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      
      return { audioContext, oscillator, gainNode, isPlaying: false };
    },
    
    playSound(soundName) {
      if (this.muted || !this.sounds[soundName]) return;
      
      const sound = this.sounds[soundName];
      if (sound.play) {
        sound.play();
      } else {
        // Fallback for old audio system
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Audio play failed:', e));
      }
    },
    
    playMusic() {
      if (this.muted || !this.music) return;
      
      try {
        if (!this.music.isPlaying) {
          this.music.oscillator.start();
          this.music.isPlaying = true;
          this.startMusicLoop();
        }
      } catch (e) {
        console.log('Music start failed:', e);
      }
    },
    
    stopMusic() {
      if (!this.music) return;
      
      try {
        this.music.oscillator.stop();
        this.music.isPlaying = false;
      } catch (e) {
        console.log('Music stop failed:', e);
      }
    },
    
    startMusicLoop() {
      if (!this.music || !this.music.isPlaying) return;
      
      const melody = this.music.melodies[this.music.currentMelody];
      let noteIndex = 0;
      
      const playNote = () => {
        if (!this.music.isPlaying) return;
        
        const note = melody[noteIndex];
        this.music.oscillator.frequency.setValueAtTime(note.note, this.music.audioContext.currentTime);
        
        noteIndex = (noteIndex + 1) % melody.length;
        
        // Switch to next melody when current one finishes
        if (noteIndex === 0) {
          this.music.currentMelody = (this.music.currentMelody + 1) % this.music.melodies.length;
        }
        
        setTimeout(playNote, note.duration);
      };
      
      playNote();
    },
    
    toggleMute() {
      this.muted = !this.muted;
      if (this.muted) {
        this.stopMusic();
      } else {
        this.playMusic();
      }
      localStorage.setItem('tetris-muted', this.muted);
    },
    
    setVolume(volume) {
      this.volume = Math.max(0, Math.min(1, volume));
      Object.values(this.sounds).forEach(sound => {
        sound.volume = this.volume;
      });
      localStorage.setItem('tetris-volume', this.volume);
    },
    
    loadAudioSettings() {
      const muted = localStorage.getItem('tetris-muted') === 'true';
      const volume = parseFloat(localStorage.getItem('tetris-volume')) || 0.7;
      
      this.muted = muted;
      this.setVolume(volume);
    }
  };

  const COLS = 10;
  const ROWS = 20;
  const BLOCK = 30; // px size

  canvas.width = COLS * BLOCK;
  canvas.height = ROWS * BLOCK;


  const COLORS = {
    I: "#00e5ff",
    J: "#7c4dff",
    L: "#ff9100",
    O: "#ffd166",
    S: "#00e676",
    T: "#ff4d9d",
    Z: "#ff5252",
    GHOST: "#3c4257"
  };

  // Shapes (matrices)
  const SHAPES = {
    I: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    J: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    L: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    O: [
      [1, 1],
      [1, 1]
    ],
    S: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    T: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    Z: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ]
  };

  const TYPES = Object.keys(SHAPES);

  function rotateMatrix(matrix) {
    const N = matrix.length;
    const res = Array.from({ length: N }, () => Array(N).fill(0));
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        res[x][N - 1 - y] = matrix[y][x];
      }
    }
    return res;
  }

  function createEmptyBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  }

  function randomType() {
    return TYPES[(Math.random() * TYPES.length) | 0];
  }

  function createPiece(type) {
    const shape = SHAPES[type].map(row => row.slice());
    return {
      type,
      color: COLORS[type],
      matrix: shape,
      x: ((COLS / 2) | 0) - ((shape[0].length / 2) | 0),
      y: -getTopOffset(shape)
    };
  }

  function getTopOffset(matrix) {
    for (let y = 0; y < matrix.length; y++) {
      if (matrix[y].some(v => v)) return y;
    }
    return 0;
  }

  function collides(board, piece, offX = 0, offY = 0, testMatrix = null) {
    const m = testMatrix || piece.matrix;
    for (let y = 0; y < m.length; y++) {
      for (let x = 0; x < m[y].length; x++) {
        if (!m[y][x]) continue;
        const bx = piece.x + x + offX;
        const by = piece.y + y + offY;
        if (bx < 0 || bx >= COLS || by >= ROWS) return true;
        if (by >= 0 && board[by][bx]) return true;
      }
    }
    return false;
  }

  function merge(board, piece) {
    for (let y = 0; y < piece.matrix.length; y++) {
      for (let x = 0; x < piece.matrix[y].length; x++) {
        if (piece.matrix[y][x]) {
          const by = piece.y + y;
          const bx = piece.x + x;
          if (by >= 0) board[by][bx] = piece.color;
        }
      }
    }
  }

  function clearLines(board) {
    let cleared = 0;
    outer: for (let y = ROWS - 1; y >= 0; y--) {
      for (let x = 0; x < COLS; x++) {
        if (!board[y][x]) {
          continue outer;
        }
      }
      // full line
      const row = board.splice(y, 1)[0];
      row.fill(null);
      board.unshift(row);
      cleared++;
      y++; // re-check same y after unshift
    }
    return cleared;
  }

  function drawCell(context, x, y, color, size) {
    const px = x * size;
    const py = y * size;
    context.fillStyle = color;
    context.fillRect(px + 1, py + 1, size - 2, size - 2);
    // glossy overlay
    const grad = context.createLinearGradient(px, py, px, py + size);
    grad.addColorStop(0, "rgba(255,255,255,0.22)");
    grad.addColorStop(0.35, "rgba(255,255,255,0.05)");
    grad.addColorStop(1, "rgba(0,0,0,0.18)");
    context.fillStyle = grad;
    context.fillRect(px + 1, py + 1, size - 2, size - 2);
    // border glow
    context.strokeStyle = "rgba(255,255,255,0.12)";
    context.strokeRect(px + 0.5, py + 0.5, size - 1, size - 1);
  }

  function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // subtle grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    for (let y = 0; y <= ROWS; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * BLOCK);
      ctx.lineTo(canvas.width, y * BLOCK);
      ctx.stroke();
    }
    for (let x = 0; x <= COLS; x++) {
      ctx.beginPath();
      ctx.moveTo(x * BLOCK, 0);
      ctx.lineTo(x * BLOCK, canvas.height);
      ctx.stroke();
    }

    // ghost piece
    const ghostY = getGhostY();
    if (ghostY !== null) {
      drawPiece(current.x, ghostY, current.matrix, COLORS.GHOST);
    }

    // settled blocks
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const color = board[y][x];
        if (color) drawCell(ctx, x, y, color, BLOCK);
      }
    }

    // current piece
    drawPiece(current.x, current.y, current.matrix, current.color);
  }

  function drawPiece(px, py, matrix, color) {
    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x]) drawCell(ctx, px + x, py + y, color, BLOCK);
      }
    }
  }

  function drawNext() {
    nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
    const m = next.matrix;
    const size = 20; // Fixed size for better preview
    const offX = (nextCanvas.width - m[0].length * size) / 2;
    const offY = (nextCanvas.height - m.length * size) / 2;
    
    for (let y = 0; y < m.length; y++) {
      for (let x = 0; x < m[y].length; x++) {
        if (m[y][x]) drawCell(nextCtx, offX / size + x, offY / size + y, next.color, size);
      }
    }
  }

  function getGhostY() {
    let y = current.y;
    while (!collides(board, current, 0, (y + 1) - current.y)) {
      y++;
      if (y > ROWS) return null;
    }
    return y;
  }

  function updateScore(cleared) {
    const pointsByLines = [0, 100, 300, 500, 800];
    score += pointsByLines[cleared] * level;
    lines += cleared;
    
    // Enhanced level progression
    const newLevel = Math.floor(lines / 10) + 1;
    if (newLevel > level) {
      level = newLevel;
      dropInterval = Math.max(50, 1000 - (level - 1) * 100);
      // Level up effect
      levelUpEffect();
      audioManager.playSound('levelUp');
    }
    
    // Update level progress
    updateLevelProgress();
    
    best = Math.max(best, score);
    localStorage.setItem("tetris-best", String(best));

    scoreEl.textContent = String(score);
    levelEl.textContent = String(level);
    linesEl.textContent = String(lines);
    bestEl.textContent = String(best);
  }

  function updateLevelProgress() {
    const linesInCurrentLevel = lines % 10;
    const progressPercentage = (linesInCurrentLevel / 10) * 100;
    const linesRemaining = 10 - linesInCurrentLevel;
    
    nextLevelEl.textContent = String(level + 1);
    linesToNextEl.textContent = `${linesRemaining} lines to go`;
    progressFillEl.style.width = `${progressPercentage}%`;
  }

  function levelUpEffect() {
    // Visual level up feedback
    levelEl.style.transform = "scale(1.2)";
    levelEl.style.color = "#ffd166";
    setTimeout(() => {
      levelEl.style.transform = "scale(1)";
      levelEl.style.color = "#8be9fd";
    }, 500);
    
    // Flash the board briefly
    const original = canvas.style.filter;
    canvas.style.filter = "brightness(1.3) saturate(1.2)";
    setTimeout(() => (canvas.style.filter = original), 300);
  }

  function spawn() {
    current = next;
    next = createPiece(randomType());
    if (collides(board, current)) {
      // game over
      gameOver();
    }
    drawNext();
  }

  function gameOver() {
    paused = true;
    pauseBtn.textContent = "Resume";
    
    // Play game over sound
    audioManager.playSound('gameOver');
    
    // Show game over modal
    showGameOverModal();
    
    // Update final stats
    document.getElementById("modalFinalScore").textContent = String(score);
    document.getElementById("modalFinalLevel").textContent = String(level);
    document.getElementById("modalFinalLines").textContent = String(lines);
  }

  function showGameOverModal() {
    const modal = document.getElementById("gameOverModal");
    modal.classList.remove("hidden");
  }

  function hideGameOverModal() {
    const modal = document.getElementById("gameOverModal");
    modal.classList.add("hidden");
  }

  function softDrop() {
    if (paused) return;
    if (!collides(board, current, 0, 1)) {
      current.y++;
    } else {
      merge(board, current);
      audioManager.playSound('drop');
      const cleared = clearLines(board);
      if (cleared) {
        audioManager.playSound('lineClear');
        updateScore(cleared);
      }
      spawn();
    }
    drawBoard();
  }

  function hardDrop() {
    if (paused) return;
    while (!collides(board, current, 0, 1)) current.y++;
    merge(board, current);
    audioManager.playSound('drop');
    const cleared = clearLines(board);
    if (cleared) {
      audioManager.playSound('lineClear');
      updateScore(cleared);
    }
    spawn();
    drawBoard();
  }

  function move(dir) {
    if (paused) return;
    const off = dir === "left" ? -1 : 1;
    if (!collides(board, current, off, 0)) {
      current.x += off;
      audioManager.playSound('move');
    }
    drawBoard();
  }

  function rotate() {
    if (paused) return;
    const rotated = rotateMatrix(current.matrix);
    // simple wall kick attempts
    if (!collides(board, current, 0, 0, rotated)) {
      current.matrix = rotated;
      audioManager.playSound('rotate');
    } else if (!collides(board, current, -1, 0, rotated)) {
      current.x -= 1; current.matrix = rotated;
      audioManager.playSound('rotate');
    } else if (!collides(board, current, 1, 0, rotated)) {
      current.x += 1; current.matrix = rotated;
      audioManager.playSound('rotate');
    }
    drawBoard();
  }

  
  let board = createEmptyBoard();
  let current = createPiece(randomType());
  let next = createPiece(randomType());
  let score = 0;
  let level = 1;
  let lines = 0;
  let best = Number(localStorage.getItem("tetris-best") || "0");
  bestEl.textContent = String(best);

  let lastTime = 0;
  let dropCounter = 0;
  let dropInterval = 1000; // ms
  let paused = false;

  function update(time = 0) {
    const delta = time - lastTime;
    lastTime = time;
    if (!paused) {
      dropCounter += delta;
      if (dropCounter > dropInterval) {
        softDrop();
        dropCounter = 0;
      }
    }
    requestAnimationFrame(update);
  }

  function resetGame() {
    board = createEmptyBoard();
    current = createPiece(randomType());
    next = createPiece(randomType());
    score = 0; 
    level = 1; 
    lines = 0; 
    dropInterval = 1000; 
    paused = false;
    
    scoreEl.textContent = "0"; 
    levelEl.textContent = "1"; 
    linesEl.textContent = "0";
    pauseBtn.textContent = "Pause";
    
    // Reset level progress
    updateLevelProgress();
    
    // Hide any modals
    hideGameOverModal();
    
    // Start background music
    audioManager.playMusic();
    
    drawBoard();
    drawNext();
  }

  
  drawBoard();
  drawNext();
  update();

  // Events
  document.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "ArrowLeft": e.preventDefault(); move("left"); break;
      case "ArrowRight": e.preventDefault(); move("right"); break;
      case "ArrowDown": e.preventDefault(); softDrop(); break;
      case "ArrowUp": e.preventDefault(); rotate(); break;
      case "Space": e.preventDefault(); hardDrop(); break;
      case "KeyP": 
        paused = !paused; 
        pauseBtn.textContent = paused ? "Resume" : "Pause";
        // Pause/resume music
        if (paused) {
          audioManager.stopMusic();
        } else {
          audioManager.playMusic();
        }
        break;
      case "KeyN": resetGame(); break;
    }
  });

  newGameBtn.addEventListener("click", resetGame);
  pauseBtn.addEventListener("click", () => { 
    paused = !paused; 
    pauseBtn.textContent = paused ? "Resume" : "Pause";
    // Pause/resume music
    if (paused) {
      audioManager.stopMusic();
    } else {
      audioManager.playMusic();
    }
  });

  // Modal event listeners
  document.getElementById("modalPlayAgain").addEventListener("click", () => {
    hideGameOverModal();
    resetGame();
  });

  document.getElementById("modalClose").addEventListener("click", hideGameOverModal);

  // Close modal when clicking outside
  document.getElementById("gameOverModal").addEventListener("click", (e) => {
    if (e.target.id === "gameOverModal") {
      hideGameOverModal();
    }
  });

  // Initialize level progress
  updateLevelProgress();

  // Initialize audio manager
  audioManager.init();

  // Handle first user interaction to start audio
  let audioStarted = false;
  const startAudio = () => {
    if (!audioStarted) {
      audioManager.playMusic();
      audioStarted = true;
      // Remove event listeners after first interaction
      document.removeEventListener('click', startAudio);
      document.removeEventListener('keydown', startAudio);
      document.removeEventListener('touchstart', startAudio);
    }
  };

  // Add event listeners for first interaction
  document.addEventListener('click', startAudio);
  document.addEventListener('keydown', startAudio);
  document.addEventListener('touchstart', startAudio);

  // Audio control event listeners
  volumeSlider.addEventListener("input", (e) => {
    const volume = e.target.value / 100;
    audioManager.setVolume(volume);
    volumeValue.textContent = `${e.target.value}%`;
  });

  muteBtn.addEventListener("click", () => {
    audioManager.toggleMute();
    muteBtn.textContent = audioManager.muted ? "🔇" : "🔊";
    muteBtn.classList.toggle("muted", audioManager.muted);
  });

  // Set initial volume from audio manager
  volumeSlider.value = audioManager.volume * 100;
  volumeValue.textContent = `${Math.round(audioManager.volume * 100)}%`;
  muteBtn.classList.toggle("muted", audioManager.muted);
  muteBtn.textContent = audioManager.muted ? "🔇" : "🔊";

  // Utility functions for footer links
  window.showControls = function() {
    alert(`Tetris Controls:
    
← → Arrow Keys: Move piece left/right
↑ Arrow Key: Rotate piece clockwise
↓ Arrow Key: Soft drop (move down faster)
Spacebar: Hard drop (instant drop)
P Key: Pause/Resume game
N Key: Start new game

Have fun playing! 🎮`);
  };

  window.showAbout = function() {
    alert(`Colorful Tetris v2.0
    
A modern, responsive Tetris game built with HTML5 Canvas and vanilla JavaScript.

Features:
• Beautiful, colorful graphics
• Progressive difficulty levels
• Score tracking with local storage
• Responsive design for all devices
• Smooth animations and effects

Enjoy the game! 🌈`);
  };
})();
