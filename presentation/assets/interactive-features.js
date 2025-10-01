// Interactive Presentation Features

// Initialize interactive features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeInteractiveFeatures();
});

// Global variables for tracking engagement
let presentationData = {
    startTime: Date.now(),
    slideViews: {},
    polls: {},
    currentSlide: 0,
    totalSlides: 0
};

function initializeInteractiveFeatures() {
    createProgressBar();
    createParticleSystem();
    initializePollSystem();
    createNotificationSystem();
    trackSlideProgress();
    addInteractiveCounters();

    console.log('🎉 Interactive features initialized!');
}

// Progress Bar System
function createProgressBar() {
    const progressContainer = document.createElement('div');
    progressContainer.className = 'progress-container';
    progressContainer.innerHTML = '<div class="progress-bar" id="progress-bar"></div>';
    document.body.appendChild(progressContainer);

    // Update progress on slide change
    Reveal.on('slidechanged', updateProgress);
    Reveal.on('ready', function(event) {
        presentationData.totalSlides = Reveal.getTotalSlides();
        updateProgress();
    });
}

function updateProgress() {
    const current = Reveal.getIndices().h + 1;
    const total = Reveal.getTotalSlides();
    const progress = (current / total) * 100;

    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }

    presentationData.currentSlide = current;
}

// Particle System
function createParticleSystem() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.id = 'particles-container';
    document.body.appendChild(particlesContainer);

    // Create particles periodically
    setInterval(createParticle, 2000);
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 2 + 's';
    particle.style.animationDuration = (Math.random() * 4 + 4) + 's';

    document.getElementById('particles-container').appendChild(particle);

    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 8000);
}

// Poll System
function initializePollSystem() {
    window.createPoll = function(question, options, slideNumber = null) {
        const pollId = 'poll_' + Date.now();
        presentationData.polls[pollId] = {
            question: question,
            options: options,
            votes: {},
            slideNumber: slideNumber
        };

        return generatePollHTML(pollId, question, options);
    };

    window.submitPollVote = function(pollId, optionIndex) {
        if (presentationData.polls[pollId]) {
            const userId = 'user_' + Date.now(); // Simple user ID
            presentationData.polls[pollId].votes[userId] = optionIndex;

            // Update poll display
            updatePollResults(pollId);
            // Removed annoying notification
        }
    };
}

function generatePollHTML(pollId, question, options) {
    let html = `<div class="poll-container" id="${pollId}">
        <h3>📊 Quick Poll</h3>
        <p><strong>${question}</strong></p>
        <div class="poll-options">`;

    options.forEach((option, index) => {
        html += `<div class="poll-option" onclick="submitPollVote('${pollId}', ${index})">
            ${option} <span class="poll-count" id="${pollId}_count_${index}">0</span>
        </div>`;
    });

    html += `</div></div>`;
    return html;
}

function updatePollResults(pollId) {
    const poll = presentationData.polls[pollId];
    const votes = Object.values(poll.votes);
    const counts = new Array(poll.options.length).fill(0);

    votes.forEach(vote => counts[vote]++);

    counts.forEach((count, index) => {
        const countElement = document.getElementById(`${pollId}_count_${index}`);
        if (countElement) {
            countElement.textContent = count;
        }
    });
}

// Notification System - Disabled (was annoying)
function createNotificationSystem() {
    // Silent notification function - logs to console instead
    window.showNotification = function(message, duration = 3000) {
        console.log('🔔 ' + message);
        // No visual notifications anymore
    };
}

// Interactive Counters
function addInteractiveCounters() {
    window.animateCounter = function(elementId, targetValue, duration = 2000) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const startValue = 0;
        const increment = targetValue / (duration / 50);
        let currentValue = startValue;

        const timer = setInterval(() => {
            currentValue += increment;
            element.textContent = Math.floor(currentValue);

            if (currentValue >= targetValue) {
                element.textContent = targetValue;
                clearInterval(timer);
            }
        }, 50);
    };

    // Add counter creation helper
    window.createCounter = function(value, label, elementId) {
        return `<div class="counter-container">
            <div class="counter" id="${elementId}">${value}</div>
            <div class="counter-label">${label}</div>
        </div>`;
    };
}

// Live Demo Functions
function createLiveDemoSection() {
    window.startDemo = function(demoType) {
        // Removed annoying notification
        console.log(`🚀 Starting ${demoType} demo...`);

        switch(demoType) {
            case 'video':
                simulateVideoGeneration();
                break;
            case 'audio':
                simulateAudioGeneration();
                break;
            case 'music':
                simulateMusicGeneration();
                break;
        }
    };
}

function simulateVideoGeneration() {
    const demoContainer = document.createElement('div');
    demoContainer.className = 'demo-container';
    demoContainer.innerHTML = `
        <h3>🎬 AI Video Generation Demo</h3>
        <p>Generating video from prompt: "A sunset over mountains"</p>
        <div class="loading"></div>
        <div id="video-demo-result"></div>
    `;

    // Find current slide and append
    const currentSlide = document.querySelector('.present');
    if (currentSlide) {
        currentSlide.appendChild(demoContainer);
    }

    // Simulate generation process
    setTimeout(() => {
        document.getElementById('video-demo-result').innerHTML = `
            <p>✅ Video generated successfully!</p>
            <p><em>Realistic 5-second clip showing mountain sunset with dynamic clouds</em></p>
            <button class="interactive-btn" onclick="this.parentElement.parentElement.parentElement.remove()">Close Demo</button>
        `;
    }, 3000);
}

