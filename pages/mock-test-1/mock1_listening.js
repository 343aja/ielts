document.addEventListener('DOMContentLoaded', function () {
  const audio = document.getElementById('audio-player');
  const timerDisplay = document.querySelector('.timer-display');
  const audioStatus = document.getElementById('audio-status');
  let timer = null;
  let totalSeconds = 30 * 60;
  let started = false;

  audio.controls = false;

  // Prevent pause/seek
  audio.addEventListener('pause', function () {
    if (!audio.ended) audio.play();
  });
  audio.addEventListener('seeking', function () {
    audio.currentTime = 0;
  });

  function updateDisplay() {
    const min = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const sec = String(totalSeconds % 60).padStart(2, '0');
    timerDisplay.textContent = `${min}:${sec}`;
  }

  function tick() {
    if (totalSeconds > 0) {
      totalSeconds--;
      updateDisplay();
      if (totalSeconds === 0) {
        clearInterval(timer);
        timerDisplay.textContent = "00:00";
        audio.pause();
        audio.currentTime = 0;
      }
    }
  }

  // Foydalanuvchi biror joyni bosganda audio va timer boshlansin
  function startAudioAndTimer() {
    if (!started) {
      started = true;
      audioStatus.textContent = "Audio loaded. Playing...";
      audio.play();
      updateDisplay();
      timer = setInterval(tick, 1000);
    }
  }

  // Sahifani bosganda audio va timer boshlansin
  document.body.addEventListener('click', startAudioAndTimer, { once: true });

  audio.addEventListener('canplaythrough', function () {
    audioStatus.textContent = "Audio loaded. Click anywhere to start.";
  });

  audio.addEventListener('ended', function () {
    audioStatus.textContent = "Audio finished.";
  });

  audio.addEventListener('error', function () {
    audioStatus.textContent = "Audio failed to load!";
  });

  updateDisplay();

  const tabs = document.querySelectorAll('.tab');
  const parts = document.querySelectorAll('.question-part');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const partNum = tab.getAttribute('data-part');

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      parts.forEach(part => part.classList.remove('active'));
      document.getElementById(`part-${partNum}`).classList.add('active');
    });
  });

  // Input tracking
  function saveAsText() {
    let content = '';

    for (let part = 1; part <= 4; part++) {
      content += `Part ${part}:\n`;

      const start = (part - 1) * 10 + 1;
      const end = part * 10;

      for (let i = start; i <= end; i++) {
        const radioSelected = document.querySelector(`input[type="radio"][name="q${i}"]:checked`);
        const textInput = document.querySelector(`input[type="text"]#q${i}`);
        const textareaInput = document.querySelector(`textarea#q${i}`);

        let answer = '';

        if (radioSelected) {
          answer = radioSelected.value;
        } else if (textInput) {
          answer = textInput.value.trim();
        } else if (textareaInput) {
          answer = textareaInput.value.trim();
        } else {
          answer = ''; // hech qanday input topilmasa
        }

        content += `Q${i}: ${answer}\n`;
      }

      content += '\n'; // Har partdan keyin bo'sh satr
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'listening.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    // Redirect qilish (masalan: reading.html sahifasiga)
    setTimeout(() => {
      window.location.href = './mock1_reading.html'; // o'zingizga kerakli sahifa nomini yozing
    }, 1000); // 1 soniya kutish,
  }

  // Make saveAsText function globally available
  window.saveAsText = saveAsText;
});