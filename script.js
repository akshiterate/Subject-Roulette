let subjects = [];

const colors = ["#ffc", "#cfc", "#ccf", "#fcf", "#fcc", "#fdd", "#cdf", "#efd"];

const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");
const radius = canvas.width / 2;

let rotation = 0;
let spinning = false;

function drawWheel() {
  const num = subjects.length;
  const arc = (2 * Math.PI) / num;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (num === 0) {
    ctx.font = "bold 20px Comic Sans MS";
    ctx.textAlign = "center";
    ctx.fillText("No subjects. Add some!", radius, radius);
    return;
  }

  for (let i = 0; i < num; i++) {
    const angle = arc * i + rotation;

    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.fillStyle = colors[i % colors.length];
    ctx.arc(radius, radius, radius - 5, angle, angle + arc);
    ctx.fill();

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(angle + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.font = "bold 14px Comic Sans MS";
    ctx.fillText(subjects[i], radius - 20, 5);
    ctx.restore();
  }
}

function spinWheel() {
  if (spinning || subjects.length === 0) return;

  spinning = true;
  document.getElementById("result").textContent = "";
  document.getElementById("roast").textContent = "";

  const extraSpins = 5;
  const totalDegrees = Math.floor(Math.random() * 360 + 360 * extraSpins);
  const targetRotation = (totalDegrees * Math.PI) / 180;

  const duration = 3000;
  let start = null;
  let initialRotation = rotation;

  function animate(timestamp) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;

    const progress = Math.min(elapsed / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 3);
    rotation = initialRotation + targetRotation * easeOut;

    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      rotation %= 2 * Math.PI;

      const selectedIndex =
        subjects.length - Math.floor((rotation / (2 * Math.PI)) * subjects.length) - 1;
      const actualIndex = selectedIndex >= 0 ? selectedIndex : subjects.length - 1;
      const selected = subjects[actualIndex];

      document.getElementById("result").textContent = `Subject: ${selected}`;

      fetch("https://subject-roulette.onrender.com/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: selected }),
      })
        .then((res) => res.json())
        .then((data) => {
          document.getElementById("roast").textContent = data.roast
            ? `🔥 ${data.roast}`
            : "Roast failed. Try again.";
        })
        .catch(() => {
          document.getElementById("roast").textContent = "API Error.";
        });

      subjects.splice(actualIndex, 1);
      rotation = 0;
      drawWheel();
      spinning = false;
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
    drawWheel();
  }
}

drawWheel();
