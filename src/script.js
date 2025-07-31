document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('light');
});


document.querySelectorAll('.toggle-btn').forEach(button => {
  button.addEventListener('click', () => {
    button.classList.toggle('active');
  });
});

// Handle Downloading with ytdlp
document.querySelector('.input-container button').addEventListener('click', () => {
  const url = document.getElementById('urlInput').value.trim();

  const activeOptions = [];
  document.querySelectorAll('.toggle-btn.active').forEach((btn, i) => {
    activeOptions.push(i + 1); // Just index-based placeholder
  });

  if (url) {
    window.electronAPI.downloadVideo(url, activeOptions);
    alert("Download started!");
  }
});
