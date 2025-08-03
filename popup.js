document.getElementById('replyBtn').addEventListener('click', async () => {
  // Fetch the template first
  const res = await fetch(chrome.runtime.getURL('message.txt'));
  const template = await res.text();

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (template) => {
        let userName = document.querySelector('.msg-overlay-bubble-header__title a span')?.textContent.trim();
        if (!userName) {
          userName = document.querySelector('.msg-entity-lockup__entity-title')?.textContent.trim();
        }
        let firstName = userName ? userName.split(' ')[0] : '';

        let input = document.querySelector('[contenteditable="true"][role="textbox"]');
        if (input) {
          input.focus();
          message = decodeURIComponent(encodeURIComponent(template));
          let msg = message.replace(/\$\{firstName\}/g, firstName).replace(/\n/g, '<br>');;
          input.innerHTML = `<p>${msg}</p>`;
          input.dispatchEvent(new Event('input', { bubbles: true }));
        } else {
          alert('Message input not found!');
        }
      },
      args: [template]
    });
  });
});