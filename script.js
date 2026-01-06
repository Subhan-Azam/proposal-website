const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const buttons = document.querySelector(".buttons");
const loading = document.getElementById("loading");

const page1 = document.getElementById("page1");
const page2 = document.getElementById("page2");
const page3 = document.getElementById("page3");
const song = document.getElementById("song");

// Initialize
window.addEventListener("load", () => {
  // Hide loading screen after 3 seconds
  setTimeout(() => {
    loading.style.display = "none";
  }, 3000);
});

// Enhanced NO button movement with fun reactions
let noClickCount = 0;
const noReactions = [
  "Think again! 😏",
  "Are you sure? 🤔",
  "Really? 😅",
  "Come on! 💕",
  "One more try! 😘",
];

function moveNo() {
  const maxX = buttons.clientWidth - noBtn.clientWidth;
  const maxY = buttons.clientHeight - noBtn.clientHeight;

  // Get YES button position and dimensions
  const yesLeft = yesBtn.offsetLeft;
  const yesTop = yesBtn.offsetTop;
  const yesWidth = yesBtn.offsetWidth;
  const yesHeight = yesBtn.offsetHeight;

  let newX, newY;
  let attempts = 0;

  // Keep trying until we find a position that doesn't overlap with YES button
  do {
    newX = Math.random() * maxX;
    newY = Math.random() * maxY;
    attempts++;

    // Prevent infinite loop
    if (attempts > 50) {
      // Fallback: place it on opposite side of YES button
      if (yesLeft < buttons.clientWidth / 2) {
        newX = Math.max(yesLeft + yesWidth + 20, 0);
      } else {
        newX = Math.max(yesLeft - noBtn.offsetWidth - 20, 0);
      }
      newY = Math.random() * maxY;
      break;
    }
  } while (
    // Check if NO button would overlap with YES button (with 20px buffer)
    newX < yesLeft + yesWidth + 20 &&
    newX + noBtn.offsetWidth > yesLeft - 20 &&
    newY < yesTop + yesHeight + 20 &&
    newY + noBtn.offsetHeight > yesTop - 20
  );

  // Ensure the button stays within bounds
  newX = Math.max(0, Math.min(newX, maxX));
  newY = Math.max(0, Math.min(newY, maxY));

  // Smooth transition
  noBtn.style.transition = "all 0.3s ease";
  noBtn.style.left = newX + "px";
  noBtn.style.top = newY + "px";

  // Add shake effect to YES button
  yesBtn.style.animation = "none";
  setTimeout(() => {
    yesBtn.style.animation = "yesGlow 3s ease infinite";
  }, 10);

  // Show reaction message
  if (noClickCount < noReactions.length) {
    showReaction(noReactions[noClickCount]);
    noClickCount++;
  }

  // Make NO button smaller each time
  const scale = Math.max(0.7, 1 - noClickCount * 0.1);
  noBtn.style.transform = `scale(${scale})`;
}

function showReaction(message) {
  // Create floating message
  const reaction = document.createElement("div");
  reaction.textContent = message;
  reaction.style.cssText = `
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 1.2rem;
    color: white;
    background: rgba(255, 46, 99, 0.9);
    padding: 10px 20px;
    border-radius: 25px;
    animation: reactionFloat 3s ease forwards;
    z-index: 100;
    pointer-events: none;
  `;

  // Add keyframes for reaction animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes reactionFloat {
      0% { transform: translateX(-50%) translateY(0) scale(0); opacity: 0; }
      20% { transform: translateX(-50%) translateY(-10px) scale(1); opacity: 1; }
      80% { transform: translateX(-50%) translateY(-20px) scale(1); opacity: 1; }
      100% { transform: translateX(-50%) translateY(-30px) scale(0); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  document.body.appendChild(reaction);

  setTimeout(() => {
    reaction.remove();
    style.remove();
  }, 3000);
}

// Event listeners for NO button
noBtn.addEventListener("mouseover", moveNo);
noBtn.addEventListener("click", moveNo);

// Enhanced YES button with multiple celebration effects
yesBtn.addEventListener("click", () => {
  // Disable buttons
  yesBtn.disabled = true;
  noBtn.disabled = true;

  // Burst of confetti
  confetti({
    particleCount: 200,
    spread: 70,
    origin: { y: 0.6 },
  });

  // Multiple confetti bursts
  setTimeout(() => {
    confetti({
      particleCount: 150,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
    });
  }, 200);

  setTimeout(() => {
    confetti({
      particleCount: 150,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
    });
  }, 400);

  // Heart-shaped confetti
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 80,
      shapes: ["circle"],
      colors: ["#ff2e63", "#ff6b9d", "#ff9a9e"],
    });
  }, 600);

  // Page transition
  page1.style.animation = "slideOutLeft 1s ease forwards";

  setTimeout(() => {
    page1.style.display = "none";
    page2.style.display = "block";

    // Try to play music
    song.play().catch((e) => console.log("Audio autoplay prevented"));
  }, 1000);

  // Transition to final page
  setTimeout(() => {
    page2.style.animation = "fadeOutScale 1s ease forwards";
    setTimeout(() => {
      page2.style.display = "none";
      page3.style.display = "block";
    }, 1000);
  }, 4000);
});

// Add slide out animation
const slideOutStyle = document.createElement("style");
slideOutStyle.textContent = `
  @keyframes slideOutLeft {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(-100%); opacity: 0; }
  }
  
  @keyframes fadeOutScale {
    from { transform: scale(1); opacity: 1; }
    to { transform: scale(0.8); opacity: 0; }
  }
`;
document.head.appendChild(slideOutStyle);

// Background music controls
document.addEventListener(
  "click",
  () => {
    if (song.paused) {
      song.play().catch((e) => console.log("Audio play prevented"));
    }
  },
  { once: true }
);

// Easter egg: Konami code
let konamiCode = [];
const konamiSequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

document.addEventListener("keydown", (e) => {
  konamiCode.push(e.code);
  if (konamiCode.length > konamiSequence.length) {
    konamiCode.shift();
  }

  if (konamiCode.join("") === konamiSequence.join("")) {
    // Easter egg activated!
    confetti({
      particleCount: 500,
      spread: 100,
      startVelocity: 50,
      origin: { y: 0.5 },
    });
    showReaction("Easter egg found! 🎉");
  }
});

// Mouse trail effect
let mouseTrail = [];
document.addEventListener("mousemove", (e) => {
  mouseTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });

  // Clean old trail points
  mouseTrail = mouseTrail.filter((point) => Date.now() - point.time < 1000);

  // Create heart at mouse position occasionally
  if (Math.random() < 0.1) {
    createMouseHeart(e.clientX, e.clientY);
  }
});

function createMouseHeart(x, y) {
  const heart = document.createElement("div");
  heart.textContent = "💖";
  heart.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    font-size: 1rem;
    pointer-events: none;
    z-index: 999;
    animation: heartFade 2s ease forwards;
  `;

  document.body.appendChild(heart);

  setTimeout(() => heart.remove(), 2000);
}

// Add heart fade animation
const heartStyle = document.createElement("style");
heartStyle.textContent = `
  @keyframes heartFade {
    0% { transform: translateY(0) scale(1); opacity: 1; }
    100% { transform: translateY(-50px) scale(0); opacity: 0; }
  }
`;
document.head.appendChild(heartStyle);
