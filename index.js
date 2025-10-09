document.addEventListener('DOMContentLoaded', () => {
  /*** ------------------ Flowchart Toggle ------------------ ***/
  document.querySelectorAll('.flowchart-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const container = btn.nextElementSibling;
      container.style.display =
        container.style.display === 'none' ? 'block' : 'none';
      btn.textContent =
        container.style.display === 'block' ? 'Hide Flowchart' : 'View Flowchart';
    });
  });

  /*** ------------------ Snake Cursor Toggle ------------------ ***/
  const snakeToggle = document.getElementById('snakeToggle');
  let snakeEnabled = localStorage.getItem('snakeEnabled') === 'true';
  let snakeTrail = [];

  function enableSnake() {
    document.body.classList.add('snake-cursor');
    document.addEventListener('mousemove', drawSnake);
    snakeToggle.innerHTML = '<span style="margin-left: 20px;">Disable Snake</span>';
    snakeToggle.classList.add('active');
  }

  function disableSnake() {
    document.body.classList.remove('snake-cursor');
    document.removeEventListener('mousemove', drawSnake);
    snakeTrail.forEach((seg) => seg.remove());
    snakeTrail = [];
    snakeToggle.innerHTML = '<span style="margin-left: 20px;">Snake Cursor</span>';
    snakeToggle.classList.remove('active');
  }

  function drawSnake(e) {
    const seg = document.createElement('div');
    seg.className = 'snake-segment';
    seg.style.left = e.clientX + 'px';
    seg.style.top = e.clientY + 'px';
    document.body.appendChild(seg);
    snakeTrail.push(seg);

    setTimeout(() => {
      seg.remove();
      snakeTrail.shift();
    }, 500);
  }

  if (snakeEnabled) enableSnake();

  if (snakeToggle) {
    snakeToggle.addEventListener('click', () => {
      snakeEnabled = !snakeEnabled;
      localStorage.setItem('snakeEnabled', snakeEnabled);
      if (snakeEnabled) enableSnake();
      else disableSnake();
    });
  }

  /*** ------------------ Dark Mode Toggle ------------------ ***/
  const darkModeToggle = document.getElementById("darkModeToggle");
  let darkModeEnabled = localStorage.getItem('darkModeEnabled') === 'true';

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

  if (darkModeEnabled) enableDarkMode();

  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      darkModeEnabled = !darkModeEnabled;
      localStorage.setItem('darkModeEnabled', darkModeEnabled);
      if (darkModeEnabled) enableDarkMode();
      else disableDarkMode();
    });
  }

  /*** ------------------ Recently Viewed Problems ------------------ ***/
  const recentlyViewedList = document.getElementById('recently-viewed-list');
  const clearHistoryBtn = document.getElementById('clear-history-btn');

  function displayRecentProblems() {
    if (!recentlyViewedList) return;
    recentlyViewedList.innerHTML = '';
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    if (recentlyViewed.length === 0) {
      recentlyViewedList.innerHTML = 'No recent problems viewed';
      if (clearHistoryBtn) clearHistoryBtn.style.display = 'none';
    } else {
      recentlyViewed.forEach((problem) => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = problem.url;
        link.textContent = problem.title;
        li.appendChild(link);
        recentlyViewedList.appendChild(li);
      });
      if (clearHistoryBtn) clearHistoryBtn.style.display = 'block';
    }
  }

  function clearHistory() {
    localStorage.removeItem('recentlyViewed');
    displayRecentProblems();
  }

  if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', clearHistory);
  displayRecentProblems();

  /*** ------------------ Topics Filter Dropdown ------------------ ***/
  const dropdownBtn = document.getElementById('topicsDropdownBtn');
  const dropdownContent = document.getElementById('topicsDropdownContent');

  if (dropdownBtn && dropdownContent) {
    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownContent.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!dropdownBtn.contains(e.target) && !dropdownContent.contains(e.target)) {
        dropdownContent.classList.remove('show');
      }
    });
  }

  /*** ------------------ Topics Filter Logic ------------------ ***/
  const topicFilters = document.querySelectorAll('.topic-filter');
  const cards = document.querySelectorAll('.card[data-topic]');

  if (topicFilters.length > 0 && cards.length > 0) {
    topicFilters.forEach((checkbox) => {
      checkbox.addEventListener('change', filterCards);
    });

    function filterCards() {
      const checkedTopics = Array.from(topicFilters)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);

      cards.forEach((card) => {
        const cardTopic = card.getAttribute('data-topic');
        card.style.display = checkedTopics.includes(cardTopic) ? '' : 'none';
      });
    }
  }

});
