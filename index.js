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
    toggleBtn.textContent = "Disable Snake";
    toggleBtn.classList.add("active");
    toggleBtn.setAttribute("aria-pressed", "true");
    toggleBtn.setAttribute("title", "Disable animated snake cursor");
  } else {
    document.body.classList.remove("snake-cursor");
    document.removeEventListener("mousemove", drawSnake);
    clearTrail();
    toggleBtn.textContent = "Snake Cursor";
    toggleBtn.classList.remove("active");
    toggleBtn.setAttribute("aria-pressed", "false");
    toggleBtn.setAttribute("title", "Enable animated snake cursor");
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
