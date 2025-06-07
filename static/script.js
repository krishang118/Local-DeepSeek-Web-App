let currentChatId = null;
let chatTabs = {};
let chats = {};
let isScrolledToBottom = true;
let scrollTimeout = null;
let lastScrollTop = 0;
function loadChatHistory() {
    const savedChats = localStorage.getItem('chats');
    if (savedChats) {
        chats = JSON.parse(savedChats);
        Object.keys(chats).forEach(chatId => {
            addChatTab(chatId);
            if (Object.keys(chatTabs).length === 1) {
                selectChat(chatId);
            }
        });
    } else {
        chats = {}; 
    }
}
function saveChatHistory() {
    localStorage.setItem('chats', JSON.stringify(chats));
}
function isAtBottom() {
    const messagesDiv = document.getElementById('messages');
    const threshold = 10; 
    return messagesDiv.scrollTop + messagesDiv.clientHeight >= messagesDiv.scrollHeight - threshold;
}
function scrollToBottom(smooth = true) {
    const messagesDiv = document.getElementById('messages');
    if (smooth) {
        messagesDiv.scrollTo({
            top: messagesDiv.scrollHeight,
            behavior: 'smooth'
        });
    } else {
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
    isScrolledToBottom = true;
    updateScrollIndicator();
}
function updateScrollIndicator() {
    const scrollIndicator = document.getElementById('scrollIndicator');
    if (!scrollIndicator) {
        createScrollIndicator();
        return;
    }    
    if (isScrolledToBottom) {
        scrollIndicator.classList.remove('show');
    } else {
        scrollIndicator.classList.add('show');
    }
}
function createScrollIndicator() {
    const scrollIndicator = document.createElement('div');
    scrollIndicator.id = 'scrollIndicator';
    scrollIndicator.innerHTML = '↓';
    scrollIndicator.title = 'Scroll to bottom';
    scrollIndicator.onclick = () => scrollToBottom(true);
    document.body.appendChild(scrollIndicator);
}
function handleScroll() {
    const messagesDiv = document.getElementById('messages');
    const currentScrollTop = messagesDiv.scrollTop;    
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    scrollTimeout = setTimeout(() => {
        isScrolledToBottom = isAtBottom();
        updateScrollIndicator();        
        if (currentChatId && chats[currentChatId]) {
            chats[currentChatId].scrollPosition = currentScrollTop;
        }
        lastScrollTop = currentScrollTop;
    }, 100);
}
function restoreScrollPosition(chatId) {
    const messagesDiv = document.getElementById('messages');
    if (chats[chatId] && typeof chats[chatId].scrollPosition === 'number') {
        messagesDiv.scrollTop = chats[chatId].scrollPosition;
        isScrolledToBottom = isAtBottom();
    } else {
        setTimeout(() => scrollToBottom(false), 50);
    }
    updateScrollIndicator();
}
function setupScrollListeners() {
    const messagesDiv = document.getElementById('messages');
    if (messagesDiv) {
        messagesDiv.style.overflowY = 'auto';
        messagesDiv.style.overflowX = 'hidden';
        messagesDiv.style.height = 'calc(100vh - 200px)';
        messagesDiv.style.maxHeight = 'calc(100vh - 200px)';        
        messagesDiv.addEventListener('scroll', handleScroll, { passive: true });
    }
}
function createNewChat() {
    fetch('/new_chat', {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        currentChatId = data.chat_id;
        addChatTab(currentChatId);
        showChatWindow();
        document.getElementById('messageInput').focus();
        if (!chats[currentChatId]) {
            chats[currentChatId] = [];
        }
        saveChatHistory();
        setTimeout(() => {
            setupScrollListeners();
            scrollToBottom(false);
        }, 100);
    });
}
function addChatTab(chatId) {
    const chatSelector = document.getElementById('chatSelector');
    const chatTab = document.createElement('div');
    chatTab.className = 'chatTab';
    chatTab.textContent = `Chat ${Object.keys(chatTabs).length + 1}`;    
    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'deleteBtn';
    deleteBtn.textContent = '×';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();  
        deleteChat(chatId);
    };
    chatTab.appendChild(deleteBtn);    
    let lastClickTime = 0;
    let clickCount = 0;
    chatTab.addEventListener('click', (e) => {
        if (e.target === deleteBtn) return; 
        const currentTime = new Date().getTime();
        const timeDiff = currentTime - lastClickTime;
        if (timeDiff < 300) { 
            clickCount++;
            if (clickCount === 3 && Object.keys(chatTabs).length > 1) {
                chatTab.classList.add('showDelete');
                chatTab.style.backgroundColor = '#1a1a1a';
                chatTab.style.borderColor = '#ff3b30';
            }
        } else {
            clickCount = 1;  
        }
        lastClickTime = currentTime;
        if (clickCount === 1) {
            setTimeout(() => {
                if (clickCount === 1) {  
                    selectChat(chatId);
                }
            }, 300);
        }
    });    
    document.addEventListener('click', (e) => {
        if (!chatTab.contains(e.target)) {
            chatTab.classList.remove('showDelete');
            chatTab.style.backgroundColor = '';
            chatTab.style.borderColor = '';
        }
    });
    chatSelector.appendChild(chatTab);
    chatTabs[chatId] = chatTab;
    if (Object.keys(chatTabs).length === 1) {
        selectChat(chatId);
    }
}
function deleteChat(chatId) {
    if (Object.keys(chatTabs).length <= 1) return;
    const chatTab = chatTabs[chatId];
    chatTab.remove();
    delete chatTabs[chatId];    
    delete chats[chatId];
    saveChatHistory();
    reorderChats();    
    if (currentChatId === chatId) {
        const firstChatId = Object.keys(chatTabs)[0];
        selectChat(firstChatId);
    }
}
function reorderChats() {
    const chatIds = Object.keys(chatTabs);
    chatIds.forEach((chatId, index) => {
        const chatTab = chatTabs[chatId];
        chatTab.innerHTML = '';
        chatTab.textContent = `Chat ${index + 1}`;
        const deleteBtn = document.createElement('span');
        deleteBtn.className = 'deleteBtn';
        deleteBtn.textContent = '×';
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteChat(chatId);
        };
        chatTab.appendChild(deleteBtn);        
        let lastClickTime = 0;
        let clickCount = 0;
        chatTab.addEventListener('click', (e) => {
            if (e.target === deleteBtn) return;
            const currentTime = new Date().getTime();
            const timeDiff = currentTime - lastClickTime;
            if (timeDiff < 300) {
                clickCount++;
                if (clickCount === 3 && Object.keys(chatTabs).length > 1) {
                    chatTab.classList.add('showDelete');
                    chatTab.style.backgroundColor = '#1a1a1a';
                    chatTab.style.borderColor = '#ff3b30';
                }
            } else {
                clickCount = 1;
            }
            lastClickTime = currentTime;
            if (clickCount === 1) {
                setTimeout(() => {
                    if (clickCount === 1) {
                        selectChat(chatId);
                    }
                }, 300);
            }
        });
    });
}
function selectChat(chatId) {
    if (currentChatId && chats[currentChatId]) {
        const messagesDiv = document.getElementById('messages');
        if (messagesDiv) {
            chats[currentChatId].scrollPosition = messagesDiv.scrollTop;
        }
    }    
    currentChatId = chatId;
    Object.values(chatTabs).forEach(tab => {
        tab.classList.remove('active');
        tab.classList.remove('showDelete');  
    });
    chatTabs[chatId].classList.add('active');    
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';
    if (chats[chatId] && Array.isArray(chats[chatId])) {
        chats[chatId].forEach(entry => {
            if (entry.content && entry.role) {
                addMessage(entry.content, entry.role);
            }
        });
    }
    showChatWindow();    
    setTimeout(() => {
        restoreScrollPosition(chatId);
        setupScrollListeners();
    }, 100);
}
function showChatWindow() {
    document.getElementById('chatWindow').classList.remove('hidden');
}
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    if (!message || !currentChatId) return;    
    const wasAtBottom = isAtBottom();
    addMessage(message, 'user');
    input.value = '';    
    if (wasAtBottom || true) {
        scrollToBottom(true);
    }
    try {
        const response = await fetch(`/chat/${currentChatId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        });   
        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }
        const stillAtBottom = isAtBottom();        
        addMessage(data.response, 'assistant');
        if (stillAtBottom) {
            scrollToBottom(true);
        }
        if (!chats[currentChatId]) {
            chats[currentChatId] = [];
        }        
        chats[currentChatId].push({ content: message, role: 'user' });
        chats[currentChatId].push({ content: data.response, role: 'assistant' });
        saveChatHistory();
    } catch (error) {
        console.error('Error:', error);
        addMessage('Sorry, something went wrong. Please try again.', 'assistant');
        scrollToBottom(true);
    }
}
function addMessage(text, role) {
    const messagesDiv = document.getElementById('messages');    
    if (messagesDiv.style.overflowY !== 'auto') {
        messagesDiv.style.overflowY = 'auto';
        messagesDiv.style.overflowX = 'hidden';
    }
    const messageDiv = document.createElement('div');    
    const wasAtBottom = isAtBottom();
    if (role === 'assistant') {
        messageDiv.className = 'message assistant';        
        const thinkingRegex = /thinking\.\.\.(.*?)(?:done thinking\.?|\.\.\.done thinking)/is;
        const match = text.match(thinkingRegex);
        if (match) {
            const thinkingContent = match[1].trim();            
            const doneThinkingIndex = text.toLowerCase().lastIndexOf('done thinking');
            let responseContent = '';
            if (doneThinkingIndex !== -1) {
                const afterDoneThinking = text.substring(doneThinkingIndex);
                const responseMatch = afterDoneThinking.match(/done thinking\.?\s*(.*)/is);
                if (responseMatch) {
                    responseContent = responseMatch[1].trim();
                }
            }            
            if (thinkingContent) {
                const thinkingDiv = document.createElement('div');
                thinkingDiv.className = 'thinking';
                thinkingDiv.textContent = thinkingContent;
                messageDiv.appendChild(thinkingDiv);
            }            
            if (responseContent) {
                const responseDiv = document.createElement('div');
                responseDiv.className = 'response';
                responseDiv.textContent = responseContent;
                messageDiv.appendChild(responseDiv);
            } else {
                const responseDiv = document.createElement('div');
                responseDiv.className = 'response';
                responseDiv.textContent = 'Response completed.';
                messageDiv.appendChild(responseDiv);
            }
        } else {
            const responseDiv = document.createElement('div');
            responseDiv.className = 'response';
            responseDiv.textContent = text.trim();
            messageDiv.appendChild(responseDiv);
        }
    } else {
        messageDiv.className = `message ${role}`;
        messageDiv.textContent = text;
    }
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    isScrolledToBottom = true;
    updateScrollIndicator();
}
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT') return;        
        const messagesDiv = document.getElementById('messages');
        switch(e.key) {
            case 'End':
                e.preventDefault();
                scrollToBottom(true);
                break;
            case 'Home':
                e.preventDefault();
                messagesDiv.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                break;
            case 'PageUp':
                e.preventDefault();
                messagesDiv.scrollBy({
                    top: -messagesDiv.clientHeight * 0.8,
                    behavior: 'smooth'
                });
                break;
            case 'PageDown':
                e.preventDefault();
                messagesDiv.scrollBy({
                    top: messagesDiv.clientHeight * 0.8,
                    behavior: 'smooth'
                });
                break;
        }
    });
}
document.getElementById('newChatBtn').onclick = createNewChat;
document.getElementById('inputForm').onsubmit = (e) => {
    e.preventDefault();
    sendMessage();
    return false;
};
document.addEventListener('DOMContentLoaded', () => {
    loadChatHistory();
    if (Object.keys(chatTabs).length === 0) {
        createNewChat();
    }
    if (!currentChatId && Object.keys(chatTabs).length > 0) {
        const firstChatId = Object.keys(chatTabs)[0];
        selectChat(firstChatId);
    }
    setTimeout(() => {
        createScrollIndicator();
        setupScrollListeners();
        setupKeyboardShortcuts();
        updateScrollIndicator();
        const messagesDiv = document.getElementById('messages');
        if (messagesDiv) {
            messagesDiv.style.overflowY = 'scroll';
            messagesDiv.style.overflowX = 'hidden';
            messagesDiv.style.height = 'calc(100vh - 200px)';
            messagesDiv.style.maxHeight = 'calc(100vh - 200px)';
        }
    }, 100);
});