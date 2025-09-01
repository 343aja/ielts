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
        saveAsText();
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

  // Wait a bit for DOM to be fully ready
  setTimeout(() => {
    const tabs = document.querySelectorAll('.tab');
    const parts = document.querySelectorAll('.question-part');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const partNum = tab.getAttribute('data-part');

      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Hide all parts and show only the selected one
      parts.forEach(part => {
        part.classList.add('hidden');
        part.classList.remove('active');
      });
      
      const selectedPart = document.getElementById(`part-${partNum}`);
      if (selectedPart) {
        selectedPart.classList.remove('hidden');
        selectedPart.classList.add('active');
      }
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
          // Check for clickable cell answers (Part 3, Q27-30)
          const clickableCell = document.querySelector(`.clickable-cell[data-question="${i}"].selected`);
          if (clickableCell) {
            answer = clickableCell.getAttribute('data-value');
            console.log(`Q${i} answer from clickable cell:`, answer);
          } else {
            answer = ''; // hech qanday input topilmasa
            console.log(`Q${i} no answer found`);
          }
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
      window.location.href = './reading.html'; // mock-test-2 uchun mos sahifa
    }, 1000); // 1 soniya kutish,
  }

  // Handle clickable cells for matching questions (Part 3, Q27-30)
  const clickableCells = document.querySelectorAll('.clickable-cell');
  console.log('Found clickable cells:', clickableCells.length);
  
  if (clickableCells.length > 0) {
    clickableCells.forEach(cell => {
      cell.addEventListener('click', function() {
        console.log('Cell clicked:', this);
        const questionNum = this.getAttribute('data-question');
        const value = this.getAttribute('data-value');
        
        console.log('Question:', questionNum, 'Value:', value);
        
        // Remove selected class from all cells in the same row
        const row = this.closest('tr');
        if (row) {
          row.querySelectorAll('.clickable-cell').forEach(c => c.classList.remove('selected'));
        }
        
        // Add selected class to clicked cell
        this.classList.add('selected');
        
        // Store the answer in a hidden input or data attribute
        this.setAttribute('data-selected', 'true');
        this.setAttribute('data-answer', value);
        
        console.log('Cell selected:', this.classList.contains('selected'));
      });
    });
  } else {
    console.log('No clickable cells found - this might be the issue');
  }

  // Make saveAsText function globally available
  window.saveAsText = saveAsText;
  }, 100); // Close setTimeout
});
