// Reusable loader snippet for contributors:
// <div class="loader-center"><span class="visually-hidden">Loading...</span></div>

// --- Loader helpers: minimal, reusable, accessible ---
// Usage: showLoader(target, type='center'|'inline'); hideLoader(target)
// 'target' can be an element or string id. Use for cards, panels, overlays, or inline in buttons.
// Example for central section: <div id="results-loader"></div> → showLoader('results-loader','center')
// Example for button: showLoader(buttonNode, 'inline')

function showLoader(target, type = 'center') {
  let el = typeof target === 'string' ? document.getElementById(target) : target;
  if (!el) return;
  hideLoader(el); // ensure no double append
  let loaderElem = document.createElement('div');
  if (type === 'inline') {
    loaderElem.className = 'loader-inline';
    loaderElem.setAttribute('role', 'status');
    loaderElem.setAttribute('aria-busy', 'true');
    loaderElem.innerHTML = '<span class="visually-hidden">Loading...</span>';
  } else { // center (block/section)
    loaderElem.className = 'loader-center';
    loaderElem.setAttribute('role', 'status');
    loaderElem.setAttribute('aria-busy', 'true');
    loaderElem.innerHTML = '<span class="visually-hidden">Loading...</span>';
  }
  el.style.display = type === 'inline' ? 'inline-block' : 'flex';
  el.appendChild(loaderElem);
}

function hideLoader(target) {
  let el = typeof target === 'string' ? document.getElementById(target) : target;
  if (!el) return;
  Array.from(el.querySelectorAll('.loader-center, .loader-inline')).forEach(e => e.remove());
  el.style.display = '';
}
// --- End loader helpers ---

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
      checkbox.addEventListener('change', filterWithLoader);
    });
    if (searchInput) {
      searchInput.addEventListener('input', function(e) {
        showLoader('search-loader', 'center');
        showSearchSkeletons();
        // Hide all cards during skeleton
        let cards = document.querySelectorAll('.card[data-topic]');
        cards.forEach(card => { card.style.opacity = 0; });
        setTimeout(() => {
          try {
            filterCards();
          } finally {
            hideLoader('search-loader');
            hideSearchSkeletons();
            // Always unhide cards after search loading
            let cardsNow = document.querySelectorAll('.card[data-topic]');
            cardsNow.forEach(card => {
              card.style.transition = 'opacity 0.2s';
              card.style.opacity = '';
            });
          }
        }, 450);
      });
    }
    function filterWithLoader() {
      showLoader('filter-inline-loader', 'inline');
      showSearchSkeletons();
      // Hide all cards instantly for skeleton effect
      let cards = document.querySelectorAll('.card[data-topic]');
      cards.forEach(card => { card.style.opacity = 0; });
      setTimeout(() => {
        try {
          filterCards();
        } finally {
          hideLoader('filter-inline-loader');
          hideSearchSkeletons();
          // Always unhide (fade in) results after filtering
          let cardsNow = document.querySelectorAll('.card[data-topic]');
          cardsNow.forEach(card => {
            card.style.transition = 'opacity 0.25s';
            card.style.opacity = '';
          });
        }
      }, 430);
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

// --- new helpers for skeletons ---
function showSearchSkeletons(count = 4) {
  const container = document.getElementById('search-skeletons');
  if (!container) return;
  let skels = '';
  for (let i=0; i<count; ++i) {
    skels += '<div class="skeleton-block" style="height:160px;"></div>';
  }
  container.innerHTML = skels;
  container.style.display = '';
}
function hideSearchSkeletons() {
  const container = document.getElementById('search-skeletons');
  if (container) {
    container.innerHTML = '';
    container.style.display = 'none';
  }
}

function filterCards() {
  // Always get fresh NodeLists
  let cards = document.querySelectorAll('.card[data-topic]');
  let topicFilters = document.querySelectorAll('.topic-filter');
  const checkedTopics = Array.from(topicFilters)
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);
  const searchInput = document.getElementById('searchInput');
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
  let visibleCount = 0;
  cards.forEach((card) => {
    const cardTopic = card.getAttribute('data-topic');
    const cardText = card.textContent.toLowerCase();
    const topicMatch = checkedTopics.includes(cardTopic);
    const searchMatch = cardText.includes(searchTerm);
    if (topicMatch && searchMatch) {
      card.style.display = '';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
    card.style.opacity = '';
  });
  // Handle 'No topics found' message
  const cardContainer = document.querySelector('.card-container');
  let noResultsMsg = document.getElementById('no-results-msg');
  if (!noResultsMsg) {
    noResultsMsg = document.createElement('div');
    noResultsMsg.id = 'no-results-msg';
    noResultsMsg.textContent = 'No topics found.';
    noResultsMsg.style.cssText = 'text-align:center; color:#aaa; font-size:1.3rem; margin:2rem;';
    cardContainer.appendChild(noResultsMsg);
  }
  noResultsMsg.style.display = (visibleCount === 0) ? '' : 'none';
}
