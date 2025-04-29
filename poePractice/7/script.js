let timer;
let totalSeconds = 0;

const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const timeDisplay = document.getElementById('time-display');
const minutesInput = document.getElementById('minutes-input');

startBtn.addEventListener('click', startCountdown);
resetBtn.addEventListener('click', resetCountdown);

function startCountdown() {
    const minutes = parseInt(minutesInput.value);

    if (isNaN(minutes) || minutes <= 0) {
        alert('Please enter a valid number of minutes.');
        return;
    }

    totalSeconds = minutes * 60;
    updateDisplay();

    clearInterval(timer);
    timer = setInterval(() => {
        totalSeconds--;
        updateDisplay();

        if (totalSeconds <= 0) {
            clearInterval(timer);
            alert('Time is up!');
        }
    }, 1000);
}

function updateDisplay() {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    timeDisplay.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function resetCountdown() {
    clearInterval(timer);
    timeDisplay.textContent = "00:00";
    minutesInput.value = "";
}
