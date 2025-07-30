document.getElementById('replyBtn').addEventListener('click', async () => {
  // Run the content script's fillMessage function in the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        // This code will run in the context of the LinkedIn tab
        // Find the user name (grab from DOM if possible)
        // let userName = "there";
        let userName = document.querySelector('.msg-overlay-bubble-header__title a span')?.textContent.trim();
        let firstName = userName ? userName.split(' ')[0] : '';

        let input = document.querySelector('[contenteditable="true"][role="textbox"]');
        if (input) {
          input.focus(); // Focus on the message box
          input.innerHTML = `<p>Hi How are you</p>`;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
          alert('Message input not found!');
        }
      }
    });
  });
});
