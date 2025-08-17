class IELTSWritingTest {
    constructor() {
        this.totalTime = 60 * 60; // 60 minutes in seconds
        this.currentTime = this.totalTime;
        this.timerInterval = null;
        this.isTestStarted = false;
        
        this.init();
    }

    init() {
        this.loadFromLocalStorage();
        this.setupEventListeners();
        this.startTimer();
        this.updateWordCounts();
    }

    setupEventListeners() {
        // Tab switching
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Text area input events
        const task1Answer = document.getElementById('task1-answer');
        const task2Answer = document.getElementById('task2-answer');

        task1Answer.addEventListener('input', (e) => {
            this.updateWordCount('task1');
        });

        task2Answer.addEventListener('input', (e) => {
            this.updateWordCount('task2');
        });

        // Download button
        const downloadBtn = document.getElementById('download-btn');
        downloadBtn.addEventListener('click', () => {
            this.downloadAnswers();
        });

        // Reset button removed - not in HTML

        // Events removed - no localStorage saving
    }

    switchTab(tabName) {
        // Remove active class from all tabs and content
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));

        // Add active class to selected tab and content
        const activeTabBtn = document.querySelector(`[data-tab="${tabName}"]`);
        const activeTabPane = document.getElementById(tabName);

        if (activeTabBtn && activeTabPane) {
            activeTabBtn.classList.add('active');
            activeTabPane.classList.add('active');
        }

        // Tab switching completed
    }

    startTimer() {
        console.log('Starting timer...');
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }

        this.timerInterval = setInterval(() => {
            if (this.currentTime > 0) {
                this.currentTime--;
                this.updateTimerDisplay();
                console.log('Timer tick:', this.currentTime);
            } else {
                this.timeUp();
            }
        }, 1000);

        this.isTestStarted = true;
        console.log('Timer started successfully');
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        const timerElement = document.getElementById('timer');
        
        console.log('Updating timer display:', minutes, seconds, 'Timer element:', timerElement);
        
        if (timerElement) {
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            console.log('Timer updated to:', timerElement.textContent);
        } else {
            console.error('Timer element not found!');
        }

        // Change color when time is running low
        if (this.currentTime <= 300) { // 5 minutes or less
            timerElement.style.color = '#e74c3c';
            timerElement.style.animation = 'pulse 1s infinite';
        } else if (this.currentTime <= 600) { // 10 minutes or less
            timerElement.style.color = '#f39c12';
        }
    }

    timeUp() {
        clearInterval(this.timerInterval);
        this.currentTime = 0;
        this.updateTimerDisplay();
        
        // Show time up message
        alert('Time is up! Your answers have been automatically saved.');
        
        // Disable text areas
        const textareas = document.querySelectorAll('.answer-textarea');
        textareas.forEach(textarea => {
            textarea.disabled = true;
            textarea.style.backgroundColor = '#f8f9fa';
        });

        // Disable download button
        const downloadBtn = document.getElementById('download-btn');
        downloadBtn.disabled = true;
        downloadBtn.style.opacity = '0.6';
        downloadBtn.style.cursor = 'not-allowed';
    }

    updateWordCount(taskId) {
        const textarea = document.getElementById(`${taskId}-answer`);
        const wordCountElement = document.getElementById(`${taskId}-word-count`);
        
        if (textarea && wordCountElement) {
            const text = textarea.value.trim();
            const wordCount = text === '' ? 0 : text.split(/\s+/).length;
            wordCountElement.textContent = wordCount;

            // Change color based on word count requirements
            if (taskId === 'task1' && wordCount < 150) {
                wordCountElement.style.color = '#e74c3c';
            } else if (taskId === 'task2' && wordCount < 250) {
                wordCountElement.style.color = '#e74c3c';
            } else {
                wordCountElement.style.color = '#28a745';
            }
        }
    }

    updateWordCounts() {
        this.updateWordCount('task1');
        this.updateWordCount('task2');
    }

    saveToLocalStorage() {
        // Function removed - no localStorage saving
    }

    loadFromLocalStorage() {
        // Function removed - no localStorage loading
    }

    downloadAnswers() {
        const task1Answer = document.getElementById('task1-answer').value;
        const task2Answer = document.getElementById('task2-answer').value;
        
        // if (!task1Answer && !task2Answer) {
        //     alert('Please write some answers before downloading.');
        //     return;
        // }

        const currentDate = new Date().toLocaleDateString('en-GB');
        const currentTime = new Date().toLocaleTimeString('en-GB');
        
        let content = `IELTS Writing Test - Mock 1\n`;
        content += `Date: ${currentDate}\n`;
        content += `Time: ${currentTime}\n`;
        content += `Time Remaining: ${Math.floor(this.currentTime / 60)}:${(this.currentTime % 60).toString().padStart(2, '0')}\n`;
        content += `\n`.repeat(2);
        
        content += `TASK 1:\n`;
        content += `Question: The chart below shows the percentage of households in different income brackets in three countries in 2020. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.\n`;
        content += `\n`.repeat(2);
        content += `Your Answer:\n`;
        content += task1Answer || 'No answer provided';
        content += `\n`.repeat(2);
        content += `Word Count: ${task1Answer ? task1Answer.split(/\s+/).length : 0}\n`;
        content += `\n`.repeat(2);
        
        content += `TASK 2:\n`;
        content += `Question: Some people believe that the best way to reduce crime is to give longer prison sentences. Others believe that there are better alternative ways to reduce crime. Discuss both views and give your opinion.\n`;
        content += `\n`.repeat(2);
        content += `Your Answer:\n`;
        content += task2Answer || 'No answer provided';
        content += `\n`.repeat(2);
        content += `Word Count: ${task2Answer ? task2Answer.split(/\s+/).length : 0}\n`;

        // Create and download file
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `writing${currentDate.replace(/\//g, '-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    resetTest() {
        if (confirm('Are you sure you want to reset the test? This will clear all your answers and reset the timer.')) {
            // Clear answers
            document.getElementById('task1-answer').value = '';
            document.getElementById('task2-answer').value = '';
            
            // Reset timer
            this.currentTime = this.totalTime;
            this.updateTimerDisplay();
            
            // localStorage cleared
            
            // Update word counts
            this.updateWordCounts();
            
            // Switch to first tab
            this.switchTab('task1');
            
            // Re-enable text areas if they were disabled
            const textareas = document.querySelectorAll('.answer-textarea');
            textareas.forEach(textarea => {
                textarea.disabled = false;
                textarea.style.backgroundColor = '';
            });

            // Re-enable download button
            const downloadBtn = document.getElementById('download-btn');
            downloadBtn.disabled = false;
            downloadBtn.style.opacity = '';
            downloadBtn.style.cursor = '';
            
            alert('Test has been reset successfully!');
        }
    }
}

// Add CSS animation for timer pulse
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Initialize the test when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new IELTSWritingTest();
});
