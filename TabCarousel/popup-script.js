let cycling = true;
    document.getElementById('toggle').addEventListener('click', () => {
      cycling = !cycling;
      chrome.runtime.sendMessage({ cycling });
      document.getElementById('toggle').textContent = cycling ? 'Stop Cycling' : 'Start Cycling';
    });