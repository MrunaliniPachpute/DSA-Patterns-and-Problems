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
      seg.style.left = e.pageX + 'px';
      seg.style.top = e.pageY + 'px';
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
      if (!dropdownBtn.contains(e.target) && !dropdownContent.contains(e.target)) {
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