function simulateAudioGeneration() {
    const demoContainer = document.createElement('div');
    demoContainer.className = 'demo-container';
    demoContainer.innerHTML = `
        <h3>🎵 AI Voice Generation Demo</h3>
        <p>Generating speech: "Welcome to the future of AI"</p>
        <div class="loading"></div>
        <div id="audio-demo-result"></div>
    `;

    const currentSlide = document.querySelector('.present');
    if (currentSlide) {
        currentSlide.appendChild(demoContainer);
    }

    setTimeout(() => {
        document.getElementById('audio-demo-result').innerHTML = `
            <p>✅ Voice generated successfully!</p>
            <p><em>Natural-sounding speech with proper intonation</em></p>
            <button class="interactive-btn" onclick="this.parentElement.parentElement.parentElement.remove()">Close Demo</button>
        `;
    }, 2500);
}

function simulateMusicGeneration() {
    const demoContainer = document.createElement('div');
    demoContainer.className = 'demo-container';
    demoContainer.innerHTML = `
        <h3>🎼 AI Music Generation Demo</h3>
        <p>Creating: "Upbeat electronic dance track"</p>
        <div class="loading"></div>
        <div id="music-demo-result"></div>
    `;

    const currentSlide = document.querySelector('.present');
    if (currentSlide) {
        currentSlide.appendChild(demoContainer);
    }

    setTimeout(() => {
        document.getElementById('music-demo-result').innerHTML = `
            <p>✅ Music generated successfully!</p>
            <p><em>2-minute EDM track with bass drops and synthesizer melodies</em></p>
            <button class="interactive-btn" onclick="this.parentElement.parentElement.parentElement.remove()">Close Demo</button>
        `;
    }, 4000);
}

// Slide tracking for analytics
function trackSlideProgress() {
    Reveal.on('slidechanged', function(event) {
        const slideIndex = event.indexh;
        const slideId = 'slide_' + slideIndex;

        if (!presentationData.slideViews[slideId]) {
            presentationData.slideViews[slideId] = {
                viewCount: 0,
                timeSpent: 0,
                firstView: Date.now()
            };
        }

        presentationData.slideViews[slideId].viewCount++;
        presentationData.slideViews[slideId].lastView = Date.now();
    });
}

// Easter eggs and surprises
function addEasterEggs() {
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.code);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }

        if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
            console.log('🎮 Konami Code activated! You found the secret!');
            createSpecialEffect();
            konamiCode = [];
        }
    });
}

function createSpecialEffect() {
    // Create rainbow effect
    document.body.style.animation = 'rainbow 2s infinite';

    // Add rainbow keyframes if not exists
    if (!document.querySelector('#rainbow-style')) {
        const style = document.createElement('style');
        style.id = 'rainbow-style';
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    // Remove effect after 2 seconds
    setTimeout(() => {
        document.body.style.animation = '';
    }, 2000);
}

// Enhanced keyboard shortcuts with notifications
document.addEventListener('keydown', function(event) {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') return;

    switch(event.key.toLowerCase()) {
        case 'r':
            // Reset presentation
            if (confirm('Reset presentation progress?')) {
                presentationData = {
                    startTime: Date.now(),
                    slideViews: {},
                    polls: {},
                    currentSlide: 0,
                    totalSlides: 0
                };
                console.log('🔄 Presentation reset!');
                Reveal.slide(0);
            }
            break;
        case 's':
            // Show stats
            showStats();
            break;
        case 'd':
            // Toggle demo mode
            toggleDemoMode();
            break;
    }
});

function showStats() {
    const timeSpent = Math.floor((Date.now() - presentationData.startTime) / 1000);
    const minutes = Math.floor(timeSpent / 60);
    const seconds = timeSpent % 60;

    const stats = [
        `📊 Presentation Statistics:`, 
        `⏱️ Time spent: ${minutes}m ${seconds}s`, 
        `📄 Current slide: ${presentationData.currentSlide}/${presentationData.totalSlides}`, 
        `🗳️ Polls participated: ${Object.keys(presentationData.polls).length}`
    ];

    console.log('\n' + stats.join('\n') + '\n');
    console.log('📊 Presentation statistics displayed above');
}

function toggleDemoMode() {
    const body = document.body;
    if (body.classList.contains('demo-mode')) {
        body.classList.remove('demo-mode');
        console.log('📴 Demo mode disabled');
    } else {
        body.classList.add('demo-mode');
        console.log('🚀 Demo mode enabled!');
    }
}

// Initialize easter eggs
addEasterEggs();
createLiveDemoSection();

// Export functions for global access
window.presentationFeatures = {
    showNotification,
    createPoll,
    startDemo,
    animateCounter,
    createCounter
};
