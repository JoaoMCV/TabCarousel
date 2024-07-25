let currentIndex = 0;
let cycling = false;
let intervalId = setInterval(cycleTabs, 5000);

function cycleTabs() {
  if (!cycling) return;
  chrome.tabs.query({}, function(tabs) {
    if (tabs.length === 0) return;
    
    currentIndex = (currentIndex + 1) % tabs.length;
    chrome.tabs.update(tabs[currentIndex].id, { active: true });
  });
}


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  cycling = request.cycling;
  if (cycling) {
    if (!intervalId) {
      intervalId = setInterval(cycleTabs, 5000);
    }
  } else {
    clearInterval(intervalId);
    intervalId = null;
  }
});
