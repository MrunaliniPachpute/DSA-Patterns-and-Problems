const dropdownBtn = document.getElementById('topicsDropdownBtn');
const dropdown = document.querySelector('.filter-dropdown');

dropdownBtn.addEventListener('click', () => {
  dropdown.classList.toggle('active');
});
