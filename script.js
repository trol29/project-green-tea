localStorage.clear(); // Clear local storage

// Function to handle login
function login() {
    const enteredUsername = document.getElementById('username').value;
    if (enteredUsername) {
        localStorage.setItem('username', enteredUsername);
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('chat-page').style.display = 'flex';
    } else {
        alert('Please enter a username');
    }
}

// Function to send message
function sendMessage() {
    const messageInput = document.getElementById('message');
    const message = messageInput.value.trim();
    if (message) {
        const msg = {
            username: localStorage.getItem('username'),
            text: message
        };
        socket.emit('chat message', msg);  // Emit the message to the server
        messageInput.value = '';
    }
}

// Function to edit message
function editMessage(messageElement) {
    const messageText = messageElement.querySelector('.message-text').innerText;
    const newMessage = prompt('Edit your message:', messageText);
    if (newMessage !== null) {
        messageElement.querySelector('.message-text').innerText = newMessage + ' (edited)';
    }
}

// Function to delete message
function deleteMessage(messageElement) {
    messageElement.remove();
}

// Function to open settings
function openSettings() {
    document.getElementById('chat-page').style.display = 'none';
    document.getElementById('settings-page').style.display = 'flex';
}

// Function to go back to the chat from settings
function goBack() {
    document.getElementById('settings-page').style.display = 'none';
    document.getElementById('chat-page').style.display = 'flex';
}

// Function to toggle dark mode
function toggleDarkMode() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// Initialize dark mode based on the stored preference
document.addEventListener('DOMContentLoaded', () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark-mode', darkMode);
    document.getElementById('dark-mode-toggle').checked = darkMode;
});

// Add event listeners
document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('message').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default form submission
        sendMessage();
    }
});

socket.on('chat message', (msg) => {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.innerHTML = `
        <span class="username">${msg.username}:</span>
        <span class="message-text">${msg.text}</span>
        <button class="three-dots" onclick="toggleOptions(this)">...</button>
        <div class="options">
            <button class="edit" onclick="editMessage(this.parentElement.parentElement)">Edit</button>
            <button class="delete" onclick="deleteMessage(this.parentElement.parentElement)">Delete</button>
        </div>
    `;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
});

function toggleOptions(button) {
    const options = button.nextElementSibling;
    options.style.display = options.style.display === 'block' ? 'none' : 'block';
}

// Display chat page if username is already stored
window.onload = function () {
    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('chat-page').style.display = 'flex';
    } else {
        document.getElementById('login-page').style.display = 'flex';
        document.getElementById('chat-page').style.display = 'none';
    }
}

