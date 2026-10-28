// ---------- tab switching ----------
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    // turn everything off first, then turn on the one that was clicked
    tabButtons.forEach(btn => btn.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));

    button.classList.add('active');
    document.getElementById(button.dataset.tab).classList.add('active');
  });
});

// just a helper i use in a few places to always show 2 digits, like 05 instead of 5
function padTime(num) {
  return String(num).padStart(2, '0');
}


// ---------- clock ----------
const clockTimeEl = document.getElementById('clock-time');
const clockDateEl = document.getElementById('clock-date');

function updateClock() {
  const now = new Date();
  const hours = padTime(now.getHours());
  const minutes = padTime(now.getMinutes());
  const seconds = padTime(now.getSeconds());
  clockTimeEl.textContent = `${hours}:${minutes}:${seconds}`;

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  clockDateEl.textContent = now.toLocaleDateString(undefined, options);
}

updateClock(); // so it doesn't sit blank for a second before the interval kicks in
setInterval(updateClock, 1000);


// ---------- stopwatch ----------
const stopwatchTimeEl = document.getElementById('stopwatch-time');
const stopwatchStartBtn = document.getElementById('stopwatch-start');
const stopwatchLapBtn = document.getElementById('stopwatch-lap');
const stopwatchResetBtn = document.getElementById('stopwatch-reset');
const lapsListEl = document.getElementById('stopwatch-laps');

let stopwatchInterval = null;
let stopwatchSeconds = 0;
let stopwatchRunning = false;

function renderStopwatch() {
  const hours = Math.floor(stopwatchSeconds / 3600);
  const minutes = Math.floor((stopwatchSeconds % 3600) / 60);
  const seconds = stopwatchSeconds % 60;
  stopwatchTimeEl.textContent = `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`;
}

stopwatchStartBtn.addEventListener('click', () => {
  if (!stopwatchRunning) {
    // start it
    stopwatchInterval = setInterval(() => {
      stopwatchSeconds++;
      renderStopwatch();
    }, 1000);
    stopwatchStartBtn.textContent = 'Pause';
    stopwatchStartBtn.classList.add('running');
    stopwatchRunning = true;
  } else {
    // pause it
    clearInterval(stopwatchInterval);
    stopwatchStartBtn.textContent = 'Start';
    stopwatchStartBtn.classList.remove('running');
    stopwatchRunning = false;
  }
});

stopwatchLapBtn.addEventListener('click', () => {
  if (!stopwatchRunning) return; // no point logging a lap if it's not even running
  const li = document.createElement('li');
  li.textContent = stopwatchTimeEl.textContent;
  lapsListEl.prepend(li); // newest lap on top
});

stopwatchResetBtn.addEventListener('click', () => {
  clearInterval(stopwatchInterval);
  stopwatchSeconds = 0;
  stopwatchRunning = false;
  renderStopwatch();
  stopwatchStartBtn.textContent = 'Start';
  stopwatchStartBtn.classList.remove('running');
  lapsListEl.innerHTML = '';
});


// ---------- countdown timer ----------
const timerTimeEl = document.getElementById('timer-time');
const timerInputsEl = document.getElementById('timer-inputs');
const timerHoursInput = document.getElementById('timer-hours');
const timerMinutesInput = document.getElementById('timer-minutes');
const timerSecondsInput = document.getElementById('timer-seconds');
const timerStartBtn = document.getElementById('timer-start');
const timerResetBtn = document.getElementById('timer-reset');
const timerMessageEl = document.getElementById('timer-message');

let timerInterval = null;
let timerSecondsLeft = 0;
let timerRunning = false;

function renderTimer() {
  const hours = Math.floor(timerSecondsLeft / 3600);
  const minutes = Math.floor((timerSecondsLeft % 3600) / 60);
  const seconds = timerSecondsLeft % 60;
  timerTimeEl.textContent = `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`;
}

timerStartBtn.addEventListener('click', () => {
  if (!timerRunning) {
    // only read the inputs the first time, not every time you hit pause/resume
    if (timerSecondsLeft === 0) {
      const h = parseInt(timerHoursInput.value) || 0;
      const m = parseInt(timerMinutesInput.value) || 0;
      const s = parseInt(timerSecondsInput.value) || 0;
      timerSecondsLeft = h * 3600 + m * 60 + s;

      if (timerSecondsLeft === 0) {
        timerMessageEl.textContent = 'set a time first';
        return;
      }
      timerInputsEl.style.display = 'none';
    }

    timerMessageEl.textContent = '';
    timerInterval = setInterval(() => {
      timerSecondsLeft--;
      renderTimer();

      if (timerSecondsLeft <= 0) {
        clearInterval(timerInterval);
        timerRunning = false;
        timerStartBtn.textContent = 'Start';
        timerStartBtn.classList.remove('running');
        timerMessageEl.textContent = "time's up!";
      }
    }, 1000);

    timerStartBtn.textContent = 'Pause';
    timerStartBtn.classList.add('running');
    timerRunning = true;
  } else {
    clearInterval(timerInterval);
    timerStartBtn.textContent = 'Start';
    timerStartBtn.classList.remove('running');
    timerRunning = false;
  }
});

timerResetBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  timerSecondsLeft = 0;
  timerRunning = false;
  renderTimer();
  timerStartBtn.textContent = 'Start';
  timerStartBtn.classList.remove('running');
  timerMessageEl.textContent = '';
  timerInputsEl.style.display = 'flex';
  timerHoursInput.value = '';
  timerMinutesInput.value = '';
  timerSecondsInput.value = '';
});
