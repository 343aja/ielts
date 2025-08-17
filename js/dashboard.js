// Dashboard JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard
    initializeDashboard();
    
    // Add smooth scrolling for anchor links
    addSmoothScrolling();
    
    // Add card hover effects
    addCardEffects();
    
    // Initialize progress tracking
    initializeProgressTracking();
});

function initializeDashboard() {
    console.log('Dashboard initialized');
    
    // Add loading animation
    const cards = document.querySelectorAll('.mock-test-card, .stat-card, .action-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function addSmoothScrolling() {
    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function addCardEffects() {
    // Enhanced hover effects for cards
    const cards = document.querySelectorAll('.mock-test-card, .action-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('coming-soon')) {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('coming-soon')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
}

function initializeProgressTracking() {
    // Mock progress data - in real app this would come from backend
    const mockProgress = {
        testsCompleted: 0,
        averageScore: 0,
        lastTestDate: null,
        targetScore: 9.0
    };
    
    // Update stats with progress data
    updateProgressStats(mockProgress);
    
    // Add progress bar animation
    animateProgressBars();
}

function updateProgressStats(progress) {
    // Update available tests count
    const availableTestsElement = document.querySelector('.stat-card h3');
    if (availableTestsElement && availableTestsElement.textContent === '3') {
        // This is the available tests stat
        const progressElement = document.createElement('div');
        progressElement.className = 'progress-indicator';
        progressElement.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${(progress.testsCompleted / 3) * 100}%"></div>
            </div>
            <small>${progress.testsCompleted}/3 completed</small>
        `;
        availableTestsElement.parentNode.appendChild(progressElement);
    }
}

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.transition = 'width 1.5s ease-in-out';
            bar.style.width = width;
        }, 500);
    });
}

// Add click handlers for action cards
document.addEventListener('click', function(e) {
    if (e.target.closest('.action-card')) {
        const actionCard = e.target.closest('.action-card');
        const actionType = actionCard.querySelector('h4').textContent;
        
        // Handle different action types
        switch(actionType) {
            case 'Test History':
                showNotification('Test History feature coming soon!', 'info');
                break;
            case 'Progress Report':
                showNotification('Progress Report feature coming soon!', 'info');
                break;
            case 'Settings':
                showNotification('Settings feature coming soon!', 'info');
                break;
            case 'Help & Support':
                showNotification('Help & Support feature coming soon!', 'info');
                break;
        }
    }
});

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'info' ? 'info-circle' : 'check-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide and remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS for notifications
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        padding: 1rem 1.5rem;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        z-index: 1000;
        max-width: 300px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-content i {
        color: #667eea;
    }
    
    .notification-info {
        border-left: 4px solid #667eea;
    }
    
    .notification-success {
        border-left: 4px solid #27ae60;
    }
    
    .progress-indicator {
        margin-top: 1rem;
    }
    
    .progress-bar {
        width: 100%;
        height: 6px;
        background: #ecf0f1;
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 0.5rem;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #667eea, #764ba2);
        border-radius: 3px;
    }
    
    .progress-indicator small {
        color: #7f8c8d;
        font-size: 0.8rem;
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
