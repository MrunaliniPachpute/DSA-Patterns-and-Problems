document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.flowchart-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const container = btn.nextElementSibling;
      container.style.display = container.style.display === 'none' ? 'block' : 'none';
      btn.textContent = container.style.display === 'block' ? 'Hide Flowchart' : 'View Flowchart';
    });
  });

  const toggleBtn = document.getElementById('snakeToggle');
  if (toggleBtn) {
    let snakeEnabled = localStorage.getItem('snakeEnabled') === 'true';
    let trail = [];
    if (snakeEnabled) enableSnake();
    toggleBtn.addEventListener('click', () => {
      snakeEnabled = !snakeEnabled;
      localStorage.setItem('snakeEnabled', snakeEnabled);
      if (snakeEnabled) enableSnake();
      else disableSnake();
    });
    function enableSnake() {
      document.body.classList.add('snake-cursor');
      document.addEventListener('mousemove', drawSnake);
      toggleBtn.innerHTML = '<span style="margin-left: 20px;">Disable Snake</span>';
      toggleBtn.classList.add('active');
    }
    function disableSnake() {
      document.body.classList.remove('snake-cursor');
      document.removeEventListener('mousemove', drawSnake);
      clearTrail();
      toggleBtn.innerHTML = '<span style="margin-left: 20px;">Snake Cursor</span>';
      toggleBtn.classList.remove('active');
    }
    function drawSnake(e) {
      const seg = document.createElement('div');
      seg.className = 'snake-segment';
      seg.style.left = e.clientX + 'px';
      seg.style.top = e.clientY + 'px';
      document.body.appendChild(seg);
      trail.push(seg);
      setTimeout(() => { seg.remove(); trail.shift(); }, 500);
    }
    function clearTrail() {
      trail.forEach((seg) => seg.remove());
      trail = [];
    }
  }

  const darkModeToggle = document.getElementById("darkModeToggle");
  if (darkModeToggle) {
    let darkModeEnabled = localStorage.getItem('darkModeEnabled') === 'true';
    if (darkModeEnabled) enableDarkMode();
    darkModeToggle.addEventListener("click", () => {
      darkModeEnabled = !darkModeEnabled;
      localStorage.setItem('darkModeEnabled', darkModeEnabled);
      if (darkModeEnabled) enableDarkMode();
      else disableDarkMode();
    });
    function enableDarkMode() {
      document.body.classList.add("dark-mode");
      darkModeToggle.innerHTML = '☀️ Light Mode';
      darkModeToggle.classList.add("active");
    }
    function disableDarkMode() {
      document.body.classList.remove("dark-mode");
      darkModeToggle.innerHTML = '🌙 Dark Mode';
      darkModeToggle.classList.remove("active");
    }
  }


});
