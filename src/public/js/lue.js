document.addEventListener('click', (event) => {
  if (event.target.matches('[data-confirm]') && !confirm(event.target.dataset.confirm)) {
    event.preventDefault();
  }
});
