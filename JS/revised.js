import { topics } from '../TOPICS_LIST.js';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('card-container');
  const noStarredMsg = document.getElementById('no-starred-msg');

  // Get starred topic ids from localStorage
  const starredIds = JSON.parse(localStorage.getItem('starredTopics') || '[]');

  // Filter topics that are starred
  const starredTopics = topics.filter((topic) => starredIds.includes(topic.id));

  if (starredTopics.length === 0) {
    noStarredMsg.style.display = 'block';
  } else {
    noStarredMsg.style.display = 'none';

    starredTopics.forEach((topic) => {
      const card = document.createElement('a');
      card.className = 'card starred';
      card.href = topic.href;
      card.setAttribute('data-topic', topic.id);

      card.innerHTML = `
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
              <h3 style="margin: 0;">${topic.title}</h3>
              <button class="star-btn" aria-label="Unstar this card" title="Unstar">
                <svg class="star-icon" viewBox="0 0 24 24" fill="gold" width="24" height="24" style="pointer-events: none;">
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
  }

  // Handle star button clicks to remove from starred list
  document.addEventListener('click', (e) => {
    const starBtn = e.target.closest('.star-btn');
    if (starBtn) {
      e.preventDefault();
      const card = starBtn.closest('.card');
      const topicId = card.getAttribute('data-topic');

      // Remove from localStorage starredTopics array
      const index = starredIds.indexOf(topicId);
      if (index !== -1) {
        starredIds.splice(index, 1);
        localStorage.setItem('starredTopics', JSON.stringify(starredIds));
      }

      // Remove card from DOM
      card.remove();

      // Show "no starred" message if empty
      if (container.children.length === 0) {
        noStarredMsg.style.display = 'block';
      }
    }
  });
});
