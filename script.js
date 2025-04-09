// Pomodoro Variables
let timer;
let timeLeft = 25 * 60;
let isRunning = false;
let mode = "work"; 

// DOM Elements
const timerDisplay = document.getElementById("timer");
const progressBar = document.getElementById("progress");
const modeDisplay = document.getElementById("mode");
const alarmSound = document.getElementById("alarm");
const usernameInput = document.getElementById("username");
const audioPlayer = document.getElementById("audio-player");
const musicSelect = document.getElementById("music-select");

// Music Track List
const musicTracks = [
  { name: "A Bird", url: "a-bird.mp3" },
  { name: "Bird Flight", url: "bird-flight.mp3" },
  { name: "Cinematic Ascent", url: "cenematic-ascent.mp3" },
  { name: "Investigation", url: "nature-investigation.mp3" },
  { name: "Faraway", url: "faraway-bird.mp3" },
  { name: "Meet The Rain", url: "meet-the-rain.mp3" },
  { name: "Smooth", url: "smooth.mp3" },
  { name: "Voice Of Nature", url: "voice of nature.mp3" },
  { name: "Water Fountain", url: "Water-fountain.mp3" }
];

//  Music Dropdown
musicTracks.forEach(track => {
  let option = document.createElement("option");
  option.value = track.url;
  option.textContent = track.name;
  musicSelect.appendChild(option);
});

// Handle Music Selection
musicSelect.addEventListener("change", function () {
  if (this.value) {
    audioPlayer.src = this.value;
  }
});

// Music Controls
document.getElementById("play-music").addEventListener("click", () => {
  if (audioPlayer.src) audioPlayer.play();
});

document.getElementById("pause-music").addEventListener("click", () => {
  audioPlayer.pause();
});

document.getElementById("stop-music").addEventListener("click", () => {
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
});

// Update Timer Display
function updateDisplay() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  timerDisplay.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  const total = mode === "work" ? 25 * 60 : 5 * 60;
  progressBar.style.width = `${(timeLeft / total) * 100}%`;
}

// Speech Function
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = speechSynthesis.getVoices().find(v => v.name.includes("Female")) || null;
  speechSynthesis.speak(utterance);
}

// Start Timer
function startTimer() {
  if (!isRunning) {
    isRunning = true;
    const user = usernameInput.value || "User";
    speak(`${user}, your Pomodoro time starts now.`);

    timer = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
      } else {
        clearInterval(timer);
        isRunning = false;
        alarmSound.play();
        switchMode();
      }
    }, 1000);
  }
}

// Pause Timer
function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

// Reset Timer
function resetTimer() {
  clearInterval(timer);
  isRunning = false;
  timeLeft = mode === "work" ? 25 * 60 : 5 * 60;
  updateDisplay();
}

// Switch Work/Break Mode
function switchMode() {
  mode = mode === "work" ? "break" : "work";
  timeLeft = mode === "work" ? 25 * 60 : 5 * 60;
  modeDisplay.textContent = mode === "work" ? "Work Mode" : "Break Mode";
  updateDisplay();
  const user = usernameInput.value || "User";
  speak(`${user}, time for ${mode === "work" ? "work" : "a break"}!`);
}

// Save to Local Storage
function saveState() {
  const state = {
    timeLeft,
    mode,
    isRunning
  };
  localStorage.setItem("pomodoroState", JSON.stringify(state));
}

// Load from Local Storage
function loadState() {
  const saved = localStorage.getItem("pomodoroState");
  if (saved) {
    const state = JSON.parse(saved);
    timeLeft = state.timeLeft;
    mode = state.mode;
    isRunning = false; // Don't auto-resume
    modeDisplay.textContent = mode === "work" ? "Work Mode" : "Break Mode";
    updateDisplay();
  }
}

// Event Listeners
document.getElementById("start").addEventListener("click", startTimer);
document.getElementById("pause").addEventListener("click", pauseTimer);
document.getElementById("reset").addEventListener("click", resetTimer);

// Update UI on load
window.onload = () => {
  loadState();
  updateDisplay();
};

// Save state when leaving the page
window.onbeforeunload = saveState;

}
