const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const subjects = [];
let currentRotation = 0;
let spinning = false;

const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
    '#FFEEAD', '#D4A5A5', '#9B9B9B', '#CE82FF'
];

function addSubject() {
    const input = document.getElementById('newSubject');
    const subject = input.value.trim();
    
    if (subject && !subjects.includes(subject)) {
        subjects.push(subject);
        input.value = '';
        
        // Add pop animation to input
        input.classList.add('pop');
        setTimeout(() => input.classList.remove('pop'), 300);
        
        drawWheel();
    }
}

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw wheel background with gradient
    const gradient = ctx.createRadialGradient(
        canvas.width/2, canvas.height/2, 0,
        canvas.width/2, canvas.height/2, canvas.width/2
    );
    gradient.addColorStop(0, '#2a2a2a');
    gradient.addColorStop(1, '#1a1a1a');
    
    ctx.beginPath();
    ctx.arc(canvas.width/2, canvas.height/2, canvas.width/2 - 10, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    const sliceAngle = (Math.PI * 2) / subjects.length;
    
    subjects.forEach((subject, i) => {
        ctx.save();
        ctx.translate(canvas.width/2, canvas.height/2);
        ctx.rotate(currentRotation + sliceAngle * i);
        
        // Draw slice
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, canvas.width/2 - 10, 0, sliceAngle);
        ctx.lineTo(0, 0);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        
        // Add shine effect
        const shine = ctx.createLinearGradient(0, -canvas.width/2, 0, canvas.width/2);
        shine.addColorStop(0, 'rgba(255,255,255,0.1)');
        shine.addColorStop(0.5, 'rgba(255,255,255,0)');
        ctx.fillStyle = shine;
        ctx.fill();
        
        // Draw text
        ctx.rotate(sliceAngle / 2);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Poppins';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(subject, canvas.width/2 - 30, 0);
        
        ctx.restore();
    });
}

function createParticles(x, y, color) {
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        document.body.appendChild(particle);
        
        const angle = (Math.random() * 360) * Math.PI / 180;
        const velocity = 1 + Math.random() * 5;
        const size = Math.random() * 8 + 4;
        
        particle.style.backgroundColor = color;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        const animation = particle.animate([
            {
                transform: `translate(${x}px, ${y}px)`,
                opacity: 1
            },
            {
                transform: `translate(${x + Math.cos(angle) * 100}px, ${y + Math.sin(angle) * 100}px)`,
                opacity: 0
            }
        ], {
            duration: 1000,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        });
        
        animation.onfinish = () => particle.remove();
    }
}

function spinWheel() {
    if (spinning || subjects.length < 2) return;
    
    spinning = true;
    const spinButton = document.querySelector('.spin-button');
    spinButton.disabled = true;
    spinButton.style.opacity = '0.5';
    
    const spinDuration = 4000;
    const spins = 5 + Math.random() * 5;
    const finalAngle = Math.PI * 2 * spins;
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / spinDuration, 1);
        
        // Easing function for smooth deceleration
        const easing = 1 - Math.pow(1 - progress, 3);
        currentRotation = easing * finalAngle;
        
        drawWheel();
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            spinning = false;
            spinButton.disabled = false;
            spinButton.style.opacity = '1';
            
            // Calculate winner
            const sliceAngle = Math.PI * 2 / subjects.length;
            const normalizedRotation = currentRotation % (Math.PI * 2);
            const winningIndex = subjects.length - Math.floor(normalizedRotation / sliceAngle) - 1;
            const winner = subjects[winningIndex % subjects.length];
            
            // Display result with animation
            const resultDiv = document.getElementById('result');
            resultDiv.textContent = `🎉 ${winner} 🎉`;
            resultDiv.style.animation = 'none';
            resultDiv.offsetHeight; // Trigger reflow
            resultDiv.style.animation = 'fadeIn 0.5s ease';
            
            // Create celebration particles
            const rect = canvas.getBoundingClientRect();
            createParticles(
                rect.left + rect.width/2,
                rect.top + rect.height/2,
                colors[winningIndex % colors.length]
            );
        }
    }
    
    requestAnimationFrame(animate);
}

// Initial wheel draw
drawWheel();

// Add keyboard support
document.getElementById('newSubject').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addSubject();
});
