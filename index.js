// Flowchart toggle functionality
document.querySelectorAll('.flowchart-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const container = btn.nextElementSibling; // find the div right after this button
    container.style.display =
      container.style.display === 'none' ? 'block' : 'none';
    // Optional: toggle button text
    btn.textContent =
      container.style.display === 'block' ? 'Hide Flowchart' : 'View Flowchart';
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  if (!input) return;

  const text = 'Search topics or problems...';
  const prefersReduced = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReduced) {
    input.placeholder = text;
    return;
  }

  let i = 0;
  const speed = 80; // typing speed (ms)

  const type = () => {
    if (i < text.length) {
      input.setAttribute('placeholder', text.substring(0, i + 1));
      i++;
      setTimeout(type, speed);
    }
  };

  // Start typing when visible or immediately
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        type();
        obs.disconnect();
      }
    });
  });

  observer.observe(input);

  // Optional: stop animation when focused
  input.addEventListener('focus', () => {
    input.placeholder = text;
  });

  // Recently Viewed Problems Logic
  const recentlyViewedList = document.getElementById('recently-viewed-list');
  const clearHistoryBtn = document.getElementById('clear-history-btn');
  // reads from localStorage and builds the HTML list
  function displayRecentProblems() {
    if (!recentlyViewedList) return; // Guard clause if element doesn't exist
    recentlyViewedList.innerHTML = '';
    const recentlyViewed =
      JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    if (recentlyViewed.length === 0) {
      recentlyViewedList.innerHTML = 'No recent problems viewed';
      if (clearHistoryBtn) clearHistoryBtn.style.display = 'none';
    } else {
      recentlyViewed.forEach((problem) => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = problem.url;
        link.textContent = problem.title;
        listItem.appendChild(link);
        recentlyViewedList.appendChild(listItem);
      });
      if (clearHistoryBtn) clearHistoryBtn.style.display = 'block';
    }
  }
  //function to clear history on buttonclick
  function clearHistory() {
    localStorage.removeItem('recentlyViewed');
    displayRecentProblems();
  }
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', clearHistory);
  }
  if (recentlyViewedList) {
    displayRecentProblems();
  }

  // Topics Filter Dropdown Toggle Logic
  const dropdownBtn = document.getElementById('topicsDropdownBtn');
  const dropdownContent = document.getElementById('topicsDropdownContent');

  if (dropdownBtn && dropdownContent) {
    // Toggle dropdown on button click
    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownContent.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (
        !dropdownBtn.contains(e.target) &&
        !dropdownContent.contains(e.target)
      ) {
        dropdownContent.classList.remove('show');
      }
    });
  }

  // Topics Filter and Search Logic
  const topicFilters = document.querySelectorAll('.topic-filter');
  const searchInput = document.getElementById('searchInput');
  const cards = document.querySelectorAll('.card[data-topic]');
  if (topicFilters.length > 0 && cards.length > 0) {
    topicFilters.forEach((checkbox) => {
      checkbox.addEventListener('change', filterCards);
    });
    if (searchInput) {
      searchInput.addEventListener('input', filterCards);
    }
    function filterCards() {
      // Get all checked filter values
      const checkedTopics = Array.from(topicFilters)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);
      const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
      // Show/hide cards based on filter and search
      cards.forEach((card) => {
        const cardTopic = card.getAttribute('data-topic');
        const cardText = card.textContent.toLowerCase();
        const topicMatch = checkedTopics.includes(cardTopic);
        const searchMatch = cardText.includes(searchTerm);
        if (topicMatch && searchMatch) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }
  }

  // Progress Tracking Logic
  const completedTopics =
    JSON.parse(localStorage.getItem('completedTopics')) || [];

  // Add progress elements to cards
  cards.forEach((card) => {
    const indicator = document.createElement('span');
    indicator.className = 'progress-indicator';
    indicator.textContent = '✓';
    card.appendChild(indicator);

    const bar = document.createElement('div');
    bar.className = 'progress-bar';
    card.appendChild(bar);
  });

  // Update progress
  function updateProgress() {
    cards.forEach((card) => {
      const topic = card.getAttribute('data-topic');
      const bar = card.querySelector('.progress-bar');
      if (completedTopics.includes(topic)) {
        card.classList.add('completed');
        bar.style.width = '100%';
      } else {
        card.classList.remove('completed');
        bar.style.width = '0%';
      }
    });
  }

  updateProgress();

  // Stagger animation for cards
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });
});

