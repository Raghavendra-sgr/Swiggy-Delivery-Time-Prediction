// Form submission handler
document.getElementById('predictionForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const predictBtn = document.getElementById('predictBtn');
    const resultCard = document.getElementById('resultCard');
    const predictionResult = document.getElementById('predictionResult');
    
    // Add loading state
    predictBtn.classList.add('loading');
    predictBtn.disabled = true;
    resultCard.classList.remove('show');
    
    // Collect form data
    const formData = {
        age: parseFloat(document.getElementById('age').value),
        ratings: parseFloat(document.getElementById('ratings').value),
        weather: document.getElementById('weather').value,
        traffic: document.getElementById('traffic').value,
        vehicle_condition: parseInt(document.getElementById('vehicle_condition').value),
        type_of_order: document.getElementById('type_of_order').value,
        type_of_vehicle: document.getElementById('type_of_vehicle').value,
        multiple_deliveries: parseFloat(document.getElementById('multiple_deliveries').value),
        festival: document.getElementById('festival').value,
        city_type: document.getElementById('city_type').value,
        is_weekend: parseInt(document.getElementById('is_weekend').value),
        pickup_time_minutes: parseFloat(document.getElementById('pickup_time_minutes').value),
        order_time_of_day: document.getElementById('order_time_of_day').value,
        distance: parseFloat(document.getElementById('distance').value),
        distance_type: document.getElementById('distance_type').value
    };
    
    try {
        // Make prediction request
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Animate the result
            setTimeout(() => {
                predictionResult.textContent = data.prediction;
                resultCard.classList.add('show');
                
                // Scroll to result
                resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Remove loading state
                predictBtn.classList.remove('loading');
                predictBtn.disabled = false;
            }, 1500); // Simulate delivery animation time
        } else {
            throw new Error(data.error || 'Prediction failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to predict delivery time. Please check your inputs and try again.');
        
        // Remove loading state
        predictBtn.classList.remove('loading');
        predictBtn.disabled = false;
    }
});

// Add real-time form validation feedback
const inputs = document.querySelectorAll('input, select');
inputs.forEach(input => {
    input.addEventListener('input', () => {
        if (input.checkValidity()) {
            input.style.borderColor = 'var(--swiggy-success)';
        } else {
            input.style.borderColor = 'var(--swiggy-border)';
        }
    });
});

// Add floating label effect on focus
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
    });
});

// Add entrance animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.form-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.6s ease-out';
    observer.observe(section);
});

// Add confetti effect on successful prediction (optional enhancement)
function createConfetti() {
    const colors = ['#FC8019', '#FFF5ED', '#48C479', '#FFD700'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-10px';
        confetti.style.opacity = '1';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';
        confetti.style.zIndex = '9999';
        
        document.body.appendChild(confetti);
        
        const fall = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 10}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        fall.onfinish = () => confetti.remove();
    }
}

// Trigger confetti when result is shown (optional)
const resultCardObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.target.classList.contains('show')) {
            setTimeout(createConfetti, 300);
        }
    });
});

resultCardObserver.observe(document.getElementById('resultCard'), {
    attributes: true,
    attributeFilter: ['class']
});
