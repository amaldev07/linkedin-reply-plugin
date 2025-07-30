document.getElementById('replyBtn').addEventListener('click', async () => {
    alert(123)
  // Run the content script's fillMessage function in the active tab
  chrome.tabs.query({active: true, currentWindow: true}, ([tab]) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        // This code will run in the context of the LinkedIn tab
        // Find the user name (grab from DOM if possible)
        let userName = "there";
        const nameEl = document.querySelector('h2.msg-thread__subject'); // fallback if needed
        if(nameEl) userName = nameEl.textContent.trim();

        // Find the message input area
        let input = document.querySelector('[contenteditable="true"][role="textbox"]');
        if(input) {
          input.focus();
          input.innerText = `Hi ${userName},\n\nRegards,\nAmaldev`;
        } else {
          alert('Message input not found!');
        }
      }
    });
  });
});
