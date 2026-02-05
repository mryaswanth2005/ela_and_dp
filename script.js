// script.js - Handles registration form and poster reveal logic

// Replace with your Google Apps Script Web App URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx2XexQaxnB7CO6T2AHcc967jh-X267g-QoQ-mIEbFDvChW8Q-l57oGgBF5KChSS0CZtw/exec';

// DOM Elements - will be initialized after DOM loads
let poster, overlay, currentCount, progressFill, form, submitBtn, submitBtnText, messageDiv;
let confettiLeftCanvas, confettiRightCanvas, confettiActive = false;

// Initialize the page when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // Initialize DOM elements
    poster = document.getElementById('poster');
    overlay = document.getElementById('overlay');
    currentCount = document.getElementById('current-count');
    progressFill = document.getElementById('progress');
    form = document.getElementById('registration-form');
    submitBtn = document.getElementById('submit-btn');
    messageDiv = document.getElementById('message');
    confettiLeftCanvas = document.getElementById('confetti-left');
    confettiRightCanvas = document.getElementById('confetti-right');
    
    if (submitBtn) {
        submitBtnText = submitBtn.querySelector('.btn-text');
    }
    
    console.log('DOM elements:', { poster, overlay, currentCount, progressFill, form, submitBtn, messageDiv });
    
    // Fetch the registration count
    fetchRegistrationCount();
    
    // Set up form submission handler
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    } else {
        console.error('Form element not found!');
    }
});

// Fetch total registration count from Google Sheets
async function fetchRegistrationCount() {
    try {
        console.log('Fetching registration count...');
        const response = await fetch(APPS_SCRIPT_URL);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.success) {
            updateUI(data.count);
        } else {
            console.error('Error fetching count:', data.error);
            showMessage('Failed to load registration count. Please refresh the page.', 'error');
        }
    } catch (error) {
        console.error('Network error:', error);
        showMessage('Network error. Please check your connection and try again.', 'error');
    }
}

// Update poster and counter based on registration count
function updateUI(count) {
    console.log('updateUI called with count:', count);
    
    if (currentCount) {
        currentCount.textContent = count;
        console.log('Set currentCount to:', count);
    } else {
        console.error('currentCount element not found!');
    }
    
    const progress = Math.min((count / 50) * 100, 100);
    console.log('Progress calculated:', progress);
    
    if (progressFill) {
        progressFill.style.width = progress + '%';
        console.log('Set progress width to:', progress + '%');
    } else {
        console.error('progressFill element not found!');
    }
    
    if (count >= 50) {
        // Reveal poster
        if (poster) poster.classList.remove('blurred');
        if (overlay) overlay.classList.add('hidden');
        // Start confetti celebration
        if (!confettiActive) {
            confettiActive = true;
            startConfetti();
        }
        showMessage('🎉 Poster Revealed! Thank you for registering', 'success');
    } else {
        // Keep poster blurred
        if (poster) poster.classList.add('blurred');
        if (overlay) overlay.classList.remove('hidden');
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(form);
    const data = {
        name: formData.get('name').trim(),
        class: formData.get('class').trim(),
        email: formData.get('email').trim(),
        mobile: formData.get('mobile').trim()
    };

    // Basic validation
    if (!validateForm(data)) {
        return;
    }

    // Show loading state
    if (submitBtn) submitBtn.disabled = true;
    if (submitBtnText) submitBtnText.textContent = 'Registering...';

    // Create a temporary form for submission to bypass CORS
    const tempForm = document.createElement('form');
    tempForm.method = 'POST';
    tempForm.action = APPS_SCRIPT_URL;
    tempForm.target = 'hidden-iframe';
    tempForm.style.display = 'none';

    // Add data as hidden inputs
    Object.keys(data).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = data[key];
        tempForm.appendChild(input);
    });

    // Fallback timeout - assume success after 3 seconds
    setTimeout(() => {
        showMessage('Registration submitted! Please refresh to see updates.', 'success');
        form.reset();
        fetchRegistrationCount();
        if (submitBtn) submitBtn.disabled = false;
        if (submitBtnText) submitBtnText.textContent = 'Register Now';
        if (document.body.contains(tempForm)) {
            document.body.removeChild(tempForm);
        }
    }, 3000);

    // Add form to body and submit
    document.body.appendChild(tempForm);
    tempForm.submit();
}

// Validate form data
function validateForm(data) {
    if (!data.name || !data.class || !data.email || !data.mobile) {
        showMessage('Please fill in all required fields.', 'error');
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showMessage('Please enter a valid email address.', 'error');
        return false;
    }

    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(data.mobile)) {
        showMessage('Please enter a valid 10-digit mobile number.', 'error');
        return false;
    }

    return true;
}

// Show message to user
function showMessage(text, type) {
    if (!messageDiv) {
        console.error('Message div not found!');
        return;
    }
    
    messageDiv.textContent = text;
    messageDiv.className = 'message ' + type;
    messageDiv.style.display = 'block';

    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Confetti Animation - Vercel style colorful paper confetti (runs once)
function startConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#fd79a8', '#a29bfe', '#00b894', '#e17055'];
    
    // Create confetti for both canvases
    createConfettiOnCanvas(confettiLeftCanvas, colors, 'left');
    createConfettiOnCanvas(confettiRightCanvas, colors, 'right');
}

function createConfettiOnCanvas(canvas, colors, side) {
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = window.innerHeight;
    
    const confettiPieces = [];
    const confettiCount = 100;
    
    // Create confetti pieces
    for (let i = 0; i < confettiCount; i++) {
        confettiPieces.push({
            x: side === 'left' ? Math.random() * 100 : canvas.width - Math.random() * 100,
            y: -20 - Math.random() * 200,
            width: Math.random() * 12 + 5,
            height: Math.random() * 8 + 3,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 15,
            velocityX: side === 'left' ? Math.random() * 4 + 1 : -(Math.random() * 4 + 1),
            velocityY: Math.random() * 3 + 2,
            gravity: 0.15,
            drag: 0.99,
            oscillation: Math.random() * Math.PI * 2,
            oscillationSpeed: Math.random() * 0.1 + 0.05
        });
    }
    
    let startTime = Date.now();
    const duration = 4000; // 4 seconds - runs only once
    
    function animate() {
        const elapsed = Date.now() - startTime;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confettiPieces.forEach(piece => {
            // Update physics
            piece.velocityY += piece.gravity;
            piece.velocityX *= piece.drag;
            piece.velocityY *= piece.drag;
            
            piece.x += piece.velocityX + Math.sin(piece.oscillation) * 2;
            piece.y += piece.velocityY;
            piece.rotation += piece.rotationSpeed;
            piece.oscillation += piece.oscillationSpeed;
            
            // Draw the confetti piece
            ctx.save();
            ctx.translate(piece.x, piece.y);
            ctx.rotate((piece.rotation * Math.PI) / 180);
            ctx.fillStyle = piece.color;
            ctx.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
            ctx.restore();
        });
        
        // Continue animation for duration then stop (no repeat)
        if (elapsed < duration) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    animate();
}
