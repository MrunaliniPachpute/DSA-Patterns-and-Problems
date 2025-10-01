function navigateTo(page) {
  window.location.href = page;
}

//Snake toggle logic 
const toggleBtn = document.getElementById("snakeToggle");
let snakeEnabled = false;
let trail = [];

toggleBtn.addEventListener("click", () => {
  snakeEnabled = !snakeEnabled;
  if (snakeEnabled) {
    document.body.classList.add("snake-cursor");
    document.addEventListener("mousemove", drawSnake);
    toggleBtn.innerHTML = '<span style="margin-left: 20px;">Disable Snake</span>';
    toggleBtn.classList.add("active");
  } else {
    document.body.classList.remove("snake-cursor");
    document.removeEventListener("mousemove", drawSnake);
    clearTrail();
    toggleBtn.innerHTML = '<span style="margin-left: 20px;">Snake Cursor</span>';
    toggleBtn.classList.remove("active");
  }
});

function drawSnake(e) {
  const seg = document.createElement("div");
  seg.className = "snake-segment";
  seg.style.left = e.pageX + "px";
  seg.style.top = e.pageY + "px";
  document.body.appendChild(seg);
  trail.push(seg);

  setTimeout(() => {
    seg.remove();
    trail.shift();
  }, 500);
}

function clearTrail() {
  trail.forEach(seg => seg.remove());
  trail = [];
}

// Flowchart toggle functionality
function toggleFlowchart() {
  const flowchartSection = document.getElementById('flowchart-section');
  const button = document.querySelector('.flowchart-button');
  
  if (flowchartSection.classList.contains('active')) {
    flowchartSection.classList.remove('active');
    button.textContent = 'View Flowchart';
  } else {
    flowchartSection.classList.add('active');
    button.textContent = 'Hide Flowchart';
  }
}
