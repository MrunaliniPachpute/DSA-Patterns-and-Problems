import { topics } from './TOPICS_LIST.js';

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
function updateStarredInStorage(id, isStarred) {
  const starred = JSON.parse(localStorage.getItem('starredTopics') || '[]');
  const index = starred.indexOf(id);
  if (isStarred && index === -1) {
    starred.push(id);
  } else if (!isStarred && index !== -1) {
    starred.splice(index, 1);
  }
  localStorage.setItem('starredTopics', JSON.stringify(starred));
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('card-container');

  topics.forEach((topic) => {
    const card = document.createElement('a');
    card.className = 'card';
    card.href = topic.href;
    card.setAttribute('data-id', topic.id); // important for starring

    card.innerHTML = `
  <div class="card-header">
    <h3>${topic.title}</h3>
    <button class="star-btn" aria-label="Star this card">
      <svg class="star-icon" viewBox="0 0 24 24">
        <path d="M12 17.27L18.18 21l-1.64-7.03
                 L22 9.24l-7.19-.61L12 2 9.19 8.63
                 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>
    </button>
  </div>
  <div class="card-body">
    <p>${topic.description}</p>
  </div>
`;

    container.appendChild(card);
  });
  document.addEventListener('click', (e) => {
    const strBtn = e.target.closest('.star-btn');
    if (strBtn) {
      e.preventDefault();
      const card = e.target.closest('.card');
      card.classList.toggle('starred');

      // Use data-id instead of title
      const id = card.getAttribute('data-id');
      updateStarredInStorage(id, card.classList.contains('starred'));
    }
  });

  // On page load, restore starred state by id
  const starred = JSON.parse(localStorage.getItem('starredTopics') || '[]');
  document.querySelectorAll('.card').forEach((card) => {
    const id = card.getAttribute('data-id');
    if (starred.includes(id)) {
      card.classList.add('starred');
    }
  });

  // Snake toggle logic with persistence
  const toggleBtn = document.getElementById('snakeToggle');
  if (toggleBtn) {
    // Check localStorage for saved snake state
    let snakeEnabled = localStorage.getItem('snakeEnabled') === 'true';
    let trail = [];
    // Initialize snake state based on saved preference
    if (snakeEnabled) {
      enableSnake();
    }
    toggleBtn.addEventListener('click', () => {
      snakeEnabled = !snakeEnabled;
      // Save state to localStorage
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

  // Topics Filter Logic
  const topicFilters = document.querySelectorAll('.topic-filter');
  const cards = document.querySelectorAll('.card[data-topic]');
  if (topicFilters.length > 0 && cards.length > 0) {
    topicFilters.forEach((checkbox) => {
      checkbox.addEventListener('change', filterCards);
    });
    function filterCards() {
      // Get all checked filter values
      const checkedTopics = Array.from(topicFilters)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);
      // Show/hide cards based on filter
      cards.forEach((card) => {
        const cardTopic = card.getAttribute('data-topic');
        if (checkedTopics.includes(cardTopic)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }
  }
});
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

  // Check localStorage for saved dark mode state
  darkModeEnabled = localStorage.getItem('darkModeEnabled') === 'true';

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
}
