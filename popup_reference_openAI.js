document.getElementById('replyBtn').addEventListener('click', async () => {
  // Get the message from the LinkedIn message box
  chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        let input = document.querySelector('[contenteditable="true"][role="textbox"]');
        let message = input ? input.innerText : '';
        return message;
      },
    }, async (results) => {
      const messageText = results && results[0] ? results[0].result : '';
      if (!messageText) {
        alert('Could not read the message box!');
        return;
      }

      // Call OpenAI API to generate a reply
      const apiKey = 'YOUR_OPENAI_API_KEY'; // <-- Replace with your OpenAI API key
      const apiUrl = 'https://api.openai.com/v1/chat/completions';
      const data = {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that writes professional LinkedIn message replies.' },
          { role: 'user', content: messageText }
        ],
        max_tokens: 200
      };

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(data)
        });
        const result = await response.json();
        const reply = result.choices && result.choices[0] && result.choices[0].message && result.choices[0].message.content
          ? result.choices[0].message.content.trim()
          : 'Could not generate a reply.';

        // Insert the reply into the message box
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (reply) => {
            let input = document.querySelector('[contenteditable="true"][role="textbox"]');
            if (input) {
              input.focus();
              input.innerHTML = `<p>${reply.replace(/\n/g, '<br>')}</p>`;
              input.dispatchEvent(new Event('input', { bubbles: true }));
            } else {
              alert('Message input not found!');
            }
          },
          args: [reply]
        });
      } catch (e) {
        alert('Failed to generate reply: ' + e.message);
      }
    });
  });
});