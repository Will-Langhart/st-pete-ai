function toggleMenu() {
            var menu = document.querySelector('.vertical-menu');
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        }
      
       document.addEventListener('DOMContentLoaded', function() {
        const sendButton = document.querySelector('.chat-send-btn');
        const messageInput = document.querySelector('.chat-input');
        const fileInput = document.querySelector('.chat-upload-btn');
        const modelSelect = document.getElementById('modelSelect');
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
        // Function to handle sending messages
        async function sendMessage() {
            const message = messageInput.value.trim();
            const model = modelSelect.value;

            if (!message) return; // Don't send empty messages

            // Append the user's message to the chat
            appendMessage('user', message);

            // Assuming '/process_interaction' is your API endpoint for handling messages
            const formData = new FormData();
            formData.append('message', message);
            formData.append('model', model);

            // If there's a file selected, append it to the formData
            if (fileInput.files.length > 0) {
                formData.append('file', fileInput.files[0]);
            }

            // Send the message and model selection to your server
            try {
                const response = await fetch('/process_interaction', {
                    method: 'POST',
                    body: formData,
                });
                const data = await response.json();
                
                // Append the AI's response to the chat
                appendMessage('bot', data.response);
            } catch (error) {
                console.error('Error sending message:', error);
                appendMessage('bot', 'Error: Could not send message.');
            }

            // Reset input fields after sending
            messageInput.value = '';
            fileInput.value = null;
        }

        // Event listener for the send button
        sendButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent form submission
            sendMessage();
        });

        // Optionally, handle Enter key to send message
        messageInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                sendMessage();
            }
        });
    });


