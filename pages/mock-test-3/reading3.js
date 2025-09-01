document.addEventListener("DOMContentLoaded", function () {
  // === CONSTANTS ===
  const STORAGE_KEY = "ielts_reading_answers";
  const TIMER_KEY = "ielts_reading_timer";
  let totalSeconds = restoreTimerFromStorage();
  const display = document.querySelector(".timer-display");
  let timer = null;

  // === TABLAR FUNKSIYASI ===
  function switchToPart(partNumber) {
    // Part header kontentlarini yashirish
    document.querySelectorAll(".part-header").forEach((el) => {
      el.classList.add("hidden");
    });

    // Tanlangan part header ni ko'rsatish
    const selectedHeader = document.getElementById(`part-header-${partNumber}`);
    if (selectedHeader) {
      selectedHeader.classList.remove("hidden");
    }

    // Passage text kontentlarini yashirish
    document.querySelectorAll(".reading-passage").forEach((el) => {
      el.classList.add("hidden");
    });

    // Tanlangan passage text ni ko'rsatish
    const selectedPassage = document.getElementById(
      `passage-text-${partNumber}`
    );
    if (selectedPassage) {
      selectedPassage.classList.remove("hidden");
    }

    // Questions kontentlarini yashirish
    document.querySelectorAll(".question-set").forEach((el) => {
      el.classList.add("hidden");
    });

    // Tanlangan questions ni ko'rsatish
    const selectedQuestions = document.getElementById(
      `questions-${partNumber}`
    );
    if (selectedQuestions) {
      selectedQuestions.classList.remove("hidden");
    }

    // Tugma ranglarini yangilash
    const buttons = document.querySelectorAll(".tabs .tab");
    buttons.forEach((btn, index) => {
      btn.classList.toggle("active", index + 1 === partNumber);
    });
  }

  // === ANSWERS SAQLASH ===
  function saveAnswersToStorage() {
    // Function removed - no localStorage saving
  }

  function restoreAnswersFromStorage() {
    // Function removed - no localStorage loading
  }

  function setupAutoSave() {
    document.querySelectorAll('input[type="radio"]').forEach((input) => {
      input.addEventListener("change", saveAnswersToStorage);
    });
    document
      .querySelectorAll('input[type="text"].answer-input')
      .forEach((input) => {
        input.addEventListener("input", saveAnswersToStorage);
      });
    document.querySelectorAll(".clickable-cell").forEach((cell) => {
      cell.addEventListener("click", () =>
        setTimeout(saveAnswersToStorage, 10)
      );
    });
    document.querySelectorAll(".drop-zone, .drag-item").forEach((el) => {
      el.addEventListener("drop", () => setTimeout(saveAnswersToStorage, 10));
    });
  }

  // === TIMER ===
  function saveTimerToStorage() {
    // Function removed - no localStorage saving
  }

  function restoreTimerFromStorage() {
    return 60 * 60; // 1 soat default - no localStorage loading
  }

  function updateDisplay() {
    const min = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const sec = String(totalSeconds % 60).padStart(2, "0");
    display.textContent = `${min}:${sec}`;
  }

  function tick() {
    if (totalSeconds > 0) {
      totalSeconds--;
      updateDisplay();
      saveTimerToStorage();

      if (totalSeconds === 0) {
        clearInterval(timer);
        display.textContent = "00:00";
        autoSubmitAnswers();
      }
    }
  }

  function startTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(tick, 1000);
  }

  // === JAVOBLARNI TXT YUKLASH ===
  function autoSubmitAnswers() {
    const answers = [];

    // Radio (TF, Multi-choice)
    document
      .querySelectorAll(".tf-question, .multi-choice-question")
      .forEach((q) => {
        const qStart = parseInt(q.getAttribute("data-q-start"));
        const qEnd = parseInt(q.getAttribute("data-q-end"));
        for (let i = qStart; i <= qEnd; i++) {
          const checked = q.querySelector(
            `input[type="radio"][name="q${i}"]:checked`
          );
          answers.push({ question: i, answer: checked ? checked.value : "" });
        }
      });
    // ✅ Select inputs (matching questions kabi)
    document.querySelectorAll("select.answer-input").forEach((select) => {
      const num = select.id.replace(/\D/g, "");
      answers.push({ question: parseInt(num), answer: select.value });
    });

    // Text inputs
    document
      .querySelectorAll('input[type="text"].answer-input')
      .forEach((input) => {
        const num = input.id.replace(/\D/g, "");
        answers.push({ question: parseInt(num), answer: input.value });
      });

    // Matching table
    document.querySelectorAll(".clickable-cell.selected").forEach((cell) => {
      const q = cell.getAttribute("data-question");
      const v = cell.getAttribute("data-value");
      answers.push({ question: parseInt(q), answer: v });
    });

    // Drag & drop
    document.querySelectorAll(".drop-zone[data-q]").forEach((zone) => {
      const q = parseInt(zone.getAttribute("data-q"));
      const drag = zone.querySelector(".drag-item");
      answers.push({
        question: q,
        answer: drag ? drag.getAttribute("data-value") : "",
      });
    });

    // Tartiblash
    answers.sort((a, b) => a.question - b.question);

    // TXT yaratish
    const txt = answers.map((a) => `${a.question}: ${a.answer}`).join("\n");
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reading.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setTimeout(() => {
      window.location.href = "./writing.html"; // o'zingizga kerakli sahifa nomini yozing
    }, 1000);
  }

  // === INIT ===
  restoreAnswersFromStorage();
  setupAutoSave();
  setupDragAndDrop();
  setupMatchingTable();
  updateDisplay();
  startTimer();
  switchToPart(1); // Default Part 1

  // Submit tugmasi
  document
    .getElementById("deliver-button")
    .addEventListener("click", autoSubmitAnswers);

  // Globalga switchToPart ni chiqarish (onclick ishlashi uchun)
  window.switchToPart = switchToPart;

  // Context menu elementini olish
  const contextMenu = document.getElementById("contextMenu");
  let selectedText = "";

  // O'ng tugma bosilganda custom menu ko'rsatish
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault(); // Brauzer default menyusini o'chirish

    selectedText = window.getSelection().toString().trim();

    // Agar matn tanlangan bo'lsa, menyuni ko'rsatish
    if (selectedText) {
      contextMenu.style.top = e.pageY + "px";
      contextMenu.style.left = e.pageX + "px";
      contextMenu.style.display = "block";
      contextMenu.classList.add("show");
    } else {
      contextMenu.style.display = "none";
      contextMenu.classList.remove("show");
    }
  });

  // Sahnadan tashqarida bosilganda menyuni yopish
  document.addEventListener("click", function () {
    contextMenu.style.display = "none";
    contextMenu.classList.remove("show");
  });

  // ESC tugmasi bosilganda menyuni yopish
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      contextMenu.style.display = "none";
      contextMenu.classList.remove("show");
    }
  });

  // Highlight funksiyasi
  function highlightText() {
    console.log("highlightText called, selectedText:", selectedText);

    if (!selectedText) {
      console.log("No text selected");
      return;
    }

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement("span");
      span.style.backgroundColor = "yellow";
      span.style.padding = "2px";
      span.style.borderRadius = "3px";
      span.style.display = "inline";
      span.textContent = selection.toString();

      try {
        range.deleteContents();
        range.insertNode(span);
        // Selection ni tozalash
        window.getSelection().removeAllRanges();
        console.log("Text highlighted successfully");
      } catch (error) {
        console.log("Highlight xatosi:", error);
      }
    } else {
      console.log("No selection range found");
    }

    contextMenu.style.display = "none";
    contextMenu.classList.remove("show");
  }

  // Globalga highlightText ni chiqarish
  window.highlightText = highlightText;

  // TypeScript xatolarini oldini olish uchun
  if (typeof window !== "undefined") {
    window.highlightText = highlightText;
  }

  // Global scope ga ham chiqarish
  globalThis.highlightText = highlightText;

  // Debug uchun console ga chiqarish
  console.log("highlightText function loaded:", typeof window.highlightText);
  console.log("window object:", window);
  console.log("globalThis object:", globalThis);

  // Test uchun global funksiya
  window.testHighlight = function () {
    console.log("Test highlight function called");
    alert("Highlight function is working!");
  };

  // === DRAG AND DROP FUNKSIYASI ===
  function setupDragAndDrop() {
    const dragItems = document.querySelectorAll(".drag-item");
    const dropZones = document.querySelectorAll(".drop-zone");

    dragItems.forEach((item) => {
      item.addEventListener("dragstart", function (e) {
        e.dataTransfer.setData("text/plain", this.getAttribute("data-value"));
        this.classList.add("dragging");
      });

      item.addEventListener("dragend", function () {
        this.classList.remove("dragging");
      });
    });

    dropZones.forEach((zone) => {
      zone.addEventListener("dragover", function (e) {
        e.preventDefault();
        this.style.backgroundColor = "#f0f8ff";
      });

      zone.addEventListener("dragleave", function () {
        this.style.backgroundColor = "#fff";
      });

      zone.addEventListener("drop", function (e) {
        e.preventDefault();
        this.style.backgroundColor = "#fff";

        const data = e.dataTransfer.getData("text/plain");
        const dragItem = document.querySelector(
          `.drag-item[data-value="${data}"]`
        );

        if (dragItem && this.querySelector(".drag-item") === null) {
          // Agar drop zone bo'sh bo'lsa, yangi element qo'shish
          const clone = dragItem.cloneNode(true);
          this.appendChild(clone);

          // Original elementni o'chirish
          dragItem.remove();

          // Auto-save
          setTimeout(saveAnswersToStorage, 10);
        }
      });
    });
  }

  // === MATCHING TABLE FUNKSIYASI ===
  function setupMatchingTable() {
    document.querySelectorAll(".clickable-cell").forEach((cell) => {
      cell.addEventListener("click", function () {
        const question = this.getAttribute("data-question");
        const value = this.getAttribute("data-value");

        // Boshqa tanlangan cell larni tozalash
        document
          .querySelectorAll(`.clickable-cell[data-question="${question}"]`)
          .forEach((c) => {
            c.classList.remove("selected");
          });

        // Tanlangan cell ni belgilash
        this.classList.add("selected");

        // Auto-save
        setTimeout(saveAnswersToStorage, 10);
      });
    });
  }
});