// Snake toggle logic with persistence
const toggleBtn = document.getElementById('snakeToggle');
if (toggleBtn) {
  // Check localStorage for saved snake state
  let snakeEnabled = localStorage.getItem('snakeEnabled') === 'true';
  let trail = [];

  if (snakeEnabled) {
    enableSnake();
  }

  toggleBtn.addEventListener('click', () => {
    snakeEnabled = !snakeEnabled;
    localStorage.setItem('snakeEnabled', snakeEnabled);
    if (snakeEnabled) {
      enableSnake();
    } else {
      disableSnake();
    }
  });

  function enableSnake() {
    document.body.classList.add('snake-cursor');
    document.addEventListener('mousemove', drawSnake);
    toggleBtn.innerHTML =
      '<span style="margin-left: 20px;">Disable Snake</span>';
    toggleBtn.classList.add('active');
  }

  function disableSnake() {
    document.body.classList.remove('snake-cursor');
    document.removeEventListener('mousemove', drawSnake);
    clearTrail();
    toggleBtn.innerHTML =
      '<span style="margin-left: 20px;">Snake Cursor</span>';
    toggleBtn.classList.remove('active');
  }

  function drawSnake(e) {
    const seg = document.createElement('div');
    seg.className = 'snake-segment';
    seg.style.left = e.clientX + 'px';
    seg.style.top = e.clientY + 'px';
    document.body.appendChild(seg);
    trail.push(seg);
    setTimeout(() => {
      seg.remove();
      trail.shift();
    }, 500);
  }

  function clearTrail() {
    trail.forEach((seg) => seg.remove());
    trail = [];
  }
}

function navigateTo(page) {
  window.location.href = page;
}

// Dark Mode toggle logic with persistence
const darkModeToggle = document.getElementById('darkModeToggle');
if (darkModeToggle) {
  // Check localStorage for saved dark mode state
  let darkModeEnabled = localStorage.getItem('darkModeEnabled') === 'true';

  // Initialize dark mode state based on saved preference
  if (darkModeEnabled) {
    enableDarkMode();
  }

  darkModeToggle.addEventListener('click', () => {
    darkModeEnabled = !darkModeEnabled;
    // Save state to localStorage
    localStorage.setItem('darkModeEnabled', darkModeEnabled);

    if (darkModeEnabled) {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
  });

  function enableDarkMode() {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '☀️ Light Mode';
    darkModeToggle.classList.add('active');
  }

  function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    darkModeToggle.innerHTML = '🌙 Dark Mode';
    darkModeToggle.classList.remove('active');
  }

  // Auto-scroll for card container
  let autoScrollInterval;
  function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
      const container = document.querySelector('.card-container');
      container.scrollLeft += 300;
      if (
        container.scrollLeft >=
        container.scrollWidth - container.clientWidth
      ) {
        container.scrollLeft = 0;
      }
    }, 3000);
  }
  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
  }
  startAutoScroll();
  document
    .querySelector('.card-container')
    .addEventListener('mouseenter', stopAutoScroll);
  document
    .querySelector('.card-container')
    .addEventListener('mouseleave', startAutoScroll);
}

