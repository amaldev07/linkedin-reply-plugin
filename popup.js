document.getElementById('replyBtn').addEventListener('click', async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        let userName = document.querySelector('.msg-overlay-bubble-header__title a span')?.textContent.trim();
        let firstName = userName ? userName.split(' ')[0] : '';

        let input = document.querySelector('[contenteditable="true"][role="textbox"]');
        if (input) {
          input.focus();
            input.innerHTML = `<p>Hi ${firstName},</p><p><br><br></p><p>Regards,<br>Amaldev | amaldev.tech</p>`;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
          alert('Message input not found!');
        }
      }
    });
  });
});
