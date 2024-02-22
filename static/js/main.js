function toggleMenu() {
            var menu = document.querySelector('.vertical-menu');
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        }
      
       document.addEventListener('DOMContentLoaded', function() {
    // References to DOM elements
    const sendButton = document.querySelector('.chat-send-btn');
    const messageInput = document.querySelector('.chat-input');
    const fileInput = document.querySelector('.chat-upload-btn');
    const modelSelect = document.getElementById('modelSelect');
    const botSelect = document.getElementById('botSelect');
    const messageThread = document.querySelector('.message-thread');

    let currentCenterMessageElement = null;

    function displayCenterMessage(content) {
        // Remove any existing centered message
        if (currentCenterMessageElement) {
            document.body.removeChild(currentCenterMessageElement);
        }

        // Create and display a new centered message
        const centerMessage = document.createElement('div');
        centerMessage.textContent = content;
        centerMessage.style.position = 'fixed';
        centerMessage.style.top = '50%';
        centerMessage.style.left = '55%'; // Adjusting to 55% from the left
        centerMessage.style.transform = 'translate(-50%, -50%)';
        centerMessage.style.backgroundColor = '#16222A';
        centerMessage.style.color = 'white';
        centerMessage.style.padding = '180px';
        centerMessage.style.borderRadius = '10px';
        centerMessage.style.zIndex = '1000';
        document.body.appendChild(centerMessage);

        // Update the reference to the current centered message
        currentCenterMessageElement = centerMessage;
    }

    function appendMessage(content) {
        const messageElement = document.createElement('p');
        messageElement.textContent = content;
        messageElement.style.cursor = 'pointer';
        messageElement.addEventListener('click', () => {
            // Highlight message
            messageElement.style.backgroundColor = '#243B55'; // Highlight selected message
            messageElement.style.color = 'white';
          messageElement.style.padding = '10px'; // Add padding for better readability
    messageElement.style.margin = '5px 0'; // Add margin for spacing between messages
    messageElement.style.borderRadius = '5px'; // Round corners for a softer look
            displayCenterMessage(content);
        });

        // Append the message to the message thread and keep it scrolled to the latest message
        messageThread.appendChild(messageElement);
        messageThread.scrollTop = messageThread.scrollHeight;

        // Display the new message in the center, replacing any existing centered message
        displayCenterMessage(content);
    }

    async function sendMessage() {
        const formData = new FormData();
        if (messageInput.value.trim()) {
            formData.append('message', messageInput.value.trim());
        }
        if (fileInput.files.length > 0) {
            formData.append('file', fileInput.files[0]);
        }
        formData.append('model', modelSelect.value);
        formData.append('botType', botSelect.value);

        try {
            const response = await fetch('/process_interaction', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            appendMessage(`Bot: ${data.response}`);

            // Clear the inputs after sending
            messageInput.value = '';
            fileInput.value = '';
        } catch (error) {
            console.error('Error sending message:', error);
            appendMessage('Error: Could not send message.');
        }
    }

    // Event listener for the send button
    sendButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default form submission behavior
        sendMessage();
    });

    async function sendToOpenAI(prompt) {
        const data = { prompt: prompt, bot_type: botSelect.value };

        try {
            const response = await fetch('/openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            appendMessage(`OpenAI: ${result.response}`);
        } catch (error) {
            console.error('Error querying OpenAI:', error);
            appendMessage('Error: Could not get response from OpenAI.');
        }
    }

    // Optionally, you can add a listener for the messageInput or fileInput to trigger OpenAI requests directly
});
