// JS/problemTracker.js
document.addEventListener('DOMContentLoaded', () => {
  const problemData = {
    title: document.title,
    url: window.location.pathname,
  };
  let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
  recentlyViewed = recentlyViewed.filter(
    (problem) => problem.url !== problemData.url
  );
  recentlyViewed.unshift(problemData);

  const MAX_ITEMS = 3;
  if (recentlyViewed.length > MAX_ITEMS) {
    recentlyViewed = recentlyViewed.slice(0, MAX_ITEMS);
  }
  localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
});
