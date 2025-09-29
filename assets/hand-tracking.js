// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add a small delay to ensure all scripts are loaded
    setTimeout(initializeHandTracking, 100);
});

// Also try to initialize when window is fully loaded
window.addEventListener('load', function() {
    if (!model && typeof handTrack !== 'undefined') {
        initializeHandTracking();
    }
});

let video = null;
let canvas = null;
let context = null;
let model = null;
let isTrackingActive = false;

const modelParams = {
    flipHorizontal: true,
    maxNumBoxes: 1,
    iouThreshold: 0.5,
    scoreThreshold: 0.8,
};

function initializeHandTracking() {
    try {
        // Get DOM elements
        video = document.getElementById("hand-video");
        canvas = document.getElementById("hand-canvas");
        
        if (!video || !canvas) {
            console.warn('Hand tracking elements not found - hand tracking disabled');
            return;
        }
        
        context = canvas.getContext("2d");
        
        // Check if handTrack is available
        if (typeof handTrack === 'undefined') {
            console.warn('HandTrack.js library not loaded - hand tracking disabled');
            console.log('To enable hand tracking, ensure the HandTrack.js library loads properly');
            showLibraryError();
            return;
        }
        
        // Check if handTrack has the required methods
        if (!handTrack.load || !handTrack.startVideo) {
            console.error('HandTrack.js library incomplete - missing required methods');
            showLibraryError();
            return;
        }
        
        console.log('Hand tracking library loaded successfully');
        loadModel();
        
    } catch (error) {
        console.error('Error initializing hand tracking:', error);
        showLibraryError();
    }
}

function showLibraryError() {
    if (canvas && context) {
        context.fillStyle = '#ffaa00';
        context.font = '14px Arial';
        context.fillText('Hand tracking unavailable', 10, 30);
        context.fillText('Library loading error', 10, 50);
        context.fillText('Use arrow keys for navigation', 10, 70);
    }
}

function loadModel() {
    console.log('Loading hand tracking model...');
    handTrack.load(modelParams).then(lmodel => {
        model = lmodel;
        console.log("Model loaded successfully");
        startVideo();
    }).catch(error => {
        console.error('Failed to load hand tracking model:', error);
    });
}

function startVideo() {
    if (!video || !model) {
        console.error('Video element or model not available');
        return;
    }
    
    handTrack.startVideo(video).then(function (status) {
        console.log("Video started:", status);
        if (status) {
            // Set canvas size to match video
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            isTrackingActive = true;
            runDetection();
        } else {
            console.log("Camera access denied or unavailable. Please enable your camera.");
            showCameraError();
        }
    }).catch(error => {
        console.error('Failed to start video:', error);
        showCameraError();
    });
}

function showCameraError() {
    // Display error message to user
    if (canvas && context) {
        context.fillStyle = '#ff0000';
        context.font = '16px Arial';
        context.fillText('Camera access required for hand tracking', 10, 30);
        context.fillText('Press \'c\' to toggle hand tracking view', 10, 50);
    }
}

let lastGestureTime = 0;
const gestureCooldown = 1500; // 1.5 seconds cooldown between gestures
let isFirstDetection = true;

function runDetection() {
    if (!model || !video || !isTrackingActive) {
        console.log('Detection stopped - model, video, or tracking inactive');
        return;
    }
    
    model.detect(video).then(predictions => {
        // Only render predictions if canvas and context exist
        if (canvas && context) {
            model.renderPredictions(predictions, canvas, context, video);
        }

        if (predictions.length > 0) {
            const now = Date.now();
            
            // Skip the first detection to prevent accidental slide change
            if (isFirstDetection) {
                isFirstDetection = false;
                console.log('First hand detected, starting tracking');
            }
            // Check if enough time has passed since last gesture
            else if (now - lastGestureTime > gestureCooldown) {
                const hand = predictions[0];
                
                // Make sure Reveal is available before using it
                if (typeof Reveal !== 'undefined') {
                    if (hand.label === 'open') { // Gesture for next
                        Reveal.next();
                        lastGestureTime = now;
                        console.log("Gesture detected: Next slide");
                    } else if (hand.label === 'closed') { // Gesture for previous
                        Reveal.prev();
                        lastGestureTime = now;
                        console.log("Gesture detected: Previous slide");
                    }
                } else {
                    console.warn('Reveal.js not available for navigation');
                }
            }
        }
        
        // Continue detection loop
        if (isTrackingActive) {
            requestAnimationFrame(runDetection);
        }
    }).catch(error => {
        console.error('Error during hand detection:', error);
        // Continue detection despite errors
        if (isTrackingActive) {
            requestAnimationFrame(runDetection);
        }
    });
}

// Stop hand tracking
function stopTracking() {
    isTrackingActive = false;
    if (video && video.srcObject) {
        const tracks = video.srcObject.getTracks();
        tracks.forEach(track => track.stop());
    }
    console.log('Hand tracking stopped');
}

// Toggle hand tracking visibility
function toggleHandTracking() {
    if (!video || !canvas) return;
    
    const isHidden = video.style.display === 'none';
    const newDisplay = isHidden ? 'block' : 'none';
    
    video.style.display = newDisplay;
    canvas.style.display = newDisplay;
    
    console.log(`Hand tracking ${isHidden ? 'shown' : 'hidden'}`);
}

// Enhanced keyboard shortcuts (works with or without hand tracking)
document.addEventListener('keydown', function(event) {
    // Don't trigger shortcuts if user is typing in an input field
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
    }
    
    switch(event.key.toLowerCase()) {
        case 'c':
            toggleHandTracking();
            break;
        case 'h':
            // Show comprehensive help
            showHelp();
            break;
        case 'n':
        case ' ': // Spacebar
            // Alternative next slide shortcuts
            if (typeof Reveal !== 'undefined') {
                Reveal.next();
                console.log('Next slide (keyboard)');
            }
            event.preventDefault();
            break;
        case 'p':
        case 'backspace':
            // Alternative previous slide shortcuts
            if (typeof Reveal !== 'undefined') {
                Reveal.prev();
                console.log('Previous slide (keyboard)');
            }
            event.preventDefault();
            break;
        case 'f':
            // Toggle fullscreen
            if (typeof Reveal !== 'undefined') {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    document.documentElement.requestFullscreen();
                }
            }
            break;
        case 'escape':
            if (isTrackingActive) {
                stopTracking();
            }
            break;
    }
});

// Show comprehensive help
function showHelp() {
    const helpText = [
        'Presentation Controls:',
        '- Arrow keys: Navigate slides',
        '- Spacebar/N: Next slide', 
        '- Backspace/P: Previous slide',
        '- F: Toggle fullscreen',
        '- ESC: Exit fullscreen/stop tracking',
        '',
        'Hand Tracking (if enabled):',
        '- Open hand: Next slide',
        '- Closed fist: Previous slide', 
        '- C: Toggle camera view',
        '- H: Show this help'
    ];
    
    console.log('\n' + helpText.join('\n') + '\n');
    
    // Also show on screen briefly if possible
    if (canvas && context) {
        context.fillStyle = 'rgba(0, 0, 0, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#ffffff';
        context.font = '12px Arial';
        
        helpText.forEach((line, index) => {
            context.fillText(line, 10, 20 + index * 15);
        });
        
        // Clear help after 5 seconds
        setTimeout(() => {
            if (context) {
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        }, 5000);
    }
}

// Handle page unload
window.addEventListener('beforeunload', function() {
    stopTracking();
});
