const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const minutesInput = document.getElementById("minutesInput");
const secondsInput = document.getElementById("secondsInput");
const minutesLabel = document.getElementById("minutesLabel");
const secondsLabel = document.getElementById("secondsLabel");
const clock = document.getElementById("clock");
const scene = document.getElementById("scene");

let minutes = 0;
let seconds = 10;
let totalTime = 0;
let time = 0;
let startTimer = false;
let intervalId = null;

function getState() {
  if (!startTimer && time <= 0 && totalTime <= 0) {
    return "unstarted";
  } else if (startTimer && time > 0 && totalTime > 0) {
    return "running";
  } else if (!startTimer && time > 0 && totalTime > 0) {
    return "paused";
  } else if (!startTimer && time <= 0 && totalTime > 0) {
    return "finished";
  }
  return "unknown";
}

function formatTime() {
  const totalSeconds = time / 100;
  const displayMinutes = Math.floor(totalSeconds / 60);
  const displaySeconds = Math.floor(totalSeconds % 60);
  if (displaySeconds > 9) {
    return `${displayMinutes}:${displaySeconds}`;
  }
  if (displaySeconds > 0) {
    return `${displayMinutes}:0${displaySeconds}`;
  }
  return `${displayMinutes}:00`;
}

function clearTimerInterval() {
  if (!intervalId) return;
  clearInterval(intervalId);
  intervalId = null;
}

function ensureRunningInterval() {
  if (!startTimer || totalTime <= 0 || intervalId) {
    return;
  }
  intervalId = setInterval(() => {
    time = Math.max(0, time - 1);
    if (time <= 0) {
      startTimer = false;
      clearTimerInterval();
    }
    render();
  }, 10);
}

function renderScene() {
  const state = getState();
  const safeRatio = totalTime > 0 ? time / totalTime : 1;
  const bunnyLeft = `calc((100% - 150px) * (1 - ${safeRatio}))`;
  const lineWidth = `calc((100% - 130px) * (1 - ${safeRatio}))`;

  if (state === "running" && scene.dataset.state === "running") {
    const bunnyAnim = scene.querySelector(".bunnyAnim");
    const timeline = scene.querySelector(".timeline");
    if (bunnyAnim) {
      bunnyAnim.style.left = bunnyLeft;
    }
    if (timeline) {
      timeline.style.width = lineWidth;
    }
    return;
  }

  if (state === "unstarted") {
    scene.dataset.state = "unstarted";
    scene.innerHTML = `
      <div class="bunnyAnim">
        <div class="bunny">
          <img src="../assets/bunny1.png" alt="bunny" />
        </div>
        <div class="carrot1">
          <img src="../assets/carrot1.png" alt="carrot" />
        </div>
      </div>
    `;
    return;
  }

  if (state === "running" || state === "paused") {
    const bunnyMarkup =
      state === "running"
        ? `
          <div class="bunny1">
            <img src="../assets/bunny1.png" alt="bunny 1" />
          </div>
          <div class="bunny2">
            <img src="../assets/bunny2.png" alt="bunny 2" />
          </div>
        `
        : `
          <div class="bunny">
            <img src="../assets/bunny1.png" alt="bunny" />
          </div>
        `;

    scene.dataset.state = state;
    scene.innerHTML = `
      <div class="bunny-line-area">
        <div class="bunnyAnim" style="left: ${bunnyLeft};">
          ${bunnyMarkup}
        </div>
        <div class="carrot1">
          <img src="../assets/carrot1.png" alt="carrot" />
        </div>
        <div class="timeline" style="width: ${lineWidth};"></div>
      </div>
    `;
    return;
  }

  scene.dataset.state = "finished";
  scene.innerHTML = `
    <div class="bunny-line-area">
      <div class="bunnyAnim" style="left: calc((100% - 150px));">
        <div class="bunny">
          <img src="../assets/bunny1.png" alt="bunny" />
        </div>
      </div>
      <div class="carrot2">
        <img src="../assets/carrot2.png" alt="carrot" />
      </div>
      <div class="timeline"></div>
    </div>
  `;
}

function renderControls() {
  const state = getState();
  const runningOrPaused = state === "running" || state === "paused";

  startBtn.disabled = runningOrPaused;
  pauseBtn.classList.toggle("hidden", !runningOrPaused);
  pauseBtn.textContent = state === "paused" ? "Resume" : "Pause";

  minutesInput.classList.toggle("hidden", runningOrPaused);
  secondsInput.classList.toggle("hidden", runningOrPaused);
  minutesLabel.classList.toggle("hidden", runningOrPaused);
  secondsLabel.classList.toggle("hidden", runningOrPaused);

  clock.classList.toggle("hidden", !runningOrPaused);
  if (runningOrPaused) {
    clock.textContent = formatTime();
  }
}

function render() {
  renderScene();
  renderControls();
}

function sanitizeInputs() {
  minutes = Math.max(0, Number(minutesInput.value) || 0);
  seconds = Math.max(0, Math.min(59, Number(secondsInput.value) || 0));
  minutesInput.value = String(minutes);
  secondsInput.value = String(seconds);
}

startBtn.addEventListener("click", () => {
  sanitizeInputs();
  const selected = (minutes * 60 + seconds) * 100;
  if (selected <= 0) {
    return;
  }
  time = selected;
  totalTime = selected;
  startTimer = true;
  ensureRunningInterval();
  render();
});

pauseBtn.addEventListener("click", () => {
  if (startTimer) {
    startTimer = false;
    clearTimerInterval();
  } else if (time > 0 && totalTime > 0) {
    startTimer = true;
    ensureRunningInterval();
  }
  render();
});

resetBtn.addEventListener("click", () => {
  totalTime = 0;
  time = 0;
  startTimer = false;
  clearTimerInterval();
  render();
});

minutesInput.addEventListener("change", sanitizeInputs);
secondsInput.addEventListener("change", sanitizeInputs);

render();