// STUDY STOPWATCH - drop into index.js or create JS/stopwatch.js and include in index.html
(() => {
  const display = document.getElementById('stopwatch-display');
  const startBtn = document.getElementById('stopwatch-start');
  const resetBtn = document.getElementById('stopwatch-reset');

  // localStorage keys
  const KEY_ELAPSED = 'study_stopwatch_elapsed_ms';
  const KEY_RUNNING = 'study_stopwatch_running';
  const KEY_LASTSTART = 'study_stopwatch_laststart_ts';

  let elapsed = Number(localStorage.getItem(KEY_ELAPSED) || 0); // ms
  let running = localStorage.getItem(KEY_RUNNING) === 'true';
  let lastStart = Number(localStorage.getItem(KEY_LASTSTART) || 0);
  let intervalId = null;

  function msToHMS(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  function updateDisplay() {
    let current = elapsed;
    if (running && lastStart) {
      current = elapsed + (Date.now() - lastStart);
    }
    display.textContent = msToHMS(current);
  }

  function tick() {
    updateDisplay();
  }

  function startTimer() {
    if (running) return;
    running = true;
    lastStart = Date.now();
    localStorage.setItem(KEY_RUNNING, 'true');
    localStorage.setItem(KEY_LASTSTART, String(lastStart));
    startBtn.textContent = '⏸️';
    updateDisplay();
    intervalId = setInterval(tick, 1000);
  }

  function pauseTimer() {
    if (!running) return;
    running = false;
    // accumulate elapsed
    elapsed = elapsed + (Date.now() - lastStart);
    lastStart = 0;
    localStorage.setItem(KEY_ELAPSED, String(elapsed));
    localStorage.setItem(KEY_RUNNING, 'false');
    localStorage.removeItem(KEY_LASTSTART);
    startBtn.textContent = '▶️';
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
    updateDisplay();
  }

  function resetTimer() {
    running = false;
    elapsed = 0;
    lastStart = 0;
    localStorage.removeItem(KEY_LASTSTART);
    localStorage.setItem(KEY_ELAPSED, '0');
    localStorage.setItem(KEY_RUNNING, 'false');
    startBtn.textContent = '▶️';
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
    updateDisplay();
  }

  // toggle start/pause
  startBtn.addEventListener('click', () => {
    if (!running) startTimer(); else pauseTimer();
  });

  // keyboard accessibility: space or enter on focused button will work naturally
  resetBtn.addEventListener('click', () => {
    // confirmation to prevent accidental reset (keeps UX safe)
    if (confirm('Reset study timer?')) resetTimer();
  });

  // initialize on load: if running according to storage, resume
  (function init() {
    // if storage says running, but lastStart exists, compute elapsed so far
    if (localStorage.getItem(KEY_ELAPSED)) {
      elapsed = Number(localStorage.getItem(KEY_ELAPSED) || 0);
    }
    if (localStorage.getItem(KEY_RUNNING) === 'true') {
      running = true;
      lastStart = Number(localStorage.getItem(KEY_LASTSTART) || Date.now());
      // protect against bad lastStart
      if (!lastStart || lastStart <= 0) lastStart = Date.now();
    } else {
      running = false;
      lastStart = 0;
    }

    // set button text
    startBtn.textContent = running ? '⏸️' : '▶️';

    // start ticking if running
    if (running) {
      intervalId = setInterval(tick, 1000);
    }
    updateDisplay();

    // update display every second even when paused to show accurate time after resuming
    // (not necessary but harmless)
    setInterval(() => {
      // nothing heavy here
      updateDisplay();
    }, 1000);
  })();

  // optional: when user closes tab while running, ensure elapsed saved (so restore is accurate)
  window.addEventListener('beforeunload', () => {
    if (running && lastStart) {
      // save elapsed so far
      const currentElapsed = elapsed + (Date.now() - lastStart);
      localStorage.setItem(KEY_ELAPSED, String(currentElapsed));
      localStorage.setItem(KEY_LASTSTART, String(Date.now())); // keep lastStart near-unload
      localStorage.setItem(KEY_RUNNING, 'true');
    } else {
      localStorage.setItem(KEY_ELAPSED, String(elapsed));
      localStorage.setItem(KEY_RUNNING, 'false');
      localStorage.removeItem(KEY_LASTSTART);
    }
  });
})();
