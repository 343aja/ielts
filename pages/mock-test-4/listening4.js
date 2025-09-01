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

  function startAudioAndTimer() {
    if (!started) {
      started = true;
      audioStatus.textContent = "Audio loaded. Playing...";
      audio.play();
      updateDisplay();
      timer = setInterval(tick, 1000);
    }
  }

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

  setTimeout(() => {
    const tabs = document.querySelectorAll('.tab');
    const parts = document.querySelectorAll('.question-part');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const partNum = tab.getAttribute('data-part');

        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

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

    // === Drag & Drop Setup ===
    function setupDragAndDrop() {
      const dragItems = document.querySelectorAll(".drag-item");
      const dropZones = document.querySelectorAll(".drop-zone");

      dragItems.forEach((item) => {
        item.addEventListener("dragstart", function (e) {
          e.dataTransfer.setData("text/plain", this.getAttribute("data-letter"));
          this.classList.add("dragging");
        });

        item.addEventListener("dragend", function () {
          this.classList.remove("dragging");
        });
      });

      dropZones.forEach((zone) => {
        zone.addEventListener("dragover", function (e) {
          e.preventDefault();
          this.classList.add("dragover");
        });

        zone.addEventListener("dragleave", function () {
          this.classList.remove("dragover");
        });

        zone.addEventListener("drop", function (e) {
          e.preventDefault();
          this.classList.remove("dragover");

          const letter = e.dataTransfer.getData("text/plain");
          const draggedItem = document.querySelector(`.drag-item[data-letter="${letter}"]`);

          if (draggedItem) {
            this.innerHTML = "";
            const clone = draggedItem.cloneNode(true);
            clone.setAttribute("draggable", "true");
            this.appendChild(clone);

            // hidden input update
            const qId = this.getAttribute("data-question-id");
            document.getElementById(`q${qId}`).value = letter;
          }
        });
      });
    }
    setupDragAndDrop();

    // === Save answers as text ===
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
          const checkboxes = document.querySelectorAll(`input[type="checkbox"][name="q${i}"]:checked`);
          const multiCheckbox = document.querySelectorAll(`input[type="checkbox"][name="q${i}-${i + 1}"]:checked`);
          const selectInput = document.querySelector(`select#q${i}`);
          const hiddenInput = document.querySelector(`input[type="hidden"]#q${i}`);
          let answer = '';

          if (radioSelected) {
            answer = radioSelected.value;
          } else if (checkboxes.length > 0) {
            answer = Array.from(checkboxes).map(cb => cb.value).join(', ');
          } else if (multiCheckbox.length > 0) {
            answer = Array.from(multiCheckbox).map(cb => cb.value).join(', ');
          } else if (textInput) {
            answer = textInput.value.trim();
          } else if (textareaInput) {
            answer = textareaInput.value.trim();
          } else if (selectInput) {
            answer = selectInput.value;
          } else if (hiddenInput && hiddenInput.value.trim() !== '') {
            // drag-drop hidden inputdan olish
            answer = hiddenInput.value.trim();
          } else {
            const clickableCell = document.querySelector(`.clickable-cell[data-question="${i}"].selected`);
            if (clickableCell) {
              answer = clickableCell.getAttribute('data-value');
            } else {
              answer = '';
            }
          }

          content += `Q${i}: ${answer}\n`;
        }

        content += '\n';
      }

      const blob = new Blob([content], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'listening.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      setTimeout(() => {
        window.location.href = './readin4.html'; // o'zingizga kerakli sahifa nomini yozing
      }, 1000);

    }

    window.saveAsText = saveAsText;
  }, 100);
});
