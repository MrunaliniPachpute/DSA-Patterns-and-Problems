import { topics } from '../TOPICS_LIST.js';

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
});
