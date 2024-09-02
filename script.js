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
        const chatBox = document.getElementById('chat-box');
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.innerHTML = `<span class="username">${localStorage.getItem('username')}:</span> <span class="message-text">${message}</span>`;
        messageElement.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            editMessage(messageElement);
        });
        chatBox.appendChild(messageElement);
        messageInput.value = '';
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll to the bottom
    }
}

// Function to edit message
function editMessage(messageElement) {
    const messageText = messageElement.querySelector('.message-text').innerText;
    const newMessage = prompt('Edit your message:', messageText);
    if (newMessage !== null) {
        messageElement.querySelector('.message-text').innerText = newMessage;
    }
}

// Event listeners
document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('message').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevents the default form submission
        sendMessage();
    }
});

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

// Function to open settings
function openSettings() {
    window.location.href = 'settings.html';
}

// Function to toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Save dark mode preference
document.body.classList.toggle('dark-mode', localStorage.getItem('darkMode') === 'true');
document.body.classList.toggle('light-mode', localStorage.getItem('darkMode') !== 'true');
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('dark-mode-toggle').checked = localStorage.getItem('darkMode') === 'true';
});

document.getElementById('dark-mode-toggle').addEventListener('change', function() {
    const isDarkMode = this.checked;
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
});
const socket = io();

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

function sendMessage() {
    const messageInput = document.getElementById('message');
    const message = messageInput.value.trim();
    if (message) {
        const msg = {
            username: localStorage.getItem('username'),
            text: message
        };
        socket.emit('chat message', msg);
        messageInput.value = '';
    }
}

function editMessage(messageElement) {
    const messageText = messageElement.querySelector('.message-text').innerText;
    const newMessage = prompt('Edit your message:', messageText);
    if (newMessage !== null) {
        messageElement.querySelector('.message-text').innerText = newMessage + ' (edited)';
    }
}

function deleteMessage(messageElement) {
    messageElement.remove();
}

function leaveRoom() {
    localStorage.removeItem('username');
    document.getElementById('login-page').style.display = 'flex';
    document.getElementById('chat-page').style.display = 'none';
}

function openSettings() {
    document.getElementById('chat-page').style.display = 'none';
    document.getElementById('settings-page').style.display = 'flex';
}

function goBack() {
    document.getElementById('settings-page').style.display = 'none';
    document.getElementById('chat-page').style.display = 'flex';
}

document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById('message').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
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
