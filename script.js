let subjects = [];
const colors = ["#ffc", "#cfc", "#ccf", "#fcf", "#fcc", "#fdd", "#cdf", "#efd"];
const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const radius = canvas.width / 2;
let rotation = 0;
let spinning = false;

function drawWheel() {
    const num = subjects.length;
    const arc = 2 * Math.PI / num;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw empty state message
    if (num === 0) {
        ctx.font = "bold 20px Poppins";
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("No subjects. Add some!", radius, radius);
        return;
    }

    // Draw wheel segments
    for (let i = 0; i < num; i++) {
        const angle = arc * i + rotation;
        
        // Draw slice
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.fillStyle = colors[i % colors.length];
        ctx.arc(radius, radius, radius - 5, angle, angle + arc);
        ctx.fill();
        
        // Add shine effect
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, 'rgba(255,255,255,0.1)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Draw text
        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#000";
        ctx.font = "bold 16px Poppins";
        ctx.fillText(subjects[i], radius - 20, 5);
        ctx.restore();
    }
}

function spinWheel() {
    if (spinning || subjects.length === 0) return;

    spinning = true;
    const spinButton = document.getElementById("spinButton");
    spinButton.disabled = true;
    spinButton.style.opacity = '0.5';
    
    document.getElementById("result").textContent = "";
    document.getElementById("roast").textContent = "";

    const extraSpins = 5;
    const totalDegrees = Math.floor(Math.random() * 360 + 360 * extraSpins);
    const targetRotation = (totalDegrees * Math.PI) / 180;

    let duration = 3000;
    let start = null;
    let initialRotation = rotation;

    function animate(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;

        let progress = Math.min(elapsed / duration, 1);
        let easeOut = 1 - Math.pow(1 - progress, 3);
        rotation = initialRotation + targetRotation * easeOut;

        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            rotation = rotation % (2 * Math.PI);
            const selectedIndex = subjects.length - Math.floor((rotation / (2 * Math.PI)) * subjects.length) - 1;
            const actualIndex = selectedIndex >= 0 ? selectedIndex : subjects.length - 1;
            const selected = subjects[actualIndex];

            // Show result with animation
            const resultDiv = document.getElementById("result");
            resultDiv.textContent = `Selected: ${selected}`;
            resultDiv.style.animation = 'fadeIn 0.5s ease';

            // Call API for roast
            fetch('https://subject-roulette.onrender.com/api/roast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject: selected })
            })
            .then(res => res.json())
            .then(data => {
                const roastDiv = document.getElementById("roast");
                roastDiv.textContent = data.roast ? `🔥 ${data.roast}` : "Roast failed. Try again.";
                roastDiv.style.animation = 'slideUp 0.5s ease';
            })
            .catch(() => {
                document.getElementById("roast").textContent = "API Error.";
            });

            // Remove selected subject and reset
            subjects.splice(actualIndex, 1);
            rotation = 0;
            drawWheel();
            spinning = false;
            
            // Re-enable spin button
            spinButton.disabled = false;
            spinButton.style.opacity = '1';
        }
    }

    requestAnimationFrame(animate);
}

function addSubject() {
    const input = document.getElementById("newSubject");
    const newSub = input.value.trim();
    
    if (newSub && !subjects.includes(newSub)) {
        subjects.push(newSub);
        input.value = "";
        
        // Add pop animation to input
        input.classList.add('pop');
        setTimeout(() => input.classList.remove('pop'), 300);
        
        drawWheel();
    }
}

// Initialize wheel
drawWheel();

// Add keyboard support
document.getElementById("newSubject").addEventListener("keypress", (e) => {
    if (e.key === "Enter") addSubject();
});
