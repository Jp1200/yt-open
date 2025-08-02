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

// Handler functions for file explorer
const fileListEl = document.getElementById('file-list');
const dirNameSpan = document.getElementById('dir-name');
let currentPath = '';
document.getElementById('open-folder-btn').addEventListener('click', async() => {
    const folderPath = await window.electronAPI.selectFolder();
    if (folderPath){
        currentPath = folderPath;
        dirNameSpan.innerText = currentPath;
        loadDirectory(folderPath);
        document.getElementById('open-folder-btn').innerText('Change Directory')
    }
})
async function loadDirectory(dirPath) {
    const contents = await window.electronAPI.readDir(dirPath)
    if (contents.error){
        alert(`Error: ${contents.error}`)
        return;
    }
    fileListEl.innerHTML = '';
    for(const item of contents){
        const li = document.createElement('li');
        li.textContent = item.isDirectory ? `📁 ${item.name}` : `📄 ${item.name}`;
        li.className = item.isDirectory ? 'dir-item' : 'file-item';
        li.dataset.path = item.path;

        li.addEventListener('click',()=>{
            if (item.isDirectory){
                currentPath =item.path;
                loadDirectory(item.path);
            } else {
                alert(`You clicked file: ${item.name}`)
            }
        });
        fileListEl.appendChild(li)

    }
}
