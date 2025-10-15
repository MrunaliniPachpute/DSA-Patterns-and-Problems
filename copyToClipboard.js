function copyToClipboard(button) {
  const pre = button.previousElementSibling;
  const text = pre.innerText; 

  navigator.clipboard.writeText(text)
    .then(() => {
      button.textContent = 'Copied!';
      setTimeout(() => button.textContent = 'Copy!', 2000);
    })
    .catch(err => {
      console.error('Failed to copy: ', err);
    });
}
